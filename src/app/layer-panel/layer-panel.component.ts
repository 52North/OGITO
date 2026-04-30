import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Output,
	EventEmitter,
} from "@angular/core";
import { Observable, of as observableOf, Subscription } from "rxjs";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { OpenLayersService } from "../open-layers.service";

import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { QuestionBase } from "../dynamic-form-questions/question-base";
import { AppConstants } from "../app-constants";
import { ProjectConfiguration } from "../config/project-config";
import { MatLegacyOptionSelectionChange as MatOptionSelectionChange } from "@angular/material/legacy-core";
import { MatLegacySelectionListChange as MatSelectionListChange } from "@angular/material/legacy-list";
import { GroupLayerInfo, LayerInfo } from "../map/map.component";

@Component({
	selector: "app-layer-panel",
	templateUrl: "./layer-panel.component.html",
	styleUrls: ["./layer-panel.component.scss", "../map/map.component.scss"], // to access the .map css selector
})
export class LayerPanelComponent implements OnInit, OnDestroy {
	// @Input() editLayers: Array<any>;
	@Input() groupLayers: Observable<GroupLayerInfo[]>;
	private groupLayersSubscription: Subscription;
	private showEditToolsSubscription: Subscription;
	private projectSelectedSubscription: Subscription;
	private loadedProject: ProjectConfiguration;
	public currentGroupLayers: GroupLayerInfo[] = [];
	@Output() layerVisClick = new EventEmitter<LayerPanelLayerEvent>(); // emit an event when a layer is clicked in the list
	@Output() groupLayerVisClick = new EventEmitter<LayerPanelGroupEvent>(); // emit an event when a layer is clicked in the list
	@Output() editLayerClick = new EventEmitter<LayerPanelLayerEvent | null>(); // emit an event when the edit button of a layer is clicked
	@Output() layersOrder = new EventEmitter<LayerPanelGroupsEvent>(); // emit an event when layers were reordered (drop)
	@Output() identifyLayerClick = new EventEmitter<LayerPanelLayerEvent>(); // emit the layer to start identifying
	@Output() removeLayerClick = new EventEmitter<LayerPanelLayerEvent>();
	x = 40;
	y = 80;
	startX = 0;
	startY = 0;
	selectedOptions = [];
	layerActive: string | null = null;
	baseLayers = []; // WMS layers as background; layers; too ?
	showLayerPanel$: Observable<boolean>;
	selectedLayersOptions$: Observable<any>; // to keep the status of the layers in the layer panel

	constructor(
		iconRegistry: MatIconRegistry,
		sanitizer: DomSanitizer,
		private openLayersService: OpenLayersService,
	) {}

	dropExpansion(event: CdkDragDrop<string[]>) {
		moveItemInArray(
			this.currentGroupLayers,
			event.previousIndex,
			event.currentIndex,
		);
		this.layersOrder.emit({ groups: this.currentGroupLayers });
		console.log("event layersOrder emmited", this.currentGroupLayers);
	}

	ngOnInit(): void {
		this.layerActive = null;
		this.showLayerPanel$ = observableOf(true);

		this.showEditToolsSubscription =
			this.openLayersService.showEditLayerPanel$.subscribe(
				(data) => {
					this.showLayerPanel$ = observableOf(data);
				},
				(error) => console.log("error showing layer panel"),
			);

		this.groupLayersSubscription = this.groupLayers.subscribe(
			(data) => {
				this.currentGroupLayers = data;
			},
			(error) => console.log("Error in subscription to groupLayers", error),
		);
		this.projectSelectedSubscription =
			this.openLayersService.qgsProjectUrl$.subscribe(
				(projectConfig) => {
					this.loadedProject = projectConfig;
				},
				(error) => console.error("error on project selection", error),
			);
	}

