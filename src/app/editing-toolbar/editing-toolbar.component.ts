import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription, of as observableOf, observable} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import { MatIconRegistry } from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {observableToBeFn} from 'rxjs/internal/testing/TestScheduler';
import {MapQgsStyleService} from '../map-qgs-style.service';


@Component({
  selector: 'app-editing-toolbar',
  templateUrl: './editing-toolbar.component.html',
  styleUrls: ['./editing-toolbar.component.scss']
})
export class EditingToolbarComponent implements OnInit {
  @ViewChild('symbolList', { static: false })
  symbolList?: ElementRef<HTMLElement>;
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
isVisible$: Observable<boolean>;
layerTypeEdit$: string;  // type of geometry of the layer in editing
styles: any;
subsToShowEditToolbar: Subscription;
subsToGeomTypeEditing: Subscription;
actionActive = {
    Point: false,
    LineString: false,
    Polygon: false,
    Square: false,
    Box: false,
    Circle: false,
    modify: false,   // it is translate only
    modifyBox: false,
    delete: false
  };
  onPanStart(event: any): void {
    this.startX = this.x;
    this.startY = this.y;
  }
  onPan(event: any): void {
    event.preventDefault();
    this.x = this.startX + event.deltaX;
    this.y = this.startY + event.deltaY;
  }

constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private openLayersService: OpenLayersService) {
  iconRegistry.addSvgIcon(
    'add_line',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-line-nodes-24px.svg')
  );
  iconRegistry.addSvgIcon(
    'selectBoxFeature',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-select-box2-24px.svg')
  );
  iconRegistry.addSvgIcon(
    'add_poly',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/add-poly-layer24px.svg')
  );



  this.subsToShowEditToolbar = this.openLayersService.showEditToolbar$.subscribe(
    (data) => {
      this.showToolbar(data);
    },
    (error) => {console.log('Error in subscription to openLayersService.showEditToolbar$'); }
  );
  this.subsToGeomTypeEditing = this.openLayersService.layerEditing$.subscribe(
    (data: any) => {
      console.log('data aqui', data);
      this.updateLayerTypeEdit(data.layerGeom);
    },
    error => {
      console.log('Error in subscription openLayersService.geomTypeEditing$');
    }
  );
  }

  closeEditingToolbar(){
    this.isVisible$ = observableOf(false);
  }

  updateLayerTypeEdit(geomType){
    /** Updates the observable layerTypeEdit$ that is used in the page to show editing symbols according to the
     * geometry type of the layer
     * @param geomType: string indicating the geometry type
     */
    this.layerTypeEdit$ = geomType;
    console.log('this.layerTypeEdit$', this.layerTypeEdit$);
  }


   drawingShapes(shapeType: any){
      // update the observable in services to remove the interaction
     // tslint:disable-next-line:triple-equals
      if (true == this.actionActive[shapeType] ) {
        // The layer was on editing
        // console.log ("stop interaction de dibujar", shapeType,"this.actionActive[shapeType]",this.actionActive[shapeType]);
        this.openLayersService.updateShapeEditMode(null); // #TODO avoid this is not needed to reduce the number of petitions
        this.showSymbolPanel(false);
      }
      else {
        this.openLayersService.updateShapeEditMode(shapeType);
        this.showSymbolPanel(true);
      }
      this.actionActive[shapeType] = !this.actionActive[shapeType];

      // change the rest of interactions to false
      for (const key in this.actionActive ) {
        // console.log("otra...this.actionActive[key]",key,this.actionActive[key]);
        if ((key != shapeType) && (true == this.actionActive[key]))
        {
          this.actionActive[key] = !this.actionActive[key];
        }
      }
  }
  selectingBoxFeatures(){
  }
  showSymbolPanel(visible: boolean){
    /**
     * Updates the obsrevable that allows to show/hode the symbolPanel
     */
    // #TODO add a validation to know if is visible or not?
    this.openLayersService.updateShowSymbolPanel(visible);
   }
  deleteFeat(){
  }
  saveLayer(){
    /** Enable user to save edit in the layer being Updates the observable to show the editing toolbar and
     *  @param visible: boolean
     */
    if (confirm('Do you want to save edits in the current layer:?')){
      this.openLayersService.updateSaveCurrentLayer(true);
    }
  }

  undoEdit(data){
  }

  ngOnInit(): void {
    this.isVisible$ = observableOf(false);
  }

  showToolbar(visible: boolean){
    /** Updates the observable to show the editing toolbar and
     *  @param visible: boolean
     */
  this.isVisible$ = observableOf(visible);
  // desactivar todas las actions??
  }
}
