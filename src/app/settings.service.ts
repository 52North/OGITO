import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings: Settings;

  constructor() {

   const settingsPromise = new Promise<Settings>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', './assets/settings.json');
      xhr.onload = () => {
        if (xhr.status === 200) {
          this.settings = JSON.parse(xhr.responseText);
          resolve(this.settings);
        } else {
          reject('Cannot load configuration...');
        }
      };
      xhr.send();
    });

    settingsPromise.catch((error) => {
        console.error("unable to load settings!");
        console.error(error)
      }
    )

   }

   public getSettings(): Settings {
    return this.settings;
  }

}


export interface Settings{
  hostname: string,
  wmsVersion: string,
  wfsVersion: string,
  wmtsVersion :string,
  svgFolder: string,
  mapZoom : number,
  maxZoom : number,
  minZoom : number,
  polygonThreshold : number, // Distance in meter to close a polygon being drawn with a line
  project: {
    name: string
    projectFolder: string,
    projectFile: string,
    img: string,
    qgisServerUrl: string,
    srsID: string,
    proj4Def: string
  }
}
