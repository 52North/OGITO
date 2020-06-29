

export class AppConfiguration{
  static qGsServerUrl = 'http://localhost/qgis/qgis_mapserv.fcgi.exe?';
  static wmsVersion  = '1.3.0' ;
  static wfsVersion = '2.0';
  static wmtsVersion = '1.0.0';
  static qgsProject = 'qgs_projects/DenaiLama/mappingDenaiLama.qgs';  //mappingDenaiLama
  static srsName = 'EPSG:32647'   // tomarlo de aqui o del projecto?
  // la ruta para accederlo dentro de la app
  static curProject =   'http://localhost/' + AppConfiguration.qgsProject;  // to fecth the xml project file
  static svgFolder = '../../assets/svg/';
  static qgsProjectFolder = 'D:/PhD/code/fromScratch/myOgito/src/assets/';
  // la ruta para accederlo desde Qgs Server
  static QgsFileProject = AppConfiguration.qgsProjectFolder + AppConfiguration.qgsProject; // to use with tqhe qgis server
  static mapZoom = 12;
  static maxZoom = 20 ;
  static minZoom = 10 ;
  static threshold = 1000; // Distance in meter to close a polygon being drawn with a line.
}

