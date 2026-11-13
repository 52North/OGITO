import json
import os

from qgis.core import Qgis, QgsMessageLog

LOG_TAG = "KoboToolboxService"

# Constants for now (see docker-compose.yml's qgis_server service for the
# matching mounts) - may become configurable later, same as
# tools/project_authz's OGITO_PROJECTS_JSON_PATH/QGIS_PROJECTS_FOLDER.
QGIS_PROJECT_FOLDER = "/etc/qgisserver/"
OGITO_PROJECTS_JSON_PATH = "/etc/ogito/projects.json"

ALLOWED_PARAMS = {"SERVICE", "MAP", "ASSET", "SUBMISSION", "ATTACHMENT"}

# in-memory cache of the parsed projects.json, refreshed when the file's
# mtime changes (avoids re-reading/re-parsing it on every request) - same
# pattern as tools/project_authz/authorize.fcgi's load_projects()
_projects_cache = {"mtime": None, "projects": None}


class RequestValidationError(Exception):
    """Raised by validate_request() when a request should be rejected.
    Carries the HTTP status code and the error/message to respond with -
    kobotoolbox_service.py just catches this and forwards status_code/error/
    message to its own _respond_error(). Keeping the HTTP response shape out
    of this module on purpose, so it stays about validation, not responses.
    """

    def __init__(self, status_code, error, message=None):
        super().__init__(error)
        self.status_code = status_code
        self.error = error
        self.message = message


def load_projects(projects_json_path):
    try:
        mtime = os.path.getmtime(projects_json_path)
    except OSError as e:
        QgsMessageLog.logMessage(f"could not stat {projects_json_path}: {e}", LOG_TAG, Qgis.Warning)
        return None

    if _projects_cache["mtime"] == mtime:
        return _projects_cache["projects"]

    try:
        with open(projects_json_path, "r", encoding="utf-8") as f:
            projects = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        QgsMessageLog.logMessage(f"could not read/parse {projects_json_path}: {e}", LOG_TAG, Qgis.Warning)
        return None

    _projects_cache["mtime"] = mtime
    _projects_cache["projects"] = projects
    return projects


def is_registered_map_asset(projects, map_value, asset_uid):
    """True if some projects.json entry's qgisProjectFilename - joined with
    QGIS_PROJECT_FOLDER, the same full-path matching tools/project_authz
    uses - equals `map_value` exactly, AND that entry's kobotoolbox_layer[]
    contains an item whose `asset` equals `asset_uid`.

    Checks every entry whose qgisProjectFilename matches, not just the
    first - since the same QGIS project file can legitimately be referenced
    by multiple projects.json entries (see tools/project_authz/README.md's
    "What this actually protects" section), stopping at the first match
    would incorrectly reject an asset that's only registered on a later
    entry sharing that same file.
    """
    for proj in projects:
        qgis_filename = proj.get("qgisProjectFilename")
        if not qgis_filename:
            continue
        if map_value != os.path.join(QGIS_PROJECT_FOLDER, qgis_filename):
            continue
        for kobo_layer in proj.get("kobotoolbox_layer") or []:
            if kobo_layer.get("asset") == asset_uid:
                return True
    return False


def validate_request(params):
    """Validates an incoming KOBOTOOLBOX request's parameters: rejects any
    parameter outside ALLOWED_PARAMS, requires `map` and `asset`, and
    requires that (map, asset) pair to actually be registered in
    projects.json (see is_registered_map_asset()).

    Returns the validated (map_value, asset_uid) tuple on success. Raises
    RequestValidationError on any failure - the map/asset mismatch case
    deliberately raises a generic 404 rather than a more descriptive 403,
    so a client can't distinguish "this project isn't registered" from
    "this asset isn't registered under it" from "this combination doesn't
    exist at all" - full detail still goes to the QGIS Server log instead.
    """
    unexpected_params = set(params.keys()) - ALLOWED_PARAMS
    if unexpected_params:
        raise RequestValidationError(
            400, "Unexpected parameter(s): " + ", ".join(sorted(unexpected_params))
        )

    # like a "normal" QGIS Server request, &map= identifying the QGIS
    # project is mandatory - here it's used purely to authorize the request
    # against projects.json, see is_registered_map_asset()
    map_value = params.get("MAP")
    if not map_value:
        raise RequestValidationError(400, "Missing mandatory 'map' parameter.")

    asset_uid = params.get("ASSET")
    if not asset_uid:
        raise RequestValidationError(400, "Missing mandatory 'asset' parameter.")

    projects = load_projects(OGITO_PROJECTS_JSON_PATH)
    if projects is None:
        raise RequestValidationError(500, "Unable to load project configuration.")

    if not is_registered_map_asset(projects, map_value, asset_uid):
        QgsMessageLog.logMessage(
            f"rejected unregistered map/asset combination: map={map_value!r} asset={asset_uid!r}",
            LOG_TAG,
            Qgis.Info,
        )
        raise RequestValidationError(404, "Not Found")

    return map_value, asset_uid
