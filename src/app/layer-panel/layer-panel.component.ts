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
  @Input() editLayers: Array<any>;
  @Input() groupLayers: any;
  @Output() layerVisClick = new EventEmitter<any>();   // emit an event when a layer is clicked in the list
  @Output() groupLayerVisClick = new EventEmitter<any>();   // emit an event when a layer is clicked in the list
  @Output() editLayerClick = new EventEmitter<any>();   // emit an event when the edit button of a layer is clicked
  @Output() layersOrder = new EventEmitter<any>();   // emit an event when layers were reordered (drop)
  @Output() layersBackOrder = new EventEmitter<any>();  // emit an event when the order of base layers changes
  @Output() layerBackVisClick = new EventEmitter<any>(); // emit an event when the edit button of a layer is clicked
  @Output() identifyLayerClick = new EventEmitter<any>();  // #TODO link in maps

  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  selectedOptions = [];
  layerActive: any;
 // preSelection = AppConfiguration.layerBaseList2.base_img.name; // ['name']];// 'OSM' The name
//  editLayers = [['0'], ['1']];
  baseLayers = []; // WMS layers as background; layers; too ?
  showLayerPanel$: Observable<boolean>;
  selectedLayersOptions$: Observable<any>;   // to keep the status of the layers in the layer panel

  actionActiveLayer = {
    Identify: false,
    Edit: false};

constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private openLayersService: OpenLayersService) {

  iconRegistry.addSvgIcon(
    'getInfo',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/identify-24px2.svg')
  );
}
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
  dropExpansion(event: CdkDragDrop<string[]>){
   // console.log(this.layerAccordion.nativeElement.children);
   moveItemInArray(this.groupLayers, event.previousIndex, event.currentIndex);
   this.layersOrder.emit(this.groupLayers);
   // console.log(this.groupLayers);
   }


  ngOnInit(): void {
  console.log('in Layer Panel con delay', this.groupLayers);
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

     onEditLayerClick($event: any, layer: any, groupName:string){
     /** allows to start editing a particular layer in the layer panel
      * @param $event for the future, doing nothing with it so far.
      * @param layer: layer that was clicked on to start/stop editing
      */
      $event.preventDefault();
      $event.stopImmediatePropagation();
      console.log('que entra..getting better', layer);
      this.editLayerClick.emit(layer);  // with this the map should act accordingly to stop/start editing.
      console.log('layer.layerName', layer.layerName, 'layerActive?', this.layerActive);
      if (this.layerActive === layer.layerName) {
        if (layer.onEdit){
          // the layer was on Editing mode, so the editing action must be stopped
          this.layerActive = null;
          layer.onEdit = false;
          this.openLayersService.updateShowEditToolbar(false);
          return;
        }
        // the layer was in identifying
        this.layerActive = layer.layerName;
        layer.onEdit = true;
        this.openLayersService.updateShowEditToolbar(true);
        return;
      }
      this.layerActive = layer.layerName;
      layer.onEdit = true;
      this.openLayersService.updateShowEditToolbar(true);
        // change style of the edit button
        /* const classList = $event.target.classList;
        const classes = $event.target.className;
        console.log('lista de clases del boton antes', classList);
        classes.includes('clicked') ? classList.remove('clicked') : classList.add('clicked');
        console.log('lista de clases del boton', classList);*/
      console.log('maybe change the edit icon.. to remind user that layer is being edited? or add another in front and make visible..')
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
    console.log('to start identify layer, check the layer active thing', layer);
    this.identifyLayerClick.emit({layer, groupName});  // with this the map should act accordingly to stop/start editing.
    console.log('to start identify layer, check the layer active thing', layer);
    if (this.layerActive === layer.layerName) {
      if (!layer.onEdit){
        // the layer was not on Editing mode, so the identifying action must be stopped
        this.layerActive = null;
        this.identifyLayerClick.emit(null);
      }
    }
    else {
      this.layerActive = layer.layerName;
    }
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
        console.log ('la consigue en los grupos', lyr);
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
    console.log('layer visibility updated', layer, groupName, this.groupLayers);
    this.layerVisClick.emit({layer, groupName});
}

onGroupLayerVisClick(  $event: any, layer: any){
    /** This function emit an event to allow the map component to know that a layer was clicked
     * @param $event: to stop event propagation
     * @param layer: the layer that the user clicked on to show/hide --> in this case layer is a group
     */
    $event.preventDefault();
    $event.stopImmediatePropagation();
    console.log ('layergroup being emitted', layer, this.groupLayers);
    // update visible of the group in the global variable groupLayers
    const tgroup = this.groupLayers.find(x => x.groupName === layer.groupName);
    tgroup.visible = true;
    console.log('layerGroup visibility updated', layer, this.groupLayers);

    // emit the event to update the group visibility in the map
    this.groupLayerVisClick.emit(layer);  // emit the change
  }
}
