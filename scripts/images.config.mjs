// Image masters → optimized outputs. Masters live in docs/inputs (gitignored, never committed).
// `crop` is a pure crop (left/top/width/height in master pixels); nothing is ever repainted.
// `box` = bottle bounding box as fractions of the MASTER (hand-measured, ±1 %); the script converts it
// to fractions of each output crop and writes it (with `focal`) to src/data/images.generated.js.
export const WIDE = [640, 1024, 1536, 2048, 2752];
export const PORTRAIT = [480, 768, 1024, 1229];

const MW = 2752;
const MH = 1536;
const PW = 1229; // 4:5 portrait crop width at full height
const portraitCrop = (cx) => ({
  left: Math.round(cx * MW - PW / 2),
  top: 0,
  width: PW,
  height: MH,
});

const scenes = {
  lemon: {
    src: 'docs/inputs/LemonBg.jpeg',
    box: { l: 0.588, t: 0.036, r: 0.78, b: 0.972 },
    focal: { x: 0.685, y: 0.5 },
  },
  peach: {
    src: 'docs/inputs/PeachBg.jpeg',
    box: { l: 0.598, t: 0.036, r: 0.75, b: 0.95 },
    focal: { x: 0.674, y: 0.5 },
  },
};

export const specs = [
  ...Object.entries(scenes).flatMap(([flavor, s]) => [
    {
      name: `hero-${flavor}-wide`,
      src: s.src,
      kind: 'scene',
      widths: WIDE,
      box: s.box,
      focal: s.focal,
    },
    {
      name: `hero-${flavor}-portrait`,
      src: s.src,
      kind: 'scene',
      crop: portraitCrop(s.focal.x),
      widths: PORTRAIT,
      box: s.box,
      focal: s.focal,
    },
  ]),
  { name: 'bottle-lemon', src: 'docs/inputs/lemonNoBg.png', kind: 'cutout', widths: [448] },
  {
    // Crop removes the AI-generated small print / "330ML" below the label (docs/ASSET_REPORT.md).
    name: 'bottle-peach',
    src: 'docs/inputs/PeachNoBg.png',
    kind: 'cutout',
    crop: { left: 0, top: 0, width: 448, height: 402 },
    widths: [448],
  },
];
