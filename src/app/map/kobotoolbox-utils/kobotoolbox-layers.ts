import { HttpClient } from "@angular/common/http";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Layer from "ol/layer/Layer.js";
import { Fill, Stroke, Style } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { GeoJSON } from "ol/format";
import { createAuthenticatedWfsLoader } from "../../auth/ol-http-loaders";
import { ProjectConfiguration, KoboToolboxLayer } from "../../config/project-config";
import type { GroupLayerInfo } from "../map.component";

const KOBO_MARKER_COLOR = "#2E8B57";

function buildKoboLegendIconSrc(): string {
	return (
		"data:image/svg+xml;base64," +
		btoa(
			`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><circle cx="12" cy="12" r="8" fill="${KOBO_MARKER_COLOR}" stroke="#000000" stroke-width="1.5"/></svg>`,
		)
	);
}

function buildKoboPointStyle(): Style {
	return new Style({
		image: new CircleStyle({
			radius: 8,
			fill: new Fill({ color: KOBO_MARKER_COLOR }),
			stroke: new Stroke({ color: "#000000", width: 1.5 }),
		}),
	});
}

export interface CreateKoboToolboxLayersParams {
	loadedProject: ProjectConfiguration;
	qGsServerUrl: string;
	qgsProjectFile: string;
	srsID: string;
	http: HttpClient;
	groupsLayers: GroupLayerInfo[];
	addOWSLayerToLayerPanel: (layerName: string, olWebServiceLayer: Layer) => void;
}

/**
 * Creates one OpenLayers vector layer per KoboToolbox layer configured on
 * the current project (ProjectConfiguration.kobotoolbox_layer), backed by
 * the QGIS Server KOBOTOOLBOX service plugin, and registers each one in the
 * layer panel under its configured group - mutates `groupsLayers` and calls
 * `addOWSLayerToLayerPanel` for each one, same as map.component.ts's other
 * layer-loading methods (e.g. addDefaultBackgroundLayer()).
 *
 * Returns the created OL layers so the caller can track them (e.g. to route
 * feature-info clicks to displayFeatureInfoKoboToolbox()).
 */
export function createKoboToolboxLayers(
	params: CreateKoboToolboxLayersParams,
): VectorLayer<VectorSource>[] {
	const {
		loadedProject,
		qGsServerUrl,
		qgsProjectFile,
		srsID,
		http,
		groupsLayers,
		addOWSLayerToLayerPanel,
	} = params;

	const koboLayers: KoboToolboxLayer[] = loadedProject.kobotoolbox_layer;
	if (!koboLayers || koboLayers.length === 0) {
		return [];
	}

	// a non-empty legendLayer/legendUrl is required - the layer panel
	// disables a layer's whole expansion header (including its visibility
	// checkbox) when both are empty, see layer-panel.component.html.
	const koboLegendIconSrc = buildKoboLegendIconSrc();
	const koboPointStyle = buildKoboPointStyle();

	const createdLayers: VectorLayer<VectorSource>[] = [];

	koboLayers.forEach((koboLayerConfig) => {
		const layerName = koboLayerConfig.name;
		const groupName = koboLayerConfig.group;
		const visible = loadedProject.defaultVisibleLayers?.includes(layerName) || false;

		// register the layer in the data model first - addOWSLayerToLayerPanel()
		// only attaches the OL layer to a group that already has a matching
		// LayerInfo entry
		let groupLayerInfo = groupsLayers.find(
			(g) => g.groupName.toLowerCase() === groupName.toLowerCase(),
		);
		if (!groupLayerInfo) {
			groupLayerInfo = {
				groupName,
				groupTitle: groupName,
				visible,
				layers: [],
			};
			groupsLayers.push(groupLayerInfo);
		}
		groupLayerInfo.layers.push({
			layerName,
			layerTitle: layerName,
			wfs: false,
			geometryType: undefined,
			onEdit: false,
			onIdentify: false,
			onRanking: false,
			visible,
			layerForNewFeatures: false,
			layerForRanking: false,
			fields: [],
			removable: false,
			sketch: "NONE",
			isQueryable: true,
			legendLayer: [{ id: layerName, title: layerName, iconSrc: koboLegendIconSrc }],
		});

		// &SERVICE=KOBOTOOLBOX&map=<qgs project path>&asset=<asset> on the QGIS
		// Server endpoint - qgisServerUrl already ends in "?". &map is required
		// by kobotoolbox_service.py, which validates it against projects.json
		// the same way a "normal" QGIS Server request would use it.
		const koboUrl =
			qGsServerUrl +
			"service=KOBOTOOLBOX&map=" +
			encodeURIComponent(qgsProjectFile) +
			"&asset=" +
			encodeURIComponent(koboLayerConfig.asset);

		const vectorSource = new VectorSource({
			format: new GeoJSON({
				dataProjection: "EPSG:4326",
				featureProjection: srsID,
			}),
		});
		// createAuthenticatedWfsLoader() is really just a generic "fetch the
		// whole URL as text through HttpClient and parse it with the source's
		// own format" loader - reused here for GeoJSON too.
		vectorSource.setLoader(createAuthenticatedWfsLoader(http, vectorSource, koboUrl));

		const koboVectorLayer = new VectorLayer<VectorSource>({
			source: vectorSource,
			visible,
			style: koboPointStyle,
		});
		koboVectorLayer.set("name", layerName);

		addOWSLayerToLayerPanel(layerName, koboVectorLayer);
		createdLayers.push(koboVectorLayer);
	});

	return createdLayers;
}
