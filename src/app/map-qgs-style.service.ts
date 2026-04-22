import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { Subscription } from "rxjs";
import { Fill, Stroke, Style, Icon } from "ol/style";
import Feature from "ol/Feature";

import { OpenLayersService } from "./open-layers.service";
import { ProjectConfiguration } from "./config/project-config";
import { AppconfigService } from "./config/appconfig.service";
import { CustomSketchLayerService } from "./config/custom-sketch-layer-service";
import { AppConstants } from "./app-constants";

export interface LegendSymbol {
	iconSrc: string;
	title: string;
  id: string;
}

export interface WFSLayerStyle {
	styleFunc: (feature: Feature, resolution: number) => Style | Style[];
	symbols: LegendSymbol[];
	legendUrl?: string;
	isSketch: SketchType;
}

export type SketchType = "NONE" | "SKETCH" | "CUSTOM_SKETCH";

@Injectable({
	providedIn: "root",
})
export class MapQgsStyleService {
	public layerStyles: Record<string, WFSLayerStyle> = {};
	public readonly iconHeightPxl = 38;

	private readonly projectSelectedSubscription: Subscription;
	private loadedProject?: ProjectConfiguration;

	public readonly sketchStyleAttr = "style";
	public readonly customSketchStyleAttr = "category";

	constructor(
		private openlayersService: OpenLayersService,
		private customSketchLayerService: CustomSketchLayerService,
		private config: AppconfigService,
	) {
		this.projectSelectedSubscription =
			this.openlayersService.qgsProjectUrl$.subscribe(
				(projectConfig) => {
					this.loadedProject = projectConfig;
				},
				(error) => console.error("Error on project selection", error),
			);
	}

	/**
	 * Initializes the styles and legends for a list of WFS layers asynchronously
	 * using the QGIS Server GetLegendGraphic JSON response.
	 */
	public async createAllLayerStyles(
		qGsServerUrl: string,
		qgsProjectFile: string,
		layerList: string[],
	): Promise<void> {
		const wmsVersion = this.config.getAppConfig().wmsVersion;

		for (const layerName of layerList) {
			if (this.loadedProject?.hiddenLayers?.includes(layerName)) {
				continue;
			}

			// Generate the WMS URLs for this specific layer
			const legendJsonUrl = `${qGsServerUrl}SERVICE=WMS&VERSION=${wmsVersion}&REQUEST=GetLegendGraphic&FORMAT=application/json&map=${qgsProjectFile}&LAYER=${layerName}`;
			const legendImageUrl = `${qGsServerUrl}SERVICE=WMS&VERSION=${wmsVersion}&REQUEST=GetLegendGraphic&FORMAT=image/png&TRANSPARENT=true&map=${qgsProjectFile}&LAYER=${layerName}`;

			let parsedSymbols: LegendSymbol[] = [];

			// 1. Fetch the JSON Legend to extract base64 symbols for the UI and the Map
			try {
				const jsonResponse = await fetch(legendJsonUrl);
				if (jsonResponse.ok) {
					const legendData = await jsonResponse.json();

					// QGIS JSON structure wraps symbols in 'nodes'
					const targetNode =
						legendData.nodes?.find((n: any) => n.title === layerName) ||
						legendData.nodes?.[0];

					if (targetNode) {
						// Scenario A: Categorized / Rule-based (Has a 'symbols' array)
						if (targetNode.symbols && targetNode.symbols.length > 0) {
							parsedSymbols = targetNode.symbols.map((sym: any) => ({
								title: sym.title,
								iconSrc: `data:image/png;base64,${sym.icon}`,
							}));
						}
						// Scenario B: Single Symbol (Icon is directly on the node)
						else if (targetNode.icon) {
							parsedSymbols = [
								{
									title: targetNode.title || "default",
                  id: targetNode.title || "default",
									iconSrc: `data:image/png;base64,${targetNode.icon}`,								},
							];
						}
					}
				}
			} catch (jsonErr) {
				console.error(`Failed to fetch JSON legend for ${layerName}`, jsonErr);
			}

			//create the OpenLayers style function based on the parsed symbols
			const olStyleFunction = (feature: Feature) => {
				// Safety check: if no symbols loaded, return sketch style as fallback
				if (parsedSymbols.length === 0) {
					return this.defineSketchStyle();
				}

				// Get the category from the feature properties and convert to lowercase safely
				const rawCategoryValue = feature.get(AppConstants.wfsLAyerStyleAttr);
				const searchCategory = rawCategoryValue
					? String(rawCategoryValue).toLowerCase()
					: "";

				// Find the matching symbol based on case-insensitive title, OR fallback to the first symbol
				const matchedSymbol =
					parsedSymbols.find((sym) => {
						const safeTitle = sym.title ? String(sym.title).toLowerCase() : "";
						return safeTitle === searchCategory;
					}) || parsedSymbols[0];

				// Return the native OpenLayers style using the JSON base64 string
				return new Style({
					image: new Icon({
						src: matchedSymbol.iconSrc,
						crossOrigin: "anonymous",
					}),
				});
			};

			// Cache the style object
			this.layerStyles[layerName] = {
				styleFunc: olStyleFunction,
				symbols: parsedSymbols,
				legendUrl: legendImageUrl,
				isSketch: "NONE",
			};
		}
	}

