# KoboToolbox QGIS Server Plugin

A [QGIS Server custom service](https://docs.qgis.org/3.44/en/docs/pyqgis_developer_cookbook/server.html#custom-services) that fetches submissions from a KoboToolbox form and returns them as a GeoJSON `FeatureCollection`, so they can be loaded as a layer directly from QGIS Server.

## Usage

Requests to QGIS Server with `&SERVICE=KOBOTOOLBOX` are routed to this service.

- **`SERVICE`'s value must match `KOBOTOOLBOX` exactly** (verified live - `&SERVICE=kobotoolbox` lowercase is not routed here at all and falls through to QGIS Server's generic "unsupported service" error instead).
- **Parameter names themselves are case-insensitive** (`&asset=`, `&ASSET=`, `&Asset=` all work - QGIS Server normalizes parameter keys to uppercase before this service ever sees them).
- **Only `service`, `map`, `asset`, `submission`, `attachment`, `lang` and `full_labels` are accepted** - any other query parameter gets `400 Bad Request` (`Unexpected parameter(s): ...`).

**`asset` is mandatory** - a request missing it gets `400 Bad Request`, before anything else runs. **`map` is optional** and, if given, is only used to build this request's own generated attachment proxy URLs (see below) - this plugin does **not** validate `map` against `projects.json` itself. That authorization check - the `(map, asset)` pair must be registered in `projects.json`'s `kobotoolbox_layer[]` - now lives upstream, in `tools/project_authz`'s `authorize.fcgi` (see its `kobotoolbox_authz.py`), which is meant to sit in front of every backend request once the gateway exists. **Calling this plugin directly (as is still the case today, with no gateway wired up yet) is therefore unauthenticated and unauthorized at this layer** - it trusts whatever `asset` it's given and fetches it. This parameter-shape validation lives in `request_validation.py`'s `validate_request()`, not inline in the service class.

There are then two modes, depending on whether `submission`/`attachment` are also given:

### `&map=<qgs project path>&asset=<kobo asset uid>[&lang=<language>][&full_labels=true]` - submissions as GeoJSON

