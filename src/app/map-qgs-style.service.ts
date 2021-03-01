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

  mapQgsSymbol(symType: any, symLyrCls: any, symAlpha: any, props: any){
    /** Retrieves a OL style that is "equivalent" to the style described in a QGS project
     * for now only categorized symbols are supported
     * #TODO implement graduated symbols, it should not be hard
     * @param {symType} type of symbol
     * @param {symLyrCls} name of the symbol layer
     * @param {symAlpha} value of the alfa layer for the symbol
     * @param {props} name of the layer
     * @returns {Olstyle} style in the format of a OL style (it could and array)e
     */

    /*
      let newStyle: any;
      let color: string;
      let outColor: string;
      let stroke: any;
      let fill: any;
      let symText: any;
      const symStyle = {};
      for (let l = 0; l < props.length; l++) {
        const propNode = props[l];
        const clave = propNode.getAttribute('k');
        const valor = propNode.getAttribute('v');
        // console.log("que viene en symLyrCls", symLyrCls);
        symStyle[clave] = valor;
      }
      switch (symLyrCls) {
        case 'SimpleFill': {
          stroke = new Stroke({
            lineJoin: symStyle.joinstyle,
            width: +symStyle.outline_width,
          });
          color = this.getRGBAcolor(symStyle.color, '0.7');
          outColor = this.getRGBAcolor(symStyle.outline_color, '1');
          stroke.setColor(outColor);
          const fillStyle = symStyle.style;
          switch (fillStyle)
          {
            case 'no': {
              newStyle = new Style({
                stroke
              });
              break;
            }
            default: {
              // by default fills the style
              fill = new Fill({
                color
              });
              newStyle = new Style({
                stroke,
                fill
              });
            }
          }
          break;
        }
        case 'LinePatternFill': {
          stroke = new Stroke({
            lineJoin: symStyle.joinstyle,
            width: +symStyle.line_width,
          });
          color = this.getRGBAcolor(symStyle.color, '0.7');
          fill = new Fill();
          const pattern = this.createLinePattern(color, +symStyle.angle , symStyle.distance, +symStyle.line_width); //
          fill.setColor(pattern);
          stroke.setColor('black');
          newStyle = new Style({
            stroke,
            fill
          });
          break;
        }
        case 'SimpleLine': {
          let capStyle = symStyle.capstyle;
          if (symStyle.capstyle == 'flat'){
            capStyle = 'butt';
          }
          let lineDash = '';
          if (symStyle.use_custom_dash == '1'){
            lineDash = symStyle.customdash.split(';').map(Number);
          }
          color = this.getRGBAcolor(symStyle.line_color, '1');
          stroke = new Stroke({
            color,
            lineCap: capStyle,    // symStyle["capstyle"],
            lineJoin: symStyle.joinstyle,
            lineDash,
            lineDashOffset: symStyle.offset,
            // miterLimit: symStyle["joinstyle"],
            width: +symStyle.line_width
          });
          newStyle = new Style({
            stroke
          });
          break;
        }
        case 'SimpleMarker': {
          // console.log("THIS is NEEXXXXT");
          const offset = symStyle.offset.split(',');
          color = this.getRGBAcolor(symStyle.color);
          outColor = this.getRGBAcolor(symStyle.outline_color);
          fill = new Fill({
            color
          });
          stroke = new Stroke({
            color: outColor,
            lineJoin: symStyle.joinstyle,
            width: +symStyle.outline_width * 2  // test *2
          });
          newStyle = new Style({
            image: new CircleStyle({
              radius: +symStyle.size * 2, // test *2 make it responsive..
              fill,
              stroke,
            })
          });
          break;
        }
        case 'SvgMarker':
        {
        color = this.getRGBAcolor(symStyle.color);   // this is symStyle["color"]
        outColor = this.getRGBAcolor(symStyle.outline_color);
        // console.log('symStyle[\'name\']', symStyle['name']);
        let filename: string;
        if (symStyle.name.indexOf('svg/') > 0){
         // filename = this.svgFolder.concat(symStyle['name'].substring(symStyle['name'].indexOf('svg/') + 4, symStyle['name'].len));
          filename = AppConfiguration.svgUrl.concat(symStyle.name.substring(symStyle.name.indexOf('svg/') + 4, symStyle.name.len));
        }
        else
          {
          // filename = this.svgFolder.concat(symStyle['name']);
          filename = AppConfiguration.svgUrl.concat(symStyle.name);
          }
        const size = symStyle.size ;
        const  outlineWidth = +symStyle.outline_width;
        const verticalAnchorPoint = symStyle.vertical_anchor_point;
        // console.log('filename', filename);
        newStyle = new Style({
           image: new Icon({
             color,
             crossOrigin: 'anonymous',
             // imgSize: [50, 50],   // it was 20 #TODO responsive to zoom scale
             scale: 0.05, // #TODO verificar size qgis/ol
             src: filename })
         });
        // console.log('svgMarker in the case', newStyle);
        break;
        }
        case 'FontMarker':
          {

          color = this.getRGBAcolor(symStyle.color);
          outColor = this.getRGBAcolor(symStyle.outline_color);
          stroke = new Stroke({
            color,
            lineJoin: symStyle.joinstyle,
            lineDashOffset: symStyle.offset,
            width: +symStyle.line_width
          });
          let textBaseline = 'top';
          const offset = symStyle.offset.split(',');
          let offsetY = offset[1];
          if (symStyle.chr == 'o' && symStyle.font == 'Geosiana Desa'){
            offsetY = 2 * 19;
            textBaseline = 'bottom';
            symStyle.chr = '\n'.concat(symStyle.chr);
          }
          symText  = new Text({
            font:   'normal '.concat(symStyle.size, 'px ', symStyle.font) ,    // symStyle["size"]
            offsetX: offset[0],
            offsetY, // offset[1],
            textBaseline ,  // 'top' ,
            // placement: ,   // lets keep the default that is point
            scale: 2, // symStyle["size"] ,
            text: symStyle.chr,
            fill: new Fill({
              color,   // equiv --> color:  color
            }),
          });
          newStyle = new Style({
            text: symText,
            // stroke  # ? no se pq esta comentado?
          });
          break;
        }
        case 'FilledMarker': {
          color = this.getRGBAcolor(symStyle.color);
          const size = symStyle.size;
          const scaleMethod = symStyle.diameter;
          const angle = symStyle.angle;
          fill = new Fill({color});
          stroke = new Stroke({color: 'black', width: 2 });   //
          switch (symStyle.name) {
            case 'star': {
              newStyle = new Style({
                image: new RegularShape({
                fill,
                stroke,
                points: 5,
                radius: size * 2,   // test * 2 #TODO make responsive
                radius2: size,
                angle: 0
                })
              });
              break;
            }
            case 'cross_fill': {
              newStyle = new Style({
                image: new RegularShape({
                  fill,
                  stroke,
                  points: 4,
                  radius: size * 2,   // test * 2 #TODO make responsive
                  radius2: 0,
                  angle: 0
                })
              });
              break;
            }
            case 'square': {
              newStyle = new Style({
                image: new RegularShape({
                  fill,
                  stroke,
                  points: 4,
                  radius: size * 2,   // test * 2 #TODO make responsive
                  angle: Math.PI / 4
                })
              });
              break;
            }
            case 'triangle': {
              newStyle = new Style({
                image: new RegularShape({
                  fill,
                  stroke,
                  points: 3,
                  radius: size * 2,   // test * 2 #TODO make responsive
                  angle: 0
                })
              });
              break;
            }
            default: {
              // by default a x
             newStyle = new Style({
                image: new RegularShape({
                  fill,
                  stroke,
                  points: 4,
                  radius: 10,
                  radius2: 0,
                  angle: Math.PI / 4
                })
             });
             break;
            }
          }
          break;
        }

      }
      return newStyle;

 */
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
    /* lo que viene
    <se:Mark>
<se:WellKnownName>square</se:WellKnownName>
<se:Fill>
<se:SvgParameter name="fill">#729b6f</se:SvgParameter>
</se:Fill>
<se:Stroke>
<se:SvgParameter name="stroke">#232323</se:SvgParameter>
<se:SvgParameter name="stroke-width">0.5</se:SvgParameter>
</se:Stroke>
</se:Mark>
<se:Size>18</se:Size>
    * */
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
        // console.log('svg', onlineResource, svg);
        newStyle = new Style({
          image: new Icon({
            opacity: 1,
            crossOrigin: 'anonymous',
            src: 'data:image/svg+xml;base64,' + svg,
            scale: 0.9,
            // size: size,
            color
          }),
          fill
        });

        console.log('svgMarker in newStyle', newStyle);
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
      console.log('que sale', jsonStyle);
      console.log(jsonStyle.StyledLayerDescriptor.NamedLayer);
      console.log('lenght', jsonStyle.StyledLayerDescriptor.NamedLayer.length);
      for (let i = 0; i < jsonStyle.StyledLayerDescriptor.NamedLayer.length; i++) {
        const layerStyle = jsonStyle.StyledLayerDescriptor.NamedLayer[i];
        const layerName = layerStyle['se:Name'][0];
        for (let j = 0; j < layerStyle.UserStyle[0]['se:FeatureTypeStyle'][0]['se:Rule'].length; j++) {
          const featureStyleRule = layerStyle.UserStyle[0]['se:FeatureTypeStyle'][0]['se:Rule'][j];
          // here to ask for name and if polygonSymbolizer or point Symbolizer
          console.log('layerName,featureStyle', layerName, featureStyleRule);
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
    console.log('this.layerStyles', this.layerStyles);
  }

  createAllLayerStyles(qgsProjectFile: any, layerList: any){
    const qGsProject = '&map=' + qgsProjectFile;
    const capRequest = '&REQUEST=GetStyles';
    const wmsVersion = 'SERVICE=WMS&VERSION=' + AppConfiguration.wmsVersion;
    const urlStyle = AppConfiguration.qGsServerUrl + wmsVersion + capRequest + qGsProject + '&LAYERS=' + layerList;
    console.log('urlStyle', urlStyle);
    const xmlStyles = fetch(urlStyle)
      .then(response => response.text())
      .then(text => {
        this.createWFSlayerStyles(text);
        // self.layerPanel.updateLayerList(self.loadedWfsLayers);   // trying another approach with input
      })
      .catch(error => console.error(error));
  }




  createLayerStyles(layerName: any, xmlRendererV2: any){
    // old version using the QGS file.
    /** Retrieves a default style for a feature of the given geometry in the given layer
     * This function receives the content of the Xml project to parse it and get the symbology of each layer
     * This is to avoid asking the user to fill the qml files per layer
     * @param {xmlRendererV2} the portion of the xml related to styles - renderer-v2
     * @returns {layerName} the name of the layerNames as keys and styles (symbology) as values
     */
    // console.log(`layerName ${ layerName }`);

   /*
    const renderer = xmlRendererV2;
    const symbolType = renderer.getAttribute('type');
    // const symbols = renderer.getElementsByTagName('symbols')[0];
    if (symbolType == 'categorizedSymbol') {
      const attr = renderer.getAttribute('attr').split('.')[0];
      const categories = renderer.getElementsByTagName('categories');  // aqui tengo el id era el [1].
      // console.log('cuantos valores', categories[0].children.length);
      const tnodes = {};
      for (let i = 0; i < categories[0].children.length; i++) {
        const node = renderer.getElementsByTagName('category')[i];
        const label = node.getAttribute('label');
        const symbol = node.getAttribute('symbol');
        const value = node.getAttribute('value');
        // here, loading the different classes
        if (value.length > 0) {
          tnodes[symbol] = {
            attr: attr,
            value: value,
            label: label,
            symbol: symbol,
            style: ''
          };
        }
      }
      const symbols = renderer.getElementsByTagName('symbols')[0];  // aqui tengo el id era el [1].
      const syms = symbols.getElementsByTagName('symbol');
      for (let j = 0; j < syms.length; j++) {
        const symNode = syms[j];
        const symAlpha = symNode.getAttribute('alpha');
        const symName = symNode.getAttribute('name'); // here is the real value of the symbol
        const symType = symNode.getAttribute('type');
        if (tnodes.hasOwnProperty(symName))
        {

          const layers = symNode.getElementsByTagName('layer');
          const olStyleLst = [];
          for (let l = 0; l < layers.length; l++) {
            const symLyrCls = symNode.getElementsByTagName('layer')[l].getAttribute('class');
            const props = symNode.getElementsByTagName('layer')[l].getElementsByTagName('prop');
            const olStyle = this.mapQgsSymbol(symType, symLyrCls, symAlpha, props);  // #TODO add symbol inside filledMarker
            if (olStyle) {
              olStyleLst.push(olStyle);
              tnodes[symName].symLyrCls = symLyrCls;

            }
          }
          if (olStyleLst.length > 1){
            // switch the order of the styles   #TODO check if needed
            const olStyleLst2 = [];
            for (let s = 0; s < olStyleLst.length; s++){
              olStyleLst2.push(olStyleLst[olStyleLst.length - 1 - s]); }
             // olStyleLst = olStyleLst2;
          }
          tnodes[symName].style = olStyleLst;   // using the tnodes[symName].style is te same than tnodes[symName]["style"]
          tnodes[symName].alpha = symAlpha;
          tnodes[symName].type = symType;
        }
      }

      this.nodes [layerName] = tnodes;
    }
    else if (symbolType === 'graduatedSymbol') {
      // For future versions  graduated color, this also includes
      // SVG icons
    }
    else if (symbolType === 'singleSymbol')  {
      // For future versions  unique symbol, this also includes
      // SVG icons
      }
    // console.log('symbol', this.nodes);
    */
  }
  getLayerStyle(layerName: string){
    /** return the style for a layer
     * @param layername: string, the name of the layer
     */
    console.log('this.layerStyles', this.layerStyles);
    // 01-03 this. nodes  --> this.layerStyles
    if (this.layerStyles[layerName]){
       console.log('consigue algo?', this.nodes[layerName] );
       return this.layerStyles[layerName];
    }
  }
  getLayerStyles(){
    /** Return the styles for all the layers
     *  #TODO verify if is useful or not. apparently is not being used.
     */
    if (this.layerStyles) {    // fromr this.nodes to this.layerStyles
      return (this.layerStyles);
    }
    return null;
  }

}
