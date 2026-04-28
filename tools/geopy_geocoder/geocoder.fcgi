#!/var/www/scripts/venv/bin/python3
# must point to the Python interpreter in your virtual environment with geopy and flipflop installed

from collections import deque
from flipflop import WSGIServer
from geopy.geocoders import Photon, GoogleV3, Nominatim
from geopy.point import Point
from geopy.extra.rate_limiter import RateLimiter
from urllib.parse import parse_qs
import json
import sys
import logging

# Initialize geocoding client
geocoder = Photon()
# geocoder = GoogleV3(api_key="your_api_key_here")
# geocoder = Nominatim(user_agent="test_geocoder")


geocoding_options = {
    "language": "de",
    "timeout": 2 #seconds
}

# wrap geocode function with rate limiter
requests_per_second = 20
do_geocode = RateLimiter(geocoder.geocode, min_delay_seconds=1/requests_per_second, max_retries=0) #rate limited geocode function


# in-memory cache for geocoding results (simple LRU eviction)
CACHE_SIZE = 1000
cache_store = {}      # stores {query: response_data}
cache_order = deque()

debug = False
logging.basicConfig(
    stream=sys.stderr,  
    level=logging.INFO,
    format='[GEOCODER] %(levelname)s: %(message)s'
)

def geocode(environ, start_response):
    # 1. Parse the query string
    address = environ.get('QUERY_STRING', '')
    params = parse_qs(address)

    #query params
    address = params.get('address', [None])[0] # address = search query
    include_raw = params.get('raw', ['false'])[0].lower() == 'true' # raw = if `true` include raw response from geocoding provider (default: false)
    limit_raw = params.get('limit', [5])[0] # limit = max. number of results to return (default: 5)
    bbox_raw = params.get('bbox', [None])[0]
    proximity_raw = params.get('proximity', [None])[0]


    # parse query params and validate
    errors = []
    bbox = None
    proximity = None

    request_cache_key = get_cache_key(address, limit_raw, bbox_raw, proximity_raw, include_raw, geocoding_options)

    if not address:
        errors.append("Missing mandatory 'address' parameter.")
    else:
        address = address.strip()

    if bbox_raw:
        bbox = parse_floats(bbox_raw, 4)
        bbox= [ Point(bbox[2], bbox[3]), Point(bbox[0], bbox[1]) ] # geopy expects [(max_lat, max_lon), (min_lat, min_lon)]
        if not bbox:
            errors.append("'bbox' must be 4 comma-separated numbers (min_lat, min_lon, max_lat, max_lon).")

    if proximity_raw:
        proximity = parse_floats(proximity_raw, 2)
        proximity = Point(proximity[0], proximity[1])
        if not proximity:
            errors.append("'proximity' must be 2 comma-separated numbers (lat, lon).")

    if limit_raw:
        limit = parse_int(limit_raw)
        if limit is None:
            errors.append("'limit' must be an integer.")

    # return 400 if there are validation errors
    if errors:
        status = '400 Bad Request'
        response_body = json.dumps({"errors": errors}, indent=2).encode('utf-8')
        start_response(status, [('Content-Type', 'application/json'), ('Content-Length', str(len(response_body)))])
        return [response_body]
    
    #start geocoding if validation passed
    #check cache first
    elif request_cache_key in cache_store:
        print(f"Cache hit for address: {address}")
        status = '200 OK'
        response_body = cache_store[request_cache_key]
    else:
        try:
            locations = excute_geocode_request(address, limit, bbox, proximity)

            if locations:
                status = '200 OK'
                results = []
                for loc in locations:
                    result = {
                        "label": loc.address,
                        "latitude": loc.latitude,
                        "longitude": loc.longitude
                    }
                    if include_raw:
                        result["raw"] = loc.raw
                    results.append(result)

                output = {"query": address, "results": results, "message": f"Found {len(results)} result(s)."}
            else:
                status = '200 OK'
                output = {"query": address, "results": [], "message": "No results found."}


        
        except Exception as e:
            status = '500 Internal Server Error'
            output = {"errors": [ "unable to process geocoding request" if  not debug else str(e)]}

        response_body = json.dumps(output, indent=2).encode('utf-8')

     #store response in cache if successful
    if status == '200 OK' and request_cache_key not in cache_store:
        if len(cache_order) >= CACHE_SIZE: #remove oldest entry if cache limit is reached
            oldest_key = cache_order.popleft()
            cache_store.pop(oldest_key, None)
        cache_order.append(request_cache_key)
        cache_store[request_cache_key] = response_body


    start_response(status, [
        ('Content-Type', 'application/json'),
        ('Content-Length', str(len(response_body)))
    ])
    return [response_body]


def excute_geocode_request(address, limit, bbox, proximity):
    #set parameters based on geocoder type
    if isinstance(geocoder, Photon):
        print(f"Executing Photon geocode with address={address}, limit={limit}, bbox={bbox}, proximity={proximity} and options={geocoding_options}")
        return do_geocode(query = address, exactly_one=False, limit=limit, location_bias=proximity, bbox=bbox, **geocoding_options)
    elif isinstance(geocoder, GoogleV3):
        print(f"Executing GoogleV3 geocode with address={address}, limit={limit}  bbox={bbox} and options={geocoding_options}")
        return do_geocode(query = address, exactly_one=False, limit=limit, bounds=bbox, **geocoding_options)
    elif isinstance(geocoder, Nominatim):
        is_bounded = bbox is not None;
        print(f"Executing Nominatim geocode with address={address}, limit={limit}, bbox={bbox}, bounded={is_bounded} and options={geocoding_options}")
        return do_geocode(query = address, exactly_one=False, limit=limit, addressdetails=True, geometry="geojson", bounded=is_bounded, viewbox=bbox, **geocoding_options) 
    else:
        raise ValueError(f"Unsupported geocoder type")

def parse_floats(csv_string, expected_count):
    """Helper to parse comma-separated floats and validate count."""
    try:
        parts = [float(x.strip()) for x in csv_string.split(',')]
        if len(parts) != expected_count:
            return None
        return parts
    except (ValueError, AttributeError):
        return None
    

def parse_int(value):
    """Helper to parse an integer with a default fallback."""
    try:
        return int(value)
    except (ValueError, TypeError):
        return None
    
def get_cache_key(address, limit, bbox, proximity, include_raw, geocoding_options):
    """Helper to create a unique cache key based on query parameters."""
    return f"{address}|{limit}|{bbox}|{proximity}|{include_raw}|{geocoding_options}"
    

# --- EXECUTION LOGIC ---
if __name__ == '__main__':
    # Check if running in terminal (interactive) or via Web Server
    if sys.stdin.isatty():
        print("--- Running in Local Test Mode ---")
        # Simulate a search
        test_request = {'QUERY_STRING': 'address=Allwetterzoo, Münster&limit=3&raw=true&bbox=51.5,7.0,52.5,8.0&proximity=51.95,7.5'}
        #test_request = {'QUERY_STRING': 'address=Münster&limit=3&raw=false'}
        
        def dummy_start_response(status, headers):
            print(f"Headers: {headers}")
            print(f"Status: {status}")

        debug = True
        result = geocode(test_request, dummy_start_response)
        print(result[0].decode("utf-8"))
    else:
        # This will only run when called by Apache/FastCGI
        WSGIServer(geocode).run()