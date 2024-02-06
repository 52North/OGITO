# OGITO - Open Geospatial Interactive Tool

OGITO is a collaborative mapping and planning application. To support collaborative spatial planning tasks, OGITO is optimised for use on digital map tables. As it is a web application, OGITO can be opened on all devices in the web browser. Touch gestures or pointing devices (e.g. computer mouse) can be used to operate OGITO.  
OGITO was originally developed by the [Faculty of Geo-Information Science and Earth Observation (ITC)](https://www.itc.nl/facilities/labs-and-resources/thedisc/) at the [University of Twente](https://www.utwente.nl/en/).


## Table of Content
- [OGITO - Open Geospatial Interactive Tool](#ogito---open-geospatial-interactive-tool)
  - [Table of Content](#table-of-content)
  - [Introduction](#introduction)
  - [Deployment](#deployment)
    - [Requirements](#requirements)
    - [Login](#login)
    - [Development Setup](#development-setup)
      - [Build](#build)
      - [Development server](#development-server)
      - [Docker](#docker)
    - [Configuration](#configuration)
      - [App Configuration](#app-configuration)
    - [Image Upload](#image-upload)
  - [Publish Project](#publish-project)
    - [Project Configuration](#project-configuration)
    - [Starter Project](#starter-project)
    - [QGIS Project Requirements](#qgis-project-requirements)
    - [Street Search](#street-search)
  - [Acknowledgements](#acknowledgements)

## Introduction

OGITO is a web application built with [Angular](https://angular.io) and [Openlayers](https://openlayers.org). 
The backend mainly consists of an instance of [QGIS Server](https://docs.qgis.org/3.28/en/docs/server_manual/index.html). QGIS Server publishes layers of a [QGIS Desktop](https://qgis.org/en/site/) project as OGC web services (Web Map Service (WMS) and Web Feature Service (WFS)). The OGITO frontend retrieves data from QGIS server. Layers that are added to QGIS project automatically appear in the OGITO application. The PostGIS database is used to store data for QGIS Server. This includes data that is mapped and saved in the OGITO application, as well as data for layers that are visualised in the OGITO application. Through QGIS server external web services (e.g. WMS and WFS) can be added to the OGITO application as well.  
<p align="center">
  <img src="https://github.com/52North/OGITO/blob/main/img/ogito_architecture.png?raw=true" alt="OGITO software achitecture"></br>
  Overview of OGITO's software architecture 
</p>

## Deployment
### Requirements
- Web Server (e.g Apache2 or NGINX) for serving the OGITO app and hosting QGIS Server
- QGIS Server (3.x)
- PostGIS (other Database supported by QGIS can be used as well)
- NodeJS (14.20.x, 16.13.x or 18.10.x), only required for image upload and developemnt
- (Python (3.x), only required to execute the [script to extract street data](#street-search))

### Login
By default OGITO allows anonymous login. This setting should not be used for production deployment. User is logged in as anonymous after clicking the Login button on the top right. 
Proper authentication can be activated in the [application settings](#app-configuration) For authentication OGITO currently uses [AUTH0](https://auth0.com/) (registration required - free tier only).
At Auth0, a _singe page web application_ must be created an configured according to the URL of the OGITO deployment (can be _http://localhost:4200/_ for development setup).
### Development Setup
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1. In order to build and run the project locally [Angular CLI must be installed](https://angular.io/guide/setup-local#install-the-angular-cli)
#### Build
(install dependencies `npm install --force`)
Run `ng build` to build the project. The build artifacts will be stored in the dist/ directory. Use the `--prod` flag for a production build.
#### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
#### Docker
The directory `starter_project/docker` contains a docker compose file to setup background services (POSTGIS and QGIS Server) for development.

### Configuration
OGITO has a global app configuration file for settings that affect the deployment or all projects and project configuration file with [settings for each project](#publish-project). Each project needs a entry in the project settings file.
#### App Configuration
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
| requireAuth | if `false` anonymous login is allowed, should be `true` for production deployment | default: `false` |
| auth.domain | authentication: domain of the [auth0](https://auth0.com/) application| e.g. "dev-abcabc123.us.auth0.com", only required if `requireAuth: true` | 
|auth.clientId| authentication: client id of the [auth0](https://auth0.com/) application| e.g. "abeadsadssaDJo12das", only required if `requireAuth: true`|

### Image Upload
The mapping of user observations supports the upload of user images. For this purpose the Image Upload Service must be deployed and configured. See [documentation for the image upload service](https://github.com/52North/OGITO/tree/main/tools/image_upload) and [application configuration](#app-configuration) parameters `imageUploadService` and `imageUploadFolder`.

## Publish Project
The content (layers) of an OGITO project are defined in a QGIS project that is pusblished by QGIS server. Use the starter QGIS project and the (POSTGIS) database backup to initialize a new project.
To make the new project available in the OGITO app a the .qgs QGIS project file must be published with QGIS server first. The new project must also be registered in the [project configuration](#project-coniguration).

### Project Configuration
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


### Starter Project
The directory `starter_project` contains a minmal QGIS project which meets the technical requirements of OGITO. The (Postgis) database dump can be used to setup all required database tables.

### QGIS Project Requirements
- the three separate layers for sketch geometries (points, polygons, linestrings) must be part of QGIS project (part of the QGIS start project)
  - each of these layer must be associated to database tables (contained in the starter database backup)
  - these layer must be published as WFS (read, delete and update must be activated)
  - these are technical layers and should be added to the `hiddenLayers` in the [project configuration](#project-configuration)
- reporting
  - reporting layer must be connected `user_observation` table (part of starter project database dump)
    - schema and user dialog is currently not changable
    - multiple reporting layers can be added to the project 
  - layer name can be changed but must not contain whitespace characters (group and layer)
    - all reporting layers must be published as WFS (read, update, delete) 
  - categories can be changed in QGIS (symbologie -> rule-based styling) 
    - example rule: `"category" = 'my category'`
    - icon must be simple svg marker
    - svg must be embeded 
    - parsing styles for reporting layers needs improvments, it is advised to use the preconfigured square markers and only adjust colors
- wms capabilities must be restricted to the map projection set in [application configuration](#app-configuration) (e.g. EPSG:3857)
  - QGIS: project -> properties -> qgis server -> wms capabilities -> crs restrictions 
- technical layer for [street search](street-search) should be added to the `hiddenLayers` in the [project configuration](#project-configuration)

### Street Search
To activate the street search in the OGITO app a layer with street data must be provided in the QGIS-project. This layer **must be published as WFS** in QGIS Server (read-only). 
The [Python script for extracting road data](https://github.com/52North/OGITO/tree/main/tools/street_names) from the OpenStreetMap database can be used to generate the road data. See the [documentation](https://github.com/52North/OGITO/tree/main/tools/street_names) of the street.  
Additionaly street search must be configured in the [project configuration](#project-configuration). The `layerName` value is the name of the layer containing the street data in the QGIS project. The `property` value is the name of the field of the layer that contains the street names.

## Acknowledgements
Our thanks goes to Rosa Aguilar Bolivar. She implemented the original OGITO application as part of her PhD thesis at the Faculty of Geo-Information Science and Earth Observation (ITC) of the University of Twente (NL).  
[Original publication on the concepts and work behind OGITO](https://doi.org/10.1016/j.compenvurbsys.2020.101591)

