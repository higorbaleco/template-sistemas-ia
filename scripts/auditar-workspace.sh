#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="${1:-.}"

echo "Workspace audit"
echo "Root: $(cd "$ROOT_DIR" && pwd)"
echo

echo "Top-level sizes (KB)"
find "$ROOT_DIR" -mindepth 1 -maxdepth 1 -exec du -sk {} + 2>/dev/null | sort -nr | head -20
echo

echo "Nested git repositories"
find "$ROOT_DIR" -mindepth 2 -maxdepth 2 -type d -name .git 2>/dev/null | sed 's#^\./##' | sort
echo

echo "Heavy generated directories"
find "$ROOT_DIR" \
  \( -name node_modules -o -name .next -o -name dist -o -name build -o -name .venv -o -name venv \) \
  -type d 2>/dev/null | sed 's#^\./##' | sort
