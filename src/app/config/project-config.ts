export interface ProjectConfiguration{
  name: string,
  qgisProjectFilename: string, //qgs filename only
  thumbnail?: string,
  minZoom: number,
  maxZoom: number,
  initZoom: number,
  extentWGS84?: {
    minLat: number,
    minLon: number,
    maxLat: number,
    maxLon: number
  },
  centerWGS84?: {
    lat: number,
    lon: number,
  }
  nameSessionGroup: string,
  hiddenLayers : string[],
  backgroundLayers : BackgroundLayer[]
  streetSearch?: {
    layerName : string,
    property: string
  };
}


export interface BackgroundLayer{
  title: string,
  format: "image/jpeg" | "image/png"
}
