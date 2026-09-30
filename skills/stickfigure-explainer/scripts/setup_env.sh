#!/usr/bin/env bash
# One-time setup for building, checking and voicing stick-figure episodes.
# Safe to re-run. Works on a normal machine and in Claude Code cloud sessions (TLS-intercepting proxy).
set -u

say() { printf '\n== %s\n' "$*"; }

say "python packages (Pillow for contact sheets, mutagen for clip lengths, imageio-ffmpeg for music beds, edge-tts for voices)"
pip install -q pillow mutagen imageio-ffmpeg edge-tts 2>&1 | grep -v -i "warning" || true

say "playwright (headless Chromium for frame checks)"
if node -e "require('playwright')" 2>/dev/null || [ -d /opt/node22/lib/node_modules/playwright ] || npm ls -g playwright >/dev/null 2>&1; then
  echo "playwright found"
else
  npm install -g playwright >/dev/null 2>&1 && echo "installed playwright" || echo "!! install playwright yourself: npm i -g playwright && npx playwright install chromium"
fi
NODE_GLOBAL="$(npm root -g 2>/dev/null)"
echo "use: NODE_PATH=$NODE_GLOBAL node <script>.cjs ..."

# Cloud sessions re-terminate TLS at a proxy. curl/pip/node trust it already; Chromium reads its own NSS store and
# needs the proxy CA added there, otherwise Google Fonts fail silently and every screenshot falls back to a system font.
CA=""
for c in "${SSL_CERT_FILE:-}" /root/.ccr/agent-proxy-ca.crt; do [ -n "$c" ] && [ -f "$c" ] && CA="$c" && break; done
if [ -n "$CA" ] && [ -n "${HTTPS_PROXY:-}" ]; then
  say "trusting the proxy CA in Chromium's NSS store ($CA)"
  command -v certutil >/dev/null || (apt-get install -y -q libnss3-tools >/dev/null 2>&1 || (apt-get update -q >/dev/null 2>&1 && apt-get install -y -q libnss3-tools >/dev/null 2>&1))
  mkdir -p "$HOME/.pki/nssdb"
  [ -f "$HOME/.pki/nssdb/cert9.db" ] || certutil -N -d "sql:$HOME/.pki/nssdb" --empty-password
  certutil -L -d "sql:$HOME/.pki/nssdb" | grep -q ccr-agent-proxy || certutil -A -d "sql:$HOME/.pki/nssdb" -n ccr-agent-proxy -t "C,," -i "$CA"
  certutil -L -d "sql:$HOME/.pki/nssdb" | grep ccr-agent-proxy || echo "!! could not add the CA (fonts will fall back in screenshots)"
fi
say "done"
