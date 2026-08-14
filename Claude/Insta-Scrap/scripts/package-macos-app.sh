#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
APP_NAME="Insta-Scrap"
APP_DIR="$ROOT_DIR/desktop/$APP_NAME.app"
WEB_DIR="$APP_DIR/Contents/Resources/web"
MACOS_DIR="$APP_DIR/Contents/MacOS"

mkdir -p "$WEB_DIR" "$MACOS_DIR"

cp "$ROOT_DIR/index.html" "$WEB_DIR/index.html"
cp "$ROOT_DIR/styles.css" "$WEB_DIR/styles.css"
cp "$ROOT_DIR/app.js" "$WEB_DIR/app.js"
cp "$ROOT_DIR/README-UI.md" "$WEB_DIR/README-UI.md"

cat > "$APP_DIR/Contents/Info.plist" <<'PLIST'
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key>
  <string>Insta-Scrap</string>
  <key>CFBundleDisplayName</key>
  <string>Insta-Scrap</string>
  <key>CFBundleIdentifier</key>
  <string>com.antigravity.instascrap</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleExecutable</key>
  <string>Insta-Scrap</string>
  <key>CFBundleVersion</key>
  <string>1</string>
  <key>CFBundleShortVersionString</key>
  <string>1.0.0</string>
  <key>LSMinimumSystemVersion</key>
  <string>13.0</string>
</dict>
</plist>
PLIST

cat > "$MACOS_DIR/Insta-Scrap" <<'LAUNCHER'
#!/bin/sh
set -eu

APP_BUNDLE="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
WEB_DIR="$APP_BUNDLE/Resources/web"
PORT="${INSTA_SCRAP_PORT:-47831}"

choose_port() {
  candidate="$1"
  while lsof -ti "tcp:$candidate" >/dev/null 2>&1; do
    candidate=$((candidate + 1))
  done
  printf '%s' "$candidate"
}

PORT="$(choose_port "$PORT")"

if command -v python3 >/dev/null 2>&1; then
  PYTHON="python3"
elif command -v python >/dev/null 2>&1; then
  PYTHON="python"
else
  osascript -e 'display alert "Insta-Scrap" message "Python 3 não está disponível para iniciar o servidor local." as critical'
  exit 1
fi

cd "$WEB_DIR"
"$PYTHON" -m http.server "$PORT" >/tmp/insta-scrap-server.log 2>&1 &
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}

trap cleanup EXIT INT TERM

sleep 1
open "http://127.0.0.1:$PORT/"
wait "$SERVER_PID"
LAUNCHER

chmod +x "$MACOS_DIR/Insta-Scrap"

printf '%s\n' "Built $APP_DIR"