	updateIdentifyActionInLayers(layerName: string) {
		/**
		 * updates the status of the action @action in  layerName
		 * @param layerName: layerName for exception
		 * #TODO declarar layer as a class and use setters and getters
		 */
		for (const group of this.currentGroupLayers) {
			group.layers.forEach((layer) => {
				if (
					layer.layerName.toLowerCase() === layerName.toLowerCase() &&
					layer.onIdentify
				) {
					layer.onIdentify = false;
					this.identifyLayerClick.emit(null);
				}
			});
		}
	}
	updateEditActionInLayers(layerName: string) {
		/**
		 * updates the status of the action  in layerName
		 * @param layerName: layerName for exception
		 */
		for (const group of this.currentGroupLayers) {
			group.layers.forEach((layer) => {
				if (layer.wfs || layer.sketch) {
					if (
						layer.layerName.toLowerCase() === layerName.toLowerCase() &&
						layer.onEdit
					) {
						layer.onEdit = false;
					}
				}
			});
		}
	}

	onEditLayerClick($event: any, layer: LayerInfo, group: GroupLayerInfo) {
		/** allows to start editing a particular layer in the layer panel
		 * @param $event for the future, doing nothing with it so far.
		 * @param layer: layer that was clicked on to start/stop editing
		 */
		$event.preventDefault();
		$event.stopImmediatePropagation();

		this.editLayerClick.emit(null);

		// not layer active
		if (this.layerActive === null) {
			// set the clicked layer as active
			this.layerActive = layer.layerName;
			// update the onEdit layer property
			layer.onEdit = true;
			// show the editing toolbar
			this.openLayersService.updateShowEditToolbar(true);
			// emit the event
			this.editLayerClick.emit({ layer, group });
		}
		// there is an active layer and its the same than the selected layer
		else if (this.layerActive === layer.layerName) {
			// layer active was in editing
			if (layer.onEdit) {
				this.layerActive = null;
				// stop editing
				layer.onEdit = false;
				this.openLayersService.updateShowEditToolbar(false);
				this.openLayersService.raiseSymbolPanelClosed(true);
				this.editLayerClick.emit(null);
			} else {
				// layer was in identifying // stop this action
				layer.onIdentify = false;
				layer.onEdit = true;
				this.openLayersService.updateShowEditToolbar(true);
				this.identifyLayerClick.emit(null);
				this.editLayerClick.emit({ layer, group });
			}
		}
		// there is an active layer and its not the same than the selected layer
		else {
			this.updateEditActionInLayers(this.layerActive); // code was changed to update only one layer, the previous one
			this.updateIdentifyActionInLayers(this.layerActive);
			this.layerActive = layer.layerName;
			layer.onEdit = true;
			//close and re-open edit toolbar to ensure correct settings (questions, symbols ...)
			this.openLayersService.updateShowEditToolbar(false);
			this.openLayersService.raiseSymbolPanelClosed(true);
			this.openLayersService.updateShowEditToolbar(true);
			this.editLayerClick.emit({ layer, group });
		}

    //automatically show layer if edit selected
    if(layer.onEdit && !layer.visible){
      layer.visible = true;
      this.onLayerVisClick($event, layer, group);
    }

	}

	onRemoveLayerClick($event: any, layer: LayerInfo, group: GroupLayerInfo) {
		$event.preventDefault();
		$event.stopImmediatePropagation();
		this.removeLayerClick.emit({ layer, group });
	}

