#!/bin/zsh
set -euo pipefail

project_root="$(cd "$(dirname "$0")" && pwd)"
bundle="$project_root/dist/Mac Curator.app"

if [ -d "$bundle" ]; then
  open "$bundle"
else
  exec /usr/bin/env python3 "$project_root/scripts/app_server.py"
fi
