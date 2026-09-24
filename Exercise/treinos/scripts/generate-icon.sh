#!/bin/bash
# Generate basic placeholder icons for PWA
# Requires ImageMagick: brew install imagemagick

SIZE_192="192x192"
SIZE_512="512x512"
SIZE_MASKABLE="192x192"

# Create a simple icon (green circle with white muscle emoji background)
convert -size 256x256 xc:'#4CAF50' \
  -fill white -gravity center -pointsize 120 -annotate +0+0 '💪' \
  -resize 192x192 public/icons/icon-192.png

convert -size 256x256 xc:'#4CAF50' \
  -fill white -gravity center -pointsize 120 -annotate +0+0 '💪' \
  -resize 512x512 public/icons/icon-512.png

# Maskable icon (same for now, but can be different)
cp public/icons/icon-192.png public/icons/icon-maskable.png

echo "Icons generated at public/icons/"
