import * as t from 'io-ts';

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
  sketchLayerPolygons: string,
  sketchLayerLinestrings: string,
  sketchLayerPoints: string
  rateMeasureLayers: string[]
  labels?: Object
}


export interface BackgroundLayer{
  title: string,
  format: "image/jpeg" | "image/png"
}



//codecs based on the interfaces
//used for checking project configuration
// must be updated when ProjectConfiguration definition is updated!
export const ExtentWGS84Codec = t.type({
  minLat: t.number,
  minLon: t.number,
  maxLat: t.number,
  maxLon: t.number
});

export const CenterWGS84Codec = t.type({
  lat: t.number,
  lon: t.number
});

export const BackgroundLayerCodec = t.type({
  title: t.string,
  format: t.string
});

export const StreetSearchCodec = t.type({
  layerName: t.string,
  property: t.string
});

export const ProjectConfigurationCodec = t.type({
  name: t.string,
  qgisProjectFilename: t.string,
  thumbnail: t.union([t.string, t.undefined]),
  minZoom: t.number,
  maxZoom: t.number,
  initZoom: t.number,
  extentWGS84: t.union([ExtentWGS84Codec, t.undefined]),
  centerWGS84: CenterWGS84Codec,
  nameSessionGroup: t.string,
  hiddenLayers : t.array(t.string),
  backgroundLayers : t.array(BackgroundLayerCodec),
  streetSearch: t.union([StreetSearchCodec, t.undefined]),
  sketchLayerPolygons: t.string,
  sketchLayerLinestrings: t.string,
  sketchLayerPoints: t.string,
  rateMeasureLayers: t.union([t.array(t.string), t.undefined]),
  label: t.union([t.UnknownRecord, t.undefined])
});

