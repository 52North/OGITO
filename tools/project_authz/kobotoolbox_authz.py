"""Handles authorization specifically for KoboToolbox service plugin requests (&SERVICE=KOBOTOOLBOX).

On top of the normal project/role check (based on &map), a KoboToolbox
request (&SERVICE=KOBOTOOLBOX) must also name a &asset that's actually
registered under that same QGIS project in projects.json's
kobotoolbox_layer[].
"""
import os
from urllib.parse import parse_qs


def extract_param(raw_query_string, key):
    """
    Case-insensitively extracts one query parameter's first value from a raw query string
    """
    if not raw_query_string:
        return None
    parsed = parse_qs(raw_query_string)
    for actual_key, values in parsed.items():
        if actual_key.lower() == key.lower() and values:
            return values[0]
    return None


def is_kobotoolbox_request(raw_query_string):
    """
    Checks whether it is a request to the KoboToobox service plugin.
    True if the request's &SERVICE parameter is KOBOTOOLBOX, matched case-insensitively. 
    """
    service = extract_param(raw_query_string, "service")
    return bool(service) and service.upper() == "KOBOTOOLBOX"


def is_registered_map_asset(projects, map_value, asset_uid, qgis_projects_folder):
    """
    True if some projects.json entry's qgisProjectFilename - joined with
    qgis_projects_folder, the same full-path matching authorize.fcgi's own
    find_project() uses - equals `map_value` exactly, AND that entry's
    kobotoolbox_layer[] contains an item whose `asset` equals `asset_uid`.
    """
    for proj in projects:
        qgis_filename = proj.get("qgisProjectFilename")
        if not qgis_filename:
            continue
        if map_value != os.path.join(qgis_projects_folder, qgis_filename):
            continue
        for kobo_layer in proj.get("kobotoolbox_layer") or []:
            if kobo_layer.get("asset") == asset_uid:
                return True
    return False
