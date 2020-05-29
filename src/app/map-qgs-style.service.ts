import { Injectable } from '@angular/core';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import Icon from 'ol/style/Icon';
import Text from 'ol/style/Text';
import CircleStyle from 'ol/style/Circle';
import {DEVICE_PIXEL_RATIO} from 'ol/has.js';


@Injectable({
  providedIn: 'root'
})
export class MapQgsStyleService {
  /** Retrieves the styles for WFS layers in the Qgs project associated
   *
   */
  svgFolder = '../../assets/svg/';
  nodes = {};
  canvas = document.createElement('canvas');
  context = this.canvas.getContext('2d');
  constructor() { }

  findStyle(feature:any,layerName: any) {
    /** Given a feature and the layerName it returns the corresponding style
     * it is used to get the styles for WFS layers in the Qgs project associated
     * @param { feature } the feature for which to find a rendering style  -- no needed apparently
     * @param { layerName } the name of a WFS layer to be rendered
     */
    //console.log("layername in finding style", layerName) ;
    const featType = feature.getGeometry().getType();
    // here include a default value and styling for # resolution or just somethig reasonable
    const styleLyr = this.nodes[layerName];
    if (Object.keys(styleLyr).length > 0){
      const attr = styleLyr[Object.keys(styleLyr)[0]]["attr"]; // Which is the attribute used in the simbology
      const featValue = feature.get(attr);
      for (let key of Object.getOwnPropertyNames(styleLyr))
      {
        if (styleLyr[key]['value'] == featValue){
         // console.log ("encontrado",styleLyr[key]['style']);
          return (styleLyr[key]['style']);    // and array of style is ok too
        }
        //There is not style defined , we returned a providisional one.
       //let defaultStyle = this.findDefaultStyleProvisional(feature.getGeometry().getType(),layername);
      }
    }
  }

    findDefaultStyleProvisional(geometry:any, layerName:any){
    /** Retrieves a default style for a feature of the given geometry in the given layer
     * @param {geometry} geomtry type
     * @param {layerName} name of the layer
     * @returns {Style} default style to render the feature
     */
  }

