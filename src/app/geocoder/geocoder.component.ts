import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Feature, Map as OlMap } from "ol";
import { Vector } from "ol/layer";
import VectorSource from "ol/source/Vector";
import { Subscription } from "rxjs";
import { AppconfigService } from "../config/appconfig.service";
import { ProjectConfiguration } from "../config/project-config";
import { OpenLayersService } from "../open-layers.service";
import { fromLonLat } from "ol/proj";
import { Circle, Point } from "ol/geom";
import { Style, Stroke, Fill } from "ol/style";
import CircleStyle from "ol/style/Circle";
import { MatSelect } from "@angular/material/select";

@Component({
	selector: "app-geocoder",
	templateUrl: "./geocoder.component.html",
	styleUrls: ["./geocoder.component.scss"],
})
export class GeocoderComponent implements OnInit, OnDestroy {
	private showGeocoderSubscription: Subscription;
	private projectSelectedSubscription: Subscription;

	@Input() olMap: OlMap;
  @ViewChild ("geocoderSelect", {static: false})geocoderSelect : MatSelect;

	
	private clientCache: Map<string, GeocodingResult[]> = new Map(); // Simple in-memory cache
	private projectConfig?: ProjectConfiguration;
	private bboxRequestParam?: string; //derived from project config
	private proximityRequestParam?: string; //derived from project config
	private geocodingVectorSource: VectorSource;
	private geocodingVectorLayer: Vector;
  private geocoderBaseUrl: string = "";
  private autoComplete = false;
  private  limit: number = 5;

	isVisible: boolean = false;
	userInput: string = "";
	currentResults: GeocodingResult[] = [];
	selectedResult?: GeocodingResult;

	constructor(
		private openLayersService: OpenLayersService,
		private http: HttpClient,
		private config: AppconfigService,
    private changeDetectorRef: ChangeDetectorRef
	) {
		this.geocodingVectorSource = new VectorSource();
		this.geocodingVectorLayer = new Vector({
			source: this.geocodingVectorSource,
			properties: {
				name: "OGITO_Geocoding_Results",
			},
			style: new Style({
				image: new CircleStyle({
					radius: 12,
					fill: new Fill({ color: "yellow" }),
					stroke: new Stroke({ color: "black", width: 2 }),
				}),
			}),
		});
	}

	ngOnInit(): void {
		this.showGeocoderSubscription =
			this.openLayersService.showGeocodingComponent$.subscribe(
				(data) => {
					this.setGeocoderVisible(data.visible);
				},
				(error) => {
					console.log(
						"Error in subscription to openLayersService.showGeocodingComponent$",
					);
					console.error(error);
				},
			);
		this.projectSelectedSubscription =
			this.openLayersService.qgsProjectUrl$.subscribe(
				(data) => {
					if (data) {
						this.reset();
						this.projectConfig = data;
						this.bboxRequestParam = this.getBboxParam(data);
						this.proximityRequestParam = this.getProximityParam(data);

            if(data.geocoder){
              this.geocoderBaseUrl = data.geocoder.baseUrl;
              if(data.geocoder.autoComplete !== undefined){
                this.autoComplete = data.geocoder.autoComplete;
              }
              if(data.geocoder.limit !== undefined && data.geocoder.limit > 0){
                this.limit = data.geocoder.limit;
              }
            }

					}
				},
				(error) => {
					console.error("error on project selection", error);
				},
			);
	}

	public isGeocoderVisible(): boolean {
		return this.isVisible;
	}

	public setGeocoderVisible(isVisible: boolean) {
		this.isVisible = isVisible;
		if (!isVisible) {
			this.reset();
		}

		//add temporary geocoding result layer to map
		//setMap adds layer on top but is not managed by olMap's layer collection (instead of olMap.addLayer)
		if (isVisible) {
			this.geocodingVectorLayer.setMap(this.olMap);
		} else {
			this.geocodingVectorLayer.setMap(null);
		}
	}

