# FastCGI Geocoding API Gateway

This application serves as a lightweight FastCGI geocoding gateway using Python. It provides wrapper around the [geopy](https://geopy.readthedocs.io/en/stable/) library to interface seamlessly with various upstream geocoding providers.

This implementation is primarily made to be used as geocoding backend for the OGITO application ([see here](./../../README.md#geocoder)). 

By default, the public [Photon geocoder](https://photon.komoot.io/) is used as geocoding provider. The application natively supports `Photon`, `GoogleV3`, and `Nominatim` geocoding backends. The Python script can be extended to support any geocoding provider that is supported by the geopy library.


---

## API Reference

### Geocode Endpoint
`GET /geocode`

Execute geocoding request

#### Query Parameters

* **`address`**: The core search string representing the physical address or landmark to locate  (mandatory).
* **`limit`**: Optional integer specifying the maximum count of matched geographic locations to return, defaulting to 5
* **`raw`**: Optional boolean string (`true`/`false`) determining if the upstream provider's original JSON payload should be included  in the response
* **`bbox`**: Optional bounding box coordinate restriction array parsed as 4 comma-separated floating-point coordinates (WGS84).
* **`proximity`**: Optional coordinates (WGS84) for proximity bias configurations parsed as 2 comma-separated floating-point numbers.

#### Expected JSON Formats

Example Request:   
`GET /geocode?address=Allwetterzoo,%20M%C3%BCnster&limit=3&raw=true&bbox=51.5,7.0,52.5,8.0&proximity=51.95,7.5`

##### Successful Response (`200 OK`)

```json
{
  "query": "Allwetterzoo, Münster",
  "results": [
    {
      "label": "Allwetterzoo Münster, Sentruper Straße, Sentrup, Münster, North Rhine-Westphalia, 48149, Germany",
      "latitude": 51.9482594,
      "longitude": 7.5859755106
    }
  ],
  "message": "Found 1 result(s)."
}
```

##### Error Response (`400 Bad Request`)

```json
{
  "errors": [
    "Missing mandatory 'address' parameter."
  ]
}
```

## Deployment

### Local Development Setup 

- create and activate virtual environment (e.g. venv)
- install dependencies (`pip install -r requirements.txt`)
- start Geocoding API (`python3 geocoder.fcgi`)

### Docker 

The repository (`./docker`) contains a Dockerfile for running the Geocoding API locally. Internally, the docker setup use the Apache HTTP server to deploy the Geocoding API.
Execute the following commands to start the Geocoding API in a Docker container (from `./src/tools/geopy_geocoder` directory).
```Bash
docker build -t local-geocoder .
docker run -d -p 80:80 --name dev-geocoder local-geocoder
```

### Production Deployment

For production, the Geocoding API must be deployed in a FastCGI runtime like Apache HTTP server (with fcgid mod activated).
The Docker setup can be used as a reference for the deployments steps that are necessary to run the Geocoding API in an existing instance of Apache HTTP server.

## Provider Configuration
Upstream provider options and request parameters are modifiable inside the initialization section of `geocoder.fcgi`:
 - Photon: Configured by default  and requires no custom authorization tokens to initiate calls if the public demo of Photon should be used
 - GoogleV3: Requires setting a private API credential string (api_key) and manages bounds parameters during execution.
 - Nominatim: Demands setting an explicit descriptive user agent name string to safely authorize client calls and leverages structured viewport filtering flags (viewbox).  

 Make sure that the Terms of Use are met if one of the public demo geocoding providers (like Photon or Nominatim) is used. Otherwise host a dedicated instance of these OpenSource geocoding services.