import {Component, OnInit, Input, Output, SimpleChange, OnChanges, EventEmitter} from '@angular/core';
import {Observable, of as observableOf, Subject, Subscription} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {OpenLayersService} from '../open-layers.service';
import {AppConfiguration} from '../app-configuration';

@Component({
  selector: 'app-layer-panel',
  templateUrl: './layer-panel.component.html',
  styleUrls: ['./layer-panel.component.scss']
})
export class LayerPanelComponent implements OnInit {
  @Input() editLayers: Array<any>;
  @Output() layerVisClick = new EventEmitter<any>();   // emit an event when a layer is clicked in the list
  @Output() editLayerClick = new EventEmitter<any>();   // emit an event when the edit button of a layer is clicked
  @Output() layersOrder = new EventEmitter<any>();   // emit an event when layers were reordered (drop)
  @Output() layersBackOrder = new EventEmitter<any>();  // emit an event when the order of base layers changes
  @Output() layerBackVisClick = new EventEmitter<any>(); // emit an event when the edit button of a layer is clicked
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  selectedOptions = [];
  layerActive:any;
 // preSelection = AppConfiguration.layerBaseList2.base_img.name; // ['name']];// 'OSM' The name
//  editLayers = [['0'], ['1']];
  baseLayers = []; // WMS layers as background; layers; too ?
  showLayerPanel$: Observable<boolean>;
  selectedLayersOptions$: Observable<any>;   // to keep the status of the layers in the layer panel



constructor(private openLayersService: OpenLayersService){}

 drop(event: CdkDragDrop<string[]>) {
    /** Moves the layers in the panel after a drop gesture and emits a layersOrder event
     * that is capture by the map component that effectively reorder the layers in the map.
     * @param event --> cdkDragDrop event
     */
    moveItemInArray(this.editLayers, event.previousIndex, event.currentIndex);
    this.layersOrder.emit(this.editLayers);
   /* #TODO remove, this was changed because I used a child component.
   this.openLayersService.updateOrderEditLayers(this.editLayers);
    this.openLayersService.updateEditingLayer(this.editLayers[0]);  // debria ser true or false
    this.openLayersService.updateShowEditTools(this.editLayers[0][2]); // pos 2 tiene el tipo
    */
  }
  dropBase(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.baseLayers, event.previousIndex, event.currentIndex);
    this.layersBackOrder.emit(this.baseLayers);
  }

ngOnInit(): void {
  this.showLayerPanel$ = observableOf(true);
  }

  onEditLayerClick($event: any, layer: any){
  /** allows to start editing a particular layer in the layer panel
   * @param $event for the future, doing nothing with it so far.
   * @param item: item (layer) that was clicked on to start/stop editing
   */
  $event.preventDefault();
  $event.stopImmediatePropagation();
  console.log('que entra..getting better', $event, layer.layerName);
  this.editLayerClick.emit(layer);  // with this the map should act accordingly to stop/start editing.
    // tslint:disable-next-line:triple-equals
  if (this.layerActive == layer.layerName) {
    this.layerActive = null;
    this.openLayersService.updateShowEditToolbar(false);
  }
  else {
    this.layerActive = layer.layerName;
  }
}
closeLayerPanel(value: any) {
  /** Updates the value of the observable $showLayerPanel$ that controls the layer Panel visibility
   * @param value, type boolean
   */
  console.log(value);
  this.showLayerPanel$ = observableOf(value);
  }
 onPanStart(event: any): void {
  /** Sets the current coordinates of the layerPanel to use later when setting a new position
   * triggered when a pan event starts in the layerpanel card
   * @param event, type event
   */
    this.startX = this.x;
    this.startY = this.y;
  }
onPan(event: any): void {
  /** Sets the new location of the layerPanel after a pan event was triggered in the layerPanel card
   * @param event, type event
   */
    event.preventDefault();
    this.x = this.startX + event.deltaX;
    this.y = this.startY + event.deltaY;
  }

  onEditListChange($event, selectedList, options){
    /**
     * Updates layers order on the map. This is for editable layers
     * @param $event: the event emitted
     * @param selectedList: list of layers being selected to become visible
     */
    this.selectedOptions = selectedList.map(s => s.value);
    console.log('sigo', this.selectedOptions);
    // Actualizando las lista de las capas
    //this.layerListChanged.emit(this.selectedOptions);  // emit the change
    //console.log('que tiene this.layerListChanged ', this.layerListChanged);
    // #TODO uncomment this.openLayersService.updateVisLayers(this.selectedOptions);
    }

  onBackListChange($event, selectedList){
    /**
     * Updates layers visibility on the map. This is for background layers
     * @param $event: the event emitted
     * @param selectedList: list of layers being selected to become visible
     */
    this.selectedOptions = selectedList.map(s => s.value);
    console.log('sigo', this.selectedOptions);
    // Actualizando las lista de las capas
    this.layerBackVisClick.emit(this.selectedOptions);  // the order
    // this.selectedOption =$event;
  }

  onLayerVisClick(  $event: any, layer: any){
    /** This function emit an event to allow the map component to know that a layer was clicked
     * @param $event: to stop event propagation
     * @param layer: the layer that the user clicked on to show/hide
     */
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this.layerVisClick.emit(layer);  // emit the change
  }
  onLayerBackVisClick(  $event: any, layer: any){
    /** This function emit an event to allow the map component to know that a layer was clicked
     * @param $event: to stop event propagation
     * @param layer: the layer that the user clicked on to show/hide
     */
    $event.preventDefault();
    $event.stopImmediatePropagation();
    this.layerBackVisClick.emit(layer);  // emit the change
  }
}
