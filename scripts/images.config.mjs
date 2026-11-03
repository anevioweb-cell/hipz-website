// Image masters → optimized outputs. Masters live in docs/inputs (gitignored, never committed).
// `crop` is a pure crop (left/top/width/height in master pixels); nothing is ever repainted.
export const WIDTHS = [480, 768, 1280, 1920];

export const specs = [
  {
    name: 'hero-lemon',
    src: 'docs/inputs/lemon.jpeg',
    kind: 'scene',
    widths: WIDTHS,
  },
  {
    // Crop removes the invented small print and the "330ML" text generated below the label
    // (see docs/ASSET_REPORT.md). Only logo, "Peach" label and fruit remain.
    name: 'hero-peach',
    src: 'docs/inputs/Peach.jpeg',
    kind: 'scene',
    crop: { left: 0, top: 0, width: 1856, height: 1668 },
    widths: WIDTHS,
  },
  {
    name: 'bottle-lemon',
    src: 'docs/inputs/lemonNoBg.png',
    kind: 'cutout',
    widths: [448],
  },
  {
    name: 'bottle-peach',
    src: 'docs/inputs/PeachNoBg.png',
    kind: 'cutout',
    crop: { left: 0, top: 0, width: 448, height: 402 },
    widths: [448],
  },
];
