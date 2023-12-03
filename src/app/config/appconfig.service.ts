
import { Injectable } from '@angular/core';
import { settings, settingsPromise} from 'src/environments/environment';
import { ApplicationConfiguration } from './app-config';

@Injectable({
  providedIn: 'root'
})
export class AppconfigService {

  constructor() {}

  public getAppConfig() : ApplicationConfiguration {
    return settings;
  }

  public getAppConfigPromise() : Promise<ApplicationConfiguration>{
    return settingsPromise;
  }
}
