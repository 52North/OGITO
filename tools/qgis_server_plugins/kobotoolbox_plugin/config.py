"""All configuration for the KoboToolbox plugin in one place - constants and
environment-variable-derived values alike. See docker-compose.yml's
qgis_server service for how the env vars below get set in deployment.
"""

import os

# ==========================================
# KoboToolbox API (submissions_to_geojson.py)
# ==========================================
# KOBO_API_KEY/KOBO_URL are read from the environment rather than hardcoded
# here - KOBO_API_KEY in particular is a real credential, and KOBO_URL is
# deployment-specific. Falls back to "" (empty) if unset.
KOBO_API_KEY = os.environ.get("KOBO_API_KEY", "")
KOBO_URL = os.environ.get("KOBO_URL", "")

# Properties to drop from the output besides the "_"-prefixed Kobo metadata.
# Comma-separated if set via env, e.g. "meta/instanceID,formhub/uuid".
_DEFAULT_HIDDEN_PROPERTIES = ["meta/instanceID", "formhub/uuid", "GPS_Accuracy", "deviceid"]
KOBO_HIDDEN_PROPERTIES = (
    [p.strip() for p in os.environ["KOBO_HIDDEN_PROPERTIES"].split(",") if p.strip()]
    if os.environ.get("KOBO_HIDDEN_PROPERTIES")
    else _DEFAULT_HIDDEN_PROPERTIES
)

# NOTE: the form's label language and whether to use full labels at all are
# NOT configured here anymore - they're optional per-request parameters
# (&lang, &full_labels) threaded through build_geojson() instead, see
# kobotoolbox_service.py. KOBO_ASSET_UID/OUTPUT_FILE aren't here either -
# they're local to submissions_to_geojson.py's own main() CLI entry point,
# the only place that still needs them.

# ==========================================
# QGIS Server service (kobotoolbox_service.py, request_validation.py)
# ==========================================
LOG_TAG = "KoboToolboxService"

# The folder QGIS project files actually live in - joined with each
# projects.json entry's qgisProjectFilename to build the exact full path
# &map is compared against. Must match however QGIS Server itself is
# deployed - same convention as tools/project_authz's QGIS_PROJECTS_FOLDER.
QGIS_PROJECT_FOLDER = os.environ.get("QGIS_PROJECT_FOLDER", "/etc/qgisserver/")

# Filesystem path to a copy of src/assets/configuration/projects.json
# mounted into this container - same path/convention tools/project_authz
# uses, mounted separately since this plugin runs inside the qgis_server
# container, not project-authz-service.
QGIS_PROJECTS_JSON_PATH = os.environ.get("QGIS_PROJECTS_JSON_PATH", "/etc/ogito/projects.json")

ALLOWED_PARAMS = {"SERVICE", "MAP", "ASSET", "SUBMISSION", "ATTACHMENT", "LANG", "FULL_LABELS"}
