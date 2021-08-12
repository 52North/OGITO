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
    const layerNames = {straassenlaerm_lden: 'StraassenlaermLden',
                        straassenlaerm_lnight: 'StraassenlaermLnight',
                        gesamtlarm_lden: 'GesamtlarmLden',
                        Industrielaerm_lden: 'IndustrielaermLden',
                        Industrielaerm_lnight: 'IndustrielaermLnight',
                        Zuglaerm_bogestra_lden: 'ZuglaermBogestraLden',
                        Zuglaerm_bogestra_lnight: 'ZuglaermBogestraLnight',
                        Zuglaerm_db_lden: 'ZuglaermDbLden'
    };
    const queryName =  selectedLayer + bezirke + layerNames[selectedNoiseLayer];
    const  query = gql`
      query { ` +
      queryName + ` (dblow: ` + lowLevel + `, dbhigh:` + highLevel + `) {
       totalCount
       nodes {
        id,
        bezirkeId,
        geom {
          geojson
          srid
        }
       }
      }
    }
    `;

    console.log('query', query, 'queryName', queryName);
    // http://localhost:4200/graphql--> by proxy diverted to http://130.89.6.97:5000/graphql
    //request('https://ogito.itc.utwente.nl/graphql', query)
    // queryResult = request('https://ogito.itc.utwente.nl/graphql', query)

    // for debug
    queryResult = request('http://localhost:4200/graphql', query)
        .then(result => {
            console.log('data', result,  result[queryName]);
            queryResult = result[queryName];
            return queryResult;
          })
      .then( resultQuery => {
       return resultQuery;
      });
    return queryResult;
    }
}
