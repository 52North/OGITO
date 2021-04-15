import {AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
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
import OSM from 'ol/source/OSM';
import WFS from 'ol/format/WFS';
import GML from 'ol/format/GML';
import WMSCapabilities from 'ol/format/WMScapabilities.js';
import TileLayer from 'ol/layer/Tile';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
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
import {catchError} from 'rxjs/operators';
import {DynamicFormComponent} from '../dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Elements that make up the popup.
   */
  @ViewChild('popup', {static: false}) container: ElementRef;  // the variable here is container, popup the html element
  @ViewChild('content', {static: false}) content: ElementRef;
  @ViewChild('closer', {static: false}) closer: ElementRef;

  // Management of reactive forms
  @ViewChild(DynamicFormComponent)
  private dynamicFormComponent: DynamicFormComponent;

  questionsSubject: Subject<QuestionBase<string>[]> = new Subject<QuestionBase<string>[]>();
  showFormSubject: Subject<boolean> = new Subject<boolean>();
  featureLayerForm: {};
  payload: any;
  dataForm = new Subject <any>();
  dataForm$ = this.dataForm.asObservable();

  public existingProject = true;
  map: Map;
  view: View;
  srsID: any;  // ID of the SRS to be used in the map View
  wgs84ID = 'EPSG:4326';
  projectTitle: string;
  mapCanvasExtent: any;
  BBOX: any;
  mapCenterXY: number[] = [0, 0];   // the center of the map in the project EPSG coordinates
  projectProjection: Projection;
  mapZoom: number = AppConfiguration.mapZoom;
  fieldWFSLayers = {};
  layerStyles = {};
  selectStyle: any;
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
  groupsLayers: any[] = [];
  loadedWmsLayers = []; // [{layerName: 'uno', layerTitle: 'Layer 1'}, {layerName: 'dos', layerTitle: 'layer 2'}];
  formQuestions = [];
  curEditingLayer = null;
  curInfoLayer = null;   // a real OL layer object
  cacheFeatures = [];
  canBeUndo = false;
  editBuffer = [];   // Try one array for everything.
  // cacheBuffer = [];
  // editSketchBuffer = []; // #TDOD remove?
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
  subsToShapeEdit: Subscription;
  subsTocurrentSymbol: Subscription;
  subsToSaveCurrentLayer: Subscription;
  subsToZoomHome: Subscription;
  subsToSelectProject: Subscription;

  constructor(private mapQgsStyleService: MapQgsStyleService,
              private  openLayersService: OpenLayersService,
              private questionService: QuestionService,
              public auth: AuthService) {

    this.subsToShapeEdit = this.openLayersService.shapeEditType$.subscribe(
      data => {
        if (data != null) {
          this.enableAddShape(data);
        } else {
          this.removeInteractions();   // remove drawingInteractions
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
        alert('Error changing the style, select a symbol');
      }
    );
    this.subsToSaveCurrentLayer = this.openLayersService.saveCurrentLayer$.subscribe(
      data => {
        console.log('que entra de la subscription...', data);
        if (data) {                                    // (data) is equivalent to (data === true)
          this.saveEdits(this.curEditingLayer);
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


    this.dataForm$.subscribe(
      (data) => {
        console.log('data in constructorXXXXXXXXXXXXXXX', data);
      });





    this.openLayersService.editAction$.subscribe(
      // starts an action and stop the others..is this ready with stop interactions?
      data => {
        console.log('que viene', data);
        this.removeInteractions();
        if (this.helpTooltip) {
          console.log('entra aqui..');
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
          case 'Rotate': {
            this.startRotating();
            break;
          }
          case 'Copy': {
            this.startCopying();
            break;
          }
          case 'Identify': {
            // this.startIdentifying(data);
            console.log('QUE HACE AQUIIII OOOOOO');
            break;
          }
          case 'Delete': {
            this.startDeletingV0();
            break;
          }
          case 'MeasureLine': {
            this.startMeasuring('line');
            break;
          }
          case 'MeasureArea': {
            this.startMeasuring('area');
            break;
          }
          case 'Undo': {
            this.undoLastEdit();
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
   // console.log('user authorized', userProfile);   // how to  get the value?
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
   // this.qgsProjectUrl = AppConfiguration.curProject;
  }

 requestProjectInfo(qgsfile: string){
    const strRequest = this.qGsServerUrl + 'service=WMS&request=GetProjectSettings&MAP=' + qgsfile;
    console.log('strRequest', strRequest);
    const projectSettings = fetch(strRequest)
     .then(response => response.text())
     .then (data => {
         // console.log('data', data);
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
    // console.log ('xmlText', xmlText);
    const WFSLayers = xmlText.getElementsByTagName('WFSLayers')[0];
    console.log ('WFSLayers', WFSLayers);
    const wfsLayerList = [];
    if (WFSLayers !== undefined) {
      for (let k = 0; k < WFSLayers.getElementsByTagName('WFSLayer').length; k++) {
        wfsLayerList.push(WFSLayers.getElementsByTagName('WFSLayer')[k].getAttribute('name'));
      }
    }

    // console.log('wfsLayerList', wfsLayerList);
    const rootLayer = xmlText.getElementsByTagName('Layer')[0];
    console.log('rootLayer', rootLayer);
    // get the CRS in EPSG format
    let crs: string;
    // there are might be varios CRS, we should look for the BBOX defined for the prefered EPSG define in the projlist
    // Projected Bounding box

    if (rootLayer.getElementsByTagName('CRS').length > 1) {
      // the epsg code comes in the second place in the list
      crs = rootLayer.getElementsByTagName('CRS')[1].childNodes[0].nodeValue;
      // console.log('crs', crs);
      // Projected Bounding box
      const projBBOX = rootLayer.getElementsByTagName('BoundingBox')[0];
      this.mapCanvasExtent = [Number(projBBOX.getAttribute('minx')), Number(projBBOX.getAttribute('maxx')),
        Number(projBBOX.getAttribute('miny') ), Number(projBBOX.getAttribute('maxy'))];
      this.srsID = projBBOX.getAttribute('CRS');
      // console.log('CRS', this.srsID, AppConfiguration.projDefs[this.srsID.replace(/\D/g, '')]);
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
       // console.log('BBOX', BBOX, westBoundLongitude, eastBoundLongitude, southBoundLatitude, northBoundLatitude);
     }
    console.log('this.mapCanvasExtent', this.mapCanvasExtent, 'this.srsID', this.srsID);

    const nGroups = rootLayer.getElementsByTagName('Layer').length;
    const layerList = xmlText.querySelectorAll('Layer > Layer');
    // console.log('layerList', layerList);
    // console.log('nGroups', nGroups, 'children', rootLayer.children);
    // console.log('children[0]', rootLayer.children[0]);
    // const groupList = [];
    for (let i = 0; i < rootLayer.getElementsByTagName('Layer').length; i++) {
      const node = layerList[i];
      if (node.getElementsByTagName('Layer').length > 0) {
      // tiene layer dentro es un grupo...
        const groupName = layerList[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue;
        const groupTittle = layerList[i].getElementsByTagName('Title')[0].childNodes[0].nodeValue;
        // console.log('group details', i, groupName, groupTittle);
        const layersinGroup = layerList[i].querySelectorAll('Layer > Layer'); // devuelve in node
        // console.log('layers in Group', layersinGroup);
        const listLayersinGroup = [];
        for (let j = 0; j < layersinGroup.length; j++) {
          let layerIsWfs = false;
          const layer = layersinGroup.item(j);

          const geometryType = layer.getAttribute('geometryType');
          // console.log('geometryType', geometryType);
          const layerName = layer.getElementsByTagName('Name')[0].childNodes[0].nodeValue;
          const layerTittle = layer.getElementsByTagName('Title')[0].childNodes[0].nodeValue;
          // const layerLegendUrl = layer.getAttribute('Tittle');
          // let layerLegendUrl = layer.getElementsByTagName('LegendURL')[0].childNodes[0].nodeValue;
          // let layerLegendUrl = layer.getElementsByTagName('LegendURL')[0];
          const urlResource = layer.querySelector('OnlineResource').getAttribute('xlink:href');
          // console.log('checkpoint', j, layerName, layerTittle, urlResource);
          const legendLayer = await this.createLegendLayer(urlResource, layerName);
          // console.log('legendLayer',legendLayer );
          const fields = [];
          if (wfsLayerList.find(element => element === layerName)) {
            layerIsWfs = true;
            // get the editable attributes
            const attrs = layer.getElementsByTagName('Attributes')[0];
            // console.log('attrs', attrs);
            for (let k = 0; k < attrs.getElementsByTagName('Attribute').length; k++) {
              const field = attrs.getElementsByTagName('Attribute')[k];
              // console.log('field', field);
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
            visible: false,
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
    // console.log('this.groupsLayers', this.groupsLayers);
    // get the order in which layers are rendered
   // this.layersOrder.push(layerName); // #TODO evaluate if this is needed or worthy, it is not being used somewhere else
    // register the project projection definion in proj4 format
   // const projectionDef = xmlText.getElementsByTagName('proj4')[0].childNodes[0].nodeValue;
   // this.srsID = xmlText.getElementsByTagName('authid')[0].childNodes[0].nodeValue;

    // get the styles for WFS layers
    this.mapQgsStyleService.createAllLayerStyles(this.qGsServerUrl, this.qgsProjectFile, wfsLayerList);
    this.questionService.setQuestions(this.groupsLayers);
  }

    updateMap(qgsfile: string) {
    this.requestProjectInfo(qgsfile);
    }

  createIconSymbols(iconSymbols: any, layerName: any): any{
    // return something for raster
    // console.log ('iconSymbols', iconSymbols);
    if (iconSymbols.nodes.length === 0) {
       // layer does not have symbols, raster
      // return ([{iconSrc: rasterIcon, title: layerName}]);
      return ([{iconSrc: AppConfiguration.rasterIcon, title: layerName}]);
    }
    // aqui puede venir una lista
    const symbolList = [];
    iconSymbols.nodes.forEach(
      icon => {
        // console.log('icon.title and type', icon.title, icon.type);
        if (icon.hasOwnProperty('icon')){
          // it has one element
          symbolList.push({iconSrc: 'data:image/png;base64,' + icon.icon, title: icon.title});
        }
        if (icon.hasOwnProperty('symbols')){
          // it has an array of symbols
          icon.symbols.forEach(symbol => {
            if (symbol.title.length > 0 ) {
              // console.log('symbol.title', symbol.title);
              symbolList.push({iconSrc: 'data:image/png;base64,' + symbol.icon, title: symbol.title});
            }
            // here the code for raster #TODO
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
     // console.log('urlegend replaced', url);
     const legend =  fetch (url)
           .then(response => response.json())// the return is implicit
           .then(json => {
              // console.log('lo que llego', json);
              const symbols = this.createIconSymbols(json, layerName);
              return (symbols);
              })
           .then (symbols => symbols)

           .catch(error => console.log ('Error retrivieng symbology', error));
     return legend;
  }

ngOnInit(): void {
    // initialize the map
    console.log('check if here you have the input proyect and load everything then');
    this.initializeMap();
  }

setIdentifying() {
    console.log('this.curInfoLayer.source in setIdentifying', this.curInfoLayer);
    this.map.on('singleclick', (evt) => {         // this was click, still needs to be tested in a touch
      if (evt.dragging) {
        // info.tooltip('hide');
        return;
      }
      if (!this.curInfoLayer){    // undefined or null?
        console.log ('cuando pasa por AQUI....');
        return;
      }
      console.log('this.curInfoLayer.getSource() instanceof ImageWMS', (this.curInfoLayer.getSource() instanceof ImageWMS));
      this.container.nativeElement.style.display = 'block';
      if (this.curInfoLayer.getSource() instanceof ImageWMS ) {
        // console.log('ENTRA AQUI.WMS..');

        this.displayFeatureInfoWMS(evt);
        return;
      }
      if (this.curInfoLayer.getSource() instanceof VectorSource) {
        // console.log('ENTRA AQUI WFS...');
        this.displayFeatureInfoWFS(evt);
      }
    }); //  search around 10 css pixels
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
    // console.log('current class and Style', style, this.currentClass, this.currentStyle );
  }

initializeMap() {
    // customized pinch interactions
    this.pinchZoom = new PinchZoom({constrainResolution: true});
    this.pinchRotate = new PinchRotate({constrainResolution: true});
    this.dragPan = new DragPan();
    this.dragRotate = new DragRotate();
    this.dragZoom = new DragZoom();
    // DragRotate, DoubleClickZoom, DragPan, PinchRotate, PinchZoom, KeyboardPan,
    // KeyboardZoom, MouseWheelZoom, DragZoom, Select, DragBox
    //
    this.dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [
        GeoJSON,
        KML,
      ]
    });
    this.map = new Map({
       interactions: defaultInteractions({constrainResolution: true}),  // , pinchZoom: false, pinchRotate: false})
       // .extend([ this.pinchRotate, this.pinchZoom]),  // removed 17-03 this.dragAndDropInteraction,this.dragRotate, this.dragZoom
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
    console.log('Interactions onInit', this.map.getInteractions());
  }

createHelpTooltip(){
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
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltip);
  }

updateMapView() {
    /** Uses the map extent and projection written in the Qgs project (this.mapCanvasExtent [xmin, xmax, ymin, ymax])
     * to update the mapView after the map initialization.
     *  To do that creates to point and calculate the center.
     */
      // get a center for the map
      // this.mapCanvasExtent = [xmin, xmax, ymin, ymax];
    const leftMinCorner = new Point([this.mapCanvasExtent[0], this.mapCanvasExtent[2]]);
    const rightMinCorner = new Point([this.mapCanvasExtent[1], this.mapCanvasExtent[2]]);
    const leftMaxCorner = new Point([this.mapCanvasExtent[0], this.mapCanvasExtent[3]]);
    // console.log ('extent and puntos',  rightMinCorner.getCoordinates(), leftMaxCorner.getCoordinates());
    const hDistance = getDistance(transform(leftMinCorner.getCoordinates(), this.srsID, this.wgs84ID),
      transform(rightMinCorner.getCoordinates(), this.srsID, this.wgs84ID));
    const vDistance = getDistance(transform(leftMaxCorner.getCoordinates(), this.srsID, this.wgs84ID),
      transform(leftMinCorner.getCoordinates(), this.srsID, this.wgs84ID));
    this.mapCenterXY = [this.mapCanvasExtent[0] + hDistance / 2, this.mapCanvasExtent[2] + vDistance / 2];
    // console.log('mapCenterXY', this.mapCenterXY);
    // #TODO this works with projected coordinates --> check for others
    this.view = new View({
      center: [this.mapCenterXY[0], this.mapCenterXY[1]],  // [-66,10] ,
      // extent: this.mapCanvasExtent, // not sure if this will prevent the draggig outside the extent.
      zoom: AppConfiguration.mapZoom, // this.mapZoom,
      minZoom: AppConfiguration.minZoom,
      maxZoom: AppConfiguration.maxZoom,
      projection: this.srsID
    });
    this.map.setView(this.view);
    // this.view.fit(this.mapCanvasExtent);
    this.map.addControl(new ZoomSlider());
    this.map.addControl(new ScaleLine());
    this.map.on('touchstart', function(e) {
      console.log('length', e.touches.length);
    });
    // console.log('this.view.getCenter', this.view.getCenter(), this.view.getProjection(), this.view.calculateExtent());
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
    /**
     * Add a click handler to hide the popup.
     * @return { boolean } Don't follow the href.
     */
    // console.log('this.closer', this.closer);
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
    // console.log('que entra zoomtoHome', [this.mapCenterXY[0], this.mapCenterXY[1]]);
    this.map.getView().setRotation(0);
    this.map.getView().setZoom(AppConfiguration.mapZoom);
    this.map.getView().setCenter([this.mapCenterXY[0], this.mapCenterXY[1]]);
  }

workQgsProject() {
    /** Retrieves the capabilities WFS and WMS associated to the qgis project listed in AppConfiguration
     * it send these capabilities to other functions to load the WMS and WFS layers
     */

    // console.log('groups', this.groupsLayers);
    const qGsProject = '&map=' + this.qgsProjectFile;
    const qGsServerUrl = this.qGsServerUrl;
    const capRequest = '&REQUEST=GetCapabilities';
    const wfsVersion = 'SERVICE=WFS&VERSION=' + AppConfiguration.wfsVersion;
    const urlWFS = qGsServerUrl + wfsVersion + capRequest + qGsProject;
    // console.log('urlWFS', urlWFS);
    fetch(urlWFS)
      .then(response => response.text())
      .then(text => {
        this.loadWFSlayers(text);
        // self.layerPanel.updateLayerList(self.loadedWfsLayers);   // trying another approach with input
        return (text);
      })
      .catch(error => console.error(error));

    // request getCapabilities to load WMS images
    const wmsVersion = 'SERVICE=WMS&VERSION=' + AppConfiguration.wmsVersion;
    const urlWMS = qGsServerUrl + wmsVersion + capRequest + qGsProject;
    let parser: any;
    parser = new WMSCapabilities();
    // console.log('urlWMS', urlWMS);
    fetch(urlWMS)
      .then(response => {
        return response.text();
      })
      .then(text => {
        const xmlWMStext = parser.read(text);
        this.loadWMSlayers(qGsServerUrl + wmsVersion + qGsProject, xmlWMStext);

        // this.reorderingGroupsLayers();
        this.reorderingGroupsLayers();
        return (xmlWMStext);
      })
      .catch(error => console.error(error));
    /*
    // WMTS is not fully yet implemented in qGIS server (31/08/2020) lets skip it for now
     // request getCapabilites to load WMTS layers
     const wmtsVersion = 'SERVICE=WMTS&VERSION=' + AppConfiguration.wmtsVersion;
     const urlWMTS = qGsServerUrl + wmtsVersion + capRequest + qGsProject;
     const parserWMTS = new WMTSCapabilities();
     const xmlWMTS = fetch(urlWMTS)
       .then(response => {
         return response.text();
       })
       .then(text => {
         const xmlWMTS = parserWMTS.read(text);
         this.loadWMTSlayers(xmlWMTS);
         this.reorderingGroupsLayers();
       }); */


  }


reorderingGroupsLayers() {
    // #TODO here maybe delete layers tha were not published

    /*
     *  Moves the groups and allocate layers on it according to the order in the project
     *  @param groups: contain the groups for which layers will be ordered
     */
    const nGroups = this.groupsLayers.length;
    let nLysInGrp = 0;
    this.groupsLayers.forEach(group => {
      // console.log('indexOf', this.groupsLayers.indexOf(group), group.layers);
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') === group.groupName) {
          const grpZIndex = (nGroups - this.groupsLayers.indexOf(group)) * 10;
          layer.setZIndex(grpZIndex);
          // console.log('layer', layer.get('name'), layer.getLayers().array_.length);
          // order layers inside the group
          if (layer.getLayers().array_.length > 0) {
            // console.log('tiene capas dentro', group.groupName);
            nLysInGrp = layer.getLayers().array_.length;  // numbers of layers in the
            layer.getLayers().forEach(lyrInGrp => {
              lyrInGrp.setZIndex(grpZIndex - (group.layers.findIndex(x => x.layerName === lyrInGrp.get('name')) + 1));  // will work until 10 layers/group
            });
          }

        }
      });
    });
    console.log('loaded layers..', this.map.getLayers());
  }

loadWMTSlayers(xmlWMTS: WMTSCapabilities) {
    /**
     * Orders layer groups in the map
     * @param xmlWMTS WMTS capabilities fromm thw QGIS proj
     */
    console.log(xmlWMTS);
    const layerList = xmlWMTS.Contents.Layer;
    layerList.forEach(layer => {
      const options = optionsFromCapabilities(xmlWMTS, {
        layer: layer.Identifier,
        matrixSet: AppConfiguration.srsName,  // only one system
        crossOrigin: null
      });
      const WMSTLayer = new TileLayer({
        source: new WMTS(options),
        name: layer.Identifier
      });
      this.addWebServLayer(layer.Identifier, WMSTLayer);
    });
  }

reorderingGroups(groups) {
    /**
     *  Moves the groups and allocate layers on it according to the order in the project
     *  @param groups: contain the groups for which layers will be ordered
     *  try to make one function that receives the groups for which layers will be ordered.
     */
    const nGroups = this.groupsLayers.length;
    let nLysInGrp = 0;
    this.groupsLayers.forEach(group => {
      // console.log('indexOf', this.groupsLayers.indexOf(group), group.layers);
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') === group.name) {
          const grpZIndex = (nGroups - this.groupsLayers.indexOf(group)) * 10;
          layer.setZIndex(grpZIndex);
          // console.log('layer', layer.get('name'), layer.getLayers().array_.length);
          // order layers inside the group
          if (layer.getLayers().array_.length > 0) {
            // console.log('tiene capas dentro', group.name);
            nLysInGrp = layer.getLayers().array_.length;  // numbers of layers in the
            layer.getLayers().forEach(lyrInGrp => {
              // console.log('indexOF inside', group.name, lyrInGrp.get('name'), group.layers.findIndex( x => x.name === lyrInGrp.get('name')));
              lyrInGrp.setZIndex(grpZIndex - group.layers.findIndex(x => x.name === lyrInGrp.get('name')));  // will work until 10 layers/group
            });
          }

        }
      });
    });
  }

parseProject(qgsfile: string) {
    /** uses the xml text of qgs project file listed in AppConfiguration to load
     * it send part of the xml text to other functions to load part of the project
     * 1. A dictionary of layer styles
     * 2. A dictionary with the layer geometries
     *
     */
    const fieldLayers = {};
    const xmlParser = new DOMParser();
    const xmlText = xmlParser.parseFromString(qgsfile, 'text/xml');
    console.log ('xmlText', xmlText);
    // comment temporal #todo this.projectTitle = xmlText.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    // register the project projection definion in proj4 format
    const projectionDef = xmlText.getElementsByTagName('proj4')[0].childNodes[0].nodeValue;
    this.srsID = xmlText.getElementsByTagName('authid')[0].childNodes[0].nodeValue;
    proj4.defs(this.srsID, projectionDef);
    register(proj4);
    const mapcanvas = xmlText.getElementsByTagName('mapcanvas')[0];
    const units = mapcanvas.getElementsByTagName('units')[0].childNodes[0].nodeValue;
    const extent = mapcanvas.getElementsByTagName('extent')[0];
    const xmin = Number(extent.getElementsByTagName('xmin')[0].childNodes[0].nodeValue);
    const xmax = Number(extent.getElementsByTagName('xmax')[0].childNodes[0].nodeValue);
    const ymin = Number(extent.getElementsByTagName('ymin')[0].childNodes[0].nodeValue);
    const ymax = Number(extent.getElementsByTagName('ymax')[0].childNodes[0].nodeValue);
    // console.log(`xmin xmax ymin ymax ${ xmin } ${ xmax } ${ ymin } ${ ymax } `);
    // extent [minx, miny, maxx, maxy].
    this.mapCanvasExtent = [xmin, xmax, ymin, ymax];
    const projectionWKT = xmlText.getElementsByTagName('wkt');
    if (projectionWKT.length > 0) {
      const projectWKT = xmlText.getElementsByTagName('wkt')[0].childNodes[0].nodeValue
        .replace('PROJCRS', 'PROJCS');
      const m = projectWKT.indexOf('[', projectWKT.indexOf('BBOX'));
      const n = projectWKT.indexOf(']', m);
      const bbox = projectWKT.slice(m + 1, n).split(',');
      this.BBOX = [Number(bbox[0]), Number(bbox[1]), Number(bbox[2]), Number(bbox[3])];
      // console.log(`bbox ${ this.BBOX }`);
    } else {
      this.BBOX = this.mapCanvasExtent;
    }
    this.projectProjection = new Projection({
      code: this.srsID,
      extent: this.BBOX,
    });
    const layerTreeGroup = xmlText.getElementsByTagName('layer-tree-group')[0];
    // get the order in which layers are rendered
    const nLayers = layerTreeGroup.getElementsByTagName('layer-tree-layer').length;
    for (let i = 0; i < nLayers; i++) {
      const node = layerTreeGroup.getElementsByTagName('layer-tree-layer')[i];
      const layerName = node.getAttribute('name');
      this.layersOrder.push(layerName); // #TODO evaluate if this is needed or worthy, it is not being used somewhere else
    }
    // get the wfs map layers as stated in the proj file
    const wfsLayersList = [];
    const wfsLayers = xmlText.getElementsByTagName('WFSLayers')[0];
    const nlayerWFS = wfsLayers.getElementsByTagName('value').length;
    // console.log('wfs layers in project file', wfsLayers, nlayerWFS);
    for (let i = 0; i < nlayerWFS; i++) {
      const layerName = wfsLayers.getElementsByTagName('value')[i].childNodes[0].nodeValue;
      wfsLayersList.push(layerName.slice(0, layerName.length - 37)); // 36 is the number of chars added as id + 1 ('_')
    }
    const legend = xmlText.getElementsByTagName('legend')[0];
    // get the layers without groups
    const layersWithoutGroup = [];
    for (let i = 0; i < legend.getElementsByTagName('legendlayer').length; i++) {
      const legendlayer = legend.getElementsByTagName('legendlayer')[i];
      const layerName = legendlayer.getAttribute('name');
      if (legendlayer.parentNode.nodeName !== 'legendgroup') {
        // layersWihoutGroup.push({name: layerName});  // let's try
        if (wfsLayersList.find(element => element === layerName)) {
          layersWithoutGroup.push({name: layerName, wfs: true, onEdit: false});
        } else {
          layersWithoutGroup.push({name: layerName, wfs: false, onEdit: false});
        }
      }
    }
    if (layersWithoutGroup.length > 0 ) {
      this.groupsLayers.push({name: 'Others', layers: layersWithoutGroup});
    }
    for (let i = 0; i < legend.getElementsByTagName('legendgroup').length; i++) {
      const legendGroup = legend.getElementsByTagName('legendgroup')[i];
      const groupName = legendGroup.getAttribute('name');
      // console.log('groupName', groupName);
      const layersinGroup = [];
      for (let j = 0; j < legendGroup.getElementsByTagName('legendlayer').length; j++) {
        const layerInGroup = legendGroup.getElementsByTagName('legendlayer')[j].getAttribute('name');
        // console.log('layerInGroup', layerInGroup);
        if (wfsLayersList.find(element => element === layerInGroup)) {
          layersinGroup.push({name: layerInGroup, wfs: true, onEdit: false});  // onEdi will be kept for the time being
        } else {
          layersinGroup.push({name: layerInGroup, wfs: false, onEdit: false});
        }
      }
      this.groupsLayers.push({name: groupName, layers: layersinGroup});
      // console.log('layers in group', legendGroup.getElementsByTagName('legendlayer').length);
    }

    // #TODO implement something with the groups in the legend
    const mapLayersLst = xmlText.getElementsByTagName('maplayer');
    for (let i = 0; i < mapLayersLst.length; i++) {
      const lyr = xmlText.getElementsByTagName('maplayer')[i];
      const layerName = lyr.getElementsByTagName('layername')[0].childNodes[0].nodeValue;
      const layerGeom = lyr.getAttribute('geometry');
      this.layersGeometryType[layerName] = {layerName, layerGeom};
      const renderer = lyr.getElementsByTagName('renderer-v2')[0];
      // create the OL style for the renderer
      if (renderer) {
        this.mapQgsStyleService.createLayerStyles(layerName, renderer);
      }
      // get the fields, what to do with no-editable fields in QGIS?
      // preferred option is not to edit or input data via keyboard, just select icons oas osm
      const fieldLst = {};
      const fieldsConf = lyr.getElementsByTagName('fieldConfiguration')[0];
      if (fieldsConf) {
        for (let k = 0; k < fieldsConf.children.length; k++) {
          const field = lyr.getElementsByTagName('field')[k];
          const fieldName = field.getAttribute('name');
          fieldLst[fieldName] = field.getElementsByTagName('editWidget')[0].getAttribute('type');
        }
        fieldLayers [layerName] = fieldLst;
      }
    }
    // console.log('fields of layer', fieldLayers);
    // console.log('this.layersGeometryType', this.layersGeometryType);  // #TODO not sure if this is worthy layers migth be not published..
    this.fieldWFSLayers = fieldLayers;
    this.layerStyles = this.mapQgsStyleService.getLayerStyles(); // need to check if this is working well;
    // console.log(this.layerStyles);
  }

loadWMSlayers(urlWMS: string, xmlCapabilities: WMSCapabilities) {
    /**
     * Loads the layers in the QGS project from a OL xmlCapabilities file
     * @param urlWMS the url address of the geo webserver and WMS service
     * @param XmlCapText: OL WMSCapabilities
     */


    try {
      if (!xmlCapabilities.Capability.Layer.Layer) {
        console.log('no layers in WMS');
        return;
      }
      console.log('xmlCapabilities', xmlCapabilities);
      const layerList = xmlCapabilities.Capability.Layer.Layer;
      layerList.forEach(layer => {
        // console.log('this.loadedWfsLayers', this.loadedWfsLayers);
        // console.log('layer', layer);
        if (!this.loadedWfsLayers.find(x => x.layerName.toLowerCase() === layer.Name.toLowerCase())) {
          if (!layer.hasOwnProperty('Layer')) {
            // it is a simple WMS layer without a group
            // console.log('simple layer..', layer.Name);
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
              // console.log('layer in a group..', lyr.Name);
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
            });
          }
        }
      });
      console.log('this.loadedWmsLayers', this.loadedWmsLayers);
    } catch (e) {
      console.log('Error retrieving WMS layers');
      alert('Error loading WMS layers, please check the QGIS project configuration');
    }
  }


addWebServLayer(layerName: any, webServlayer: any) {
    // find the layer in a group
    let groupName = '';
    let groupLayer: any;
    this.groupsLayers.forEach(group => {
      if (group.layers.findIndex(lyr => lyr.layerName === layerName) > -1)   // findIndex return -1 if not found
      {
        groupName = group.groupName;
      }
    });
    // console.log('web layerName and group', layerName, groupName);
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
      if (lyr.get('name') === groupName) {
        groupLayer = lyr;
        return;
      }
    });
    if (groupLayer) {  // Group exist
      // console.log('que esta pasando Dios mio', groupLayer);
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

  /* addWFSLayer(layerName, wfsVectorLayer){
    // find the layer in a group
    let groupName = '';
    this.groupsLayers.forEach(group => {
      if ( group.layers.findIndex(lyr  => lyr.name === layerName) > -1)   // findIndex return -1 if not found
      {
        groupName = group.name;
      }
      });
    // console.log('wfs layerName and group', layerName, groupName);
    // the layer is not in a group, add it to the map and return
    if (groupName === '') {
      this.map.addLayer(wfsVectorLayer);
      return;
    }
    // the layer was in a group and the group does exist
    this.map.getLayers().forEach(lyr  => {
      if (lyr.get('name') === groupName) {
        // console.log ('there is a group already', groupName);
        lyr.getLayers().push(wfsVectorLayer);
        return;
      }
    });
    // the layer was in a group and the group does not exist ==> lets create it
    const newGroup = new LayerGroup({
        name : groupName,
        layers: [wfsVectorLayer]
      });
    this.map.addLayer(newGroup);
   // console.log('pasito a pasito layers in map', this.map.getLayers());
} */

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


popAttrForm(layerName: any, feature: any) {
  /**
   * Build and fire a form according to the editable attriibute of the layer
   * it fires a virtual keyboard for text and slidebar for number
   */
  try {
    this.formQuestions = this.questionService.getQuestions(layerName);
    console.log('this.formQuestions', this.formQuestions);
    this.updateFormQuestions(this.formQuestions, layerName, feature);
    this.updateShowForm(true);
    // adding features to a buffer cache
    /*this.dynamicFormComponent.payLoad$.subscribe(
      (data) => {
                  // assign attributes
                  const newFeature = this.addingAttrFeature(feature, data);
                  // save in the buffer
                  this.saveFeatinBuffer(layerName, layerSource, feature);
        },
      (error) => {console.log('ya no estoy estancada', error); }
    );*/
  }
  catch
    (e) { alert('Error initializing form' + e);  }
  }


updateShowForm(showForm: boolean) {
  this.showFormSubject.next(showForm);
}

getFormData(data: any) {
  console.log('llega payload? in getFormData', data);
  // this.payload = payload;
  // this.payloadSource.next(payload);
  this.updateShowForm(false);
  // assign attributes
  this.addingAttrFeature(data.layerName, data.feature, data.payload);
    // save in the buffer
  this.saveFeatinBuffer(data.layerName, data.feature);
}

/*gettingDataForm(data: any){
  //
  console.log('data in gettingDataForm', data);
  data.then((data) => {
    console.log('data dentro del then', data);
  });
  } */


addingAttrFeature(layerName: string, feature: any,  attr: any){

  // find the layer in groups to get the editable fields
  const tlayer = this.findLayerinGroups(layerName);
  const fields = tlayer.fields;
  console.log('fields in addingAttFeature', fields);
  if (attr !== 'undefined') {
    for (const key in attr) {
      const type = fields.find(x => x.name === key).type;
      console.log ('Name and type of field', key, type);
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



saveFeatinBuffer(layerName: string, feature: any){
  // find layer
  let tlayer: any;
  tlayer = this.findWfsLayer(layerName);
  console.log('layerSource in saveFeatinBuffer', tlayer.source);
  // get data source
  const layerSource = tlayer.source;
  this.editBuffer.push({
    layerName,
    transaction: 'insert',
    feats: feature,
    dirty: true,    // dirty is not in the WFS
    // 'layer': self.curEditingLayer[0],
    source: layerSource
  });
  // console.log('editbuffer', self.editBuffer);
  this.canBeUndo = true;
  this.cacheFeatures.push({
    layerName,
    transaction: 'insert',
    feats: feature,
    dirty: true,    // dirty is not in the WFS
    // 'layer': self.curEditingLayer[0],
    source: layerSource
  });
  console.log('this.editBuffer', this.editBuffer);
}


enableAddShape(shape: string) {
    /** enable the map to draw shape of the Shapetype
     * @param shape: string, type of shape to add e.g., 'POINT', 'LINE', 'CIRCLE'
     */
      // previously addShapeToLayer check the API OL
    console.log ('shape', shape, this.curEditingLayer);

    if (!this.curEditingLayer) {   // velid for null and undefined
      alert('No layer selected to edit');
      return;
    }
    // console.log('this.currentClass', !this.currentClass, this.currentClass);
    const self = this;
    const tsource = this.curEditingLayer.source;
    let type: any;
    let geometryFunction: any;
    this.removeInteractions();  // remove select, modify, delete interactions
    try {
      // this.cacheFeatures = [];  // to remove whatever is there and only undo the last action
      switch (shape) {
        case 'Point': {
          this.draw = new Draw({
            source: tsource,
            type: shape,
            freehand: false,
            stopClick: true,    // not clicks events will be fired when drawing points..
            style: this.getEditingStyle()
          });
          console.log('TRY WITHOUT REMOVING INTERACTIONS');
          this.removeDragPinchInteractions();  // a ver si el mapa deja de moverse cuando se dibuja
          break;
        }
        case 'LineString': {
          this.draw = new Draw({
            source: tsource,
            type: shape,
            freehand: true,
            stopClick: true,    // not clicks events will be fired when drawing points..
            style: this.getEditingStyle(),
            // condition: (this.draw.getPointerCount() < 2)  // #TODO check
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
              }   // dibuja si hay menos de undos dedos..--> mo working
              return false;
            }
          });
          break;
        }
        case 'Square': {
          this.draw = new Draw({  // #TODO change code
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
          break;
        }
        case 'Circle': {   // #TODO change code
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
          break;
        }
      }
      this.map.addInteraction(this.draw);
      // adding snap interaction always after th draw interaction
      this.snap = new Snap({
        source: tsource
      });
      this.map.addInteraction(this.snap);
      this.createMeasureTooltip();
      let listener;
      this.draw.on('drawstart', evt => {
        if (this.currentClass == null){
          // modified 02 03 2021 other atts will be required.
          // e.feature.set('class', this.currentClass);
          alert('Select a symbol');
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
            //    let geom = e.feature.getProperties().geometry;
            const last = geom.getLastCoordinate();
            const first = geom.getFirstCoordinate();
            const sourceProj = self.map.getView().getProjection();
            const distance = getDistance(transform(first, sourceProj, 'EPSG:4326'), transform(last, sourceProj, 'EPSG:4326'));
            // # TODO aqui revisar el buffer y lo demas.
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
        // getPointer is associated to the event?.. #TODO
        console.log ('COUNTING FINGERS in the draw interaction', this.draw.getPointerCount());
        e.feature.setId(this.curEditingLayer.layerName.concat('.', String(this.featId)));
        this.featId = this.featId + 1;
        // correct geometry when drawing circles
        if (self.draw.type_ === 'Circle' && e.feature.getGeometry().getType() !== 'Polygon') {
          e.feature.setGeometry(new fromCircle(e.feature.getGeometry()));
        }
        // automatic closing of lines to produce a polygon
        console.log('self.curEditingLayer && self.draw.type_', self.curEditingLayer, self.draw.type_);
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
            // the line is not save in the buffer, so no invalid geoms are stored
            return;
          }
          const newCoordinates = e.feature.getProperties().geometry.getCoordinates();
          newCoordinates.push(first);
            // console.log('la crea o no antes ?', newCoordinates[newCoordinates.length -1]);
          const tgeometry = new Polygon([newCoordinates]);
          // CHECKING IF VALID GEOMETRY?
          if (!(tgeometry instanceof Polygon)){
            e.feature.setGeometry(null);
            this.unsetMeasureToolTip();
            // the line is not save in the buffer, so no invalid geoms are stored
            return;
          }
          // it was a line and it was converted into a closed polygon
          e.feature.setGeometry(tgeometry);
          // console.log('ES UN POLY valido?', tgeometry);
          self.measureTooltipElement.innerHTML = distance;
          self.measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';  // #TODO styling is not working
          self.measureTooltip.setOffset([0, -7]);
         //  console.log('distance', distance, ' self.measureTooltipElement.innerHTML', self.measureTooltipElement.innerHTML);

        }
        // adding the interactions that were stopped when drawing
        if (self.draw.type_ === 'Point' || self.draw.type_ === 'MultiPoint' || self.draw.type_ === 'Circle') {
          // console.log('interaction en el timeout', self.map.getInteractions());
          setTimeout(() => {
            self.addDragPinchInteractions();
          }, 1000);
        }
        // unset tooltip so that a new one can be created
        this.unsetMeasureToolTip();
        // prompting for attributes and finishing that
        this.popAttrForm(this.curEditingLayer.layerName, e.feature);
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


startDeleting() {
    /** Creates a new select interaction that will be used to delete features
     * in the current editing layer  #TODO: simplify if possible concerning wfs layers and sketch layers
     */
    console.log('this.curEditingLayer.layerName in StartDeleting', this.curEditingLayer.layerName);
    let tlayer: any;
    try {
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') === this.curEditingLayer.layerName) {
          console.log('layer.get(\'name\')', layer.get('name'), this.curEditingLayer.layerName === layer.get('name'));
          tlayer = layer;
          return;
        }
      });
    } catch (e) {
      console.log('error getting the layer in deleting', e);
    }
    this.select = new Select({
      condition: click,  // check if this work on touch
      layers: [tlayer],
      hitTolerance: 7 // check if this is enough
    });
    this.map.addInteraction(this.select);
    const self = this;
    const dirty = true;
    // HERE add code to delete from the source and add to the buffer
    this.select.on('select', function(e) {
      const selectedFeatures = e.target.getFeatures();
      // const cacheFeatures = [];
      if (selectedFeatures.getLength() <= 0) {
        return;
      }
      if (self.curEditingLayer.geometry === 'Point' || self.curEditingLayer.geometry === 'Line'
        || self.curEditingLayer.geometry === 'Polygon') {
        selectedFeatures.forEach(f => {
          const lastFeat = f.clone();
          lastFeat.setId(f.getId()); // to enable adding the feat again?
          const tempId = f.getId();
          // cacheFeatures.push(lastFeat);
          // remove feature from the source
          self.curEditingLayer.source.removeFeature(f);
          // insert feature in a cache --> for undo
          self.editBuffer.push({
            layerName: self.curEditingLayer.layerName,
            transaction: 'delete',  // would it be better to add the opposite operation already, e.g., insert?
            feats: lastFeat,
            dirty,
            source: self.curEditingLayer.source
          });
        });
        // clear the selection --> the style will also be clear
        self.select.getFeatures().clear();
        // update the possibility to undo and the cache for that
        self.canBeUndo = true;
        // self.cacheFeatures.push(cacheFeatures); // this keep open the possibility to delete several an undo several actions
        console.log('cache', self.cacheFeatures);
        console.log('editBuffer', self.editBuffer);
        return;
      } else {
        // this.ediLayer.geometry is different .. so a sketch layer
        selectedFeatures.forEach(f => {
          // cacheFeatures.push(());
          // insert feature in a cache --> for undo
          self.editBuffer.push({
            layerName: self.curEditingLayer.layerName,
            transaction: 'delete',  // would it be better to add the opposite operation already, e.g., insert?
            feats: f.clone(),   // #TODO check id
            dirty: true,
            source: self.curEditingLayer.source
          });
          self.curEditingLayer.removeFeature(f);
        });
        // clear the selection --> the style will also be clear
        self.select.getFeatures().clear();
        // self.curEditingLayer.source.refresh(); // #TODO is this needed?
        // update the possibility to undo
        self.canBeUndo = true;
      }
    });
  }

  startDeletingV0(){
    {
      /** enables to delete features selected with a rectangle when point geomtries or click in other case
       * The user first select the features and then click in the location where those features will be located
       * so far no difference in the code for sketch and WFS layers..
       */
      const tlayer = this.findLayer(this.curEditingLayer.layerName);
      console.log('this.curEditingLayer in DeletingV0', this.curEditingLayer);
      if (tlayer === null) {
        alert('Error retrieving current layer in deleting features');
        return;
      }
      const self = this;
      const tsource = this.curEditingLayer.source;
      this.removeInteractions();
      this.removeDragPinchInteractions();
      this.select = new Select({
        condition: click,  // check if this work on touch
        layers: [tlayer],
        hitTolerance: 7, // check if this is enough
        style: this.selectStyle,
      });
      this.select.getFeatures().clear();
      this.map.addInteraction(this.select);
      const dirty = true;
      console.log('interactions in the map', this.map.getInteractions());
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
      // HERE add code to delete from the source and add to the buffer
      this.select.on('select', function(e) {
        const selectedFeatures = e.target.getFeatures();
        // const cacheFeatures = [];
        if (selectedFeatures.getLength() <= 0) {
          return;
        }
        if (self.curEditingLayer.geometryType === 'Point' || self.curEditingLayer.geometryType === 'Line'
          || self.curEditingLayer.geometryType === 'MultiPoint' || self.curEditingLayer.geometryType === 'Polygon') {

         console.log('Lllega aqui on select XXX');
         selectedFeatures.forEach(f => {
            const lastFeat = f.clone();
            lastFeat.setId(f.getId()); // to enable adding the feat again?
            const tempId = f.getId();
            // remove feature from the source
            self.curEditingLayer.source.removeFeature(f);
            // insert feature in a cache --> for undo
            self.editBuffer.push({
              layerName: self.curEditingLayer.layerName,
              transaction: 'delete',  // would it be better to add the opposite operation already, e.g., insert?
              feats: lastFeat,
              dirty,
              source: self.curEditingLayer.source
            });
          });
          // clear the selection --> the style will also be clear
         self.select.getFeatures().clear();
          // update the possibility to undo and the cache for that
         self.canBeUndo = true;
          // self.cacheFeatures.push(cacheFeatures); // this keep open the possibility to delete several an undo several actions
        // console.log('cache', self.cacheFeatures);
         console.log('editBuffer', self.editBuffer);
         return;
        }
        else {
          // this.ediLayer.geometry is different .. so a sketch layer
          selectedFeatures.forEach(f => {
            // cacheFeatures.push(());
            // insert feature in a cache --> for undo
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
      console.log('es posible que aun quede pinchzoom? o se puede incluir en el if de arriba', this.map.getInteractions());
      if (this.pinchZoom) {
        this.map.removeInteraction(this.pinchZoom); // check if is there
      }
      if (this.pinchRotate) {
        this.map.removeInteraction(this.pinchRotate);   // check if is there
      }
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
    //    console.log('XmlCapText', XmlCapText);
    const tnodes = {};
    const otherSrsLst = [];
    const operationsLst = [];
    let srs: any;
    let operation: any;
    const nLayers = featureTypeList.children.length - 1;
    // te feature list contains a set of operations too
    for (let i = 0; i < nLayers; i++) {
      // let node = featureList[i];
      const node = featureTypeList.getElementsByTagName('FeatureType')[i];
      // console.log("node",node);
      const layerName = node.getElementsByTagName('Name')[0].childNodes[0].nodeValue;
      const layerTitle = node.getElementsByTagName('Title')[0].childNodes[0].nodeValue;
      const defaultSRS = node.getElementsByTagName('DefaultSRS')[0].childNodes[0].nodeValue;
      // validation or warning
      if (defaultSRS !== AppConfiguration.srsName) {
        // #TODO uncomment the following line
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
        // #TODO uncomment alert (`The layer ${ layerTitle } is missing an updating operation, please check your WFS configuration`);
      }
      const bBox = node.getElementsByTagName('ows:WGS84BoundingBox')[0];
      const dimensions = bBox.getAttribute('dimensions');
      const lowCorner = bBox.getElementsByTagName('ows:LowerCorner')[0].childNodes[0].nodeValue;   // x and y
      const upperCorner = bBox.getElementsByTagName('ows:UpperCorner')[0].childNodes[0].nodeValue; // x and y
      // adding a log message for a warning concerning the extension

      if ((lowCorner.split(' ')[0] === '0' && lowCorner.split(' ')[1] === '0')

        && (upperCorner.split(' ')[0] === '0' && upperCorner.split(' ')[1] === '0')) {
        // #TODO uncomment alert (`The BBOX of ${ layerTitle } might be misConfigured, please check the WFS service`);
      }
      // #TODO: raise a warning if the operations excludes Query, Insert, Update or delete
      // console.log('layerName', layerName);
      if (layerName.length > 0) {
        // store layer properties to use later
        const geom = this.findGeometryType(layerName);
        // check editable fields
        // load the layer in the map

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
              return (urlWFS + '&bbox=' + extent.join(',') + ',' + defaultSRS);
            },
            crossOrigin: null,   // gis.stackexchange.com/questions/71715/enabling-cors-in-openlayers
            strategy: bboxStrategy
          });
          /*
          old version
          const vectorSource = new VectorSource ({
          format: new GeoJSON(),
          // the url can be setup to include extent, projection and resolution
          url: urlWFS,
          crossOrigin: null
          });
          */
          const wfsVectorLayer = new VectorLayer({
            source: vectorSource,
            name: layerName,
            // extent [minx, miny, maxx, maxy].
            // extent: [lowCorner.split(' ')[0], lowCorner.split(' ')[1],
            //  upperCorner.split(' ')[0], upperCorner.split(' ')[1]],
            visible: false,   // #TODO comment this line, by default layers are not visible
            zIndex: nLayers - i,   // highest zIndex for the first layer and so on.
            style(feature) {    // this equiv to style: function(feature)
              // console.log(feature.getGeometry().getType(), name);
              // 21/02/20212 migrating to xml styles let layerStyle = self.mapQgsStyleService.findStyle(feature, layerName);
              // migration to jsonStyle
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
            // dimensions: dimensions,
            // bbox: bBox,
          };
          // #TODO verify groups in OL and load in the proper group por defecto que se carguen encima de cualquier wms layer
          // here.. #TODO agregar una function que lea los grupos y capas y lo coloque donde va..
          // this.addWFSLayer(layerName, wfsVectorLayer);
          this.addWebServLayer(layerName, wfsVectorLayer);
          // this.map.addLayer(wfsVectorLayer);
          this.loadedWfsLayers.push(tnodes[layerName]);  // wfsVectorLayer
          // console.log(`Layer added ${ layerName }`);

        } catch (e) {
          console.log(`An error occurred when adding the ${layerTitle}`, e);
        }
      }
    }
    // this.loadedWfsLayers = tnodes;
    // console.log('loaded layers', this.loadedWfsLayers);
    return (this.loadedWfsLayers);
  }

loadDefaultMap() {
    // aqui uun default Map #TODO
  }

readProjectFile(projectFile: any) {
    const qgsProj = fetch(projectFile, {
      method: 'GET',
    })
      .then(response => {
        return response.text();
      })
      .then(text => {
        // console.log(text);
        return (text);
      })
      .catch(err => {
        console.log('Error', err);
        return ('');
      });
    return (qgsProj);
  }

updateMapVisibleGroupLayer(selectedGroupLayer) {
    /** updates the visibility of a group layer in the map
     * @param selectedGroupLayer the layer that was clicked to show/hide
     */
    // console.log('prueba event capture from child emitter', selectedGroupLayer.name);
    this.map.getLayers().forEach(layer => {
      // console.log('nombre grupo selected', selectedGroupLayer.groupName);
      if (selectedGroupLayer.groupName === layer.get('name')) {
        layer.setVisible(!layer.getVisible());
        // console.log('cambia el grupo correcto?', layer.get('name'));
      }
    });
  }

updateMapVisibleLayer(selectedLayer: any){
  /**
   * updates the visibility of a layer in the map
   * @param selectedLayer is a dictionary layer that was clicked to show/hide
   */
    console.log('selectedLayer', selectedLayer);
    const layerName = selectedLayer.layer.layerName;
    const groupName = selectedLayer.groupName;

    console.log('Map groups', this.map.getLayers());
    this.map.getLayers().forEach(layer => {
      if (groupName === layer.get('name')) {
        layer.getLayers().forEach(lyrinGroup => {
          if (layerName === lyrinGroup.get('name')) {
            // console.log('cambia la correcta antes?', lyrinGroup.get('name'), lyrinGroup.getVisible());
            lyrinGroup.setVisible(!lyrinGroup.getVisible());

            return;
          }
        });
        return;
      }
    });
  }

findLayerinGroups(layerName: string): any {
    for (const group of this.groupsLayers) {
      const lyr = group.layers.find(x => x.layerName.toLowerCase() === layerName.toLowerCase());
      if (lyr) {
        console.log ('la consigue en los grupos', lyr);
        return (lyr);
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
   console.log('what is inside updateEditingLayer', layerOnEdit);
   if (this.curEditingLayer) {
      // a layer was being edited - ask for saving changes
      this.stopEditing();  // test is changes are save to the right layer, otherwise it should go #
      if (layerOnEdit === null) {
       this.curEditingLayer = null;
       return;
     }
      layer = this.loadedWfsLayers.find(x => x.layerName === layerOnEdit.layerName);
     // layer contains the source.
      if (this.curEditingLayer === layer) {
        this.curEditingLayer = null;
        this.stopEditing(); // maybe is not needed this should be controlled since the layer panel
        return;
     }
   }
    // the user wants to switch to another layer, already the edit was stopped with the previous layer
   layer = this.loadedWfsLayers.find(x => x.layerName === layerOnEdit.layerName);
   this.curEditingLayer = layer;
   this.startEditing(layer);
 }


stopEditing() {
      /** Disables the interactions on the map to start moving/panning and stop drawing
       *  asks to save changes in the layer if any and call the function for it.
       *  @param editLayer, the layer that was edited / #TODO editLayer is not required
       */
      // stop interactions

      // clear current class and symbol --> it is necessary? when stopping editing but not for saving;
      this.currentClass = null;
      this.currentStyle = null;
      this.removeInteractions();
    }

saveEdits(editLayer: any) {
      // save edits in all layers
      // console.log('editBuffer.indexOf(editLayer.layerName', this.editBuffer.findIndex(x => x.layerName ===  editLayer.layerName) );
      console.log('editlayer en save', editLayer);
      console.log('en save', this.editBuffer);
      if (!(this.editBuffer.length > 0)) {  // nothing to save
        return;
      }
      if (this.editBuffer.findIndex(x => x.layerName ===  editLayer.layerName) === -1)
      { // nothing to save in the editLayer
      return;
      }
      if (editLayer.geometryType === 'Point' || editLayer.geometryType === 'Line' || editLayer.geometryType === 'Polygon'
        || editLayer.geometryType === 'MultiPolygon' || editLayer.geometryType === 'MultiPolygonZ' || editLayer.geometryType === 'MultiPoint')
      {
         this.writeTransactWfs(editLayer);

      }
      else {
          this.saveSketchLayer(editLayer);
          // it is a 'multi' geometry --> sketch layer
        }
      }

saveSketchLayer(editLayer: any) {
    // #TODO
    /** saves the changes in a sketch layer
     * @param editLayer: name of the layer to be saved.
     */
    if (this.editBuffer.length > 0) {
      if (!confirm('Do you want to save changes?')) {//  do not want to save changes
        return;
      }
      console.log('write the code to save sketchLayer' + editLayer);  // save the changes
      return;
    }
  }

startEditing(layer: any) {
    /** Enables the interaction in the map to draw features
     * and update two observables in openLayerService:
     * the geometry type of the layer being edited, and
     * the visibility of the editing toolbar
     */

    try {
      // this.removeInteractions();  //#TODO verify this is done in addShape
      // update the observables
     // this is done from layerPanel commented 01032021 this.openLayersService.updateShowEditToolbar(true);
      console.log('que entra en startediting layer', layer);
      // The problem seem to be that the symbol panel is show before knowing the layer..
      this.openLayersService.updateLayerEditing(layer.layerName, layer.geometryType);
      // clear caches and styles  // #TODO best way to do...
      // this.cacheFeatures = [];
      this.currentClass = null;  // forcing the user to pick and style and cleaning previous style? check


    } catch (e) {
    alert('Error starting editing...');
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
    console.log ('lastOperatoion', lastOperation);
    switch (lastOperation.transaction)
    // rotate and translate are treated as update #TODO change attributes
    {
      case 'insert': {
        // remove from the source
        console.log('feat', lastOperation.feats);
        this.curEditingLayer.source.removeFeature(lastOperation.feats);
        break;
      }
      case 'update': {
        // change to the oldFeat // there could be several features
        lastOperation.feats.forEach( feat => {
          const oldFeat = feat.get('oldFeat');
          oldFeat.getGeometry();
          const curFeatGeomClone = feat.getGeometry().clone();
          // set the geometry to the old one
          feat.setGeometry(oldFeat.getGeometry());
          // set the new old geometry to the current one
          feat.set('oldFeat', curFeatGeomClone);
          // Changes should be available in the buffer
        });
        break;
      }
       case 'delete': {
         // insert back
         // console.log('temp feat', lastOperation.feats.getProperties().class);
         lastOperation.feats.setStyle(null);  // to allow the style function of the layer to render the feat properly
         this.curEditingLayer.source.addFeature(lastOperation.feats);  // TODO styling  //lastOperation.feats
        // this.removeFeatEditBuffer(lastOperation.feats);
       }
    }
    // remove from the edit Buffer
    this.removeFeatEditBuffer(lastOperation.feats);
    console.log('this.editBuffer', this.editBuffer);
  }

writeTransactWfs(editLayer: any) {
    console.log ('entra a save...', this.editBuffer);
    /** saves changes on a wfs layer
     * @param editLayer: layer to save changes stored in the editBuffer
     */
    // sacar los elementos de la capa y remover del arreglo.
    const layerTrs = [];  // initialize
    layerTrs[editLayer.layerName] = [];     // is this needed?
    layerTrs[editLayer.layerName].insert = [];
    layerTrs[editLayer.layerName].delete = [];
    layerTrs[editLayer.layerName].update = [];
    layerTrs[editLayer.layerName].source = editLayer.source;

    this.editBuffer.forEach(t => {
      // create the node for CRU
      // console.log("la consigue o no", layer.get('name'));
      if (t.layerName === editLayer.layerName) {
        // save edits in current edit layer
        switch (t.transaction) {
          case 'insert':
            layerTrs[editLayer.layerName].insert.push(t.feats);   // t.feats is only one feat
            break;
          case 'delete':
            layerTrs[editLayer.layerName].delete.push(t.feats); // t.feats is one feat #TODO next ver delete several
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
    console.log('array insert', layerTrs[editLayer.layerName].insert);
    console.log('array update', layerTrs[editLayer.layerName].update);
    console.log('array delete', layerTrs[editLayer.layerName].delete);
    // Another solution can be to empty the editBuffer here --> it could be some data loss if the insertion fails
    // configure nodes.
    const strService = 'SERVICE=WFS&VERSION=' + AppConfiguration.wfsVersion + '&REQUEST=DescribeFeatureType';
    const strUrl = this.qGsServerUrl + strService + '&map=' + this.qgsProjectFile;
    console.log('strUrl', strUrl);
    const formatWFS = new WFS();
    const formatGML = new GML({
      featureNS: 'http://localhost:4200',
      // featureNS: AppConfiguration.qGsServerUrl,
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
      console.log('str', str);
      return fetch(strUrl, {
        method: 'POST', mode: 'no-cors', body: str
      })
        .then((textInsert) => {
          console.log('text response insert WFS', textInsert.text());
          layerTrs[editLayer.layerName].insert = [];
          if (layerTrs[editLayer.layerName].update.length > 0) {
            // Edits should be done in chain... 1)insert, 2)updates, 3) deletes
            node = formatWFS.writeTransaction(null, layerTrs[editLayer.layerName].update, null, formatGML);
            str = xs.serializeToString(node);
            console.log('pasa x aqui?');
            return fetch(strUrl, {
              method: 'POST', body: str
            })
              .then(respUpdate => {
                console.log('text response update WFS', respUpdate.text());
                layerTrs[editLayer.layerName].update = [];
                if (layerTrs[editLayer.layerName].delete.length > 0) {
                  // Edits should be done in chain... 1)insert, 2)updates, 3) deletes // if enter here only deletes were done
                  node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName].delete, formatGML);
                  str = xs.serializeToString(node);
                  return fetch(strUrl, {
                    method: 'POST', body: str
                  })
                    .then(respDelete => {
                      return respDelete.text();
                    })
                    .then(textDelete => {
                      console.log('text response update WFS', textDelete);
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
          console.log('this.editBufferTemp after saving', this.editBuffer);
        });
    }
    if (layerTrs[editLayer.layerName].update.length > 0) {
      // Edits should be done in chain... 1)insert, 2)updates, 3) deletes // if enter here no inserts were done
      node = formatWFS.writeTransaction(null, layerTrs[editLayer.layerName].update, null, formatGML);
      str = xs.serializeToString(node);
      return fetch(strUrl, {
        method: 'POST', body: str
      })
        .then(respUpdate => {
          console.log('text response update WFS', respUpdate.text());
          layerTrs[editLayer.layerName].update = [];
          if (layerTrs[editLayer.layerName].delete.length > 0) {
            // Edits should be done in chain... 1)insert, 2)updates, 3) deletes // if enter here only deletes were done
            node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName].delete, formatGML);
            str = xs.serializeToString(node);
            return fetch(strUrl, {
              method: 'POST', body: str
            })
              .then(respDelete => {
                return respDelete.text();
              })
              .then(textDelete => {
                console.log('text response update WFS', textDelete);
                layerTrs[editLayer.layerName].delete = [];
                console.log('edit array', layerTrs[editLayer.layerName].delete);
              });
          }
        })
        .then(() => {
          // cleaning the editbuffer when only updates and deletes where done
          this.editBuffer = this.editBuffer.filter(obj => obj.layerName !== editLayer.layerName);
          console.log('this.editBufferTemp after saving', this.editBuffer);
        });
    }
    if (layerTrs[editLayer.layerName].delete.length > 0) {
      console.log ('entra aqui?.. mientras espera la subscription..');
      // Edits should be done in chain... 1)insert, 2)updates, 3) deletes // if enter here only deletes were done
      node = formatWFS.writeTransaction(null, null, layerTrs[editLayer.layerName].delete, formatGML);
      str = xs.serializeToString(node);
      return fetch(strUrl, {
        method: 'POST', body: str
      })
        .then(respDelete => {
          return respDelete.text();
        })
        .then(respDelete => {
          console.log('text response update WFS', respDelete);
          layerTrs[editLayer.layerName].delete = [];
          // cleaning the editbuffer when only deletes were done
          this.editBuffer = this.editBuffer.filter(obj => obj.layerName !== editLayer.layerName);
          console.log('this.editBufferTemp after saving', this.editBuffer);
          });
    }
  }

saveWFSAll() {
  /** this saves all the changes accumulated in the editWFSbuffer
   * it helps to prevent any data loss
   * #TODO
   */
  }

findWfsLayer(layerName: string) {
  /**
   * find the object layer with the name @layername
   * @param layername: string, the name of the layer to find
   * @return tlayer: the object layer found
   */
  let tlayer: any = null;
  // const groupName = this.findLayerinGroups(layerName);
  // console.log('this.map.getLayers() in findlayer', this.map.getLayers());
  tlayer = this.loadedWfsLayers.find(x => x.layerName.toLowerCase() === layerName.toLowerCase());
  console.log('tlayer in findLyer', tlayer);
  return (tlayer);
}

findLayer(layerName: string) {
  let tlayer: any = null;
  const groupName = this.findLayerinGroups(layerName);
  // console.log('groupName', groupName)
  this.map.getLayers().forEach(layer => {
      if (groupName.layerName.toLowerCase() === layer.get('name').toLowerCase()) {
        layer.getLayers().forEach(lyrinGroup => {
          console.log('lyrinGroup.get(\'name\')', lyrinGroup.get('name'));
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
     alert('Error retrieving current layer');
     return;
   }
   this.removeInteractions();
   this.removeDragPinchInteractions();
   this.select = new Select({
      layers: [lyr],   // avoid selecting in other layers..
      condition: click,  // check if this work on touch
      hitTolerance: 7,    // check if we should adjust for # types of geometries..
      style: this.selectStyle,
    });
   this.map.addInteraction(this.select);
   console.log('interactions in the map in startTranslating', this.map.getInteractions());
   this.dragBox = new DragBox({
     className: 'boxSelect',
      condition: touchOnly // platformModifierKeyOnly  // before it did not have any condition
   });
   this.map.addInteraction(this.dragBox);
   const self = this;
   const tsource = this.curEditingLayer.source;
   // add #TODO here the rest of the code.
   // clear a previous selection

   this.dragBox.on('boxend', () => {
    if (this.dragBox.getGeometry() == null) {
      return;
    }
    const extent = this.dragBox.getGeometry().getExtent();
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
     console.log('selected features', selectedFeatures);
     selectedFeatures.forEach( f => {
       updateFeats.push(f);
     });

     // const tempId = f.getId();
     // independently of old or new feat, just add the translation) #TODO check if the order is correct --> last position is saved
     self.editBuffer.push({
         layerName: self.curEditingLayer.layerName,
         transaction: 'update',
         feats: updateFeats,    // add all the features moved in a unique transaction --> check in saving WFS
         source: tsource
       });
     this.select.getFeatures().clear();
     });
   console.log('self.editBuffer', self.editBuffer);
     // clear the selection

   //
   // action can be undo
   this.canBeUndo = true;

   // each time of starting a box clear features
   this.dragBox.on('boxstart', function() {
      self.select.getFeatures().clear();
   });
  }


startRotating() {

  }
startCopying()
{
  }

displayFeatureInfoWFS(evt) {
    const hdms = toStringHDMS(evt.coordinate);
    this.content.nativeElement.innerHTML = '<p>Searching at:</p><code>' + hdms + '</code>';
    this.overlay.setPosition(evt.coordinate);
    const  layerOnIdentifyingName = this.curInfoLayer.get('name');  // this.curInfoLayer is an OL layer object
    const tlayer = this.findLayerinGroups(layerOnIdentifyingName);
    const fieldsToShow = tlayer.fields;
    console.log('layerOnIdentifyingName in displayFeatureInfoWFS', layerOnIdentifyingName);
    // #TODO code for getting features from WFS
    const featureValues = this.map.forEachFeatureAtPixel(evt.pixel, feature => {
        // #TODO aqui -- chequear bounding box or margins..
        const valuesToShow = {};
        console.log('feature', feature);
        for (const field of fieldsToShow){
          // console.log('feature.get(key);', feature.get(key));
          valuesToShow [field.name] = feature.get(field.name);
        }
        return valuesToShow;   // here return all the values available
      }, {
      layerFilter(layer) {
          console.log('layer.get(\'name\') inside wfs foreachpixel', layer.get('name'));
          return layer.get('name') === layerOnIdentifyingName;  // to search only in the active layer
        },
      hitTolerance: 10
      }
    );
    if (featureValues) {
      console.log('featureValues', featureValues);
      // Prepare html text with all the information
      let text = '';
      for (const key in featureValues){
        if (key !== 'img'){
          text = text.concat('<tr><td>' + key + '</td><td>' + featureValues[key] + '</td></tr>');
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
      // this.content.nativeElement.innerHTML = 'Element:<br><code>' + text + '</code>';  // featureValues
      // this.content.nativeElement.innerHTML = '<div id="popupDiv">' + '<b> Element</b> </br>' + '<code>' + text + '</code>' + '</div>';
      this.content.nativeElement.innerHTML = '<div id="popupDiv">' +
        '<table border=0 width=100%>' + '<tr><th>Attribute</th><th>Value</th></tr>' +
        text + '</table>' + '</div>';
      console.log('final text', this.content.nativeElement.innerHTML );
    }
    else {
      this.content.nativeElement.innerHTML = '<p>Not elements found :</p>';
    }
  }
displayFeatureInfoWMS(evt)  {
    /* shows a popup when the user pres click
     * @param evt, the event containing pixel and coordinates
     */
    // display a msg
    const  layerOnIdentifying = this.curInfoLayer;
    console.log('this.curInfoLayer in displayFeatureInfoWMS', layerOnIdentifying);
    const hdms = toStringHDMS(evt.coordinate);
    this.content.nativeElement.innerHTML = '<p>Searching at:</p><code>' + hdms + '</code>';
    this.overlay.setPosition(evt.coordinate);
    const viewResolution =  Number(this.view.getResolution());
    const wmsSource = layerOnIdentifying.getSource();
    const wmsUrl = wmsSource.getFeatureInfoUrl(
        evt.coordinate,    // how to check this with EPSG # 4326 and 3857
        viewResolution,
        AppConfiguration.srsName,
        {INFO_FORMAT: 'application/json' }    // //'text/html'
      );
    console.log('wmsUrl', wmsUrl);
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

findLayerInWfsWms(layerOnIdentifying: any) {
    /*
    * find the layer in wms or wfs groups of loaded layers
    * @param layerOnIdentifying
    * */
   if (layerOnIdentifying.wfs === true) {
     // layer contains the source.
     console.log('layerOnIdentifying', layerOnIdentifying);
    // console.log('layerOnIdentifying', this.loadedWfsLayers);
     return(this.loadedWfsLayers.find(x => x.layerName === layerOnIdentifying.name));
   }
   // console.log('layerOnIdentifying', this.loadedWmsLayers);
   return(this.loadedWmsLayers.find(x => x.layerTitle === layerOnIdentifying.name));
 }

searchLayer(layerName: any, groupName: any) {
    /* only one nest level */
    let layer = null;
    const groupLayers = this.map.getLayers().getArray();
    // find the group in the array
    /* console.log ('groupLayers searchLayer', groupLayers);
    console.log ('groupName searchLayer', groupName);
    console.log ('find searchLayer', groupLayers.find(x => x.get('name') === groupName )); */
    const group = groupLayers.find(x => x.get('name') === groupName );
    // console.log ('group searchLayer', group);
    const layers = group.getLayers().getArray();
    layer = layers.find(x => x.get('name') === layerName );
    return layer;
  }


startIdentifying(layerOnIdentifying: any)
{
  /** enables recovering the infor at certain coordinate
   * @param layer, the object containing name and wfs property as well as onEdit property
   */
  // change mouse pointer
  // TODO resolver///
  if (layerOnIdentifying === null){
    this.map.getTargetElement().style.cursor = '';
    this.curInfoLayer = null;
    this.container.nativeElement.style.display = 'none';
    return;
  }
  console.log('layerOnIdentifying  startIdentifying', layerOnIdentifying );
  const layer = this.searchLayer(layerOnIdentifying.layer.layerName, layerOnIdentifying.groupName); // find the layer in its group
  if (!layer){
    return;
  }
  this.curInfoLayer = layer;   // this is a real OL layer
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
    // console.log('text in WMS info', text);
    }
    return(text);
  }

startMeasuring(measureType = 'line') {
  console.log('que comience la fiesta...', measureType);
  const source = new VectorSource();
  const vector = new VectorLayer({
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
  this.createMeasureTooltip();
  /* this.createHelpTooltip();
  const pointerMoveHandler = evt => {
      if (evt.dragging) {
        return;
      }

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
  this.map.on('pointermove', pointerMoveHandler);
  this.map.getViewport().addEventListener('mouseout', () => {
  this.helpTooltipElement.classList.add('hidden');
});
*/
  // add the vector layer to the map
  this.map.addLayer(vector);
  // add the handler

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

  const type = measureType === 'line' ? 'LineString' : 'Polygon';
  this.draw = new Draw({
        source,
        type,
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


  let listener;
  const self = this;
  this.draw.on('drawstart', function(evt) {
        // set sketch
        sketch = evt.feature;

        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
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
          self.map.removeOverlay(self.measureTooltip);
          self.createMeasureTooltip();
    }, 3000);

        // unset tooltiphelo so that a new one can be created
        // self.helpTooltipElement.innerHTML = '';



        // unsubscribe from the event
        unByKey(listener);
      });
   }

updateOrderGroupsLayers(groupsLayers: any) {
    /*
     *  Moves the groups and allocate layers on it according to the order in the project
     *  @param groups: contain the groups for which layers will be ordered
     */
    // console.log('lo que llega en updateOrderGroups', groupsLayers);
    const nGroups = groupsLayers.length;
    let nLysInGrp = 0;
    groupsLayers.forEach(group => {
      // console.log('indexOf', this.groupsLayers.indexOf(group), group.layers);
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') === group.groupName) {
          const grpZIndex = (nGroups - groupsLayers.indexOf(group)) * 10;
          layer.setZIndex(grpZIndex);
          // console.log('layer', layer.get('name'), layer.getLayers().array_.length);
          // order layers inside the group
          if (layer.getLayers().array_.length > 0){
            // console.log('tiene capas dentro', group.name);
            nLysInGrp = layer.getLayers().array_.length;  // numbers of layers in the
            layer.getLayers().forEach(lyrInGrp => {
              lyrInGrp.setZIndex(grpZIndex - (group.layers.findIndex( x => x.layerName === lyrInGrp.get('name')) + 1));  // works up 9 layersx group
            });
          }

        }
      });
    });
    // console.log('reordered layers..', this.map.getLayers());
    console.log('reordered layers......');
    this.printLayerOrder();
  }

  printLayerOrder(){
    this.map.getLayers().forEach(layer => {
      console.log('group index', layer, layer.get('name') + ': ' + layer.getZIndex());
      if (layer.getLayers().array_.length > 0) {
        layer.getLayers().forEach(lyrInGrp => {
          console.log('layer index', lyrInGrp.get('name')  + ': ' +  lyrInGrp.getZIndex());
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
     /* this.draw.setActive(false);
      this.select.setActive(false);
      this.translate.setActive(false);
      this.snap.setActive(false);
      this.dragBox.setActive(false); */
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
    /*if (this.layersGeometryType[layerName]){
      geometryType = this.layersGeometryType[layerName].layerGeom;
    }*/
    for (const group of this.groupsLayers) {
    const lyr = group.layers.find(x => x.layerName === layerName);
    if (lyr) {
      geometryType = lyr.geometryType;
      // console.log("la consigue en los grupos", lyr.geometryType);
      return (geometryType);
    }
  }
    // console.log('geometryType', layerName, geometryType);
    return (geometryType);
  }
addDragPinchInteractions() {
    // console.log("aqui agregando dragpinch", this.map.getInteractions());
    try {
      const self = this;
      this.map.getInteractions().forEach(
        interaction => {
          if (interaction instanceof DragPan || interaction instanceof DragZoom || interaction instanceof DragRotate
            || interaction instanceof PinchZoom   || interaction instanceof PinchRotate)
          {
            interaction.setActive(true);
           // self.map.removeInteraction(interaction);
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

// have a default map? have a parameter in the cinfiguration file..
}
