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
  projectFolder = '/etc/qgisserver/';
  projects = [
    {
      name: 'OGITO Enschede Case Study',
      url: AppConfiguration.hostname + 'qgs_projects/noisebochumcity.qgs',
      file: this.projectFolder + 'ogito_enschede.qgs',     // was checking4
      img: AppConfiguration.hostname + 'qgs_projects/noise.png',
      qGsServerUrl: 'http://localhost:8380/?',
      srsID: 'EPSG:28992'   //EPSG CODE
    }
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
    this.openLayersService.updateQgsProjectUrl(project);
    this.updateShowProjectList(false);
  }

}
