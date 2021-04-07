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
  projects = [{
    name: 'Noise Action Plan Bochum',
    url: AppConfiguration.hostname + 'qgs_projects/checking2.qgs',
    file: this.projectFolder + 'checking2.qgs',
    img: AppConfiguration.hostname + 'qgs_projects/noise.png',
    qGsServerUrl: 'https://ogito.itc.utwente.nl/cgi-bin/qgis_mapserv.fcgi?',
    srsID: 'EPSG:3857'   //EPSG CODE
  },
    { name: 'GECCO Noise Munster',
      url: 'http://130.89.6.97/' + 'qgs_projects/noisemunster2.qgz',  // wrokaround while solving thw WMS problem
      file: this.projectFolder + 'noisemunster2.qgz',
      img: AppConfiguration.hostname + 'qgs_projects/imgMunster.png',
      qGsServerUrl: 'http://130.89.6.97/cgi-bin/qgis_mapserv.fcgi?',
      srsID: 'EPSG:25832'  //EPSG CODE
    }


  /*,
    { name: 'Renewable Energy Twente',
  url: AppConfiguration.hostname + 'qgs_projects/losser.qgs',
  file: this.projectFolder + 'retwente.qgs',
  img: AppConfiguration.hostname + 'qgs_projects/retwente.png'
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
    console.log(project);
    // test 30-03 this.selectProject.emit(project);
    this.openLayersService.updateQgsProjectUrl(project);
    this.updateShowProjectList(false);
  }

}
