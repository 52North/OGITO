import { ProjectloaderService } from './../config/projectloader.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppConstants} from '../app-constants';
import {Observable, of as observableOf} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { ProjectConfiguration } from '../config/project-config';
import { CustomSketchLayerService } from '../config/custom-sketch-layer-service';

@Component({
  selector: 'app-projlist',
  templateUrl: './projlist.component.html',
  styleUrls: ['./projlist.component.scss']
})
export class ProjlistComponent implements OnInit {
  @Output() selectProject = new EventEmitter<any>();
  showProjectList$: Observable<boolean>;
  private projects: ProjectConfiguration[];

  constructor( private  openLayersService: OpenLayersService, private sanitizer: DomSanitizer, private projectsConfig : ProjectloaderService, private customLayerService: CustomSketchLayerService) {}

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

  async setProject(project: ProjectConfiguration) {
    //load custom sketch layer definitions for new selected project
    await this.customLayerService.loadCustomLayerDefinitions(project) //await -> make sure custom layer definitions are available when project selection is propagated
    console.info("loaded custom layer definitions for project " + project.name);
 

    this.openLayersService.updateQgsProjectUrl(project);
    this.updateShowProjectList(false);
  }

  getProjects() : ProjectConfiguration[]{
    return this.projects;
  }
}
