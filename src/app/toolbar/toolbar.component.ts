import {Component, Inject, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {request, gql} from 'graphql-request';
import {AppConfiguration} from '../app-configuration';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  layerSketchName: string;
  subscriptionExistingProject: Subscription;
  existingProject = true;
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer,
              private openLayersService: OpenLayersService,
              public dialog: MatDialog) {

    iconRegistry.addSvgIcon(
      'layerScratch',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-layers-new-24px.svg')
    );
    iconRegistry.addSvgIcon(
       'noiseAnnoyance',
       sanitizer.bypassSecurityTrustResourceUrl('assets/img/noiseannoyance-24px.svg')
     );
    iconRegistry.addSvgIcon(
       'noiseOrgAnnoyance',
       sanitizer.bypassSecurityTrustResourceUrl('assets/img/organnoyance-24px.svg')
     );
     iconRegistry.addSvgIcon(
      'fullscreen',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/fullscreen.svg')
    );
  }

  zoomHome(){
    this.openLayersService.updateZoomHome(true);
  }

  createScratchLayer(): void{
    /**
     * Creates a new sketch layer and add it to the layer panel..
     */
    const dialogRef = this.dialog.open(DialogLayerNameDialog,{
      width: '250px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result){
          console.log('the dialog layerName was closed', result, result.length);
          this.openLayersService.updateAddSketchLayer(result);
          // console.log('the dialog layerName was closed', result);
        }
      });
    }

  openLayerPanel(){
    this.openLayersService.updateShowLayerPanel(true);
  }

  searchOnMap(){
    alert('Search elements in a OSM layer #TODO');
  }

  findExposedPeople() {
    this.openLayersService.updateFindPopExposed(true);
  }

  processPopLden(data){
    // to process the data, get the sum
   const popExposed = data.nodes.reduce((sum, current) => sum + Number(current.value), 0);
  }
  findExposedInstitutions() {
    this.openLayersService.updateFindInstitutionsExposed(true);
  }
  ngOnInit(): void {
    this.subscriptionExistingProject = this.openLayersService.existingProject$.subscribe(
      (data: any) => this.existingProject = true,
      (error) => {
        alert('error retrieving existing project');
        console.log(error);
      });
  }
  startAction(action: string){
    /**
     *  Sends an action (not edit to the openlayersService)
     */
  }

  toggleFullScreen(){
  if(!document.fullscreenElement){ //if not in fullscreen mode
      document.getElementById("app-content-container").requestFullscreen()
    }else{
      document.exitFullscreen()
    }
  }

  async switchScreenOrientation(){
    var changedFullscreenMode = false;

    if(!document.fullscreenElement){ //check if already in fullscreen
      await document.getElementById("app-content-container").requestFullscreen(); // <-- Use wait, app has to be in fullscreen
      changedFullscreenMode = true;
    }

    window.screen.orientation.unlock()

    var current_mode = window.screen.orientation
    var orientationPromise;
    console.log("current screen orientation: " + current_mode.type)
    if(current_mode.type === "landscape-primary"){
      orientationPromise = current_mode.lock("portrait-primary")
    }else if(current_mode.type === "portrait-primary"){
      orientationPromise = current_mode.lock("landscape-secondary")
    }else if(current_mode.type === "landscape-secondary"){
      orientationPromise = current_mode.lock("portrait-secondary")
    }else if(current_mode.type === "portrait-secondary"){
      orientationPromise = current_mode.lock("portrait-primary")
      current_mode.unlock()
    }

    orientationPromise.catch(function(error){
      if(changedFullscreenMode){
         document.exitFullscreen()
      }
      alert("orientation switch not available on this device")
    })
  }

  isOrientationSwitchSupported() : boolean{
    /*if('orientation' in window.screen){
      return true;
    }else{
      return false;
    }*/
    return false;
  }
}



@Component({
  selector: 'dialog-layer-name-dialog',
  templateUrl: 'dialog-layer-name-dialog.html',
})
export class DialogLayerNameDialog {
  sketchName: string;
  constructor( public dialogRef: MatDialogRef<DialogLayerNameDialog>) {
  }

onNoClick(): void {
    this.dialogRef.close();
  }

}

