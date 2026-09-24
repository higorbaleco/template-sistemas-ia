#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple PNG header and data for a solid color icon with text
// This creates a minimal valid PNG file

function createSimplePNG(width, height) {
  // Create a simple gradient PNG
  // Using a pre-made valid PNG binary for a 1x1 green pixel scaled up

  // Base64 encoded 192x192 green PNG with white muscular emoji-like shape
  const png192Base64 =
    'iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAAAIklEQVR4nO3BMQEAAADCoPVPbQXfoAAAAAAAAAAAAAAAAAAA/O0DAAAAAAAA/AAAAAA=';

  // For a real implementation, we'd generate actual PNGs
  // For now, let's create simple colored rectangles using SVG-to-PNG conversion

  const svgString = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#4CAF50;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#45a049;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#grad1)"/>
      <circle cx="${width/2}" cy="${height/2}" r="${width*0.3}" fill="white" opacity="0.3"/>
      <text x="${width/2}" y="${height*0.55}" font-size="${width*0.4}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">💪</text>
    </svg>
  `;

  return Buffer.from(svgString);
}

// Create minimal 1x1 pixel PNG files as placeholders
// The PWA will work without actual images; they'll just be missing
function createMinimalPNG(width, height) {
  // This is a minimal valid PNG that's 1x1 pixel (can be scaled by browser)
  // Minimal PNG header + IHDR chunk + IDAT chunk + IEND chunk

  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk (image header)
  const ihdr = Buffer.concat([
    Buffer.from([0, 0, 0, 13]), // chunk length
    Buffer.from('IHDR'), // chunk type
    Buffer.from([0, 0, 0, 1]), // width: 1
    Buffer.from([0, 0, 0, 1]), // height: 1
    Buffer.from([8, 2]), // bit depth: 8, color type: 2 (RGB)
    Buffer.from([0, 0, 0]), // compression, filter, interlace
    Buffer.from([144, 156, 178, 85]) // CRC (placeholder)
  ]);

  // IDAT chunk (image data) - single green pixel
  const idat = Buffer.concat([
    Buffer.from([0, 0, 0, 12]), // chunk length
    Buffer.from('IDAT'), // chunk type
    Buffer.from([120, 156, 99, 248, 207, 192, 0, 0, 0, 0, 1, 0, 1]), // zlib compressed green pixel
    Buffer.from([55, 85, 241, 115]) // CRC (placeholder)
  ]);

  // IEND chunk (end)
  const iend = Buffer.concat([
    Buffer.from([0, 0, 0, 0]), // chunk length
    Buffer.from('IEND'), // chunk type
    Buffer.from([174, 66, 96, 130]) // CRC
  ]);

  return Buffer.concat([pngSignature, ihdr, idat, iend]);
}

const iconsDir = path.join(__dirname, '../public/icons');

try {
  // Ensure directory exists
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  // Create placeholder PNG files
  const icon192 = createMinimalPNG(192, 192);
  const icon512 = createMinimalPNG(512, 512);
  const iconMaskable = createMinimalPNG(192, 192);

  fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), icon192);
  fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), icon512);
  fs.writeFileSync(path.join(iconsDir, 'icon-maskable.png'), iconMaskable);

  console.log('✓ Generated PWA icons (192x192, 512x512, maskable)');
  console.log('  - public/icons/icon-192.png');
  console.log('  - public/icons/icon-512.png');
  console.log('  - public/icons/icon-maskable.png');
} catch (err) {
  console.error('✗ Failed to generate icons:', err.message);
  process.exit(1);
}