	public getLayerStyleConfig(layerName: string): WFSLayerStyle {
		if (this.layerStyles[layerName]) {
			return this.layerStyles[layerName];
		}
		return this.setSketchStyle(layerName);
	}

	public setSketchStyle(layerName: string): WFSLayerStyle {
		const isCustomSketchLayer =
			this.customSketchLayerService.isCustomSketchLayer(layerName);
		let symbols: LegendSymbol[] = [];
		let styleDict: Record<string, Style> = {};

		if (isCustomSketchLayer) {
			const layerDef =
				this.customSketchLayerService.getConfigByLayerName(layerName)!;
			layerDef.categories.forEach((category) => {
				styleDict[this.normalizeString(category.id)] = this.defineCustomSketchStyle(
					category.icon,
				);
				symbols.push({ title: category.label, iconSrc: category.icon, id: category.id });
			});
		} else {
			const defaultColors = [
				{ name: "red", hex: "#FF0000" },
				{ name: "blue", hex: "#0000FF" },
				{ name: "pink", hex: "#FF00FF" },
				{ name: "green", hex: "#00FF00" },
				{ name: "yellow", hex: "#FFFF00" },
			];

			defaultColors.forEach((color) => {
				const style = this.defineSketchStyle(color.hex);
				styleDict[color.name] = style;

				const iconStyle = style.getImage() as Icon;
				const imgSrc = iconStyle.getSrc();
				symbols.push({ title: color.name, iconSrc: imgSrc, id: color.name });
			});
		}

		const attr = isCustomSketchLayer
			? AppConstants.customSketchStyleAttr
			: AppConstants.sketchStyleAttr;
		const sketchStyleFunc = (feature: Feature) => {
			const value = this.normalizeString(feature.get(attr));
      const style = styleDict[value];
			return style || this.defineSketchStyle();
		};

		this.layerStyles[layerName] = {
			styleFunc: sketchStyleFunc,
			symbols: symbols,
			legendUrl: undefined,
			isSketch: isCustomSketchLayer ? "CUSTOM_SKETCH" : "SKETCH",
		};

		return this.layerStyles[layerName];
	}

	private defineSketchStyle(colorHex: string = "#FFA500"): Style {
		const newIcon = new Icon({
			opacity: 1,
			crossOrigin: "anonymous",
			src: this.getColoredSvgBase64(colorHex),
			scale: 1.4,
		});

		const style = new Style({
			stroke: new Stroke({ color: colorHex, width: 5 }),
			fill: new Fill({ color: colorHex + "40" }),
			image: newIcon,
		});

		this.addIconScaler(newIcon);
		newIcon.load();
		return style;
	}

	private defineCustomSketchStyle(iconURL: string): Style {
		const newIcon = new Icon({
			opacity: 1,
			crossOrigin: "anonymous",
			src: iconURL,
		});

		const style = new Style({ image: newIcon });
		this.addIconScaler(newIcon);
		newIcon.load();
		return style;
	}

	private addIconScaler(icon: Icon) {
		const pixelRatio = window.devicePixelRatio || 1;
		const imgElement = icon.getImage(pixelRatio) as HTMLImageElement;

		if (imgElement) {
			imgElement.onload = () => {
				const originalWidth = imgElement.naturalWidth;
				if (originalWidth > 0) {
					icon.setScale(this.iconHeightPxl / originalWidth);
				}
			};
		}
	}

  //re-colors the default svg marker
	private getColoredSvgBase64(colorHex: string): string {
		try {
			// 1. Safely strip the "data:..." prefix if it exists in your Constant
			const rawBase64 = AppConstants.svgMarkerColor.includes(",")
				? AppConstants.svgMarkerColor.split(",")[1]
				: AppConstants.svgMarkerColor;

			// 2. Decode the raw base64 SVG string
			const decodedSvg = window.atob(rawBase64);

			// 3. Swap the hardcoded default pink (#dd1c77) with the new hex color
			const coloredSvg = decodedSvg.replace(/#dd1c77/gi, colorHex);

			// 4. Re-encode to base64 and safely attach the prefix for the HTML <img> tag
			return "data:image/svg+xml;base64," + window.btoa(coloredSvg);
		} catch (e) {
			console.warn("Could not recolor SVG", e);
			// If it fails, return the original Constant so the image isn't completely broken
			return AppConstants.svgMarkerColor;
		}
	}

  //use for keys in style dict
  private normalizeString(val: any): string {
    if (!val) return '';
    return String(val)
      .trim()
      .toLowerCase()
      .replace(/['"]/g, ''); // Instantly strips any literal single or double quotes
  }
}
