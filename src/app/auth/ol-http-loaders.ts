import { HttpClient } from "@angular/common/http";
import Feature from "ol/Feature";
import ImageWrapper from "ol/Image";
import ImageTile from "ol/ImageTile";
import TileState from "ol/TileState";
import VectorSource from "ol/source/Vector";
import { FeatureLoader } from "ol/featureloader";

/**
 * Tile/image/feature loaders for OpenLayers WMS/WFS sources that fetch through Angular's
 * HttpClient instead of a bare `src` URL, so the BackendAuthInterceptor automatically attaches the access token to the request.
 */

export function createAuthenticatedTileLoadFunction(
	http: HttpClient,
): (tile: ImageTile, src: string) => void {
	return (tile, src) => {
		const img = tile.getImage() as HTMLImageElement;
		http.get(src, { responseType: "blob" }).subscribe({
			next: (blob) => {
				const objectUrl = URL.createObjectURL(blob);
				img.addEventListener("load", () => URL.revokeObjectURL(objectUrl), {
					once: true,
				});
				img.src = objectUrl;
			},
			error: () => tile.setState(TileState.ERROR),
		});
	};
}

export function createAuthenticatedImageLoadFunction(
	http: HttpClient,
): (image: ImageWrapper, src: string) => void {
	return (image, src) => {
		const img = image.getImage() as HTMLImageElement;
		http.get(src, { responseType: "blob" }).subscribe({
			next: (blob) => {
				const objectUrl = URL.createObjectURL(blob);
				img.addEventListener("load", () => URL.revokeObjectURL(objectUrl), {
					once: true,
				});
				img.src = objectUrl;
			},
			error: () => console.error("Error loading WMS image", src),
		});
	};
}

export function createAuthenticatedWfsLoader(
	http: HttpClient,
	vectorSource: VectorSource,
	url: string,
): FeatureLoader {
	return (extent, resolution, projection, success, failure) => {
		http.get(url, { responseType: "text" }).subscribe({
			next: (text) => {
				const features = vectorSource.getFormat().readFeatures(text) as Feature[];
				vectorSource.addFeatures(features);
				success(features as Feature[]);
			},
			error: () => failure(),
		});
	};
}
