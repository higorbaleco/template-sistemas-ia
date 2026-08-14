#!/bin/bash
# Script to run the RealLife Game

# Try to find Godot executable
GODOT_PATH=""

# Common installation locations
if [ -f "/Applications/Godot.app/Contents/MacOS/Godot" ]; then
    GODOT_PATH="/Applications/Godot.app/Contents/MacOS/Godot"
elif [ -f "$HOME/Applications/Godot.app/Contents/MacOS/Godot" ]; then
    GODOT_PATH="$HOME/Applications/Godot.app/Contents/MacOS/Godot"
elif command -v godot &> /dev/null; then
    GODOT_PATH="godot"
fi

if [ -z "$GODOT_PATH" ]; then
    echo "Error: Godot executable not found."
    echo "Please install Godot Engine 4.x from https://godotengine.org/download"
    echo "Then update the GODOT_PATH variable in this script."
    exit 1
fi

echo "Starting RealLife Game with Godot at: $GODOT_PATH"
"$GODOT_PATH" --path "$(pwd)" "$@"
