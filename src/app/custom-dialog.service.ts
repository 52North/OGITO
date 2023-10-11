import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { VectorLayer } from 'ol/layer/Vector';
import { Feature } from 'ol/Feature';

@Injectable({
  providedIn: 'root'
})
export class CustomDialogService {
  private editMeldingenSource = new Subject<EditedFeature>();
  editMeldingen$ = this.editMeldingenSource.asObservable();
  private customDialogClosedSource = new Subject<DialogClosedEvent>();
  dialogClosed$ = this.customDialogClosedSource.asObservable();

  private customDialogs: CustomDialogDescription[] = [
    {
      layerName: "Reporting",
      header: "Category",
      handler: (layer: VectorLayer, feature: Feature) => {
        console.log("request custom edit dialag for Reporting")
        this.startEditNewMeldigen({layer, feature})
     }
    }
  ]



  /**
   * returns null if no handler available for layer
   * @param layerName
   * @returns
   */
  public getCustomHandlerForLayer(layerName: string): CustomDialogDescription {
      for(let customDialog of this.customDialogs){
        if(customDialog.layerName === layerName){
          return customDialog;
        }
      }
      return null;
  }

  public raiseCustomDialogClosed(layerName: string, isAborted: boolean){
    this.customDialogClosedSource.next({layerName, isAborted})
  }

  private startEditNewMeldigen(data: EditedFeature){
    //show custom edit meldingen dialog
    this.editMeldingenSource.next(data)
  }

}

export interface EditedFeature{
  layer: VectorLayer
  feature: Feature
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
