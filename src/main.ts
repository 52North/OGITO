import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//import {DemoMaterialModule} from './app/material-module';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import 'hammerjs';  // make the gesture support globally available
if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
