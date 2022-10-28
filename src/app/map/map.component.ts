import {AfterViewInit, Component, ElementRef, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition} from '@angular/material/snack-bar';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Subject, Subscription} from 'rxjs';
import {AppConfiguration} from '../app-configuration';
import 'ol/ol.css';
import {Map, View} from 'ol';
import {getArea, getDistance, getLength} from 'ol/sphere';
import {transform} from 'ol/proj';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';
import {Group as LayerGroup} from 'ol/layer';
import {platformModifierKeyOnly} from 'ol/events/condition';
import WFS from 'ol/format/WFS';
import GML from 'ol/format/GML';
import WMSCapabilities from 'ol/format/WMScapabilities.js';

import {click} from 'ol/events/condition.js';
import Overlay from 'ol/Overlay';
import {
  defaults as defaultInteractions,
  DragAndDrop,
  DragBox,
  DragPan,
  DragRotate,
  DragZoom,
  Draw,
  PinchRotate,
  PinchZoom,
  Select,
  Snap,
  Translate
} from 'ol/interaction';
import {LineString, Point, Polygon} from 'ol/geom';
import {Fill, Stroke, Style} from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import {GeoJSON, KML} from 'ol/format';
import ZoomSlider from 'ol/control/ZoomSlider';
import ScaleLine from 'ol/control/ScaleLine';
import {fromCircle} from 'ol/geom/Polygon';
import {touchOnly} from 'ol/events/condition';
import {OpenLayersService} from '../open-layers.service';
import {MapQgsStyleService} from '../map-qgs-style.service';
import {AuthService} from '../auth.service';
import {unByKey} from 'ol/Observable';
import {bbox as bboxStrategy} from 'ol/loadingstrategy';
import {toStringHDMS} from 'ol/coordinate';
import {QuestionService} from '../question-service.service';
import {QuestionBase} from '../question-base';
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogPopulationExposedComponent} from '../dialog-population-exposed/dialog-population-exposed.component';
import {DialogResultExposedComponent} from '../dialog-result-exposed/dialog-result-exposed.component';
import {request, gql} from 'graphql-request';
import {QueryDBService} from '../query-db.service';
import {DialogOrgExposedComponent} from '../dialog-org-exposed/dialog-org-exposed.component';
import {saveAs} from 'file-saver';
import { ThrowStmt } from '@angular/compiler';

// To use rating dialogs
export interface DialogData {
  layerList: any;
  layerNameDialog: string;
  rating: number;
  fieldNames: any;
  desc: string;
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Elements that make up the popup.
   */
  @Output() updateLayerList = new EventEmitter<any>();
  @ViewChild('popup', {static: false}) container: ElementRef;  // the variable here is container, popup the html element
  @ViewChild('content', {static: false}) content: ElementRef;
  @ViewChild('closer', {static: false}) closer: ElementRef;

  // Management of reactive forms
  @ViewChild(DynamicFormComponent)
  private dynamicFormComponent: DynamicFormComponent;

  questionsSubject: Subject<QuestionBase<string>[]> = new Subject<QuestionBase<string>[]>();
  showFormSubject: Subject<boolean> = new Subject<boolean>();
  groupsLayersSubject: Subject<{}> = new Subject<{}>();
  featureLayerForm: {};
  payload: any;
  formOpen = false;
  public existingProject = true;
  map: Map;
  view: View;
  srsID: any;  // ID of the SRS to be used in the map View
  wgs84ID = 'EPSG:4326';
  projectTitle: string;
  mapCanvasExtent: any;
  BBOX: any;
  mapCenterXY: number[] = [376987, 5710901];   // the center of the map in the project EPSG coordinates
  projectProjection: Projection;
  mapZoom: number = AppConfiguration.mapZoom;
  selectStyle: any;
  popExposedStyle: any;
  qgsProjectFile: string;
  qGsServerUrl: string;
  // map interactions
  draw: any;
  snap: any;
  modify: any;
  select: any = null;
  translate: any;
  pinchZoom: any;
  pinchRotate: any;
  dragPan: any;
  dragRotate: any;
  dragZoom: any;
  dragBox: any;
  dragAndDropInteraction: any;
  // the project selected by the user
  selectedProject: any;
  loadedWfsLayers = []; // [{layerName: 'uno', layerTitle: 'Layer 1'}, {layerName: 'dos', layerTitle: 'layer 2'}];
  loadedSketchLayers = [];
  groupsLayers: any[] = [];
  loadedWmsLayers = []; // [{layerName: 'uno', layerTitle: 'Layer 1'}, {layerName: 'dos', layerTitle: 'layer 2'}];
  formQuestions = [];
  curEditingLayer = null;
  curInfoLayer = null;   // a real OL layer object
  cacheFeatures = [];
  canBeUndo = false;
  editBuffer = [];   // Try one array for everything.
  layersGeometryType = {};
  layersOrder = [];
  featId = 1000;   // to have an internal identifier for features when editing
  private currentStyle: any;
  private currentClass: any;
  measureTooltipElement: any;   // The measure tooltip element.  * @type {HTMLElement}
  measureTooltip: any;
  /** Overlay to show the measurement. * @type {Overlay}  */
  helpTooltip: any; // The measure tooltip element.  * @type {HTMLElement}*/
  helpTooltipElement: any; // Overlay to show the measurement. * @type {Overlay}
  overlay: any;
  // variables to use modal dialog
  layerNameDialog: string;
  rating: number;
   // snackbar
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  // variables to use in the ranking dialog
  ranking: any;
  // subscriptions
  subsToShapeEdit: Subscription;
  subsTocurrentSymbol: Subscription;
  subsToSaveCurrentLayer: Subscription;
  subsToZoomHome: Subscription;
  subsToFindPopExposed: Subscription;
  subsToFindOrgExposed: Subscription;
  subsToSelectProject: Subscription;
  subsToAddSketchLayer: Subscription;
  subsToSaveAllLayers: Subscription;

  constructor(private mapQgsStyleService: MapQgsStyleService,
              private  openLayersService: OpenLayersService,
              private questionService: QuestionService,
              private queryDBService: QueryDBService,
              public auth: AuthService,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private sanitizer: DomSanitizer) {

    this.subsToShapeEdit = this.openLayersService.shapeEditType$.subscribe(
      data => {
        if (data != null) {
          this.enableAddShape(data);
        } else {
          this.removeInteractions();
        }

      },
      error => {
        console.log('Error in shapeEditType', error);
      }
    );
    this.subsTocurrentSymbol = this.openLayersService.currentSymbol$.subscribe(
      style => {
        this.changeSymbol(style);
      },
      error => {
        console.log('Error changing the style for drawing elements', error);
        // alert('Error changing the style, select a symbol');
      }
    );
    this.subsToSaveCurrentLayer = this.openLayersService.saveCurrentLayer$.subscribe(
      data => {
        if (data) {
          this.saveEdits(this.curEditingLayer);
        }
      }
      ,
      error => alert('Error saving layers' + error)
    );
    this.subsToSaveAllLayers = this.openLayersService.saveAllLayers$.subscribe(
      data => {
        if (data) {
          this.saveAllEdits();
        }
      }
      ,
      error => alert('Error saving layer ' + error)
    );

    this.subsToZoomHome = this.openLayersService.zoomHome$.subscribe(
      data => {
        if (data) {
          this.zoomToHome();
        }
      },
      error => alert('Error starting zooming Home' + error)
    );
    this.subsToFindPopExposed = this.openLayersService.findPopExposed$.subscribe(
      data => {
        if (data) {
          this.findPopExposed();
        }
      },
      error => alert('Error starting finding exposed people' + error)
    );

    this.subsToFindOrgExposed = this.openLayersService.findInstitutionsExposed$.subscribe(
      data => {
        if (data) {
          this.findOrgExposed();
        }
      },
      error => alert('Error starting finding exposed people' + error)
    );

    this.subsToSelectProject = this.openLayersService.qgsProjectUrl$.subscribe(
      data => {
        if (data) {
          this.updateSelectedProject(data);
        }
      },
      error => {
        console.log('Error in shapeEditType', error);
      }
    );

    this.subsToAddSketchLayer = this.openLayersService.addSketchLayer$.subscribe(
      data => {
        if (data) this.addNewSketchLayer(data);
      },
      error => {
        console.log('Error creating sketch layer', error);
      }
    );

    this.openLayersService.editAction$.subscribe(
      // starts an action and stop the others..is this ready with stop interactions?
      data => {
        this.removeInteractions();
        if (this.helpTooltip) {
          this.map.removeOverlay(this.helpTooltip);
          this.helpTooltipElement.innerHTML = '';
          this.helpTooltip = null;
        }
        if (data === null) {
          return;
        }
        switch (data) {
          case 'ModifyBox': {
            this.startTranslating();
            break;
          }
          case 'Rating': {
          // this.startRating();
            console.log ('rating quiet areas hidden');
            break;
          }
          case 'Rotate': {
            this.startRotating();
            break;
          }
          case 'Copy': {
            this.startCopying();
            break;
          }
          case 'Identify': {
            console.log('identifying?..');
            break;
          }
          case 'Delete': {
            this.startDeletingV0();
            break;
          }
          case 'MeasureLine': {
            this.startMeasuring('LineString');
            break;
          }
          case 'MeasureArea': {
            this.startMeasuring('Polygon');
            break;
          }
          case 'Undo': {
            this.undoLastEdit();
            break;
          }
          case 'RankingMeasures': {
            this.startRankingMeasures();
            break;
          }
        }
      },
      error => alert('Error implementing action on features' + error)
    );

    this.auth.userProfile$.subscribe(
      data => this.initializeUser(data),
      error => {
        console.log('Error retrieving user credentials', error);
        alert('Error during authentication, try later');
      });
  }


  initializeUser(userProfile: any) {
    // testing user credentials
    /**
     * initialize user credential from the Auth0 service
     * @params userProfile: profile of the user containing: nickname, name (email),picture, updated_at: date
     */

  }

  openDialogRankingMeasures(layerName: string, feature: any): void{
    /**
     * rank measures in action plab
     * @params layerName
     * @params @feature the feature selected for ranking (represents a location with predefined measures)
     */
    const ratingName =  layerName === 'massnahmen' ? 'Massnahmen Laute Orte' : 'Massnahmen Leise Orte';
    const fieldsNames =  AppConfiguration.ratingMeasureLayers[layerName];
    let fieldsToRank = []; // select those that have a true value
    fieldsNames.forEach(field  => {
     if (feature.get(field) === true) {
       fieldsToRank.push(field);
     }
    });
    // add sonstiges
    if (feature.get(AppConfiguration.fieldOther[layerName]) && feature.get(AppConfiguration.fieldOther[layerName]).length > 0){
        fieldsToRank.push(AppConfiguration.fieldOther[layerName]);
      }
    const measureDesc = feature.get(AppConfiguration.fieldDesc[layerName]);
    const dialogRef = this.dialog.open(DialogRatingMeasureDialog, {
      width: '24vw',
      data: {layerNameDialog: ratingName, fieldNames: fieldsToRank, desc: measureDesc, ranking: this.ranking}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.ranking = result;
      // unselect the feature in the map
      this.select.getFeatures().clear();
      if (result){
        this.saveRatingMeasures(layerName, feature, result);
      }

    });
  }

  openDialogResult(count: number, summary: any): void{
    // open a dialog to show org by district
    this.dialog.open(DialogResultExposedComponent, {
      width: '300px',
      data: {totalCount: count, summary}
    });
  }


  openDialog(layerName: string, feature: any): void{
    const ratingName = 'Leise Orte';
    const dialogRef = this.dialog.open(DialogRatingDialog, {
      width: '300px',
      data: {layerNameDialog: ratingName, rating: this.rating}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.rating = result;
      // unselect the feature in the map
      this.select.getFeatures().clear();
      if (result){
        // result is different to undefined
        this.saveRating(layerName, feature);
      }
    });
  }

