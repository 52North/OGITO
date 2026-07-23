import { Injectable, OnDestroy } from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import Feature from 'ol/Feature';
import { OpenLayersService } from './open-layers.service';
import { ProjectConfiguration } from './config/project-config';
import { CustomSketchLayerService } from './config/custom-sketch-layer-service';
import { CustomLayerDefinition } from './config/custom-sketch-layer-config';
import { EditLayer } from './map/map.component';
import { QuestionService } from './dynamic-form-questions/question-service.service';
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


  constructor (private openLayersService: OpenLayersService, private customLayerService: CustomSketchLayerService, private questionService: QuestionService){
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
      handler: (layer: EditLayer, feature: Feature) => {
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
              handler: (layer: EditLayer, feature: Feature) => {
                console.log("request custom edit dialog for custom sketch layer " + layerName)
                this.startEditCustomSketchLayer({layer, feature, layerDefinition})
              }
            }
          }
      }

      if(!isSketchLayer && (!this.loadedProject.rateMeasureLayers || !this.loadedProject.rateMeasureLayers.includes(layerName))){ //if not layer for measure ranking, use custom dialog
        if(this.detectEditMeldingenLayer(layerName)){
          return this.customDialogs[0];
        }else{
          return null;
        }
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

  /**
   * check if question fit to EditMeldingen (Reporting) layer
   * @param layeName 
   * @returns 
   */
  private detectEditMeldingenLayer(layeName: string) : boolean {
    //this is a raw workaround to detect if dynamic question layer or EditMeldingen (Reporting) layer
    //we check if layer is as matching properties/question for EditMeldingen (Reporting) layer
    //currently, there is no way to distinguish between dynmic quesiton layer (no custom handler) and EditMeldingen (Reporting) layer
    //Would be better to indicate EditMeldingen (Reporting) layers in project configuration (breaking change)

    const questions = this.questionService.getQuestions(layeName);
    if(!questions){
      return false;
    }


    const expectedQuestionKeys = ["text", "category", "date", "helpfulness", "priority"]
    const existingQuestionKeys = new Set(questions.map(obj => obj.key));
    const allKeysPresent = expectedQuestionKeys.every(key => existingQuestionKeys.has(key));
    const isEditMeldingenLayer = allKeysPresent;

    return isEditMeldingenLayer;
  }
}

export interface EditedFeature{
  layer: EditLayer
  feature: Feature
}

export interface EditedFeatureCustomSketchLayer extends EditedFeature{
  layerDefinition: CustomLayerDefinition
}

export interface CustomDialogDescription{
  layerName: string,
  header: string,
  handler: (layer: EditLayer, feature: Feature) => void
}

export interface DialogClosedEvent{
  layerName: string,
  isAborted: boolean,
}
