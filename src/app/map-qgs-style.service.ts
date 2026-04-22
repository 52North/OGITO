import { Subscription } from 'rxjs';
import { OpenLayersService } from './open-layers.service';
import { Injectable } from '@angular/core';
import {Fill, Stroke, Style, Icon} from 'ol/style';
import {DEVICE_PIXEL_RATIO} from 'ol/has.js';
import {Parser} from 'xml2js';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { ProjectConfiguration } from './config/project-config';
import { AppconfigService } from './config/appconfig.service';
import { CustomSketchLayerService } from './config/custom-sketch-layer-service';
import  Feature, { FeatureLike }  from 'ol/Feature';
import { CustomLayerDefinition } from './config/custom-sketch-layer-config';
import { cons } from 'fp-ts/lib/ReadonlyNonEmptyArray';


export interface StyleDefinition {
  style: Style;
  label: string;
  value: string;
  attr: string;
  symbol: string;
}

@Injectable({
  providedIn: 'root'
})
export class MapQgsStyleService {
    private svgMarkerColor = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaGVpZ2h0PSIyNHB4IgogIC' +
      'B2aWV3Qm94PSIwIDAgMjQgMjQiCiAgIHdpZHRoPSIyNHB4IgogICBmaWxsPSIjMDAwMDAwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc2IgogICBzb2RpcG9ka' +
      'Tpkb2NuYW1lPSJ3aGVyZV90b192b3RlX2JsYWNrXzI0ZHAuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEgKGM2OGUyMmMzODcsIDIwMjEtMDUtMjMpIgogICB4' +
      'bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5' +
      'zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d' +
      '3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxMCIgLz4KCiAgPHBhdGgKICAgICBkPSJNMCAwaDI0djI0SDBWMHoiCiAgICAgZmlsbD0ibm9' +
      'uZSIKICAgICBpZD0icGF0aDIiIC8+CiAgPHBhdGgKICAgICBkPSJNIDEyLDEgQyA3LjU5LDEgNCw0LjU5IDQsOSBjIDAsNS41NyA2Ljk2LDEzLjM0IDcuMjYsMTMuNjc' +
      'gTCAxMiwyMy40OSAxMi43NCwyMi42NyBDIDEzLjA0LDIyLjM0IDIwLDE0LjU3IDIwLDkgMjAsNC41OSAxNi40MSwxIDEyLDEgWiBtIDAsMTkuNDcgQyA5LjgyLDE3Ljg' +
      '2IDYsMTIuNTQgNiw5IDYsNS42OSA4LjY5LDMgMTIsMyBjIDMuMzEsMCA2LDIuNjkgNiw2IDAsMy44MyAtNC4yNSw5LjM2IC02LDExLjQ3IHoiCiAgICAgaWQ9InBhdG' +
      'g0IgogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0ic3NjY2Nzc2Nzc3NjIgogICAgIHN0eWxlPSJmaWxsOiNkZDFjNzc7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo=';

  /** Retrieves the styles for WFS layers in the Qgs project associated
   *
   */
  nodes = {};   // dictionary to store the layer styles
  layerStyles = {};
  sessionLayerLegend = {};
  canvas = document.createElement('canvas');
  context = this.canvas.getContext('2d');
  svgToOlParam = {
    fill: 'color',
    stroke: 'color',
    'stroke-width': 'width',
    'stroke-linejoin': 'lineJoin'
  };
  public readonly sketchStyleAttr = "style"
  public readonly customSketchStyleAttr = "category";
  public readonly iconHeightPxl = 38; //px

  private readonly projectSelectedSubscription : Subscription;
  private loadedProject? : ProjectConfiguration;


  constructor(  private sanitizer: DomSanitizer, private readonly openlayersService : OpenLayersService, private customSketchLayerService: CustomSketchLayerService, private config : AppconfigService) {
    this.projectSelectedSubscription = openlayersService.qgsProjectUrl$.subscribe(
        (projectConfig) => {
            this.loadedProject = projectConfig
        },
        error => console.error('error on project selection', error)
    );
  }

