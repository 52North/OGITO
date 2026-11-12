# Project Authorization Service

This application serves as a lightweight FastCGI (fcgi) authorization gateway using Python. It matches a requested QGIS project (identified by its `.qgs` filename) against `projects.json`'s `requiredRole` property and the current user's roles, mirroring the access logic the OGITO Angular app uses client-side for UI filtering.
This fcgi script is used to protect the OGITO backend services (e.g QGIS Server).

> **Scope: this secures QGIS *data* (the `.qgs` file), not OGITO *project entries*.** Read "What this actually protects" below before configuring `requiredRole` on multiple `projects.json` entries - it explains why that's the correct boundary, and what it means for entries that share a `.qgs` file.

This implementation is meant to be called as the external authorization backend from whatever gateway sits in front of QGIS Server - it is not reachable from or intended to be called by the Angular app directly.

Unlike a typical authorization subrequest that trusts whatever identity/roles the calling gateway passes along, this service validates the caller's access token **itself** by default (signature, issuer, audience, expiry, via the IdP's JWKS) and derives roles only from that independently-verified token. This is deliberately redundant with any token validation the gateway may also perform (e.g. `mod_auth_openidc`) - the actual authorization decision must not depend on that upstream validation being configured correctly. This own-validation step can be disabled via `OGITO_VALIDATE_TOKEN` (see Configuration) if the gateway is trusted to have already validated the token - use with care, since it moves that trust boundary outside this service.

---

## API Reference

### Authorize Endpoint

Executing the fcgi script calls the `authorize()` function.

#### Headers

* **`Authorization: Bearer <token>`**: the user's access token (mandatory)

#### Query Parameters

