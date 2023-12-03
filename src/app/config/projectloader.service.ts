import { Injectable } from '@angular/core';
import {ProjectConfiguration, ProjectConfigurationCodec } from './project-config';
import { AppconfigService } from './appconfig.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProjectloaderService {


  private configPromise: Promise<any>;

  constructor(private http: HttpClient, private config: AppconfigService) {
    this.configPromise = this.http.get<ProjectConfiguration[]>(this.config.getAppConfig().projectConfigurationFile, {responseType: 'json' as any}).toPromise();
  }

  public async retrieveProjects() : Promise<ProjectConfiguration[]> {
    try{
      //typescript does not check types at runtime
      //use codecs (ts-io) to check type validty of configured projects
      //omit project if configuration is not valid
      const uncheckedConfig: ProjectConfiguration[] = await this.configPromise;

      const validProjects: ProjectConfiguration[] = []
      for(let project of uncheckedConfig){
        const validityCheck = ProjectConfigurationCodec.decode(project);
        if(validityCheck._tag === "Right"){
          validProjects.push(project); //valid project config
        }else{
          console.warn("unable to parse project configuration")
          console.warn(project)
          console.error(validityCheck.left);
          continue;
        }
      }
      return validProjects;
    }catch(e){
      window.alert("unable to load project configuration")
      throw new Error("unable to load project configuration: " + e.toString())
    }
  }
}
