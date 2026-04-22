import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Observable, Subscription, of as observableOf } from "rxjs";

import { OpenLayersService, SelectedSymbol, SymbolListVisibility } from "../open-layers.service";
import { MapQgsStyleService, WFSLayerStyle, LegendSymbol } from "../map-qgs-style.service";
import { AppConstants } from "../app-constants"; // Adjust path if necessary

@Component({
	selector: "app-symbol-list",
	templateUrl: "./symbol-list.component.html",
	styleUrls: ["./symbol-list.component.scss"],
})
export class SymbolListComponent implements OnInit, OnDestroy {
	@ViewChild("symbolList", { static: false }) symbolList!: ElementRef;
	@ViewChild("symbol", { static: false }) symboldivs!: ElementRef;

	variable = "";
	symbolActiveKey: string | null = null;
	
	// Array replacing the old dictionary
	symbols: LegendSymbol[] = []; 
	symbolsLength = 0;
	geometryTypeSymbols: string = "";
	displaySymbolList$!: Observable<boolean>;
	
	subscriptionToShowSymbols: Subscription;
	subscriptionToLayerEditing: Subscription;
	
	wfsLayerStyle!: WFSLayerStyle;
	private header: string | null = "Symbols";
	isSelectable = true;

	constructor(
		private openLayersService: OpenLayersService,
		private mapQgsStyleService: MapQgsStyleService,
	) {
		this.subscriptionToShowSymbols = this.openLayersService.showSymbolPanel$.subscribe(
			(data) => {
				this.header = data.optHeader || null;
				this.isSelectable = data.selectable;
				this.showSymbolList(data);
			},
			(error) => {
				console.log("Error in subscription to showSymbolPanel", error);
			},
		);

		this.subscriptionToLayerEditing = this.openLayersService.layerEditing$.subscribe(
			(data) => {
				this.wfsLayerStyle = this.mapQgsStyleService.getLayerStyleConfig(data.layerName);
				
				// Pull the clean array of symbols directly from the new service
				this.symbols = this.wfsLayerStyle?.symbols || [];
				this.symbolsLength = this.symbols.length;
				this.geometryTypeSymbols = data.layerGeom;
				this.unsetActiveSymbol();
			},
			(error) => console.log("Error in subscription to Layer Editing in SymbolList", error),
		);
	}

	ngOnInit(): void {}

	ngOnDestroy(): void {
		this.subscriptionToShowSymbols.unsubscribe();
		this.subscriptionToLayerEditing.unsubscribe();
	}

	showSymbolList(visibility: SymbolListVisibility, isCanceled: boolean = false) {
		if (visibility.visible === false) {
			this.symbolActiveKey = null;
			this.openLayersService.updateCurrentSymbol(null);
			this.openLayersService.raiseSymbolPanelClosed(isCanceled);
		}
		this.displaySymbolList$ = observableOf(visibility.visible);
	}

	setHeader(header: string) {
		this.header = header;
	}

	getHeader(): string | null {
		return this.header;
	}

	unsetActiveSymbol() {
		this.symbolActiveKey = null;
	}

	updateActivesymbol(symbol: LegendSymbol, index: number) {
		// Guard: Do nothing if the panel is not selectable
		if (!this.isSelectable) {
			return;
		}

		// Use the symbol's title as the active key
		this.symbolActiveKey = symbol.title;

		// Set the property mapping for the OpenLayers styling evaluation
		// We use the same constant used by your style function to ensure they match
		let propertyAttr = AppConstants.wfsLAyerStyleAttr;
		if(this.wfsLayerStyle.isSketch === "CUSTOM_SKETCH"){
			propertyAttr = AppConstants.customSketchStyleAttr;
		}else if(this.wfsLayerStyle.isSketch === "SKETCH"){
			propertyAttr = AppConstants.sketchStyleAttr;
		}

		const selectedValue = {
			property: propertyAttr,
			value: symbol.id,
		};

		const selectedSymbol: SelectedSymbol = { 
			symbol: symbol, 
			selectedValue: selectedValue 
		};
		
		this.openLayersService.updateCurrentSymbol(selectedSymbol);
	}
}