	public onResultSelected(event) {
		this.geocodingVectorSource.clear(); //clear previous selection from map
		this.selectedResult = event.value as GeocodingResult; //event.value is feature
		if (this.selectedResult && this.olMap) {
			const mapProjection = this.olMap.getView().getProjection();
			const resultCoords = fromLonLat(
				[this.selectedResult.longitude, this.selectedResult.latitude],
				mapProjection,
			); //transform from WGS84 to map projection
			const resultFeature = new Feature({
				geometry: new Point(resultCoords),
				name: "OGITO_geocoding_result_feature",
			});
			resultFeature.set("label", this.selectedResult.label);

			this.geocodingVectorSource.addFeature(resultFeature); //add feature for selected result to map
			this.olMap
				.getView()
				.fit(this.geocodingVectorSource.getExtent(), {
					maxZoom: this.olMap.getView().getMaxZoom() - 5,
				});
		}
	}

	public executeGeocodingRequest() {
		const query = this.userInput.trim();
		if (!query) {
			this.currentResults = [];
			return;
		}

		// check cache first
		if (this.clientCache.has(query)) {
			this.currentResults = this.clientCache.get(query) || [];
      this.openSelectOptions(true);
			return;
		}

		// request parameters
		const params: GeocodingRequestParams = {
			address: query,
			limit: this.limit,
			bbox: this.bboxRequestParam,
			proximity: this.proximityRequestParam,
		};

		this.sendGeocodingRequest(params);
	}

	private sendGeocodingRequest(params: GeocodingRequestParams) {
		this.http
			.get<GeocodingResponse>(this.geocoderBaseUrl, { params: params as any })
			.subscribe(
				(results) => {
					const resultItems = results.results ?? [];
					const filteredItems = this.filterResultsByProjectExtent(resultItems);
					this.currentResults = filteredItems;
					this.clientCache.set(params.address, this.currentResults); // Cache results
          this.openSelectOptions(true);
				},
				(error) => {
					console.error("Error during geocoding request", error);
					this.currentResults = [];
				},
			);
	}

	private getBboxParam(conf: ProjectConfiguration): string | undefined {
		if (conf.extentWGS84) {
			const extentArr = [
				conf.extentWGS84["minLat"],
				conf.extentWGS84["minLon"],
				conf.extentWGS84["maxLat"],
				conf.extentWGS84["maxLon"],
			];
			return extentArr.join(",");
		} else {
			return undefined;
		}
	}

	private getProximityParam(conf: ProjectConfiguration): string | undefined {
		if (conf.centerWGS84) {
			const centerArr = [conf.centerWGS84["lat"], conf.centerWGS84["lon"]];
			return centerArr.join(",");
		} else if (!conf.centerWGS84 && conf.extentWGS84) {
			//calculate center from extend
			const centerArr = [
				(conf.extentWGS84["minLat"] + conf.extentWGS84["maxLat"]) / 2,
				(conf.extentWGS84["minLon"] + conf.extentWGS84["maxLon"]) / 2,
			];
			return centerArr.join(",");
		} else {
			return undefined;
		}
	}

	private filterResultsByProjectExtent(results: GeocodingResult[]) {
		if (this.projectConfig.extentWGS84) {
			const extent = this.projectConfig.extentWGS84;
			const filteredResults: GeocodingResult[] = [];
			for (const result of results) {
				if (
					result.latitude >= extent.minLat &&
					result.latitude <= extent.maxLat &&
					result.longitude >= extent.minLon &&
					result.longitude <= extent.maxLon
				) {
					filteredResults.push(result);
				}
			}
			return filteredResults;
		} else {
			return results;
		}
	}

	private reset() {
		this.userInput = "";
		this.currentResults = [];
		this.selectedResult = undefined;
		this.geocodingVectorSource.clear();
	}

  private openSelectOptions(open: boolean){
    this.changeDetectorRef.detectChanges(); //detect changes first because streetselect Element is conditional (*ngIf)
    if(open){
      this.geocoderSelect.open();
    }else{
      this.geocoderSelect.close();
    }
  }

	ngOnDestroy(): void {
		this.showGeocoderSubscription.unsubscribe();
		this.projectSelectedSubscription.unsubscribe();
		this.isVisible = false;
		this.olMap = undefined;
	}
}

interface GeocodingResponse {
	message?: string;
	results?: GeocodingResult[];
	query?: "string";
	errors?: string[];
}

interface GeocodingResult {
	label: string;
	latitude: number;
	longitude: number;
	raw?: any;
}

interface GeocodingRequestParams {
	address: string;
	limit?: number;
	raw?: boolean;
	bbox?: string; // format: "minLat,minLon,maxLat,maxLon"
	proximity?: string; // format: "lat,lon"
}
