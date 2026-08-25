#!/bin/zsh
set -euo pipefail

project_root="$(cd "$(dirname "$0")" && pwd)"
exec /usr/bin/env python3 "$project_root/scripts/app_server.py"
