import { AppConfiguration } from './../app-configuration';
import { OpenLayersService } from './../open-layers.service';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  and as AndFilter,
  equalTo as EqualToFilter,
  like as LikeFilter,
} from 'ol/format/filter';
import VectorSource from 'ol/source/Vector'
import Feature from 'ol/Feature';
import {GeoJSON, WFS} from 'ol/format';
import { HttpClient } from '@angular/common/http';

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

  constructor(private openLayersService: OpenLayersService, private http: HttpClient,) { }

  ngOnInit(): void {
    this.showStreetSourceSubscription = this.openLayersService.showStreetSearch$.subscribe(
      (data) => {
        this.setStreetSearchVisible(data);
      },
      (error) => {console.log('Error in subscription to openLayersService.showStreetSearch$'); console.error(error) }
    )
  }

  ngOnDestroy(): void {
    this.showStreetSourceSubscription.unsubscribe()
  }


  public isStreetSearchVisible() : boolean {
    return this.isVisible;
  }

  public setStreetSearchVisible(isVisible: boolean){
    this.isVisible = isVisible;
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
    this.fireStreetSelected(event.value); //event.value is feature
  }

  private postGetFeatureRequest(body: string){
    //post request
    this.http.post<any>('http://localhost:8380', body).subscribe(jsonData => {
        //geojson to ol features
        const features = this.parseFeaturesFromGeoJson(jsonData)
        this.currentFeatures = this.sortFeatures(features);
        const selectedFeature = (features && features.length > 0) ? features[0] : null;
        //auto select first hit
        this.selectedFeature = selectedFeature;
        this.fireStreetSelected(selectedFeature);

    })
  }

  private parseFeaturesFromGeoJson(geojson: string) : Feature[]{
    const features = new GeoJSON().readFeatures(geojson, {dataProjection: 'EPSG:4326', featureProjection: StreetSearchComponent.SRS});
    return features;
  }

  private createGetFeatureRequest() : any {
    const featureRequest = new WFS().writeGetFeature({
      srsName: StreetSearchComponent.SRS,
      //featureNS: 'http://openstreemap.org',
      //featurePrefix: 'osm',
      featureTypes: [StreetSearchComponent.FEATURETYPE],
      outputFormat: 'application/json',
      filter: this.createFilterExpression()
    });

    return featureRequest;
  }

  private createFilterExpression() : LikeFilter {
    const pattern = "*" + this.userInput.trim() + "*"; //add wildcards and trim
    const filter = new LikeFilter(StreetSearchComponent.FEATUREPROPERTY, pattern, "*" /*wildcard*/ , '.' /*single char*/,  '!' /*escape char*/, false /*match case*/)

    return filter;
  }

  private fireStreetSelected(feature : Feature){
    console.log("street selected");
    console.log(feature);

    this.openLayersService.updateSelectedStreet(feature);
  }

  private sortFeatures(features : Feature[]){
    return features.sort((a, b) => a.getProperties()[StreetSearchComponent.FEATUREPROPERTY].localeCompare(b.getProperties()[StreetSearchComponent.FEATUREPROPERTY]))
  }

}
