import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import Layer from "ol/layer/Layer.js";
import { createKoboToolboxLayers, CreateKoboToolboxLayersParams } from "./kobotoolbox-layers";
import { KoboToolboxLayer } from "../../config/project-config";
import { LayerStyleService } from "src/app/layer-styles.service";

/**
 * Manages the KoboToolbox layers for the currently selected OGITO project
 */
@Injectable({
	providedIn: "root",
})
export class KoboToolboxLayersService {
	private koboToolboxLayerConfigs: Map<string, KoboToolboxLayer> = new Map();

	constructor(private http: HttpClient) {}

	/**
	 * Clears the tracked KoboToolbox layer configs - call when the selected
	 * project changes.
	 */
	public clear(): void {
		this.koboToolboxLayerConfigs.clear();
	}

	/**
	 * Creates and registers the current project's KoboToolbox layers 
	 */
	public loadLayers(
		params: CreateKoboToolboxLayersParams,
		styleService: LayerStyleService,
	): void {
		const koboLayers = params.loadedProject.kobotoolbox_layer ?? [];
		koboLayers.forEach((config) => this.koboToolboxLayerConfigs.set(config.name, config));

		createKoboToolboxLayers(params, this.http, styleService);
	}

	
	public getConfigByLayerName(layerName: string): KoboToolboxLayer | undefined {
		return this.koboToolboxLayerConfigs.get(layerName);
	}

	/**
	 * True if `layer` is one of the current project's KoboToolbox layers
	 * Takes ol layer instance or layer name
	 */
	public isKoboToolboxLayer(layer: Layer | null | undefined | string): boolean {
		const layerName = (typeof layer !== "string") ? layer?.get("name") : layer;

		return typeof layerName === "string" && this.koboToolboxLayerConfigs.has(layerName);
	}


}
