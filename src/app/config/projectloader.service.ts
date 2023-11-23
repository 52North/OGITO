import { Injectable } from '@angular/core';
import {ProjectConfiguration } from './project-config';

@Injectable({
  providedIn: 'root'
})
export class ProjectloaderService {



  constructor() { }


  public retrieveProjects() : ProjectConfiguration [] {

    return [
      {
        name: "test project",
        qgisProjectFilename: "ogito_enschede.qgs", //qgs filename only
        thumbnail: "https://avatars.githubusercontent.com/u/3714494?s=200&v=4",
        minZoom: 14,
        maxZoom: 21,
        initZoom: 15,
        nameSessionGroup: "Session Layers",
        hiddenLayers : ["enschede_streets"],
        backgroundLayers : [{title: "Aerial photo", format: "image/jpeg"}, {title: "Topographic map", format: "image/jpeg"}],
        streetSearch: {
          layerName : 'enschede_streets',
          property: 'name'
        }
      },
      {
        name: "OGITO Starter",
        qgisProjectFilename: "ogito_starter.qgs", //qgs filename only
        thumbnail: "https://raw.githubusercontent.com/rosaguilar/myogito/master/company_logo.png?token=GHSAT0AAAAAAB7UFEDR7ODZRUTTXZQS6BOUZCJJ5YA",
        minZoom: 14,
        maxZoom: 21,
        initZoom: 15,
        nameSessionGroup: "Sketch Layers",
        hiddenLayers : [],
        backgroundLayers : [{title: "OpenStreetMap", format: "image/jpeg"}],
        centerWGS84: {lat: 51.935, lon: 7.6521}
        /*extentWGS84: {
          minLon: 7.1,
          minLat: 32.88,
          maxLon: 40.18,
          maxLat: 84.73
        }*/
      }
    ];
  }

}
