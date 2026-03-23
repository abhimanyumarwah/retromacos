#!/usr/bin/env python3
"""
Simple HTTP server for Infinity Gauntlet 3D
Serves the static files with proper CORS headers for WebGL
"""

import http.server
import socketserver
import os
import sys
from urllib.parse import urlparse

class CORSHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def main(port: int) -> None:
    # Always serve from the directory where this script resides
    script_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(script_dir)

    # Check if port is available
    try:
        with socketserver.TCPServer(("", port), CORSHTTPRequestHandler) as httpd:
            print(f"🚀 Infinity Gauntlet 3D Server")
            print(f"📡 Serving at http://localhost:{port}")
            print(f"🌐 Open Retro OS: http://localhost:{port}/retro-os.html")
            print(f"⏹️  Press Ctrl+C to stop")
            print("-" * 50)

            httpd.serve_forever()
    except OSError as e:
        if getattr(e, 'errno', None) == 48:  # Address already in use (macOS)
            print(f"❌ Port {port} is already in use")
            print(f"💡 Try a different port: python server.py {port + 1}")
            sys.exit(1)
        else:
            raise

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print("❌ Invalid port number")
            sys.exit(1)
    else:
        PORT = 8000

    main(PORT)
