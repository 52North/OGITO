import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin} from 'rxjs';
import { CustomLayerDefinition } from './custom-sketch-layer-config';
import { tap } from 'rxjs/operators';
import { ProjectConfiguration } from './project-config';

@Injectable({
  providedIn: 'root'
})
export class CustomSketchLayerService {


private configCache = new Map<string, CustomLayerDefinition>();

  constructor(private http: HttpClient) {}

  /**
   * Fetches multiple JSON configuration files and caches them by layername.
   * @param urls Array of configuration file URLs/paths.
   */
  async loadCustomLayerDefinitions(project: ProjectConfiguration): Promise<CustomLayerDefinition[]> {
    this.configCache.clear();

    if (!project.customSketchLayerDefinitionsFiles || project.customSketchLayerDefinitionsFiles.length === 0){
      return Promise.resolve([]);
    }

    const urls = project.customSketchLayerDefinitionsFiles;
    // Create an array of HTTP GET Observables
    const requests: Observable<CustomLayerDefinition>[] = urls.map(url => this.http.get<CustomLayerDefinition>(url));

    // forkJoin waits for all HTTP requests to complete
    const formConfigs = await forkJoin(requests).pipe(
      tap((configs: CustomLayerDefinition[]) => {
        // Populate the cache map
        configs.forEach(config => {
          if (config.layername) {
            this.configCache.set(config.layername, config);
          } else {
            console.warn('A configuration file is missing the "layername" property.', config);
          }
        });
      })
    ).toPromise();

    return formConfigs;
  }

  /**
   * Retrieves a parsed configuration synchronously from the cache by its layername.
   * @param layername The layername to look up.
   */
  getConfigByLayerName(layername: string): CustomLayerDefinition | undefined {
    return this.configCache.get(layername);
  }

  getAllCustomDefinitionLayernames(){
    return Array.from(this.configCache.keys());
  }

  isCustomSketchLayer(layername: string): boolean {
    return this.configCache.has(layername);
  }

  clearCache(): void {
    this.configCache.clear();
  }

  getQGISFieldsForCustomSketchLayers(){
    const qgisFields = [
        { name: 'id', type: 'QString', typeName: 'varchar', comment: '' },
        { name: 'inserted', type: 'QDateTime', typeName: 'datetime', comment: '' },
        { name: 'category', type: 'QString', typeName: 'varchar', comment: 'category that determines style' },
        { name: 'payload', type: 'QString', typeName: 'text', comment: 'json string' }
      ]
      
    return qgisFields;
  }


}