  findJsonStyle(feature: FeatureLike, layerName: string): any {
    /** Given a feature and the layerName it returns the corresponding style
     * it is used to get the styles for WFS layers in the Qgs project associated
     * @param { feature } the feature for which to find a rendering style
     * @param { layerName } the name of a WFS layer to be rendered
     */
   const styleLyr = this.getLayerStyle(layerName);
    if(!styleLyr){
      return this.defineSketchStyle();
    }
    else if (styleLyr.symbolType.toLowerCase() === 'single symbol'){
      return (styleLyr.style['default'].style);
    }else{ //rule base style
      const property = styleLyr.symbolType;
      const props = feature.getProperties();
      const value = props[property];

      if(!value){
        return this.defineSketchStyle();
      }


      const style = styleLyr.style[value];
      if(!style){
        throw new Error("style for property " + property + " and value " + value + " is undefined")
      }

      return (style.style);
    }
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
   let newStyle: any;
    switch (format) {
      case 'image/svg+xml': {
        let svg = onlineResource.$['xlink:href'];
        svg = svg. substring(7, svg.length);
        const newIcon = new Icon({
          opacity: 1,
          crossOrigin: 'anonymous',
          src: 'data:image/svg+xml;base64,' + svg,
          scale: 1.2, // it was 0.9 -- 06-10
          // size: size,
          color
        });
        newIcon.load();
        newStyle = new Style({
          image: newIcon,
          fill
        });
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
   const olStrokeParam = {};
    for (let i = 0; i < svgParamStroke['se:SvgParameter'].length; i++) {
      olStrokeParam[svgParamStroke['se:SvgParameter'][i].$.name] = svgParamStroke['se:SvgParameter'][i]._;
    }
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
    const parser = new Parser();
    parser.parseString(xmlTextStyle, (err, result) => {
      const jsonStyle = result;
      for (let i = 0; i < jsonStyle.StyledLayerDescriptor.NamedLayer.length; i++) {
        const layerStyle = jsonStyle.StyledLayerDescriptor.NamedLayer[i];
        const layerName = layerStyle['se:Name'][0];

        if(this.loadedProject?.hiddenLayers.includes(layerName)){
          console.log("do not parse style for hidden layer " + layerName)
          return;
        }

        for (let j = 0; j < layerStyle.UserStyle[0]['se:FeatureTypeStyle'][0]['se:Rule'].length; j++) {
          const featureStyleRule = layerStyle.UserStyle[0]['se:FeatureTypeStyle'][0]['se:Rule'][j];
          const styleType = featureStyleRule['se:Name'][0];
          if (styleType === 'Single symbol') {
            if (featureStyleRule.hasOwnProperty('se:PointSymbolizer')) {
                this.layerStyles[layerName] = {
                  symbolType: styleType,
                  style: {default: this.parsePointSymbolizer(layerName, featureStyleRule)}
                };
            }
            else if (featureStyleRule.hasOwnProperty('se:PolygonSymbolizer')) {

                this.layerStyles[layerName] = {
                  symbolType: styleType,
                  style: {default: this.parsePolygonSymbolizer(layerName, featureStyleRule)}
                };
            }else{
              throw new Error("can only parse point and polygon style definitions, unable to parse style for wfs layer " + layerName)
            }
          }
          else {
              if (featureStyleRule['ogc:Filter'].length > 0 ) {
                for(let i = 0 ; i < featureStyleRule['ogc:Filter'].length; i++){
                  const filter = featureStyleRule['ogc:Filter'][0];
                  if(filter['ogc:PropertyIsEqualTo'].length == 0){
                    throw new Error("unable to parse rule-based style for wfs layer " + layerName)
                  }
                  const property : string = filter['ogc:PropertyIsEqualTo'][0]['ogc:PropertyName'][0];
                  const literal : string = filter['ogc:PropertyIsEqualTo'][0]['ogc:Literal'][0];

                  if(!this.layerStyles[layerName]){
                    this.layerStyles[layerName] = {
                      symbolType : property,
                      style: {},
                      ruleBased: true
                    }
                  }

                  if (featureStyleRule.hasOwnProperty('se:PointSymbolizer')) {
                     const style = this.parsePointSymbolizer(layerName, featureStyleRule, property, literal);
                     this.layerStyles[layerName]['style'][literal] = style
                  }else if(featureStyleRule.hasOwnProperty('se:PolygonSymbolizer')){
                    const style = this.parsePolygonSymbolizer(layerName, featureStyleRule, property, literal);
                    this.layerStyles[layerName]['style'][literal] = style
                  }else{
                    throw new Error("can only parse point and polygon style definitions, unable to parse style for wfs layer " + layerName)
                  }

                }
              }else{
                throw new Error("unable to parse rule-based style for wfs layer " + layerName)
              }
            }
          }
        }

    });
 }


  private parsePointSymbolizer(layerName: string, featureStyleRule: any, attr : string = 'default', value: string = 'default' ){
      // it is a point
      const seGraphic = featureStyleRule['se:PointSymbolizer'][0]['se:Graphic'][0];
      if (seGraphic.hasOwnProperty('se:ExternalGraphic')) {
        // the online resource with PARAM is in the pos 1
        const format = seGraphic['se:ExternalGraphic'][1]['se:Format'][0];
        const onlineResource = seGraphic['se:ExternalGraphic'][1]['se:OnlineResource'][0];
        const mark = seGraphic['se:Mark'][0];
        const size = seGraphic['se:Size'][0];
        const theStyle = this.mapQsJsonPointSymbol(format, onlineResource, mark, size);
        let symbolLabel: string =  (value !== 'default') ? value : layerName;

        let styledef : StyleDefinition = {
            style: theStyle,      // style is a list
            label: symbolLabel,
            value: value,
            attr: attr,
            symbol: 'default'
          }
        return styledef
      }else{
        throw new Error("only parse point style with extnal graphic, unnable to parse style for layer " + layerName);
      }
  }

  private parsePolygonSymbolizer(layerName: string, featureStyleRule: any, attr : string = 'default', value: string = 'default' ){
      // it is a polygon
      const seFill = featureStyleRule['se:PolygonSymbolizer'][0]['se:Fill'][0];
      const seStroke = featureStyleRule['se:PolygonSymbolizer'][0]['se:Stroke'][0];
      const theStyle = this.mapQsJsonPolygonSymbol(seFill, seStroke);
      let styledef = {
          style: theStyle,      // style is a list
          label: 'default',
          value: value,
          attr: attr,
          symbol: 'default'
      }
      return styledef;
  }

  createAllLayerStyles(qGsServerUrl: any, qgsProjectFile: any, layerList: any){
    const qGsProject = '&map=' + qgsProjectFile;
    const capRequest = '&REQUEST=GetStyles';
    const wmsVersion = 'SERVICE=WMS&VERSION=' + this.config.getAppConfig().wmsVersion;
    const urlStyle = qGsServerUrl + wmsVersion + capRequest + qGsProject + '&LAYERS=' + layerList;
    const xmlStyles = fetch(urlStyle)
      .then(response => response.text())
      .then(text => {
        this.createWFSlayerStyles(text);
      })
      .catch(error => console.error(error));
  }

  setSketchStyle(layerName: string): Promise<any>{
    const isCustomSketchLayer = this.customSketchLayerService.isCustomSketchLayer(layerName);

    if(isCustomSketchLayer){
      const layerDefinition = this.customSketchLayerService.getConfigByLayerName(layerName)!;
      const styles = this.createStylesForCustomSketchLayer(layerDefinition);
      this.layerStyles[layerName] = {
        symbolType: this.customSketchStyleAttr,
        ruleBased: true,
        style: styles
      };
    }else{
      this.layerStyles[layerName] = {
        symbolType: this.sketchStyleAttr,
        ruleBased: true,
        style: {
          red: {
            style: this.defineSketchStyle("#FF0000"),
            label: 'red',
            value: 'red',
            attr: this.sketchStyleAttr,
            symbol: 'default'
          },
          blue: {
            style: this.defineSketchStyle("#0000FF"),
            label: 'blue',
            value: 'blue',
            attr: this.sketchStyleAttr,
            symbol: 'default'
          },
          pink: {
            style: this.defineSketchStyle("#FF00FF"),
            label: 'pink',
            value: 'pink',
            attr: this.sketchStyleAttr,
            symbol: 'default'
          },
          green: {
            style: this.defineSketchStyle("#00FF00"),
            label: 'green',
            value: 'green',
            attr: this.sketchStyleAttr,
            symbol: 'default'
          },
          yellow: {
            style: this.defineSketchStyle("#FFFF00"),
            label: 'yellow',
            value: 'yellow',
            attr: this.sketchStyleAttr,
            symbol: 'default'
          }
        }
      };
    }
    return this.layerStyles[layerName]
  }
  

  private createStylesForCustomSketchLayer(layerDefinition: CustomLayerDefinition) {
    const styles = {};
    for(let i = 0; i < layerDefinition.categories.length; i++){
      const category = layerDefinition.categories[i];
      const style: StyleDefinition = {
        style: this.defineCustomSketchStyle(category.icon),
        label: category.label,
        value: category.id,
        attr: this.customSketchStyleAttr,
        symbol: 'default'
      }
      styles[category.id] = style;
    }
    return styles;
  }


  private defineSketchStyle(colorHex: string = "#FFA500"): Style{
    const newIcon: Icon = new Icon({
      opacity: 1,
      crossOrigin: 'anonymous',
      src: 'data:image/svg+xml;base64,' + this.svgMarkerColor,
      scale: 1.2,   // it was 0.9
      color: colorHex
    });

    const fillColorHex = colorHex + '40'; //opacity 0.25
    const fill = new Fill({color: fillColorHex});
    const stroke = new Stroke({color: colorHex, width: 5 });
    const style : Style =
      new Style({
        stroke,
        fill,
        image: newIcon,
      });

    this.addIconScaler(newIcon);
    newIcon.load();


    return style;
  }


  private defineCustomSketchStyle(iconURL: string): Style {
    const newIcon: Icon = new Icon({
      opacity: 1,
      crossOrigin: 'anonymous',
      src: iconURL,
    });

    const style: Style =
      new Style({
        image: newIcon,
    });


    this.addIconScaler(newIcon);
    newIcon.load();

    return style;
  }

  private addIconScaler(icon: Icon) {
    const pixelRatio = window.devicePixelRatio || 1;
    const imgElement = icon.getImage(pixelRatio);
    if(imgElement && imgElement instanceof HTMLImageElement){
      const handleLoad = () => {
      const originalWidth = imgElement.naturalWidth;

      if (originalWidth > 0) {
        console.log(`Original width of the icon: ${originalWidth}px`);
        // Set the scale to force desired height while maintaining aspect ratio
        icon.setScale(this.iconHeightPxl / originalWidth);
      }
    };

    imgElement.onload = () => handleLoad();
    }
  }



  getLayerStyle(layerName: string){
    /** return the style for a layer
     * @param layername: string, the name of the layer
     */
    if (this.layerStyles[layerName]){
       return this.layerStyles[layerName];
    }
    else {
      return(this.defineSketchStyle());
    }
  }

  sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
  }

}


interface LegendEntry {
  iconSrc: string;
  title: string;  
}