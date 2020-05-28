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

  constructor() { }

  updateExistingProject(projectOpened: boolean){
    /**
     * @param projectOpened: indicates if there is a project opened (not a default view)
     */
    this.existingProject.next(projectOpened);
  }

  updateShapeEditMode(shapeEdit: any){
    this.shapeEditTypeSource.next(shapeEdit);
    console.log("updating");
  }


  updateShowEditToolbar(visible: boolean) {
    /** Updates the observable to the next value
     * visible: boolean; true or false to show/hide the editing toolbar
     */
    this.showEditToolbarSource.next(visible);
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

}
