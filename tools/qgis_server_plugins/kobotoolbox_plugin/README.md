# KoboToolbox QGIS Server Plugin

A [QGIS Server custom service](https://docs.qgis.org/3.44/en/docs/pyqgis_developer_cookbook/server.html#custom-services) that fetches submissions from a KoboToolbox form and returns them as a GeoJSON `FeatureCollection`, so they can be loaded as a layer directly from QGIS Server.

## Usage

Requests to QGIS Server with `&SERVICE=KOBOTOOLBOX` are routed to this service.

- **`SERVICE`'s value must match `KOBOTOOLBOX` exactly** (verified live - `&SERVICE=kobotoolbox` lowercase is not routed here at all and falls through to QGIS Server's generic "unsupported service" error instead).
- **Parameter names themselves are case-insensitive** (`&asset=`, `&ASSET=`, `&Asset=` all work - QGIS Server normalizes parameter keys to uppercase before this service ever sees them).
- **Only `service`, `map`, `asset`, `submission` and `attachment` are accepted** - any other query parameter gets `400 Bad Request` (`Unexpected parameter(s): ...`).

`map` and `asset` are always mandatory - a request missing either gets `400 Bad Request`, before anything else runs. Unlike a "normal" QGIS WMS/WFS request, `map` isn't used to render anything here - it's purely an authorization check: **the `(map, asset)` pair must be registered in `projects.json`**, i.e. some entry's `qgisProjectFilename` (joined with the `QGIS_PROJECT_FOLDER` constant) must equal `map` exactly, AND that entry's `kobotoolbox_layer[]` array must contain an item whose `asset` equals the request's `asset`. This is checked **before** any KoboToolbox API call is made, closing off the service to assets that aren't actually wired up to any project. Since the same `.qgs` file can legitimately be referenced by multiple `projects.json` entries (see `tools/project_authz/README.md`'s "What this actually protects"), every entry sharing a matching `qgisProjectFilename` is checked, not just the first - an asset registered only on a later entry sharing that file is still accepted.

If no entry satisfies both, the request gets a deliberately generic **`404 Not Found`** (`{"error": "Not Found"}`) rather than a more descriptive `403` - a client can't tell "that project isn't registered at all" apart from "that asset isn't registered under it" apart from "this combination plain doesn't exist", which avoids helping anyone probe for valid `(map, asset)` combinations. The specific reason is still logged server-side (QGIS Server log, `KoboToolboxService` tag) for operators. This validation lives in `request_validation.py`'s `validate_request()`, not inline in the service class.

There are then two modes, depending on whether `submission`/`attachment` are also given:

### `&map=<qgs project path>&asset=<kobo asset uid>` - submissions as GeoJSON

1. fetches that KoboToolbox form's schema and submissions from the KoboToolbox API,
2. builds a GeoJSON `FeatureCollection` out of them (see `submissions_to_geojson.py`'s `build_geojson()` - this is the same logic as its standalone CLI script, just returning the dict instead of writing it to a file), and
3. returns that GeoJSON as the HTTP response body (`Content-Type: application/json`).

Any attachment field (e.g. a photo upload question) is **not** exposed as KoboToolbox's own direct `download_url` - it's rewritten to a same-origin proxy URL back to this same service's attachment mode below, carrying the same `map` value the GeoJSON request itself was authorized with, e.g.:
```
?service=KOBOTOOLBOX&map=/etc/qgisserver/ogito_starter.qgs&asset=aHBbFBnFtx9giNjQjVkxkf&submission=1215&attachment=153
```
(relative to whatever base URL the GeoJSON itself was requested from). This keeps the KoboToolbox token server-side only - clients never see or need it.

On failure (the KoboToolbox API unreachable, an invalid token, or an unknown asset uid), responds with `500` and a small JSON error body instead of raising, and logs the full traceback to the QGIS Server log under the `KoboToolboxService` tag.

### `&map=<path>&asset=<uid>&submission=<submission id>&attachment=<attachment id>` - attachment proxy

Fetches that one attachment directly from KoboToolbox (`fetch_attachment()`) and streams its raw bytes back with its real `Content-Type` (e.g. `image/jpeg`) - verified live with a real photo attachment (1.4 MB JPEG, byte-for-byte and content-type identical to fetching it directly).

`submission` and `attachment` must be given together - one without the other is `400 Bad Request`. A KoboToolbox-side error (e.g. an attachment id that doesn't exist, real `404`) is propagated through with its real status code rather than reported as a generic `500`.

## Configuration

**Currently hardcoded at the top of `submissions_to_geojson.py`** (`TOKEN`, `KOBO_URL`, `STRIP_PROPERTIES`, `USE_FULL_LABELS`, `LANGUAGE`) - this is deliberate for now and will move to proper configuration later. `ASSET_UID` is also defined there as the default used by the standalone CLI script, but the service plugin always uses the request's own `&asset` parameter instead.

**Also hardcoded, at the top of `request_validation.py`** (same "for now" caveat):
* **`QGIS_PROJECT_FOLDER`**: the folder QGIS project files actually live in (`/etc/qgisserver/`) - joined with each `projects.json` entry's `qgisProjectFilename` to build the exact full path `map` is compared against. Must match however QGIS Server itself is deployed - same convention as `tools/project_authz`'s `QGIS_PROJECTS_FOLDER`.
* **`OGITO_PROJECTS_JSON_PATH`**: filesystem path to a copy of `src/assets/configuration/projects.json` mounted into this container (`/etc/ogito/projects.json`) - same path/convention `tools/project_authz` uses, mounted separately since this plugin runs inside the `qgis_server` container, not `project-authz-service`.

## Files

* `__init__.py` - defines `serverClassFactory(serverIface)`, the entry point QGIS Server calls at startup.
* `kobotoolbox_service.py` - the `QgsService` subclass (`KOBOTOOLBOX`/`1.0.0`) and the plugin class that registers it. Delegates request validation to `request_validation.py` and just maps its result onto an HTTP response.
* `request_validation.py` - the allowed-parameters check and the `(map, asset)` vs. `projects.json` authorization check (`validate_request()`, `is_registered_map_asset()`, `load_projects()`). Raises `RequestValidationError(status_code, error, message=None)` on rejection; `kobotoolbox_service.py` just forwards those three fields into its own `_respond_error()`.
* `submissions_to_geojson.py` - the actual KoboToolbox API logic. `build_geojson()` is used by both this plugin and the script's own CLI entry point (`python3 submissions_to_geojson.py`, unchanged - still fetches and writes `kobo_submissions.geojson` to disk, using KoboToolbox's own `download_url`s directly rather than proxy URLs, since there's no QGIS Server to proxy through in that case). `build_attachment_proxy_url()` and `fetch_attachment()` back the attachment-proxy mode described above.
* `metadata.txt` - QGIS plugin metadata; `server=True` is what makes QGIS Server load it as a server plugin.

## Installation

QGIS Server loads server plugins from the directory named by the `QGIS_PLUGINPATH` environment variable (see the [server manual](https://docs.qgis.org/3.44/en/docs/server_manual/config.html#environment-variables)). Copy (or mount) this entire `kobotoolbox_plugin/` folder into that directory - no separate "enable" step is needed, QGIS Server picks up any plugin with `server=True` in its `metadata.txt`.

Wired into `starter_project/docker/docker-compose.yml`'s `qgis_server` service: the whole `tools/qgis_server_plugins/` folder (not just this one plugin - any sibling plugin added there later is picked up the same way) is mounted to `/etc/qgisserver/plugins`, with `QGIS_PLUGINPATH=/etc/qgisserver/plugins` set accordingly. `src/assets/configuration/projects.json` is also mounted read-only to `/etc/ogito/projects.json`, matching `OGITO_PROJECTS_JSON_PATH` above. Verified live against that container:
```
GET /?SERVICE=KOBOTOOLBOX&map=<path>&asset=<uid>&evil=1                        -> 400 (unexpected parameter)
GET /?SERVICE=KOBOTOOLBOX&asset=<real asset uid>                               -> 400 (missing &map)
GET /?SERVICE=KOBOTOOLBOX&map=<path>                                           -> 400 (missing &asset)
GET /?SERVICE=KOBOTOOLBOX&map=<unregistered path>&asset=<real asset uid>       -> 404 (generic - map/asset not registered in projects.json)
GET /?SERVICE=KOBOTOOLBOX&map=<real path>&asset=<wrong asset uid>              -> 404 (generic - same response, indistinguishable from the above)
GET /?SERVICE=KOBOTOOLBOX&map=<real path>&asset=<real asset uid>               -> 200, real GeoJSON FeatureCollection from KoboToolbox
GET /?SERVICE=KOBOTOOLBOX&map=<path>&asset=<uid>&submission=<id>&attachment=<id>      -> 200, real attachment bytes with the correct Content-Type
GET /?SERVICE=KOBOTOOLBOX&map=<path>&asset=<uid>&submission=<id>&attachment=<bad id>  -> 404, propagated from KoboToolbox itself (coincidentally the same status, but for an unrelated reason)
```
