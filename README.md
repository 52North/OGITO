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
- Web Server with FastCGI runtime (e.g Apache2 or NGINX) for hosting QGIS Server and serving the OGITO app
- QGIS Server (3.x)
- PostGIS (other Database supported by QGIS can be used as well)
- NodeJS (14.20.x, 16.13.x or 18.10.x), only required for image upload and development
- (Python (3.x), only required to execute the [script to extract street data](#street-search))

### Login
By default OGITO allows anonymous login. This setting should not be used for production deployment. User is logged in as anonymous after clicking the Login button on the top right. 
Proper authentication can be activated in the [application settings](#app-configuration) For authentication OGITO currently uses [AUTH0](https://auth0.com/) (registration required - free tier only).
At Auth0, a _singe page web application_ must be created an configured according to the URL of the OGITO deployment (can be _http://localhost:4200/_ for development setup).
### Development Setup
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.1. In order to build and run the project locally [Angular CLI must be installed](https://angular.io/guide/setup-local#install-the-angular-cli)
#### Build
(install dependencies `npm install`)
Run `ng build` (or `ng build --configuration production`) to build the project. The build artifacts will be stored in the dist/ directory.
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
| thumbnail | url of thumbnail image shown in the project selection | e.g "www.example.com/thumbnail.png", optional|
| minZoom |min. zoom level| e.g. 10|
| maxZoom | max. zoom level | e.g. 20 |
| initZoom | initial zoom level | e.g. 15 |
| nameSessionGroup | group name for sketch layers in layer panel | e.g. "Sketch Layers" |
| hiddenLayers | published WMS layers that should no be visible (in the layer panel) | typically technical layers for sketch geometries and street search, e.g. `["sketch_polygons", "sketch_points", "sketch_linestrings", "streets_layer"]`|
|backgroundLayers| list of background (WMS) layers, background layers are loaded splitted into multiple tiles instead of a single images (might create issues wiht lables on the layer)| e.g. `[{"title": "Topographic Map", "format": "image/jpeg"}, {"title": "Other Basemap", "format": "image/png"}]` |
| centerWGS84 | inital view center in geographic coordinates (WGS84) (optional, eiher this or `extentWGS84` must be set| e.g `{"lat": 51.935, "lon": 7.6521}`, if not set center point of the configured extent is used|
| extentWGS84 | constraints the visible extent (geographic coordinates (WGS84) of the map (optional, either this or `centerWGS84` must be set | e.g. `{"minLon": 7.1, "minLat": 32.88, "maxLon": 40.18, "maxLat": 84.73}` | 
| sketchLayerPolygons | name of the technical polygon layer to store polygon features for all simple sketch layers | e.g. "sketch_polygons" |
| sketchLayerLinestrings | name of the technical linestring layer to store linestring features for all simple sketch layers | e.g. "sketch_linestrings" |
| sketchLayerPoints | name of the technical point layer to store point features for all simple sketch layers | e.g. "sketch_points" |
| customSketchLayerPoints | name of the technical point layer to store point features for all custom sketch layers | e.g. "sketch_custom_points", **Warning** This property is currently optional but will become mandatory in the future | 
| customSketchLayerDefinitionsFiles | list of files (paths) that contain custom sketch layer definitions, see [Custom Sketch Layers](#custom-sketch-layers) | `["./assets/configuration/customlayer_1.json", "./assets/configuration/customlayer_2.json" ]`, optional |
| labels | look up table to override property names in dialogs (e.g. feature info) per layer, unlike layer properties in the QGIS project file the overrides can contain special or whitespace characters | e.g. `{"MyLayer":{ "propertyOne": "Property 1!"}}`, optional |
| rateMeasureLayers | list of layers with ranked properties (measures); ranked properties can receive a (single) rating (1-5) for each feature; for _rateMeasureLayers_ there is a additional _Rate Measures_ button in the editing toolbar; also see [requirements](#qgis-project-requirements) for setting up rating layers  | e.g. `["rankingLayerA", "RankingLayerB"]` |
| streetSearch | configures the technical street search layer and feature property containing the street name (optional, street search deactivated if not set) | e.g. `{"layerName": "streets_layer", "property": "streetname"}`, optional, **Deprecated**: Street Search is considered deprecated and might be removed in the future, consider using the `geocoder` option instead | 
| geocoder | configures geocoding background services, (optional, geocoding component is deactivated if not configured) | e.g. `{"baseUrl": "http://localhost:8080/geocode", "limit": 10, autoComplete": true}`, optional, ([see](#geocoder))| 
|defaultVisibleLayers | list of layers that are visible by default when app is started | e.g `["Topographic Map (OSM)", "My Custom Layer"]` , optional |
|ratingLayerLimits | overrides min and max values for rating sliders for a specific rating layer | e.g `"[{"layerName": "Rating", "min": 1, "max": 15}]`, optional, **Experimental**: this option is experimental and might be changed or removed in the future,  |
|defaultBackgroundLayer | if `defaultBackgroundLayer: true` a OSM background layer is automatically added to the map; the map tiles are directly retrieved from OSM and not proxied via QGIS server | optional, **Experimental**: this option is experimental and might be changed or removed in the future |




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
      "customSketchLayerPoints": "sketch_custom_points",
      "geocoder": {
        "baseUrl": "http://localhost:8080/geocode",
        "limit": 10,
        "autoComplete": true
      },
      "rateMeasureLayers": ["Rating"],
      "labels": {"Rating":{"rankingA": "Ranking A", "rankingB": "Ranking B", "description": "Text"}},
      "customSketchLayerDefinitionsFiles": ["./assets/configuration/mycustomlayer.json"],
      "defaultVisibleLayers": ["Topographic Map (OSM)"],
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
- the three separate layers for sketch geometries (points, polygons, linestrings) must be part of QGIS project (part of the QGIS starter project)
  - each of these layer must be associated to database tables (contained in the starter database backup)
  - these layer must be published as WFS (read, delete and update must be activated)
  - these are technical layers and should be added to the `hiddenLayers` in the [project configuration](#project-configuration)
- a seperate point layer for custom sketch layer geometries must be part of the QGIS project (part of the QGIS starter project)
  - thes layer must be associated to a database table (contained in the starter database backup)
  - the layer must be published as WFS (read, delete and update must be activated)
  - his is a technical layer and should be added to the `hiddenLayers` in the [project configuration](#project-configuration)
- reporting layers & rating layers
  - reporting layer must be connected to `user_observation` table (part of starter project database dump)
    - schema and user dialog is currently not changable
    - multiple reporting layers can be added to the project 
  - for each ranked property in a rating layer there must be a boolean property to indicate a ranked property and corresponding integer property for the actual rating according to this scheme: `rankedPropertyA` (boolean), `rankedPropertyA_rank` (integer)
    - rating layers might have additional unranked properties 
    - example is part of the starter project (database dumb)
  - layer name can be changed but must not contain special characters or whitespace characters (group and layer)
    - all reporting layers must be published as WFS (read, update, delete) 
  - layer properties must not contain special characters or whitespace characters
    - configure labels in the [project configuration](#project-configuration) instead 
  - categories can be changed in QGIS (symbologie -> rule-based styling) 
    - example rule: `"category" = 'my category'`
    - icon must be simple svg marker
    - svg must be embeded 
    - parsing styles for reporting layers needs improvments, it is advised to use the preconfigured square markers and only adjust colors
- wms capabilities must be restricted to the map projection set in [application configuration](#app-configuration) (e.g. EPSG:3857)
  - QGIS: project -> properties -> qgis server -> wms capabilities -> crs restrictions 
- technical layer for [street search](street-search) should be added to the `hiddenLayers` in the [project configuration](#project-configuration)


### How to add Layers to a Project?

This section only covers static (non-editable) layers - see [(Custom) editable layers](#custom-editable-layers).

Each layer that is added to the corresponding QGIS project and published via QGIS Server will be visible in the OGITO application. The layer styling that is defined in QGIS is reflected in OGITO. Layer groups that are defined in QGIS are reflected in OGITO as well. Every layer type that is supported by QGIS can be displayed in OGITO as long as the following requirements are met:

- the layer must be published as WMS in QGIS in the QGIS server settings (_Project -> Properties -> QGIS Server_)
- if data is store in a database (e.g. PostGIS) the configured database connection must be valid for the server where the OGITO application is deployed
- (if custom legend should displayed in the layer panel the legend URL can be configured in the layer settings in QGIS (_right click layer in Layers tree -> Properties -> QGIS Server -> Legend URL_))

The [starter project](#starter-project) contains examples for layers that use external services (WMS) and data from a (PostGIS) database.

### Geocoder
The OGITO application features a geocoding component for address search on the map. The geocoding components requires a backend service that needs to deployed seperately. This repository ([`./tools/geopy_geocoder`](./tools/geopy_geocoder/README.md)) contains a reference implementation for the geocoding backend that can be used in a FastCGI runtime (like Apache HTTP server with fcgi mod enabled). The reference implementation is a wrapper for external geocoding services like Photon, Nominatiom or Google Maps.  
The geocoding backend must be configured for each project in the [project configuration (`geocoder`)](#project-configuration). If no configuration is provided the geocoding component is not available in the OGITO application for the specific project.

### Street Search
**Deprecated**: Street Search is deprecated and is not developed any further, consider using the integration for [external geocding providers  instead](#geocoder).  
To activate the street search in the OGITO app a layer with street data must be provided in the QGIS-project. This layer **must be published as WFS** in QGIS Server (read-only). 
The [Python script for extracting road data](https://github.com/52North/OGITO/tree/main/tools/street_names) from the OpenStreetMap database can be used to generate the road data. See the [documentation](https://github.com/52North/OGITO/tree/main/tools/street_names) of the street.  
Additionaly street search must be configured in the [project configuration](#project-configuration). The `layerName` value is the name of the layer containing the street data in the QGIS project. The `property` value is the name of the field of the layer that contains the street names.

### (Custom) Editable Layers

OGITO features different types of editable layers with different degrees of customization, support for geometry types and styling options

#### Sketch Layers

Sketch layers are the simplelest type of editable layers in OGITO. Sketch Layers are simple layers that can be added dynamically to the map (from toolbar). Sketch layers have limited, predefined symbology and a single text input field. Sketch Layers support Point, Linestring and Polygon geometries. Sketch layers are persisted and restored when at least one feature is created and saved(!) to the layer.  
Symbology and fields are not customizable for sketch layers.

#### Custom Sketch Layers

Custom Sketch Layers are editable layers that can by configured in a json template. Custom Sketch Layer have a customizable symbology and form field (properties) that are define in the json tempate file.
Currently, Custom Sketch Layers are limited to Point geometries.

##### Templates

A example for a Custom Sketch Layer definition is provided in [`./src/assets/configuration/customlayer_poi.json`](./src/assets//configuration/customlayer_poi.json).

###### Configuration Properties

**Root Properties**  
| Property | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `layername` | String | Yes | The display name of the map layer. | `"Point of Interest"` |
| `groupname` | String | Yes | Grouping identifier used to organize layers in the layer panel. | `"Point of Interest Ratings"` |
| `header` | String | No | The title text displayed above the category selection menu in the UI. | `"Select a Category"` |
| `labelField` | String | No | Identifies which field id's value should be used as the map feature label. | `"name"` |
| `iconHeightPxl` | Number | No | The uniform height adjustment (in pixels) for rendering category icons on the map. | `38` |
| `categories` | Array | Yes | List of objects defining classification types and symbology for this layer. | *(See Category Table)* |
| `fields` | Array | Yes | List of form field objects defining the attribute schema. | *(See Field Table)* |

**Category Properties**
| Property | Type | Description |
| :--- | :--- | :--- |
| `id` | String | Unique ID used to identify the category internally. |
| `label` | String | The human-readable name displayed in the UI. |
| `icon` | String | The image source reference. Supports relative paths (`/assets/...`), external URLs (`https://...`), or Base64 encoded images (e.g SVGs) (`data:image/svg+xml;base64,...`). |

**Field Properties**   
Every object within the `fields` array creates a dynamic input component in the feature creation/edit form.
| Property | Type | Applicable To | Description |
| :--- | :--- | :--- | :--- |
| `id` | String | All Fields | Unique identifier for the field. |
| `label` | String | All Fields | Text label displayed in the UI. |
| `type` | String | All Fields | Defines the UI input element type (e.g., `text`, `number`). |
| `required` | Boolean | All Fields | If set to `true`, the form cannot be submitted without validating this field. |
| `readonly` | Boolean | All Fields | If `true`, the field value is displayed but cannot be modified by the user. |
| `default` | Variable | All Fields| The initial pre-populated value when a new feature is created. |
| `placeholder`| String | `text`, `textarea` | Faded hint text shown inside the input when it is empty. |
| `minLength` | Number | `text`, `textarea` | Enforces a minimum character length constraint. |
| `maxLength` | Number | `text`, `textarea` | Enforces a maximum character length limit. |
| `rows` | Number | `textarea` | Specifies the native vertical height (in text rows) of a text area. |
| `min` | Number | `number` | The minimum allowable numeric value. |
| `max` | Number | `number` | The maximum allowable numeric value. |
| `options` | Array | `select` | A list of string options for a dropdown list menu. |
| `showInFeatureInfo` | Boolean | All Fields | Determines if this attribute should be visible in the feature's information popup on the map. Default is true. |

**Supported Field Types**
The templates (and technial layers) must be configured in the [project configuration](#project-configuration) for each project specically.
| Field Type | UI Component | Supported Schema Attributes | Best Use Case |
| :--- | :--- | :--- | :--- |
| **`text`** | Single-line input box | `id`, `label`, `placeholder`, `required`, `minLength` | Short string entries like names, addresses, or titles. |
| **`textarea`** | Multi-line text block | `id`, `label`, `placeholder`, `readonly`, `maxLength`, `rows` | Long-form notes, descriptions, or user feedback summaries. |
| **`number`** | Numeric input | `id`, `label`, `default`, `min`, `max`, `readonly`, `required` | Quantifiable metrics such as scores, rankings, capacities, or counts. |
| **`select`** | Dropdown selection list | `id`, `label`, `options`, `readonly`, `required` | Standardized parameters where the user must choose from a predefined list of values. |
| **`date`** | Native calendar picker | `id`, `label`, `readonly`, `required` | Selection of a Date in Calender input. |
| **`datetime`** | Native calendar + time picker | `id`, `label`, `readonly`, `required` | Same as `date` but with additional time selection. |
| **`checkbox`** | Binary toggle switch | `id`, `label`, `default`, `required`, `showInFeatureInfo` | Simple yes/no flags |

#### Rating Layers

Rating Layers allow to add new (Point) features to the map. Each of these feature has a number of predefined measures that can be rated by the users (from Editing Toolbar).  
Rating layers are configured in the corresponding QGIS project and must be indicated in the [project configuration](#project-configuration). The measures depend on the layer properties in QGIS. The symbology is also defined in QGIS - must be "single symbol" symbology. Rating layers must be published as WFS (read, delete & uptate) in the QGIS Server settings.  

The [starter project](#starter-project) contains an example for a Rating Layer.

#### Reporting Layer

The Reporting Layer is a predefined editable layer. It has a number of (predefined) fields including complex fields (e.g. for [image upload](#image-upload)). The Reporting layer is defined in the corresponding QGIS project. The categories and their symbology is defined via the symbology settings in QGIS. The symbology is "rule base" by the "category" field. The categories and the corresponding symbol can be edited in QGIS. The Reporting layer is limited to Point geometries and its definition (fields) are fixed. Only categories and symbols can be customized.  The Reporting layer must be published as WFS (read, delete & uptate) in the QGIS Server settings.  

The [starter project](#starter-project) contains an example for a Reporting Layer.

#### Dynamic Layers

**Deprecated**: Dynamic Layers are deprecated and this feature might be removed once [custom sketch layers](#custom-sketch-layers) have support for all geometry types.

Dynamic Layers are editable, customizable (Point, Linestring or Polygon) layers. Dynamic layers are defined in the corresponding QGIS project. The fields and input types are defined by the layer properties. Only simple text, date or number inputs are supported. Default values or drowdown menus with predefined options are not supported. Custom symbology is also not supported. Rating layers must be published as WFS (read, delete & uptate) in the QGIS Server settings.
 

## Acknowledgements
Our thanks goes to Rosa Aguilar Bolivar. She implemented the original OGITO application as part of her PhD thesis at the Faculty of Geo-Information Science and Earth Observation (ITC) of the University of Twente (NL).  
[Original publication on the concepts and work behind OGITO](https://doi.org/10.1016/j.compenvurbsys.2020.101591)

