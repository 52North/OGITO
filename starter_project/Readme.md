# Deployment Hints
- The ogito starter project `ogito_starter.qgs` is setup to use a [pg service configuration](https://www.postgresql.org/docs/current/libpq-pgservice.html) which has a `ogito` server definition. Either add this service to your pg service configuration file or change the data source settings in the QGIS project.
  - after changing the data source make sure layers for reporting and sketch geometries are still publihsed as WFS (read, update, delete)

## Docker
The docker directory contains a docker compose file to start POSTGIS and QGIS Server for development - image upload service is currently missing.
The `ogito_starter_docker.qgs` stores database username and password in plaintext. Do not use it for production.  
Replace `src/assets/configuration/projects.json` by `project.json` from docker folder.
