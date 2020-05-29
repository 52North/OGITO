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
import {MapQgsStyleService} from '../map-qgs-style.service';
// import {register} from 'ts-node';
import {defaults as defaultInteractions, DragAndDrop, Draw, Modify, Select, Snap, DragBox} from 'ol/interaction';
import {Translate, DragPan, DragRotate, DragZoom, PinchZoom, PinchRotate} from 'ol/interaction';
import Style from 'ol/style/Style';
import Point from 'ol/geom/Point';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import CircleStyle from 'ol/style/Circle';
import {GeoJSON, KML} from 'ol/format';
import ZoomSlider from 'ol/control/ZoomSlider';
import ScaleLine from 'ol/control/ScaleLine';
import {OpenLayersService} from '../open-layers.service';


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
  dragBox: any;
  dragAndDropInteraction: any;
  loadedWfsLayers = []; // [{layerName: 'uno', layerTitle: 'Layer 1'}, {layerName: 'dos', layerTitle: 'layer 2'}];
  curEditingLayer = null;
  cacheFeatures = [];
  editWfsBuffer = [];
  editSketchBuffer = []; // #TDOD remove?
  layersGeometryType = {};
  layersOrder = [];
  featId = 1000;   // to have an internal identifier for features when editing
  private currentClass: any;
  subsToShapeEdit: Subscription;

  constructor( private mapQgsStyleService: MapQgsStyleService,
               private  openLayersService: OpenLayersService) {

    this.subsToShapeEdit = this.openLayersService.shapeEditType$.subscribe(
      data => {
        this.enableAddShape(data);
      },
      error => { console.log('Error in shapeEditType',error)}
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

  initializeMap(){
    // customized pinch interactions
    this.pinchZoom = new PinchZoom ({constrainResolution: true});
    this.pinchRotate = new PinchRotate({constrainResolution: true});
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
          source: new OSM()
        }),
      ],
      interactions: defaultInteractions ({pinchZoom: false, pinchRotate: false})
        .extend([this.dragAndDropInteraction, this.pinchRotate, this.pinchZoom]),
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
    // console.log (`the new center is ${ this.mapCenterXY }`);
    this.view = new View({
      // fromLonLat([AppConfiguration.mapCenterLng,AppConfiguration.mapCenterLat],this.myProjection)
        center:  [this.mapCenterXY[0], this.mapCenterXY[1]],  // [-66,10] ,
        // extent: this.mapCanvasExtent, // not sure if this will prevent the draggig outside the extent.
        zoom: 13, // this.mapZoom,
        // minZoom: AppConfiguration.minZoom,
        // maxZoom: AppConfiguration.maxZoom,
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
      }).then(text => {
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
    console.log('this.layersGeometryType', this.layersGeometryType);  // #TODO not sure if this is worthy layers migth be not published..
    this.fieldWFSLayers = fieldLayers;
    this.layerStyles = this.mapQgsStyleService.getLayerStyles(); // need to check if this is working well;
    console.log(this.layerStyles);
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
    const self = this;
    if (!this.curEditingLayer) {
      alert('No layer selected to edit');
      return;
    }
    let tsource: any = null;

    this.map.getLayers().forEach(
      layer => {
                if (layer.get('name') === self.curEditingLayer.layerName) {
                  tsource = layer.getSource();
                  console.log('Finds the current layer to add shapes', tsource);
                }
    });
    let type: any;
    let geometryFunction: any;
    // deactivate tany interaction? or remove?
    this.removeInteractions();  // remove select, modify, delete interactions
    try {
      this.cacheFeatures = [];  // to remove whatever is there and only undo the last action
       switch (shape) {
        case 'Point': {
          this.draw = new Draw({
            source: tsource,
            type: shape,
            freehand: false,
            stopClick: true,    // trying to stop moving the map when drawing points..
            style: this.getEditingStyle()
          });

          this.removeDragPinchInteractions();   // a ver si el mapa deja de moverse cuando se dibuja
          break;
        }

      }
      this.map.addInteraction(this.draw);
      // the symbology is missing..  #TODO
      this.draw.on('drawend', (e: any) => {
        // the line below prevent to undo features after stopping editing. This can be changed, just avoiding cleaning the array

        // the feature does not have an ID yet
        e.feature.setId(this.curEditingLayer.layerName.concat('.', String(this.featId)));
        this.featId = this.featId + 1 ;
        // setting the class to set a style
        if (this.currentClass) {
          e.feature.set('class', this.currentClass);
        } else {
          e.feature.set('class', 'default');
        }
        console.log('feat', e.feature, e.feature.getStyle());
      });
    }
    catch (e) {
      console.log('Error adding draw interactions', e);
    }
  }
  removeDragPinchInteractions(){
    try {
      const self = this;
      this.map.getInteractions().forEach(
        interaction => {
              if (interaction instanceof DragPan || interaction instanceof DragZoom || interaction instanceof DragRotate)
              {
                self.map.removeInteraction(interaction);
              }
             });
      console.log ('es posible que aun quede pinchzoom? o se puede incluir en el if de arriba',this.map.getInteractions() );
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
        tnodes[layerName] = {
          layerName, // equivalent to "layerName" : layerName --> k:v
         // layerGeom,
          layerTitle,
          defaultSRS,
          otherSrs: otherSrsLst,
          lowCorner: [lowCorner.split(' ')[0], lowCorner.split(' ')[1]],
          upperCorner: [upperCorner.split(' ')[0], upperCorner.split(' ')[1]],
          operations: operationsLst,
          geometry: geom // Dependent of QGIS project as the styles.
          // dimensions: dimensions,
          // bbox: bBox,
        };
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
    console.log('loaded layers', this.loadedWfsLayers);
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
      .then(function(response) {
        return response.text();
      })
      .then(function(text) {
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
      console.log('prueba event capture from child emitter', selectedLayer);
      this.map.getLayers().forEach(layer => {
        // tslint:disable-next-line:triple-equals
        if (selectedLayer.layerName == layer.get('name')) {
          layer.setVisible (!layer.getVisible());
        }
      });
  }

  updateEditingLayer(layer) {
  console.log('evento emitido, que llega', layer);
    /**  starts or stops the editing mode for the layerName given
     * if there were some edits --> asks for saving changes
     * @param layerName: the layer that the user select to start/stop editing
     */
    // tslint:disable-next-line:triple-equals
    if (this.curEditingLayer) {
      // a layer was being edited - ask for saving changes
      this.stopEditing(this.curEditingLayer);  // test is changes are save to the rigth layer, otherwise it should go #
      if (this.curEditingLayer == layer) {
        this.curEditingLayer = null;
        return;
      }
    }
      // the user wants to switch to another layer, already the edit was stopped with the previous layer
    this.curEditingLayer = layer;
    this.startEditing(layer);
    }

    stopEditing(editLayer){
    /** Disables the interactions on the map to start moving/panning and stop drawing
     *  asks to save changes if any and call the function for it.
     *  @param editLayer, the layer that was edited
     */
    console.log('this.editWfsBuffer.length ', this.editWfsBuffer.length );
    if (this.editWfsBuffer.length > 0) {   // it was a wfs layer to save in writeWFS
      if (!confirm('Do you want to save changes?')) {//  do not want to save changes
        return;
      }
      this.writeTransactWfs(editLayer);
      return;
    }
    // it was a sketch layer
    if (this.editSketchBuffer.length > 0) {
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
    console.log ('entra a startEditing', layer );
    try {
      // this.removeInteractions();  //#TODO verify this is done in addShape
      // update the observables
      this.openLayersService.updateShowEditToolbar(true);
      this.openLayersService.updateLayerEditing(layer.layerName, layer.geometry);
      // clear caches and styles
      this.cacheFeatures = [];
      this.currentClass = null;  // forcing the user to pick and style and cleaning previous style? check


    } catch (e) {
    alert('Error starting editing...');
    }
  }

  saveSketchLayer(editLayer: any){
    /** saves the changes in a sketch layer
     * @param editLayer: name of the layer to be saved.
     */
  }
  writeTransactWfs(editLayer: any){
    /** saves changes on the wfs layer
     * @param editLayer: layer to save changes stored in the editWFSBuffer
     */
    this.cacheFeatures[editLayer] = [];
  }
  saveWFSAll(){
  /** this saves all the changes accumulated in the editWFSbuffer
   * it helps to prevent any data loss
   * #TODO
   */
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
  findGeometryType(layerName){
     /** Finds the geometry type of the layerName by looking in the dictionary filled when parsing the QGS project
      * @oaram layerName: the name of the layer to look for the geometry type
      */
    let geometryType = null;
    if (this.layersGeometryType[layerName]){
      geometryType = this.layersGeometryType[layerName].layerGeom;
    }
    //console.log('geometryType', layerName, geometryType);
    return (geometryType);
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    // unsubscribe all the subscriptions
     // this.subscription.unsubscribe();
  }

}


// have a default map? have a parameter in the cinfiguration file..

