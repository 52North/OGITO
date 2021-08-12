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
     // console.log('estilo conseguido para layerName', styleLyr.style);
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
    // return the style for sketch..
    return(this.defineSketchStyle());
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
      //console.log('que sale', jsonStyle);
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
                let symbolLabel = 'default';
                if (layerName.toLowerCase() === 'laute_orte' ) {
                  symbolLabel = 'Lauter Ort';
                }
                if (layerName.toLowerCase() === 'leise_orte' ) {
                  symbolLabel = 'Leiser Ort';
                }
                // this.layerStyles[layerName] = {symbolType: styleType, style: theStyle};
                this.layerStyles[layerName] = {
                  symbolType: styleType,
                  style: {
                    'default': {
                      style: theStyle,      // style is a list
                      label: symbolLabel,
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
    // console.log('urlStyle in createAllLayerStyles', urlStyle);
    const xmlStyles = fetch(urlStyle)
      .then(response => response.text())
      .then(text => {
        this.createWFSlayerStyles(text);
        // self.layerPanel.updateLayerList(self.loadedWfsLayers);   // trying another approach with input
      })
      .catch(error => console.error(error));
  }

  setSketchStyle(layerName: string){
    this.layerStyles[layerName] = {
      symbolType: 'Single Symbol',
      style: {
        default: {
          style: this.defineSketchStyle(),      // style is a list
          label: 'default',
          value: 'default',
          attr: 'default',
          symbol: 'default'
        }
      }
    };
  }

  defineSketchStyle(): any{
    // Sketch layer for example  return a default style #TODO
    const svgMarker= 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaGVpZ2h0PSIyNHB4IgogICB2aWV3Qm' +
      '94PSIwIDAgMjQgMjQiCiAgIHdpZHRoPSIyNHB4IgogICBmaWxsPSIjMDAwMDAwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc2IgogICBzb2RpcG9kaTpkb2NuYW1' +
      'lPSJ3aGVyZV90b192b3RlX2JsYWNrXzI0ZHAuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEgKGM2OGUyMmMzODcsIDIwMjEtMDUtMjMpIgogICB4bWxuczppbmt' +
      'zY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3Jn' +
      'ZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvM' +
      'jAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxMCIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzgiCiAgICAgcGFnZWNvbG9yP' +
      'SIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAg' +
      'IGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2Nhc' +
      'GU6em9vbT0iMzEuMzc1IgogICAgIGlua3NjYXBlOmN4PSIxMS45ODQwNjQiCiAgICAgaW5rc2NhcGU6Y3k9IjEyIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iM' +
      'TkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDAxIgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOSIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMTE5M' +
      'SIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzYiIC8+CiAgPHBhdGgKICAgICBkPSJNMCAwa' +
      'DI0djI0SDBWMHoiCiAgICAgZmlsbD0ibm9uZSIKICAgICBpZD0icGF0aDIiIC8+CiAgPHBhdGgKICAgICBkPSJNIDEyLDEgQyA3LjU5LDEgNCw0LjU5IDQsOSBjIDAs' +
      'NS41NyA2Ljk2LDEzLjM0IDcuMjYsMTMuNjcgTCAxMiwyMy40OSAxMi43NCwyMi42NyBDIDEzLjA0LDIyLjM0IDIwLDE0LjU3IDIwLDkgMjAsNC41OSAxNi40MSwxIDEy' +
      'LDEgWiBtIDAsMTkuNDcgQyA5LjgyLDE3Ljg2IDYsMTIuNTQgNiw5IDYsNS42OSA4LjY5LDMgMTIsMyBjIDMuMzEsMCA2LDIuNjkgNiw2IDAsMy44MyAtNC4yNSw5LjM2I' +
      'C02LDExLjQ3IHoiCiAgICAgaWQ9InBhdGg0IgogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0ic3NjY2Nzc2Nzc3NjIiAvPgo8L3N2Zz4K';

    const svgMarkerColor = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaGVpZ2h0PSIyNHB4IgogIC' +
      'B2aWV3Qm94PSIwIDAgMjQgMjQiCiAgIHdpZHRoPSIyNHB4IgogICBmaWxsPSIjMDAwMDAwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc2IgogICBzb2RpcG9ka' +
      'Tpkb2NuYW1lPSJ3aGVyZV90b192b3RlX2JsYWNrXzI0ZHAuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEgKGM2OGUyMmMzODcsIDIwMjEtMDUtMjMpIgogICB4' +
      'bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5' +
      'zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d' +
      '3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxMCIgLz4KCiAgPHBhdGgKICAgICBkPSJNMCAwaDI0djI0SDBWMHoiCiAgICAgZmlsbD0ibm9' +
      'uZSIKICAgICBpZD0icGF0aDIiIC8+CiAgPHBhdGgKICAgICBkPSJNIDEyLDEgQyA3LjU5LDEgNCw0LjU5IDQsOSBjIDAsNS41NyA2Ljk2LDEzLjM0IDcuMjYsMTMuNjc' +
      'gTCAxMiwyMy40OSAxMi43NCwyMi42NyBDIDEzLjA0LDIyLjM0IDIwLDE0LjU3IDIwLDkgMjAsNC41OSAxNi40MSwxIDEyLDEgWiBtIDAsMTkuNDcgQyA5LjgyLDE3Ljg' +
      '2IDYsMTIuNTQgNiw5IDYsNS42OSA4LjY5LDMgMTIsMyBjIDMuMzEsMCA2LDIuNjkgNiw2IDAsMy44MyAtNC4yNSw5LjM2IC02LDExLjQ3IHoiCiAgICAgaWQ9InBhdG' +
      'g0IgogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0ic3NjY2Nzc2Nzc3NjIgogICAgIHN0eWxlPSJmaWxsOiNkZDFjNzc7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo=';
    const newIcon = new Icon({
      opacity: 1,
      crossOrigin: 'anonymous',
      src: 'data:image/svg+xml;base64,' + svgMarkerColor,
      scale: 0.9,
      // size: size,
      color: '#dd1c77'
    });
    newIcon.load();
    const fill = new Fill({color: 'rgba(255,0,255,0.4)'});
    const stroke = new Stroke({color: '#dd1c77', width: 1.25 });
    const style =
      new Style({
        stroke,
        fill,
        image: newIcon,
      });

    return(style);
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
    else {
      // return the sketch style
      return(this.defineSketchStyle());
    }
  }

  createStyleExposedPop(){
    /** set the style function for the population exposed
     *
     **/
   const popExposedStyle = feature => {
      let defaultStyle = new Style({
        fill: new Fill({
          color: 'red'
        })
      });
      const valuePop = + feature.get('value');
      if (valuePop > 1.6 && valuePop < 5.6) {
        defaultStyle = new Style({
          fill: new Fill({
            color: '#fbf9fd'
          })
        });
        return defaultStyle;
      }
      // 2.6 - 9.5
      if (valuePop >= 5.6 && valuePop < 9.5) {
        defaultStyle = new Style({
          fill: new Fill({
            color: '#dcdcec'
          })
        });
        return defaultStyle;
      }
      // 9.5 - 13.5
      if (valuePop >= 9.5 && valuePop < 13.5) {
        defaultStyle = new Style({
          fill: new Fill({
            color: '#a3a0cb'
          })
        });
        return defaultStyle;
      }
      // 13.5 - 17.5
      if (valuePop >= 13.5 && valuePop < 17.5) {
        defaultStyle = new Style({
          fill: new Fill({
            color: '#6a51a3'
          })
        });
        return defaultStyle;
      }
      // 13.5 - 17.5
      if (valuePop >= 17.5) {
        defaultStyle = new Style({
          fill: new Fill({
            color: '#3f007d'
          })
        });
        return defaultStyle;
      }
    };

   return popExposedStyle;
  }

 createStyleExposedOrg(layerNameLong: string){
    /** set the style function for the population exposed
     *
     */
     let color = '#3f007d';
     let svg = '';
     let layerName = '';
     if (layerNameLong.indexOf('schulen')>=0){
       layerName = 'schulen';
     }
     if (layerNameLong.indexOf('tagesstatten')>=0){
       layerName = 'tagesstatten';
     }
     if (layerNameLong.indexOf('hospitals')>=0){
       layerName = 'hospitals';
     }

     const colors = {schulen: '#67a9cf', tagesstatten : '#ef8a62', hospitals: '#d7191c' };
     const svgs = {
      schulen: 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaGVpZ2h0PSIyNHB4IgogICB2aWV3Qm94PSIw' +
       'IDAgMjQgMjQiCiAgIHdpZHRoPSIyNHB4IgogICBmaWxsPSIjMDAwMDAwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcyNDkiCiAgIHNvZGlwb2RpOmRvY25hbWU' +
       '9InNjaG9vbHMuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEgKGM2OGUyMmMzODcsIDIwMjEtMDUtMjMpIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy' +
       '5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb' +
       '2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZ' +
       'WZzCiAgICAgaWQ9ImRlZnMyNTMiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXcyNTEiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogIC' +
        'AgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ' +
        '2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iNy44' +
         'NDM3NSIKICAgICBpbmtzY2FwZTpjeD0iLTMxLjEwNzU3IgogICAgIGlua3NjYXBlOmN5PSIxOS4zMTQ3NDEiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOT' +
         'IwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMDEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii05IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIxMTkxI' +
         'gogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0iSWNvbnMiIC8+CiAgPGcKICAgICBpZD0iTGF5ZXJ' +
         'fMiIKICAgICBkYXRhLW5hbWU9IkxheWVyIDIiCiAgICAgdHJhbnNmb3JtPSJtYXRyaXgoMC40MjA5ODI3NCwwLDAsMC40MTU2NzA2NiwyLjI2Mjk0ODQsMi4wMDc5Nj' +
       'c5KSI+CiAgICA8ZwogICAgICAgaWQ9Ikljb25zIj4KICAgICAgPHBhdGgKICAgICAgICAgaWQ9InBhdGgxOTciCiAgICAgICAgIHN0eWxlPSJzdHJva2Utd2lkdGg6MC' +
        '40MTgzMTg7ZmlsbDojRkZGRkZGIgogICAgICAgICBjbGFzcz0iY2xzLTEiCiAgICAgICAgIGQ9Ik0gMTIuMTA1NDY5IDIuMDQ4ODI4MSBBIDAuODQxOTY1NDggMC44Mz' +
         'EzNDEzMiAwIDAgMCAxMS41MjUzOTEgMi44Mzk4NDM4IEwgMTEuNTI1MzkxIDYuODkyNTc4MSBMIDguNTc4MTI1IDkuMDc0MjE4OCBMIDQuMzY3MTg3NSA5LjA3NDIxO' +
         'DggQSAwLjQyMjE5NTE3IDAuNDE2ODY3NzkgMCAwIDAgMy45NDcyNjU2IDkuNDkwMjM0NCBMIDMuOTQ3MjY1NiAxOS44ODA4NTkgTCAxMC42ODE2NDEgMTkuODgwODU' +
         '5IEwgMTAuNjgxNjQxIDE1LjcyNDYwOSBBIDAuODQ0NDE5ODEgMC44MzM3NjQ2OCAwIDAgMSAxMS41MjUzOTEgMTQuODk0NTMxIEwgMTMuMjA4OTg0IDE0Ljg5NDUzM' +
         'SBBIDAuODQ0NDE5ODEgMC44MzM3NjQ2OCAwIDAgMSAxNC4wNTA3ODEgMTUuNzI0NjA5IEwgMTQuMDUwNzgxIDE5Ljg4MDg1OSBMIDIwLjc4NzEwOSAxOS44ODA4NTk' +
         'gTCAyMC43ODcxMDkgOS40OTAyMzQ0IEEgMC40MjIxOTUxNyAwLjQxNjg2Nzc5IDAgMCAwIDIwLjM2NTIzNCA5LjA3NDIxODggTCAxNi4xNTYyNSA5LjA3NDIxODgg' +
         'TCAxMy4yMDg5ODQgNi44OTI1NzgxIEwgMTMuMjA4OTg0IDUuMzMzOTg0NCBMIDE2Ljk5ODA0NyA1LjMzMzk4NDQgTCAxNi45OTgwNDcgMi44Mzk4NDM4IEwgMTMuMjA' +
         '4OTg0IDIuODM5ODQzOCBBIDAuODQxOTY1NDggMC44MzEzNDEzMiAwIDAgMCAxMi4xMDU0NjkgMi4wNDg4MjgxIHogTSAxMi4zNjcxODggOS4wNzQyMTg4IEEgMS42OD' +
     'M0ODg5IDEuNjYyMjQ2MiAwIDAgMSAxNC4wNTA3ODEgMTAuNzM2MzI4IEEgMS42ODM5MzEgMS42NjI2ODI2IDAgMSAxIDEyLjM2NzE4OCA5LjA3NDIxODggeiBNIDYuND' +
       'cyNjU2MiAxMC43MzYzMjggTCA3LjMxNDQ1MzEgMTAuNzM2MzI4IEEgMC40MjIxOTUxNyAwLjQxNjg2Nzc5IDAgMCAxIDcuNzM2MzI4MSAxMS4xNTIzNDQgTCA3LjczNjM' +
       'yODEgMTMuMjMwNDY5IEEgMC40MjIxOTUxNyAwLjQxNjg2Nzc5IDAgMCAxIDcuMzE0NDUzMSAxMy42NDY0ODQgTCA2LjQ3MjY1NjIgMTMuNjQ2NDg0IEEgMC40MjIxOTU' +
       'xNyAwLjQxNjg2Nzc5IDAgMCAxIDYuMDUyNzM0NCAxMy4yMzA0NjkgTCA2LjA1MjczNDQgMTEuMTUyMzQ0IEEgMC40MjIxOTUxNyAwLjQxNjg2Nzc5IDAgMCAxIDYuNDcy' +
       'NjU2MiAxMC43MzYzMjggeiBNIDE3LjQxNzk2OSAxMC43MzYzMjggTCAxOC4yNTk3NjYgMTAuNzM2MzI4IEEgMC40MjIxOTUxNyAwLjQxNjg2Nzc5IDAgMCAxIDE4LjY4' +
       'MTY0MSAxMS4xNTIzNDQgTCAxOC42ODE2NDEgMTMuMjMwNDY5IEEgMC40MjIxOTUxNyAwLjQxNjg2Nzc5IDAgMCAxIDE4LjI1OTc2NiAxMy42NDY0ODQgTCAxNy40MTc5' +
       'NjkgMTMuNjQ2NDg0IEEgMC40MjIxOTUxNyAwLjQxNjg2Nzc5IDAgMCAxIDE2Ljk5ODA0NyAxMy4yMzA0NjkgTCAxNi45OTgwNDcgMTEuMTUyMzQ0IEEgMC40MjIxOTUx' +
       'NyAwLjQxNjg2Nzc5IDAgMCAxIDE3LjQxNzk2OSAxMC43MzYzMjggeiBNIDYuNDcyNjU2MiAxNS4zMDg1OTQgTCA3LjMxNDQ1MzEgMTUuMzA4NTk0IEEgMC40MjIxOTUx' +
       'NyAwLjQxNjg2Nzc5IDAgMCAxIDcuNzM2MzI4MSAxNS43MjQ2MDkgTCA3LjczNjMyODEgMTcuODAyNzM0IEEgMC40MjIxOTUxNyAwLjQxNjg2Nzc5IDAgMCAxIDcuMzE0N' +
       'DUzMSAxOC4yMTg3NSBMIDYuNDcyNjU2MiAxOC4yMTg3NSBBIDAuNDIyMTk1MTcgMC40MTY4Njc3OSAwIDAgMSA2LjA1MjczNDQgMTcuODAyNzM0IEwgNi4wNTI3MzQ0I' +
         'DE1LjcyNDYwOSBBIDAuNDIyMTk1MTcgMC40MTY4Njc3OSAwIDAgMSA2LjQ3MjY1NjIgMTUuMzA4NTk0IHogTSAxNy40MTc5NjkgMTUuMzA4NTk0IEwgMTguMjU5NzY2' +
         'IDE1LjMwODU5NCBBIDAuNDIyMTk1MTcgMC40MTY4Njc3OSAwIDAgMSAxOC42ODE2NDEgMTUuNzI0NjA5IEwgMTguNjgxNjQxIDE3LjgwMjczNCBBIDAuNDIyMTk1MT' +
         'cgMC40MTY4Njc3OSAwIDAgMSAxOC4yNTk3NjYgMTguMjE4NzUgTCAxNy40MTc5NjkgMTguMjE4NzUgQSAwLjQyMjE5NTE3IDAuNDE2ODY3NzkgMCAwIDEgMTYuOTk4' +
         'MDQ3IDE3LjgwMjczNCBMIDE2Ljk5ODA0NyAxNS43MjQ2MDkgQSAwLjQyMjE5NTE3IDAuNDE2ODY3NzkgMCAwIDEgMTcuNDE3OTY5IDE1LjMwODU5NCB6IE0gMi44O' +
         'TQ1MzEyIDIwLjcxMjg5MSBBIDAuNjMxNDc0MTEgMC42MjM1MDU5OSAwIDAgMCAyLjg5NDUzMTIgMjEuOTYwOTM4IEwgMjEuODM3ODkxIDIxLjk2MDkzOCBBIDAuNjMx' +
         'NDc0MTEgMC42MjM1MDU5OSAwIDAgMCAyMS44Mzc4OTEgMjAuNzEyODkxIEwgMi44OTQ1MzEyIDIwLjcxMjg5MSB6ICIKICAgICAgICAgdHJhbnNmb3JtPSJtYXRyaX' +
         'goMi4zNzUzOTQzLDAsMCwyLjQwNTc1MDcsLTUuMzc1Mzk0NywtNC44MzA2NzAzKSIgLz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=',
       tagesstatten : 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgZW5hYmxlLWJhY2tncm91bmQ9Im5ldy' +
         'AwIDAgMjQgMjQiCiAgIGhlaWdodD0iMjRweCIKICAgdmlld0JveD0iMCAwIDI0IDI0IgogICB3aWR0aD0iMjRweCIKICAgZmlsbD0iIzAwMDAwMCIKICAgdmVyc2lvb' +
         'j0iMS4xIgogICBpZD0ic3ZnNDU2OCIKICAgc29kaXBvZGk6ZG9jbmFtZT0ia2luZGVyZ2FyZGVuLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4xIChjNjhlMjJj' +
         'Mzg3LCAyMDIxLTA1LTIzKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZG' +
         'lwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3Zn' +
         'IgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bn' +
         'RheC1ucyMiCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvM' +
         'S4xLyI+CiAgPG1ldGFkYXRhCiAgICAgaWQ9Im1ldGFkYXRhNDU3NCI+CiAgICA8cmRmOlJERj4KICAgICAgPGNjOldvcmsKICAgICAgICAgcmRmOmFib3V0PSIiPgog' +
         'ICAgICAgIDxkYzpmb3JtYXQ+aW1hZ2Uvc3ZnK3htbDwvZGM6Zm9ybWF0PgogICAgICAgIDxkYzp0eXBlCiAgICAgICAgICAgcmRmOnJlc291cmNlPSJodHRwOi8vcH' +
         'VybC5vcmcvZGMvZGNtaXR5cGUvU3RpbGxJbWFnZSIgLz4KICAgICAgPC9jYzpXb3JrPgogICAgPC9yZGY6UkRGPgogIDwvbWV0YWRhdGE+CiAgPGRlZnMKICAgICBp' +
         'ZD0iZGVmczQ1NzIiIC8+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIKICAgICBib3JkZXJjb2xvcj0iIzY2NjY2NiIKICAgICB' +
         'ib3JkZXJvcGFjaXR5PSIxIgogICAgIG9iamVjdHRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgZ3VpZGV0b2xlcmFuY2U9IjEwIgogIC' +
         'AgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAg' +
         'IGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMDEiCiAgICAgaWQ9Im5hbWVkdmlldzQ1NzAiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlua3NjYXBlOnpvb2' +
         '09IjI3LjgxMjg2NyIKICAgICBpbmtzY2FwZTpjeD0iMy4yMzU5MTI0IgogICAgIGlua3NjYXBlOmN5PSIxMi41NjYxMjYiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9I' +
         'i05IgogICAgIGlua3NjYXBlOndpbmRvdy15PSIxMTkxIgogICAgIGlua3NjYXBlOndpbmRvdy1tYXhpbWl6ZWQ9IjEiCiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXll' +
         'cj0ic3ZnNDU2OCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIiAvPgogIDxyZWN0CiAgICAgZmlsbD0ibm9uZSIKICAgICBoZWlnaHQ9IjI0IgogIC' +
         'AgIHdpZHRoPSIyNCIKICAgICBpZD0icmVjdDQ1NjQiIC8+CiAgPHBhdGgKICAgICBpZD0icGF0aDQ1NjYiCiAgICAgZD0iTSAxMiAzIEwgMiAxMiBMIDIuMDM5MDYy' +
         'NSAyMCBMIDUgMjAgTCA1IDEyIEwgMTIgNS42ODk0NTMxIEwgMTkgMTIgTCAxOSAyMCBMIDIxLjk5ODA0NyAyMCBMIDIyIDEyIEwgMTIgMyB6IE0gOS45OTYwOTM4ID' +
         'EwLjQ2Mjg5MSBDIDguNjE2MDkzOCAxMC40NjI4OTEgNy40OTYwOTM4IDExLjU4Mjg5MSA3LjQ5NjA5MzggMTIuOTYyODkxIEMgNy40OTYwOTM4IDE0LjM0Mjg5MSA4' +
         'LjYxNjA5MzggMTUuNDYyODkxIDkuOTk2MDkzOCAxNS40NjI4OTEgQyAxMS4zNzYwOTQgMTUuNDYyODkxIDEyLjQ5NjA5NCAxNC4zNDI4OTEgMTIuNDk2MDk0IDEyL' +
         'jk2Mjg5MSBDIDEyLjQ5NjA5NCAxMS41ODI4OTEgMTEuMzc2MDk0IDEwLjQ2Mjg5MSA5Ljk5NjA5MzggMTAuNDYyODkxIHogTSA5LjMxMDU0NjkgMTEuNDA0Mjk3IE' +
         'MgOS43NjMwNDY5IDEyLjA0NDI5NyAxMC41MDcxMDkgMTIuNDYyODkxIDExLjM0OTYwOSAxMi40NjI4OTEgQyAxMS41NDQ2MDkgMTIuNDYyODkxIDExLjczMjEwOSA' +
         'xMi40Mzg5ODQgMTEuOTEyMTA5IDEyLjM5NjQ4NCBDIDExLjk2NDYwOSAxMi41NzM5ODQgMTEuOTk2MDk0IDEyLjc2NTM5MSAxMS45OTYwOTQgMTIuOTYyODkxIEMg' +
         'MTEuOTk2MDk0IDE0LjA2NTM5MSAxMS4wOTg1OTQgMTQuOTYyODkxIDkuOTk2MDkzOCAxNC45NjI4OTEgQyA4Ljg5MzU5MzggMTQuOTYyODkxIDcuOTk2MDkzOCAxN' +
         'C4wNjUzOTEgNy45OTYwOTM4IDEyLjk2Mjg5MSBDIDcuOTk2MDkzOCAxMi44OTAzOTEgOC4wMDAzMTI1IDEyLjgxNjA5NCA4LjAwNzgxMjUgMTIuNzQ2MDk0IEMgO' +
         'C41OTc4MTI1IDEyLjQ4MzU5NCA5LjA2NTU0NjkgMTIuMDAxNzk3IDkuMzEwNTQ2OSAxMS40MDQyOTcgeiBNIDkuMjQ2MDkzOCAxMi45MDAzOTEgQyA5LjA3MzU5M' +
         'zggMTIuOTAwMzkxIDguOTMzNTkzOCAxMy4wNDAzOTEgOC45MzM1OTM4IDEzLjIxMjg5MSBDIDguOTMzNTkzOCAxMy4zODUzOTEgOS4wNzM1OTM4IDEzLjUyNTM5M' +
         'SA5LjI0NjA5MzggMTMuNTI1MzkxIEMgOS40MTg1OTM3IDEzLjUyNTM5MSA5LjU1ODU5MzggMTMuMzg1MzkxIDkuNTU4NTkzOCAxMy4yMTI4OTEgQyA5LjU1ODU5M' +
         'zggMTMuMDQwMzkxIDkuNDE4NTkzNyAxMi45MDAzOTEgOS4yNDYwOTM4IDEyLjkwMDM5MSB6IE0gMTAuNzQ2MDk0IDEyLjkwMDM5MSBDIDEwLjU3MzU5NCAxMi45M' +
         'DAzOTEgMTAuNDMzNTk0IDEzLjA0MDM5MSAxMC40MzM1OTQgMTMuMjEyODkxIEMgMTAuNDMzNTk0IDEzLjM4NTM5MSAxMC41NzM1OTQgMTMuNTI1MzkxIDEwLjc0N' +
         'jA5NCAxMy41MjUzOTEgQyAxMC45MTg1OTQgMTMuNTI1MzkxIDExLjA1ODU5NCAxMy4zODUzOTEgMTEuMDU4NTk0IDEzLjIxMjg5MSBDIDExLjA1ODU5NCAxMy4wN' +
         'DAzOTEgMTAuOTE4NTk0IDEyLjkwMDM5MSAxMC43NDYwOTQgMTIuOTAwMzkxIHogTSAxMy44NDE3OTcgMTUuMDk5NjA5IEMgMTIuNDYxNzk3IDE1LjA5OTYwOSAxM' +
         'S4zNDE3OTcgMTYuMjE5NjA5IDExLjM0MTc5NyAxNy41OTk2MDkgQyAxMS4zNDE3OTcgMTguOTc5NjA5IDEyLjQ2MTc5NyAyMC4wOTk2MDkgMTMuODQxNzk3IDIwL' +
         'jA5OTYwOSBDIDE1LjIyMTc5NyAyMC4wOTk2MDkgMTYuMzQxNzk3IDE4Ljk3OTYwOSAxNi4zNDE3OTcgMTcuNTk5NjA5IEMgMTYuMzQxNzk3IDE2LjIxOTYwOSAxN' +
         'S4yMjE3OTcgMTUuMDk5NjA5IDEzLjg0MTc5NyAxNS4wOTk2MDkgeiBNIDEzLjE1ODIwMyAxNi4wNDI5NjkgQyAxMy42MTA3MDMgMTYuNjgyOTY5IDE0LjM1NDc2N' +
         'iAxNy4wOTk2MDkgMTUuMTk3MjY2IDE3LjA5OTYwOSBDIDE1LjM5MjI2NiAxNy4wOTk2MDkgMTUuNTc5NzY2IDE3LjA3NzY1NiAxNS43NTk3NjYgMTcuMDM1MTU2I' +
         'EMgMTUuODEyMjY2IDE3LjIxMjY1NiAxNS44NDE3OTcgMTcuNDAyMTA5IDE1Ljg0MTc5NyAxNy41OTk2MDkgQyAxNS44NDE3OTcgMTguNzAyMTA5IDE0Ljk0NDI5N' +
         'yAxOS41OTk2MDkgMTMuODQxNzk3IDE5LjU5OTYwOSBDIDEyLjczOTI5NyAxOS41OTk2MDkgMTEuODQxNzk3IDE4LjcwMjEwOSAxMS44NDE3OTcgMTcuNTk5NjA5IE' +
         'MgMTEuODQxNzk3IDE3LjUyNzEwOSAxMS44NDc5NjkgMTcuNDU0NzY2IDExLjg1NTQ2OSAxNy4zODQ3NjYgQyAxMi40NDU0NjkgMTcuMTIyMjY2IDEyLjkxMzIwMyA' +
         'xNi42NDA0NjkgMTMuMTU4MjAzIDE2LjA0Mjk2OSB6IE0gMTMuMDkxNzk3IDE3LjUzNzEwOSBDIDEyLjkxOTI5NyAxNy41MzcxMDkgMTIuNzc5Mjk3IDE3LjY3NzEwO' +
         'SAxMi43NzkyOTcgMTcuODQ5NjA5IEMgMTIuNzc5Mjk3IDE4LjAyMjEwOSAxMi45MTkyOTcgMTguMTYyMTA5IDEzLjA5MTc5NyAxOC4xNjIxMDkgQyAxMy4yNjQyOTc' +
         'gMTguMTYyMTA5IDEzLjQwNDI5NyAxOC4wMjIxMDkgMTMuNDA0Mjk3IDE3Ljg0OTYwOSBDIDEzLjQwNDI5NyAxNy42NzcxMDkgMTMuMjY0Mjk3IDE3LjUzNzEwOSAx' +
         'My4wOTE3OTcgMTcuNTM3MTA5IHogTSAxNC41OTE3OTcgMTcuNTM3MTA5IEMgMTQuNDE5Mjk3IDE3LjUzNzEwOSAxNC4yNzkyOTcgMTcuNjc3MTA5IDE0LjI3OTI5N' +
         'yAxNy44NDk2MDkgQyAxNC4yNzkyOTcgMTguMDIyMTA5IDE0LjQxOTI5NyAxOC4xNjIxMDkgMTQuNTkxNzk3IDE4LjE2MjEwOSBDIDE0Ljc2NDI5NyAxOC4xNjIxMD' +
         'kgMTQuOTA0Mjk3IDE4LjAyMjEwOSAxNC45MDQyOTcgMTcuODQ5NjA5IEMgMTQuOTA0Mjk3IDE3LjY3NzEwOSAxNC43NjQyOTcgMTcuNTM3MTA5IDE0LjU5MTc5Ny' +
         'AxNy41MzcxMDkgeiAiCiAgICAgc3R5bGU9ImZpbGw6cGFyYW0oZmlsbCkjZmZmZmZmIiAvPgo8L3N2Zz4K' ,
       hospitals: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZm' +
         'lsbD0iZmlsbDpwYXJhbShmaWxsKSNmZmZmZmYiPg0KPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPg0KPHBhdGggZD0iTTE5IDNINWMtMS4xIDAtM' +
         'S45OS45LTEuOTkgMkwzIDE5YzAgMS4xLjkgMiAyIDJoMTRjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptLTEgMTFoLTR2NGgtNHYtNEg2di00aDRWNmg0' +
         'djRoNHY0eiIgc3R5bGU9ImZpbGw6cGFyYW0oZmlsbCkjZmZmZmZmIi8+PC9zdmc+'
     };
     if (colors.hasOwnProperty(layerName)) {
       color = colors[layerName];
     }
     if (svgs.hasOwnProperty(layerName)) {
     svg = svgs[layerName];
     }

     console.log('color in createStyleExposedOrg', color, colors[layerName] );

     const newIcon = new Icon({
       opacity: 1,
       crossOrigin: 'anonymous',
       src: 'data:image/svg+xml;base64,' + svgs[layerName],
       scale: 0.9,
       // size: size,
       color
     });
     newIcon.load();
     const orgExposedStyle = new Style({
       image: newIcon,
       fill: new Fill({ color })
     });

     return orgExposedStyle;
  }








}
