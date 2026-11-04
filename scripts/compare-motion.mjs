// Phase 6 Part C3: samples OUR animation curves with the same frame sampler as the reference
// (scripts/motion-lib.mjs) and compares them element type by element type: start/final values (translate
// relative to the element's own size), scale, rotation, opacity, per-unit duration, stagger and the
// normalised progress curve (max deviation, and the largest timing offset at equal progress).
// Also writes curve plots (SVG → PNG) and 50 ms frame strips (reference vs ours) to
// docs/shots/motion-compare/ (gitignored).
// Usage: node scripts/compare-motion.mjs [--ours http://localhost:4174]
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import sharp from 'sharp';
import { samplerInit, summarise, valueAt } from './motion-lib.mjs';

const REF = 'https://joybliss.framer.website';
const OURS = process.argv.includes('--ours')
  ? process.argv[process.argv.indexOf('--ours') + 1]
  : 'http://localhost:4174';
const OUT = 'docs/shots/motion-compare';
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// element types to compare: how to find the group in each summary
const TYPES = [
  {
    key: 'hero-headline',
    ref: (g) => g.kind === 'hero headline (h1)',
    ours: (g) => g.kind === 'hero headline (h1)',
  },
  {
    key: 'section-heading',
    ref: (g) => g.kind === 'section heading' && g.unit === 'char',
    ours: (g) => g.kind === 'section heading' && g.unit === 'char',
  },
  {
    key: 'paragraph',
    ref: (g) => g.kind === 'paragraph' && g.unit === 'char',
    ours: (g) => g.kind === 'paragraph' && g.unit === 'char',
  },
  {
    key: 'label-chip',
    ref: (g) => /"(Tag|Star badge|Callout)"/.test(g.kind),
    ours: (g) => g.kind === 'block "badge"',
  },
  {
    key: 'button',
    ref: (g) => g.kind === 'button/link' && g.initial.ty === 10,
    ours: (g) => g.kind === 'block "rise-10"',
  },
  {
    key: 'card',
    ref: (g) => g.kind === 'block "Flavor card"',
    ours: (g) => g.kind === 'block "rise-70"',
  },
  {
    key: 'content-block',
    ref: (g) => g.kind === 'block "Content"',
    ours: (g) => g.kind === 'block "rise-30"',
  },
  {
    key: 'image (hero photo)',
    ref: (g) => g.kind === 'block "Photo"',
    ours: (g) => g.animated.includes('s') && g.initial.s > 1.2 && g.size[0] > 300,
  },
];

async function sampleSite(browser, base, path, vp) {
  const ctx = await browser.newContext({
    viewport: vp,
    deviceScaleFactor: 1,
    isMobile: vp.width < 600,
    hasTouch: vp.width < 600,
  });
  await ctx.addInitScript(samplerInit);
  const page = await ctx.newPage();
  await page.goto(base + path, { waitUntil: 'load', timeout: 90000 });
  await sleep(3000);
  const end = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  for (let y = 0; y <= end + vp.height; y += Math.round(vp.height * 0.6)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(1500);
  }
  const dump = await page.evaluate(() => window.__mm.dump());
  await ctx.close();
  return summarise(dump);
}

// curve comparison on normalised progress (0 → 1) over the reference duration
function compareCurves(a, b) {
  const T = Math.max(a.at(-1)[0], b.at(-1)[0]);
  let maxDev = 0;
  for (let t = 0; t <= T; t += 8)
    maxDev = Math.max(maxDev, Math.abs(valueAt(a, t) - valueAt(b, t)));
  // timing offset: time difference at which each curve first reaches 25/50/90 %
  const reach = (c, p) => c.find((x) => x[1] >= p)?.[0] ?? null;
  const offsets = [0.25, 0.5, 0.9].map((p) => {
    const ta = reach(a, p);
    const tb = reach(b, p);
    return ta === null || tb === null ? null : Math.abs(ta - tb);
  });
  const peak = (c) => Math.max(...c.map((x) => x[1]));
  return {
    maxProgressDev: +maxDev.toFixed(3),
    timingOffsetMs: Math.max(...offsets.filter((x) => x !== null)),
    peakRef: +peak(a).toFixed(3),
    peakOurs: +peak(b).toFixed(3),
  };
}
// translate: px for blocks (offsets are absolute in both), relative to font size for text units
const rel = (g) => ({
  ty: g.unit === 'block' ? g.initial.ty : +(g.initial.ty / (g.fontSize || 1)).toFixed(3),
  s: g.initial.s,
  rot: g.initial.rot,
  op: Math.round(g.initial.op * 100) / 100,
});

