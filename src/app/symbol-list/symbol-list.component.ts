import {AfterViewInit, Component, Directive, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { Observable, Subscription,  of as observableOf } from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {MapQgsStyleService} from '../map-qgs-style.service';
import { DEVICE_PIXEL_RATIO } from 'ol/has.js';
import {toContext} from 'ol/render';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import {AppConfiguration} from '../app-configuration';
import {Fill, Stroke, Style, Icon, Circle, RegularShape} from 'ol/style';
import {style} from '@angular/animations';
import {extend} from 'ol/extent';
@Component({
  selector: 'app-symbol-list',
  templateUrl: './symbol-list.component.html',
  styleUrls: ['./symbol-list.component.scss']
})
export class SymbolListComponent implements OnInit, AfterViewInit {
  @ViewChild('symbolList', {static: false}) symbolList: ElementRef <HTMLCanvasElement>;   // to access the properties of canvas
  // @ViewChildren('canvas') myCanvas: ElementRef<HTMLCanvasElement>;   // to access the properties of canvas
  @ViewChildren('cmp') myCanvas: QueryList<ElementRef<HTMLCanvasElement>>; // it works
  variable = '';
  symbolActiveKey: any = null;
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  symbols$ = {};
  symbolsLength = 0;
  geometryTypeSymbols: string;
  displaySymbolList$: Observable<boolean>;
  subscriptionToShowSymbols: Subscription;
  editLayerName$: Observable<string>;
  subscriptionToLayerEditing: Subscription;
  styles: any;   // parece un dict
  constructor(private openLayersService: OpenLayersService, private mapQgsStyleService: MapQgsStyleService) {
  this.subscriptionToShowSymbols = this.openLayersService.showSymbolPanel$.subscribe(
    data => {
      // this.displaySymbolList$ = observableOf(data);
      // console.log('in show symbols, first time? this.symbols$',  this.symbols$);
      this.showSymbolList(data);
    },
      error => {console.log ('Error in subscription to showSymbolPanel', error); }
  );
  this.subscriptionToLayerEditing = this.openLayersService.layerEditing$.subscribe(
    data => {
      // console.log('que viene de ol service data:', data);
      this.styles = this.mapQgsStyleService.getLayerStyle(data.layerName);
      this.symbols$ = this.getJsonSymbolList(this.styles);
      this.symbolsLength = Object.keys(this.symbols$).length;
      this.geometryTypeSymbols = data.layerGeom;
      this.unsetActiveSymbol();
    },
      error => console.log('Error in subscription to Layer Editing in SymbolList', error)
  );
  }

  showSymbolList(visible: any){
    if (visible === false){
      this.openLayersService.updateCurrentSymbol(null);
    }
    this.displaySymbolList$ = observableOf(visible);
  }



  onPanStart(event: any): void {
    /** Sets the current coordinates of the layerPanel to use later when setting a new position
     * triggered when a pan event starts in the layerpanel card
     * @param event, type event
     */
    this.startX = this.x;
    this.startY = this.y;
  }
  onPan(event: any): void {
    /** Sets the new location of the layerPanel after a pan event was triggered in the layerPanel card
     * @param event, type event
     */
    event.preventDefault();
    this.x = this.startX + event.deltaX;
    this.y = this.startY + event.deltaY;
  }

  ngOnInit(): void {
    this.displaySymbolList$ = observableOf(true);  // #Only for development purposes, #TODO put in fs
  }

  ngAfterViewInit(){
   this.myCanvas.changes.subscribe(() => {
      this.createJsonSymbolsinCanvas();
    });
  }

  getSymbolList(styles: any) {
    /** Creates a dictionary with the styles per class when needed
     * @param styles: the array with the classes and styles
     */
    const symbolDict = {};
    for (const key of Object.keys(styles)){
      // console.log(`${key} -> ${styles[key].value}`);
      symbolDict[styles[key].value] = {style: styles[key].style, label: styles[key].label};             // styles[key].style;
    }
    // console.log('estilos en dict format', symbolDict);
    return symbolDict;
  }

  getJsonSymbolList(layerStyle: any) {
    /** Creates a dictionary with the styles per class when needed
     * @param styles: the array with the classes and styles
     */

    const symbolDict = {};
    const styles = layerStyle.style;
    for (const key of Object.keys(styles)){
      // console.log(`${key} -> ${styles[key].value}`);
      symbolDict[styles[key].value] = {style: styles[key].style, label: styles[key].label};             // styles[key].style;
    }
    return symbolDict;
  }


  createJsonSymbolsinCanvas(){
    // to test layerGeom: string, styles: any
    /** Edita los canvas creados for each symbol by adding a feature with the styles on it
     * @param styles: array;
     * @param layerGeom: geometry of the layer as specified in the QGIS project ;
     */
    // let canvas = this.myCanvas.toArray()[i].nativeElement;
    // this version consider only one level of symbols.

    try {
      let feature: any;
      const allCanvas = this.myCanvas.toArray();
      for (let i = 0; i < allCanvas.length; i++) {
        const factor = 10; // factor to use in scaling symbol in the canvas
        const canvas = allCanvas[i];
        if (canvas.nativeElement.getContext('2d')) {
          const key = canvas.nativeElement.id;
          const width = canvas.nativeElement.width * devicePixelRatio;
          const height = canvas.nativeElement.height * devicePixelRatio;
          canvas.nativeElement.width = width;
          canvas.nativeElement.height = height;
          // console.log('width and height', height, width, canvas.nativeElement.width , devicePixelRatio  );
          const render = toContext(canvas.nativeElement.getContext('2d'));
          // console.log(' que llega a this.symbols$', this.symbols$);
          const stylelayer = this.symbols$[key];
          const stylelayerClone = [];   // clone the style hopefully deep copy
          const olStyle = stylelayer.style;
          let cloneStyle: any;
          cloneStyle = olStyle.clone();
          switch (this.geometryTypeSymbols) {
            case 'Point': {
              const cx = width / 2;
              const cy = height / 2;
              feature = new Feature(new Point([cx, cy]));
              let imageClone: any;
              // cloneStyle = style.clone();
              imageClone = olStyle.clone().getImage();
              imageClone.setScale(imageClone.getScale() * 5);  // #TODO check this
              // this is working
              cloneStyle = new Style({
                image: imageClone,
                fill: olStyle.getFill()
              });
              break;
            }
            case 'Line': {
              // calculate the start and end point and draw as styles are defined in the array
              let heigthStroke = height / 2;
             // let cloneStyle: any;
              let strokeClone: any;
              // cloneStyle = olStyle.clone();
              strokeClone = cloneStyle.getStroke();
              strokeClone.setWidth(strokeClone.getWidth() * factor);   // 10 to mkae the line visible.
              heigthStroke = (height - strokeClone.getWidth()) / 2;
              cloneStyle.setStroke(strokeClone);
              feature = new Feature(new LineString([[10, heigthStroke], [width - (width / 4), heigthStroke]]));
              // console.log('height, width and feature', heigthStroke, strokeClone.getWidth(), feature.getProperties());
              // render.drawFeature(feature, testStyle);
              break;
            }
            case 'Polygon':
            case 'MultiPolygon':
            case 'MultiPolygonZ': {
              render.lineWidth = 5;
              const wide = width - (width / 4);
              const high = height - (height / 4);
              feature = new Feature(new Polygon([[[0, 0], [0, high], [wide, high], [wide, 0], [0, 0]]]));
              break;
            }
          }
          render.drawFeature(feature, cloneStyle);
          console.log('cloneStyle what is missing', cloneStyle);
        }
      }
    }
catch (e) {
      console.log('Error creating symbol panel', e);
    }
  }

  unsetActiveSymbol() {
    /**
     * unsets any symbol from the symbol list
     */
    // console.log('this.symbolActiveKey in unsetActiveSymbol', this.symbolActiveKey);
    this.symbolActiveKey = null;
  }

  updateActivesymbol(symbol: any) {
    /**
     * update the activeSymbol
     * @param symbol: array of styles
     * @key: the key o the div
     *
     */
    // console.log('y ahora que sigue..activeKey, key, value.', this.symbolActiveKey, symbol.key, symbol );
    this.symbolActiveKey = symbol.key;
    const curDiv = document.getElementById('+' + symbol.key );
    // commented 13-04 curDiv.className += ' active';
    curDiv.className = ' active';
    this.openLayersService.updateCurrentSymbol(symbol);
  }


}
