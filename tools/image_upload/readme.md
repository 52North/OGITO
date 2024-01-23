# Ogito Image Upload Service
The image upload service is a simple upload service implementation. This tool handles the upload of user image that can be added when mapping user observations in the OGITO app.
The image upload service uses the [NodeJS](https://nodejs.org/en) JavaScript runtime environment.
## Requirements
- [NodeJS](https://nodejs.org/en) must be installed to deploy the service
## Deployment
The image upload service is deployed on the server alongside with OGTIO app.
- install dependencies: execute `npm install`
- start service:
  - (execute `node server.js`)
  - for production deployment the image upload service should be registered as a daemon process to make sure that the service is re-started after a server reboot. This can be achieved with [PM2](https://pm2.keymetrics.io/) (NodeJS) daemon process manager.
### Deployment Hints
For production deployment in most scenarios it is useful to configure a proxy to make the image upload service to make it available at the same location as the OGITO app.
An example proxy configuration for Apache2 web server looks like this:
```
<Location /upload>
  ProxyPass http://localhost:5000
  ProxyPassReverse http://localhost:5000
</Location>
```
## Configuration
The image upload service can be configured with environment varibles (or _.env_ file in the same folder as _server.js_).  

| variable  | description  |  default |
|---|---|---|
| PORT  | port used by the service to accept connections  |  5000 |
|  SIZELIMIT  | max. allowed image file size  | 5 * 1024 (5mb)  |
| DESTFOLDER | directory where images are store | "images/", directory must exist and must be writeable | ||
| CORS | [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) setting | "*"|
| EXTENSIONS | allowed file extensions | [".png", ".jpeg", ".jpg", ".gif", ".bmp"] |
|  FORMFIELD  |  name of the FormData field in the request body | "image"  |  

The image upload service must be restarted to when the configuration has changed.

## Service Enpoints
- `/images` (HTTP POST): accepts form data, must include form field with image data (as blob) (see configuration), response includes server file name
-  `/images/:filename`: (HTTP DELETE): delete image by server file name
-  `/ping` (HTTP GET): endpoint to check service availability (health check), returns message containing current (server) date and time
