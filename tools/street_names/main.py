import requests
import json
import geojson
import geopandas as gpd
from shapely.geometry.linestring import LineString
from shapely.geometry.multilinestring import MultiLineString



def get_OSMids(city):
    req_body=f"""[out:json][timeout:25];
    (
    area
    [name="{city}"];
    way(area)["highway"][name];
    );
    out body;
    >;
    out skel qt;
    """
    url="https://overpass-api.de/api/interpreter"
    print("getting ids")
    req=requests.post(url, req_body)
    print("getting ids - done")

    obj=json.loads(req.text)
    lookup = ["residential", "living_street", "secondary", "unclassified", "tertiary", "footway", "service", "motorway",
              "pedestrian", "path", "primary", "track", "construction", "steps", "tertiary_link", "secondary_link",
              "cycleway", "rest_area"]
    print("filter ids")
    ###check if tags and highway exist filter by lookup
    osm_ids=[]
    for e in obj['elements']:
        if 'tags' in e:
            if 'highway' in e['tags']:
                if e['tags']['highway'] in lookup:
                    #print(e['id'], e['tags']['highway'])
                    osm_ids.append(e['id'])
    print("filter ids - done")
    return osm_ids


def get_geometries(osm_ids, admin_id, outfile):
    ##get streets linestrings
    ls=[]
    print("getting geometries - this may take a while")
    for i, id in enumerate(osm_ids):
        req = requests.get(f"https://nominatim.openstreetmap.org/details.php?osmtype=W&osmid={id}&polygon_geojson=1&format=json")
        obj = json.loads(req.text)

        print(f"{i}/{len(osm_ids)} {round(100.0 * i / len(osm_ids), 1)}%", end="\r")
        ls.append(dict(name=obj['localname'], geometry=obj['geometry']))

    print("getting geometries - this took a while :)")

    ##create streets featurecollection
    print("create FC")
    features=[]
    for item in ls:
        geom_type = item["geometry"]["type"].lower()
        coords = item['geometry']['coordinates']
        if geom_type == "multilinestring":
          coords = coords #already MultiLineString, do nothing
        elif geom_type == "linestring":
          coords = [coords] #promote to MultiLineString
        else:
          print("skip item")
          continue #skip other geometry types


        geometry=geojson.MultiLineString(coords)
        feature=geojson.Feature(geometry=geometry, properties={"name": item['name']})
        features.append(feature)


    feature_collection=geojson.FeatureCollection(features)
    geojson_str=feature_collection.__geo_interface__

    ##get admisitrative boundaries
    print("get borders to clip")
    req=requests.get(f"https://nominatim.openstreetmap.org/details.php?osmtype=R&osmid={admin_id}&polygon_geojson=1&format=json")
    admin_geom = json.loads(req.text)['geometry']
    admin_geomtype = admin_geom["type"].lower()
    if admin_geomtype == "polygon":
      geometry=geojson.Polygon(admin_geom['coordinates'])
    elif admin_geomtype == "multipolygon":
      geometry=geojson.MultiPolygon(admin_geom['coordinates'])
    else:
      raise Exception("invalid geometry type for admin boundary: " + admin_geomtype + ", expected polygon or multipolygon")

    feature=geojson.Feature(geometry=geometry, properties={"name": json.loads(req.text)['localname']})
    admin_clip=feature.__geo_interface__

    ##clip streets by admin bound
    street_data=gpd.read_file(json.dumps(geojson_str))
    clip_data=gpd.read_file(json.dumps(admin_clip))
    clip=gpd.clip(street_data, clip_data)

    ##dissolve by streetnames
    print("dissolve street names")
    diss=clip.dissolve(by='name')

    #promote linestrings to multilinestrings
    diss["geometry"] = [MultiLineString([feature]) if isinstance(feature, LineString) else feature for feature in diss["geometry"]]

    #save result as geojson
    diss.to_file(f"/usr/src/app/{outfile}.geojson")

    print("everything done!")


def OGITO_streetnames(city, admin_id, outfile):
    get_geometries(get_OSMids(city), admin_id, outfile)


###
# GOTO https://www.openstreetmap.org/
# enter cityname and select the right one
# copy number and use below
#
OGITO_streetnames("Münster", 62591, "muenster_streets")















