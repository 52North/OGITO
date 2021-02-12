

export class AppConfiguration{
  // static qGsServerUrl = 'http://localhost/qgis/qgis_mapserv.fcgi.exe?';
  // static hostname =  'http://localhost/';
  static hostname = 'https://ogito.itc.utwente.nl/';
  static qGsServerUrl = 'https://ogito.itc.utwente.nl/cgi-bin/qgis_mapserv.fcgi?';
  static wmsVersion  = '1.3.0' ;
  static wfsVersion = '1.1.0';
  static wmtsVersion = '1.0.0';
  //static qgsProject = 'qgs_projects/DenaiLama/mappingDenaiLama.qgs';
  // static qgsProject = 'retwente/retwente.qgs';
  static qgsProject = 'energyLosser/losser.qgs';  // shapefiles
  //static srsName = 'EPSG:32647'   // tomarlo de aqui o del projecto?
  static srsName = 'EPSG:28992';
  // la ruta para accederlo dentro de la app
  static curProject =  AppConfiguration.hostname + 'qgs_projects/' + AppConfiguration.qgsProject;  // to fecth the xml project file
  static svgFolder = '../../assets/svg/';
  static svgUrl =  AppConfiguration.hostname + 'svg/';
  static qgsProjectFolder =  '/home/qgis/projects/'//'D:/PhD/code/fromScratch/';  // 'D:/PhD/code/fromScratch/myOgito/src/assets/';
  // la ruta para accederlo desde Qgs Server
  static QgsFileProject = AppConfiguration.qgsProjectFolder + AppConfiguration.qgsProject; // to use with the qgis server
  static mapZoom = 12;
  static maxZoom = 20 ;
  static minZoom = 8 ;
  static threshold = 1000; // Distance in meter to close a polygon being drawn with a line.
}

