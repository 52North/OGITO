# OGITO - Open Geospatial Interactive Tool

OGITO is a collaborative mapping an planning application. To support collaborative spatial planning tasks, OGITO is optimised for use on digital map tables. As it is a web application, OGITO can be opened on all devices in the web browser. Touch gestures or pointing devices (e.g. computer mouse) can be used to operate OGITO.

## Introduction


Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.
## Deployment
### Requirements
- Web Server (e.g Apache2 or NGINX) for serving the OGITO app and hosting QGIS Server
- QGIS Server
- POSTGIS (other Database supported by QGIS can be used as well)
- (NodeJS, only required for image upload and developemnt)

### Authentication
- Auth0 single page application login

### Development
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1. In order to build and run the project locally [Angular CLI must be installed](https://angular.io/guide/setup-local#install-the-angular-cli)
#### Build
Run `ng build` to build the project. The build artifacts will be stored in the dist/ directory. Use the `--prod` flag for a production build.
#### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Configuration
OGITO has a global app configuration file for settings that affect the deployment or all projects and project configuration file with settings for each project. Each project needs a entry in the project settings file.
### App Configuration
`src/assets/configuration/appsettings.json`  
  
|  property | description  |  hint |
|---|---|---|
|  hostname | URL of the OGITO deplyoment  | e.g "http://localhost:4200/" or https://myogito.com/  |
| qgisServerUrl  |  base URL of the QGIS Server instance | e.g "http://localhost:8380/?" or "https://myogito.com/cgi-bin/qgis_mapserv.fcgi?"  |
| qgisServerProjectFolder |  folder containing all .qgs QGIS project files for all projects on the server | e.g. "/etc/qgisserver/"  |
| projectConfigurationFile  | URL path of project configuration (JSON) file | e.g. "./assets/configuration/projects.json"  (resolves to http://localhost:4200/assets/configuration/projects.json)|
| imageUploadService  |  URL of the [image upload service](#image-upload)  |  a typical (proxy) setup would be for example "http://localhost:5000/images/" |
| imageUploadFolder |  URL path to folder containing uploaded user images | e.g. "/assets/img/userimg/ogito/uploads/"  (resolves to http://localhost:4200/assets/img/userimg/ogito/uploads/ |
| wmsVersion | version of the OGC Web Map Serivce interface that is used to retrieve map data from QGIS Server  |  e.g. "1.3.0" |
| wfsVersion | version of the OGC Web Feature Serivce interface that is used to retrieve and upload vector data from/to QGIS Server  |  e.g. "1.1.0" |
| srs |   EPSG code for the map projection (supported projections are EPSG:3857 (Web Mercator), EPSG:4326 (WGS84), EPSG:25832 (UTM 32), EPSG:28992 (Amersfoort))| e.g. "EPSG:3857", QGIS service must be able to serve data in this projection | 
| auth.domain | authentication: domain of the [auth0](https://auth0.com/) application| e.g. "dev-abcabc123.us.auth0.com" | 
|auth.clientId| authentication: client id of the [auth0](https://auth0.com/) application| e.g. "abeadsadssaDJo12das"|

### Project Configuration (Setup Projects)
Each project must registered in the project configuration (JSON) file. The location of the project configuration depends on the property `projectConfigurationFile` of the [application configuration](#app-configuration).  
  
|  property | description  |  hint |
|---|---|---|
|  name | (visible) name of the project  | e.g "My OGITO Project"  |
| qgisProjectFilename | .qgs file of the corresponding QGIS project (filename only, no path) | e.g. "myogitoqgisproject.qgs" |
| thumbnail | url of thumbnail image shown in the project selection | e.g "www.example.com/thumbnail.png"|
| minZoom |min. zoom level| e.g. 10|
| maxZoom | max. zoom level | e.g. 20 |
| initZoom | initial zoom level | e.g. 15 |
| nameSessionGroup | group name for sketch layers in layer panel | e.g. "Sketch Layers" |
| hiddenLayers | published WMS layers that should no be visible (in the layer panel) | typically technical layers for sketch geometries and street search, e.g. `["sketch_polygons", "sketch_points", "sketch_linestrings", "streets_layer"]`|
|backgroundLayers| list of background (WMS) layers, background layers are loaded splitted into multiple tiles instead of a single images (might create issues wiht lables on the layer)| e.g. `[{"title": "Topographic Map", "format": "image/jpeg"}, {"title": "Other Basemap", "format": "image/png"}]` |
| centerWGS84 | inital view center in geographic coordinates (WGS84) (optional, eiher this or `extentWGS84` must be set| e.g `{"lat": 51.935, "lon": 7.6521}`, if not set center point of the configured extent is used|
| extentWGS84 | constraints the visible extent (geographic coordinates (WGS84) of the map (optional, either this or `centerWGS84` must be set | e.g. `{"minLon": 7.1, "minLat": 32.88, "maxLon": 40.18, "maxLat": 84.73}` | 
| sketchLayerPolygons | name of the technical sketch layer for polygons | e.g "sketch_polygons" |
| sketchLayerLinestrings | name of the technical sketch layer for linestrings | e.g "sketch_linestrings" |
| sketchLayerPoints | name of the technical sketch layer for points | e.g "sketch_points" |
| streetSearch | configures the technical street search layer and feature property containing the street name (optional, street search deactivated if not set) | e.g. `{"layerName": "streets_layer", "property": "streetname"}` | 

<details>
  <summary>example project configuration file</summary>
  
  ```json
  [
    {
      "name": "My OGITO Project",
      "qgisProjectFilename": "myogitoqgisproject.qgs",
      "thumbnail": "https://example.com/thumbnail.png",
      "minZoom": 10,
      "maxZoom": 20,
      "initZoom": 15,
      "nameSessionGroup": "Sketch Layers",
      "hiddenLayers" : ["sketch_polygons", "sketch_points", "sketch_linestrings"],
      "backgroundLayers" : [{"title": "Topographic Map", "format": "image/jpeg"}],
      "centerWGS84": {"lat": 51.935, "lon": 7.6521},
      "extentWGS84": {
        "minLon": 7.1,
        "minLat": 32.88,
        "maxLon": 40.18,
        "maxLat": 84.73
      },
      "sketchLayerPolygons": "sketch_polygons",
      "sketchLayerLinestrings": "sketch_linestrings",
      "sketchLayerPoints": "sketch_points", 
      "streetsearch": {"layerName": "steets_layer", "property": "streetname"}
    },
    {
      "name": "Second OGITO Project",
      "qgisProjectFilename": "secondqgisproject.qgs",
      ...
    }
  ]
  ```

</details>

### Image Upload
The mapping of user observations supports the upload of user images. For this purpose the Image Upload Service must be deployed and configured. See [documentation for the image upload service](https://github.com/52North/OGITO/tree/ogito_global/tools/image_upload) and [application configuration](#app-configuration) parameters `imageUploadService` and `imageUploadFolder`.
### Street Search
To activate the street search in the OGITO app a layer with street data must be provided in the QGIS-project. This layer **must be published as WFS** in QGIS Server. 
The [Python script for extracting road data](https://github.com/52North/OGITO/tree/ogito_global/tools/street_names) from the OpenStreetMap database can be used to generate the road data. See the [documentation](https://github.com/52North/OGITO/tree/ogito_global/tools/street_names) of the street.  
Additionaly street search must be configured in the [project configuration](#project-Configuration-(setup-projects)). The `layerName` value is the name of the layer containing the street data in the QGIS project. The `property` value is the name of the field of the layer that contains the street names.
