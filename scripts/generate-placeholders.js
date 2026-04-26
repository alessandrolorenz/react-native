/* eslint-disable */
// One-shot placeholder generator. Produces 8 pastel-tinted PNGs (one per
// saint) plus app icon/splash assets, all using only Node built-ins (no
// dependencies). Replace these images with final illustrations before
// publishing - see assets/saints/README.md for style notes.
//
// Run: node scripts/generate-placeholders.js

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// --- minimal PNG encoder (RGB, 8-bit) ---------------------------------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const t = Buffer.from(type, 'ascii');
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crc32(Buffer.concat([t, data])), 0);
  return Buffer.concat([len, t, data, tail]);
}

function encodePng(width, height, pixels /* Uint8Array length = w*h*3 */) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type: RGB
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // Add a leading 0x00 (filter "None") byte to each scanline.
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const idat = zlib.deflateSync(raw);

  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', idat),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// --- drawing helpers --------------------------------------------------
function mix(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

// Renders a simple "halo + body" silhouette over a pastel background.
// The result is intentionally generic - it just gives each card a soft
// branded backdrop until real illustrations land.
function drawSaintPlaceholder(size, tint) {
  const pixels = Buffer.alloc(size * size * 3);
  const cx = size / 2;
  const cy = size * 0.55;
  const haloR = size * 0.32;
  const headR = size * 0.16;
  const headCy = size * 0.42;

  const bgTop = mix(tint, [255, 255, 255], 0.35);
  const bgBot = mix(tint, [255, 255, 255], 0.05);
  const halo = [255, 246, 215];      // soft gold
  const body = mix(tint, [255, 255, 255], 0.55);
  const stroke = mix(tint, [60, 50, 40], 0.55);

  for (let y = 0; y < size; y++) {
    const tY = y / (size - 1);
    const bg = mix(bgTop, bgBot, tY);
    for (let x = 0; x < size; x++) {
      let r = bg[0], g = bg[1], b = bg[2];

      // Halo ring (around head)
      const dHalo = Math.hypot(x - cx, y - headCy);
      if (dHalo < haloR && dHalo > haloR - 6) {
        [r, g, b] = halo;
      }

      // Head circle
      const dHead = Math.hypot(x - cx, y - headCy);
      if (dHead < headR) {
        [r, g, b] = body;
        if (dHead > headR - 2) [r, g, b] = stroke;
      }

      // Body (rounded shoulders) - simple ellipse below head
      const bodyHalfW = size * 0.28;
      const bodyHalfH = size * 0.22;
      const by = y - (cy + size * 0.18);
      const bx = x - cx;
      const eVal = (bx * bx) / (bodyHalfW * bodyHalfW) + (by * by) / (bodyHalfH * bodyHalfH);
      if (eVal < 1 && y > headCy + headR - 2) {
        [r, g, b] = body;
        if (eVal > 0.92) [r, g, b] = stroke;
      }

      const i = (y * size + x) * 3;
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
    }
  }

  return encodePng(size, size, pixels);
}

// Solid-tinted PNG used for app icon / splash.
function drawSolid(size, tint) {
  const pixels = Buffer.alloc(size * size * 3);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 3;
      pixels[i] = tint[0];
      pixels[i + 1] = tint[1];
      pixels[i + 2] = tint[2];
    }
  }
  return encodePng(size, size, pixels);
}

// Centered cross glyph on a soft cream bg - used for icon/adaptive-icon.
function drawIcon(size) {
  const cream = [255, 247, 230];
  const rose = [240, 145, 161];
  const pixels = Buffer.alloc(size * size * 3);
  const armW = Math.round(size * 0.14);
  const cx = size / 2;
  const cy = size / 2;
  const vH = Math.round(size * 0.55);
  const hW = Math.round(size * 0.42);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = cream[0], g = cream[1], b = cream[2];
      const inV = Math.abs(x - cx) < armW / 2 && Math.abs(y - cy) < vH / 2;
      const inH = Math.abs(y - (cy - size * 0.05)) < armW / 2 && Math.abs(x - cx) < hW / 2;
      if (inV || inH) [r, g, b] = rose;
      const i = (y * size + x) * 3;
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
    }
  }
  return encodePng(size, size, pixels);
}

// --- saint -> tint map -------------------------------------------------
const SAINT_TINTS = {
  'francisco-assis': [205, 227, 210], // soft sage
  'carlo-acutis':    [200, 221, 240], // soft sky
  'jose':            [232, 214, 197], // warm sand
  'antonio':         [244, 214, 188], // peach
  'teresinha':       [246, 205, 212], // rose
  'padre-pio':       [217, 207, 232], // lavender
  'aparecida':       [195, 217, 232], // sky blue
  'rita-cassia':     [232, 201, 213], // dusty pink
};

// --- main --------------------------------------------------------------
const ROOT = path.resolve(__dirname, '..');
const SAINTS_DIR = path.join(ROOT, 'assets', 'saints');
const ASSETS_DIR = path.join(ROOT, 'assets');

fs.mkdirSync(SAINTS_DIR, { recursive: true });

let count = 0;
for (const [id, tint] of Object.entries(SAINT_TINTS)) {
  const out = path.join(SAINTS_DIR, `${id}.png`);
  fs.writeFileSync(out, drawSaintPlaceholder(256, tint));
  count++;
}

fs.writeFileSync(path.join(ASSETS_DIR, 'icon.png'), drawIcon(512));
fs.writeFileSync(path.join(ASSETS_DIR, 'adaptive-icon.png'), drawIcon(512));
fs.writeFileSync(path.join(ASSETS_DIR, 'splash.png'), drawSolid(1024, [255, 247, 230]));

console.log(`Generated ${count} saint placeholders + 3 app assets in ${path.relative(process.cwd(), ASSETS_DIR)}/`);
