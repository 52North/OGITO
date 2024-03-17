import { Injectable } from '@angular/core';
import { OpenLayersService } from '../open-layers.service';
import { AppconfigService } from './appconfig.service';
import { Subscription } from 'rxjs';
import { ProjectConfiguration } from './project-config';

@Injectable({
  providedIn: 'root'
})
export class LabelLutService {

  private subsToSelectProject: Subscription;
  private loadedProject: ProjectConfiguration;
  private labelLookUp: Object;


  constructor(private readonly openlayersService : OpenLayersService, private config : AppconfigService) {
    this.subsToSelectProject = this.openlayersService.qgsProjectUrl$.subscribe(
      (data) => {
        if (data) {
          this.updateSelectedProject(data);
        }
      },
      (error) => {
        console.log('Error in shapeEditType', error);
      }
    );
  }

  /**
   * returns label if defined in project configuration, otherwise simply retruns propertyName
   * @param layerName
   * @param propertyName
   * @returns
   */
  public getLabelForPropertyName(layerName: string, propertyName: string) : string {
      if(this.labelLookUp){
        if(this.labelLookUp[layerName]){
          if(this.labelLookUp[layerName][propertyName]){
            const label = this.labelLookUp[layerName][propertyName]
            console.log("return label for property " + layerName + "." + propertyName + ": " + label);
            return label
          }else{
            return propertyName;
          }
        }else{
          return propertyName
        }

      }else{
        return propertyName
      }
  }

  public hasLabel(layerName: string, properyName: string){
    return (this.labelLookUp && this.labelLookUp[layerName] && this.labelLookUp[layerName][properyName]);
  }

  private updateSelectedProject(projectConfig: ProjectConfiguration) {
      this.loadedProject = projectConfig;
      this.labelLookUp = this.loadedProject.labels;
  }
}
