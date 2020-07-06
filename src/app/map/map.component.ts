import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AppConfiguration} from '../app-configuration';
import 'ol/ol.css';
import {Map, View} from 'ol';
import {getDistance} from 'ol/sphere';
import {transform} from 'ol/proj';
import proj4 from 'proj4';
import {register} from 'ol/proj/proj4';
import Projection from 'ol/proj/Projection';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import WMSCapabilities from 'ol/format/WMScapabilities.js';
import Overlay from 'ol/Overlay';
import {defaults as defaultInteractions, DragAndDrop, Draw, Modify, Select, Snap, DragBox} from 'ol/interaction';
import {Translate, DragPan, DragRotate, DragZoom, PinchZoom, PinchRotate} from 'ol/interaction';
import Point from 'ol/geom/Point';
import {Fill, Stroke, Style} from 'ol/style';
import CircleStyle from 'ol/style/Circle';
import {GeoJSON, KML} from 'ol/format';
import ZoomSlider from 'ol/control/ZoomSlider';
import ScaleLine from 'ol/control/ScaleLine';
import {Polygon} from 'ol/geom';
import {fromCircle} from 'ol/geom/Polygon';
import {OpenLayersService} from '../open-layers.service';
import {MapQgsStyleService} from '../map-qgs-style.service';
import WFS from 'ol/format/WFS';
import GML from 'ol/format/GML';
import {click} from 'ol/events/condition.js';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit, OnDestroy {
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
  loadedWfsLayers = []; // [{layerName: 'uno', layerTitle: 'Layer 1'}, {layerName: 'dos', layerTitle: 'layer 2'}];
  curEditingLayer = null;
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
  measureTooltipElement: any;
  measureTooltip: any;
  subsToShapeEdit: Subscription;
  subsTocurrentSymbol: Subscription;
  subsToSaveCurrentLayer: Subscription;
  subsToZoomHome: Subscription;

  constructor( private mapQgsStyleService: MapQgsStyleService,
               private  openLayersService: OpenLayersService) {

    this.subsToShapeEdit = this.openLayersService.shapeEditType$.subscribe(
      data => {
        if (data != null){
          this.enableAddShape(data);
        }
        else {
         this.removeInteractions();   // remove drawingInteractions
        }

      },
      error => { console.log('Error in shapeEditType', error); }
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
       }}
     ,
       error => alert('Error saving layer ' + error)
     );
    this.subsToZoomHome = this.openLayersService.zoomHome$.subscribe(
     data => {
      if (data) {
        this.zoomToHome();
      }
     },
      error => alert ("Error starting zooming Home" + error)
    );
    /*this.openLayersService.deleteFeats$.subscribe(
      data => {
        console.log('que viene', data);
        this.removeInteractions();
        if (true === data) {
          this.startDeleting();
        }
      },
      error => alert('Error deleting features' + error)
    ); */

    this.openLayersService.editAction$.subscribe(
      // starts an action and stop the others..is this ready with stop interactions?
    data => {
    console.log('que viene', data);
    this.removeInteractions();
    if (data === null) {
      return;
    }
    switch (data){
      case 'ModifyBox': {
        this.startTranslating();
        break;
      }
      case 'Rotate':
        {
          this.startRotating();
          break;
        }
      case 'Copy':
        {
          this.startCopying();
          break;
        }
      case 'Identify':
        {
          this.startIdentifying();
          break;
        }
      case 'Delete':
        {
          this.startDeleting();
          break;
        }
      case 'Measure':
        {
          this.startMeasuring();
          break;
        }
      case 'Undo':
      {
        this.undoLastEdit();
        break;
      }
      }
  },
  error => alert('Error implementing action on features' + error)
  );
  }

  ngOnInit(): void {
    // initialize the map
    this.initializeMap();
   // read the project
    const qgsProject = this.readProjectFile(AppConfiguration.curProject);
    qgsProject.then(
     data => {
       this.parseProject(data);
       this.updateMapView();  // uses the projection of the project file and extent to get a center
       this.workQgsProject();
       this.existingProject = true;
       this.openLayersService.updateExistingProject(this.existingProject);
       },
      error  => {
        this.loadDefaultMap();
        console.log ('There is an error retrieving the qGis project of the application, please check the configuration');
      }
    );
  }


  changeSymbol(style: any){
    this.currentStyle = style.value;
    this.currentClass = style.key;
   // console.log('current class and Style', style, this.currentClass, this.currentStyle );
  }
  initializeMap(){
    // customized pinch interactions
    this.pinchZoom = new PinchZoom ({constrainResolution: true});
    this.pinchRotate = new PinchRotate({constrainResolution: true});
    this.dragPan = new DragPan();
    this.dragRotate = new DragRotate();
    this.dragZoom = new DragZoom();

    //
    this.dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [
        GeoJSON,
        KML,
      ]
    });
    this.map = new Map({
      layers: [
        new TileLayer({
          source: new OSM({
            crossOrigin: null
          })
        }),
      ],
      interactions: defaultInteractions ({pinchZoom: false, pinchRotate: false})
        .extend([this.dragAndDropInteraction, this.pinchRotate, this.pinchZoom, this.dragRotate, this.dragZoom]),
      target: 'map',
      view: new View({
        projection: 'EPSG:3857',
        center: [0, 0],
        zoom: 3
      })
    });
    // initialize the select style
    this.selectStyle = new Style({
      stroke: new Stroke({ color: 'rgba(255, 154, 131,0.9)', width: 2, lineDash: [5, 2] }),    // #EE266D
      fill: new Fill({color: 'rgba(234, 240, 216, 0.8)'}),   // 'rgba(0, 0, 0, 0.01)'
      image: new CircleStyle({radius: 7,
        fill: new Fill({color: 'rgba(255, 154, 131, 0.1)'}),
        stroke: new Stroke({color: '#EE266D', width: 2, lineDash: [8, 5]})
      })
    });
  }
  createMeasureTooltip() {
    if (this.measureTooltipElement) {
      this.measureTooltipElement.parentNode.removeChild(this.measureTooltipElement);
    }
    this.measureTooltipElement = document.createElement('div');
    this.measureTooltipElement.className = 'tooltip tooltip-measure';
    this.measureTooltip = new Overlay({
      element: this.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    this.map.addOverlay(this.measureTooltip);
  }

  updateMapView(){
    /** Uses the map extent and projection written in the Qgs project (this.mapCanvasExtent [xmin, xmax, ymin, ymax])
     * to update the mapView after the map initialization.
     *  To do that creates to point and calculate the center.
     */
      // get a center for the map
    const leftMinCorner = new Point([this.mapCanvasExtent[0], this.mapCanvasExtent[2]]);
    const rightMinCorner = new Point([this.mapCanvasExtent[1], this.mapCanvasExtent[3]]);
    const leftMaxCorner = new Point([this.mapCanvasExtent[0], this.mapCanvasExtent[3]]);
   // console.log ('extent and puntos', this.mapCanvasExtent, leftMinCorner.getCoordinates(),
   //   rightMinCorner.getCoordinates(), leftMaxCorner.getCoordinates());
    const hDistance = getDistance(transform(leftMinCorner.getCoordinates(), this.srsID, this.wgs84ID),
                                  transform(rightMinCorner.getCoordinates(), this.srsID, this.wgs84ID));
    const vDistance = getDistance(transform(leftMinCorner.getCoordinates(), this.srsID, this.wgs84ID),
                                  transform(leftMaxCorner.getCoordinates(), this.srsID, this.wgs84ID));
    this.mapCenterXY = [this.mapCanvasExtent[0] + hDistance / 2, this.mapCanvasExtent[2] + vDistance / 2];
    // #TODO this works with projected coordinates --> check for others
    this.view = new View({
        center:  [this.mapCenterXY[0], this.mapCenterXY[1]],  // [-66,10] ,
        // extent: this.mapCanvasExtent, // not sure if this will prevent the draggig outside the extent.
        zoom: AppConfiguration.mapZoom, // this.mapZoom,
        minZoom: AppConfiguration.minZoom,
        maxZoom: AppConfiguration.maxZoom,
        projection: this.srsID // this.projectProjection // 'EPSG:4326'
      });
    this.map.setView(this.view);
    // this.view.fit(this.mapCanvasExtent);
    this.map.addControl(new ZoomSlider());
    this.map.addControl(new ScaleLine());
    this.map.on('touchstart', function(e){
      console.log('length', e.touches.length);
    });
    // console.log('this.view.getCenter', this.view.getCenter(), this.view.getProjection(), this.view.calculateExtent());
  }
  zoomToHome() {
   /**
    * Centers the map canvas view to the center and zoom specified in the Qgsprojec file extent and the appConfiguration
    */
    console.log('que entra zoomtoHome', [this.mapCenterXY[0], this.mapCenterXY[1]]);
    this.map.getView().setRotation(0);
    this.map.getView().setZoom (AppConfiguration.mapZoom);
    this.map.getView().setCenter([this.mapCenterXY[0], this.mapCenterXY[1]]);
  }
  workQgsProject() {
    /** Retrieves the capabilities WFS and WMS associated to the qgis project listed in AppConfiguration
     * it send these capabilities to other functions to load the WMS and WFS layers
     */
    // request getCapabilities to load WMS images
    const qGsProject = AppConfiguration.QgsFileProject;
    const qGsServerUrl = AppConfiguration.qGsServerUrl;
    // console.log("qGsServerUrl",qGsServerUrl)
    const wmsVersion = 'SERVICE=WMS&VERSION=' + AppConfiguration.wmsVersion;
    const capRequest = '&REQUEST=GetCapabilities&map=';
    const urlWMS = qGsServerUrl + wmsVersion + capRequest + qGsProject;
    let parser: any;
    // console.log('urlWMS', urlWMS);
    parser = new WMSCapabilities;
    const self = this;
    const resultXml = fetch(urlWMS)
      .then(response => {
        return response.text();
      })
      .then(text => {
        const xmlWMS = parser.read(text);
        self.loadWMSlayers(xmlWMS);
        return (xmlWMS);
      })
      .catch(error => console.error(error));

    // now go to the WFS
    const wfsVersion = 'SERVICE=WFS&VERSION=' + AppConfiguration.wfsVersion;
    const urlWFS = qGsServerUrl + wfsVersion + capRequest + qGsProject;
    // console.log('urlWFS', urlWFS);
    const resultWfs = fetch(urlWFS)
      .then(response => response.text())
      .then(text => {
        // console.log('result WFS Cap para continuar', text);
        self.loadWFSlayers(text);
        // self.layerPanel.updateLayerList(self.loadedWfsLayers);   // trying another approach with input
        return (text);
      })
      .catch(error => console.error(error));

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
    // console.log ("xmlText", xmlText);
    this.projectTitle = xmlText.getElementsByTagName('title')[0].childNodes[0].nodeValue;
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
    if (projectionWKT.length > 0 ) {
      const projectWKT = xmlText.getElementsByTagName('wkt')[0].childNodes[0].nodeValue
        .replace('PROJCRS', 'PROJCS');
      const m = projectWKT.indexOf('[', projectWKT.indexOf('BBOX'));
      const n = projectWKT.indexOf(']', m);
      const bbox = projectWKT.slice(m + 1, n).split(',');
      this.BBOX = [Number(bbox[0]), Number(bbox[1]), Number(bbox[2]), Number(bbox[3])];
      // console.log(`bbox ${ this.BBOX }`);
    }
    else {
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
    // get the map layers and symbology
    const legendGroups = {};
    for (let i = 0; i < xmlText.getElementsByTagName('legendgroup').length; i++) {
        const legendGroup =  xmlText.getElementsByTagName('legendgroup')[i];
        const groupName = legendGroup.getAttribute('name');
        // console.log('groupName', groupName);
        const layersinGroup = [];
        for (let j = 0; j < legendGroup.getElementsByTagName('legendlayer').length; j++)
        {
          const layerInGroup =  legendGroup.getElementsByTagName('legendlayer')[j].getAttribute('name');
          // console.log('layerInGroup', layerInGroup);
          layersinGroup.push(layerInGroup);
        }
        legendGroups[groupName] = layersinGroup;
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
  loadWMSlayers(XmlCapText){
    // This function load the layers in the QGS project from a OL xmlCapabilities file
   // console.log('Entra WMS', XmlCapText);
  }
  getEditingStyle(){
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
  enableAddShape(shape: string) {
    /** enable the map to draw shape of the Shapetype
     * @param shape: string, type of shape to add e.g., 'POINT', 'LINE', 'CIRCLE'
     */
      // previously addShapeToLayer check the API OL
      // console.log ('shape', shape, this.curEditingLayer);
    const self = this;
    if (!this.curEditingLayer) {
      alert('No layer selected to edit');
      return;
    }
    /*  commented on 23/06
    let tsource: any = null;
    this.map.getLayers().forEach(
      layer => {
        if (layer.get('name') === self.curEditingLayer.layerName) {
          tsource = layer.getSource();
          // console.log('Finds the current layer to add shapes', tsource);
        }
      }); */
    const tsource = this.curEditingLayer.source;
    // console.log('Finds the current layer to add shapes', this.curEditingLayer, tsource);
    let type: any;
    let geometryFunction: any;
    // deactivate tany interaction? or remove?
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
            condition: olBrowserEvent => {
              if (olBrowserEvent.originalEvent.touches) {
                console.log('tocuhes legth', olBrowserEvent.originalEvent.touches.length);
                return olBrowserEvent.originalEvent.touches.length < 2;
              }   // dibuja si hay menos de undos dedos..--> mo working
              return false;
            }
          });
          this.removeDragPinchInteractions();  // to fix the zig zag lines #TODO test it
          break;
        }
        case 'Polygon': {
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
      this.draw.on('drawstart', function(evt) {
        const sketch = evt.feature;
        let tooltipCoord = evt.coordinate;
        listener = sketch.getGeometry().on('change', evt => {
          const geom = evt.target;
          let output;
          // show the tooltip only when drawing polys
          if (self.draw.type_ === 'LineString' && self.curEditingLayer.geometry === 'Polygon') {  // self.curEditingLayer[2]
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

      this.draw.on('drawend', (e: any) => {
        // adding an temporal ID, to handle undo
        e.feature.setId(this.curEditingLayer.layerName.concat('.', String(this.featId)));
        this.featId = this.featId + 1;
        // setting the class to set a style
        if (this.currentClass) {
          e.feature.set('class', this.currentClass);
        } else {
          alert('Select a symbol');
          return;  // #TODO check this
        }
        // console.log('feat', e.feature, e.feature.getStyle());
        // correct geometry when drawing circles
        if (self.draw.type_ === 'Circle' && e.feature.getGeometry().getType() !== 'Polygon') {
          e.feature.setGeometry(new fromCircle(e.feature.getGeometry()));
        }
        // automatic closing of lines to produce a polygon
        if (self.draw.type_ === 'LineString' && self.curEditingLayer.geometry === 'Polygon') {
          console.log('cuando entra aqui');
          const geom = e.feature.getProperties().geometry;
          const threshold = AppConfiguration.threshold;
          const last = geom.getLastCoordinate();
          const first = geom.getFirstCoordinate();
          const sourceProj = this.map.getView().getProjection();
          // transform coordinates to a 4326 to use getDistance
          const distance = getDistance(transform(first, sourceProj, 'EPSG:4326'), transform(last, sourceProj, 'EPSG:4326'));    //
          if (distance < threshold) {
            const newCoordinates = e.feature.getProperties().geometry.getCoordinates();
            newCoordinates.push(first);
            // console.log("la crea o no antes ?", newCoordinates[newCoordinates.length -1]);
            const tgeometry = new Polygon([newCoordinates]);
            if (tgeometry) {
              e.feature.setGeometry(tgeometry);
            }
          }
          self.measureTooltipElement.className = 'tooltip tooltip-static';  // #TODO styling is not working
          self.measureTooltip.setOffset([0, -7]);
        }
        // adding the interactions that were stopped when drawing
        if (self.draw.type_ === 'Point' || self.draw.type_ === 'Circle') {
          // console.log('interaction en el timeout', self.map.getInteractions());
          setTimeout(() => {
            self.addDragPinchInteractions();
          }, 1000);
        }
        // adding features to a buffer cache
        self.editBuffer.push({
          layerName: self.curEditingLayer.layerName,
          transaction: 'insert',
          feats: e.feature,
          dirty: true,    // dirty is not in the WFS
          // 'layer': self.curEditingLayer[0],
          source: tsource
        });
        // console.log('editbuffer', self.editBuffer);
        self.canBeUndo = true;
        self.cacheFeatures.push({
          layerName: self.curEditingLayer.layerName,
          transaction: 'insert',
          feats: e.feature,
          dirty: true,    // dirty is not in the WFS
          // 'layer': self.curEditingLayer[0],
          source: tsource
        });
        // unset tooltip so that a new one can be created
        self.measureTooltipElement.innerHTML = '';
        self.measureTooltipElement = null;
        self.map.removeOverlay(self.measureTooltip);
        self.createMeasureTooltip();
      });

    } catch (e) {
      console.log('Error adding draw interactions', e);
    }
   }
startDeleting(){
  /** Creates a new select interaction that will be used to delete features
   * in the current editing layer
   */
  let tlayer: any;
  try{
  this.map.getLayers().forEach(layer => {
      if (layer.get('name') === this.curEditingLayer.layerName) {
        console.log ('layer.get(\'name\')', layer.get('name'), this.curEditingLayer.layerName === layer.get('name'));
        tlayer = layer;
        return;
      }
    });
  }
  catch (e) {
    console.log('error getting the layer in deleting', e);
  }
  this.select = new Select({
    condition: click,  // check if this work on touch
    layers : [tlayer],
    hitTolerance: 7 // check if this is enough
  });
  this.map.addInteraction(this.select);
  const self = this;
  let dirty = true;
  // HERE add code to delete from the source and add to the buffer
  this.select.on('select', function(e){
    const  selectedFeatures = e.target.getFeatures();
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
          if (self.editBuffer.find(x => x.feats.id_ === tempId && x.dirty === true)){
            // it was a new feature not yet saved in the wfs service
            console.log('nueva a eliminar');
            #TODO just add the operation otherwise it can not be undo
            self.editBuffer = self.editBuffer.filter(x => x.feats.id_ !== tempId);  // retorna los elementos que no tienen la feature
          }
          else if (self.editBuffer.findIndex(x => x.feats.id_ === tempId) < 0) {// && x.dirty !== true)) {
          // it was an existing feature
            console.log('it was an existing feature');
            dirty = false;
            self.editBuffer.push({
              layerName: self.curEditingLayer.layerName,
              transaction: 'delete',
              feats: f,
              dirty,
              source: self.curEditingLayer.source
            });
          }
          // remove feature from the source
          self.curEditingLayer.source.removeFeature(f);
          // insert feature in a cache --> for undo
          self.cacheFeatures.push({
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
          console.log ('cache', self.cacheFeatures );
          console.log ('editBuffer', self.editBuffer );
          return;
    }
    else {
      // this.ediLayer.geometry is different .. so a sketch layer
      selectedFeatures.forEach(f =>
      {
        // cacheFeatures.push(());
        // insert feature in a cache --> for undo
        self.cacheFeatures.push({
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

removeDragPinchInteractions(){
    try {
      const self = this;
      this.map.getInteractions().forEach(
        interaction => {
              if (interaction instanceof DragPan || interaction instanceof DragZoom || interaction instanceof DragRotate
                || interaction instanceof PinchZoom   || interaction instanceof PinchRotate)
              {
                // self.map.removeInteraction(interaction);
                interaction.setActive(false);
              }
             });
      console.log ('es posible que aun quede pinchzoom? o se puede incluir en el if de arriba', this.map.getInteractions() );
      if (this.pinchZoom){
        this.map.removeInteraction(this.pinchZoom); // check if is there
      }
      if (this.pinchRotate){
        this.map.removeInteraction(this.pinchRotate);   // check if is there
      }
    }

    catch (e) {
      console.log ('Error removing Drag/Pinch interactions', e);
    }
  }

  loadWFSlayers(XmlCapText) {
    /** This function load in the map, the layers available in the QGS project via WFS
     * @param XmlCapText the xml text produced by the getCapabilities request
     */
    const self = this;
    const xmlParser = new DOMParser();
    const xmlText = xmlParser.parseFromString(XmlCapText, 'text/xml');
    const featureTypeList = xmlText.getElementsByTagName('FeatureTypeList')[0];
    // console.log('XmlCapText', XmlCapText);
    const tnodes = {};
    const otherSrsLst = [];
    const operationsLst = [];
    let srs: any ;
    let operation: any ;
    const nLayers = featureTypeList.children.length - 1;
    // te feature list contains a set of operations too
    for (let i = 0; i < nLayers ; i++) {
     // let node = featureList[i];
      const node = featureTypeList.getElementsByTagName('FeatureType')[i];
      // console.log("node",node);
      const layerName = node.getElementsByTagName('Name')[0].childNodes[0].nodeValue;
      const layerTitle = node.getElementsByTagName('Title')[0].childNodes[0].nodeValue;
      const defaultSRS = node.getElementsByTagName('DefaultSRS')[0].childNodes[0].nodeValue;
      // validation or warning
      // tslint:disable-next-line:triple-equals
      if (defaultSRS != AppConfiguration.srsName) {
        // #TODO uncomment the following line
        // alert(`The layer ${ layerName }has a different default SRS than the SRS of the project`);
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
         !operationsLst.includes('Update') || !operationsLst.includes('Delete')){
         // #TODO uncomment alert (`The layer ${ layerTitle } is missing an updating operation, please check your WFS configuration`);
      }
      const bBox = node.getElementsByTagName('ows:WGS84BoundingBox')[0];
      const  dimensions = bBox.getAttribute('dimensions');
      const lowCorner = bBox.getElementsByTagName('ows:LowerCorner')[0].childNodes[0].nodeValue;   // x and y
      const upperCorner = bBox.getElementsByTagName('ows:UpperCorner')[0].childNodes[0].nodeValue; // x and y
      // adding a log message for a warning concerning the extension
      // tslint:disable-next-line:triple-equals
      if ((lowCorner.split(' ')[0] == '0' && lowCorner.split(' ')[1] == '0')
        // tslint:disable-next-line:triple-equals
      && (upperCorner.split(' ')[0] == '0' && upperCorner.split(' ')[1] == '0')){
        // #TODO uncomment alert (`The BBOX of ${ layerTitle } might be misConfigured, please check the WFS service`);
      }
       // #TODO: raise a warning if the operations excludes Query, Insert, Update or delete
      // console.log("bBox", dimensions, [lowCorner.split(" ")[0], lowCorner.split(" ")[1]]);
      if (layerName.length > 0) {
        // store layer properties to use later
        const geom = this.findGeometryType(layerName);
        // check editable fields
        // load the layer in the map
        const qGsProject = AppConfiguration.QgsFileProject;
        const qGsServerUrl = AppConfiguration.qGsServerUrl;
        const outputFormat = '&outputFormat=GeoJSON';
        const loadedLayers = [];
        const wfsVersion = 'SERVICE=WFS&VERSION=' + AppConfiguration.wfsVersion;
        // console.log('layername', layerName, 'urlWFS', urlWFS);
        const urlWFS = qGsServerUrl + wfsVersion  + '&request=GetFeature&typename=' + layerName +
          outputFormat  + '&srsname=' + defaultSRS + '&map=' + qGsProject;
        try {
          const vectorSource = new VectorSource ({
          format: new GeoJSON(),
          // the url can be setup to include extent, projection and resolution
          url: urlWFS,
          });
          const wfsVectorLayer = new VectorLayer ({
            source: vectorSource,
            name: layerName,
            // extent [minx, miny, maxx, maxy].
            // extent: [lowCorner.split(' ')[0], lowCorner.split(' ')[1],
            //  upperCorner.split(' ')[0], upperCorner.split(' ')[1]],
            visible: true,   // #TODO comment this line, by default layers are not visible
            zIndex: nLayers - i,   // highest zIndex for the first layer and so on.
            style(feature){
             // console.log(feature.getGeometry().getType(), name);
              let layerStyle = self.mapQgsStyleService.findStyle(feature, layerName);
              if (!layerStyle) {
                layerStyle =  self.mapQgsStyleService.findDefaultStyleProvisional(feature.getGeometry().getType(), layerName);
              }
              return(layerStyle);
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
            geometry: geom, // Dependent of QGIS project as the styles.
            source: vectorSource
            // dimensions: dimensions,
            // bbox: bBox,
          };
          this.map.addLayer(wfsVectorLayer);
          this.loadedWfsLayers.push(tnodes[layerName]);  // wfsVectorLayer
          // console.log(`Layer added ${ layerName }`);

        }
        catch (e) {
          console.log (`An error occurred when adding the ${ layerTitle }`, e);
        }
      }
      }
    // this.loadedWfsLayers = tnodes;
    // console.log('loaded layers', this.loadedWfsLayers);
    return(this.loadedWfsLayers);
  }

  loadDefaultMap(){
    // aqui uun default Map #TODO
  }
  readProjectFile(projectFile): any
  {
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
    return(qgsProj);
  }

  updateMapVisibleLayer(selectedLayer){
    /** update the visibility of a layer in the map
     * @param selectedLayer the layer that was clicked to show/hide
     */
      // console.log('prueba event capture from child emitter', selectedLayer);
      this.map.getLayers().forEach(layer => {
        // tslint:disable-next-line:triple-equals
        if (selectedLayer.layerName == layer.get('name')) {
          layer.setVisible (!layer.getVisible());
        }
      });
  }

  updateEditingLayer(layer) {
  // console.log('evento emitido, que llega', layer);
    /**  starts or stops the editing mode for the layerName given
     * if there were some edits --> asks for saving changes
     * @param layerName: the layer that the user select to start/stop editing
     */
    // tslint:disable-next-line:triple-equals
  if (this.curEditingLayer) {
      // a layer was being edited - ask for saving changes
      this.stopEditing(this.curEditingLayer);  // test is changes are save to the rigth layer, otherwise it should go #
      if (this.curEditingLayer === layer) {
        this.curEditingLayer = null;
        return;
      }
    }
      // the user wants to switch to another layer, already the edit was stopped with the previous layer
  this.curEditingLayer = layer;
  this.startEditing(layer);
    }

    stopEditing(editLayer) {
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

    saveEdits(editLayer: any){
      // console.log('editBuffer.indexOf(editLayer.layerName', this.editBuffer.findIndex(x => x.layerName ===  editLayer.layerName) );
      console.log('en save', this.editBuffer);
      if (!(this.editBuffer.length > 0)) {  // nothing to save
        return;
      }
      if (this.editBuffer.findIndex(x => x.layerName ===  editLayer.layerName) === -1)
      { // nothing to save in the editLayer
      return;
      }
      if (editLayer.geometry === 'Point' || editLayer.geometry === 'Line' || editLayer.geometry === 'Polygon') {
         this.writeTransactWfs(editLayer);
      }
      else {
          this.saveSketchLayer(editLayer);
          // it is a 'multi' geometry --> sketch layer
        }
      }

  saveSketchLayer(editLayer: any){
    // #TODO
    /** saves the changes in a sketch layer
     * @param editLayer: name of the layer to be saved.
     */
    if (this.editBuffer.length > 0) {
      if (!confirm('Do you want to save changes?')) {//  do not want to save changes
        return;
      }
      this.saveSketchLayer(editLayer);  // save the changes
      return;
    }
  }

  startEditing(layer: any) {
    /** Enables the interaction in the map to draw features
     * and update two observables in openLayerService:
     * the geometry type of the layer being edited, and
     * the visibility of the editing toolbar
     */
    // console.log ('entra a startEditing', layer );
    try {
      // this.removeInteractions();  //#TODO verify this is done in addShape
      // update the observables
      this.openLayersService.updateShowEditToolbar(true);
      this.openLayersService.updateLayerEditing(layer.layerName, layer.geometry);
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
  undoLastEdit(){
    /**
     * Undo the last action (insert, update (move), delete)   #TODO update observable to disable button
     * uses the this.editBuffer to do so and the cacheFeatures
     */
    // get only the records for the current layer
    const curEdits = this.editBuffer.filter(obj => obj.layerName === this.curEditingLayer.layerName);
    console.log('curEdits and this.editBuffer', curEdits, this.editBuffer);
    if (!(curEdits.length > 0 )) {
      // nothing to save in current layer
      return;
    }
    const lastOperation = this.editBuffer.filter(obj => obj.layerName === this.curEditingLayer.layerName).pop(); // curEdits.pop();
    console.log ('cureditingLayer', this.curEditingLayer.layerName, lastOperation);
    switch (lastOperation.transaction)
    // rotate and translate are treated as update #TODO change attributes
    {
      case 'insert': {
        // remove from the source
        console.log('feat', lastOperation.feats);
        this.curEditingLayer.source.removeFeature(lastOperation.feats);
        // remove from the edit Buffer
        this.removeFeatEditBuffer(lastOperation.feats);
        break;
      }
      case 'update': {
        // change to the oldFeat
        const oldFeat = lastOperation.feats.get('oldFeat');
        oldFeat.getGeometry();
        const curFeatGeomClone = lastOperation.feats.getGeometry().clone();
        // set the geometry to the old one
        lastOperation.feats.setGeometry(oldFeat.getGeometry());
        // set the new old geometry to the current one
        lastOperation.feats.oldFeat.setGeometry(curFeatGeomClone);
        // Changes should be available in the buffer
        break;
      }
       case 'delete': {
         // insert back
         console.log('feat', lastOperation.feats);
         this.curEditingLayer.source.addFeature(lastOperation.feats);
         this.removeFeatEditBuffer(lastOperation.feats);
       }


    }
  }

  writeTransactWfs(editLayer: any) {
    console.log ("entra a save...", this.editBuffer);
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
            layerTrs[editLayer.layerName].insert.push(t.feats);   // t.feats is an array with only one feat
            break;
          case 'delete':
            layerTrs[editLayer.layerName].delete.push(t.feats); // t.feats is an array with one or several feats
            break;
          case 'update':
            layerTrs[editLayer.layerName].update.push(t.feats); // t.feats is an array with one or several feats
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
    const strUrl = AppConfiguration.qGsServerUrl + strService + '&map=' + AppConfiguration.QgsFileProject;
    const formatWFS = new WFS();
    const formatGML = new GML({
      featureNS: 'http://localhost',
      featureType: editLayer.layerName
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
        method: 'POST', body: str
      })
        .then((textInsert) => {
          console.log('text response insert WFS', textInsert.text());
          layerTrs[editLayer.layerName].insert = [];
          if (layerTrs[editLayer.layerName].update.length > 0) {
            // Edits should be done in chain... 1)insert, 2)updates, 3) deletes
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

  saveWFSAll(){
  /** this saves all the changes accumulated in the editWFSbuffer
   * it helps to prevent any data loss
   * #TODO
   */
  }

  findLayer(layername: string) {
    /**
     * find the object layer with the name @layername
     * @param layername: string, the name of the layer to find
     * @return tlayer: the object layer found
     */
    let tlayer: any = null;
    try{
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') === layername) {
          console.log ('layer.get(\'name\')', layer.get('name'), this.curEditingLayer.layerName === layer.get('name'));
          tlayer = layer;
          return (tlayer);
        }
      });
    }
    catch (e) {
      console.log('error getting the layer', e);
    }
  }

  startTranslating()
  {
    /** enables to move (translate features selected with a rectangle
     * The user first select the features and then click in the location where those features will be located
     * so far no difference in the code for sketch and WFS layers..
     */
   const lyr = this.findLayer(this.curEditingLayer.layerName);
   if (lyr === null) {
     alert('Error retrieving current layer');
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
   this.dragBox = new DragBox({className: 'boxSelect'});
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
     selectedFeatures.forEach( f => {
     // const tempId = f.getId();
     // independently of old or new feat, just add the translation) #TODO check if the order is correct --> last position is saved
     self.editBuffer.push({
         layerName: self.curEditingLayer.layerName,
         transaction: 'update',
         feats: f,
         source: tsource
       });
     });
     console.log('self.editBuffer', self.editBuffer);
     // clear the selection
     this.select.getFeatures().clear();
   });
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
  startIdentifying()
  {
  }
  startMeasuring() {
  }

  updateOrderVisibleLayers(editLayers) {
    /** updates the order in which layers are rendered in the map
     * @param editLayers: the list of layers to arrange the order (emitted by the layerPanel component)
     */
    const nLayers = editLayers.length;
    let tIndex = 1;
    for (const lyr of editLayers) {
      this.map.getLayers().forEach(layer => {
        if (layer.get('name') == lyr.layerName) {
          layer.setZIndex(nLayers - tIndex);
          tIndex = tIndex + 1;
        }
      });
    }
   }
  removeInteractions(){
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
  findGeometryType(layerName){
     /** Finds the geometry type of the layerName by looking in the dictionary filled when parsing the QGS project
      * @oaram layerName: the name of the layer to look for the geometry type
      */
    let geometryType = null;
    if (this.layersGeometryType[layerName]){
      geometryType = this.layersGeometryType[layerName].layerGeom;
    }
    // console.log('geometryType', layerName, geometryType);
    return (geometryType);
  }
  addDragPinchInteractions(){
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

}


// have a default map? have a parameter in the cinfiguration file..

