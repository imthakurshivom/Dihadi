import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const sourceImg = path.resolve('src/assets/images/dihadi_app_icon_1790352202626.jpg');
const publicDir = path.resolve('public');

async function generateAllAppIcons() {
  console.log('Generating production PNG icons from official Dihadi design...');

  // 512x512 standard
  await sharp(sourceImg)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 192x192 standard
  await sharp(sourceImg)
    .resize(192, 192, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 180x180 Apple touch icon
  await sharp(sourceImg)
    .resize(180, 180, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // Maskable 512x512 with safe padding (80% inside safe zone)
  const paddedIcon = await sharp(sourceImg)
    .resize(410, 410, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: paddedIcon, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // Play Store 512x512 Hi-Res graphic
  await sharp(sourceImg)
    .resize(512, 512, { fit: 'cover' })
    .png()
    .toFile(path.join(publicDir, 'play-store-512.png'));

  console.log('All icons generated successfully with official artwork!');
}

generateAllAppIcons().catch(console.error);
