#!/var/www/scripts/venv/bin/python3
# must point to the Python interpreter in your virtual environment with flipflop installed

from flipflop import WSGIServer
from urllib.parse import parse_qs, quote
import jwt
from jwt import PyJWKClient
import json
import os
import sys
import logging

debug = False
logging.basicConfig(
    stream=sys.stderr,
    level=logging.INFO,
    format='[AUTHZ] %(levelname)s: %(message)s'
)

# in-memory cache of the parsed projects.json, refreshed when the file's
# mtime changes (avoids re-reading/re-parsing it on every request)
_projects_cache = {"mtime": None, "projects": None}

# lazily created once per worker process; PyJWKClient caches the fetched
# JWKS itself, keyed by the jwks_uri it was constructed with
_jwks_client_cache = {"jwks_uri": None, "client": None}

DEFAULT_ROLES_CLAIM = "https://ogito.app/roles"


def load_projects(projects_json_path):
    """Loads and parses projects.json from the ogito app
    Returns None (and logs a warning) if the file is missing or not valid JSON.
    """
    try:
        mtime = os.path.getmtime(projects_json_path)
    except OSError as e:
        logging.warning(f"could not stat {projects_json_path}: {e}")
        return None

    if _projects_cache["mtime"] == mtime:
        return _projects_cache["projects"]

    try:
        with open(projects_json_path, "r", encoding="utf-8") as f:
            projects = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        logging.warning(f"could not read/parse {projects_json_path}: {e}")
        return None

    _projects_cache["mtime"] = mtime
    _projects_cache["projects"] = projects
    return projects


def extract_qgs_filename(raw_value):
    """
        parse the qgis project filename from the &map parameter (basename only, no path) - e.g. /etc/qgisserver/ogito_starter.qgs -> ogito_starter.qgs
    """
    if not raw_value:
        return None
    return raw_value.replace('\\', '/').rsplit('/', 1)[-1]


def extract_map_param(raw_query_string):
    """
        extract the &map parameter from the original request's query string
    """
    if not raw_query_string:
        return None
    nested_params = parse_qs(raw_query_string)
    for key in ('map', 'MAP'):
        if nested_params.get(key):
            return nested_params[key][0]
    return None


def find_project(projects, map_value, qgis_projects_folder):
    """
        Matches the requested QGIS project (&map parameter) against projects.json entries.
        Match by project's qgisProjectFilename (concatenates QGIS_PROJECTS_FOLDER + qgisProjectFilename).
    """
    for project in projects:
        entry_filename = project.get("qgisProjectFilename")
        if entry_filename and map_value == os.path.join(qgis_projects_folder, entry_filename):
            return project
    return None


def is_authorized(project, user_roles, admin_role):
    """
    Checks if the user has access to the project based on user's roles and the project's requiredRole from projects.json.
    
    Mirrors projlist.component.ts's hasAccess(): `requiredRole` absent on
    the project -> everyone allowed; `requiredRole` present (including an
    empty list) -> only matching roles (or the admin role) are allowed.
    Only called for a project that was actually found in projects.json -
    callers must handle a project-not-found lookup separately (see
    OGITO_OPEN_PROJECT_FILES in authorize()).
    """
    required_role = project.get("requiredRole")
    if required_role is None:
        return True
    if admin_role and admin_role in user_roles:
        return True
    return any(role in user_roles for role in required_role)


def resolve_roles_claim(claims, path):
    """
    Parse (custom) role claims from the decoded JWT.
    
    Mirrors auth.service.ts's resolveClaim(): try `path` as a flat key
    first (handles Auth0's dotted namespaced claim, e.g.
    "https://ogito.app/roles"), and only if that misses AND `path` contains
    a dot, fall back to splitting on '.' and traversing nested objects
    (handles Keycloak-style "realm_access.roles").
    """
    if not claims or not path:
        return None
    if path in claims:
        return claims[path]
    if "." in path:
        value = claims
        for key in path.split("."):
            if not isinstance(value, dict) or key not in value:
                return None
            value = value[key]
        return value
    return None


