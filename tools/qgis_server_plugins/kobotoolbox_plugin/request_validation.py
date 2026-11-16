from . import config


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


def validate_request(params):
    """Validates an incoming KOBOTOOLBOX request's parameters: rejects any
    parameter outside ALLOWED_PARAMS, and requires `asset` - the only
    parameter this plugin actually needs to operate, since it's used
    directly to call the KoboToolbox API.

    Authorizing the request - matching &map against projects.json and
    checking that `asset` is actually registered under it - now happens
    upstream, in tools/project_authz's authorize.fcgi (see its
    kobotoolbox_authz.py), before a request ever reaches this plugin. `map`
    therefore stays an allowed parameter (the frontend still sends it, and
    it's threaded into generated attachment proxy URLs - see
    kobotoolbox_service.py and submissions_to_geojson.py's
    build_attachment_proxy_url()) but is no longer required or validated
    here.

    Returns the validated asset_uid on success. Raises
    RequestValidationError(400, ...) if an unexpected parameter is present
    or `asset` is missing.
    """
    unexpected_params = set(params.keys()) - config.ALLOWED_PARAMS
    if unexpected_params:
        raise RequestValidationError(
            400, "Unexpected parameter(s): " + ", ".join(sorted(unexpected_params))
        )

    asset_uid = params.get("ASSET")
    if not asset_uid:
        raise RequestValidationError(400, "Missing mandatory 'asset' parameter.")

    return asset_uid
