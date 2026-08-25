#!/bin/zsh
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
cd "$script_dir"
exec /usr/bin/env python3 scripts/cli.py "$@"
