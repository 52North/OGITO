import json
import re
import urllib.request
from urllib.parse import quote

# ==========================================
# 1. Configuration
# ==========================================
TOKEN = ""
ASSET_UID = ""
KOBO_URL = ""
OUTPUT_FILE = "kobo_submissions.geojson"

# Properties to drop from the output besides the "_"-prefixed Kobo metadata
STRIP_PROPERTIES = ["meta/instanceID", "formhub/uuid", "GPS_Accuracy", "deviceid"]

# True: use each question's full label (from content.survey.<entry>.label) as the property key.
# False: keep the original technical/short field name (e.g. "qualify/type").
USE_FULL_LABELS = True

# Which language's labels to use, matching an entry of the form's content.translations
# exactly (e.g. "English (en)"). None picks the form's first/default language.
LANGUAGE = None

headers = {"Authorization": f"Token {TOKEN}"}

# Matches XLSForm relevant expressions like: selected(${develop},'6')
OTHER_RELEVANT_RE = re.compile(r"selected\(\$\{(\w+)\},\s*'([^']+)'\)")

def get_label_string(label_val, lang_index=0):
    """Safely extract a label string from Kobo's schemas (handles multi-language dicts/lists).

    Prefers the translation at `lang_index`, falling back to the first non-empty
    translation if that one is missing/blank for this particular item.
    """
    if isinstance(label_val, dict):
        values = list(label_val.values())
    elif isinstance(label_val, list):
        values = label_val
    else:
        return str(label_val)

    if not values:
        return ""

    if 0 <= lang_index < len(values) and values[lang_index]:
        return str(values[lang_index])

    for value in values:
        if value:
            return str(value)

    return ""

def fetch_json(url):
    """GET a URL with the configured auth header and parse the JSON body."""
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request) as response:
        return json.loads(response.read().decode("utf-8"))

def build_attachment_proxy_url(asset_uid, submission_id, attachment_id, map_value):
    """Builds a same-origin query string back to this QGIS Server service's
    own &SERVICE=KOBOTOOLBOX endpoint for one specific attachment, instead
    of exposing KoboToolbox's own direct download_url. Resolved relative to
    whatever base URL the GeoJSON itself was requested from. See
    fetch_attachment() for the other half of this proxying.

    `map_value` is required here too (kobotoolbox_service.py validates every
    request's &map against projects.json, including this one) so it must be
    threaded through from whatever &map the original GeoJSON request carried.
    """
    return (
        "?service=KOBOTOOLBOX"
        f"&map={quote(str(map_value), safe='')}"
        f"&asset={quote(str(asset_uid), safe='')}"
        f"&submission={quote(str(submission_id), safe='')}"
        f"&attachment={quote(str(attachment_id), safe='')}"
    )

def fetch_attachment(asset_uid, submission_id, attachment_id):
    """Fetches one attachment's raw bytes directly from KoboToolbox - the
    exact endpoint download_url already points at
    (.../assets/<asset>/data/<submission>/attachments/<attachment>/,
    verified to directly return the binary with its real Content-Type, not
    a redirect) - for the QGIS Server plugin to proxy back to its own
    caller. Returns (content_bytes, content_type).
    """
    url = f"{KOBO_URL}/api/v2/assets/{asset_uid}/data/{submission_id}/attachments/{attachment_id}/"
    request = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(request) as response:
        content_type = response.headers.get("Content-Type", "application/octet-stream")
        return response.read(), content_type

