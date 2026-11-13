import { HttpClient } from "@angular/common/http";

/** HTML-escapes a string value for safe insertion into innerHTML. */
export function escapeHtml(value: string): string {
	const div = document.createElement("div");
	div.textContent = value;
	return div.innerHTML;
}

/**
 * Validates that `value` actually matches the attachment-proxy query string
 * this app's own KOBOTOOLBOX service plugin emits (see
 * build_attachment_proxy_url() in
 * tools/qgis_server_plugins/kobotoolbox_plugin/submissions_to_geojson.py),
 * e.g. "?service=KOBOTOOLBOX&map=<path>&asset=<uid>&submission=<id>&attachment=<id>",
 * and if so resolves it into a full URL against the QGIS Server endpoint.
 * Returns null for anything else (including other kinds of URLs/strings),
 * which keeps it rendered as a plain value instead. `map` is required here
 * too since kobotoolbox_service.py now rejects any request without it.
 */
export function resolveKoboToolboxAttachmentUrl(
	value: any,
	qGsServerUrl: string,
): string | null {
	if (typeof value !== "string" || !value.startsWith("?")) {
		return null;
	}
	const params = new URLSearchParams(value.slice(1));
	const isKoboToolboxAttachmentUrl =
		params.get("service") === "KOBOTOOLBOX" &&
		!!params.get("map") &&
		!!params.get("asset") &&
		!!params.get("submission") &&
		!!params.get("attachment");
	if (!isKoboToolboxAttachmentUrl) {
		return null;
	}
	const qgisServerBase = qGsServerUrl.endsWith("?") ? qGsServerUrl.slice(0, -1) : qGsServerUrl;
	return qgisServerBase + value;
}

export interface KoboToolboxAttachmentCell {
	url: string;
	cellId: string;
}

export interface KoboToolboxFeatureInfoTable {
	html: string;
	attachmentCells: KoboToolboxAttachmentCell[];
}

/**
 * Builds the feature-info popup's table HTML for one KoboToolbox feature's
 * properties. Any property value matching the attachment-proxy URL shape
 * (see resolveKoboToolboxAttachmentUrl()) gets a placeholder cell instead of
 * its raw value, listed in `attachmentCells` for the caller to then load via
 * loadKoboToolboxAttachmentPreview() - this function itself does not fetch
 * anything, it only decides which values should be fetched.
 */
export function buildKoboToolboxFeatureInfoTable(
	featureValues: Record<string, any>,
	requestId: number,
	qGsServerUrl: string,
): KoboToolboxFeatureInfoTable {
	let text = "";
	const attachmentCells: KoboToolboxAttachmentCell[] = [];
	let cellCounter = 0;

	for (const key in featureValues) {
		const value = featureValues[key];
		if (value === null || value === undefined || typeof value === "object") {
			continue; // skip empty/complex values, same convention as displayFeatureInfoWFS
		}
		const attachmentUrl = resolveKoboToolboxAttachmentUrl(value, qGsServerUrl);
		if (attachmentUrl) {
			const cellId = `koboAttachment-${requestId}-${cellCounter++}`;
			attachmentCells.push({ url: attachmentUrl, cellId });
			text += `<tr><td>${escapeHtml(key)}</td><td id="${cellId}">Loading attachment…</td></tr>`;
		} else {
			text += `<tr><td>${escapeHtml(key)}</td><td>${escapeHtml(String(value))}</td></tr>`;
		}
	}

	const html =
		'<div id="popupDiv">' +
		"<table class=featureInfoTable>" +
		"<tr><th>Attribute</th><th>Value</th></tr>" +
		text +
		"</table>" +
		"</div>";

	return { html, attachmentCells };
}

/**
 * Fetches one KoboToolbox attachment through the authenticated HttpClient
 * and renders it inline as an image/audio/video element into the DOM cell
 * identified by `cellId`, once its real Content-Type is known.
 *
 * `getCurrentRequestId()` is checked before touching the DOM - if it no
 * longer matches `requestId`, the user has already navigated to a different
 * feature and this (now stale) response is silently discarded. Without this,
 * a slow attachment response can land in a DOM cell that now belongs to a
 * different feature (two different features' cells can otherwise share the
 * same generated id).
 */
export function loadKoboToolboxAttachmentPreview(
	url: string,
	cellId: string,
	requestId: number,
	http: HttpClient,
	getCurrentRequestId: () => number,
	onAttachmentReady: () => void,
): void {
	http.get(url, { responseType: "blob", observe: "response" }).subscribe({
		next: (response) => {
			if (requestId !== getCurrentRequestId()) {
				return; // the user already navigated to a different feature - discard
			}
			const cell = document.getElementById(cellId);
			if (!cell || !response.body) {
				return; // popup was closed/replaced before the response arrived
			}
			const contentType = response.headers.get("Content-Type") || "";
			const objectUrl = URL.createObjectURL(response.body);
			cell.innerHTML = "";

			if (contentType.startsWith("image/")) {
				const img = document.createElement("img");
				img.className = "imgInfo";
				img.alt = "attachment";
				img.addEventListener(
					"load",
					() => {
						URL.revokeObjectURL(objectUrl);
						onAttachmentReady(); // the popup just grew - keep it fully in view
					},
					{ once: true },
				);
				img.src = objectUrl;
				cell.appendChild(img);
			} else if (contentType.startsWith("audio/")) {
				const audio = document.createElement("audio");
				audio.controls = true;
				audio.addEventListener("loadedmetadata", onAttachmentReady, { once: true });
				audio.src = objectUrl;
				cell.appendChild(audio);
			} else if (contentType.startsWith("video/")) {
				const video = document.createElement("video");
				video.controls = true;
				video.style.maxWidth = "100%";
				video.addEventListener("loadedmetadata", onAttachmentReady, { once: true });
				video.src = objectUrl;
				cell.appendChild(video);
			} else {
				cell.textContent = contentType
					? "Unsupported attachment type: " + contentType
					: "Unable to load attachment";
			}
		},
		error: () => {
			if (requestId !== getCurrentRequestId()) {
				return;
			}
			const cell = document.getElementById(cellId);
			if (cell) {
				cell.textContent = "Failed to load attachment";
			}
		},
	});
}
