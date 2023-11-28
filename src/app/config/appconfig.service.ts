
import { Injectable } from '@angular/core';
import { settings } from 'src/environments/environment';
import { ApplicationConfiguration } from './app-config';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {

  private appConfig: ApplicationConfiguration

  constructor() {
    this.appConfig = settings
  }

  public getAppConfig() : ApplicationConfiguration {
    return this.appConfig;
  }
}
