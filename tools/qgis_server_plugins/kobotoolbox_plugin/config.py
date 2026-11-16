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


KOBO_REQUEST_LIMIT = int(
    os.getenv("KOBO_REQUEST_LIMIT", 5000)
)


# Properties to drop from the output besides the "_"-prefixed Kobo metadata.
# Comma-separated if set via env, e.g. "meta/instanceID,formhub/uuid".
_DEFAULT_HIDDEN_PROPERTIES = ["meta/instanceID", "formhub/uuid", "GPS_Accuracy", "deviceid"]
KOBO_HIDDEN_PROPERTIES = (
    [p.strip() for p in os.environ["KOBO_HIDDEN_PROPERTIES"].split(",") if p.strip()]
    if os.environ.get("KOBO_HIDDEN_PROPERTIES")
    else _DEFAULT_HIDDEN_PROPERTIES
)




# ==========================================
# QGIS Server service (kobotoolbox_service.py, request_validation.py)
# ==========================================
LOG_TAG = "KoboToolboxService"

# NOTE: QGIS_PROJECT_FOLDER/QGIS_PROJECTS_JSON_PATH used to live here, for
# matching &map against projects.json - that authorization check has moved
# upstream to tools/project_authz (see its kobotoolbox_authz.py), so this
# plugin no longer reads projects.json at all.

ALLOWED_PARAMS = {"SERVICE", "MAP", "ASSET", "SUBMISSION", "ATTACHMENT", "LANG", "FULL_LABELS"}
