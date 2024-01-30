import VectorLayer from 'ol/layer/Vector.js';
import VectorSource from 'ol/source/Vector.js';
import { Feature } from 'ol/Feature';
import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { OpenLayersService } from './open-layers.service';
import { AppconfigService } from './config/appconfig.service';
import { ProjectConfiguration } from './config/project-config';
import { Subscription } from 'rxjs';
import WFS from 'ol/format/WFS.js';
import { HttpClient } from '@angular/common/http';
import EqualTo from 'ol/format/filter/EqualTo.js';

import GML from 'ol/format/GML.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import { ApplicationConfiguration } from './config/app-config';

@Injectable({
  providedIn: 'root'
})
export class InitializeSketchlayersService{
  private readonly layernameProperty : string = "layername"
  private wfsFormat : WFS;
  private readonly retrieveFeaturesSrs: string = "EPSG:4326" //retrieve features in Geojson in WGS84 and transform to app srs, since OL GML/WFS format cannot read polygons properly (bug?)

  constructor(private config: AppconfigService, private http: HttpClient) {
    this.wfsFormat =  new WFS({
      version: config.getAppConfig().wfsVersion,
      featureNS: config.getAppConfig().hostname
    })
  }


  /**
   * retrieves sketch features from wfs to create OL VectorSource for each exsting sketch layer
   * @returns map with VectorSource for each existing sketch layer; key is the layername, value is the corresponding VectorSource object
   */
  public async retrieveExistingSketchLayers(project: ProjectConfiguration): Promise<Map<string, VectorSource>> {
    const serverUrl = this.getServerUrl(project);
    const featureTypes = [project.sketchLayerPoints, project.sketchLayerLinestrings, project.sketchLayerPolygons]
    const layernames = await this.retrieveLayerNames(serverUrl, featureTypes);
    const sources = this.createVectorSources(serverUrl, layernames, featureTypes);
    return sources;
  }

  public createSourceForSketchLayer(project: ProjectConfiguration, sketchLayerName : string){
    const serverUrl = this.getServerUrl(project);
    const featureTypes = [project.sketchLayerPoints, project.sketchLayerLinestrings, project.sketchLayerPolygons]
    const layernames = [sketchLayerName]
    const source = this.createVectorSources(serverUrl, layernames, featureTypes).get(sketchLayerName);

    return source;
  }

  private async retrieveLayerNames(serverUrl: string, featuresTypes: string[]): Promise<string[]>{
    const featureRequest = this.wfsFormat.writeGetFeature({
      srsName: this.config.getAppConfig().srs,
      featureTypes: featuresTypes,
      outputFormat: 'application/json',
      propertyNames: [this.layernameProperty]
    });
    const features = await this.postGetFeatureRequest(serverUrl, featureRequest)
    const layernames: string[] = []
    for(let feature of features){
      const layername = feature.get(this.layernameProperty);
      if(!layernames.includes(layername) && typeof(layername) === 'string'){ //unique layernames and filter layername is undefined
        layernames.push(layername.toString())
      }
    }
    return layernames;
  }

  private createVectorSources(serverUrl: string, layernames: string[], featureTypes: string[]) : Map<string, VectorSource>{
    const sources = new Map<string, VectorSource>();
    for(let layername of layernames){
      const source = new VectorSource({
        wrapx: false,
        format: this.wfsFormat,
        loader: (extent, resolution, projection, success, failure) => {
          const featureRequest = this.wfsFormat.writeGetFeature({
            srsName: this.retrieveFeaturesSrs,
            featureTypes: featureTypes,
            outputFormat: 'application/json',
            filter: new EqualTo(this.layernameProperty , layername, false)
          });
          this.postGetFeatureRequest(serverUrl, featureRequest).then((features) => {
            source.addFeatures(features)
            success(features)
          })
        }

      })

      sources.set(layername, source);
    }
    return sources;
  }

  private async postGetFeatureRequest(serverUrl : string, featureRequest: Node) : Promise<Feature>{
    //post request
    const body = new XMLSerializer().serializeToString(featureRequest) //xml node object to xml string
    const response = await this.http.post(serverUrl, body, {responseType: 'text' as any}).toPromise();
    if(response){
      const features : Feature[] = new GeoJSON().readFeatures(response, {dataProjection: this.retrieveFeaturesSrs , featureProjection: this.config.getAppConfig().srs}); //retrieve and parse as geojson wgs84 and transform to app srs; workaround for OL GML format not able to parse polygons properly
      return features;
    }else{
      console.warn("error while retrieving features for sketch layer initialization")
      throw new Error("unabble to retrieve features for for sketch layer initialization")
    }
  }

  private getServerUrl(projectConfig: ProjectConfiguration) {
      const projectFile = this.config.getAppConfig().qgisServerProjectFolder + projectConfig.qgisProjectFilename;
      const qgisServerUrl = this.config.getAppConfig().qgisServerUrl + "SERVICE=WFS&REQUEST=GetFeature&OUTPUTFORMAT=GML3&SRSNAME="+ this.config.getAppConfig().srs +"&VERSION=" + this.config.getAppConfig().wfsVersion + "&map=" + projectFile;
      return qgisServerUrl;
  }


}


