import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenLayersService {
  private existingProject = new Subject<any>();
  existingProject$ = this.existingProject.asObservable();
  private showEditToolbarSource = new Subject<boolean>();
  showEditToolbar$ = this.showEditToolbarSource.asObservable();
 // object: {[key: string]: string};
  private layerEditingSource = new Subject <{layerName: any; layerGeom: any; }>();
  layerEditing$ = this.layerEditingSource.asObservable();
  private shapeEditTypeSource = new Subject<string>();
  shapeEditType$ = this.shapeEditTypeSource.asObservable();
  private showSymbolPanelSource = new Subject <boolean>();
  showSymbolPanel$ = this.showSymbolPanelSource.asObservable();
  private showEditLayerPanelSource = new Subject <boolean>();
  showEditLayerPanel$ = this.showEditLayerPanelSource.asObservable();
  private currentSymbolSource = new Subject<any>();
  currentSymbol$ = this.currentSymbolSource.asObservable();
  private saveCurrentLayerSource = new Subject<any>();
  saveCurrentLayer$ = this.saveCurrentLayerSource.asObservable();
  private deleteFeatsSource = new Subject<any>();
  deleteFeats$ = this.deleteFeatsSource.asObservable();
  private editActionSource = new Subject<any>();
  editAction$ = this.editActionSource.asObservable();
  private zoomHomeSource = new Subject<boolean>();
  zoomHome$ = this.zoomHomeSource.asObservable();
  private qgsProjectUrlSource = new Subject<any>();
  qgsProjectUrl$ = this.qgsProjectUrlSource.asObservable();
  constructor() { }

  updateExistingProject(projectOpened: boolean){
    /**
     * @param projectOpened: indicates if there is a project opened (not a default view)
     */
    this.existingProject.next(projectOpened);
  }

  updateZoomHome(value= true){
    /**
     * sends a request to the map component to go to the Home
     */
    this.zoomHomeSource.next(value);
  }

  updateShapeEditType(shapeEdit: any){
    this.shapeEditTypeSource.next(shapeEdit);
  }

  updateDeleteFeats(active: boolean){
    /** Updates the observable to the next value
     * active: boolean; true or false to allow delete features
     */
    this.deleteFeatsSource.next(active);
  }

  updateEditAction(action: string){
    /** Updates the observable to the next value
     * @parama action: string indicating the action 'ModifyBox', 'Delete', 'Copy' , etc to perform in the map
     */
    this.editActionSource.next(action);
  }

  updateSaveCurrentLayer(save: true){
    /** Updates the observable to the next value
     * visible: boolean; true or false to show/hide the editing toolbar
     */
    this.saveCurrentLayerSource.next(save);
  }

  updateShowEditToolbar(visible: boolean) {
    /** Updates the observable to the next value
     * visible: boolean; true or false to show/hide the editing toolbar
     */
    console.log('HERE all good');
    this.showEditToolbarSource.next(visible);
  }
  updateQgsProjectUrl(url: any)
  {
    this.qgsProjectUrlSource.next(url);
  }

  updateShowLayerPanel(visible: boolean) {
    /** Updates the observable to the next value
     * visible: boolean; true or false to show/hide the layer panel
     */
    this.showEditLayerPanelSource.next(visible);
  }

  updateLayerEditing(layerName, layerGeom){
    /** Updates the observable Geometry type for editing to the next value
     * geom: string; the geometry type: point, line, polygons..
     */
    this.layerEditingSource.next({layerName, layerGeom});
  }

  updateShowSymbolPanel(visible: boolean) {
    /** Updates the observable ShowSymbolPanel to the next value
     * @param visible: boolean true or false to show/hide the editing toolbar
     */
    this.showSymbolPanelSource.next(visible);
  }

  updateCurrentSymbol(symbol: any) {
    /** Updates the observable ShowSymbolPanel to the next value
     * @param symbol: style to be used to draw current feature
     */
    this.currentSymbolSource.next(symbol);
  }
}