def get_jwks_client(jwks_uri):
    if _jwks_client_cache["jwks_uri"] != jwks_uri:
        _jwks_client_cache["jwks_uri"] = jwks_uri
        _jwks_client_cache["client"] = PyJWKClient(jwks_uri)
    return _jwks_client_cache["client"]


def decode_token_validated(token, jwks_uri, issuer, audience, algorithms):
    """
    Verifies the signature of the access token (via the IdP's JSON Web Key Set (JWKS)) 
    and issuer, expiry and  audience (if configured). 
    
    Returns the decoded claims on success, or None (logging the reason) on any failure
    """
    try:
        jwks_client = get_jwks_client(jwks_uri)
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        decode_kwargs = {"algorithms": algorithms, "issuer": issuer}
        if audience:
            decode_kwargs["audience"] = audience
        return jwt.decode(token, signing_key, **decode_kwargs)
    except jwt.PyJWTError as e:
        logging.warning(f"token validation failed: {e}")
        return None
    except Exception as e:
        logging.warning(f"token validation failed (JWKS lookup error): {e}")
        return None


def decode_token_unverified(token):
    """
    Returns the decoded claims without  validating the access token (compare to decode_token_validated()).

    Only used when OGITO_VALIDATE_TOKEN is set to false (e.g. when the gateway in front of this service already handles validation, e.g. Apache mod_auth_openidc).
    """
    try:
        return jwt.decode(token, options={"verify_signature": False})
    except jwt.PyJWTError as e:
        logging.warning(f"token decode (unverified) failed: {e}")
        return None


def authorize(environ, start_response):
    def respond(status, output):
        response_body = json.dumps(output, indent=2).encode('utf-8')
        start_response(status, [
            ('Content-Type', 'application/json'),
            ('Content-Length', str(len(response_body)))
        ])
        return [response_body]

    # config is passed through from the webserver (e.g Apache vhost) via `SetEnv`
    projects_json_path = environ.get('OGITO_PROJECTS_JSON_PATH', '/etc/ogito/projects.json')
    admin_role = environ.get('OGITO_ADMIN_ROLE', '')
    roles_claim = environ.get('OGITO_ROLES_CLAIM') or DEFAULT_ROLES_CLAIM
    jwks_uri = environ.get('OGITO_OIDC_JWKS_URI', '')
    issuer = environ.get('OGITO_OIDC_ISSUER', '')
    audience = environ.get('OGITO_OIDC_AUDIENCE', '')
    algorithms = [alg.strip() for alg in environ.get('OGITO_OIDC_ALGORITHMS', 'RS256').split(',') if alg.strip()]
    open_project_files = {
        name.strip() for name in environ.get('OGITO_OPEN_PROJECT_FILES', '').split(',') if name.strip()
    }
    # the QGIS_PROJECTS_FOLDER is used to match the &map parameter against the qgisProjectFilename in projects.json
    qgis_projects_folder = environ.get('QGIS_PROJECTS_FOLDER', '')
    # disable token validation in this script; only do this if the gateway in front of this service already handles validation (e.g. Apache mod_auth_openidc)
    token_validation_enabled = environ.get('OGITO_VALIDATE_TOKEN', 'true').strip().lower() not in ('false', '0', 'no', 'off')

    # a Bearer access token is required either way - roles are derived only
    # from it, never from request input
    auth_header = environ.get('HTTP_AUTHORIZATION', '')
    if not auth_header.startswith('Bearer ') or len(auth_header) <= len('Bearer '):
        return respond('401 Unauthorized', {"errors": ["Missing or malformed Authorization header."]})
    token = auth_header[len('Bearer '):]

    if token_validation_enabled:
        if not jwks_uri or not issuer:
            logging.warning("authorize: OGITO_OIDC_JWKS_URI/OGITO_OIDC_ISSUER not configured")
            return respond('500 Internal Server Error', {"errors": ["authorization service is not configured"]})
        claims = decode_token_validated(token, jwks_uri, issuer, audience, algorithms)
    else:
        claims = decode_token_unverified(token) 

    if claims is None:
        return respond('401 Unauthorized', {"errors": ["invalid or expired token"]})

    # get user's roles from roles claim
    roles = resolve_roles_claim(claims, roles_claim)
    user_roles = roles if isinstance(roles, list) else []

    # The caller passes through the ORIGINAL QGIS Server request's full
    # query string verbatim as our own `query` parameter - this service (not
    # the caller) extracts the `map`/`MAP` parameter from within it.
    query_string = environ.get('QUERY_STRING', '')
    params = parse_qs(query_string)
    original_query = params.get('query', [None])[0]

    if not original_query:
        return respond('400 Bad Request', {"errors": ["Missing mandatory 'query' parameter."]})

    map_value = extract_map_param(original_query)
    qgs_filename = extract_qgs_filename(map_value)

    if not qgs_filename:
        return respond('400 Bad Request', {"errors": ["Provided 'query' does not contain a 'map' parameter."]})

    projects = load_projects(projects_json_path)
    if projects is None:
        return respond('500 Internal Server Error', {"errors": ["unable to load project configuration"]})

    project = find_project(projects, map_value, qgis_projects_folder)

    if project is None:
        if qgs_filename in open_project_files:
            return respond('200 OK', {"project": qgs_filename, "allowed": True})
        # unlisted and not explicitly whitelisted -> fail closed
        return respond('403 Forbidden', {"project": qgs_filename, "allowed": False, "message": "project is not registered"})

    if is_authorized(project, user_roles, admin_role):
        return respond('200 OK', {"project": qgs_filename, "allowed": True})

    return respond('403 Forbidden', {"project": qgs_filename, "allowed": False, "message": "user roles do not satisfy this project's requiredRole"})


