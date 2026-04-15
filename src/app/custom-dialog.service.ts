import { Injectable, OnDestroy } from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import { VectorLayer } from 'ol/layer/Vector';
import { Feature } from 'ol/Feature';
import { OpenLayersService } from './open-layers.service';
import { ProjectConfiguration } from './config/project-config';
import { CustomSketchLayerService } from './config/custom-sketch-layer-service';
import { CustomLayerDefinition } from './config/custom-sketch-layer-config';

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {

  private loadedProject: ProjectConfiguration;

  private editMeldingenSource = new Subject<EditedFeature>();
  editMeldingen$ = this.editMeldingenSource.asObservable();
  private customLayerDefinitionSource = new Subject<EditedFeatureCustomSketchLayer>();
  customLayerDefinition$ = this.customLayerDefinitionSource.asObservable();
  private customDialogClosedSource = new Subject<DialogClosedEvent>();
  dialogClosed$ = this.customDialogClosedSource.asObservable();


  constructor (private openLayersService: OpenLayersService, private customLayerService: CustomSketchLayerService){
    this.openLayersService.qgsProjectUrl$.subscribe(
      (data) => {
        if (data) {
          this.loadedProject = data;
        }
      },
      (error) => {
        console.log('error while updating loaded project', error);
      }
    );
  }


  private customDialogs: CustomDialogDescription[] = [
    {
      layerName: "Reporting",
      header: "Category",
      handler: (layer: VectorLayer, feature: Feature) => {
        console.log("request custom edit dialog for Reporting")
        this.startEditNewMeldigen({layer, feature})
     }
    }
  ]


  /**
   * returns null if no handler available for layer
   * @param layerName
   * @returns
   */
  public getCustomHandlerForLayer(layerName: string, isSketchLayer: boolean = false): CustomDialogDescription | null {
      //handle custom sketch layers
      if(isSketchLayer){
        const isCustomSketchLayer = this.customLayerService.isCustomSketchLayer(layerName); //check if custom layer definition is available
          if (isCustomSketchLayer){ 
            const layerDefinition = this.customLayerService.getConfigByLayerName(layerName)!;
            return {
              layerName: layerName,
              header: layerDefinition.header ?? "Category",
              handler: (layer: VectorLayer, feature: Feature) => {
                console.log("request custom edit dialog for custom sketch layer " + layerName)
                this.startEditCustomSketchLayer({layer, feature, layerDefinition})
              }
            }
          }
      }

      if(!isSketchLayer && (!this.loadedProject.rateMeasureLayers || !this.loadedProject.rateMeasureLayers.includes(layerName))){ //if not layer for measure ranking, use custom dialog
        return this.customDialogs[0];
      }else{
        return null;
      }
  }

  public raiseCustomDialogClosed(layerName: string, isAborted: boolean){
    this.customDialogClosedSource.next({layerName, isAborted})
  }

  private startEditNewMeldigen(data: EditedFeature){
    //show custom edit meldingen dialog
    this.editMeldingenSource.next(data)
  }

  private startEditCustomSketchLayer(data: EditedFeatureCustomSketchLayer){
    //show custom sketch layer dialog
    console.log("sketch layer dialog data: ", data);
    this.customLayerDefinitionSource.next(data);
  }

}

export interface EditedFeature{
  layer: VectorLayer
  feature: Feature
}

export interface EditedFeatureCustomSketchLayer extends EditedFeature{
  layerDefinition: CustomLayerDefinition
}

export interface CustomDialogDescription{
  layerName: string,
  header: string,
  handler: (layer: VectorLayer, feature: Feature) => void
}

export interface DialogClosedEvent{
  layerName: string,
  isAborted: boolean,
}
