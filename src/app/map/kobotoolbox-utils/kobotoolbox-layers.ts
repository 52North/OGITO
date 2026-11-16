import { HttpClient } from "@angular/common/http";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Layer from "ol/layer/Layer.js";
import { GeoJSON } from "ol/format";
import { createAuthenticatedWfsLoader } from "../../auth/ol-http-loaders";
import { ProjectConfiguration, KoboToolboxLayer } from "../../config/project-config";
import type { GroupLayerInfo } from "../map.component";
import { LayerStyleService } from "src/app/layer-styles.service";

export interface CreateKoboToolboxLayersParams {
	loadedProject: ProjectConfiguration;
	qGsServerUrl: string;
	qgsProjectFile: string;
	srsID: string;
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
	params: CreateKoboToolboxLayersParams, http: HttpClient, styleService: LayerStyleService
): VectorLayer<VectorSource>[] {
	const {
		loadedProject,
		qGsServerUrl,
		qgsProjectFile,
		srsID,
		groupsLayers,
		addOWSLayerToLayerPanel,
	} = params;

	const koboLayers: KoboToolboxLayer[] = loadedProject.kobotoolbox_layer;
	if (!koboLayers || koboLayers.length === 0) {
		return [];
	}

	const createdLayers: VectorLayer<VectorSource>[] = [];

	koboLayers.forEach((koboLayerConfig) => {
		const layerName = koboLayerConfig.name;
		const groupName = koboLayerConfig.group;
		const visible = loadedProject.defaultVisibleLayers?.includes(layerName) || false;
		const styleConfig = styleService.getOrCreateLayerStyleConfig(layerName, "KOBO_TOOLBOX");

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
			geometryType: undefined,
			onEdit: false,
			onIdentify: false,
			onRanking: false,
			visible,
			layerForNewFeatures: false,
			layerForRanking: false,
			fields: [],
			removable: false,
			vectorLayerType: "KOBO_TOOLBOX",
			isQueryable: true,
			legendLayer: styleConfig.symbols,
		});

		//requires &map parameter for authorization
		const koboUrl =
			qGsServerUrl +
			"service=KOBOTOOLBOX&map=" +
			encodeURIComponent(qgsProjectFile) +
			"&asset=" +
			encodeURIComponent(koboLayerConfig.asset) +
			"&full_labels=true";

		const vectorSource = new VectorSource({
			format: new GeoJSON({
				dataProjection: "EPSG:4326",
				featureProjection: srsID,
			}),
		});
		vectorSource.setLoader(createAuthenticatedWfsLoader(http, vectorSource, koboUrl));

		const koboVectorLayer = new VectorLayer<VectorSource>({
			source: vectorSource,
			visible,
			style: styleConfig.styleFunc
			    
		});
		koboVectorLayer.set("name", layerName);

		addOWSLayerToLayerPanel(layerName, koboVectorLayer);
		createdLayers.push(koboVectorLayer);
	});

	return createdLayers;
}
