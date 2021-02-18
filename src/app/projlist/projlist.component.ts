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
    url: AppConfiguration.hostname + 'qgs_projects/noise2.qgs',
    file: this.projectFolder + 'noise2.qgs',
    img: AppConfiguration.hostname + 'qgs_projects/noise.png'
  }/*,
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
    this.selectProject.emit(project);
    this.openLayersService.updateQgsProjectUrl(project);
    this.updateShowProjectList(false);
  }

}
