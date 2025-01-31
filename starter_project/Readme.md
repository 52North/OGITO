# Deployment Hints
- The ogito starter project `ogito_starter.qgs` is setup to use a [pg service configuration](https://www.postgresql.org/docs/current/libpq-pgservice.html) which has a `ogito` server definition. Either add this service to your pg service configuration file or change the data source settings in the QGIS project.
  - after changing the data source make sure layers for reporting and sketch geometries are still publihsed as WFS (read, update, delete)
  - the database backup `ogito_starter_db.sql` contains the data that is used in the starter project. Therefore it is required to restore the database to run the starter project properly.

## Docker
The docker directory contains a docker compose file to start backend components (POSTGIS and QGIS Server) for development - image upload service is currently missing.
This docker setup deploys the ogito starter project and the corresponding database backup. The `pg_service.conf` file is setup to work with the docker setup. The default project and app configuration in `.\src\assets\configuration\` can be also be used togehter with the docker setup.  
The easiest way to set up OGITO for development is to start the backend services with `docker-compose up` and run the OGITO app with `ng serve`.
