# OGITO - Open Geospatial Interactive Tool

OGITO is a collaborative mapping an planning application. To support collaborative spatial planning tasks, OGITO is optimised for use on digital map tables. As it is a web application, OGITO can be opened on all devices in the web browser. Touch gestures or pointing devices (e.g. computer mouse) can be used to operate OGITO.

## Table of Content
- [OGITO - Open Geospatial Interactive Tool](#ogito---open-geospatial-interactive-tool)
  - [Table of Content](#table-of-content)
  - [Introduction](#introduction)
  - [Deployment](#deployment)
    - [Requirements](#requirements)
    - [Authentication](#authentication)
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

## Introduction

## Deployment
### Requirements
- Web Server (e.g Apache2 or NGINX) for serving the OGITO app and hosting QGIS Server
- QGIS Server
- POSTGIS (other Database supported by QGIS can be used as well)
- NodeJS, only required for image upload and developemnt
- (Python, only required to execute the [script to extract street data](#street-search))

### Authentication
The OGITO app requires authentication. For authentication OGITO currently uses [AUTH0](https://auth0.com/) (registration required - free tier only).
At Auth0, a _singe page web application_ must be created an configured according to the URL of the OGITO deployment (can be _http://localhost:4200/_ for development setup).
Domain and client id must be provided in the [application configuration](#app-configuration).

### Development Setup
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1. In order to build and run the project locally [Angular CLI must be installed](https://angular.io/guide/setup-local#install-the-angular-cli)
#### Build
Run `ng build` to build the project. The build artifacts will be stored in the dist/ directory. Use the `--prod` flag for a production build.
#### Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.
In order to access projects in OGTIO [authentication](#authentication) must be configured for the development setup as well
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
| auth.domain | authentication: domain of the [auth0](https://auth0.com/) application| e.g. "dev-abcabc123.us.auth0.com" | 
|auth.clientId| authentication: client id of the [auth0](https://auth0.com/) application| e.g. "abeadsadssaDJo12das"|

### Image Upload
The mapping of user observations supports the upload of user images. For this purpose the Image Upload Service must be deployed and configured. See [documentation for the image upload service](https://github.com/52North/OGITO/tree/ogito_global/tools/image_upload) and [application configuration](#app-configuration) parameters `imageUploadService` and `imageUploadFolder`.

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
  - db table
  - wfs  
  - styles and categories
- only projection of map
- technical layer for [street search](street-search) should be added to the `hiddenLayers` in the [project configuration](#project-configuration)

### Street Search
To activate the street search in the OGITO app a layer with street data must be provided in the QGIS-project. This layer **must be published as WFS** in QGIS Server (read-only). 
The [Python script for extracting road data](https://github.com/52North/OGITO/tree/ogito_global/tools/street_names) from the OpenStreetMap database can be used to generate the road data. See the [documentation](https://github.com/52North/OGITO/tree/ogito_global/tools/street_names) of the street.  
Additionaly street search must be configured in the [project configuration](#project-configuration). The `layerName` value is the name of the layer containing the street data in the QGIS project. The `property` value is the name of the field of the layer that contains the street names.
