"""Serve the dist/ build artifact locally (production preview).

    npm run build && py scripts/serve-dist.py    ->  http://127.0.0.1:8090/

Honors the PORT env var so preview tools can assign one.
"""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from functools import partial
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
DIST = os.path.join(HERE, '..', 'dist')
PORT = int(os.environ.get('PORT') or '8090')


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if not os.path.isdir(DIST):
    sys.stderr.write('dist/ not found — run `npm run build` first.\n')
    sys.exit(1)

sys.stderr.write(f'serving dist/ at http://127.0.0.1:{PORT}/  (Ctrl-C to stop)\n')
ThreadingHTTPServer(('127.0.0.1', PORT), partial(NoCacheHandler, directory=DIST)).serve_forever()