def build_geojson(log=print, asset_uid=None, proxy_attachments=False, map_value=None):
    """Fetches the KoboToolbox form schema and submissions, and builds a
    GeoJSON FeatureCollection dict from them. Does not write anything to
    disk - callers decide what to do with the result (main() below writes it
    to OUTPUT_FILE for the CLI use case; the QGIS Server plugin instead
    returns it directly as the HTTP response body).

    `log` receives the same progress messages main() used to print()
    directly - the plugin passes a QGIS logging callback instead, since
    writing to stdout from within a running QGIS Server (FastCGI) process
    would corrupt its response stream.

    `asset_uid` overrides the module-level ASSET_UID default - the service
    plugin always passes the request's own `&asset` parameter here instead
    of relying on this hardcoded default; the CLI (main()) still uses it.

    `proxy_attachments`: if True, attachment fields are same-origin proxy
    URLs back to this QGIS Server service (see build_attachment_proxy_url())
    instead of KoboToolbox's own direct download_url - only meaningful when
    the result is actually served through that service. The CLI's static
    file export (main()) leaves this False, since a relative proxy URL
    would be meaningless once written to a standalone .geojson file with no
    QGIS Server to resolve it against.

    `map_value`: required whenever `proxy_attachments` is True - the
    request's own validated &map value, threaded into each generated
    attachment proxy URL (see build_attachment_proxy_url()) since
    kobotoolbox_service.py requires &map on every request, including those.
    """
    asset_uid = asset_uid or ASSET_UID

    # ==========================================
    # 2. Fetch Form Schema & Build Label Map
    # ==========================================
    log("Fetching form schema...")
    asset_data = fetch_json(f"{KOBO_URL}/api/v2/assets/{asset_uid}.json")

    # Resolve which translation index to read labels from
    translations = asset_data['content'].get('translations') or []
    if LANGUAGE is None:
        lang_index = 0
    elif LANGUAGE in translations:
        lang_index = translations.index(LANGUAGE)
    else:
        log(f"Warning: LANGUAGE '{LANGUAGE}' not found in {translations}. Using the first language instead.")
        lang_index = 0

    # Build Label Map: {list_name: {name: label}}
    label_map = {}
    for choice in asset_data['content'].get('choices', []):
        l_name = choice.get('list_name')
        c_name = choice.get('name')
        c_label = get_label_string(choice.get('label'), lang_index)

        if l_name and c_name is not None:
            label_map.setdefault(l_name, {})[str(c_name)] = c_label

    # Build Question to List Map: {question_xpath_or_name: list_name}
    # Build Other-Text Map: {select_question_name: {"other_code": code, "other_field": other_question_name}}
    # Build Question Label Map: {question_xpath_or_name: real, disambiguated question label}
    question_to_list = {}
    other_field_map = {}

    # Labels are free text, not identifiers, so two questions can legitimately share
    # the same wording (e.g. "Kommentar" repeated in several groups). Collect one
    # entry per question first, so colliding labels can be disambiguated afterwards
    # with their enclosing group's label instead of silently overwriting each other.
    raw_label_entries = []  # (primary_id, short_name, label_text, parent_group_label)
    group_stack = []

    for q in asset_data['content'].get('survey', []):
        q_type = str(q.get('type', ''))
        name = q.get('name')
        label_raw = q.get('label')

        if q_type in ('end_group', 'end_repeat'):
            if group_stack:
                group_stack.pop()
            continue

        if label_raw:
            label_text = get_label_string(label_raw, lang_index)
            primary_id = q.get('$xpath', name)
            if primary_id:
                parent_group_label = group_stack[-1] if group_stack else None
                raw_label_entries.append((primary_id, name, label_text, parent_group_label))

        if q_type in ('begin_group', 'begin_repeat'):
            group_stack.append(get_label_string(label_raw, lang_index) if label_raw else (name or ''))
            continue

        if q_type.startswith(('select_one', 'select_multiple')):
            # Kobo stores the list name either directly in the type string or in 'select_from_list_name'
            list_name = q.get('select_from_list_name')
            if not list_name and ' ' in q_type:
                list_name = q_type.split(' ', 1)[1]

            if list_name:
                # Match the exact data column name ($xpath) which Kobo uses for grouped questions
                xpath = q.get('$xpath', q.get('name'))
                if xpath:
                    question_to_list[xpath] = list_name
                # Fallback to just the short name
                if name:
                    question_to_list[name] = list_name

        elif q_type == 'text' and name and name.endswith('_other'):
            # Link "Other" free-text fields to the specific option code that reveals them,
            # e.g. relevant="${develop} = '3' and selected(${develop},'6')"
            match = OTHER_RELEVANT_RE.search(q.get('relevant') or '')
            if match:
                select_name, other_code = match.group(1), match.group(2)
                other_field_map[select_name] = {"other_code": other_code, "other_field": name}

    other_leaf_names = {info["other_field"] for info in other_field_map.values()}

    def resolve_display_key(key, leaf_name):
        if USE_FULL_LABELS:
            return question_labels.get(key) or question_labels.get(leaf_name) or key
        return key

    def flatten_fields(fields, att_map, prefix=""):
        """Flatten one row (or one repeat-group iteration) into GeoJSON properties.

        Repeat groups come back from Kobo as a list of answer-dicts (one per
        repetition) instead of flat columns, so they are recursed into here and
        each iteration is disambiguated with a 1-based counter in its key
        (e.g. "Haushaltsmitglied_1/Alter", "Haushaltsmitglied_2/Alter").
        """
        result = {}
        leaf_to_fullkey = {key.split('/')[-1]: key for key in fields.keys()}

        for key, val in fields.items():
            if key == '_geolocation':
                continue

            leaf_name = key.split('/')[-1]

            # "Other" free-text fields are merged into their select field's label below,
            # so they are not emitted as standalone properties.
            if leaf_name in other_leaf_names:
                continue

            display_key = f"{prefix}{resolve_display_key(key, leaf_name)}"

            # Repeat group: a list of one answer-dict per repetition
            if isinstance(val, list) and val and all(isinstance(item, dict) for item in val):
                for idx, item in enumerate(val, start=1):
                    result.update(flatten_fields(item, att_map, prefix=f"{display_key}_{idx}/"))
                continue

            # 1. Media Field Replacement
            if isinstance(val, str) and val in att_map:
                result[display_key] = att_map[val]
                continue

            # 2. Label Mapping: Replace the raw technical code(s) with the actual label(s)
            # Check both the exact full path and the isolated leaf node name
            list_name = question_to_list.get(key) or question_to_list.get(leaf_name)

            if list_name and val is not None and list_name in label_map:
                val_str = str(val)
                codes = val_str.split(' ') if ' ' in val_str else [val_str]
                other_info = other_field_map.get(leaf_name)

                labels = []
                for code in codes:
                    label_text = label_map[list_name].get(code, code)
                    if other_info and code == other_info["other_code"]:
                        other_key = leaf_to_fullkey.get(other_info["other_field"])
                        other_val = fields.get(other_key) if other_key else None
                        if other_val:
                            label_text = f"{label_text}: {other_val}"
                    labels.append(label_text)

                result[display_key] = ', '.join(labels)
            else:
                # Keep the raw value (non-select fields, or codes without a matching list)
                result[display_key] = val

        return result

    # Disambiguate: only touch labels that actually collide across different questions.
    label_to_ids = {}
    for primary_id, _, label_text, _ in raw_label_entries:
        label_to_ids.setdefault(label_text, set()).add(primary_id)

    question_labels = {}
    claimed_labels = {}  # final display label -> primary_id that owns it
    for primary_id, name, label_text, parent_group_label in raw_label_entries:
        if len(label_to_ids[label_text]) > 1 and parent_group_label:
            display_label = f"{parent_group_label}: {label_text}"
        else:
            display_label = label_text

        # Extremely rare fallback: even the group-qualified label still collides
        # (e.g. two identically-labeled questions in the very same group).
        # Append a counter rather than letting one silently overwrite the other.
        final_label = display_label
        suffix = 2
        while final_label in claimed_labels and claimed_labels[final_label] != primary_id:
            final_label = f"{display_label} ({suffix})"
            suffix += 1
        claimed_labels[final_label] = primary_id

        question_labels[primary_id] = final_label
        if name:
            question_labels[name] = final_label

    # ==========================================
    # 3. Fetch Submissions Data
    # ==========================================
    log("Fetching submissions...")
    data = fetch_json(f"{KOBO_URL}/api/v2/assets/{asset_uid}/data.json")
    submissions = data.get('results', [])

    if not submissions:
        log("No submissions found.")
        return {"type": "FeatureCollection", "features": []}

    # ==========================================
    # 4. Construct GeoJSON Features
    # ==========================================
    log(f"Processing {len(submissions)} submissions...")
    features = []

    for row in submissions:
        # A. Setup Geometry
        geom = None
        if '_geolocation' in row and isinstance(row['_geolocation'], list) and len(row['_geolocation']) >= 2:
            lat, lon = row['_geolocation'][0], row['_geolocation'][1]
            if lat is not None and lon is not None:
                geom = {
                    "type": "Point",
                    "coordinates": [float(lon), float(lat)]
                }

        # B. Setup Attachment Lookup for this row: either KoboToolbox's own
        # download_url (default), or - if proxy_attachments is set - a
        # same-origin proxy URL back to this QGIS Server service instead
        # (see build_attachment_proxy_url() and the proxy_attachments
        # docstring above).
        submission_id = row.get('_id')
        att_map = {}
        if '_attachments' in row:
            for att in row['_attachments']:
                basename = att.get('filename', '').split('/')[-1]
                if proxy_attachments and submission_id is not None and att.get('id') is not None:
                    att_map[basename] = build_attachment_proxy_url(asset_uid, submission_id, att['id'], map_value)
                elif not proxy_attachments:
                    att_map[basename] = att.get('download_url')

        # C. Build Properties (recurses into repeat groups, see flatten_fields)
        properties = flatten_fields(row, att_map)

        # D. Strip Kobo's internal "_"-prefixed metadata properties, keeping only
        # "_id" and "_submission_time" (renamed to "id" and "submission_time"),
        # and drop any additional configured properties.
        properties = {
            ('id' if k == '_id' else 'submission_time' if k == '_submission_time' else k): v
            for k, v in properties.items()
            if (k in ('_id', '_submission_time') or not k.startswith('_'))
            and k not in STRIP_PROPERTIES
        }

        # E. Ensure "submission_time" is always the last property
        if 'submission_time' in properties:
            properties['submission_time'] = properties.pop('submission_time')

        # F. Append to Feature List
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": properties
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }


def main():
    """CLI entry point: builds the GeoJSON (see build_geojson()) and writes
    it to OUTPUT_FILE, printing progress straight to the console.
    """
    geojson_output = build_geojson(log=print)

    if not geojson_output["features"]:
        return

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(geojson_output, f, indent=2, ensure_ascii=False)

    print(f"Success! GeoJSON saved to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
