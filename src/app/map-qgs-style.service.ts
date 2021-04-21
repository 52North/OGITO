import { Injectable } from '@angular/core';
import CircleStyle from 'ol/style/Circle';
import {Fill, RegularShape, Stroke, Style, Icon, Text, Circle} from 'ol/style';
import {DEVICE_PIXEL_RATIO} from 'ol/has.js';
import {AppConfiguration} from './app-configuration';
import {Parser} from 'xml2js';
import {SwitchMarkerAnalyses} from '@angular/compiler-cli/ngcc/src/analysis/switch_marker_analyzer';


@Injectable({
  providedIn: 'root'
})
export class MapQgsStyleService {
  /** Retrieves the styles for WFS layers in the Qgs project associated
   *
   */
  svgFolder = AppConfiguration.svgFolder;
  nodes = {};   // dictionary to store the layer styles
  layerStyles = {};
  canvas = document.createElement('canvas');
  context = this.canvas.getContext('2d');
  svgToOlParam = {
    fill: 'color',
    stroke: 'color',
    'stroke-width': 'width',
    'stroke-linejoin': 'lineJoin'
  };

  constructor() { }

  findJsonStyle(feature: any, layerName: any): any {
    /** Given a feature and the layerName it returns the corresponding style
     * it is used to get the styles for WFS layers in the Qgs project associated
     * @param { feature } the feature for which to find a rendering style  -- no needed apparently
     * @param { layerName } the name of a WFS layer to be rendered
     */
      // como hacer para saber si es single symbol and so on...
    // console.log('this.layerStyles  in findJsonStyle', this.layerStyles);
    const styleLyr = this.layerStyles[layerName];
    if (styleLyr.symbolType === 'Single symbol'){
     // console.log('estilo conseguido', styleLyr.style);
      return (styleLyr.style['default'].style);
    }
    // #TODO
    // categorized style or by rule ;)
  }


  findStyle(feature: any, layerName: any) {
    /** Given a feature and the layerName it returns the corresponding style
     * it is used to get the styles for WFS layers in the Qgs project associated
     * @param { feature } the feature for which to find a rendering style  -- no needed apparently
     * @param { layerName } the name of a WFS layer to be rendered
     */
    // const featType = feature.getGeometry().getType();
    // here include a default value and styling for # resolution or just something reasonable

    const styleLyr = this.nodes[layerName];
    if (Object.keys(styleLyr).length > 0){
      const attr = styleLyr[Object.keys(styleLyr)[0]].attr; // Which is the attribute used in the simbology
      const featValue = feature.get(attr);
      for (const key of Object.getOwnPropertyNames(styleLyr))
      {
        if (styleLyr[key].value == featValue){
         // console.log ("encontrado",styleLyr[key]['style']);
          return (styleLyr[key].style);    // and array of style is ok too
        }
      }
    }
  }

