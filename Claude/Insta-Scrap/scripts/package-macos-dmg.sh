#!/bin/sh
set -eu

ROOT_DIR="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
APP_NAME="Insta-Scrap"
APP_BUNDLE="$ROOT_DIR/desktop/$APP_NAME.app"
BUILD_DIR="$ROOT_DIR/release"
STAGING_DIR="$(mktemp -d "$ROOT_DIR/.dmg-staging.XXXXXX")"
VOLUME_NAME="Insta-Scrap"
DMG_NAME="Insta-Scrap-1.0.0.dmg"
DMG_PATH="$BUILD_DIR/$DMG_NAME"

cleanup() {
  rm -rf "$STAGING_DIR"
}

trap cleanup EXIT INT TERM

mkdir -p "$BUILD_DIR"

if [ ! -d "$APP_BUNDLE" ]; then
  sh "$ROOT_DIR/scripts/package-macos-app.sh" >/dev/null
fi

rm -rf "$STAGING_DIR/$APP_NAME.app"
cp -R "$APP_BUNDLE" "$STAGING_DIR/$APP_NAME.app"
ln -s /Applications "$STAGING_DIR/Applications"

if [ -f "$DMG_PATH" ]; then
  rm -f "$DMG_PATH"
fi

hdiutil create \
  -volname "$VOLUME_NAME" \
  -srcfolder "$STAGING_DIR" \
  -ov \
  -format UDZO \
  "$DMG_PATH" >/dev/null

printf '%s\n' "$DMG_PATH"
