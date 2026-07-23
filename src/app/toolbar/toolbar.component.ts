import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  layerSketchName: string;
  private subscriptionExistingProject: Subscription;
  private subscriptionStreetSearchConfigured: Subscription;
  private subscriptionGeocoderConfigured: Subscription;
  isStreetSearchConfigured: boolean = false;
  isGeocoderConfigured: boolean = false;
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
    iconRegistry.addSvgIcon(
      'magnifier',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/magnifier.svg')
    );
    iconRegistry.addSvgIcon(
      'geolocation',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/geolocation.svg')
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

  openStreetSearch(){
    this.openLayersService.updateShowStreetSearch(true);
  }

  openGeocoder(){
    this.openLayersService.updateShowGeocodingComponent(true)
  }

  ngOnInit(): void {
    this.subscriptionExistingProject = this.openLayersService.existingProject$.subscribe(
      (data: any) => this.existingProject = true,
      (error) => {
        alert('error retrieving existing project');
        console.log(error);
      });
    this.subscriptionStreetSearchConfigured = this.openLayersService.streetSearchConfigured$.subscribe(
      (isConfigured: boolean) => this.isStreetSearchConfigured = isConfigured
    )
    this.subscriptionGeocoderConfigured = this.openLayersService.geocodingConfigured$.subscribe(
      (isConfigured: boolean) => this.isGeocoderConfigured = isConfigured
    )
  }

  ngOnDestroy(): void {
    this.subscriptionExistingProject.unsubscribe();
    this.subscriptionStreetSearchConfigured.unsubscribe();
    this.subscriptionGeocoderConfigured.unsubscribe();
  }

  toggleFullScreen(){
  if(!document.fullscreenElement){ //if not in fullscreen mode
      document.getElementById("app-content-container")?.requestFullscreen()
    }else{
      document.exitFullscreen()
    }
  }

  updateCurrentPosition(){
    this.openLayersService.updateGeolocation();
  }
}


/**
 * Dialog asks for name of new sketch layer to create
 */
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

