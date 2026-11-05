// Builds public/logo-white.png (white wordmark on transparent) and public/logo-badge.png (round badge)
// from the supplied brand/logo.jpg. The original JPG is never modified; nothing is redrawn.
import sharp from 'sharp';

const SRC = 'brand/logo.jpg'; // the supplied original (not deployed)
const SCALE = 4;
const { width: w, height: h } = await sharp(SRC).metadata();

// 1) round badge (original colors) for favicon / small uses
const circle = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><circle cx="${w / 2}" cy="${h / 2}" r="${w / 2}"/></svg>`,
);
await sharp(SRC)
  .composite([{ input: circle, blend: 'dest-in' }])
  .png()
  .toFile('public/logo-badge.png');

// 2) white wordmark: whiteness (bright + low saturation) becomes alpha, computed on a 4x upscale
const { data, info } = await sharp(SRC)
  .resize(w * SCALE, h * SCALE, { kernel: 'lanczos3' })
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;
const ch = info.channels;
const out = Buffer.alloc(W * H * 4);
const clamp = (v) => Math.min(1, Math.max(0, v));
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * ch;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const mn = Math.min(r, g, b);
    const sat = Math.max(r, g, b) - mn;
    let a = clamp((mn - 110) / 125) * clamp(1 - (sat - 30) / 90);
    const d = Math.hypot(x - W / 2, y - H / 2);
    if (d > (W / 2) * 0.93) a = 0; // ignore the black corners / circle rim
    const o = (y * W + x) * 4;
    out[o] = 255;
    out[o + 1] = 255;
    out[o + 2] = 255;
    out[o + 3] = Math.round(a * 255);
  }
}
const full = sharp(out, { raw: { width: W, height: H, channels: 4 } });
// trim transparent margin
const trimmed = await full.png().toBuffer();
await sharp(trimmed)
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 10 })
  .extend({
    top: 8,
    bottom: 8,
    left: 8,
    right: 8,
    background: { r: 255, g: 255, b: 255, alpha: 0 },
  })
  .png()
  .toFile('public/logo-white.png');
const meta = await sharp('public/logo-white.png').metadata();
console.log('logo-white.png', meta.width, 'x', meta.height);

// 3) ink version (same alpha, ink color) for use on bright backgrounds
await sharp({
  create: {
    width: meta.width,
    height: meta.height,
    channels: 4,
    background: { r: 22, g: 19, b: 14, alpha: 1 },
  },
})
  .composite([{ input: 'public/logo-white.png', blend: 'dest-in' }])
  .png()
  .toFile('public/logo-ink.png');
console.log('logo-ink.png written');
