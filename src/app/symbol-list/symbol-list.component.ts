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
import {Style, Stroke, Text} from 'ol/style';

@Component({
  selector: 'app-symbol-list',
  templateUrl: './symbol-list.component.html',
  styleUrls: ['./symbol-list.component.scss']
})
export class SymbolListComponent implements OnInit, AfterViewInit {
  @ViewChild('symbolList', {static: false}) symbolList: ElementRef <HTMLCanvasElement>;   // to access the properties of canvas
  //@ViewChildren('canvas') myCanvas: ElementRef<HTMLCanvasElement>;   // to access the properties of canvas
  @ViewChildren('cmp') myCanvas: QueryList<ElementRef<HTMLCanvasElement>>; // it works
  variable = '';
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
      this.displaySymbolList$ = observableOf(data);
    },
      error => {console.log ('Error in subscription to showSymbolPanel', error);}
  );
  this.subscriptionToLayerEditing = this.openLayersService.layerEditing$.subscribe(
    data => {
      this.styles = this.mapQgsStyleService.getLayerStyle(data.layerName);
      // console.log('styles in symbolList.. pasito a pasito', this.styles);
      this.symbols$ = this.getSymbolList (this.styles);
      this.symbolsLength = Object.keys(this.symbols$).length;
      this.geometryTypeSymbols = data.layerGeom;
    },
      error => console.log('Error in subscription to Layer Editing in SymbolList', error)
  );
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
   this.myCanvas.changes.subscribe((r) => {
      console.log('r', r);
      this.createSymbolsinCanvas();
    });
  }

  getSymbolList(styles: any) {
    /** Creates a dictionary with the styles per class when needed
     * @param styles: the array with the classes and styles
     */
    console.log('que hay en styles', styles);
    let symbolDict = {};
    for (const key of Object.keys(styles)){
      // console.log(`${key} -> ${styles[key].value}`);
      symbolDict[styles[key].value] = styles[key].style;
    }
    console.log('estilos en dict format', symbolDict);
    return symbolDict;
  }

  closeListSymbols(){
    this.displaySymbolList$ = observableOf(false);
  }
 createSymbolsinCanvas(){
    // to test layerGeom: string, styles: any
   /** Edita los canvas creados for each symbol by adding a feature with the styles on it
    * @param styles: array;
    * @param layerGeom: geometry of the layer as specified in the QGIS project ;
    */
   // let canvas = this.myCanvas.toArray()[i].nativeElement;
   let feature: any;
   const allCanvas = this.myCanvas.toArray();
   for (let i = 0 ; i < allCanvas.length ; i++) {
     const canvas = allCanvas[i];
     if (canvas.nativeElement.getContext('2d')) {
       let key = canvas.nativeElement.id;
       console.log('get the key?', key);
       const width = canvas.nativeElement.width * devicePixelRatio;
       const height = canvas.nativeElement.height * devicePixelRatio;
       canvas.nativeElement.width = width;
       canvas.nativeElement.height = height;
      // console.log('width and height', height, width, canvas.nativeElement.width , devicePixelRatio  );
       const render = toContext(canvas.nativeElement.getContext('2d'));
       const stylelayer = this.symbols$[key];
       switch (this.geometryTypeSymbols) {
         case 'Point': {
          /* let text = stylelayer[0].getText();
           console.log(`is a style? ${typeof (stylelayer[0])}  texto ${stylelayer[0]}`);
           let scaleText = stylelayer[0].getText().getScale() * 15;
           let fillText = stylelayer[0].getText().getFill();
           let fontText = stylelayer[0].getText().getFont();
           console.log(text, scaleText, fillText, fontText);*/
           feature = new Feature(new Point([width / 4, height / 2]));
           break;
         }
         case 'Line': {
           // calculate the start and end point and draw as styles are defined in the array
           render.lineWidth = 5;
           //feature = new Feature(new LineString([[0, 10], [width - (width / 10 * 2), 10]]));
           let stroke = stylelayer[0].getStroke();
           let stylelayerTemp = new Style({
             stroke: new Stroke({
               color: '#3399CC',
               width: 20
             })
           });
           let W = Number(stroke.getWidth()) * 20;
           console.log( 'color and width', stroke.getColor(), W);
           let testStyle = new Style({
             stroke: new Stroke({
               color: stroke.getColor(),
               width: W
             })
           });
           //console.log( 'temp and test Styles', testStyle);
           feature = new Feature(new LineString([[10, height / 2], [ width - (width / 4), height / 2]]));
           //render.drawFeature(feature, stylelayerTemp);
           //feature = new Feature(new LineString([[10, height / 3], [width / 2, height / 3]]));
           render.drawFeature(feature, testStyle);
           break;
         }
         case 'Polygon': {
           // en landuse 9 es muy interesante, pattern
           render.lineWidth = 5;
           const wide = width - (width / 4);
           const high = height - (height / 4);
           feature = new Feature(new Polygon([[[0, 0], [0, high], [wide, high], [wide, 0], [0, 0]]]));
           break;
         }
       }
       // console.log('stylelayer', stylelayer);
       for (const style of stylelayer) {
         render.drawFeature(feature, style);
       }

       /* render = toContext(context, {size: [this.symbolList.nativeElement.width, this.symbolList.nativeElement.height]});
       feature = new Feature(new Point([10, 10]));
       stylelayer = this.symbols$['Gereja'][0];
       render.drawFeature(feature, stylelayer); */
     }
    }
 }

  createSymbolPanel(layerGeom: string, styles: any){
    /** Creates a table with the styles given in an array
     * @param styles: array;
     * @param layerGeom: geometry of the layer as specified in the QGIS project ;
     *  que comience la fiesta
     */
    console.log('que comience la fiesta en Canvas', layerGeom, styles);

    let feature: any;
    const context = this.symbolList.nativeElement.getContext('2d');
    const render = toContext(context, { size: [this.symbolList.nativeElement.width, this.symbolList.nativeElement.height] });
    switch (layerGeom) {
      case 'Point':
       {
         feature = new Feature(new Point([10, 10]));
         break;
      }
      case 'Line': {
       // calculate the start and end point and draw as styles are defined in the array
        feature = new Feature(new LineString([[10, 10], [80, 10]]));
        break;

      }
      case 'Polygon': {
        // en landuse 9 es muy interesante, pattern
        feature = new Feature(new Polygon([[[0, 0], [100, 100], [100, 0], [0, 0]]]));
        break;
        }
    }
    for (const style of styles ){
     for (const stylelayer of styles.style){
       render.drawFeature(feature, stylelayer);   // styles[i].style[0],  styles[i].style[1].. and so on
     }
    }
  }

}
