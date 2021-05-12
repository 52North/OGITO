import {Component, OnInit, AfterViewInit, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {Observable, of as observableOf} from 'rxjs';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {OpenLayersService} from '../open-layers.service';

import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-layer-panel',
  templateUrl: './layer-panel.component.html',
  styleUrls: ['./layer-panel.component.scss', '../map/map.component.scss']     // to access the .map css selector
})
export class LayerPanelComponent implements OnInit, AfterViewInit {
  // @Input() editLayers: Array<any>;
  @Input() groupLayers: any;
  @Output() layerVisClick = new EventEmitter<any>();   // emit an event when a layer is clicked in the list
  @Output() groupLayerVisClick = new EventEmitter<any>();   // emit an event when a layer is clicked in the list
  @Output() editLayerClick = new EventEmitter<any>();   // emit an event when the edit button of a layer is clicked
  @Output() layersOrder = new EventEmitter<any>();   // emit an event when layers were reordered (drop)
  @Output() identifyLayerClick = new EventEmitter<any>();  // emit the layer to start identifying
  // @Output() rankingLayerClick = new EventEmitter<any>();  // #TODO link in maps

  x = 40;
  y = 80;
  startX = 0;
  startY = 0;
  selectedOptions = [];
  layerActive: any = null;
 // preSelection = AppConfiguration.layerBaseList2.base_img.name; // ['name']];// 'OSM' The name
//  editLayers = [['0'], ['1']];
  baseLayers = []; // WMS layers as background; layers; too ?
  showLayerPanel$: Observable<boolean>;
  selectedLayersOptions$: Observable<any>;   // to keep the status of the layers in the layer panel