	/** enables identifies features in a layer
	 * @param $event for the future, doing nothing with it so far.
	 * @param item: item (layer) that was clicked on to change opacity
	 */
	onIdentifyLayerClick($event: any, layer: LayerInfo, group: GroupLayerInfo) {
		$event.preventDefault();
		$event.stopImmediatePropagation();
		// there is not layerActive
		if (this.layerActive === null) {
			this.layerActive = layer.layerName;
			layer.onIdentify = true;
			console.log("{layer, group} in onIdentifyLayerClick", layer, group);
			this.identifyLayerClick.emit({ layer, group });
		}
		// there is layer Active and its the same
		else if (this.layerActive === layer.layerName) {
			// the layer was in identifying
			if (layer.onIdentify) {
				// unset the layer active
				this.layerActive = null;
				// update the property in the layer object
				layer.onIdentify = false;
				// stop the action in the map
				this.identifyLayerClick.emit(null);
			}else{

			// the layer was active in editing
			layer.onEdit = false;
			this.editLayerClick.emit(null);
			this.openLayersService.updateShowEditToolbar(false);
			this.openLayersService.raiseSymbolPanelClosed(true);
			layer.onIdentify = true;
			this.identifyLayerClick.emit({ layer, group });
      }
		}
		// A layer active its different to the selected layer
    else{
      // stops identifying in the layer if so
      this.updateIdentifyActionInLayers(this.layerActive);
      // stop editing if so
      this.updateEditActionInLayers(this.layerActive);
      // workaround..
      this.openLayersService.updateShowEditToolbar(false);
      this.openLayersService.raiseSymbolPanelClosed(true);
      this.editLayerClick.emit(null);
      // set the selected layer as active
      this.layerActive = layer.layerName;
      layer.onIdentify = true;
      this.identifyLayerClick.emit({ layer, group });
    }
    //automatically show layer if identify selected
    if(layer.onIdentify && !layer.visible){
      layer.visible = true;
      this.onLayerVisClick($event, layer, group);
    }
	}

	closeLayerPanel(value: any) {
		/** Updates the value of the observable $showLayerPanel$ that controls the layer Panel visibility
		 * @param value, type boolean
		 */
		this.showLayerPanel$ = observableOf(value);
	}

	ngOnDestroy() {
		this.showEditToolsSubscription.unsubscribe();
		this.groupLayersSubscription.unsubscribe();
	}

	onSelectedChanged($event: MatSelectionListChange) {
		if ($event.options[0].selected) {
			//$event.source.selectedOptions.
			console.log($event.options[0].value);
			console.log($event.options[0]._setSelected(true));
		}
	}

	findLayerinGroups(layerName: string): LayerInfo | undefined {
		for (const group of this.currentGroupLayers) {
			const lyr = group.layers.find(
				(x) => x.layerName.toLowerCase() === layerName.toLowerCase(),
			);
			if (lyr) {
				return lyr;
			}
		}
	}

	isLayerQueryable(layerName: string): boolean {
		return !this.loadedProject.backgroundLayers.find(
			(bl) => bl.title === layerName,
		);
	}

	/** This function emit an event to allow the map component to know that a layer was clicked
	 * @param $event: to stop event propagation
	 * @param layer: the layer that the user clicked on to show/hide
	 */
	onLayerVisClick($event: any, layer: LayerInfo, group: GroupLayerInfo) {
		$event.preventDefault();
		$event.stopImmediatePropagation();

		this.layerVisClick.emit({ layer: layer, group: group });

		if (layer.visible && !group.visible) {
			group.visible = true;
			this.groupLayerVisClick.emit({ group: group });
		}
	}

	/** This function emit an event to allow the map component to know that a layer was clicked
	 * @param $event: to stop event propagation
	 * @param groupLayer: the layer that the user clicked on to show/hide --> in this case layer is a group
	 */
	onGroupLayerVisClick($event: any, groupLayer: GroupLayerInfo) {
		$event.preventDefault();
		$event.stopImmediatePropagation();
		// emit the event to update the group visibility in the map
		this.groupLayerVisClick.emit({ group: groupLayer }); // emit the change
	}

	private findGroupByName(groupName: string): GroupLayerInfo | undefined {
		const layerGroup = this.currentGroupLayers.find(
			(x) => x.groupName === groupName,
		);
		return layerGroup;
	}
}

export interface LayerPanelLayerEvent {
	layer: LayerInfo;
	group: GroupLayerInfo;
}

export interface LayerPanelGroupEvent {
	group: GroupLayerInfo;
}

export interface LayerPanelGroupsEvent {
  groups: GroupLayerInfo[];
}