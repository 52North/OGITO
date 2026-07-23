
export class AppConstants{
  static userImageFolder = '';
  static threshold = 1000; // Distance in meter to close a polygon being drawn with a line.
  static projDefs = {
    25832: '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    28992: '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.999908 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs'
  };

  // raster icon used as symbol for WMS layers
  static rasterIcon =  'data:image/png;base64,' + 'iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAXE' +
    'gAAFxIBZ5/SUgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAIJSURBVFiF7dfNSxVhFMfxz71zkd40X1KzrZgmQRQF/Qkt2oSLWvive' +
    'HkIyoyyPyhKsqjoDSK5ILbIlXsX6tUZp0UpNi+kBGkx39XwnPN75vfAM+fMoeI/obbzEIRjmMNAJqeNySB8yoqDcArP0ZcJbdTV7zQ1vxRouvEM3Zn' +
    'QeiSamDK1CI2d1YZGXyy+XnKAi8gZi0SDieRakSCVjiNnDOdwpUizbXsMi1AvMXLoVMYOypE1tnv5Y/EKHsp/LUlDY65InEiW8RidmVCcSl+WvPMrn' +
    'uBkZn0rlb7Zr/GKioq/zW4TnzV7fNXqPHozOXFdfbKp+T4rnjHTuW79BU5nQlt19dtNzc9ZzbTpnrb2nHyJ2cREEFrsqWNr1npxtcj9tu0LyBnbtDmA' +
    'y0WaVDqGnLG29hAuFWlqaiNocYQrf2XsoOzLWE0tPejGqfSPNNkmfh9nMvlbkeh50UajRr+1tIoa/ybmizRDhpZWrDxCVybUxut9naCiouIQ2DuJn8B' +
    'HDGZy2rgVhLdZcRC68EG+xGzgZsn03ot38j8La7gRhAV+ncR7YvFYyQHOI2csEvUnkpEiwc+GnDOGsxguWO+pqQ1jgX+9JR0GR99YLC5tumVNPJGUas' +
    'qaeCTal2b38gdhJQh3/bice9lIpU+LNho3vtzSuof+TGi9Q0fZ9L6EB4q/yldlpit+x3fslpvzPO+TtwAAAABJRU5ErkJggg==';

  // Embedded default SVG for Sketch layers
  static svgMarkerColor = 'data:image/svg+xml;base64,' + 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgaGVpZ2h0PSIyNHB4IgogIC' +
    'B2aWV3Qm94PSIwIDAgMjQgMjQiCiAgIHdpZHRoPSIyNHB4IgogICBmaWxsPSIjMDAwMDAwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmc2IgogICBzb2RpcG9ka' +
    'Tpkb2NuYW1lPSJ3aGVyZV90b192b3RlX2JsYWNrXzI0ZHAuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjEgKGM2OGUyMmMzODcsIDIwMjEtMDUtMjMpIgogICB4' +
    'bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5' +
    'zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d' +
    '3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMxMCIgLz4KCiAgPHBhdGgKICAgICBkPSJNMCAwaDI0djI0SDBWMHoiCiAgICAgZmlsbD0ibm9' +
    'uZSIKICAgICBpZD0icGF0aDIiIC8+CiAgPHBhdGgKICAgICBkPSJNIDEyLDEgQyA3LjU5LDEgNCw0LjU5IDQsOSBjIDAsNS41NyA2Ljk2LDEzLjM0IDcuMjYsMTMuNjc' +
    'gTCAxMiwyMy40OSAxMi43NCwyMi42NyBDIDEzLjA0LDIyLjM0IDIwLDE0LjU3IDIwLDkgMjAsNC41OSAxNi40MSwxIDEyLDEgWiBtIDAsMTkuNDcgQyA5LjgyLDE3Ljg' +
    '2IDYsMTIuNTQgNiw5IDYsNS42OSA4LjY5LDMgMTIsMyBjIDMuMzEsMCA2LDIuNjkgNiw2IDAsMy44MyAtNC4yNSw5LjM2IC02LDExLjQ3IHoiCiAgICAgaWQ9InBhdG' +
    'g0IgogICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0ic3NjY2Nzc2Nzc3NjIgogICAgIHN0eWxlPSJmaWxsOiNkZDFjNzc7ZmlsbC1vcGFjaXR5OjEiIC8+Cjwvc3ZnPgo=';


  static svgFallbackIcon = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+CiAgPHRleHQgeD0iNTAiIHk9IjgwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iOTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9ImJsYWNrIj4/PC90ZXh0Pgo8L3N2Zz4=";

  // Values for range in slider in dynamic form
  static slider_range = { min: 0, max: 10};


  static ratingMax = 5;
  static ratingMin = 1;


  static ratingMeasureRankAttributesPostFix = "_rank";

  static wfs_feature_prefix = "qgs";
  static wfs_feature_namespace = "http://www.qgis.org/gml";

  static sketchStyleAttr = "style"
  static customSketchStyleAttr = "category";
  static wfsLAyerStyleAttr = "category";
}


