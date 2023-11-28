import { ProjectloaderService } from './../config/projectloader.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppConstants} from '../app-constants';
import {Observable, of as observableOf} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { ProjectConfiguration } from '../config/project-config';

@Component({
  selector: 'app-projlist',
  templateUrl: './projlist.component.html',
  styleUrls: ['./projlist.component.scss']
})
export class ProjlistComponent implements OnInit {
  @Output() selectProject = new EventEmitter<any>();
  showProjectList$: Observable<boolean>;
  private projects: ProjectConfiguration[];

  constructor( private  openLayersService: OpenLayersService, private sanitizer: DomSanitizer, private projectsConfig : ProjectloaderService) {}

  ngOnInit(): void {
    console.info("load project configuration")
    this.showProjectList$ = observableOf(true);
    this.projectsConfig.retrieveProjects().then(
      (config) => this.projects = config
    );
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

  getProjects() {
    return this.projects;
  }
}
