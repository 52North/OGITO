import { Feature } from 'ol/Feature';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { ProjectConfiguration } from './config/project-config';

@Injectable({
  providedIn: 'root'
})
export class OpenLayersService {
  private existingProject = new Subject<any>();
  existingProject$ = this.existingProject.asObservable();
  private showEditToolbarSource = new Subject<boolean>();
  showEditToolbar$ = this.showEditToolbarSource.asObservable();
  private layerEditingSource = new Subject <{layerName: any; layerGeom: any; }>();
  layerEditing$ = this.layerEditingSource.asObservable();
  private shapeEditTypeSource = new Subject<string>();
  shapeEditType$ = this.shapeEditTypeSource.asObservable();
  private showSymbolPanelSource = new Subject <SymbolListVisibility>();
  showSymbolPanel$ = this.showSymbolPanelSource.asObservable();
  private showEditLayerPanelSource = new Subject <boolean>();
  showEditLayerPanel$ = this.showEditLayerPanelSource.asObservable();
  private currentSymbolSource = new Subject<SelectedSymbol>();
  currentSymbol$ = this.currentSymbolSource.asObservable();
  private saveCurrentLayerSource = new Subject<boolean>();
  saveCurrentLayer$ = this.saveCurrentLayerSource.asObservable();
  private saveAllLayersSource = new Subject<boolean>();
  saveAllLayers$ = this.saveAllLayersSource.asObservable();
  private deleteFeatsSource = new Subject<any>();
  deleteFeats$ = this.deleteFeatsSource.asObservable();
  private editActionSource = new Subject<any>();
  editAction$ = this.editActionSource.asObservable();
  private zoomHomeSource = new Subject<boolean>();
  zoomHome$ = this.zoomHomeSource.asObservable();
  private qgsProjectUrlSource = new Subject<ProjectConfiguration>();
  qgsProjectUrl$ = this.qgsProjectUrlSource.asObservable();
  private findPopExposedSource = new Subject<any>();  // Population exposed to certain level of noise
  findPopExposed$ = this.findPopExposedSource.asObservable();
  private findInstitutionsExposedSource = new Subject<any>();  // Population exposed to certain level of noise
  findInstitutionsExposed$ = this.findInstitutionsExposedSource.asObservable();
  private addSketchLayerSource = new Subject<SketchLayerDescriptor>();
  addSketchLayer$ = this.addSketchLayerSource.asObservable();
  private showStreetSearchSource = new Subject<boolean>();
  showStreetSearch$ = this.showStreetSearchSource.asObservable();
  private streetSelectedSource = new Subject<Feature>();
  streetSelected$ = this.streetSelectedSource.asObservable();
  private symbolPanelClosed = new Subject<boolean>();
  symbolPanelClosed$ = this.symbolPanelClosed.asObservable();
  private zoomToLocation = new Subject<any>();
  zoomToLocation$ = this.zoomToLocation.asObservable();
  private streetSearchConfigured = new Subject<boolean>();
  streetSearchConfigured$ = this.streetSearchConfigured.asObservable();

  constructor() { }

  updateExistingProject(projectOpened: boolean){
    /**
     * @param projectOpened: indicates if there is a project opened (not a default view)
     */
    this.existingProject.next(projectOpened);
  }
  updateAddSketchLayer(value: string, showDefaultFields = true, editable = true){
    /**
     * @param value: name of the sketch layer
     */
    this.addSketchLayerSource.next({name: value, editable: editable, showDefaultFields: showDefaultFields});
  }

  updateZoomHome(value= true){
    /**
     * sends a request to the map component to go to the Home
     */
    this.zoomHomeSource.next(value);
  }

  updateGeolocation(){
    /**
     * sends a request to the map component  to center on current user location
     */
    this.zoomToLocation.next();
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

  updateSaveCurrentLayer(save: boolean){
    /** Updates the observable to the next value
     * visible: boolean; true or false to show/hide the editing toolbar
     */
    this.saveCurrentLayerSource.next(save);
  }

  updateSaveAllLayers(save: boolean){
    /** Updates the observable to the next value
     * visible: boolean; true or false to save all edits in all layers
     */
    this.saveAllLayersSource.next(save);
  }

  updateShowEditToolbar(visible: boolean) {
    /** Updates the observable to the next value
     * visible: boolean; true or false to show/hide the editing toolbar
     */
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

  updateShowStreetSearch(visible: boolean) {
    /** Updates the observable to the next value
     * visible: boolean; true or false to show/hide the street search panel
     */
    this.showStreetSearchSource.next(visible);
  }

  updateLayerEditing(layerName, layerGeom){
    /** Updates the observable Geometry type for editing to the next value
     * geom: string; the geometry type: point, line, polygons..
     */
     this.layerEditingSource.next({layerName, layerGeom});
  }

  updateShowSymbolPanel(visibility: SymbolListVisibility) {
    /** Updates the observable ShowSymbolPanel to the next value
     * @param visible: boolean true or false to show/hide the editing toolbar
     */
    this.showSymbolPanelSource.next(visibility);
  }

  updateCurrentSymbol(selectedSymbol : SelectedSymbol) {
    /** Updates the observable ShowSymbolPanel to the next value
     * @param symbol: style to be used to draw current feature
     */
    this.currentSymbolSource.next(selectedSymbol);
  }

  updateSelectedStreet(selectedStreet : Feature) {
    /** Updates the observable SelecteStreet to the next value
     * @param selectedStreet: selected street feature
     */
    this.streetSelectedSource.next(selectedStreet);
  }

  updateFindPopExposed(data: any) {
    /** Updates the observable popExposed to the next value
     * @param data: the result of the query returned by the API
     */
    this.findPopExposedSource.next(data);
  }

  updateFindInstitutionsExposed(data: any) {
    /** Updates the observable popExposed to the next value
     * @param data: the result of the query returned by the API
     */
    this.findInstitutionsExposedSource.next(data);
  }

  raiseSymbolPanelClosed(isAborted: boolean){
    this.symbolPanelClosed.next(isAborted)
  }

  updateStreetSearchConfigured(isConfigured: boolean){
    this.streetSearchConfigured.next(isConfigured)
  }

}

export interface SelectedSymbol{
    symbol: any,
    selectedValue: {
      property: string,
      value: string
    }
}

export interface SymbolListVisibility{
  visible: boolean,
  optHeader?: string
}

export interface SketchLayerDescriptor{
  name: string,
  editable: boolean
  showDefaultFields: boolean
}

