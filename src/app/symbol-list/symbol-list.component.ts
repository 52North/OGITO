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
      console.log('styles in symbolList.. pasito a pasito', this.styles);
      this.symbols$ = this.getSymbolList (this.styles);
      this.symbolsLength = Object.keys(this.symbols$).length;
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
   console.log('mycanvas in createSymbolsinCanvas', this.myCanvas.toArray());
   const allCanvas = this.myCanvas.toArray();
   this.myCanvas.forEach(canvas => {
     console.log('en el foreach', canvas);
     if (canvas.nativeElement.getContext('2d')) {
       console.log (canvas.nativeElement.getContext('2d'));
     }
   } );

   for (let i = 0 ; i < allCanvas.length ; i++) {
     let canvas = allCanvas[i];
      console.log("tipo", typeof(canvas) );
     let context: CanvasRenderingContext2D;
     //context = canvas.getContext('2d');
     const render = toContext(context, { size: [this.symbolList.nativeElement.width, this.symbolList.nativeElement.height] });
     const feature = new Feature(new Point([10, 10]));
     const stylelayer = this.symbols$['Gereja'][0];
     render.drawFeature(feature, stylelayer);
   }
   setTimeout(() => {
    // this.variable = this.myCanvas.map(p => p.id).join(', ');
   }, 0);


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
