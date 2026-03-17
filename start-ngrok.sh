#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  start-ngrok.sh
#  1. Reads NGROK_AUTH_TOKEN from .env
#  2. Authenticates ngrok
#  3. Tunnels port 8090 (nginx unified port)
#  4. Writes the public URL back to .env as NGROK_URL=
# ─────────────────────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/.env"

# Load .env
if [ ! -f "$ENV_FILE" ]; then
  echo "❌  .env not found at $ENV_FILE"
  exit 1
fi

export $(grep -v '^#' "$ENV_FILE" | xargs)

if [ -z "$NGROK_AUTH_TOKEN" ] || [ "$NGROK_AUTH_TOKEN" = "your_ngrok_auth_token_here" ]; then
  echo "❌  Set NGROK_AUTH_TOKEN in .env first."
  echo "    Get yours at: https://dashboard.ngrok.com/get-started/your-authtoken"
  exit 1
fi

# Authenticate
ngrok config add-authtoken "$NGROK_AUTH_TOKEN"

echo "🚀  Starting ngrok tunnel on port ${NGINX_PORT:-8090} ..."

# Start ngrok in the background
ngrok http "${NGINX_PORT:-8090}" --log=stdout --log-format=json > /tmp/ngrok.log 2>&1 &
NGROK_PID=$!

# Wait for tunnel URL to appear
echo "⏳  Waiting for tunnel URL..."
TUNNEL_URL=""
for i in $(seq 1 20); do
  sleep 1
  TUNNEL_URL=$(curl -s http://127.0.0.1:4040/api/tunnels 2>/dev/null \
    | grep -o '"public_url":"https://[^"]*"' \
    | head -1 \
    | sed 's/"public_url":"//;s/"//')
  if [ -n "$TUNNEL_URL" ]; then
    break
  fi
done

if [ -z "$TUNNEL_URL" ]; then
  echo "❌  Could not retrieve ngrok URL. Check /tmp/ngrok.log"
  kill $NGROK_PID 2>/dev/null
  exit 1
fi

echo "✅  Tunnel live: $TUNNEL_URL"

# Write NGROK_URL back into .env
if grep -q "^NGROK_URL=" "$ENV_FILE"; then
  sed -i "s|^NGROK_URL=.*|NGROK_URL=$TUNNEL_URL|" "$ENV_FILE"
else
  echo "NGROK_URL=$TUNNEL_URL" >> "$ENV_FILE"
fi

echo ""
echo "──────────────────────────────────────────────"
echo "  Public URL : $TUNNEL_URL"
echo "  Saved to   : $ENV_FILE  (NGROK_URL)"
echo "──────────────────────────────────────────────"
echo ""
echo "  Share this link with anyone outside your network."
echo "  Press Ctrl+C to stop the tunnel."
echo ""

# Keep script alive (ngrok runs in background)
wait $NGROK_PID