  createLinePattern (fillColor:any, angle:number, spacing:number, line_width: number) {
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
        this.context.lineTo(this.canvas.width,0);
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

  getRGBAcolor(color: any){
    /** takes a color and retunr in a rgba format used in OL
     * @param color: string color as given in the qgs project file
     * by default it put 1 as the transparency.
     * return a string with the color in the rgba format
     */
    let rgbaColor = color .split(',');
    rgbaColor = 'rgba('.concat(rgbaColor[0], ', ', rgbaColor[1], ', ', rgbaColor[2], ', 1)');
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

      let newStyle: any;
      let symStroke: any;
      let symFill: any;
      let symText: any;
      let symStyle = {};
      for (let l = 0; l < props.length; l++) {
        let propNode = props[l];
        let clave = propNode.getAttribute('k');
        let valor = propNode.getAttribute('v');
        // console.log("que viene en symLyrCls", symLyrCls);
        symStyle[clave] = valor;
      }
      switch (symLyrCls) {
        case "SimpleFill": {
          symStroke = new Stroke({
            lineJoin: symStyle["joinstyle"],
            width: +symStyle["outline_width"],
          });
          let color = symStyle["color"].split(",");
          color = 'rgba('.concat(color[0], ', ', color[1], ', ', color[2], ', 0.7)');
          let outColor = symStyle["outline_color"].split(",");
          outColor = 'rgba('.concat(outColor[0], ', ', outColor[1], ', ', outColor[2], ', 1)');   // made poly a bit transparent
          symStroke.setColor(outColor);
          let fillStyle = symStyle["style"];
          switch (fillStyle)
          {
            case "no":{
              newStyle = new Style({
                stroke: symStroke,
                //fill: symFill
              });
              break;
            }
            default:{
              // by default fills the style
              symFill = new Fill({
                color: color
              });
              newStyle = new Style({
                stroke: symStroke,
                fill: symFill
              });
            }
          }
          break;
        }
        case "LinePatternFill": {
          symStroke = new Stroke({
            lineJoin: symStyle["joinstyle"],
            width: +symStyle["line_width"],
          });
          let color = symStyle["color"].split(",");
          color = 'rgba('.concat(color[0], ', ', color[1], ', ', color[2], ', 0.7)');
          symFill = new Fill();
          let pattern = this.createLinePattern(color,+symStyle["angle"] , symStyle["distance"], +symStyle["line_width"]); //
          symFill.setColor(pattern);
          symStroke.setColor("black");
          newStyle = new Style({
            stroke: symStroke,
            fill: symFill
          });
          break;
        }
        case "SimpleLine": {
          let capStyle = symStyle["capstyle"];
          if (symStyle["capstyle"] =='flat'){
            capStyle ='butt'
          }
          let lineDash = "";
          if (symStyle["use_custom_dash"] == "1"){
            lineDash = symStyle["customdash"].split(";").map(Number);
          }
          let color = symStyle["line_color"].split(",");
          color = 'rgba('.concat(color[0], ', ', color[1], ', ', color[2], ', 1)');
          symStroke = new Stroke({
            color: color,
            lineCap: capStyle,    // symStyle["capstyle"],
            lineJoin: symStyle["joinstyle"],
            lineDash: lineDash,
            lineDashOffset: symStyle["offset"],
            //miterLimit: symStyle["joinstyle"],
            width: +symStyle["line_width"]
          });
          newStyle = new Style({
            stroke: symStroke
          });
          break;
        }
        case "SimpleMarker":{
          // console.log("THIS is NEEXXXXT");
          let offset = symStyle["offset"].split(",");
          let color = symStyle["color"].split(",");
          color = 'rgba('.concat(color[0], ', ', color[1], ', ', color[2], ', 1)');
          let outColor = symStyle["outline_color"].split(",");
          outColor = 'rgba('.concat(color[0], ', ', color[1], ', ', color[2], ', 1)');
          let symFill = new Fill({
            color: color
          });
          symStroke = new Stroke({
            color: outColor,
            //lineCap: capStyle,    // symStyle["capstyle"],
            lineJoin: symStyle["joinstyle"],
            // lineDash: lineDash,
            lineDashOffset: symStyle["offset"],
            //miterLimit: symStyle["joinstyle"],
            width: +symStyle["line_width"]
          });
          newStyle = new Style({
            image: new CircleStyle({
              radius: +symStyle["size"],
              fill: symFill
            }),
            stroke:symStroke,
          });
          break;
        }
        case 'SvgMarker':
        {
        console.log('entra svgMarker?');
        const color = this.getRGBAcolor(symStyle['color']);   // this is symStyle["color"]
        let outColor = this.getRGBAcolor(symStyle['outline_color']);
        const filename = this.svgFolder.concat(symStyle['name']);
        const size = symStyle['size'] * 20;
        console.log('color size ', color,size);
        let  outlineWidth = +symStyle["outline_width"];
        let verticalAnchorPoint = symStyle['vertical_anchor_point'];
        /* <prop k="angle" v="0"/>
         <prop k="fixedAspectRatio" v="0"/>
         <prop k="horizontal_anchor_point" v="1"/>
         <prop k="offset" v="0,0"/>
         <prop k="offset_map_unit_scale" v="3x:0,0,0,0,0,0"/>
         <prop k="offset_unit" v="MM"/>
         <prop k="outline_width_map_unit_scale" v="3x:0,0,0,0,0,0"/>
         <prop k="outline_width_unit" v="MM"/>
         <prop k="scale_method" v="diameter"/>
         <prop k="size_map_unit_scale" v="3x:0,0,0,0,0,0"/>
         <prop k="size_unit" v="MM"/>
         <prop k="vertical_anchor_point" v="1"/> */
         newStyle = new Style({
           image: new Icon({
             color: color,
             crossOrigin: 'anonymous',
             //imgSize: [50, 50],   // it was 20 #TODO responsive to zoom scale
             scale: 0.03, //#TODO verificar size qgis/ol vamos bien
             src: filename
           })
         });
          break;
        }
        case "FontMarker":
          {
          let offset = symStyle["offset"].split(",");
          let color = symStyle["color"].split(",");
          color = 'rgba('.concat(color[0], ', ', color[1], ', ', color[2], ', 1)');
          let outColor = symStyle["outline_color"].split(",");
          outColor = 'rgba('.concat(color[0], ', ', color[1], ', ', color[2], ', 1)');
          symStroke = new Stroke({
            color: color,
            lineJoin: symStyle["joinstyle"],
            lineDashOffset: symStyle["offset"],
            width: +symStyle["line_width"]
          });
          let textBaseline ='top';
          let offsetY =offset[1];
          if (symStyle["chr"] =="o" &&symStyle["font"] =="Geosiana Desa"){
            offsetY = 2*19;
            textBaseline = "bottom";
            symStyle["chr"] = '\n'.concat(symStyle["chr"]);
          }
          symText  = new Text({
            font:   "normal ".concat(symStyle["size"], "px ", symStyle["font"]) ,    //symStyle["size"]
            //  maxAngle: ,
            offsetX: offset[0],
            offsetY: offsetY, //offset[1],
            textBaseline: textBaseline ,  // 'top' ,
            //  overflow: ,
            //placement: ,   // lets keep the dafault that is point
            scale: 2, //symStyle["size"] ,
            //  rotateWithView: ,
            //  rotation: symStyle["angle"],
            text: symStyle["chr"],
            fill: new Fill({
              color:  color,
            }),
            //  textAlign: ,
            //   fill: ,
            //   stroke: ,
            //   backgroundFill: ,
            //   backgroundStroke: ,
            //   padding: ,
          });
          newStyle = new Style({
            text: symText,
            // stroke:symStroke
          });
          break;
        }

      }
      return newStyle;
  }

  createLayerStyles(layerName: string, xmlRendererV2: any){
    /** Retrieves a default style for a feature of the given geometry in the given layer
     * This function receives the content of the Xml project to parse it and get the symbology of each layer
     * This is to avoid asking the user to fill the qml files per layer
     * @param {xmlRendererV2} the portion of the xml related to styles - renderer-v2
     * @returns {layerStyles} a dictionary containing layerNames as keys and styles (symbology) as values
     */
    // console.log(`layerName ${ layerName }`);
    let renderer = xmlRendererV2;
    const symbolType = renderer.getAttribute("type");
    // const symbols = renderer.getElementsByTagName('symbols')[0];
    if (symbolType == "categorizedSymbol") {
      const attr = renderer.getAttribute('attr').split(".")[0];
      let categories = renderer.getElementsByTagName("categories");  // aqui tengo el id era el [1].
      console.log('cuantos valores', categories[0].children.length);
      let tnodes = {};
      for (let i = 0; i < categories[0].children.length; i++) {
        let node = renderer.getElementsByTagName("category")[i];
        let label = node.getAttribute("label");
        let symbol = node.getAttribute("symbol");
        let value = node.getAttribute("value");
        // here, loading the different classes
        if (value.length > 0) {
          tnodes[symbol] = {
            "attr": attr,
            "value": value,
            "label": label,
            "symbol": symbol,
            "style": ""
          };
        }
      }
      let symbols = renderer.getElementsByTagName("symbols")[0];  // aqui tengo el id era el [1].
      let syms = symbols.getElementsByTagName("symbol");
      for (let j = 0; j < syms.length; j++) {
        let symNode = syms[j];
        let symAlpha = symNode.getAttribute("alpha");
        let symName = symNode.getAttribute("name"); // here is the real value of the symbol
        let symType = symNode.getAttribute("type");
        if (tnodes.hasOwnProperty(symName))
        {

          let layers = symNode.getElementsByTagName("layer");
          let olStyleLst = [];
          for (let l = 0; l < layers.length; l++) {
            let symLyrCls = symNode.getElementsByTagName("layer")[l].getAttribute("class");
            let props = symNode.getElementsByTagName("layer")[l].getElementsByTagName("prop");
            let olStyle = this.mapQgsSymbol(symType, symLyrCls, symAlpha, props);
            if (olStyle) {
              olStyleLst.push(olStyle);
              tnodes[symName]["symLyrCls"] = symLyrCls;

            }
          }
          if (olStyleLst.length > 1){
            // switch the order of the styles   #TODO check if needed
            let olStyleLst2 = [];
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
    else if (symbolType == "graduatedSymbol") {
      // For future versions  graduated color, this also includes
      // SVG icons
    }
    else if (symbolType == "singleSymbol")  {
      // For future versions  unique symbol, this also includes
      // SVG icons
      }

  }
  getLayerStyle(layerName: string){
    /** return the style for a layer
     * @param layername: string, the name of the layer
     */
    if (this.nodes[layerName]){
      //console.log("consigue algo?",this.nodes[layerName] );
      return this.nodes[layerName];
    }
  }
  getLayerStyles(){
    /** Return the styles for all the layers
     *  #TODO verify if is useful or not. apparently is not being used.
     */
    if (this.nodes){
      return (this.nodes);
    }
    return null;
  }

}