* **`query`**: The **entire original query string** of the backend (QGIS Server) request, passed through verbatim (URL-encoded as this parameter's single value) (mandatory). The request must include the `&MAP=...` URL parameter (QGIS Server style) to identify the QGIS project that is attempted to be accessed.
  Example: for a real request to `.../?SERVICE=WMS&map=/etc/qgisserver/ogito_starter.qgs&REQUEST=GetMap`, the caller passes `query=SERVICE%3DWMS%26map%3D%2Fetc%2Fqgisserver%2Fogito_starter.qgs%26REQUEST%3DGetMap` to this script. The script extracts the `&map` value (`/etc/qgisserver/ogito_starter`) to control access to the corresponding QGIS project.

#### Response

* **`200 OK`**: user has one of the `requiredRole` defined for that project in `projects.json` from OGITO app (or project is accessible for all users, `requiredRole` is defined but empty array)
* **`403 Forbidden`**: user has none of the `requiredRole` defined for that project in `projects.json` from OGITO app (or the QGOS project filename derived from `&MAP` URL parameter isn't found in `projects.json` and isn't listed in `OGITO_OPEN_PROJECT_FILES`).
* **`400 Bad Request`**: missing `query` parameter, or the provided query string doesn't contain a `&MAP` URL parameter.
* **`401 Unauthorized`**: missing/malformed `Authorization` header, or the token failed validation (bad signature, expired, wrong issuer/audience).
* **`500 Internal Server Error`**: `projects.json` could not be read/parsed, or the service's own OIDC config (`OGITO_OIDC_JWKS_URI`/`OGITO_OIDC_ISSUER`) is missing.

All responses include a small JSON body describing the decision, e.g.:
```json
{
  "project": "ogito_starter.qgs",
  "allowed": true
}
```

## Configuration

Set variables via the Apache vhost, passed through to the script as fcgi environment variables:

* **`OGITO_PROJECTS_JSON_PATH`**: filesystem path to a copy of OGITO app's `projects.json`, default: `/etc/ogito/projects.json`.
* **`OGITO_ADMIN_ROLE`**: role name that bypasses `requiredRole` entirely, should mirror OGITO app's `appsettings.json`'s `auth.adminRole`.
* **`QGIS_PROJECTS_FOLDER`**: the folder QGIS project files actually live in (e.g. `/etc/qgisserver/`, project folder path is concatenated with the `qgisProjectFilename` from `projects.json` and matched with the value of the `&MAP` URL parameter.
* **`OGITO_ROLES_CLAIM`**: claim key/path to resolve the user's roles from the validated token, should mirror OGITO app's `appsettings.json`'s `auth.rolesClaim`. Default: `https://ogito.app/roles`.

[//]: # (List end)


* **`OGITO_OPEN_PROJECT_FILES`**: comma-separated list of QGIS project filenames that stay open even when not listed in any project from `projects.json` (e.g. standalone test/dev projects never meant to be registered there). Only consulted when a requested filename isn't found in `projects.json` at all - a filename that *is* in `projects.json` is governed solely by that entry's `requiredRole`. Default: empty (nothing whitelisted).

[//]: # (List end)


* **`OGITO_VALIDATE_TOKEN`**: if set to `false` the script skips token validation and instead trust the token's claims as-is. **Only safe if a gateway in front of this service already guarantees the token is valid (e.g. Apache HTTP with mod_auth_openidc configured)**

[//]: # (List end)

The following variables only apply if internal token validation is activated (`OGITO_VALIDATE_TOKEN` set to `true`)
* **`OGITO_OIDC_JWKS_URI`**: the IdP's JWKS endpoint, used to verify the access token's signature (e.g. `https://<tenant>/.well-known/jwks.json` for Auth0).
* **`OGITO_OIDC_ISSUER`**: expected `iss` claim on the token. Must match `appsettings.json`'s `auth.issuer`.
* **`OGITO_OIDC_AUDIENCE`**: expected `aud` claim on the token. Must match `appsettings.json`'s `auth.customQueryParams.audience`. Leave empty to skip the audience check (for IdPs that don't use one).
* **`OGITO_OIDC_ALGORITHMS`**: comma-separated list of JWT signing algorithms accepted when verifying the token's signature. Must match whatever the IdP actually signs tokens with. Default: `RS256`.


## Access Control Concepts

**This scipt's security boundary is the QGIS project file (the `.qgs/.qgz`), not the OGITO "project" entry in `projects.json`.** 
The requested QGIS project file is extracted from the request's `?MAP` URL parameter. The extracted qgis project filename is matched with the `qgisProjectFilename` property of the project entries in `projects.json`.
If the filenames match access control checks for the `requiredRole` property of the corresponding project entry from `projects.json`.

This concept was chosen because the actual application data is contained in the backend services (QGIS Server).

### Consequences

 - if two `projects.json` entries point at the **same** `qgisProjectFilename` both `projects.json` entries effectively share the same access constraints
    - access controls works on the level of QGIS project files not on OGITO projects (`projects.json`)
    - giving them different `requiredRole` values does not create two different access levels to that data
 - a QGIS project filename not found in `projects.json` at all fails closed (403)**, unless it's explicitly whitelisted in `OGITO_OPEN_PROJECT_FILES`.
 - matching is always an exact full path, never basename-only** - a request for `map=/some/other/folder/ogito_starter.qgs` will NOT match a `projects.json` entry with `qgisProjectFilename: "ogito_starter.qgs"` unless `QGIS_PROJECTS_FOLDER` is set to `/some/other/folder/`. With the default empty `QGIS_PROJECTS_FOLDER`, `qgisProjectFilename` is expected to equal the request's `map` value exactly - if your real QGIS Server requests carry a path, set `QGIS_PROJECTS_FOLDER` to that path or every request will fail closed (403) regardless of role.


## Deployment

### Local Development Setup

- create and activate virtual environment (e.g. venv)
- install dependencies (`pip install -r requirements.txt`)
- for a meaningful local test run, set `OGITO_TEST_TOKEN` to a real access token (e.g. copied from the running Angular app's devtools) and `OGITO_OIDC_JWKS_URI`/`OGITO_OIDC_ISSUER`/`OGITO_OIDC_AUDIENCE` to match `appsettings.json`'s `auth` block
- start the service (`python3 authorize.fcgi`) (dev mode)

### Production

Integrate the script into a fcgi environment like Apache HTTP with mod_fcgi. Make sure dependencies are installed correctly.