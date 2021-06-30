import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {request, gql} from 'graphql-request';
import {AppConfiguration} from '../app-configuration';

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
       'noiseAnnoyance',
       sanitizer.bypassSecurityTrustResourceUrl('assets/img/noiseannoyance-24px.svg')
     );
    iconRegistry.addSvgIcon(
       'noiseOrgAnnoyance',
       sanitizer.bypassSecurityTrustResourceUrl('assets/img/organnoyance-24px.svg')
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

  findExposedPeople() {
    this.openLayersService.updateFindPopExposed(true);
   /* const query = gql`
    query {
      leiseOrteById (id:17) {
        id
        detail
      }
    }
    `*/

    /* const query = gql`
    query {
      populationStraassenlaermLden (dblow:70, dbhigh: 75) {
       totalCount
       nodes {
        id
        value
        geom {
          geojson
          srid
        }
       }
      }
    }
    `

     // http://localhost:4200/graphql--> by proxy diverted to http://130.89.6.97:5000/graphql
    request('http://localhost:4200/graphql', query)
      .then (data => { console.log('data', data);
                    //   this.openLayersService.updatePopExposedSource(data.populationStraassenlaermLden);
                       this.processPopLden(data.populationStraassenlaermLden);
                       });

     */
  }

  processPopLden(data){
    /*totalCount
    nodes {
      id
      value
      geom {
        geojson
        srid
      }
    }*/
   // start to process the data, get the sum
   console.log ('data.nodes[2]', data.nodes);
   const popExposed = data.nodes.reduce((sum, current) => sum + Number(current.value), 0);
   console.log('Sum Pop in query', Math.round(popExposed * 100) / 100 , 'Share =', popExposed/ AppConfiguration.totalPopBochumArea );
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
    // this.openLayersService.updateNoEditAction(action);
  }

}