 /* actionActiveLayer = {
    Identify: false,
    Edit: false};*/

constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private openLayersService: OpenLayersService) {

  iconRegistry.addSvgIcon(
    'getInfo',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/identify-24px2.svg')
  );
  iconRegistry.addSvgIcon(
    'ratingActionPlan',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/rate_action_plan2.svg')
  );
}
 /*drop(event: CdkDragDrop<string[]>) {
    /** Moves the layers in the panel after a drop gesture and emits a layersOrder event
     * that is capture by the map component that effectively reorder the layers in the map.
     * @param event --> cdkDragDrop event
     */
    // moveItemInArray(this.editLayers, event.previousIndex, event.currentIndex);
    // this.layersOrder.emit(this.editLayers);
  // } */

  dropExpansion(event: CdkDragDrop<string[]>) {
   // console.log(this.layerAccordion.nativeElement.children);
   moveItemInArray(this.groupLayers, event.previousIndex, event.currentIndex);
   this.layersOrder.emit(this.groupLayers);
   }


  ngOnInit(): void {
  console.log('in Layer Panel con delay', this.groupLayers);
  this.layerActive = null;
  this.showLayerPanel$ = observableOf(true);
  this.openLayersService.showEditLayerPanel$.subscribe(data =>{
  this.showLayerPanel$ = observableOf(data);
  },
    error => console.log('error showing layer panel'));
  }


  addingGroupsLayers(){
  // console.log('primera', this.groupedListDiv.nativeElement.textContent);
    /*
     console.log(this.groupLayers);
     const  textgroup = document.createElement("P");                 // Create a <p> element
     textgroup.innerHTML = "This is a paragraph.";
       // Insert text
     this.groupedListDiv.nativeElement.appendChild(textgroup);
     */
     }

     ngAfterViewInit(){
       this.addingGroupsLayers();
     }

  updateIdentifyActionInLayers(layerName: string){
    /**
     * updates the status of the action @action in  layerName
     * @param layerName: layerName for exception
     * #TODO declarar layer as a class and use setters and getters
     */
    console.log('layerName in updateEditActioninLayers', layerName);
    for (const group of this.groupLayers) {
      group.layers.forEach(layer => {
          if (layer.layerName.toLowerCase() === layerName.toLowerCase() && layer.onIdentify) {
            layer.onIdentify = false;
            this.identifyLayerClick.emit(null);
          }
      });
    }
  }
  updateEditActionInLayers(layerName: string){
      /**
       * updates the status of the action  in layerName
       * @param layerName: layerName for exception
       * #TODO declare layer as a class and use setters and getters
       */
      // console.log('layerName in updateEditActioninLayers', layerName);
      for (const group of this.groupLayers) {
        group.layers.forEach(layer => {

          if (layer.wfs) {
            // console.log('layer', layer);
            if (layer.layerName.toLowerCase() === layerName.toLowerCase() && layer.onEdit) {
              layer.onEdit = false;
            }
          }
        });
       }
      }

      onEditLayerClick($event: any, layer: any, groupName:string){
     /** allows to start editing a particular layer in the layer panel
      * @param $event for the future, doing nothing with it so far.
      * @param layer: layer that was clicked on to start/stop editing
      */
      $event.preventDefault();
      $event.stopImmediatePropagation();
      // console.log('que entra..getting better layer and this.layerActive',$event, layer, this.layerActive);
      // not layer active
      if (this.layerActive === null){
        // set the clicked layer as active
        this.layerActive = layer.layerName;
        // update the onEdit layer property
        layer.onEdit = true;
        // show the editing toolbar
        this.openLayersService.updateShowEditToolbar(true);
        // emit the event
        this.editLayerClick.emit({layer, groupName});
        return;
      }
      // there is an active layer and its the same than the selected layer
      if (this.layerActive === layer.layerName) {
        // layer active was in editing
        if (layer.onEdit) {
          this.layerActive = null;
          // stop editing
          layer.onEdit = false;
          this.openLayersService.updateShowEditToolbar(false);
          this.editLayerClick.emit(null);
          return;
        }
        // layer was in identifying // stop this action
        layer.onIdentify = false;
        layer.onEdit = true;
        this.openLayersService.updateShowEditToolbar(true);
        this.identifyLayerClick.emit(null);
        this.editLayerClick.emit({layer, groupName});
        return;
      }
      // there is an active layer and its not the same than the selected layer
      this.updateEditActionInLayers(this.layerActive); // code was changed to update only one layer, the previous one
      this.updateIdentifyActionInLayers(this.layerActive);
      this.layerActive = layer.layerName;
      layer.onEdit = true;
      this.openLayersService.updateShowEditToolbar(true);
      this.editLayerClick.emit({layer, groupName});
      }



  onOpacityLayerClick($event: any, layer: any){
  // TODO change opacity
    /** shows a div below the layer with a slider to change the visibility of a layer
     * @param $event for the future, doing nothing with it so far.
     * @param item: item (layer) that was clicked on to change opacity
     */
    $event.preventDefault();
    $event.stopImmediatePropagation();
    console.log('colocar codigo aqui for opacity', $event, layer.layerName);
    // this.editLayerClick.emit(layer);  // with this the map should act accordingly to stop/start editing.
    // emit the event to chage opacity
  }


  onIdentifyLayerClick($event: any, layer: any, groupName: any) {
    // TODO identify features
    /** enables identifies features in a layer
     * @param $event for the future, doing nothing with it so far.
     * @param item: item (layer) that was clicked on to change opacity
     */
    $event.preventDefault();
    $event.stopImmediatePropagation();
    // console.log('to start identify layer, check the layer active thing', layer);
    // with this the map should act accordingly to stop/start identifying.
    // there is not layerActive
    if (this.layerActive === null) {
      this.layerActive = layer.layerName;
      layer.onIdentify = true;
      this.identifyLayerClick.emit({layer, groupName});
      return;
    }
    // there is layer Active and its the same
    console.log ('this.layerActive y layer.layerName iguales?', this.layerActive, layer.layerName, this.layerActive === layer.layerName);
    if (this.layerActive === layer.layerName){
      // the layer was in identifying
      if (layer.onIdentify) {
        // unset the layer active
        this.layerActive = null;
        // update the property in the layer object
        layer.onIdentify = false;
        // stop the action in the map
        this.identifyLayerClick.emit(null);
        return;
      }
      // the layer was active in editing
      console.log('PASA AQUI.. 221, onIdentifyLayerClick');
      layer.onEdit = false;
      this.editLayerClick.emit(null);
      this.openLayersService.updateShowEditToolbar(false);
      layer.onIdentify = true;
      this.identifyLayerClick.emit({layer, groupName});
      return;
    }
    // A layer active its different to the selected layer
    // stops identifying in the layer if so
    this.updateIdentifyActionInLayers(this.layerActive);
    // stop editing if so
    this.updateEditActionInLayers(this.layerActive);
    // workaround..
    this.openLayersService.updateShowEditToolbar(false);
    this.editLayerClick.emit(null);
    // set the selected layer as active
    this.layerActive = layer.layerName;
    layer.onIdentify = true;
    this.identifyLayerClick.emit({layer, groupName});
  }


  closeLayerPanel(value: any) {
  /** Updates the value of the observable $showLayerPanel$ that controls the layer Panel visibility
   * @param value, type boolean
   */
  // console.log(value);
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


  onSelectedChanged($event: any){
    // console.log('probando esto a lo loco $event.option.value', $event.option.value, $event );
    if ($event.option.value.isChecked) {
        $event.option.selected = true;
        $event.stopImmediatePropagation();
      }
  }


  findLayerinGroups(layerName: string): any {
    for (const group of this.groupLayers) {
      const lyr = group.layers.find(x => x.layerName.toLowerCase() === layerName.toLowerCase());
      if (lyr) {
        // console.log ('la consigue en los grupos', lyr);
        return (lyr);
      }
    }

  }


  onLayerVisClick(  $event: any, layer: any, groupName: any){
    /** This function emit an event to allow the map component to know that a layer was clicked
     * @param $event: to stop event propagation
     * @param layer: the layer that the user clicked on to show/hide
     */
    $event.preventDefault();
    $event.stopImmediatePropagation();
    // update visible of the layer in the variable
    const tlayer = this.findLayerinGroups(layer.layerName);
    tlayer.visible = true;
    // console.log('layer visibility updated', layer, groupName, this.groupLayers);
    this.layerVisClick.emit({layer, groupName});
}

onGroupLayerVisClick(  $event: any, layer: any){
    /** This function emit an event to allow the map component to know that a layer was clicked
     * @param $event: to stop event propagation
     * @param layer: the layer that the user clicked on to show/hide --> in this case layer is a group
     */
    $event.preventDefault();
    $event.stopImmediatePropagation();
    // console.log ('layergroup being emitted', layer, this.groupLayers);
    // update visible of the group in the global variable groupLayers
    const tgroup = this.groupLayers.find(x => x.groupName === layer.groupName);
    tgroup.visible = true;
    // console.log('layerGroup visibility updated', layer, this.groupLayers);

    // emit the event to update the group visibility in the map
    this.groupLayerVisClick.emit(layer);  // emit the change
  }
}
