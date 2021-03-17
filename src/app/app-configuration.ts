

export class AppConfiguration{
  // static qGsServerUrl = 'http://localhost/qgis/qgis_mapserv.fcgi.exe?';
  // static hostname =  'http://localhost/';
  static hostname = 'https://ogito.itc.utwente.nl/';
  static qGsServerUrl = 'https://ogito.itc.utwente.nl/cgi-bin/qgis_mapserv.fcgi?';
  static wmsVersion  = '1.3.0' ;
  static wfsVersion = '1.1.0';
  static wmtsVersion = '1.0.0';
  static qgsProject = 'checking.qgs';  // shapefiles
  //static srsName = 'EPSG:32647'   // tomarlo de aqui o del projecto?
  static srsName = 'EPSG:25832';
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
  static projDefs = {
    '25832':'+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
  }
  static rasterIcon =  'data:image/png;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAXE' +
    'gAAFxIBZ5/SUgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIJSURBVFiF7dfNSxVhFMfxz71zkd40X1KzrZgmQRQF/Qkt2oSLWvive' +
    'HkIyoyyPyhKsqjoDSK5ILbIlXsX6tUZp0UpNi+kBGkx39XwnPN75vfAM+fMoeI/obbzEIRjmMNAJqeNySB8yoqDcArP0ZcJbdTV7zQ1vxRouvEM3Zn' +
    'QeiSamDK1CI2d1YZGXyy+XnKAi8gZi0SDieRakSCVjiNnDOdwpUizbXsMi1AvMXLoVMYOypE1tnv5Y/EKHsp/LUlDY65InEiW8RidmVCcSl+WvPMrn' +
    'uBkZn0rlb7Zr/GKioq/zW4TnzV7fNXqPHozOXFdfbKp+T4rnjHTuW79BU5nQlt19dtNzc9ZzbTpnrb2nHyJ2cREEFrsqWNr1npxtcj9tu0LyBnbtDmA' +
    'y0WaVDqGnLG29hAuFWlqaiNocYQrf2XsoOzLWE0tPejGqfSPNNkmfh9nMvlbkeh50UajRr+1tIoa/ybmizRDhpZWrDxCVybUxut9naCiouIQ2DuJn8B' +
    'HDGZy2rgVhLdZcRC68EG+xGzgZsn03ot38j8La7gRhAV+ncR7YvFYyQHOI2csEvUnkpEiwc+GnDOGsxguWO+pqQ1jgX+9JR0GR99YLC5tumVNPJGUas' +
    'qaeCTal2b38gdhJQh3/bice9lIpU+LNho3vtzSuof+TGi9Q0fZ9L6EB4q/yldlpit+x3fslpvzPO+TtwAAAABJRU5ErkJggg==';

  // Values for range in slider
  static range = { min: 1, max: 10};
  static ranges = {
     'intensity_auto': {min: 1, max: 10},
     'intensity_schiene': {min: 1, max: 10},
     'intensity_kinder': {min: 1, max: 10},
     'intensity_sonstiges': {min: 1, max: 10},
     'intensity_arbeit': {min: 1, max: 10},
     'intensity_bus': {min: 1, max: 10},
  }



}
