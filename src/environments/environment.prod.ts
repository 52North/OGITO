import { ApplicationConfiguration } from "src/app/config/app-config";

export const environment = {
  production: true
};


export let settings: ApplicationConfiguration;

export const settingsPromise = new Promise<ApplicationConfiguration>((resolve, reject) => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', './assets/configuration/appsettings.json');
  xhr.onload = () => {
    if (xhr.status === 200) {
      settings = JSON.parse(xhr.responseText);
      resolve(settings);
    } else {
      reject('Cannot load configuration...');
    }
  };
  xhr.send();
});
