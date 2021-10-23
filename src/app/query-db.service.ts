import { Injectable } from '@angular/core';
import {request, gql} from 'graphql-request';

@Injectable({
  providedIn: 'root'
})
export class QueryDBService {
  /**
   * build the queries, run them and return the result.
   */
  constructor() {
  }

  async getOrgExposed(data: any) {
    /* builds the query to find institutions exposed to certain range of noise
     * @param data.selectedLayer: string --> name of layer
     * @param data.lowLevel: number --> low level for the range
     * @param data.highLevel: number --> high level for the range
     */

    // .get the institutions filtered by district...
    const lowLevel = +data.lowLevel;
    const highLevel = +data.highLevel;
    const selectedLayer = data.selectedLayer.toLowerCase();
    const bezirke = 'Bezirke';
    const selectedNoiseLayer = data.selectedNoiseLayer.toLowerCase();
    let queryResult = null;
    const layerName = selectedNoiseLayer + data.selectedLayer.toLowerCase() + '_' + lowLevel + '_' + highLevel;
    const layerNames = {strassenlaerm_lden: 'StrassenlaermLden',
                        strassenlaerm_lnight: 'StrassenlaermLnight',
                        gesamtlaerm_lden: 'GesamtlaermLden',
                        industrielaerm_lden: 'IndustrielaermLden',
                        industrielaerm_lnight: 'IndustrielaermLnight',
                        zuglaerm_bogestra_lden: 'ZuglaermBogestraLden',
                        zuglaerm_bogestra_lnight: 'ZuglaermBogestraLnight',
                        zuglaerm_db_lden: 'ZuglaermDbLden'
    };
    const queryName =  selectedLayer + bezirke + layerNames[selectedNoiseLayer.toLowerCase()];
    const  query = gql`
      query { ` +
      queryName + ` (dblow: ` + lowLevel + `, dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id,
        bezirkeName,
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;

    console.log('query', query, 'queryName', queryName);
    // for debug
    // http://localhost:4200/graphql--> by proxy diverted to http://130.89.6.97:5000/graphql
     // queryResult = request('http://localhost:4200/graphql', query)
      queryResult = request('https://ogito.itc.utwente.nl/graphql', query)
        .then(result => {
            // console.log('data', result,  result[queryName]);
            queryResult = result[queryName];
            return queryResult;
          })
      .then( resultQuery => {
       return resultQuery;
      });
    return queryResult;
    }
}
