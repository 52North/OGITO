import { SelectedSymbol, SymbolListVisibility } from './../open-layers.service';
import {AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { Observable, Subscription,  of as observableOf } from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {MapQgsStyleService} from '../map-qgs-style.service';
import {toContext} from 'ol/render';
import Feature from 'ol/Feature';
import Polygon from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import LineString from 'ol/geom/LineString';
import { Style} from 'ol/style';

@Component({
  selector: 'app-symbol-list',
  templateUrl: './symbol-list.component.html',
  styleUrls: ['./symbol-list.component.scss']
})
export class SymbolListComponent implements OnInit, AfterViewInit {
  @ViewChild('symbolList', {static: false}) symbolList: ElementRef <HTMLCanvasElement>;   // to access the properties of canvas
  @ViewChild('symbol', {static: false}) symboldivs: ElementRef <HTMLCanvasElement>;  // to access the properties of canvas
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
  attribute: string
  private header: string = "Symbols"


  constructor(private openLayersService: OpenLayersService, private mapQgsStyleService: MapQgsStyleService) {
  this.subscriptionToShowSymbols = this.openLayersService.showSymbolPanel$.subscribe(
    data => {
      if(!data.optHeader){
        this.header = null;
      }else{
        this.header = data.optHeader;
      }
      this.showSymbolList(data);

    },
      error => {console.log ('Error in subscription to showSymbolPanel', error); }
  );
  this.subscriptionToLayerEditing = this.openLayersService.layerEditing$.subscribe(
    data => {
      this.styles = this.mapQgsStyleService.getLayerStyle(data.layerName);
      this.symbols$ = this.getJsonSymbolList(this.styles);
      this.symbolsLength = Object.keys(this.symbols$).length;
      this.geometryTypeSymbols = data.layerGeom;
      this.unsetActiveSymbol();
    },
      error => console.log('Error in subscription to Layer Editing in SymbolList', error)
  );
  }

  showSymbolList(visibility: SymbolListVisibility, isCanceled : boolean = false){
    if (visibility.visible === false){
      // unsets the ng-class for the symbol list
      this.symbolActiveKey = null;
      // updates the selected symbol
      this.openLayersService.updateCurrentSymbol(null);
      this.openLayersService.raiseSymbolPanelClosed(isCanceled)
    }
    this.displaySymbolList$ = observableOf(visibility.visible);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(){
   this.myCanvas.changes.subscribe(() => {
      this.createJsonSymbolsinCanvas();
    });
  }

  setHeader(header: string){
    this.header = header;
  }

  getHeader() : string{
    return this.header;
  }

  getSymbolList(styles: any) {
    /** Creates a dictionary with the styles per class when needed
     * @param styles: the array with the classes and styles
     */
    const symbolDict = {};
    for (const key of Object.keys(styles)){
      symbolDict[styles[key].value] = {style: styles[key].style, label: styles[key].label};             // styles[key].style;
    }
   return symbolDict;
  }

  getJsonSymbolList(layerStyle: any) {
    /** Creates a dictionary with the styles per class when needed
     * @param styles: the array with the classes and styles
     */
    const symbolDict = {};
    const styles = layerStyle.style;
    for (const key of Object.keys(styles)){
      symbolDict[styles[key].value] = {style: styles[key].style, label: styles[key].label};             // styles[key].style;
    }
    return symbolDict;
  }
  createJsonSymbolsinCanvas(){
    /** Edita los canvas creados for each symbol by adding a feature with the styles on it
     * @param styles: array;
     * @param layerGeom: geometry of the layer as specified in the QGIS project ;
     */
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
          const render = toContext(canvas.nativeElement.getContext('2d'));
          const stylelayer = this.symbols$[key];
          const stylelayerClone = [];   // clone the style hopefully deep copy
          const olStyle = stylelayer.style;
          let cloneStyle: any;
          cloneStyle = olStyle.clone();
          switch (this.geometryTypeSymbols) {
            case 'Multi': {
              const cx = width / 2;
              const cy = height / 2;
              feature = new Feature(new Point([cx, cy]));
              let imageClone: any;
              imageClone = olStyle.clone().getImage();
              imageClone.setScale(imageClone.getScale() * 5);  // #TODO check this
              cloneStyle = new Style({
                image: imageClone,
                fill: olStyle.getFill()
              });
              //render.drawFeature(feature, cloneStyle);
              /* to discuss draw a line
              // clone the style again
              cloneStyle = olStyle.clone();
              let heigthStroke = height / 2;
              let strokeClone: any;
              strokeClone = cloneStyle.getStroke();
              strokeClone.setWidth(strokeClone.getWidth() * factor);   // 10 to mkae the line visible.
              heigthStroke = (height - strokeClone.getWidth()) / 2;
              cloneStyle.setStroke(strokeClone);
              feature = new Feature(new LineString([[10, heigthStroke], [width - (width / 4), heigthStroke]]));
              render.drawFeature(feature, cloneStyle);
              // draw a polygon
              render.lineWidth = 5;
              const wide = width - (width / 4);
              const high = height - (height / 4);
              feature = new Feature(new Polygon([[[0, 0], [0, high], [wide, high], [wide, 0], [0, 0]]]));
              render.drawFeature(feature, cloneStyle); */
              break;
            }
            case 'Point': {
              const cx = width / 2;
              const cy = height / 2;
              feature = new Feature(new Point([cx, cy]));
              let imageClone: any;
              // cloneStyle = style.clone();
              imageClone = olStyle.clone().getImage();
              imageClone.setScale(imageClone.getScale() * 5);  // #TODO check this
              cloneStyle = new Style({
                image: imageClone,
                fill: olStyle.getFill()
              });
              break;
            }
            case 'Line': {
              // calculate the start and end point and draw as styles are defined in the array
              let heigthStroke = height / 2;
              let strokeClone: any;
              strokeClone = cloneStyle.getStroke();
              strokeClone.setWidth(strokeClone.getWidth() * factor);   // 10 to mkae the line visible.
              heigthStroke = (height - strokeClone.getWidth()) / 2;
              cloneStyle.setStroke(strokeClone);
              feature = new Feature(new LineString([[10, heigthStroke], [width - (width / 4), heigthStroke]]));
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
          let props = {};
          props[this.styles.symbolType] = key;
          feature.setProperties(props)

          render.drawFeature(feature, cloneStyle);
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
    this.symbolActiveKey = null;
  }

  updateActivesymbol(symbol: any) {
    /**
     * update the activeSymbol
     * @param symbol: array of styles
     * @key: the key o the div
     *
     */
    this.symbolActiveKey = symbol.key;
    const curDiv = document.getElementById('+' + symbol.key );
    curDiv.className = ' active';
    const selectedValue = {property: this.styles.style[symbol.key]['attr'], value: this.styles.style[symbol.key]['value']};
    //add corresponding value for rule-based style
    const selectedSymbol : SelectedSymbol = (this.styles.ruleBased) ? {symbol: symbol, selectedValue: selectedValue} : {symbol: symbol, selectedValue: null};
    this.openLayersService.updateCurrentSymbol(selectedSymbol);
  }


}
