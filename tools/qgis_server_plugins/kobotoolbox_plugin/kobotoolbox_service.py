import json
import traceback
import urllib.error

from qgis.core import Qgis, QgsMessageLog
from qgis.server import QgsService

from .submissions_to_geojson import build_geojson, fetch_attachment
from .request_validation import validate_request, RequestValidationError

LOG_TAG = "KoboToolboxService"


class KoboToolboxService(QgsService):
    """QGIS Server custom service - a request with &SERVICE=KOBOTOOLBOX,
    a mandatory &map=<qgis project path> (like any "normal" QGIS Server
    request) and a mandatory &asset=<kobo asset uid> is routed here. `map`
    is not used to render anything here - it only has to name a QGIS
    project that projects.json actually registers `asset` under (see
    request_validation.py's is_registered_map_asset()), so an asset can't
    be fetched through a `map` value it isn't associated with. No other
    query parameters are accepted. Two modes:

    - &map=<path>&asset=<uid> alone: fetches that KoboToolbox form's
      submissions (see submissions_to_geojson.py for the actual KoboToolbox
      API logic and its remaining configuration) and returns them as a
      GeoJSON FeatureCollection, whose attachment properties are proxy URLs
      back to this same service (see the second mode) rather than
      KoboToolbox's own direct download_url.
    - &map=<path>&asset=<uid>&submission=<id>&attachment=<id>: proxies one
      specific attachment's raw bytes straight through from KoboToolbox,
      with its real Content-Type.
    """

    def __init__(self):
        QgsService.__init__(self)

    def name(self):
        return "KOBOTOOLBOX"

    def version(self):
        return "1.0.0"

    def executeRequest(self, request, response, project):
        # request.parameters() keys are uppercased by QGIS Server regardless
        # of how the client sent them (e.g. "asset" or "Asset" both land
        # under "ASSET" here) - verified against a live QGIS Server
        # instance. Note this is unrelated to SERVICE's own VALUE, which
        # must match name() exactly ("KOBOTOOLBOX") - also verified live:
        # "&SERVICE=kobotoolbox" (lowercase) is NOT routed here at all.
        params = request.parameters()

        try:
            map_value, asset_uid = validate_request(params)
        except RequestValidationError as e:
            self._respond_error(response, e.status_code, e.error, e.message)
            return

        submission_id = params.get("SUBMISSION")
        attachment_id = params.get("ATTACHMENT")

        if submission_id or attachment_id:
            if not (submission_id and attachment_id):
                self._respond_error(response, 400, "'submission' and 'attachment' must both be given together.")
                return
            self._proxy_attachment(response, asset_uid, submission_id, attachment_id)
            return

        self._respond_geojson(response, asset_uid, map_value)

    def _respond_geojson(self, response, asset_uid, map_value):
        try:
            geojson = build_geojson(
                log=lambda msg: QgsMessageLog.logMessage(msg, LOG_TAG, Qgis.Info),
                asset_uid=asset_uid,
                proxy_attachments=True,
                map_value=map_value,
            )
        except Exception as e:
            QgsMessageLog.logMessage(
                f"Failed to build KoboToolbox GeoJSON: {e}\n{traceback.format_exc()}",
                LOG_TAG,
                Qgis.Critical,
            )
            self._respond_error(response, 500, "Failed to fetch KoboToolbox submissions.", str(e))
            return

        response.setStatusCode(200)
        response.setHeader("Content-Type", "application/json")
        response.write(json.dumps(geojson))

    def _proxy_attachment(self, response, asset_uid, submission_id, attachment_id):
        try:
            content, content_type = fetch_attachment(asset_uid, submission_id, attachment_id)
        except urllib.error.HTTPError as e:
            # propagate KoboToolbox's own status (e.g. a real 404) instead of
            # always reporting 500 for what might just be a bad id
            self._respond_error(response, e.code, "KoboToolbox rejected the attachment request.", str(e))
            return
        except Exception as e:
            QgsMessageLog.logMessage(
                f"Failed to fetch KoboToolbox attachment: {e}\n{traceback.format_exc()}",
                LOG_TAG,
                Qgis.Critical,
            )
            self._respond_error(response, 500, "Failed to fetch KoboToolbox attachment.", str(e))
            return

        response.setStatusCode(200)
        response.setHeader("Content-Type", content_type)
        response.write(content)

    def _respond_error(self, response, status_code, error, message=None):
        body = {"error": error}
        if message:
            body["message"] = message
        response.setStatusCode(status_code)
        response.setHeader("Content-Type", "application/json")
        response.write(json.dumps(body))


class KoboToolboxServerPlugin:

    def __init__(self, serverIface):
        serverIface.serviceRegistry().registerService(KoboToolboxService())