if __name__ == '__main__':
    # Check if running in terminal (interactive/dev) or via Web Server
    if sys.stdin.isatty():
        print("--- Running in Local Test Mode ---")
        print("Set OGITO_TEST_TOKEN to a real access token before running this for a meaningful test.")

        def dummy_start_response(status, headers):
            print(f"Headers: {headers}")
            print(f"Status: {status}")

        debug = True
        test_token = os.environ.get('OGITO_TEST_TOKEN', '')
        # simulates the caller passing through a real QGIS Server request's
        sample_qgis_query = 'SERVICE=WMS&VERSION=1.3.0&map=/etc/qgisserver/ogito_starter.qgs&REQUEST=GetMap'
        test_request = {
            'QUERY_STRING': f'query={quote(sample_qgis_query, safe="")}',
            'HTTP_AUTHORIZATION': f'Bearer {test_token}' if test_token else '',
            'OGITO_PROJECTS_JSON_PATH': '../../src/assets/configuration/projects.json',
            'OGITO_ADMIN_ROLE': 'OGITO_ADMIN',
            'OGITO_OIDC_JWKS_URI': os.environ.get('OGITO_OIDC_JWKS_URI', ''),
            'OGITO_OIDC_ISSUER': os.environ.get('OGITO_OIDC_ISSUER', ''),
            'OGITO_OIDC_AUDIENCE': os.environ.get('OGITO_OIDC_AUDIENCE', ''),
            'OGITO_OIDC_ALGORITHMS': os.environ.get('OGITO_OIDC_ALGORITHMS', 'RS256'),
            'OGITO_VALIDATE_TOKEN': os.environ.get('OGITO_VALIDATE_TOKEN', 'true'),
        }
        result = authorize(test_request, dummy_start_response)
        print(result[0].decode("utf-8"))
    else:
        # When called by FastCGI (e.g via Apache)
        WSGIServer(authorize).run()