1. fetches that KoboToolbox form's schema and submissions from the KoboToolbox API,
2. builds a GeoJSON `FeatureCollection` out of them (see `submissions_to_geojson.py`'s `build_geojson()` - this is the same logic as its standalone CLI script, just returning the dict instead of writing it to a file), and
3. returns that GeoJSON as the HTTP response body (`Content-Type: application/json`).

Both `lang` and `full_labels` are optional, per-request (not static config):
* **`lang`**: which translation of the form's question/choice labels to use, matching an entry of the form's `content.translations` exactly (e.g. `English (en)`). Omit it (default) to use the form's first/default language; an unrecognized value falls back to the first language too (logged as a warning).
* **`full_labels`**: `true` to use each question's full label as its property key instead of its short technical field name (e.g. `qualify/type`). Defaults to `false` otherwise. **The OGITO frontend always sends `full_labels=true`** (see `src/app/map/kobotoolbox-utils/kobotoolbox-layers.ts`), so the layer panel's attribute table shows readable labels - a request made without it (e.g. plain `curl`) gets short technical keys instead.

Any attachment field (e.g. a photo upload question) is **not** exposed as KoboToolbox's own direct `download_url` - it's rewritten to a same-origin proxy URL back to this same service's attachment mode below, carrying the same `map` value the GeoJSON request itself was given (if any), e.g.:
```
?service=KOBOTOOLBOX&map=/etc/qgisserver/ogito_starter.qgs&asset=aHBbFBnFtx9giNjQjVkxkf&submission=1215&attachment=153
```
(relative to whatever base URL the GeoJSON itself was requested from). This keeps the KoboToolbox token server-side only - clients never see or need it.

On failure (the KoboToolbox API unreachable, an invalid token, or an unknown asset uid), responds with `500` and a small JSON error body instead of raising, and logs the full traceback to the QGIS Server log under the `KoboToolboxService` tag.

### `&map=<path>&asset=<uid>&submission=<submission id>&attachment=<attachment id>` - attachment proxy

Fetches that one attachment directly from KoboToolbox (`fetch_attachment()`) and streams its raw bytes back with its real `Content-Type` (e.g. `image/jpeg`) - verified live with a real photo attachment (1.4 MB JPEG, byte-for-byte and content-type identical to fetching it directly).

`submission` and `attachment` must be given together - one without the other is `400 Bad Request`. A KoboToolbox-side error (e.g. an attachment id that doesn't exist, real `404`) is propagated through with its real status code rather than reported as a generic `500`.

## Configuration

**All of it lives in `config.py`** - every constant and every environment-variable-derived value this plugin uses, in one place. `LANGUAGE`/`USE_FULL_LABELS` are deliberately **not** here anymore - see `&lang`/`&full_labels` above, they're per-request now. `KOBO_ASSET_UID`/`OUTPUT_FILE` aren't here either - they're local variables inside `submissions_to_geojson.py`'s own `main()`, the only place that still needs them (fill in a real asset uid there for local/manual CLI runs). `QGIS_PROJECT_FOLDER`/`QGIS_PROJECTS_JSON_PATH` aren't here anymore either - this plugin no longer validates `map` against `projects.json` itself, see `tools/project_authz`'s `kobotoolbox_authz.py` for where that logic (and those two settings' equivalents, `QGIS_PROJECTS_FOLDER`/`OGITO_PROJECTS_JSON_PATH`) now lives.

* **`KOBO_API_KEY`**/**`KOBO_URL`**: read from the environment (see `starter_project/docker/docker-compose.yml`'s `qgis_server` service), falling back to `""` if unset. `KOBO_API_KEY` is a real credential - never commit a real value for it (or `KOBO_URL`, which is deployment-specific) into `docker-compose.yml`.
* **`KOBO_HIDDEN_PROPERTIES`**: properties to drop from the GeoJSON output besides Kobo's own `_`-prefixed metadata. Read from the environment as a comma-separated list (e.g. `KOBO_HIDDEN_PROPERTIES=meta/instanceID,formhub/uuid`), falling back to a sensible default list if unset.
* **`ALLOWED_PARAMS`**, **`LOG_TAG`**: the request-shape allowlist and the shared QGIS Server log tag - plain constants, not env-backed.

`kobotoolbox_service.py` and `request_validation.py` always `from . import config` (fine - they're only ever loaded as part of this package by QGIS Server). `submissions_to_geojson.py` falls back to a plain `import config` if the relative import fails, since it also still runs standalone (`python3 submissions_to_geojson.py`), where there's no parent package for a relative import to resolve against.

## Files

* `__init__.py` - defines `serverClassFactory(serverIface)`, the entry point QGIS Server calls at startup.
* `config.py` - every constant and env-var this plugin reads, see Configuration above.
* `kobotoolbox_service.py` - the `QgsService` subclass (`KOBOTOOLBOX`/`1.0.0`) and the plugin class that registers it. Delegates request validation to `request_validation.py` and just maps its result onto an HTTP response.
* `request_validation.py` - the allowed-parameters check and the mandatory-`asset` check (`validate_request()`). Raises `RequestValidationError(status_code, error, message=None)` on rejection; `kobotoolbox_service.py` just forwards those three fields into its own `_respond_error()`. The `(map, asset)` vs. `projects.json` authorization check that used to live here has moved to `tools/project_authz`'s `kobotoolbox_authz.py`.
* `submissions_to_geojson.py` - the actual KoboToolbox API logic. `build_geojson()` is used by both this plugin and the script's own CLI entry point (`python3 submissions_to_geojson.py`, unchanged - still fetches and writes `kobo_submissions.geojson` to disk, using KoboToolbox's own `download_url`s directly rather than proxy URLs, since there's no QGIS Server to proxy through in that case). `build_attachment_proxy_url()` and `fetch_attachment()` back the attachment-proxy mode described above.
* `metadata.txt` - QGIS plugin metadata; `server=True` is what makes QGIS Server load it as a server plugin.

## Installation

QGIS Server loads server plugins from the directory named by the `QGIS_PLUGINPATH` environment variable (see the [server manual](https://docs.qgis.org/3.44/en/docs/server_manual/config.html#environment-variables)). Copy (or mount) this entire `kobotoolbox_plugin/` folder into that directory - no separate "enable" step is needed, QGIS Server picks up any plugin with `server=True` in its `metadata.txt`.

Wired into `starter_project/docker/docker-compose.yml`'s `qgis_server` service: the whole `tools/qgis_server_plugins/` folder (not just this one plugin - any sibling plugin added there later is picked up the same way) is mounted to `/etc/qgisserver/plugins`, with `QGIS_PLUGINPATH=/etc/qgisserver/plugins` set accordingly. Unlike `tools/project_authz`, this container does **not** mount `projects.json` - this plugin no longer reads it. Verified live against that container:
```
GET /?SERVICE=KOBOTOOLBOX&map=<path>&asset=<uid>&evil=1                        -> 400 (unexpected parameter)
GET /?SERVICE=KOBOTOOLBOX&asset=<real asset uid>                               -> 200 (map omitted entirely - no longer required by this plugin)
GET /?SERVICE=KOBOTOOLBOX&map=<path>                                           -> 400 (missing &asset)
GET /?SERVICE=KOBOTOOLBOX&map=<any path>&asset=<real asset uid>                -> 200, real GeoJSON FeatureCollection, short technical property keys (full_labels defaults to false) - note `map` is NOT checked against projects.json here anymore (see tools/project_authz/kobotoolbox_authz.py for where that now happens, once a gateway calls it in front of this service)
GET /?SERVICE=KOBOTOOLBOX&map=<real path>&asset=<real asset uid>&full_labels=true  -> 200, same data with full question labels as property keys instead
GET /?SERVICE=KOBOTOOLBOX&map=<path>&asset=<uid>&submission=<id>&attachment=<id>      -> 200, real attachment bytes with the correct Content-Type
GET /?SERVICE=KOBOTOOLBOX&map=<path>&asset=<uid>&submission=<id>&attachment=<bad id>  -> 404, propagated from KoboToolbox itself
```
