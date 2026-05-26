"""
ample. local dev server
=======================

Serves project/ as static files AND accepts editor uploads, so the Tweaks
panel's drag-and-drop image flow writes straight into project/assets/ with
no File System Access pickers, no permission dance, no Downloads detour.

Run:
    py dev-server.py            # http://127.0.0.1:8000/

Endpoints:
    GET  /                      → project/index.html
    GET  /<path>                → project/<path>   (static)
    GET  /__editor/ping         → { ok: true, server: "ample-dev", version: 1 }
    PUT  /assets/<safe-name>    → writes body to project/assets/<safe-name>
                                  (allowlisted extensions, 16 MB cap, atomic)
    POST /__editor/save_index   → body { tweaksJson: "..." }; replaces the
                                  /*EDITMODE-BEGIN*/.../*EDITMODE-END*/ block
                                  in project/index.html, atomic

Safety: bound to 127.0.0.1 so only this machine can reach it. Filename
allowlist + size cap + path-traversal rejection on every write. No shell
execution, no arbitrary file writes — only assets/ and index.html.
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import json
import os
import re
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, 'project')
ASSETS = os.path.join(ROOT, 'assets')
INDEX_HTML = os.path.join(ROOT, 'index.html')

HOST = '127.0.0.1'
PORT = int(os.environ.get('AMPLE_DEV_PORT', '8000'))

# 16 MB. Retina photos easily reach 5-10 MB before re-encode; bigger than
# that is almost certainly a mistake or abuse.
MAX_UPLOAD = 16 * 1024 * 1024

# Allowlist of safe filenames. Lowercase, starts alphanumeric, only
# [a-z0-9._-] inside, must end in a known media extension. Rejects
# path traversal (no /, \\, ..) by construction.
#
# SVG is intentionally NOT in this list — an attacker can drag an
# <svg onload="..."> from another tab and once it lands in assets/ + ships
# to GitHub Pages, direct navigation to the file executes in the site's
# origin. Static-render-only formats keep the surface tight.
SAFE_NAME_RE = re.compile(
    r'^[a-z0-9][a-z0-9._-]{0,127}'
    r'\.(png|jpe?g|webp|avif|gif|mp4|webm|mov|m4v)$',
    re.I,
)

# Origin allowlist for write endpoints (PUT /assets/*, POST /__editor/*).
# Loopback-bind prevents shells on other hosts from reaching us, but it
# does NOT stop a browser tab open to evil.com from hitting our endpoints
# (the OS routes the request out of the malicious tab to 127.0.0.1).
# Only echo the Origin header when it's actually loopback; cross-origin
# writes get a 403.
def _is_loopback_origin(origin):
    if not origin:
        return False
    return (
        origin.startswith('http://127.0.0.1:')
        or origin.startswith('http://localhost:')
        or origin == 'null'  # file:// pages have origin "null" — fine on dev
    )

# Marker pair that brackets the JSON block we rewrite on Save & lock.
EDITMODE_RE = re.compile(
    r'/\*EDITMODE-BEGIN\*/[\s\S]*?/\*EDITMODE-END\*/'
)


def _max_mtime(root):
    """Return the latest mtime under root, used by /__editor/version so the
    editor client can detect when source changed on disk and reload.
    Skips:
      - assets/  — uploads bump on every drop, would auto-reload mid-edit
      - dotfiles + .tmp atomic-write residue
    """
    latest = 0.0
    for dirpath, dirnames, filenames in os.walk(root):
        # Don't descend into hidden dirs or the noisy assets/ folder
        dirnames[:] = [d for d in dirnames if not d.startswith('.') and d != 'assets']
        for name in filenames:
            if name.startswith('.') or name.endswith('.tmp'):
                continue
            try:
                mt = os.path.getmtime(os.path.join(dirpath, name))
                if mt > latest:
                    latest = mt
            except OSError:
                pass
    return latest


class DevHandler(SimpleHTTPRequestHandler):
    server_version = 'ample-dev/1'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    # ── logging ────────────────────────────────────────────────────────
    def log_message(self, fmt, *args):
        # Mute 304s; keep everything else readable.
        line = fmt % args
        if ' 304 ' in line:
            return
        sys.stderr.write('%s  %s\n' % (self.log_date_time_string(), line))

    # ── CORS / cache ────────────────────────────────────────────────────
    def end_headers(self):
        # No browser cache on dev — saves you from refresh-after-edit hell.
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def _cors(self):
        # Loopback-bind blocks shells on other hosts, but does NOT stop a
        # browser tab on evil.com from POSTing here — same machine, browser
        # routes it to 127.0.0.1. Echo Origin ONLY when it's loopback so
        # cross-origin preflights are denied at the CORS layer.
        origin = self.headers.get('Origin', '')
        if _is_loopback_origin(origin):
            self.send_header('Access-Control-Allow-Origin', origin)
        else:
            # Same-origin GET to / has no Origin header; we don't need
            # the header at all for those. Setting an empty allow-origin
            # is harmless and explicit.
            self.send_header('Access-Control-Allow-Origin', 'null')
        self.send_header('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Vary', 'Origin')

    def _origin_allowed(self):
        """Cross-origin gate for write endpoints (PUT/POST). Returns True
        for same-origin (no Origin header on GETs) and loopback browser
        origins; False otherwise."""
        origin = self.headers.get('Origin')
        return origin is None or _is_loopback_origin(origin)

    def do_OPTIONS(self):
        self._cors()
        self.send_response(204)
        self.end_headers()

    # ── routing ─────────────────────────────────────────────────────────
    def do_GET(self):
        if self.path == '/__editor/ping':
            return self._json(200, {
                'ok': True,
                'server': 'ample-dev',
                'version': 1,
                'root': ROOT,
                'assets': ASSETS,
            })
        if self.path == '/__editor/version':
            return self._json(200, {
                'ok': True,
                'version': _max_mtime(ROOT),
            })
        return super().do_GET()

    def do_PUT(self):
        if not self._origin_allowed():
            return self._json(403, {'ok': False, 'error': 'Cross-origin write rejected.'})
        if not self.path.startswith('/assets/'):
            return self._json(404, {'ok': False, 'error': 'Only /assets/ is writable.'})
        name = self.path[len('/assets/'):]
        # Reject anything that even hints at a path. The regex would also
        # catch most of these, but an explicit early-out gives a clearer
        # error and a tighter audit trail.
        if '/' in name or '\\' in name or '..' in name:
            return self._json(400, {'ok': False, 'error': 'Path traversal not allowed.'})
        if not SAFE_NAME_RE.match(name):
            return self._json(400, {
                'ok': False,
                'error': (
                    'Filename must be a-z, 0-9, dot/underscore/hyphen, '
                    'and end in png/jpg/webp/avif/gif/svg/mp4/webm/mov/m4v.'
                ),
            })
        length = int(self.headers.get('Content-Length') or 0)
        if length <= 0:
            return self._json(411, {'ok': False, 'error': 'Empty body.'})
        if length > MAX_UPLOAD:
            return self._json(413, {
                'ok': False,
                'error': f'Body must be <= {MAX_UPLOAD} bytes.',
            })
        body = self.rfile.read(length)
        if len(body) != length:
            return self._json(400, {
                'ok': False,
                'error': 'Body length mismatch.',
            })

        os.makedirs(ASSETS, exist_ok=True)
        target = os.path.join(ASSETS, name)
        # Atomic write: write tmp then rename. os.replace is atomic on
        # Windows and POSIX so we never half-write an asset that's being
        # served right now.
        tmp = target + '.tmp'
        with open(tmp, 'wb') as f:
            f.write(body)
        os.replace(tmp, target)

        return self._json(200, {
            'ok': True,
            'path': f'assets/{name}',
            'bytes': len(body),
        })

    def do_POST(self):
        if not self._origin_allowed():
            return self._json(403, {'ok': False, 'error': 'Cross-origin write rejected.'})
        if self.path == '/__editor/save_index':
            return self._handle_save_index()
        return self._json(404, {'ok': False, 'error': 'Not found.'})

    # ── save_index implementation ──────────────────────────────────────
    def _handle_save_index(self):
        length = int(self.headers.get('Content-Length') or 0)
        if length <= 0 or length > 2 * 1024 * 1024:
            return self._json(413, {
                'ok': False,
                'error': 'JSON body must be 1..2 MB.',
            })
        raw = self.rfile.read(length)
        try:
            data = json.loads(raw.decode('utf-8'))
        except Exception as e:
            return self._json(400, {'ok': False, 'error': f'Invalid JSON: {e}'})
        block = data.get('tweaksJson')
        if not isinstance(block, str) or not block.strip():
            return self._json(400, {
                'ok': False,
                'error': 'Expected { "tweaksJson": "<JSON literal>" }.',
            })
        # Parse the inner JSON literal to catch malformed payloads BEFORE
        # touching index.html. The block is the value that lands between
        # the EDITMODE markers — strip the leading \\/ escaping the
        # client does for consistency with the existing source style.
        try:
            json.loads(block.replace('\\/', '/'))
        except Exception as e:
            return self._json(400, {
                'ok': False,
                'error': f'tweaksJson is not valid JSON: {e}',
            })
        try:
            # newline='' preserves the file's existing line endings (CRLF
            # on Windows clones, LF otherwise) — without it Python's text
            # mode translates CRLF→LF on read, and our write-side newline=''
            # would then silently rewrite the entire file with LF only.
            with open(INDEX_HTML, 'r', encoding='utf-8', newline='') as f:
                src = f.read()
        except FileNotFoundError:
            return self._json(500, {
                'ok': False,
                'error': f'index.html not found at {INDEX_HTML}',
            })
        new_block = '/*EDITMODE-BEGIN*/' + block + '/*EDITMODE-END*/'
        # lambda repl avoids re.sub's backreference parsing in the
        # replacement string (JSON has lots of \\u escapes etc.).
        new_src, n = EDITMODE_RE.subn(lambda m: new_block, src, count=1)
        if n == 0:
            return self._json(409, {
                'ok': False,
                'error': 'EDITMODE markers not found in index.html.',
            })
        if new_src == src:
            return self._json(200, {
                'ok': True,
                'path': 'project/index.html',
                'changed': False,
            })
        tmp = INDEX_HTML + '.tmp'
        with open(tmp, 'w', encoding='utf-8', newline='') as f:
            f.write(new_src)
        os.replace(tmp, INDEX_HTML)
        return self._json(200, {
            'ok': True,
            'path': 'project/index.html',
            'changed': True,
            'bytes': len(new_src),
        })

    # ── helpers ────────────────────────────────────────────────────────
    def _json(self, status, payload):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self._cors()
        self.end_headers()
        self.wfile.write(json.dumps(payload).encode('utf-8'))


def main():
    if not os.path.isdir(ROOT):
        sys.stderr.write(f'project/ not found at {ROOT}\n')
        sys.exit(1)
    os.makedirs(ASSETS, exist_ok=True)
    sys.stderr.write(
        f'ample. dev server\n'
        f'  url:     http://{HOST}:{PORT}/\n'
        f'  serves:  {ROOT}\n'
        f'  uploads: PUT /assets/<name>  →  {ASSETS}\n'
        f'  save:    POST /__editor/save_index\n'
        f'  ping:    GET  /__editor/ping\n'
        f'  Ctrl-C to stop.\n\n'
    )
    httpd = ThreadingHTTPServer((HOST, PORT), DevHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        sys.stderr.write('\nstopped.\n')
        sys.exit(0)


if __name__ == '__main__':
    main()
