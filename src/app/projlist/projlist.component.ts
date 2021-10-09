import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppConfiguration} from '../app-configuration';
import {Observable, of as observableOf} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-projlist',
  templateUrl: './projlist.component.html',
  styleUrls: ['./projlist.component.scss']
})
export class ProjlistComponent implements OnInit {
  @Output() selectProject = new EventEmitter<any>();
  showProjectList$: Observable<boolean>;
  projectFolder = '/home/qgis/projects/';
  projects = [
    /*{ name: 'Noise Action Plan - ITC',
      url: AppConfiguration.hostname + 'qgs_projects/noisebochum_pilot.qgs',
      file: this.projectFolder + 'noisebochum_pilot.qgs',
      img: AppConfiguration.hostname + 'qgs_projects/noise_pilot.png',
      qGsServerUrl: 'https://ogito.itc.utwente.nl/cgi-bin/qgis_mapserv.fcgi?',
      srsID: 'EPSG:3857'   //EPSG CODE
    },*/
    /*{
    name: 'Noise Action Plan Bochum - University',
    url: AppConfiguration.hostname + 'qgs_projects/noisebochum.qgs',
    file: this.projectFolder + 'noisebochum.qgs',     // was checking4
    img: AppConfiguration.hostname + 'qgs_projects/noise.png',
    qGsServerUrl: 'https://ogito.itc.utwente.nl/cgi-bin/qgis_mapserv.fcgi?',
    srsID: 'EPSG:3857'   //EPSG CODE
  },*/
    {
      name: 'Noise Action Plan Bochum - City',
      url: AppConfiguration.hostname + 'qgs_projects/noisebochumcity.qgs',
      file: this.projectFolder + 'noisebochumcity.qgs',     // was checking4
      img: AppConfiguration.hostname + 'qgs_projects/noise.png',
      qGsServerUrl: 'https://ogito.itc.utwente.nl/cgi-bin/qgis_mapserv.fcgi?',
      srsID: 'EPSG:3857'   //EPSG CODE
    }
    ,
    /*
    {
      name: 'Noise Action Plan Bochum - Municipality',
      url: AppConfiguration.hostname + 'qgs_projects/noisebochum_municipal.qgs',
      file: this.projectFolder + 'noisebochum_municipal.qgs',     // was checking4
      img: AppConfiguration.hostname + 'qgs_projects/noise.png',
      qGsServerUrl: 'https://ogito.itc.utwente.nl/cgi-bin/qgis_mapserv.fcgi?',
      srsID: 'EPSG:3857'   //EPSG CODE
    } */
  /*,
    { name: 'GECCO Noise Munster',
      url: AppConfiguration.hostname + 'qgs_projects/noisemunster4.qgz',  // wrokaround while solving thw WMS problem
      file: this.projectFolder + 'noisemunster4.qgz',
      img: AppConfiguration.hostname + 'qgs_projects/imgMunster.png',
      qGsServerUrl: 'https://ogito.itc.utwente.nl/cgi-bin/qgis_mapserv.fcgi?',
      srsID: 'EPSG:25832'  //EPSG CODE
    }*/
  ];

  constructor( private  openLayersService: OpenLayersService, private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    this.showProjectList$ = observableOf(true);
  }
 sanitizeImageUrl(imageUrl: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(imageUrl);
 }
  updateShowProjectList(value) {
    this.showProjectList$ = observableOf(value);
  }
  setProject(project: any) {

    // test 30-03 this.selectProject.emit(project);
    this.openLayersService.updateQgsProjectUrl(project);
    this.updateShowProjectList(false);
  }

}
