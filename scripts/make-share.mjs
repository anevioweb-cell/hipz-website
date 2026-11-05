// Link-preview image and icons, built ONLY from existing approved assets (part of `npm run images`):
// - public/og.jpg (1200×630): a crop of the lemon hero scene + the round logo badge at its native 150 px
//   (the logo is a small file — never enlarged). No new text or claims are added.
// - public/favicon-16.png, favicon-32.png, favicon-48.png: the badge scaled DOWN.
// - public/apple-touch-icon.png (180×180): the 150 px badge centred on its own lime, padded, not upscaled.
import sharp from 'sharp';

const SCENE = 'docs/inputs/LemonBg.jpeg'; // 2752×1536 master of the approved home hero
const BADGE = 'public/logo-badge.png'; // 150×150, made from the supplied logo by scripts/make-logo.mjs
const LIME = { r: 170, g: 204, b: 45, alpha: 1 }; // the badge's own background colour (sampled)

// the master is 2752×1536 (1.79:1): scale to 1200 wide and crop the height to 630 (whole width kept)
const scene = await sharp(SCENE)
  .resize({ width: 1200, height: 630, fit: 'cover', position: 'centre' })
  .toBuffer();
await sharp(scene)
  .composite([{ input: BADGE, left: 48, top: 630 - 150 - 48 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile('public/og.jpg');

for (const size of [16, 32, 48])
  await sharp(BADGE)
    .resize(size, size, { kernel: 'lanczos3' })
    .png()
    .toFile(`public/favicon-${size}.png`);

await sharp({ create: { width: 180, height: 180, channels: 4, background: LIME } })
  .composite([{ input: BADGE, left: 15, top: 15 }])
  .png()
  .toFile('public/apple-touch-icon.png');

console.log('public/og.jpg, favicon-16/32/48.png, apple-touch-icon.png written');