  createLinePattern(fillColor: any, angle: number, spacing: number, line_width: number) {
    const pixelRatio = DEVICE_PIXEL_RATIO;
    this.canvas.width = 8 * pixelRatio;
    this.canvas.height = 8 * pixelRatio;
    this.context.fillStyle = 'rgba(255,255,255,0.8)';
    this.context.beginPath();
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.width);  // just fill the pattern
    this.context.fill();
    // the stroke
    this.context.beginPath();
    switch (angle) {
      case 45: {
        this.context.moveTo(0, this.canvas.height);
        this.context.lineTo(this.canvas.width, 0);
        break;
      }
      case 90: {
        this.context.moveTo(2, 0);
        this.context.lineTo(2, this.canvas.height);
        break;
      }
      case 135: {
        this.context.moveTo(0, 0);
        this.context.lineTo(this.canvas.width, this.canvas.height);
        break;
      }
      case 180: {
        this.context.moveTo(0, 0);
        this.context.lineTo(this.canvas.width, 0);
        break;
      }
      default:
        for (let i = 10; i < 200; i += 20)
        {
          this.context.moveTo(0, i);
          this.context.lineTo(this.canvas.width, i);
        }
    }
    this.context.lineWidth = line_width * 2;   // in qgis looks good but thinner in OL
    this.context.strokeStyle = fillColor;
    this.context.stroke();
    this.context.fill();
    const thePattern = this.context.createPattern(this.canvas, 'repeat');
    return (thePattern);
  }

  getRGBAcolor(color: any, transparency: string = '1'){
    /** takes a color and retunr in a rgba format used in OL
     * @param color: string color as given in the qgs project file
     * @param transparency: string containing de transparency from 0 to 1
     * by default it put 1 as the transparency.
     * return a string with the color in the rgba format
     */
    let rgbaColor = color .split(',');
    rgbaColor = 'rgba('.concat(rgbaColor[0], ', ', rgbaColor[1], ', ', rgbaColor[2], ',', transparency , ')');
    return(rgbaColor);
  }

  findDefaultStyleProvisional(geometry: any, layerName: any){
    /** Retrieves a default style for a feature of the given geometry in the given layer
     * This can be used to provide style for sketch layers..
     * @param {geometry} geomtry type
     * @param {layerName} name of the layer
     * @returns {Style} default style to render the feature
     */
  }

  mapQsJsonPointSymbol(format: any, onlineResource: any, mark: any, size: any) {
    /**
     * Maps the style returned via getStyle request into OL items
     * @param format: the type of symbol
     * @param onlineResource: url of the symbol if exist
     */

    const color = mark['se:Fill'][0]['se:SvgParameter'][0]._;
    const fill = new Fill({
      color
    });
    // #TODO change the above line and get all params of the fill
    // console.log('mark color', color );
    let newStyle: any;
    switch (format) {
      case 'image/svg+xml': {
        let svg = onlineResource.$['xlink:href'];
        svg = svg. substring(7, svg.length);
        const newIcon = new Icon({
          opacity: 1,
          crossOrigin: 'anonymous',
          src: 'data:image/svg+xml;base64,' + svg,
          scale: 0.9,
          // size: size,
          color
        });
        newIcon.load();
        // Load not yet loaded URI. When rendering a feature with an icon style, the vector renderer will automatically call this method;
        // ypu might want to call this method for preloading or other purposes
        // console.log('svg', onlineResource, svg);
        newStyle = new Style({
          image: newIcon,
          fill
        });
        // console.log('svgMarker in newStyle', newStyle);
        break;
      }
    }
    return newStyle;
  }

  mapQsJsonPolygonSymbol(svgParamFill: any, svgParamStroke: any) {
    /**
     * Creates a ol style from svg params fill and Stroke
     * @aparam svgParamFill the fill color
     * @param svgParamStroke the style for the stroke
     */
    const fillColor = svgParamFill['se:SvgParameter'][0]._;
    // console.log('fillColor', fillColor);
    // #TODO Does the fill have more params?
    const olStrokeParam = {};
    for (let i = 0; i < svgParamStroke['se:SvgParameter'].length; i++) {
     // console.log(svgParamStroke['se:SvgParameter'][i]['$']['name'], svgParamStroke['se:SvgParameter'][i]['_']);
      olStrokeParam[svgParamStroke['se:SvgParameter'][i].$.name] = svgParamStroke['se:SvgParameter'][i]._;
    }
    //  console.log(olStrokeParam);
    const fill = new Fill({
      color: fillColor
    });
    const stroke = new Stroke(olStrokeParam);
    const style = new Style({
      fill,
      stroke
    });
    return style;
  }


  createWFSlayerStyles(xmlTextStyle: any){
    /**
     * Creates symbols
     */
    // console.log('xmlStyle', xmlStyle);
    /*const xmlParser = new DOMParser();
    const xmlStyle= xmlParser.parseFromString(xmlTextStyle, 'text/xml');
    console.log ('xmlStyle', xmlStyle);
    let layers =  xmlStyle.getElementsByTagName('NamedLayer')[0];
    console.log('layers', layers); */
    const parser = new Parser();
    // let layerStyles = [];
    parser.parseString(xmlTextStyle, (err, result) => {
      const jsonStyle = result;
      // console.log('que sale', jsonStyle);
      // console.log(jsonStyle.StyledLayerDescriptor.NamedLayer);
      //  console.log('lenght', jsonStyle.StyledLayerDescriptor.NamedLayer.length);
      for (let i = 0; i < jsonStyle.StyledLayerDescriptor.NamedLayer.length; i++) {
        const layerStyle = jsonStyle.StyledLayerDescriptor.NamedLayer[i];
        const layerName = layerStyle['se:Name'][0];
        for (let j = 0; j < layerStyle.UserStyle[0]['se:FeatureTypeStyle'][0]['se:Rule'].length; j++) {
          const featureStyleRule = layerStyle.UserStyle[0]['se:FeatureTypeStyle'][0]['se:Rule'][j];
          // here to ask for name and if polygonSymbolizer or point Symbolizer
          // console.log('layerName,featureStyle', layerName, featureStyleRule);
          const styleType = featureStyleRule['se:Name'][0];
          if (styleType === 'Single symbol') {
            if (featureStyleRule.hasOwnProperty('se:PointSymbolizer')) {
              // it is a point
              const seGraphic = featureStyleRule['se:PointSymbolizer'][0]['se:Graphic'][0];
              // console.log('seGraphic',seGraphic);
              if (seGraphic.hasOwnProperty('se:ExternalGraphic')) {
                // the online resource with PARAM is in the pos 1
                const format = seGraphic['se:ExternalGraphic'][1]['se:Format'][0];
                const onlineResource = seGraphic['se:ExternalGraphic'][1]['se:OnlineResource'][0];
                const mark = seGraphic['se:Mark'][0];
                const size = seGraphic['se:Size'][0];
                // console.log('format pasa x aqui', seGraphic['se:ExternalGraphic'][1]['se:OnlineResource'][0]);
                const theStyle = this.mapQsJsonPointSymbol(format, onlineResource, mark, size);
                // this.layerStyles[layerName] = {symbolType: styleType, style: theStyle};
                this.layerStyles[layerName] = {
                  symbolType: styleType,
                  style: {
                    'default': {
                      style: theStyle,      // style is a list
                      label: 'default',
                      value: 'default',
                      attr: 'default',
                      symbol: 'default'
                    }
                  }
                };
              }
            }
              if (featureStyleRule.hasOwnProperty('se:PolygonSymbolizer')) {
                // it is a point
                const seFill = featureStyleRule['se:PolygonSymbolizer'][0]['se:Fill'][0];
                // console.log('seFill', seFill);
                const seStroke = featureStyleRule['se:PolygonSymbolizer'][0]['se:Stroke'][0];
                // console.log('seStroke', seStroke);
                const theStyle = this.mapQsJsonPolygonSymbol(seFill, seStroke);
                this.layerStyles[layerName] = {
                  symbolType: styleType,
                  style: {
                    'default': {
                      style: theStyle,      // style is a list
                      label: 'default',
                      value: 'default',
                      attr: 'default',
                      symbol: 'default'
                    }
                  }
                };
              }
            }
          else {
              if (featureStyleRule['ogc:Filter'].length > 0) {
                // there are filter -- categorized symbology
                console.log('TODO categorized symbol');
              }
            }
          }
        }

    });
    // lets parse a JSON
    // #TODO create a default symbol for everything :)
    // console.log('this.layerStyles', this.layerStyles);
  }

  createAllLayerStyles(qGsServerUrl: any, qgsProjectFile: any, layerList: any){
    const qGsProject = '&map=' + qgsProjectFile;
    const capRequest = '&REQUEST=GetStyles';
    const wmsVersion = 'SERVICE=WMS&VERSION=' + AppConfiguration.wmsVersion;
    const urlStyle = qGsServerUrl + wmsVersion + capRequest + qGsProject + '&LAYERS=' + layerList;
    // ('urlStyle', urlStyle);
    const xmlStyles = fetch(urlStyle)
      .then(response => response.text())
      .then(text => {
        this.createWFSlayerStyles(text);
        // self.layerPanel.updateLayerList(self.loadedWfsLayers);   // trying another approach with input
      })
      .catch(error => console.error(error));
  }

  getLayerStyle(layerName: string){
    /** return the style for a layer
     * @param layername: string, the name of the layer
     */
    // console.log('this.layerStyles', this.layerStyles);
    // 01-03 this. nodes  --> this.layerStyles
    if (this.layerStyles[layerName]){
       return this.layerStyles[layerName];
    }
  }


}
