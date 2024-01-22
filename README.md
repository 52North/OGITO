# OGITO - Open Geospatial Interactive Tool

OGITO is a collaborative mapping an planning application. To support collaborative spatial planning tasks, OGITO is optimised for use on digital map tables. As it is a web application, OGITO can be opened on all devices in the web browser. Touch gestures or pointing devices (e.g. computer mouse) can be used to operate OGITO.

## Introduction

## Deployment
### Requirements
- Web Server (e.g Apache2 or NGINX) for serving the OGITO app
- QGIS Server
- POSTGIS (other Database supported by QGIS can be used as well)
- (NodeJS, only required for image upload)

### Development

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Configuration
### App Configuration
### Project Configuration (Setup Projects)
#### Image Upload
The dialogue for mapping user observations offers the option of uploading photos. To do this, there must be a service on the server that manages the upload of the images.  
[image_upload](https://github.com/52North/OGITO/tree/ogito_global/tools/image_upload) tool is a simple image upload service for this task using NodeJS. See the [ReadMe](https://github.com/52North/OGITO/blob/ogito_global/tools/image_upload/readme.md) for information regarding deployment and usage.
#### Street Search
