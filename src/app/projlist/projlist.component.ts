import { ProjectloaderService } from './../config/projectloader.service';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AppConstants} from '../app-constants';
import {Observable, of as observableOf} from 'rxjs';
import {OpenLayersService} from '../open-layers.service';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import { ProjectConfiguration } from '../config/project-config';
import { CustomSketchLayerService } from '../config/custom-sketch-layer-service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-projlist',
  templateUrl: './projlist.component.html',
  styleUrls: ['./projlist.component.scss']
})
export class ProjlistComponent implements OnInit {
  @Output() selectProject = new EventEmitter<any>();
  showProjectList$: Observable<boolean>;
  private projects: ProjectConfiguration[];

  constructor( private  openLayersService: OpenLayersService, private sanitizer: DomSanitizer, private projectsConfig : ProjectloaderService, private customLayerService: CustomSketchLayerService, private auth: AuthService) {}

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

  /**
   * get all projects visible with current user's roles
   */
  getProjects() : ProjectConfiguration[]{
    if (this.auth.isAdmin()) {
      return this.projects; //admin role grants access to all projects
    }
    const userRoles = this.auth.getUserRoles();
    return this.projects?.filter(project => this.hasAccess(project, userRoles));
  }

  private hasAccess(project: ProjectConfiguration, userRoles: string[]): boolean {
    if (!project.requiredRoles || project.requiredRoles.length === 0) {
      return true; //no roles required -> accessible to everyone
    }
    return project.requiredRoles.some(role => userRoles.includes(role));
  }
}
