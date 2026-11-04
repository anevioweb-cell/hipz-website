// Phase 6 Part C1: measures the reference's MOTION BEHAVIOR frame by frame (requestAnimationFrame
// sampling of computed transform / opacity / filter / clip-path) on the home and a flavor detail page, at
// 1440×900 and 390×844 (device scale factor 1), under three scroll styles (slow wheel, normal wheel steps,
// instant jumps), plus replay (scroll back up and down), scroll mechanics, header, marquee and hover.
// Records numbers only; the committed JSON labels elements by type/size, never by the reference's text.
// Usage: node scripts/measure-motion.mjs [--only home] [--modes instant,slow] [--summarise]  (--summarise re-reads the raw dumps)
//        → docs/motion-measurements.json; raw frame dumps + videos in docs/shots/motion/ (gitignored).
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { existsSync, readFileSync } from 'node:fs';
import { fixedSummary, marqueeSummary, replayRule, samplerInit, summarise } from './motion-lib.mjs';

const BASE = process.env.MM_BASE || 'https://joybliss.framer.website';
const PAGES = { home: '/', detail: '/flavors/ruby-orange' };
const VIEWPORTS = { desktop: [1440, 900], mobile: [390, 844] };
const OUT = 'docs/shots/motion';
mkdirSync(OUT, { recursive: true });
const only = process.argv.includes('--only')
  ? process.argv[process.argv.indexOf('--only') + 1]
  : null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(browser, vp, path, video) {
  const [width, height] = VIEWPORTS[vp];
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: vp === 'mobile',
    hasTouch: vp === 'mobile',
    ...(video ? { recordVideo: { dir: OUT, size: { width, height } } } : {}),
  });
  await ctx.addInitScript(samplerInit);
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 90000 });
  await page.mouse.move(width / 2, height / 2);
  await sleep(3000);
  await page.evaluate(() => window.__mm.findFixed());
  return { ctx, page };
}
const now = (page) => page.evaluate(() => performance.now() - window.__mm.t0);
const maxScroll = (page) =>
  page.evaluate(() => document.documentElement.scrollHeight - innerHeight);

async function scenario(browser, vp, pageKey, mode) {
  const { ctx, page } = await open(browser, vp, PAGES[pageKey], mode === 'slow');
  const marks = [];
  const vh = VIEWPORTS[vp][1];
  const end = await maxScroll(page);
  if (mode === 'slow') {
    // ≈ 650 px/s: 40 px wheel ticks every 60 ms
    for (let y = 0; y < end; y += 40) {
      await page.mouse.wheel(0, 40);
      await sleep(60);
    }
    await sleep(2000);
  } else if (mode === 'wheel') {
    // a normal mouse wheel: 100 px notches, ~8 per second
    for (let y = 0; y < end; y += 100) {
      await page.mouse.wheel(0, 100);
      await sleep(120);
    }
    await sleep(2000);
  } else if (mode === 'instant' || mode === 'replay') {
    const step = Math.round(vh * 0.6);
    const down = async () => {
      for (let y = 0; y <= end + step; y += step) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await sleep(1500);
      }
    };
    marks.push(['down1', await now(page)]);
    await down();
    if (mode === 'replay') {
      marks.push(['up', await now(page)]);
      for (let y = end; y >= -step; y -= step) {
        await page.evaluate((v) => window.scrollTo(0, Math.max(0, v)), y);
        await sleep(1200);
      }
      marks.push(['down2', await now(page)]);
      await down();
    }
  } else if (mode === 'mechanics') {
    const probe = async () =>
      page.evaluate(async () => {
        const rows = [];
        const t0 = performance.now();
        const y0 = scrollY;
        await new Promise((r) => {
          const f = () => {
            rows.push([Math.round(performance.now() - t0), Math.round(scrollY - y0)]);
            if (performance.now() - t0 < 1500) requestAnimationFrame(f);
            else r();
          };
          requestAnimationFrame(f);
        });
        return rows;
      });
    const results = {};
    for (const dy of [100, 300]) {
      const p = probe();
      await sleep(30);
      await page.mouse.wheel(0, dy);
      results[`wheel${dy}`] = await p;
      await sleep(400);
    }
    await ctx.close();
    return { mechanics: results };
  } else if (mode === 'hover') {
    // hover the first visible pill button / link, then a card further down
    const res = {};
    for (const [key, sel] of [
      ['button', 'a[href*="flavors"], a[href*="#"]'],
      ['card', '[data-framer-name="Flavor card"]'],
    ]) {
      const el = page.locator(sel).first();
      if (!(await el.count())) continue;
      await el.scrollIntoViewIfNeeded();
      await sleep(1600);
      const t = await now(page);
      await el.hover();
      await sleep(900);
      await page.mouse.move(5, 5);
      await sleep(900);
      res[key] = t;
    }
    marks.push(...Object.entries(res));
  }
  const dump = await page.evaluate(() => window.__mm.dump());
  const video = page.video();
  await ctx.close();
  if (video) {
    const p = await video.path();
    marks.push(['video', p]);
  }
  writeFileSync(`${OUT}/raw-${pageKey}-${vp}-${mode}.json`, JSON.stringify({ marks, ...dump }));
  return { dump, marks };
}

const summariseOnly = process.argv.includes('--summarise');
const ALL_MODES = ['instant', 'slow', 'wheel', 'replay', 'mechanics', 'hover'];
const MODES = process.argv.includes('--modes')
  ? process.argv[process.argv.indexOf('--modes') + 1].split(',')
  : ALL_MODES;
const rawPath = (pageKey, vp, mode) => `${OUT}/raw-${pageKey}-${vp}-${mode}.json`;
const strip = (groups) => groups.map(({ _label, ...g }) => g); // no reference text in the committed file

if (!summariseOnly) {
  const browser = await chromium.launch();
  for (const pageKey of Object.keys(PAGES)) {
    if (only && only !== pageKey) continue;
    for (const vp of Object.keys(VIEWPORTS))
      for (const mode of MODES) {
        console.log(pageKey, vp, mode);
        const r = await scenario(browser, vp, pageKey, mode);
        if (r.mechanics) writeFileSync(rawPath(pageKey, vp, mode), JSON.stringify(r));
      }
  }
  await browser.close();
}

const result = {
  base: BASE.replace(/^https?:\/\//, ''),
  measuredAt: new Date().toISOString(),
  pages: {},
};
for (const pageKey of Object.keys(PAGES))
  for (const vp of Object.keys(VIEWPORTS)) {
    if (!ALL_MODES.every((m) => existsSync(rawPath(pageKey, vp, m)))) continue;
    const load = (mode) => JSON.parse(readFileSync(rawPath(pageKey, vp, mode), 'utf8'));
    const r = {};
    for (const mode of ['instant', 'slow', 'wheel']) r[mode] = strip(summarise(load(mode)));
    const inst = load('instant');
    r.fixed = fixedSummary(inst);
    r.marquee = marqueeSummary(inst);
    const rep = load('replay');
    r.replay = replayRule(rep, rep.marks);
    r.mechanics = load('mechanics').mechanics;
    const hov = load('hover');
    const firstHover = Math.min(
      ...hov.marks.filter((m) => typeof m[1] === 'number').map((m) => m[1]),
    );
    r.hover = strip(summarise(hov, { minStart: firstHover }));
    result.pages[pageKey] ??= {};
    result.pages[pageKey][vp] = r;
  }
writeFileSync('docs/motion-measurements.json', JSON.stringify(result, null, 1));
console.log('wrote docs/motion-measurements.json');
