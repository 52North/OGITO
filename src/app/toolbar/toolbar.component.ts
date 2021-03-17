import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
//import {Indicator, IndicatorAnimations} from '../indicator';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
 // animations: IndicatorAnimations
})
export class ToolbarComponent implements OnInit {
  x = 0;
  y = 0;
  startX = 0;
  startY = 0;
  subscriptionExistingProject: Subscription;
  existingProject = true;

  onPanStart(event: any): void {
    this.startX = this.x;
    this.startY = this.y;
  }
  onPan(event: any): void {
    event.preventDefault();
    this.x = this.startX + event.deltaX;
    this.y = this.startY + event.deltaY;
  }
  zoomHome(){
    this.openLayersService.updateZoomHome(true);
  }
   constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private openLayersService: OpenLayersService) {

    iconRegistry.addSvgIcon(
      'layerScratch',
      sanitizer.bypassSecurityTrustResourceUrl('assets/img/baseline-layers-new-24px.svg')
    );
    iconRegistry.addSvgIcon(
       'identify',
       sanitizer.bypassSecurityTrustResourceUrl('assets/img/identify-24px.svg')
     );
  }
  createScratchLayer(){
    /**
     * #TODO  send a subscription? ...
     */
  }
  openLayerPanel(){
    this.openLayersService.updateShowLayerPanel(true);
  }

  searchOnMap(){
    alert('Search elements in a OSM layer #TODO');
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
    // this.openLayersService.updateNoEditAction(action);
  }

}
