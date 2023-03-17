import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Observable, Subscription, of as observableOf} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import { MatIconRegistry } from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {AppConfiguration} from '../app-configuration';


@Component({
  selector: 'app-editing-toolbar',
  templateUrl: './editing-toolbar.component.html',
  styleUrls: ['./editing-toolbar.component.scss']
})
export class EditingToolbarComponent implements OnInit, OnDestroy {
  @ViewChild('symbolList', { static: false })
  symbolList?: ElementRef<HTMLElement>;
  /* @ViewChild('editToolbar') editToolbar: ElementRef <HTMLElement>;
  editToolbarOrigin = this.formatOrigin(null); */
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  stopSave = false;
  stopSaveAll = false;
  isVisible$: Observable<boolean>;
  layerTypeEdit$: string;  // type of geometry of the layer in editing
  layerTypeRateMeasures$ = false; // if the layer is for ranking;
  layerTypeRate$ = false;
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
    ModifyBox: false,  // it is translate with a box
    Rotate: false,
    Copy: false,
    Identify: false,
    Delete: false,
    MeasureLine: false,
    MeasureArea: false,
    ModifyAttribute: false,
    RankingMeasures: false,
    Rating: false
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

constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private openLayersService: OpenLayersService,
            /*private _focusMonitor: FocusMonitor,
            private _cdr: ChangeDetectorRef,
            private _ngZone: NgZone */
) {
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
  iconRegistry.addSvgIcon(
    'identify',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/identify-24px.svg')
  );
  iconRegistry.addSvgIcon(
    'measureLine',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/measure-straighten-24px.svg')
  );
  iconRegistry.addSvgIcon(
    'measureArea',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/measure-area-24px.svg')
  );
  iconRegistry.addSvgIcon(
    'add_location_attr',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/add_location_attr-24px.svg')
  );
  iconRegistry.addSvgIcon(
    'ratingQuietArea',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/rate_quiet_area.svg')
  );
  iconRegistry.addSvgIcon(
    'ratingActionPlan',
    sanitizer.bypassSecurityTrustResourceUrl('assets/img/rate_action_plan2.svg')
  );
  this.subsToShowEditToolbar = this.openLayersService.showEditToolbar$.subscribe(
    (data) => {
      this.showToolbar(data);
    },
    (error) => {console.log('Error in subscription to openLayersService.showEditToolbar$'); }
  );
  this.subsToGeomTypeEditing = this.openLayersService.layerEditing$.subscribe(
    (data: any) => {
      // console.log('data aqui de donde viene esto XXX LOL', data);
      this.updateLayerTypeRanking(data.layerName);
      this.updateLayerTypeRating(data.layerName);
      this.updateLayerTypeEdit(data.layerGeom);
    },
    error => {
      console.log('Error in subscription openLayersService.geomTypeEditing$');
    }
  );
  }


  ngOnDestroy() {
    /**
     * unsubscribe from the subscriptions
     */
    /* this can be replaced using takeuntil */
   this.subsToShowEditToolbar.unsubscribe();
   this.subsToGeomTypeEditing.unsubscribe();
  }

  updateLayerTypeRanking(layerName: string) {
    this.layerTypeRateMeasures$ = false;
    if (Object.keys(AppConfiguration.ratingMeasureLayers).findIndex(x => x.toLowerCase() === layerName.toLowerCase())  > -1) {
      this.layerTypeRateMeasures$ = true;
    }
  }

  updateLayerTypeRating(layerName: string) {
    this.layerTypeRate$ = false;
    if (Object.keys(AppConfiguration.ratingPrex).findIndex(x => x.toLowerCase() === layerName.toLowerCase()) > -1) {
      this.layerTypeRate$ = true;
    }
  }


  closeEditingToolbar(){
    this.isVisible$ = observableOf(false);
    this.showSymbolPanel(false);
  }

  updateLayerTypeEdit(geomType){
    /** Updates the observable layerTypeEdit$ that is used in the page to show editing symbols according to the
     * geometry type of the layer
     * @param geomType: string indicating the geometry type
     */
    this.layerTypeEdit$ = geomType;

  }


   drawingShapes(shapeType: any){
     /**
      *   Updates the observable in services to remove the interaction
      */

     // Preventing adding features to some layers
     if (true === this.actionActive[shapeType] ) {
        // The layer was on editing
        this.openLayersService.updateShapeEditType(null); //
        this.showSymbolPanel(false);
      }
      else {
        this.openLayersService.updateShapeEditType(shapeType);
      }
     this.highlightAction(shapeType);
   }

  highlightAction(action: string) {
    // update the current action
    this.actionActive[action] = !this.actionActive[action];
    // change the rest of interactions to false
    for (const key in this.actionActive ) {
      if ((key !== action) && (true === this.actionActive[key]))
      {
        this.actionActive[key] = !this.actionActive[key];
      }
    }
  }

  startEditAction(action: string){
    if (true === this.actionActive[action]) {
      this.openLayersService.updateEditAction(null);
    }
    else {
      this.openLayersService.updateEditAction(action);
    }
    this.highlightAction(action);
   }

  // identifyFeatures(){
    /**
     * Identify Feautures, the user select element(s) and the information is retrieved
     */
  /*  alert("add Code to identify Features");
   }
  copiarFeatures(){
    /**
     * Copiar Features, the user select element(s) and paste in the location when the click is released
     */
    //alert("add Code to copiar Features");
  /*}
  rotateFeatures(){
    /**
     * Rotate
     */
   // alert("add Code to rotate Features");
  /*}
  measureDistance(){
    /**
     * Measure Distance
     */
   /* alert("add Code to measure Distance");
  } */

  showSymbolPanel(visible: boolean, optHeader? : string): void{
    /**
     * Updates the observable that allows to show/hide the symbolPanel
     */
    if(optHeader){
      this.openLayersService.updateShowSymbolPanel({visible: visible});
    }else{
      this.openLayersService.updateShowSymbolPanel({visible: visible, optHeader: optHeader});
    }
   }

  deleteFeat(action: 'Delete'){
    /**
     * Updates the observable that allows to start deleting in the map,
     * highlight the button and unselect the others
     */
    if (true === this.actionActive.Delete ) {
          this.openLayersService.updateDeleteFeats(false); //
    }
    else {
      this.openLayersService.updateDeleteFeats(true);

    }
    this.highlightAction('Delete');
    }


  saveLayer(){
    /** Enable user to save edit in the layer being updated the observable to show the editing toolbar and
     */

      this.openLayersService.updateSaveCurrentLayer(true);
      // disable the button
      this.stopSave = true;
      // add a timeout to enable the button
      setTimeout(() => {
        this.stopSave = false;
      }, 10000);
  }
  saveAllLayer(){
    /** Enable user to save edit in all the layers
     */
    if (confirm('Wil je alle bewerkingen in alle lagen opslaan?')){
      this.openLayersService.updateSaveAllLayers(true);
      // disable the button
      this.stopSaveAll = true;
      // add a timeout to enable the button
      setTimeout(() => {
        this.stopSaveAll = false;
      }, 10000);
    }
  }


  ngOnInit(): void {
    this.isVisible$ = observableOf(false);
  }

  showToolbar(visible: boolean){
    /** Updates the observable to show the editing toolbar
     *  @param visible: boolean
     */
  this.isVisible$ = observableOf(visible);
  // hide the symbol panel
  if (!visible){
   this.showSymbolPanel(false);
  }
  for (let key in this.actionActive ) {
     if (true === this.actionActive[key])
      {
        this.actionActive[key] = !this.actionActive[key];
      }
    }
  }
}
