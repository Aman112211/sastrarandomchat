#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  start.sh – Starts the full Sastra Random Chat stack:
#    1. Backend  (Express + Socket.IO) on port 3000
#    2. Frontend (Vite dev-server)     on port 5173
#    3. Nginx                          on port 8090  (unified entry-point)
#
#  Then optionally launch the ngrok tunnel:
#    ./start-ngrok.sh
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load root .env
if [ -f "$SCRIPT_DIR/.env" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env" | xargs)
fi

echo "── Installing dependencies ───────────────────"
npm run install:all --prefix "$SCRIPT_DIR"

echo ""
echo "── Starting backend (port ${PORT:-3000}) ─────"
npm run dev:server --prefix "$SCRIPT_DIR" &
SERVER_PID=$!

echo "── Starting frontend (port 5173) ─────────────"
npm run dev:client --prefix "$SCRIPT_DIR" &
CLIENT_PID=$!

# Give services a moment to bind
sleep 2

echo ""
echo "── Starting nginx (port ${NGINX_PORT:-8090}) ──"
# Try sudo first; fall back to plain nginx (for environments where it's not needed)
if command -v nginx &>/dev/null; then
  sudo nginx -c "$SCRIPT_DIR/nginx.conf" -p "$SCRIPT_DIR" || nginx -c "$SCRIPT_DIR/nginx.conf" -p "$SCRIPT_DIR"
else
  echo "⚠️  nginx not found – install it or set up the proxy manually."
fi

echo ""
echo "══════════════════════════════════════════════"
echo "  Backend  → http://localhost:${PORT:-3000}"
echo "  Frontend → http://localhost:5173"
echo "  Nginx    → http://localhost:${NGINX_PORT:-8090}  ← use this"
echo "══════════════════════════════════════════════"
echo ""
echo "  To expose publicly via ngrok, run in a NEW terminal:"
echo "    ./start-ngrok.sh"
echo ""

# Wait so Ctrl+C kills all background jobs
trap "kill $SERVER_PID $CLIENT_PID 2>/dev/null; sudo nginx -s stop 2>/dev/null; exit 0" INT TERM
wait
