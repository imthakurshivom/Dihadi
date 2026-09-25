import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function createPng(width, height, isMaskable = false) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);
  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * (isMaskable ? 0.45 : 0.42);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background: deep slate with subtle warm amber glow or gradient
      // Slate: #0f172a (15, 23, 42) -> #1e293b (30, 41, 59)
      const grad = y / height;
      let r = Math.round(15 + grad * 15);
      let g = Math.round(23 + grad * 18);
      let b = Math.round(42 + grad * 20);
      let a = 255;

      // Outer badge circle
      if (dist < radius) {
        // Inner circle background: rich amber/orange #EA580C to #D97706
        const amberGrad = (x + y) / (width + height);
        r = Math.round(234 - amberGrad * 30);
        g = Math.round(88 + amberGrad * 40);
        b = Math.round(12 + amberGrad * 10);

        // Center construction helmet / tool symbol representation
        // Helmet dome: dy < 0, |dx| < radius * 0.55
        const helmetDy = dy + radius * 0.1;
        const helmetDist = Math.sqrt(dx * dx + helmetDy * helmetDy * 1.5);
        if (helmetDist < radius * 0.45 && helmetDy < radius * 0.1) {
          // Yellow helmet #FEF08A / #FBBF24
          r = 254;
          g = 240;
          b = 138;
        } else if (Math.abs(dx) < radius * 0.55 && Math.abs(dy - radius * 0.05) < radius * 0.08) {
          // Helmet brim
          r = 251;
          g = 191;
          b = 36;
        } else if (Math.abs(dy - radius * 0.3) < radius * 0.12 && Math.abs(dx) < radius * 0.4) {
          // Brick / foundation bar
          r = 255;
          g = 255;
          b = 255;
        }
      }

      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // PNG generation: Signature + IHDR + IDAT + IEND
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData.writeUInt8(8, 8); // 8-bit depth
  ihdrData.writeUInt8(6, 9); // RGBA
  ihdrData.writeUInt8(0, 10); // Compression
  ihdrData.writeUInt8(0, 11); // Filter
  ihdrData.writeUInt8(0, 12); // Interlace
  const ihdrChunk = createChunk('IHDR', ihdrData);

  // Scanlines with filter byte 0
  const scanlines = Buffer.alloc(height * (width * 4 + 1));
  let scanlineIdx = 0;
  for (let y = 0; y < height; y++) {
    scanlines[scanlineIdx++] = 0; // Filter: None
    const rowStart = y * width * 4;
    buffer.copy(scanlines, scanlineIdx, rowStart, rowStart + width * 4);
    scanlineIdx += width * 4;
  }

  const compressed = zlib.deflateSync(scanlines);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    const byte = buf[i];
    crc ^= byte;
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (-(crc & 1) & 0xedb88320);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(4 + 4 + len + 4);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4, 4, 'ascii');
  data.copy(chunk, 8);
  const typeAndData = chunk.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  chunk.writeUInt32BE(crc, 8 + len);
  return chunk;
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, false));

console.log('PWA PNG icons created successfully.');