  findOrgExposed(){
    /**
     * First do some checks, then call a function in the queryD service that executes the query by calling the DB API function
     * to find institutions exposed to certain range of noise
     */
    const lowlevel = 0;
    const highlevel = 0;
    const layerList = []; // layer constaining the institutions
    const noiseMapList = [];
    let selectedLayer: any;
    let selectedNoiseLayer: any;
    let noiseGroup: any;
    let orgGroup: any;
    // find the layers for institutions
    console.log('al menos entra?');
    this.map.getLayers().forEach(layer => {
      if (layer.get('name').toLowerCase() === AppConfiguration.institutionsGroupName.toLowerCase())  {
        orgGroup = layer;
        return;
      }
    });
    // validating group exists
    if (!orgGroup) {
      this.snackBar.open('Institutions maps not found', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    if (orgGroup) {
      orgGroup.getLayers().forEach(
        lyr  => {
          layerList.push(lyr.get('name'));
        });
    }
    // find the layers for noise
    this.map.getLayers().forEach(layer => {
      if (layer.get('name') === AppConfiguration.noiseGroupName) {
        noiseGroup = layer;
        return;
      }
    });

    if (noiseGroup) {
      noiseGroup.getLayers().forEach(
        lyr  => {
          noiseMapList.push(lyr.get('name'));
        });
    }
    if (!noiseGroup) {
      this.snackBar.open('Noise maps not found', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    const dialogInstitutionsExposed = this.dialog.open(DialogOrgExposedComponent, {
      width: '400px',
      data: {layerList, noiseMapList, lowlevel, highlevel, selectedLayer, selectedNoiseLayer}
    });

    dialogInstitutionsExposed.afterClosed().subscribe(data => {
      if (data){
        this.queryOrgExposedNoise(data) // selectedLayer, lowlevel and highlevel
        .then( r => this.processOrgLden(r));
      }
    });
  }

  async queryOrgExposedNoise(data: any){
    /**
     * First do some checks, then call a function in the queryD service that executes the query by calling the DB API function
     * to find institutions exposed to certain range of noise
     * @param data.selectedLayer: string --> name of layer
     * @param data.selectedNoiseLayer: string --> name of the noise map layer
     * @param data.lowLevel: number --> low level for the range
     * @param data.highLevel: number --> high level for the range
     */
    let layerName: string;
    // something was not selected
    if (!data.selectedLayer || !data.lowLevel || !data.highLevel || !data.selectedNoiseLayer){
      this.snackBar.open('Verify parameters', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    const lowLevel = + data.lowLevel;
    const highLevel = + data.highLevel;
    layerName = data.selectedLayer.toLowerCase() + '_' + data.selectedNoiseLayer.toLowerCase() + '_' + lowLevel + '_' + highLevel;
    // the high and lower do not fit
    if (lowLevel > highLevel) {
      this.snackBar.open('Lower level should be less than the higher level', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000});
      return;
    }
    // first get the group
    const groupSession = this.map.getLayers().getArray()
      .find(x => x.get('name').toLowerCase() === AppConfiguration.nameSessionGroup.toLowerCase());
    if (groupSession) {
      if (groupSession.getLayers().getArray().findIndex(x => x.get('name').toLowerCase() === layerName.toLowerCase()) >= 0){
        /* this.snackBar.open('This query was already computed, see the layer panel', 'ok',
          { horizontalPosition: 'center', verticalPosition: 'top',  duration: 5000});
        return; */ // --> old version
        const layer = this.findLayerWithGroup(layerName.toLowerCase(), AppConfiguration.nameSessionGroup.toLowerCase());
        this.map.removeLayer(layer);
      }
    }
    // execute the query
    this.snackBar.open('Berechnung wird ausgefuehrt - bitte warten', 'ok',
      { horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000});
    const result =  await this.queryDBService.getOrgExposed(data);
    return ({result, layerName});
  }

  findPopExposed(){
    const lowlevel = 0;
    const highlevel = 0;
    const layerList = [];  // ['straat', 'IVU', 'train'];  // temporal later pass the list from the group laemkarten
    let selectedLayer: any;
    let noiseGroup: any;
    // find the layers
    this.map.getLayers().forEach(layer => {
        if (layer.get('name') === AppConfiguration.noiseGroupName) {
          noiseGroup = layer;
          return;
       }
      });
    if (noiseGroup) {
      noiseGroup.getLayers().forEach(
         lyr  => {
           layerList.push(lyr.get('name'));
        });
     }
    const dialogPopExposed = this.dialog.open(DialogPopulationExposedComponent, {
      width: '400px',
      data: {layerList, lowlevel, highlevel, selectedLayer}
    });

    dialogPopExposed.afterClosed().subscribe(data => {
      if (data){
        this.queryDBPopNoise(data);  // selectedLayer, lowlevel and highlevel
      }
    });
  }

  queryDBPopNoise(data: any) {
    /**
     * executes the query calling the DB API function to find people exposure under certain range of noise
     * @param data.selectedLayer: string --> name of layer
     * @param data.lowLevel: number --> low level for the range
     * @param data.highLevel: number --> high level for the range
     */
    let query: any;
    let queryName: string;
    let layerName: string;
    const lowLevel = + data.lowLevel;
    const highLevel = + data.highLevel;
    layerName = 'Pop' + data.selectedLayer.toLowerCase() + '_' + lowLevel + '_' + highLevel;
    // something was not selected
    if (!data.selectedLayer || !data.lowLevel || !data.highLevel){
      return;
      this.snackBar.open('Verify parameters', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    // the high and lower do not fit
    if (lowLevel > highLevel) {
      this.snackBar.open('Lower level should be less than the higher level', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000});
      return;
    }
    // first get the group
     const groupSession = this.map.getLayers().getArray()
        .find(x => x.get('name').toLowerCase() === AppConfiguration.nameSessionGroup.toLowerCase());
    if (groupSession) {
        if (groupSession.getLayers().getArray().findIndex(x => x.get('name').toLowerCase() === layerName.toLowerCase()) >= 0){
         // remove from the map to recalculate
        const layer = this.findLayerWithGroup(layerName.toLowerCase(), AppConfiguration.nameSessionGroup.toLowerCase());
        this.map.removeLayer(layer);

      }
    }

    switch (data.selectedLayer.toLowerCase()) {
     case 'strassenlaerm_lden': {
      queryName = 'populationStrassenlaermLden';
      query = gql`
      query {
      populationStrassenlaermLden (dblow:` + lowLevel + ` dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id
        value
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;
      break;
   }
    case 'gesamtlaerm_lden': {
        // Gesamtlarm_LDEN
      queryName = 'populationGesamtlaermLden';
      query = gql`
      query {
      populationGesamtlaermLden (dblow: ` + lowLevel + `, dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id
        geom {
          geojson
          }
          value
       }
      }
    }
    `;

      break;
      }
   case 'industrielaerm_lden': {
        // Industrielaerm_LDEN
      queryName = 'populationIndustrielaermLden';
      query = gql`
      query {
      populationIndustrielaermLden (dblow:` + lowLevel + ` dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id
        value
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;
      break;
      }
      case 'industrielaerm_lnight': {
      // Industrielaerm_LNight
      queryName = 'populationIndustrielaermLnight';
      query = gql`
      query {
      populationIndustrielaermLnight (dblow:` + lowLevel + ` dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id
        value
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;
      break;
      }
      case 'strassenlaerm_lnight': {
        // Straassenlaerm_LNight
      queryName = 'populationStrassenlaermLnight';
      query = gql`
      query {
      populationStrassenlaermLnight (dblow:` + lowLevel + `, dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id
        value
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;

      break;
      }
      case 'zuglaerm_bogestra_lden': {
        // Zuglaerm_Bogestra_LDEN
        queryName = 'populationZuglaermBogestraLden';
        query = gql`
      query {
      populationZuglaermBogestraLden (dblow: ` + lowLevel + `, dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id
        value
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;
        break;
      }
      case 'zuglaerm_bogestra_lnight': {
        // Zuglaerm_Bogestra_LNight
        queryName = 'populationZuglaermBogestraLnight';
        query = gql`
      query {
      populationZuglaermBogestraLnight (dblow: ` + lowLevel + `, dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id
        value
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;

        break;
      }
      case 'zuglaerm_db_lden': {
        // populationZuglaermDbLden
      queryName = 'populationZuglaermDbLden';
      query = gql`
      query {
      populationZuglaermDbLden (dblow: ` + lowLevel + `, dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id
        value
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;
      break;
     }
    }

    this.snackBar.open('Berechnung wird ausgefuehrt - bitte warten', 'ok',
      { horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000});
    console.log('query data pop',query);
    // http://localhost:4200/graphql--> by proxy diverted to http://130.89.6.97:5000/graphql
     request('http://localhost:5000/graphql', query)
     // request('http://localhost:4200/graphql', query)   // debug time
      .then(result => {
        // console.log('data', result[queryName]);
        this.processPopLden(result[queryName], layerName );
      });
  }

  processOrgLden(dataLayerName: any) {
    /**
     * @params dataLayerName contains in an array both the data dnd the result.
     */
    if (!dataLayerName) {
     this.snackBar.open('There was an error while retrieving the data, contact the administrator', 'ok',
       { horizontalPosition: 'center',
         verticalPosition: 'top',
         duration: 10000});
     return;
    }
    const data = dataLayerName.result;
    const layerName = dataLayerName.layerName;

    if (data.totalCount === 0) {
      this.snackBar.open('Keine Institution gefunden.', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 10000});
      return;
    }

    const orgExposed = data.totalCount;
    // load the layer - creates a group if needed
    this.loadJsonPoint(data.nodes, layerName);
    // getting the schools by district
    const summary = this.summarizeOrgByDistrict(data.nodes, 'bezirkeName'); // try with the new fieldname
    this.openDialogResult(data.totalCount, summary);
   }

  summarizeOrgByDistrict(nodes: any, districName: string){
    /**
     * summarizes by district the org affected by certain noise levels
     * @param nodes a json array containing the result
     */
    let lookup = {}; // this gives unique values
    let items = nodes;
    let result = [];

    for (let i = 0;  i < items.length;i++) {
      const name = items[i][districName];
      if (!(name in lookup)) {
        lookup[name] = 1;
        result.push(name);
      }
      else {
        lookup[name] += 1;
      }
    }
    console.log ('items and result', items, lookup, result);
    // make an array to show in the dialog
    let arr = [];
    for (const key in lookup) {
      arr.push({ key, value: lookup[key]});
    }
    return arr;
  }

    processPopLden(data, layerName: string) {
     // initialize the popExposedStyle
     if (data.totalCount === 0) {
       this.snackBar.open('Nichts gefunden.', 'ok',
         { horizontalPosition: 'center',
           verticalPosition: 'top',
           duration: 10000});
       return;
     }
      // start to process the data, get the sum
      const popExposed = Math.round(data.nodes.reduce((sum, current) => sum + Number(current.value), 0) * 100 / 100);
      const popShare =  Math.round(popExposed / AppConfiguration.totalPopBochumArea * 100);
      // load the layer - creates a group if needed
      this.loadJson(data.nodes, layerName);
      // No need for a dialog, use  instead  a snackbar
      this.snackBar.open('Ungefaehre Bevoelkerung betroffen: ' +
        popExposed + '. Dies entspricht einem Anteil von: ' + popShare + '%. Raeumliche Ergebnisse sind in der Kartenuebersicht zu sehen.', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'bottom',
          duration: 60000});   // 60 seconds
    }

  loadJson(geoJsonArray: any, layerName: string) {
    // build features
    const features = [];
    geoJsonArray.forEach(f => {
      const geojson = JSON.parse(f.geom.geojson);
      const geoJsonNode =  {
          type: 'Feature',
          geometry: {
            type: geojson.type,
            coordinates: geojson.coordinates,
            value: f.value,
          },
         properties: {
          value: f.value,   // value is used in the style
          id: f.id
         }
        };
       features.push(geoJsonNode);
    });
    const geojsonObject = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: this.srsID,
        },
      },
      features
    };
    // set the style function using a mqgis service
    this.popExposedStyle = this.mapQgsStyleService.createStyleExposedPop();
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      name: layerName,
      style: this.popExposedStyle,
      visible: true,  // visible by default
      opacity: 0.5
    });
    // add the layer to the map
    const fieldstoShow = [{name: 'value', type: 'QString', typeName: 'varchar', comment: ''}];
    this.addSessionLayer(vectorLayer, fieldstoShow, false);
  }

  loadJsonPoint(geoJsonArray: any, layerName: string) {
    // build features
    const features = [];
    geoJsonArray.forEach(f => {
      const geojson = JSON.parse(f.geom.geojson);
      const geoJsonNode =  {
        type: 'Feature',
        geometry: {
          type: geojson.type,
          coordinates: geojson.coordinates,
          bezirkeName: f.bezirkeName,
        },
        properties: {
          bezirkeName: f.bezirkeName,   // value in this case is not used in the style
          id: f.id
        }
      };
      features.push(geoJsonNode);
    });
    const geojsonObject = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: {
          name: this.srsID,
        },
      },
      features
    };
    // set the style function
    const orgStyle = this.mapQgsStyleService.createStyleExposedOrg(layerName);
    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonObject),
    });
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      name: layerName,
      style: orgStyle,
      visible: true,
      });
    // add the layer to the map
    const fieldstoShow = [{name: 'id', type: 'QString', typeName: 'varchar', comment: ''},
                          {name: 'bezirkeName', type: 'QString', typeName: 'varchar', comment: ''},
                       //   {name: 'bezirkeId', type: 'QString', typeName: 'varchar', comment: ''},
                          ];
    this.addSessionLayer(vectorLayer, fieldstoShow, false);
  }

  addNewSketchLayer(sketchLayerName: string){
    /**
     * Adds a sketch layer to the panel to allow people "anotate noise map..."
     * multi-geometry --> all
     */
    // set style
    if (!sketchLayerName) {
      this.snackBar.open('Enter a valid name for sketch layer', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;

    }
    this.mapQgsStyleService.setSketchStyle(sketchLayerName);
    const self  = this;
    const newSource  = new VectorSource({wrapx: false});
    const newVector = new VectorLayer({
      source : newSource,
      name: sketchLayerName,
      zIndex : 101,   // check this #TODO
      visible: true,
      // getting default style
      style(feature) {    // this equiv to style: function(feature)
        let layerStyle = self.mapQgsStyleService.findJsonStyle(feature, sketchLayerName);
        if (!layerStyle) {
          layerStyle = self.mapQgsStyleService.findDefaultStyleProvisional(feature.getGeometry().getType(), sketchLayerName);
        }
        return (layerStyle);
      }
    });
    // add the layer to the map
    const fieldstoShow = [{name: 'detail', type: 'QString', typeName: 'varchar', comment: ''},
      {name: 'id', type: 'QString', typeName: 'varchar', comment: ''}];
    // fields to edit
    const fieldsToEdit = [{name: 'detail', type: 'QString', typeName: 'varchar', comment: ''}];
    this.addSessionLayer(newVector, fieldstoShow, true);
    // add tp the group of sketch layers
    this.loadedSketchLayers.push({
       layerName: sketchLayerName,
        // layerGeom,
        layerTitle: sketchLayerName,
        defaultSRS : AppConfiguration.srsName,
        operations: ['insert', 'modify', 'delete'],  // #Check  this #TODO
        geometryType: 'Multi', // Dependent of QGIS project as the styles.
        source: newSource
        });
     // set the questions for the form
    this.questionService.setSketchQuestions(sketchLayerName, fieldsToEdit);
  }

  addLayerGroupLayerPanel(layerName: any, fieldsToShow: any, sketch= false){
    // add configuration to the layer to be added in a group
    let newFeats = false;
    let geometryType = null;
    let removable = true;
    if (sketch) {
      newFeats = true;
      geometryType = 'multi';
      removable = false;  // test
    }
    const legend = this.mapQgsStyleService.getLegendSessionLayer(layerName);
    console.log('legend in addLayerGroupLayerPanel', legend);
    const layers = [];
    const layerItem = {
    layerName,
    layerTittle: layerName,
    fields: fieldsToShow,  // add a generic name
    geometryType,
    layerForNewFeatures: newFeats,
    layerForRanking: false,
    layerLegendUrl: null,   // que hacer aqui?
    legendLayer: legend,
    onEdit: false,
    onIdentify: false,
    onRanking: false,
    visible: true,   // visible by default
    wfs: false ,    // #TODO add forremove..
    removable,
    sketch  };  // sketch will be used to activate editing mode.. #TODO
    layers.push(layerItem);
    // group does not exist in the variable
    if (!(this.groupsLayers.findIndex(x => x.groupName === AppConfiguration.nameSessionGroup) >= 0 )){
      // add the group at the beginning
      this.groupsLayers.unshift({groupName: AppConfiguration.nameSessionGroup,
        groupTittle: AppConfiguration.nameSessionGroup,
        visible: true,  // group visible by default.. less clicks
        layers});
       this.groupsLayersSubject.next(this.groupsLayers);
      return;
    }
   // group does exists
    const group = this.groupsLayers.find(x => x.groupName === AppConfiguration.nameSessionGroup);
    group.layers.push(layerItem);
    this.groupsLayersSubject.next(this.groupsLayers);
  }

  removeSessionLayer(layerToRemove: any){
      const layerName =  layerToRemove.layer.layerName;
      const groupName = layerToRemove.groupName;
      this.map.getLayers().forEach(group => {
        if (groupName.toLowerCase() === group.get('name').toLowerCase()) {
          const layersInGroup = group.getLayers().getArray();
          const lyr = layersInGroup.find(x => x.get('name').toLowerCase() === layerName.toLowerCase());
          if (lyr) {
            lyr.setVisible(false);
            this.map.removeLayer(lyr);
            const index = layersInGroup.findIndex(x => x.get('name').toLowerCase() === layerName.toLowerCase());
            layersInGroup.splice(index, 1);
            }
        }
      });

      // remove the layer from the dict layerPanel
      const group = this.findGroupLayer(layerName);  // find the group of the layer :)
      console.log('group', group.layers, 'layerName', layerName);
      const indexInGroup = group.layers.findIndex(x => x.layerName.toLowerCase() === layerName.toLowerCase());
      console.log('layername', layerName, 'indexInGroup antes', indexInGroup, 'grouplayers', this.groupsLayers);
      group.layers.splice(indexInGroup, 1);
      console.log('indexInGroup despues', indexInGroup, 'grouplayers', this.groupsLayers);
      this.groupsLayersSubject.next(this.groupsLayers);
      return;
    }

  addSessionLayer(layer: any, fieldstoShow: any, sketch = false){
  /**
   *   Add a layer in a 'session group', layers are sketch or queries result
   *   @param: layer with the vector source associated
   */
  // check if group exist
  if (!(this.map.getLayers().getArray()
    .findIndex(x => AppConfiguration.nameSessionGroup.toLowerCase() === x.get('name').toLowerCase()) > 0)){
      // group does not exist, create it.
      const newGroup = new LayerGroup({
        name: AppConfiguration.nameSessionGroup,
        layers: [],
        visible: true,    // visible by default
        zIndex: 100 // at the end of the layers by default
      });
      this.map.addLayer(newGroup);
      layer.setZIndex(newGroup.getZIndex() + 1);
      newGroup.getLayers().push(layer);
      this.addLayerGroupLayerPanel(layer.get('name'), fieldstoShow, sketch);
      return;
    }
  // group does exist
  try{
    let group: any;
    this.map.getLayers().forEach(
      grp => {
        if (grp.get('name').toLowerCase()  === AppConfiguration.nameSessionGroup.toLowerCase()){
          group = grp;
        }
      });
    // add the layer
     const layerIndex = group.getLayers().length;
    layer.setZIndex(group.getZIndex() + layerIndex);
    group.getLayers().push(layer);
    this.addLayerGroupLayerPanel(layer.get('name'), fieldstoShow, sketch);
  }
  catch (e) {
    this.snackBar.open('Error adding results', 'ok',
      { horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 5000});
    return;
  }
  }

  saveRating(layerName: string, feature: any){
    // update the database
    const attrRanking = AppConfiguration.ratingPrex[layerName] + this.rating.toString();
    const newRating = feature.get(attrRanking) + 1; // the number of times that people ranked with 3, 4, 5 starts;
    // assign attributes
    feature.set(attrRanking, newRating);
    // add the changes to the edit buffer
    this.saveFeatinBuffer(this.curEditingLayer.layerName, feature, 'rating');
  }

  saveRatingMeasures(layerName: string, feature: any, rating: any){
    /**
     * saves in the DB the rating given to a measure.
     * a 0 value is below the minimum so its not considered as a valid vote.
     * @param layerName: the name of the layer being rated
     * @feature the geomtry feature associated to the rating
     * @rating the rating values as entered in the form
     */
    for (const key in rating) {
       if (key !== 'sonstiges') {
            feature.set(key + '_rank', rating[key]);
      }
    }
    if (rating.sonstiges){
      // this accumulate the voting.
        feature.set('sonstiges', this.replaceNull(rating.sonstiges));
    }

    this.saveFeatinBuffer(layerName, feature, 'rating');
    }

  startRating(){
    /**
     * Allows editing only the attributes of a layer
     * designed to work well with polygons layers
     * it uses a selecting interaction, get the element and show a form to update its attributes...
     */
    // checking that there is a layer being edited
    if (!this.curEditingLayer) {
      // this condition will be never held.. but...
      this.snackBar.open('Error retrieving current layer on edit', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    // checking that layer can be ranked.. this is in AppConfiguration
    if (!AppConfiguration.ratingPrex[this.curEditingLayer.layerName]) {
    this.snackBar.open('Current layer is not available for rating', 'ok',
    { horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 5000});
    return;
     }

    const lyr = this.findLayer(this.curEditingLayer.layerName);
    if (lyr === null) {
      this.snackBar.open('Error retrieving layer', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    this.removeInteractions();
    // add an interaction for selection
    this.select = new Select({
      layers: [lyr],   // avoid selecting in other layers..
      condition: click,  // check if this work on touch
      hitTolerance: 7,    // check if we should adjust for # types of geometries..
      style: this.selectStyle,
    });
    this.map.addInteraction(this.select);
    this.select.on('select', (e) => {
      const selectedFeatures = e.target.getFeatures().getArray();
      if (selectedFeatures.length <= 0) {
        this.snackBar.open('No features selected', 'ok',
          { horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000});
        return;
      }
      this.openDialog( this.curEditingLayer.layerName, selectedFeatures[0]);
    });
  }
  updateSelectedProject(qgsProject: any){
    // get the var from the selection List
    if (qgsProject.file.length > 0) {
      this.qgsProjectFile = qgsProject.file;
      this.qGsServerUrl = qgsProject.qGsServerUrl;
      this.srsID = qgsProject.srsID;
      this.updateMap(this.qgsProjectFile);
      return;
    }
  }

 requestProjectInfo(qgsfile: string){
    const strRequest = this.qGsServerUrl + 'service=WMS&request=GetProjectSettings&MAP=' + qgsfile;
    const projectSettings = fetch(strRequest)
     .then(response => response.text())
     .then (data => {
         this.parseQgsProject(data).then(() => {
          this.updateMapView();
          // #TODO check if we should use a promise here, create styles then load wfs layers
          this.workQgsProject();
          this.setIdentifying();
         });
     }
       )
     .catch(error => console.error(error));
  }

  async parseQgsProject(gqsProjectinfo: any){
    /**
     * The styles for WFS layers are called from here
     */
    const xmlParser = new DOMParser();
    const xmlText = xmlParser.parseFromString(gqsProjectinfo, 'text/xml');
    const WFSLayers = xmlText.getElementsByTagName('WFSLayers')[0];
    const wfsLayerList = [];
    if (WFSLayers !== undefined) {
      for (let k = 0; k < WFSLayers.getElementsByTagName('WFSLayer').length; k++) {
        wfsLayerList.push(WFSLayers.getElementsByTagName('WFSLayer')[k].getAttribute('name'));
      }
    }
    const rootLayer = xmlText.getElementsByTagName('Layer')[0];
    // get the CRS in EPSG format, there might be several CRS, look for the BBOX defined for the prefered EPSG define in the projlist
    // Projected Bounding box
    if (rootLayer.getElementsByTagName('CRS').length > 1) {
      // the epsg code comes in the second place in the list

      let projBBOX : Element = null;
      const projectSRID = AppConfiguration.srsName.toUpperCase();

      for (let i = 0; rootLayer.getElementsByTagName('BoundingBox').length ; i++){
        const bbox = rootLayer.getElementsByTagName('BoundingBox')[i];
        const crs = bbox.getAttribute('CRS').toUpperCase()
        if( crs === projectSRID){
          projBBOX = bbox;
          break;
        }
      }
      if(projBBOX === null ){
        throw new Error("no bbox definition for CRS " + this.srsID + " found in WMS project description")
      }

      this.mapCanvasExtent = [Number(projBBOX.getAttribute('minx')), Number(projBBOX.getAttribute('maxx')),
        Number(projBBOX.getAttribute('miny') ), Number(projBBOX.getAttribute('maxy'))];
      this.srsID = projBBOX.getAttribute('CRS');

      //this.mapCanvasExtent = [370299.727 , 381831.667,
      //5707535.077, 5715063.531];
      proj4.defs(this.srsID, AppConfiguration.projDefs[this.srsID.replace(/\D/g, '')]);
      register(proj4);
    }
    else {
       const BBOX = rootLayer.getElementsByTagName('EX_GeographicBoundingBox')[0];
       const westBoundLongitude = Number(BBOX.getElementsByTagName('westBoundLongitude')[0].childNodes[0].nodeValue);
       const eastBoundLongitude = Number(BBOX.getElementsByTagName('eastBoundLongitude')[0].childNodes[0].nodeValue);
       const southBoundLatitude = Number(BBOX.getElementsByTagName('southBoundLatitude')[0].childNodes[0].nodeValue);
       const northBoundLatitude = Number(BBOX.getElementsByTagName('northBoundLatitude')[0].childNodes[0].nodeValue);
       this.srsID = 'EPSG:4326';
       this.mapCanvasExtent = [westBoundLongitude, eastBoundLongitude, northBoundLatitude, southBoundLatitude];
     }
    const nGroups = rootLayer.getElementsByTagName('Layer').length;
    const layerList = xmlText.querySelectorAll('Layer > Layer');
    for (let i = 0; i < rootLayer.getElementsByTagName('Layer').length; i++) {
      const node = layerList[i];
      if (node.getElementsByTagName('Layer').length > 0) {
        const groupName = layerList[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue;
        const groupTittle = layerList[i].getElementsByTagName('Title')[0].childNodes[0].nodeValue;
        const layersinGroup = layerList[i].querySelectorAll('Layer > Layer'); // devuelve in node
        const listLayersinGroup = [];
        for (let j = 0; j < layersinGroup.length; j++) {
          let layerIsWfs = false;
          let layerForRanking = false;
          let layerForNewFeatures = true;
          const layer = layersinGroup.item(j);
          const geometryType = layer.getAttribute('geometryType');
          const layerName = layer.getElementsByTagName('Name')[0].childNodes[0].nodeValue;
          const layerTittle = layer.getElementsByTagName('Title')[0].childNodes[0].nodeValue;
          const urlResource = layer.querySelector('OnlineResource').getAttribute('xlink:href');
          const legendLayer = await this.createLegendLayer(urlResource, layerName);
          const fields = [];
          if (wfsLayerList.find(element => element === layerName)) {
            layerIsWfs = true;
            // check if more elements can be added
            if (AppConfiguration.noAddingFeatsLayers.findIndex(element => element === layerName) > -1) {
              layerForNewFeatures = false;  // the edit icon will not appear;
             }
            // get the editable attributes
            const attrs = layer.getElementsByTagName('Attributes')[0];
            for (let k = 0; k < attrs.getElementsByTagName('Attribute').length; k++) {
              const field = attrs.getElementsByTagName('Attribute')[k];
              fields.push({
                typeName: field.getAttribute('typeName'),
                editType: field.getAttribute('editType'),
                precision: field.getAttribute('precision'),
                type: field.getAttribute('type'),
                length: field.getAttribute('length'),
                name: field.getAttribute('name'),
                comment: field.getAttribute('comment')
              });
            }
            // check if layer is available for rating
            if (AppConfiguration.ratingMeasureLayers[layerName]) {
              layerForRanking = true;
            }
          }
          listLayersinGroup.push({
            layerName,
            layerTittle,
            layerLegendUrl: urlResource,
            legendLayer,
            wfs: layerIsWfs,
            geometryType,
            onEdit: false,
            onIdentify: false,
            onRanking: false,
            visible: false,
            layerForRanking,
            layerForNewFeatures,
            fields
          });
        }
        // get url for wms, wfs, getLegend and getStyles
        this.groupsLayers.push({
        groupName,
        groupTittle,
        visible: false,
        layers: listLayersinGroup
        });
      }
    }

    // get the styles for WFS layers
    if (wfsLayerList.length > 0) {
      this.mapQgsStyleService.createAllLayerStyles(this.qGsServerUrl, this.qgsProjectFile, wfsLayerList);
    }
    // update the observable for layerPanel
    this.groupsLayersSubject.next(this.groupsLayers);
    this.questionService.setQuestions(this.groupsLayers);
    this.mapQgsStyleService.createLegendSessionLayers();
  }

  updateMap(qgsfile: string) {
    this.requestProjectInfo(qgsfile);
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

  createIconSymbols(iconSymbols: any, layerName: any): any{
    if (iconSymbols.nodes.length === 0) {
       // layer does not have symbols, raster
      return ([{iconSrc: this.sanitizeImageUrl(AppConfiguration.rasterIcon), title: layerName}]);
    }
    const symbolList = [];
    iconSymbols.nodes.forEach(
      icon => {
        if (icon.hasOwnProperty('icon')){
          if (icon.icon !== ''){
            symbolList.push({iconSrc: 'data:image/png;base64,' + icon.icon, title: icon.title});
           }
          else {
            // workaround issue with OSM in GECCO
            symbolList.push({iconSrc: this.sanitizeImageUrl(AppConfiguration.rasterIcon), title: layerName});
          }
        }
        if (icon.hasOwnProperty('symbols')){
          // it has an array of symbols
          icon.symbols.forEach(symbol => {
            if (symbol.title.length > 0 ) {
              symbolList.push({iconSrc: 'data:image/png;base64,' + symbol.icon, title: symbol.title});
            }
          });
        }
      });
    return(symbolList);
  }

  async createLegendLayer(urlResource: any, layerName: any){
    /**
     * Creates the legend nodes for each layer
     */
     // expresion regular para cubrin png and jpg
     const re = /([image/])*(?:jpeg|png)/g;
     const url = urlResource.replace(re, 'application/json');
     const legend =  fetch (url)
           .then(response => response.json())// the return is implicit
           .then(json => {
              const symbols = this.createIconSymbols(json, layerName);
              return (symbols);
              })
           .then (symbols => symbols)
           .catch(error => console.log ('Error retrieving symbology', error));
     return legend;
  }

ngOnInit(): void {
    // initialize the map
    this.initializeMap();
  }

setIdentifying() {
    this.map.on('singleclick', (evt) => {         // this was click, still needs to be tested in a touch
      if (evt.dragging) {
        return;
      }
      if (!this.curInfoLayer){    // undefined or null?
        return;
      }
      this.container.nativeElement.style.display = 'block';
      if (this.curInfoLayer.getSource() instanceof ImageWMS ) {
        this.displayFeatureInfoWMS(evt);
        return;
      }
      if (this.curInfoLayer.getSource() instanceof VectorSource) {
        this.displayFeatureInfoWFS(evt);
      }
    }); //  search around 10 css pixels
    // set the pointer
    this.map.on('pointermove', (evt) => {
      if (evt.dragging){
        return;
      }
      if (!this.curInfoLayer){    // undefined or null?
        return;
      }
      const  layerOnIdentifyingName = this.curInfoLayer.get('name');  // this.curInfoLayer is an OL layer object
      const pixel = this.map.getEventPixel(evt.originalEvent);
      const hit = this.map.forEachLayerAtPixel(
        pixel,
        () => { return true; },
        {
          layerFilter(layer) {
          return layer.get('name').toLowerCase() === layerOnIdentifyingName.toLowerCase();  // to search only in the active layer
        },
          hitTolerance: 2
        });
      this.map.getTargetElement().style.cursor = hit ? 'pointer' : '';
   });
  }

changeSymbol(style: any) {
    /**
     *  updates the class style and class (not being use now for the element being edited)
     *  @param style: the symbol (value) in OL style format and the key (class - not being used now?)
     *
     */
    if (style === null){
      this.currentStyle = null;
      this.currentClass = null;
      return;
    }

    this.currentStyle = style.value;
    this.currentClass = style.key;
  }

initializeMap() {
    // customized pinch interactions
    this.pinchZoom = new PinchZoom({constrainResolution: true});
    this.pinchRotate = new PinchRotate({constrainResolution: true});
    this.dragPan = new DragPan();
    this.dragRotate = new DragRotate();
    this.dragZoom = new DragZoom();
    this.dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [
        GeoJSON,
        KML,
      ]
    });
    this.map = new Map({
       interactions: defaultInteractions({constrainResolution: true}),  // , pinchZoom: false, pinchRotate: false})
       target: 'map',
      view: new View({
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 3
      })
    });
    // initialize the select style
    this.selectStyle = new Style({
      stroke: new Stroke({color: 'rgba(255, 154, 131,0.9)', width: 2, lineDash: [5, 2]}),    // #EE266D
      fill: new Fill({color: 'rgba(234, 240, 216, 0.8)'}),   // 'rgba(0, 0, 0, 0.01)'
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({color: 'rgba(255, 154, 131, 0.1)'}),
        stroke: new Stroke({color: '#EE266D', width: 2, lineDash: [8, 5]})
      })
    });

    this.pinchZoom = this.map.getInteractions().getArray().find(interaction => interaction instanceof PinchZoom );
    this.pinchZoom.on('change', () => {
   });
    this.pinchZoom.on('change', () => {
 });
  }

  createHelpTooltip() {
    /**
     * Creates a new help tooltip
     */
    if (this.helpTooltipElement) {
      this.helpTooltipElement.parentNode.removeChild(this.helpTooltipElement);
    }
    this.helpTooltipElement = document.createElement('div');
    this.helpTooltipElement.className = 'ol-tooltip hidden';
    this.helpTooltip = new Overlay({
      element: this.helpTooltipElement,
      offset: [15, 0],
      positioning: 'center-left',
    });
    this.map.addOverlay(this.helpTooltip);
  }

createMeasureTooltip() {
    /**
     * Creates a new measure tooltip
     */
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [ 0, -15],
      positioning: 'bottom-center',
      stopEvent: false,
      insertFirst: false
    });
    this.map.addOverlay(this.measureTooltip);
  }

updateMapView() {
    /** Uses the map extent and projection written in the Qgs project (this.mapCanvasExtent [xmin, xmax, ymin, ymax])
     * to update the mapView after the map initialization.
     *  To do that creates to point and calculate the center.
     */
      // get a center for the map
    const leftMinCorner = new Point([this.mapCanvasExtent[0], this.mapCanvasExtent[2]]);
    const rightMinCorner = new Point([this.mapCanvasExtent[1], this.mapCanvasExtent[2]]);
    const leftMaxCorner = new Point([this.mapCanvasExtent[0], this.mapCanvasExtent[3]]);
     const hDistance = getDistance(transform(leftMinCorner.getCoordinates(), this.srsID, this.wgs84ID),
      transform(rightMinCorner.getCoordinates(), this.srsID, this.wgs84ID));
    const vDistance = getDistance(transform(leftMaxCorner.getCoordinates(), this.srsID, this.wgs84ID),
      transform(leftMinCorner.getCoordinates(), this.srsID, this.wgs84ID));
    this.mapCenterXY = [this.mapCanvasExtent[0] + hDistance / 2, this.mapCanvasExtent[2] + vDistance / 2];
    this.view = new View({
      center: [this.mapCenterXY[0], this.mapCenterXY[1]],  // [-66,10] ,
      zoom: AppConfiguration.mapZoom, // this.mapZoom,
      minZoom: AppConfiguration.minZoom,
      maxZoom: AppConfiguration.maxZoom,
      projection: this.srsID
    });
    this.map.setView(this.view);
    this.map.addControl(new ZoomSlider());
    this.map.addControl(new ScaleLine());
   }

ngAfterViewInit() {
    /**
     * Create an overlay to anchor the popup to the map.
     */
    this.overlay = new Overlay({
      element: this.container.nativeElement,
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });
    this.map.addOverlay(this.overlay);
    // to close the popup
    this.closer.nativeElement.onclick = () => {
      this.overlay.setPosition(undefined);
      this.closer.nativeElement.blur();
      return false;
    };
  }

zoomToHome() {
    /**
     * Centers the map canvas view to the center and zoom specified in the Qgsprojec file extent and the appConfiguration
     */
    this.map.getView().setRotation(0);
    this.map.getView().setZoom(AppConfiguration.mapZoom);
    this.map.getView().setCenter([this.mapCenterXY[0], this.mapCenterXY[1]]);
  }

prepareLoadWMSLayers(qGsServerUrl: string, capRequest: string, qGsProject: string ){
  const wmsVersion = 'SERVICE=WMS&VERSION=' + AppConfiguration.wmsVersion;
  const urlWMS = qGsServerUrl + wmsVersion + capRequest + qGsProject;
  let parser: any;
  parser = new WMSCapabilities();
  fetch(urlWMS)
    .then(response => {
      return response.text();
    })
    .then(text => {
      const xmlWMStext = parser.read(text);
      this.loadWMSlayers(qGsServerUrl + wmsVersion + qGsProject, xmlWMStext);
   this.reorderingGroupsLayers();
      return (xmlWMStext);
    })
    .catch(error => console.error(error));
}

workQgsProject() {
    /** Retrieves the capabilities WFS and WMS associated to the qgis project listed in AppConfiguration
     * it send these capabilities to other functions to load the WMS and WFS layers
     */
    const qGsProject = '&map=' + this.qgsProjectFile;
    const qGsServerUrl = this.qGsServerUrl;
    const capRequest = '&REQUEST=GetCapabilities';
    const wfsVersion = 'SERVICE=WFS&VERSION=' + AppConfiguration.wfsVersion;
    const urlWFS = qGsServerUrl + wfsVersion + capRequest + qGsProject;
    fetch(urlWFS)
      .then(response => response.text())
      .then(text => {
        this.loadWFSlayers(text);
       return (text);
      })
      .then( text => this.prepareLoadWMSLayers(qGsServerUrl, capRequest, qGsProject))
      .catch(error => console.error(error));
  }

reorderingGroupsLayers() {
   /*
     *  Moves the groups and allocate layers on it according to the order in the project
     *  @param groups: contain the groups for which layers will be ordered
     */
    const nGroups = this.groupsLayers.length;
    let nLysInGrp = 0;
    this.groupsLayers.forEach(group => {
    this.map.getLayers().forEach(layer => {
        if (layer.get('name') === group.groupName) {
          const grpZIndex = (nGroups - this.groupsLayers.indexOf(group)) * 10;
          layer.setZIndex(grpZIndex);
          // order layers inside the group
          if (layer.getLayers().array_.length > 0) {
            nLysInGrp = layer.getLayers().array_.length;  // numbers of layers in the
            layer.getLayers().forEach(lyrInGrp => {
              lyrInGrp.setZIndex(grpZIndex - (group.layers.findIndex(x => x.layerName === lyrInGrp.get('name')) + 1));  // will work until 10 layers/group
            });
          }
        }
      });
    });
  }

loadWMSlayers(urlWMS: string, xmlCapabilities: WMSCapabilities) {
    /**
     * Loads the layers in the QGS project from a OL xmlCapabilities file
     * @param urlWMS the url address of the geo webserver and WMS service
     * @param XmlCapText: OL WMSCapabilities
     */
    try {
      if (!xmlCapabilities.Capability.Layer.Layer) {
        // console.log('no layers in WMS');
        return;
      }
      const layerList = xmlCapabilities.Capability.Layer.Layer;
      layerList.forEach(layer => {
      if (this.loadedWfsLayers.findIndex(x => x.layerName.toLowerCase() === layer.Name.toLowerCase()) === -1) {
          if (!layer.hasOwnProperty('Layer')) {
            // it is a simple WMS layer without a group
            const WMSSource = new ImageWMS({
              url: urlWMS,
              params: {LAYERS: layer.Name},
              serverType: 'qgis',
              crossOrigin: null
            });
            const WMSLayer = new ImageLayer({
              source: WMSSource,
              name: layer.Title
            });

            this.addWebServLayer(layer.Title, WMSLayer);
            this.loadedWmsLayers.push({
              layerName: layer.Name,
              layerTitle: layer.Title,
              source: WMSSource
            });
            return;
          }
          if (layer.Layer.length > 0) {
            // layer is a group and has layers in an array
            layer.Layer.forEach(lyr => {
              if (this.loadedWfsLayers.findIndex(x => x.layerName.toLowerCase() === lyr.Name.toLowerCase()) === -1) {
               const WMSSource = new ImageWMS({
                 url: urlWMS,
                 params: {LAYERS: lyr.Name},
                 serverType: 'qgis',
                 crossOrigin: null
               });
               const WMSLayer = new ImageLayer({
                 source: WMSSource,
                 name: lyr.Title,
                 visible: false
               });
               this.addWebServLayer(lyr.Title, WMSLayer);
               this.loadedWmsLayers.push({
                 layerName: lyr.Name,
                 layerTitle: lyr.Title,
                 source: WMSSource
               });
             }
            });
          }
        }
      });
     } catch (e) {
      alert('Error loading WMS layers, please check the QGIS project configuration');
    }
  }

addWebServLayer(layerName: any, webServlayer: any) {
    // find the layer in a group
    let groupName = '';
    let groupLayer: any;
    this.groupsLayers.forEach(group => {
      if (group.layers.findIndex(lyr => lyr.layerName.toLowerCase() === layerName.toLowerCase()) > -1)   // findIndex return -1 if not found
      {
        groupName = group.groupName;
      }
    });
    // the layer is the group (WMTS case), add it to the map and return
    if (this.groupsLayers.findIndex(x => x.layerName === layerName) > -1 && groupName === '') {
      // the layer is a group and i does not exist
      const newGroup = new LayerGroup({
        name: layerName,
        layers: [],
        visible: false,
      });
      this.map.addLayer(newGroup);
      return;
    }
    // the layer is not in a group, add it to the map and return
    if (groupName === '') {
      this.map.addLayer(webServlayer);
      return;
    }
    // the layer was in a group and the group does exist
    this.map.getLayers().forEach(lyr => {
      if (lyr.get('name').toLowerCase() === groupName.toLowerCase()) {
        groupLayer = lyr;
        return;
      }
    });
    if (groupLayer) {  // Group exist
      groupLayer.getLayers().push(webServlayer);
      return;
    }
    // the layer was in a group and the group does not exist ==> lets create it
    const newGroup = new LayerGroup({
      name: groupName,
      layers: [webServlayer],
      visible: false,
    });
    this.map.addLayer(newGroup);
  }

getEditingStyle() {
    const editingstyle = [
      new Style({
        fill: new Fill({
          color: 'rgba(153, 202, 255, 0.5)'
        }),
        stroke: new Stroke({
          color: 'blue',
          width: 2,
          lineDash: [8, 10]
        }),
        image: this.imageCircle(15)
      }),
      new Style({
        image: this.imageCircle(10)
      }),
      new Style({
        image: this.imageCircle(5)
      })
    ];
    return editingstyle;
  }

imageCircle(radius) {
    return new CircleStyle({
      stroke: new Stroke({
        color: 'red', width: 2
      }),
      radius  // equivale a radius: radius
    });
  }

  updateFormQuestions(questionsData: any, layerName: any, feature: any){
  this.featureLayerForm = { layerName, feature };
  this.questionsSubject.next(questionsData);
  }

popAttrForm(layer: any, feature: any) {
  /**
   * Builds and fires a form according to the editable attriibute of the layer
   * it fires a virtual keyboard for text and slidebar for number
   * @param layer: the layer including source and everythin
   * @param feature: the feature just added in the map
   */
  try {
    this.formOpen = true; // test
    // highlight the element
    this.select = new Select({
      condition: click,  // check if this work on touch
      layers: [layer],   // check if tis works
      hitTolerance: 7, // check if this is enough
    });
    this.map.addInteraction(this.select);
    const selectedFeatures = this.select.getFeatures();
    selectedFeatures.push(feature);
    this.select.dispatchEvent('select');
    // triggering the form
    this.formQuestions = this.questionService.getQuestions(layer.layerName);
    this.updateFormQuestions(this.formQuestions, layer.layerName, feature);
    this.updateShowForm(true);
  }
  catch
    (e) { alert('Error initializing form' + e);  }
  }


updateShowForm(showForm: boolean) {
  this.showFormSubject.next(showForm);
}

getFormData(data: any) {
 this.updateShowForm(false);
  // enable adding features
  this.formOpen = false;
  // unselect the feature in the map
  this.select.getFeatures().clear();
  // assign attributes
  this.addingAttrFeature(data.layerName, data.feature, data.payload);
    // save in the buffer
  this.saveFeatinBuffer(data.layerName, data.feature, 'insert');
}

addingAttrFeature(layerName: string, feature: any,  attr: any){
  // find the layer in groups to get the editable fields
  const tlayer = this.findLayerinGroups(layerName);
  const fields = tlayer.fields;
  if (attr !== 'undefined') {
    for (const key in attr) {
      const type = fields.find(x => x.name === key).type;
      feature.set(key, this.mapAttribute(type, attr[key]));
    }
  }
  return (feature);
}

mapAttribute(type: string, value: string){
  /**
   * Maps the string vlaues from the form to values in their type to insert into a table;
   */
  let tvalue = null;
  switch (type) {
    case 'bool': {
      tvalue = (/true/i).test(value); // returns true, I gues that false in any other case
      break;
    }
    case 'QString': {
      tvalue = value.trim().toLowerCase();
      break;
    }
    case 'int': {
     tvalue = + value; // parse to int https://stackoverflow.com/questions/14667713/how-to-convert-a-string-to-number-in-typescript
     break;
    }
    case 'double': {
     tvalue = + value;  // parse to int https://stackoverflow.com/questions/14667713/how-to-convert-a-string-to-number-in-typescript
     break;
    }
  }
  return tvalue;
  }
saveFeatinBuffer(layerName: string, feature: any, operation: string){
  /**
   * @param operation: 'insert' or 'update'
   */
  // find layer
  let tlayer: any;
  // find layer in sketch layers..
  tlayer = this.findWfsLayer(layerName);
  if (!tlayer) {
    tlayer = this.findSketchLayer(layerName);
    if (!tlayer) {
      alert('Layer not found in saving');
    }
  }
  // get data source
  const layerSource = tlayer.source;
  this.editBuffer.push({
    layerName,
    transaction: operation,
    feats: feature,
    dirty: true,    // dirty is not in the WFS
    source: layerSource
  });

  this.canBeUndo = true;
  this.cacheFeatures.push({
    layerName,
    transaction: operation,
    feats: feature,
    dirty: true,    // dirty is not in the WFS
    source: layerSource
  });
 }

enableAddShape(shape: string) {
    /** enable the map to draw shape of the Shapetype
     * @param shape: string, type of shape to add e.g., 'POINT', 'LINE', 'CIRCLE'
     */
   if (!this.curEditingLayer) {   // velid for null and undefined
      alert('No layer selected to edit');
      return;
    }
    // the layer is not available for addingnewFeatures
    if (AppConfiguration.noAddingFeatsLayers.findIndex(x => x.toLowerCase() === this.curEditingLayer.layerName.toLowerCase()) >= 0){
      this.snackBar.open('No more elements can be added to this layer', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000});
      return;
    }
    const self = this;
    const tsource = this.curEditingLayer.source;
    let type: any;
    let geometryFunction: any;
    this.removeInteractions();  // remove select, modify, delete interactions
    try {
      switch (shape) {
        case 'Point': {
          this.draw = new Draw({
            source: tsource,
            type: shape,
            freehand: false,
            stopClick: true,    // not clicks events will be fired when drawing points..
            style: this.getEditingStyle()
          });
         break;
        }
        case 'LineString': {
          this.draw = new Draw({
            source: tsource,
            type: shape,
            freehand: true,
            stopClick: true,    // not clicks events will be fired when drawing points..
            style: this.getEditingStyle(),
           });
          this.removeDragPinchInteractions();  // to fix the zig zag lines #TODO test it
          break;
        }
        case 'Polygon':
        case 'Multipoligon':
        case 'MultipolygonZ': {
          this.draw = new Draw({
            source: tsource,
            type: shape,
            freehand: true,
            stopClick: true,    // not clicks events will be fired when drawing points..
            style: this.getEditingStyle(),
            condition: olBrowserEvent => {
              if (olBrowserEvent.originalEvent.touches) {   // #T
                return olBrowserEvent.originalEvent.touches.length < 2;
              }
              return false;
            }
          });
          break;
        }
        case 'Square': {
          this.draw = new Draw({
            source: tsource,
            type: shape,
            freehand: true,
            stopClick: true,
            style: this.getEditingStyle(),
            condition: olBrowserEvent => {
              if (olBrowserEvent.originalEvent.touches) {
                return olBrowserEvent.originalEvent.touches.length < 2;
              }
              return false;
            }
          });
          break;
        }
        case 'Circle': {
          this.draw = new Draw({
            source: tsource,
            type: shape,
            freehand: true,
            stopClick: true,    // not clicks events will be fired when drawing points..
            style: this.getEditingStyle(),
            condition: olBrowserEvent => {
              if (olBrowserEvent.originalEvent.touches) {
                return olBrowserEvent.originalEvent.touches.length < 2;
              }   // dibuja si hay menos de undos dedos..--> mo working
              return false;
            }
          });
          this.removeDragPinchInteractions();
          break;
        }
      }
      this.map.addInteraction(this.draw);
      // adding snap interaction always after the draw interaction
      this.snap = new Snap({
        source: tsource
      });
      this.map.addInteraction(this.snap);
      this.createMeasureTooltip();
      let listener;
      // configuration for matsnackbar
      const horizontalPosition: MatSnackBarHorizontalPosition = 'start';
      const verticalPosition: MatSnackBarVerticalPosition = 'bottom';
      this.draw.on('drawstart', evt => {
        // console.log('this.formOpen in drawstart', this.formOpen);
        if (this.formOpen) {
          this.snackBar.open('There is a form open, close it first', 'ok',
            { horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 3000});
          this.draw.abortDrawing();
          return;
        }

        if (this.currentClass == null){
          alert('Waehlen Sie ein Symbol');
          this.draw.abortDrawing();
          return;  // #TODO check this
        }
        const sketch = evt.feature;
        let tooltipCoord = evt.coordinate;
        listener = sketch.getGeometry().on('change', evt => {
          const geom = evt.target;
          let output;
          // show the tooltip only when drawing polys
          if (self.draw.type_ === 'LineString' && self.curEditingLayer.geometryType.indexOf('Polygon') > -1){  // self.curEditingLayer[2]
            const last = geom.getLastCoordinate();
            const first = geom.getFirstCoordinate();
            const sourceProj = self.map.getView().getProjection();
            const distance = getDistance(transform(first, sourceProj, 'EPSG:4326'), transform(last, sourceProj, 'EPSG:4326'));
            if (distance < AppConfiguration.threshold) {
              output = (Math.round(distance * 100) / 100) + ' ' + 'm';  // round to 2 decimal places
              tooltipCoord = geom.getFirstCoordinate();
              self.measureTooltipElement.innerHTML = output;
              self.measureTooltip.setPosition(tooltipCoord);
            }
          }
        });
      });
      this.draw.on('drawend', async (e: any) => {
        // adding an temporal ID, to handle undo
        e.feature.setId(this.curEditingLayer.layerName.concat('.', String(this.featId)));
        this.featId = this.featId + 1;
        // correct geometry when drawing circles
        if (self.draw.type_ === 'Circle' && e.feature.getGeometry().getType() !== 'Polygon') {
          e.feature.setGeometry(new fromCircle(e.feature.getGeometry()));
        }
        // automatic closing of lines to produce a polygon
        if (self.draw.type_ === 'LineString' && (self.curEditingLayer.geometryType.indexOf('Polygon') > -1)){
          // valid for multipolygon and multipolygonz
          const geom = e.feature.getProperties().geometry;
          const threshold = AppConfiguration.threshold;
          const last = geom.getLastCoordinate();
          const first = geom.getFirstCoordinate();
          const sourceProj = this.map.getView().getProjection();
          // transform coordinates to a 4326 to use getDistance
          const distance = getDistance(transform(first, sourceProj, 'EPSG:4326'), transform(last, sourceProj, 'EPSG:4326'));    //
          if (distance > threshold){
            e.feature.setGeometry(null);
            this.unsetMeasureToolTip();
            // the line is not saved in the buffer, so no invalid geoms are stored
            return;
          }
          const newCoordinates = e.feature.getProperties().geometry.getCoordinates();
          newCoordinates.push(first);
          const tgeometry = new Polygon([newCoordinates]);
          // CHECKING IF VALID GEOMETRY?
          if (!(tgeometry instanceof Polygon)){
            e.feature.setGeometry(null);
            this.unsetMeasureToolTip();
            // the line is not saved in the buffer, so no invalid geoms are stored
            return;
          }
          // it was a line and it was converted into a closed polygon
          e.feature.setGeometry(tgeometry);
          self.measureTooltipElement.innerHTML = distance;
          self.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';  // #TODO styling is not working
          self.measureTooltip.setOffset([0, -7]);
        }
        // adding the interactions that were stopped when drawing
        if (self.draw.type_ === 'Point' || self.draw.type_ === 'LineString' ||
          self.curEditingLayer.geometryType.indexOf('Polygon') > -1 || self.draw.type_ === 'Circle') {
          setTimeout(() => {
            self.addDragPinchInteractions();
          }, 1000);
        }
        // unset tooltip so that a new one can be created
        this.unsetMeasureToolTip();
        // prompting for attributes and finishing that
        this.popAttrForm(this.curEditingLayer, e.feature);
      });

    } catch (e) {
      console.log('Error adding draw interactions', e);
    }
  }

  unsetMeasureToolTip(){
    this.measureTooltipElement.innerHTML = '';
    this.measureTooltipElement = null;
    this.map.removeOverlay(this.measureTooltip);
    this.createMeasureTooltip();
  }

  startDeletingV0(){
    {
      /** enables to delete features selected with a rectangle when point geomtries or click in other case
       * The user first select the features and then click in the location where those features will be located
       * so far no difference in the code for sketch and WFS layers..
       */
      const tlayer = this.findLayer(this.curEditingLayer.layerName);
      if (tlayer === null) {
        alert('Error retrieving current layer in deleting features');
        return;
      }
      const self = this;
      const tsource = this.curEditingLayer.source;
      this.removeInteractions();
      this.select = new Select({
        condition: click,  // check if this work on touch
        layers: [tlayer],
        hitTolerance: 7, // check if this is enough
        style: this.selectStyle,
      });
      this.select.getFeatures().clear();
      this.map.addInteraction(this.select);
      const dirty = true;
      if (this.curEditingLayer.geometryType === 'Point' || this.curEditingLayer.geometryType === 'MultiPoint' ){
        this.dragBox = new DragBox({
          className: 'boxSelect',
          condition: touchOnly,
        });
        this.map.addInteraction(this.dragBox);
        this.dragBox.on('boxend', () => {
          if (this.dragBox.getGeometry() == null) {
            return;
          }
          const extent = this.dragBox.getGeometry().getExtent();
          // select the features
          tsource.forEachFeatureIntersectingExtent(extent, f => {
              self.select.getFeatures().push(f);
            });
          this.select.dispatchEvent('select');
        });
        // each time of starting a box clear features
        this.dragBox.on('boxstart', function() {
          self.select.getFeatures().clear();
        });
      }
      this.select.on('select', function(e) {
        const selectedFeatures = e.target.getFeatures();
        if (selectedFeatures.getLength() <= 0) {
          return;
        }
        if (self.curEditingLayer.geometryType === 'Point' || self.curEditingLayer.geometryType === 'Line'
          || self.curEditingLayer.geometryType === 'MultiPoint' || self.curEditingLayer.geometryType === 'Polygon') {

         selectedFeatures.forEach(f => {
            const lastFeat = f.clone();
            lastFeat.setId(f.getId()); // to enable adding the feat again?
            const tempId = f.getId();
            // remove feature from the source
            self.curEditingLayer.source.removeFeature(f);
            // insert feature in a cache --> for undo
            self.editBuffer.push({
              layerName: self.curEditingLayer.layerName,
              transaction: 'delete',
              feats: lastFeat,
              dirty,
              source: self.curEditingLayer.source
            });
          });
          // clear the selection --> the style will also be clear
         self.select.getFeatures().clear();
          // update the possibility to undo and the cache for that
         self.canBeUndo = true;
         return;
        }
        else {
           selectedFeatures.forEach(f => {
           self.editBuffer.push({
              layerName: self.curEditingLayer.layerName,
              transaction: 'delete',  // would it be better to add the opposite operation already, e.g., insert?
              feats: f.clone(),   // #TODO check id
              dirty: true,
              source: self.curEditingLayer.source
            });
            self.curEditingLayer.removeFeature(f);
          });
        }
      });
      // clear the selection --> the style will also be clear
      this.select.getFeatures().clear();
      // to enable undo
      this.canBeUndo = true;
    }
  }

removeDragPinchInteractions() {
    try {
      const self = this;
      this.map.getInteractions().forEach(
        interaction => {
          if (interaction instanceof DragPan || interaction instanceof DragZoom || interaction instanceof DragRotate
            || interaction instanceof PinchZoom || interaction instanceof PinchRotate) {
            // self.map.removeInteraction(interaction);
            interaction.setActive(false);
          }
        });
    } catch (e) {
      console.log('Error removing Drag/Pinch interactions', e);
    }
  }

loadWFSlayers(XmlCapText) {
    /** This function load in the map, the layers available in the QGS project via WFS
     * @param XmlCapText the xml text produced by the getCapabilities request
     * ol groups are created if needed
     */
    const self = this;
    const xmlParser = new DOMParser();
    const xmlText = xmlParser.parseFromString(XmlCapText, 'text/xml');
    const featureTypeList = xmlText.getElementsByTagName('FeatureTypeList')[0];
    const tnodes = {};
    const otherSrsLst = [];
    const operationsLst = [];
    let srs: any;
    let operation: any;
    const nLayers = featureTypeList.children.length - 1;
    // the feature list contains a set of operations too
    for (let i = 0; i < nLayers; i++) {
      const node = featureTypeList.getElementsByTagName('FeatureType')[i];
      const layerName = node.getElementsByTagName('Name')[0].childNodes[0].nodeValue;
      const layerTitle = node.getElementsByTagName('Title')[0].childNodes[0].nodeValue;
      const defaultSRS = node.getElementsByTagName('DefaultSRS')[0].childNodes[0].nodeValue;
      // validation or warning
      if (defaultSRS !== AppConfiguration.srsName) {
         alert(`The layer ${ layerName }has a different default SRS than the SRS of the project`);
      }
      const otherSrs = node.getElementsByTagName('OtherSRS');
      // this will get a list
      for (let j = 0; j < otherSrs.length; j++) {
        srs = node.getElementsByTagName('OtherSRS')[j].childNodes[0].nodeValue;
        if (srs.length > 0) {
          otherSrsLst [j] = srs;
        }
      }
      const operations = node.getElementsByTagName('Operations')[0];
      // this will get a list
      for (let j = 0; j < operations.children.length; j++) {
        operation = operations.getElementsByTagName('Operation')[j].childNodes[0].nodeValue;
        if (operation.length > 0) {
          operationsLst [j] = operation;
        }
      }
      // adding a log message for a warning concerning the operations available in the projects
      if (!operationsLst.includes('Query') || !operationsLst.includes('Insert') ||
        !operationsLst.includes('Update') || !operationsLst.includes('Delete')) {
      }
      const bBox = node.getElementsByTagName('ows:WGS84BoundingBox')[0];
      const dimensions = bBox.getAttribute('dimensions');
      const lowCorner = bBox.getElementsByTagName('ows:LowerCorner')[0].childNodes[0].nodeValue;   // x and y
      const upperCorner = bBox.getElementsByTagName('ows:UpperCorner')[0].childNodes[0].nodeValue; // x and y
      if ((lowCorner.split(' ')[0] === '0' && lowCorner.split(' ')[1] === '0')
        && (upperCorner.split(' ')[0] === '0' && upperCorner.split(' ')[1] === '0')) {
       }
        if (layerName.length > 0) {
        // store layer properties to use later
        const geom = this.findGeometryType(layerName);
        const qGsProject = '&map=' + this.qgsProjectFile;
        const qGsServerUrl = this.qGsServerUrl;
        const outputFormat = '&outputFormat=GeoJSON';
        const loadedLayers = [];
        const wfsVersion = 'SERVICE=WFS&VERSION=' + AppConfiguration.wfsVersion;
        const urlWFS = qGsServerUrl + wfsVersion + '&request=GetFeature&typename=' + layerName +
          outputFormat + '&srsname=' + defaultSRS + qGsProject;
        try {
          const vectorSource = new VectorSource({
            format: new GeoJSON(),
            // getting WFS set to the view extent
            url: extent => {
              return (urlWFS);
            },
            crossOrigin: null,   // gis.stackexchange.com/questions/71715/enabling-cors-in-openlayers
           });
          const wfsVectorLayer = new VectorLayer({
            source: vectorSource,
            name: layerName,
            visible: false,   // #TODO comment this line, by default layers are not visible
            zIndex: nLayers - i,   // highest zIndex for the first layer and so on.
            style(feature) {    // this equiv to style: function(feature)
              // get style in a json style
              let layerStyle = self.mapQgsStyleService.findJsonStyle(feature, layerName);
              if (!layerStyle) {
                layerStyle = self.mapQgsStyleService.findDefaultStyleProvisional(feature.getGeometry().getType(), layerName);
              }
              return (layerStyle);
            }
          });
          tnodes[layerName] = {
            layerName, // equivalent to "layerName" : layerName --> k:v
            // layerGeom,
            layerTitle,
            defaultSRS,
            otherSrs: otherSrsLst,
            lowCorner: [lowCorner.split(' ')[0], lowCorner.split(' ')[1]],
            upperCorner: [upperCorner.split(' ')[0], upperCorner.split(' ')[1]],
            operations: operationsLst,
            geometryType: geom, // Dependent of QGIS project as the styles.
            source: vectorSource
          };
          this.addWebServLayer(layerName, wfsVectorLayer);
          this.loadedWfsLayers.push(tnodes[layerName]);  // wfsVectorLayer
         } catch (e) {
         }
      }
    }
     return (this.loadedWfsLayers);
  }

updateMapVisibleGroupLayer(selectedGroupLayer) {
    /** updates the visibility of a group layer in the map
     * @param selectedGroupLayer the layer that was clicked to show/hide
     */
     this.map.getLayers().forEach(layer => {
     if (selectedGroupLayer.groupName === layer.get('name')) {
        layer.setVisible(!layer.getVisible());
      }
    });
  }

updateMapVisibleLayer(selectedLayer: any){
  /**
   * updates the visibility of a layer in the map
   * @param selectedLayer is a dictionary layer that was clicked to show/hide
   */
    const layerName = selectedLayer.layer.layerName;
    const groupName = selectedLayer.groupName;
   this.map.getLayers().forEach(layer => {
      if (groupName === layer.get('name')) {
        layer.getLayers().forEach(lyrinGroup => {
          if (layerName === lyrinGroup.get('name')) {
           lyrinGroup.setVisible(!lyrinGroup.getVisible());
            return;
          }
        });
        return;
      }
    });
  }

findLayerinGroups(layerName: string): any {
  /**
   * finds a layer in the groups dictionary
   */
  for (const group of this.groupsLayers) {
      const lyr = group.layers.find(x => x.layerName.toLowerCase() === layerName.toLowerCase());
      if (lyr) {
        return (lyr);  // it was lyr
      }
    }
  }

  findGroupLayer(layerName: string): any {
    /**
     * finds the group which the layer belongs to
     */
    for (const group of this.groupsLayers) {
      const lyr = group.layers.find(x => x.layerName.toLowerCase() === layerName.toLowerCase());
      if (lyr) {
        return (group);  // it was lyr
      }
    }
  }

updateEditingLayer(layerOnEdit: any) {
    /**  starts or stops the editing mode for the layerName given
     * if there were some edits --> asks for saving changes
     * @param layerOnEdit: the oject layer that the user select to start/stop editing
     * and the group name of the layer
     *  #TODO catch exception
     */
  let layer: any;
   if (layerOnEdit === null) {
   if (this.curEditingLayer) {
      // a layer was being edited - ask for saving changes
      this.stopEditing();
    }
   this.curEditingLayer = null;
   return;
  }
  if (this.curEditingLayer) {
    // a layer was being edited - ask for saving changes
    this.stopEditing();  // test is changes are save to the right layer, otherwise it should go #
    layer = this.loadedWfsLayers.find(x => x.layerName === layerOnEdit.layer.layerName);
    if (!layer) {
      layer = this.loadedSketchLayers.find(x => x.layerName === layerOnEdit.layer.layerName);
      if (!layer){
        alert('Layer not found in starting editing');
        return;
      }
    }
    if (this.curEditingLayer === layer) {
      this.curEditingLayer = null;
      this.stopEditing(); // maybe is not needed this should be controlled from the layer panel
      return;
    }
   }
  layer = this.loadedWfsLayers.find(x => x.layerName === layerOnEdit.layer.layerName);
  if (!layer) {
    layer = this.loadedSketchLayers.find(x => x.layerName === layerOnEdit.layer.layerName);
    if (!layer){
      alert('Layer not found in update editing ');
      return;
    }
  }
  this.curEditingLayer = layer;
  this.startEditing(layer);
 }

stopEditing() {
      /** Disables the interactions on the map to start moving/panning and stop drawing
       *  asks to save changes in the layer if any and call the function for it.
       *  @param editLayer, the layer that was edited / #TODO editLayer is not required
       */
      // stop interactions, clear current class and symbol
      this.currentClass = null;
      this.currentStyle = null;
      this.removeInteractions();
    }

saveAllEdits(){
  /**
   * saves all edits in all WFS layers
   */
   if (!(this.editBuffer.length > 0)) {  // nothing to save
    this.snackBar.open('Nothing to save', 'ok',
      { horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000});
    return;
    }
    this.loadedWfsLayers.forEach(
      layer => {
        console.log('saving changes in ', layer.layerName);
        this.saveEdits(layer);
      });
    if (this.loadedSketchLayers.length > 0) {
     if (confirm('Wollen Sie alle Aenderungen speichern?')){
       this.loadedSketchLayers.forEach(
         layer => {
           console.log('saving changes in sketch layers', layer.layerName);
           this.saveEdits(layer);
         });
     }
   }
}

saveEdits(editLayer: any) {
  /**
   * @param editLayer:
    */
     if (!(this.editBuffer.length > 0)) {  // nothing to save
        this.snackBar.open('Nichts zu speichern', 'ok',   //Nothing to save
          { horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000});
        return;
      }
      if (this.editBuffer.findIndex(x => x.layerName ===  editLayer.layerName) === -1)
      { // nothing to save in the editLayer
        this.snackBar.open('NNichts zu speichern', 'ok',   //Nothing to save in current layer
          { horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000});
        return;
      }
      if (editLayer.geometryType === 'Point' || editLayer.geometryType === 'Line' || editLayer.geometryType === 'Polygon'
        || editLayer.geometryType === 'MultiPolygon' || editLayer.geometryType === 'MultiPolygonZ' || editLayer.geometryType === 'MultiPoint')
      {
         const result = this.writeTransactWfs(editLayer);
         if (result){
           result.then(() => {
           this.snackBar.open('Aenderungen gespeichert ', 'ok',
             { horizontalPosition: 'center',
               verticalPosition: 'top',
               duration: 10000});
           return; });
         }
      }
      else {
          this.saveSketchLayer(editLayer);
          // it is a 'multi' geometry --> sketch layer
        }
      }

saveSketchLayer(editLayer: any) {
    /** saves the changes in a sketch layer
     * @param editLayer: name of the layer to be saved.
     */
    if (!(this.editBuffer.length > 0)){
      this.snackBar.open('Nichts zu speichern', 'ok',  //No features to save in current sketch layer
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    if (!confirm('Do you want to download changes in this session layer?')) {//  do not want to save changes
        return;
    }
    try {
      const tsource = editLayer.source;
      if (!tsource) {
        this.snackBar.open('No source found in current sketch layer', 'ok',
          { horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 5000});
        return;
      }
      let data = new GeoJSON().writeFeatures(tsource.getFeatures());
      const featJSON = JSON.parse(data);
      data = JSON.stringify(featJSON, null, 4);
      const blob = new Blob([data], {type: 'text/json;charset=UTF-8'});
      saveAs(blob, editLayer.layerName + ".geojson");
    }
    catch (e){
      console.log('Error saving sketchLayer' + e);
    }
  }

startEditing(layer: any) {
    /** Enables the interaction in the map to draw features
     * and update two observables in openLayerService:
     * the geometry type of the layer being edited, and
     * the visibility of the editing toolbar
     */

    try {
      this.openLayersService.updateLayerEditing(layer.layerName, layer.geometryType);
      this.currentClass = null;  // forcing the user to pick and style and cleaning previous style? check
    } catch (e) {
      console.log('Error starting editing...' + e);
      this.snackBar.open('Error starting drawing', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
  }
removeFeatEditBuffer(feat: any) {
    /**
     * removes a feature from the editBuffer
     * @param feat: the feat to be removed
     */
    this.editBuffer.forEach((item, index) => {
      if (item.feats === feat) {
        this.editBuffer.splice(index, 1);
      }
    });
  }
undoLastEdit() {
    /**
     * Undo the last action (insert, update (move), delete)   #TODO update observable to disable button
     * uses the this.editBuffer to do so and the cacheFeatures
     */
    // get only the records for the current layer
    const curEdits = this.editBuffer.filter(obj => obj.layerName === this.curEditingLayer.layerName);
    // console.log('curEdits and this.editBuffer', curEdits, this.editBuffer);
    if (!(curEdits.length > 0 )) {
      // nothing to save in current layer
      return;
    }
    const lastOperation = this.editBuffer.filter(obj => obj.layerName === this.curEditingLayer.layerName).pop(); // curEdits.pop();
    switch (lastOperation.transaction)
    {
      case 'insert': {
        // remove from the source
        this.curEditingLayer.source.removeFeature(lastOperation.feats);
        break;
      }
      case 'update': {
      // change to the oldFeat // there could be several features
        lastOperation.feats.forEach( feat => {
          const oldFeat = feat.get('oldFeat');
          // oldFeat is undefined then it was an update of attributes --> rating
          if (oldFeat){
            oldFeat.getGeometry();
            const curFeatGeomClone = feat.getGeometry().clone();
            // set the geometry to the old one
            feat.setGeometry(oldFeat.getGeometry());
            // set the new old geometry to the current one
            feat.set('oldFeat', curFeatGeomClone);
           }

        });
        break;
      }
      case 'rating': {
        console.log('The last record was done .. so check that the rating was not added');
      }
      case 'delete': {
         // insert back
         lastOperation.feats.setStyle(null);  // to allow the style function of the layer to render the feat properly
         this.curEditingLayer.source.addFeature(lastOperation.feats);  // TODO styling  //lastOperation.feats
        }
    }
    // remove from the edit Buffer
    this.removeFeatEditBuffer(lastOperation.feats);
  }

writeTransactWfs(editLayer: any) {
    /** saves changes on a wfs layer
     * @param editLayer: layer to save changes stored in the editBuffer
     */
    const layerTrs = [];
    layerTrs[editLayer.layerName] = [];
    layerTrs[editLayer.layerName].insert = [];
    layerTrs[editLayer.layerName].delete = [];
    layerTrs[editLayer.layerName].update = [];
    layerTrs[editLayer.layerName].source = editLayer.source;

    this.editBuffer.forEach(t => {
      // create the node for CRU
      if (t.layerName === editLayer.layerName) {
        // save edits in current edit layer
        switch (t.transaction) {
          case 'insert':
            layerTrs[editLayer.layerName].insert.push(t.feats);   // t.feats is only one feat
            break;
          case 'delete':
            layerTrs[editLayer.layerName].delete.push(t.feats); // t.feats is one feat #TODO next ver delete several
            break;
          case 'translate':
            layerTrs[editLayer.layerName].update.push(t.feats); // t.feats is one feat #TODO next ver delete several
            break;
          case 'rating':
            layerTrs[editLayer.layerName].update.push(t.feats); // t.feats is one feat
            break;
          case 'update':
            /* t.feats.forEach(f => {
              layerTrs[editLayer.layerName].update.push(f); // t.feats is an array with one or several feats
            }); */
            layerTrs[editLayer.layerName].update.push(t.feats[0]); // t.feats is an array with one or several feats
            break;
        }
      }
    });

    // configure nodes.
    const strService = 'SERVICE=WFS&VERSION=' + AppConfiguration.wfsVersion + '&REQUEST=DescribeFeatureType';
    const strUrl = this.qGsServerUrl + strService + '&map=' + this.qgsProjectFile;
    const formatWFS = new WFS();
    const formatGML = new GML({
      featureNS: 'http://localhost:4200',
      featureType: editLayer.layerName,
      crossOrigin: null
    });
    let node: any;
    const xs = new XMLSerializer();
    let str: any;
    let res: any;
    // Edits should be done in chain... 1)insert, 2)updates, 3) deletes
    if (layerTrs[editLayer.layerName].insert.length > 0) {
      node = formatWFS.writeTransaction( layerTrs[editLayer.layerName].insert, null, null, formatGML);
      str = xs.serializeToString(node);
      return fetch(strUrl, {
        method: 'POST', mode: 'no-cors', body: str
      })
        .then((textInsert) => {
          layerTrs[editLayer.layerName].insert = [];
          if (layerTrs[editLayer.layerName].update.length > 0) {
            node = formatWFS.writeTransaction(null, layerTrs[editLayer.layerName].update, null, formatGML);
            str = xs.serializeToString(node);
            return fetch(strUrl, {
              method: 'POST', body: str
            })
              .then(respUpdate => {
                layerTrs[editLayer.layerName].update = [];
                if (layerTrs[editLayer.layerName].delete.length > 0) {
                  node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName].delete, formatGML);
                  str = xs.serializeToString(node);
                  return fetch(strUrl, {
                    method: 'POST', body: str
                  })
                    .then(respDelete => {
                      return respDelete.text();
                    })
                    .then(textDelete => {
                      layerTrs[editLayer.layerName].delete = [];
                    })
                    .catch(error => console.error(error));
                }
              });
          }
        })
        .then(() => {
          // cleaning the editbuffer after inserting - updating and deleting
          this.editBuffer = this.editBuffer.filter(obj => obj.layerName !== editLayer.layerName);
          });
    }
    if (layerTrs[editLayer.layerName].update.length > 0) {
      node = formatWFS.writeTransaction(null, layerTrs[editLayer.layerName].update, null, formatGML);
      str = xs.serializeToString(node);
      return fetch(strUrl, {
        method: 'POST', body: str
      })
        .then(respUpdate => {
          layerTrs[editLayer.layerName].update = [];
          if (layerTrs[editLayer.layerName].delete.length > 0) {
            node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName].delete, formatGML);
            str = xs.serializeToString(node);
            return fetch(strUrl, {
              method: 'POST', body: str
            })
              .then(respDelete => {
                return respDelete.text();
              })
              .then(textDelete => {
                 layerTrs[editLayer.layerName].delete = [];
                });
          }
        })
        .then(() => {
          // cleaning the editbuffer when only updates and deletes where done
          this.editBuffer = this.editBuffer.filter(obj => obj.layerName !== editLayer.layerName);
          });
    }
    if (layerTrs[editLayer.layerName].delete.length > 0) {
      node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName].delete, formatGML);
      str = xs.serializeToString(node);
      return fetch(strUrl, {
        method: 'POST', body: str
      })
        .then(respDelete => {
          return respDelete.text();
        })
        .then(respDelete => {
          layerTrs[editLayer.layerName].delete = [];
          this.editBuffer = this.editBuffer.filter(obj => obj.layerName !== editLayer.layerName);
          });
    }
  }

  findSketchLayer(layerName: string) {
    /**
     * find the object layer with the name @layername
     * @param layername: string, the name of the layer to find
     * @return tlayer: the object layer found
     */
    let tlayer: any = null;
    tlayer = this.loadedSketchLayers.find(x => x.layerName.toLowerCase() === layerName.toLowerCase());
    return (tlayer);
  }

findWfsLayer(layerName: string) {
  /**
   * find the object layer with the name @layername
   * @param layername: string, the name of the layer to find
   * @return tlayer: the object layer found
   */
  let tlayer: any = null;
  tlayer = this.loadedWfsLayers.find(x => x.layerName.toLowerCase() === layerName.toLowerCase());
  return (tlayer);
}

  findLayerWithGroup(layerName: string, groupName: string) {
    /**
     * finds a layer in the map and return its source and so on.
     * @param layerName the name of the layer
     * @parma groupName the name of the group parent of the layer
     */
  let tlayer: any = null;
  this.map.getLayers().forEach(layer => {
      if (groupName.toLowerCase() === layer.get('name').toLowerCase()) {
        layer.getLayers().forEach(lyrinGroup => {
          if (layerName.toLowerCase() === lyrinGroup.get('name').toLowerCase()) {
            tlayer = lyrinGroup;
          }
        });
        return;
      }
    });
  return tlayer;
  }

findLayer(layerName: string) {
  /**
   * finds a layer in the map and return its source and so on.
   * @param layerName the name of the layer
   */
  let tlayer: any = null;
  const group = this.findGroupLayer(layerName);
  this.map.getLayers().forEach(layer => {
      if (group.groupName.toLowerCase() === layer.get('name').toLowerCase()) {
        layer.getLayers().forEach(lyrinGroup => {
         if (layerName.toLowerCase() === lyrinGroup.get('name').toLowerCase()) {
            tlayer = lyrinGroup;
          }
        });
        return;
      }
    });
  return tlayer;
  }

startTranslating()
{
    /** enables to move (translate features selected with a rectangle
     * The user first select the features and then click in the location where those features will be located
     * so far no difference in the code for sketch and WFS layers..
     */
   const lyr = this.findLayer(this.curEditingLayer.layerName);
   const updateFeats = [];
   if (lyr === null) {
     this.snackBar.open('Error retrieving current layer', 'ok',
       { horizontalPosition: 'center',
         verticalPosition: 'top',
         duration: 5000});
     return;
   }
   this.removeInteractions();
   this.select = new Select({
      layers: [lyr],   // avoid selecting in other layers..
      condition: click,  // check if this work on touch
      hitTolerance: 7,    // check if we should adjust for # types of geometries..
      style: this.selectStyle,
    });
   this.map.addInteraction(this.select);
   this.dragBox = new DragBox({
     condition: touchOnly // platformModifierKeyOnly  // before it did not have any condition
   });
   this.map.addInteraction(this.dragBox);
   const self = this;
   const tsource = this.curEditingLayer.source;
   // clear a previous selection
   this.dragBox.on('boxend', () => {
    const extent = this.dragBox.getGeometry().getExtent();
    if (this.dragBox.getGeometry() == null) {
      return;
    }

    tsource.forEachFeatureIntersectingExtent(extent, f => {
            const lastFeat = f.clone();
            lastFeat.setId(f.getId());
            f.set('oldFeat', lastFeat);
            self.select.getFeatures().push(f);
            self.cacheFeatures.push({
            layerName: self.curEditingLayer.layerName,
            transaction: 'translate',  // would it be better to add the opposite operation already, e.g., insert?
            feats: lastFeat,
            source: self.curEditingLayer.source
            });
          }
        );
     });
    // Add the translation interaction to the selected features
   const selectedFeatures = this.select.getFeatures();
   this.translate = new Translate({
      features: selectedFeatures
    });
   this.map.addInteraction(this.translate);
   // insert features into the editBuffer and cacheFeatures
   this.translate.on('translateend', () => {
     selectedFeatures.forEach( f => {
       updateFeats.push(f);
     });
   self.editBuffer.push({
         layerName: self.curEditingLayer.layerName,
         transaction: 'update',
         feats: updateFeats,    // add all the features moved in a unique transaction --> check in saving WFS
         source: tsource
       });
     this.select.getFeatures().clear();
  // action can be undo
     this.canBeUndo = true;
     });
   // each time of starting a box clear features
   this.dragBox.on('boxstart', function() {
      self.select.getFeatures().clear();
   });
  }

startRotating() {}
startCopying(){  }
replaceNull(field: any): any{
    if (field){
      return field;
    }
    return 0;
}

 replaceNullString(field: any): any{
    if (field){
      return field;
    }
    return '';
  }

createReporMeasureLayer(layerOnIdentifyingName: any, featureValues: any): any{
/*
 * creates a report of the voting or measuring tacklinf noise
 */
  console.log('featureValues', featureValues);
  const measureList = AppConfiguration.ratingMeasureLayers[layerOnIdentifyingName.toLowerCase()];
  let totalCount = 0;
  let textMeasure = '';
  let text = '<div id="popupDiv">' +   '<table border=0 width=100%>' ;
   text = text.concat('<tr><th>' + 'Measures' + '</th>' +
    '<th colspan="2">' + 'Rating' + '</th></tr>');
  measureList.forEach(measure => {
    totalCount = featureValues[measure + '_rank'];
    textMeasure = measure.slice(0, measure.indexOf('_rank'));
    text =  text.concat ('<tr><td>' + measure + '</td>' +
      '<td>' + '<input type="range" min="1" max="5" value="' +  this.replaceNull(totalCount)  + '" disabled=true>' + '</td>');
    });
  text = text.concat('<tr><td>' + 'Sonstiges' + '</td><td  colspan="3">' +
    this.replaceNullString(featureValues.sonstiges).toString().slice(0, 50) + '</td></tr>');
  text = text.concat('</table>' + '</div>');
  return(text);
}

displayFeatureInfoWFS(evt: any) {
    const hdms = toStringHDMS(evt.coordinate);
    this.content.nativeElement.innerHTML = '<p>Searching at:</p><code>' + hdms + '</code>';
    this.overlay.setPosition(evt.coordinate);
    const  layerOnIdentifyingName = this.curInfoLayer.get('name');  // this.curInfoLayer is an OL layer object
    const tlayer = this.findLayerinGroups(layerOnIdentifyingName);
    const fieldsToShow = tlayer.fields;
    const featureValues = this.map.forEachFeatureAtPixel(evt.pixel, feature => {
        const valuesToShow = {};
        for (const field of fieldsToShow){
          valuesToShow [field.name] = feature.get(field.name);
        }
        return valuesToShow;   // here return all the values available
      }, {
      layerFilter(layer) {
          return layer.get('name') === layerOnIdentifyingName;  // to search only in the active layer
        },
      hitTolerance: 10
      }
    );
    if (featureValues) {
      // Prepare html text with all the information
      let text = '';
      if  (AppConfiguration.ratingMeasureLayers.hasOwnProperty(layerOnIdentifyingName)) {
      // create the table for rating measures
       text = text  + this.createReporMeasureLayer(layerOnIdentifyingName, featureValues);
       this.content.nativeElement.innerHTML = text;
      }
      // report normal layer
      else {
        for (const key in featureValues){
          if (key !== 'img'){
            if (featureValues[key]) {
              text = text.concat('<tr><td>' + key + '</td><td>' + featureValues[key] + '</td></tr>');
            }
            else {
              text = text.concat('<tr><td>' + key + '</td><td>' + '' + '</td></tr>');
            }
          }
        }
        if (featureValues.img )  // the property img exists
        {
          // visualize img if any  --> document somewhere that we will look for a field called 'img'
          console.log('pasa X AQUI');
          const folder = AppConfiguration.curProject.substring(0, AppConfiguration.curProject.lastIndexOf('/'));
          text = text.concat(
            '<tr><img class=imgInfo src="' + folder + '/img/' + featureValues.img + '" alt="picture"></tr>');
        }
        this.content.nativeElement.innerHTML = '<div id="popupDiv">' +
          '<table border=0 width=100%>' + '<tr><th>Attribute</th><th>Value</th></tr>' +
          text + '</table>' + '</div>';
      }
    }
    else {
      this.content.nativeElement.innerHTML = '<p>Not elements found :</p>';
    }
  }
displayFeatureInfoWMS(evt)  {
    /* shows a popup when the user pres click
     * @param evt, the event containing pixel and coordinates
     */
    const  layerOnIdentifying = this.curInfoLayer;
    const hdms = toStringHDMS(evt.coordinate);
    this.content.nativeElement.innerHTML = '<p>Searching at:</p><code>' + hdms + '</code>';
    this.overlay.setPosition(evt.coordinate);
    console.log('evt.coordinate', evt.coordinate);
    const viewResolution =  Number(this.view.getResolution());
    const wmsSource = layerOnIdentifying.getSource();
    const wmsUrl = wmsSource.getFeatureInfoUrl(
        evt.coordinate,    // how to check this with EPSG # 4326 and 3857
        viewResolution,
        AppConfiguration.srsName,
        {INFO_FORMAT: 'application/json',
         FI_POINT_TOLERANCE: 10,
         FI_LINE_TOLERANCE: 5,
         FI_POLYGON_TOLERANCE: 5}    // //'text/html'
      );
    if (wmsUrl) {
        fetch(wmsUrl)
          .then(response => response.text())
          .then(json => {
            // this.content.nativeElement.innerHTML = html;
            this.content.nativeElement.innerHTML = this.formatHtmlInfoResponse(json);
          })
          .catch( error => { console.log ('Error retrieving info', error);
                             this.content.nativeElement.innerHTML = '<p>Not elements found :</p>'; });
            // TODO also like wfs filtering the fields to show..
      }
    else {
      this.content.nativeElement.innerHTML = '<p>Not elements found :</p>';
    }
  }

searchLayer(layerName: any, groupName: any) {
    /* only one nest level, assume group exists */
    let layer = null;
    const group = this.map.getLayers().getArray().find(x => x.get('name') === groupName );
    if (group){
      const layers = group.getLayers().getArray();
      layer = layers.find(x => x.get('name') === layerName );
    }
    return layer;
  }

startIdentifying(layerOnIdentifying: any)
{
  /** enables recovering the infor at certain coordinate
   * @param layer, the object containing name and wfs property as well as onEdit property
   */
   if (layerOnIdentifying === null){
    this.map.getTargetElement().style.cursor = '';
    this.curInfoLayer = null;
    this.container.nativeElement.style.display = 'none';
    return;
  }

  const layer = this.searchLayer(layerOnIdentifying.layer.layerName, layerOnIdentifying.groupName); // find the layer in its group
  if (!layer){
    return;
  }
  this.curInfoLayer = layer;   // this is a real OL layer
  console.log('layerOnIdentifying  startIdentifying', layerOnIdentifying, 'name curInfoLayer', this.curInfoLayer.get('name'));
  }

  startRankingMeasures(){
     if (!this.curEditingLayer) {
      // There is not editng layer
      this.snackBar.open('Current layer is not available for rating in Action Plan', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
     // checking that layer can be ranked.. this is in AppConfiguration, seems not necessary
    if (Object.keys(AppConfiguration.ratingMeasureLayers)
      .findIndex(x => x.toLowerCase() === this.curEditingLayer.layerName.toLowerCase())  === -1){
      // The layer is not available for rating
      this.snackBar.open('Current layer is not available for rating in Action Plan', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    const lyr = this.findLayer(this.curEditingLayer.layerName);
    if (lyr === null) {
      this.snackBar.open('Error retrieving layer for rating measures in Action Plan', 'ok',
        { horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000});
      return;
    }
    this.removeInteractions();

    this.select = new Select({
      layers: [lyr],   // avoid selecting in other layers..
      condition: click,  // check if this work on touch
      hitTolerance: 9,    // check if we should adjust for # types of geometries..
      style: this.selectStyle,
    });
    this.map.addInteraction(this.select);
    this.select.on('select', (e) => {
      const selectedFeatures = e.target.getFeatures().getArray();
      if (selectedFeatures.length <= 0) {
        this.snackBar.open('No features selected', 'ok',
          { horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3000});
        return;
      }
      this.openDialogRankingMeasures(this.curEditingLayer.layerName.toLowerCase(), selectedFeatures[0]);
    });
  }

  formatHtmlInfoResponse(json: string): string {
    /*
    Transform the text response from a WMS request into a more 'friendly' format
     */
    let text = 'No features found <br>';
    if (JSON.parse(json).features.length > 0) {
    text = '';
    const feature = JSON.parse(json).features[0];
    // loop trough the attributes of the first feature
    const properties = feature.properties;
    for (const key in properties){
      if (key !== 'img'){
        text = text.concat('<tr><td>' + key + '</td><td>' + properties[key] + '</td></tr>');
      }
    }
    if (properties.img )  // the property img exists
    {
      // visualize img if any  --> document somewhere that we will look for a field called 'img'
      const folder = AppConfiguration.curProject.substring(0, AppConfiguration.curProject.lastIndexOf('/'));
      text = text.concat(
        '<tr><img class=imgInfo src="' + folder + '/img/' + properties.img + '" alt="picture"></tr>');
    }
    text =  '<table border=0 width=92%>' + '<tr><th>Attribute</th><th>Value</th></tr>' +
      text + '</table>' + '</div>';
    }
    return(text);
  }

startMeasuring(measureType = 'LineString') {
  const source = new VectorSource();
  const vector = new VectorLayer({
    name: 'measuringLayer',     //measuringLayer should be the name to delete it later
    source,
      style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new Stroke({
          color: '#ffcc33',
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: '#ffcc33',
          }),
        }),
      }),
    });

    /**
     * Currently drawn feature.
     * @type {import("../src/ol/Feature.js").default}
     */
  let sketch;
    /**
     * Message to show when the user is drawing a polygon.
     * @type {string}
     */
  const continuePolygonMsg = 'Click to continue drawing the polygon';
    /**
     * Message to show when the user is drawing a line.
     * @type {string}
     */
  const continueLineMsg = 'Click to continue drawing the line';

  /**
   * Handle pointer move.
   * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
   */
  const pointerMoveHandler = evt => {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    let helpMsg = 'Click to start drawing';

    if (sketch) {
      const geom = sketch.getGeometry();
      if (geom instanceof Polygon) {
        helpMsg = continuePolygonMsg;
      } else if (geom instanceof LineString) {
        helpMsg = continueLineMsg;
      }
    }

    this.helpTooltipElement.innerHTML = helpMsg;
    this.helpTooltip.setPosition(evt.coordinate);

    this.helpTooltipElement.classList.remove('hidden');
  };

  // add the vector layer to the map
  this.map.addLayer(vector);
  // add the handler and save the key
  const keyMoveEvent = this.map.on('pointermove', pointerMoveHandler);
  // hide the tooltiphelp
  this.map.getViewport().addEventListener('mouseout', () => {
    this.helpTooltipElement.classList.add('hidden');
  });

    /**
     * Format length output.
     * @param {LineString} line The line.
     * @return {string} The formatted length.
     */
  const formatLength = (line) => {
      const length = getLength(line);
      let output;
      if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
      } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
      }
      return output;
    };

    /**
     * Format area output.
     * @param {Polygon} polygon The polygon.
     * @return {string} Formatted area.
     */
  const formatArea = polygon => {
      const area = getArea(polygon);
      let output;
      if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
      } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
      }
      return output;
    };

  this.draw = new Draw({
        source,
        type: measureType,
        style: new Style({
          fill: new Fill({
            color: 'rgba(255, 255, 255, 0.2)',
          }),
          stroke: new Stroke({
            color: 'rgba(0, 0, 0, 0.5)',
            lineDash: [10, 10],
            width: 2,
          }),
          image: new CircleStyle({
            radius: 5,
            stroke: new Stroke({
              color: 'rgba(0, 0, 0, 0.7)',
            }),
            fill: new Fill({
              color: 'rgba(255, 255, 255, 0.2)',
            }),
          }),
        }),
      });
  this.map.addInteraction(this.draw);
  this.createMeasureTooltip();
  this.createHelpTooltip();

  let listener;
  const self = this;
  this.draw.on('drawstart', evt => {
        // set sketch
        sketch = evt.feature;
        let tooltipCoord = evt.coordinate;
        listener = sketch.getGeometry().on('change', evt => {
          const geom = evt.target;
          let output;
          if (geom instanceof Polygon) {
            output = formatArea(geom);
            tooltipCoord = geom.getInteriorPoint().getCoordinates();
          } else if (geom instanceof LineString) {
            output = formatLength(geom);
            tooltipCoord = geom.getLastCoordinate();
          }
          self.measureTooltipElement.innerHTML = output;
          self.measureTooltip.setPosition(tooltipCoord);
        });
      });

  this.draw.on('drawend', e => {
        self.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        self.measureTooltip.setOffset([0, -7]);
        setTimeout(() => {
          vector.getSource().removeFeature(e.feature);
          sketch = null;
          // unset tooltip so that a new one can be created
          self.measureTooltipElement.innerHTML = '';
          self.measureTooltipElement = null;
          self.createMeasureTooltip();
          unByKey(listener);  // unsubscribe from the event change
          unByKey(keyMoveEvent); // unsubscribe from the event mousemove
    }, 3000);
      });
   }

updateOrderGroupsLayers(groupsLayers: any) {
    /**
     *  Moves the groups and allocate layers on it according to the order in the project
     *  @param groupsLayers: contain the groups for which layers will be ordered
     **/
    const nGroups = groupsLayers.length;
    let nLysInGrp = 0;
    groupsLayers.forEach(group => {
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') === group.groupName) {
          const grpZIndex = (nGroups - groupsLayers.indexOf(group)) * 10;
          layer.setZIndex(grpZIndex);
          // order layers inside the group
          if (layer.getLayers().array_.length > 0){
            nLysInGrp = layer.getLayers().array_.length;  // numbers of layers in the
            layer.getLayers().forEach(lyrInGrp => {
              lyrInGrp.setZIndex(grpZIndex - (group.layers.findIndex( x => x.layerName === lyrInGrp.get('name')) + 1));  // works up 9 layersx group
            });
          }
        }
      });
    });
    // console.log('reordered layers..', this.map.getLayers());
    this.printLayerOrder();
  }

  printLayerOrder(){
    /**
     * used during debug time
     */
    this.map.getLayers().forEach(layer => {
      if (layer.getLayers().array_.length > 0) {
        layer.getLayers().forEach(lyrInGrp => {
          // console.log('layer index', lyrInGrp.get('name')  + ': ' +  lyrInGrp.getZIndex());
        });
      }
    });
  }

removeInteractions() {
    /**
     * Remove the interactions to draw, select or move
     */
    try {
      this.map.removeInteraction(this.draw);
      this.map.removeInteraction(this.select);
      this.map.removeInteraction(this.translate);
      this.map.removeInteraction(this.snap);
      this.map.removeInteraction(this.dragBox);
    }
    catch (e) {
      console.log ('Error removing interactions', e);
    }
  }
findGeometryType(layerName) {
     /** Finds the geometry type of the layerName by looking in the dictionary filled when parsing the QGS project
      * @oaram layerName: the name of the layer to look for the geometry type
      */
    let geometryType = null;
    for (const group of this.groupsLayers) {
    const lyr = group.layers.find(x => x.layerName === layerName);
    if (lyr) {
      geometryType = lyr.geometryType;
      return (geometryType);
    }
  }
    return (geometryType);
  }
addDragPinchInteractions() {
    try {
      const self = this;
      this.map.getInteractions().forEach(
        interaction => {
          if (interaction instanceof DragPan || interaction instanceof DragZoom || interaction instanceof DragRotate
            || interaction instanceof PinchZoom   || interaction instanceof PinchRotate)
          {
            interaction.setActive(true);
          }
        });
      if (!(this.pinchZoom)){
        this.map.addInteraction(this.pinchZoom); // check if is there
      }
      if (!(this.pinchRotate)){
        this.map.addInteraction(this.pinchRotate);   // check if is there
      }
    }
    catch (e) {
      console.log ('Error readding Drag/Pinch interactions', e);
    }
}

ngOnDestroy() {
    // prevent memory leak when component destroyed
    // unsubscribe all the subscriptions
     const subscriptions = new Subscription();
     subscriptions.add(this.subsTocurrentSymbol).add(this.subsToShapeEdit);
     subscriptions.unsubscribe();
  }
}

@Component({
  selector: 'dialog-rating-dialog',
  templateUrl: './dialog-rating-dialog.html',
  styleUrls: ['./map.component.scss']
})
export class DialogRatingDialog {
  selectedRating = 0;
  stars = [
    {
      id: 1,
      icon: 'sentiment_very_satisfied', // 'radio_button_unchecked', // 'star'
      class: 'star-gray star-hover star'
    },
    {
      id: 2,
      icon: 'sentiment_very_satisfied', // 'radio_button_unchecked',   // 'favorite'
      class: 'star-gray star-hover star'
    },
    {
      id: 3,
      icon: 'sentiment_very_satisfied', // 'radio_button_unchecked',
      class: 'star-gray star-hover star'
    },
    {
      id: 4,
      icon: 'sentiment_very_satisfied', // 'radio_button_unchecked',
      class: 'star-gray star-hover star'
    },
    {
      id: 5,
      icon: 'sentiment_very_satisfied', // 'radio_button_unchecked',
      class: 'star-gray star-hover star'
    }
  ];

  constructor(
    public dialogRef: MatDialogRef<DialogRatingDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  selectStar(value): void{
    // prevent multiple selection
    if ( this.selectedRating === 0){
      this.stars.filter( (star) => {
        if ( star.id <= value){
          star.class = 'star-gold star';
        }
        else {
          star.class = 'star-gray star';
        }
        return star;
      });
    }
   this.data.rating = value;
  }
 onNoClick(): void {
    this.dialogRef.close();
  }
}

/**
 * Definition of dialogRatingMeasureDialog
 */
@Component({
  selector: 'dialog-rating-measure-dialog',
  templateUrl: './dialog-rating-measure-dialog.html',
  styleUrls: ['./map.component.scss', '../../../node_modules/simple-keyboard/build/css/index.css']
})
export class DialogRatingMeasureDialog {
  measureDesc: string;
  selectedRating = 0;
  fieldNames: any;  // esto debe ir a data.fieldNames..
  formGroup: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogRatingMeasureDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    const group: any = {};
    data.fieldNames.forEach(question => {
        group[question] = new FormControl(question.value || '', Validators.required);
    });
    group.sonstiges = new FormControl( false || '');  // ranking question
    this.formGroup = new FormGroup(group);
    this.measureDesc = data.desc;
  }
  showQuestionValue(elementID: any, value: any){
  // show the value of the slider
  const label = document.getElementById(elementID);
  if (label)  {
    label.innerHTML = value;
   }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
