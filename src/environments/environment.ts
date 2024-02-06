// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { ApplicationConfiguration } from "src/app/config/app-config";

export const environment = {
  production: false
};

export let settings: ApplicationConfiguration;

export const settingsPromise = new Promise<ApplicationConfiguration>((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './assets/configuration/appsettings.json');
  xhr.onload = () => {
    if (xhr.status === 200) {
      settings = JSON.parse(xhr.responseText);
      if(settings.requireAuth === undefined || settings.requireAuth === null){
        settings.requireAuth = true;
      }
      resolve(settings);
    } else {
      reject('Cannot load configuration...');
    }
  };
  xhr.send();
});