function svgPlot(key, a, b) {
  const W = 640,
    H = 320,
    P = 40;
  const T = Math.max(a.at(-1)[0], b.at(-1)[0], 100);
  const maxV = Math.max(1.2, ...a.map((x) => x[1]), ...b.map((x) => x[1]));
  const x = (t) => P + ((W - 2 * P) * t) / T;
  const y = (v) => H - P - ((H - 2 * P) * v) / maxV;
  const path = (c) =>
    c.map((p, i) => `${i ? 'L' : 'M'}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(' ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="background:#fff;font-family:sans-serif;font-size:12px">
<rect width="${W}" height="${H}" fill="#fff"/>
<line x1="${P}" y1="${y(1)}" x2="${W - P}" y2="${y(1)}" stroke="#ccc" stroke-dasharray="4 4"/>
<line x1="${P}" y1="${H - P}" x2="${W - P}" y2="${H - P}" stroke="#333"/><line x1="${P}" y1="${P}" x2="${P}" y2="${H - P}" stroke="#333"/>
<path d="${path(a)}" fill="none" stroke="#1f5fbf" stroke-width="2.5"/>
<path d="${path(b)}" fill="none" stroke="#d97e2b" stroke-width="2.5" stroke-dasharray="6 3"/>
<text x="${P}" y="20">${key}: progress vs time (0–${Math.round(T)} ms). blue = reference, orange dashed = ours</text>
<text x="${W - P}" y="${H - 12}" text-anchor="end">ms</text></svg>`;
}

// frame strip: screenshots every 50 ms for 800 ms right after the hero starts (load)
async function strip(browser, base, path, vp, file) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const shots = [];
  const t0 = Date.now();
  const nav = page.goto(base + path, { waitUntil: 'commit', timeout: 90000 });
  await nav;
  for (let i = 0; i < 40 && Date.now() - t0 < 2400; i++) {
    try {
      shots.push({ t: Date.now() - t0, buf: await page.screenshot({ type: 'jpeg', quality: 60 }) });
    } catch {
      // nothing painted yet
    }
    const next = t0 + (i + 1) * 50;
    if (next > Date.now()) await sleep(next - Date.now());
  }
  await ctx.close();
  const w = 320,
    h = Math.round((vp.height / vp.width) * 320);
  const picks = shots.filter((_, i) => i % 3 === 0).slice(0, 16);
  const tiles = await Promise.all(picks.map((s) => sharp(s.buf).resize(w, h).toBuffer()));
  const labels = picks.map((s, i) => ({
    input: Buffer.from(
      `<svg width="${w}" height="22"><rect width="90" height="22" fill="#000"/><text x="4" y="16" fill="#ff0" font-size="14" font-family="sans-serif">${s.t} ms</text></svg>`,
    ),
    left: (i % 4) * w,
    top: Math.floor(i / 4) * h,
  }));
  await sharp({
    create: {
      width: w * 4,
      height: h * Math.ceil(picks.length / 4),
      channels: 3,
      background: '#fff',
    },
  })
    .composite([
      ...tiles.map((b, i) => ({ input: b, left: (i % 4) * w, top: Math.floor(i / 4) * h })),
      ...labels,
    ])
    .png()
    .toFile(file);
}

const browser = await chromium.launch();
const report = {
  comparedAt: new Date().toISOString(),
  viewport: '1440×900, DSF 1, instant scroll steps of 0.6 vh',
  types: [],
};
const vp = { width: 1440, height: 900 };
const refHome = await sampleSite(browser, REF, '/', vp);
const ourHome = await sampleSite(browser, OURS, '/', vp);
const ourDist = await sampleSite(browser, OURS, '/distributors', vp);
const ours = [...ourHome, ...ourDist];
for (const T of TYPES) {
  const r = refHome.filter(T.ref);
  const o = ours.filter(T.ours);
  if (!r.length || !o.length) {
    report.types.push({ type: T.key, missing: !r.length ? 'reference' : 'ours' });
    continue;
  }
  const a = r[0];
  const b = o[0];
  const ra = rel(a);
  const rb = rel(b);
  const c = compareCurves(a.curve, b.curve);
  report.types.push({
    type: T.key,
    unit: [a.unit, b.unit],
    initialRelative: { ref: ra, ours: rb },
    unitDurationMs: [a.unitDurationMs, b.unitDurationMs],
    durationDiffPct: +(
      (Math.abs(a.unitDurationMs - b.unitDurationMs) / a.unitDurationMs) *
      100
    ).toFixed(1),
    staggerMs: [a.staggerMs, b.staggerMs],
    staggerDiffMs:
      a.staggerMs != null && b.staggerMs != null ? Math.abs(a.staggerMs - b.staggerMs) : null,
    overshoot: [a.overshoot, b.overshoot],
    ...c,
  });
  const svg = svgPlot(T.key, a.curve, b.curve);
  await sharp(Buffer.from(svg))
    .png()
    .toFile(`${OUT}/${T.key.replace(/[^a-z]+/g, '-')}.png`);
}
// marquee start (time of first movement after load, speed)
report.marquee = 'see docs/motion-measurements.json (reference) vs src/motion.js speeds.ticker';
writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify(report, null, 1));
await strip(browser, REF, '/', vp, `${OUT}/strip-reference-hero.png`);
await strip(browser, OURS, '/', vp, `${OUT}/strip-ours-hero.png`);
await browser.close();
