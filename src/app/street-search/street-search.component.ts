import { AppComponent } from './../app.component';
import { catchError } from 'rxjs/operators';
import { AppConfiguration } from './../app-configuration';
import { OpenLayersService } from './../open-layers.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import {
  and as AndFilter,
  equalTo as EqualToFilter,
  like as LikeFilter,
} from 'ol/format/filter';
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature';
import { GeoJSON, WFS } from 'ol/format';
import {GML} from 'ol/format'
import { HttpClient } from '@angular/common/http';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-street-search',
  templateUrl: './street-search.component.html',
  styleUrls: ['./street-search.component.scss']
})
export class StreetSearchComponent implements OnInit, OnDestroy {

  private static SRS = AppConfiguration.srsName;
  private static FEATURETYPE = AppConfiguration.streetSearch.featureType;
  private static FEATUREPROPERTY = AppConfiguration.streetSearch.property;

  selectedFeature: Feature = null;
  userInput: string = '';
  private currentFeatures : Feature[];
  private isVisible: boolean = false;
  private showStreetSourceSubscription: Subscription;
  private projectSelectedSubscription: Subscription;
  private qgisServerUrl : string;
  @ViewChild ('streetSelect', {static: false}) streetSelect : MatSelect;  

  constructor(private openLayersService: OpenLayersService, private http: HttpClient, private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.showStreetSourceSubscription = this.openLayersService.showStreetSearch$.subscribe(
      (data) => {
        this.setStreetSearchVisible(data);
      },
      (error) => {console.log('Error in subscription to openLayersService.showStreetSearch$'); console.error(error) }
    )
    this.projectSelectedSubscription = this.openLayersService.qgsProjectUrl$.subscribe(
      (data) => {
        if (data) {
          this.updateSelectedProject(data);
        }
      },
      (error) => {
        console.error('error on project selection', error);
      }
    );
  }

  ngOnDestroy(): void {
    this.showStreetSourceSubscription.unsubscribe();
    this.projectSelectedSubscription.unsubscribe();
  }


  public isStreetSearchVisible() : boolean {
    return this.isVisible;
  }

  public setStreetSearchVisible(isVisible: boolean){
    this.isVisible = isVisible;
    if(!isVisible){
      this.currentFeatures = [];
      this.userInput = '';
      this.selectedFeature = null;
      this.fireStreetSelected();
    }
  }

  public getCurrentFeatures() : Feature[]{
    return this.currentFeatures;
  }

  public getOptionsLabel(feature: Feature){
    const label = feature.getProperties()[StreetSearchComponent.FEATUREPROPERTY]
    return label;
  }

  public searchStreetNames(){
    const featureRequest = this.createGetFeatureRequest();
    const requestBody = new XMLSerializer().serializeToString(featureRequest); //to xml string
    this.postGetFeatureRequest(requestBody);
  }

  public onStreetSelected(event){
    this.selectedFeature = event.value; //event.value is feature
    this.fireStreetSelected();
  }

  private postGetFeatureRequest(body: string){
    //post request
    this.http.post<string>(this.qgisServerUrl, body, {responseType: 'text' as any}).subscribe(
      (jsonData) => {
        //geojson to ol features
        const features = this.parseFeaturesFromGeoJson(jsonData)
        this.currentFeatures = this.sortFeatures(features);
        const selectedFeature = (features && features.length === 1) ? features[0] : null;
        //auto select first hit if only one hit
        this.selectedFeature = selectedFeature;
        this.fireStreetSelected();

        this.openSelectOptions(true);
    },
    (error) => {
        console.log("error while retrieving data for street search")
        console.error(error)
        this.currentFeatures = [];
        this.selectedFeature = null;
        this.fireStreetSelected();
      }
    )
  }

  private parseFeaturesFromGeoJson(geojson: string) : Feature[]{
    const features = new GML().readFeatures(geojson, {dataProjection: StreetSearchComponent.SRS, featureProjection: StreetSearchComponent.SRS});
    return features;
  }

  private createGetFeatureRequest() : any {
    const featureRequest = new WFS().writeGetFeature({
      srsName: StreetSearchComponent.SRS,
      //featureNS: 'http://openstreemap.org',
      //featurePrefix: 'osm',
      featureTypes: [StreetSearchComponent.FEATURETYPE],
      outputFormat: 'test/xml',
      filter: this.createFilterExpression()
    });

    return featureRequest;
  }

  private createFilterExpression() : LikeFilter {
    const pattern = "*" + this.userInput.trim() + "*"; //add wildcards and trim
    const filter = new LikeFilter(StreetSearchComponent.FEATUREPROPERTY, pattern, "*" /*wildcard*/ , '.' /*single char*/,  '!' /*escape char*/, false /*match case*/)

    return filter;
  }

  private fireStreetSelected(){
    console.log("fire street selected");
    console.log(this.selectedFeature);

    this.openLayersService.updateSelectedStreet(this.selectedFeature);
  }

  private sortFeatures(features : Feature[]){
    return features.sort((a, b) => a.getProperties()[StreetSearchComponent.FEATUREPROPERTY].localeCompare(b.getProperties()[StreetSearchComponent.FEATUREPROPERTY]))
  }

  private updateSelectedProject(qgisProject: any) {
    // get the var from the selection List
    if (qgisProject.file.length > 0) {
      this.qgisServerUrl = qgisProject.qGsServerUrl + "SERVICE=WFS&REQUEST=GetFeature&OUTPUTFORMAT=GML3&SRSNAME="+ StreetSearchComponent.SRS +"&VERSION=" + AppConfiguration.wfsVersion + "&map=" + qgisProject.file + "&TYPENAME=" + StreetSearchComponent.FEATURETYPE;
    }
  }

  private openSelectOptions(open: boolean){
    this.changeDetectorRef.detectChanges(); //detect changes first because streetselect Element is conditional (*ngIf)
    if(open){
      this.streetSelect.open();
    }else{
      this.streetSelect.close();
    }
  }

}
