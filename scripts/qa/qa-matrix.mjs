// Phase 7 Part 1: cross-browser QA matrix (Chromium, Firefox, WebKit — WebKit is the closest engine to
// Safari available on Linux; it is NOT Safari). For every route × width: screenshots, console errors,
// failed requests, horizontal overflow, content left hidden after a full scroll, rounded-frame corners
// during the hero animation, chosen image format (AVIF/WebP/JPG via <picture>), sticky hero, carousel
// scroll snap, pre-JS first-frame handover; plus a keyboard tour and a reduced-motion run per route.
// Usage: node scripts/qa/qa-matrix.mjs [--base http://localhost:4174] [--engines chromium,firefox,webkit]
//        → docs/qa/qa-matrix.json + docs/shots/qa/ (gitignored). docs/qa/QA_MATRIX.md is written from it.
import { chromium, firefox, webkit } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const arg = (k, d) => (process.argv.includes(k) ? process.argv[process.argv.indexOf(k) + 1] : d);
const BASE = arg('--base', 'http://localhost:4174');
const ENGINES = arg('--engines', 'chromium,firefox,webkit').split(',');
const ROUTES = [
  '/',
  '/flavors',
  '/flavors/lemon',
  '/flavors/peach',
  '/distributors',
  '/our-story',
  '/no-such-page',
];
const ALL_WIDTHS = [
  [390, 844],
  [768, 1024],
  [1024, 768],
  [1440, 900],
];
const WIDTHS = arg('--widths', '390,768,1024,1440')
  .split(',')
  .map(Number)
  .map((w) => ALL_WIDTHS.find(([x]) => x === w));
const OUT = 'docs/shots/qa';
mkdirSync(OUT, { recursive: true });
const types = { chromium, firefox, webkit };
const slug = (r) => (r === '/' ? 'home' : r.slice(1).replace(/\//g, '-'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function load(page, path) {
  await page.goto(BASE + path, { waitUntil: 'load', timeout: 60000 });
}

async function one(browser, engine, path, [w, h]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h } });
  const page = await ctx.newPage();
  const errors = [];
  const failed = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message.slice(0, 160)));
  page.on('requestfailed', (r) =>
    failed.push(`${r.url().replace(BASE, '')} ${r.failure()?.errorText}`),
  );
  page.on(
    'response',
    (r) =>
      r.status() >= 400 &&
      !r.url().endsWith('/no-such-page') &&
      failed.push(`${r.url().replace(BASE, '')} ${r.status()}`),
  );
  await load(page, path);
  // hero mid-animation: rounded frame corners must stay round (top-left corner pixel = page background)
  await sleep(250);
  const corner = await page.evaluate(() => {
    const f = document.querySelector('#root .hero-frame-wrap > *');
    if (!f) return null;
    const r = f.getBoundingClientRect();
    return { x: Math.round(r.left + 1), y: Math.round(r.top + 1) };
  });
  let cornerOk = null;
  if (corner) {
    const buf = await page.screenshot({ clip: { x: corner.x, y: corner.y, width: 1, height: 1 } });
    const { default: sharp } = await import('sharp');
    const px = await sharp(buf).raw().toBuffer();
    // page background is paper #fff8e6; a square corner would show the hero image / colour instead
    cornerOk = Math.abs(px[0] - 0xff) + Math.abs(px[1] - 0xf8) + Math.abs(px[2] - 0xe6) < 30;
  }
  await sleep(2200);
  await page.screenshot({ path: `${OUT}/${engine}-${slug(path)}-${w}-top.png` });
  const info = await page.evaluate(() => {
    const img = [...document.querySelectorAll('#root picture img')].find((i) => i.currentSrc);
    const shell = document.getElementById('hero-shell');
    const heroWrap = document.querySelector('#root .hero-sticky, #root [class*="sticky"]');
    const snap = [...document.querySelectorAll('#root *')].find(
      (e) => getComputedStyle(e).scrollSnapType !== 'none',
    );
    return {
      format: img ? img.currentSrc.split('?')[0].split('.').pop() : null,
      shell: shell
        ? shell.classList.contains('is-hidden')
          ? 'hidden after load'
          : 'STILL VISIBLE'
        : 'none',
      sticky: heroWrap ? getComputedStyle(heroWrap).position : null,
      snap: snap ? getComputedStyle(snap).scrollSnapType : null,
      title: document.title,
    };
  });
  // full scroll, then check nothing stays hidden
  const end = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < end; y += Math.round(h * 0.4)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(160);
  }
  await sleep(2000);
  const after = await page.evaluate(() => ({
    hidden: [...document.querySelectorAll('[data-pop],[data-mm]')]
      .filter((e) => {
        const c = getComputedStyle(e);
        return +c.opacity < 0.05 || /matrix\(0, 0, 0, 0/.test(c.transform);
      })
      .map((e) => (e.dataset.mm || 'char') + ':' + e.textContent.trim().slice(0, 20)),
    overflowX: document.documentElement.scrollWidth - window.innerWidth,
  }));
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(300);
  await page.screenshot({ path: `${OUT}/${engine}-${slug(path)}-${w}-full.png`, fullPage: true });
  await ctx.close();
  return { engine, path, width: w, errors, failed, cornerOk, ...info, ...after };
}

async function keyboard(browser, engine, path) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await load(page, path);
  await sleep(300);
  const stops = [];
  let last = null;
  for (let i = 0; i < 40; i++) {
    // WebKit only tabs to links with Option+Tab by default (macOS setting); Playwright's WebKit follows that
    await page.keyboard.press(engine === 'webkit' ? 'Alt+Tab' : 'Tab');
    await sleep(70);
    const s = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body) return null;
      let op = 1;
      for (let n = e; n && n !== document.body; n = n.parentElement)
        op *= +getComputedStyle(n).opacity;
      const c = getComputedStyle(e);
      const ring =
        (c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0) || c.boxShadow !== 'none';
      const r = e.getBoundingClientRect();
      return {
        name: (e.getAttribute('aria-label') || e.textContent || e.tagName).trim().slice(0, 30),
        op: +op.toFixed(2),
        ring,
        size: [Math.round(r.width), Math.round(r.height)],
        id: e.outerHTML.slice(0, 80),
      };
    });
    if (!s || s.id === last) break;
    last = s.id;
    stops.push(s);
  }
  await ctx.close();
  return {
    engine,
    path,
    stops: stops.length,
    invisible: stops.filter((s) => s.op < 0.99).map((s) => s.name),
    noRing: stops.filter((s) => !s.ring).map((s) => s.name),
  };
}

async function reduced(browser, engine, path) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: 'reduce',
  });
  const page = await ctx.newPage();
  await load(page, path);
  await sleep(500);
  const r = await page.evaluate(() => ({
    split: document.querySelectorAll('[data-pop]').length,
    animatedBlocks: document.querySelectorAll('[data-mm]').length,
    invisibleText: [...document.querySelectorAll('h1,h2,h3,p,a,button,li')].filter((e) => {
      let op = 1;
      for (let n = e; n && n !== document.body; n = n.parentElement)
        op *= +getComputedStyle(n).opacity;
      return op < 0.05 && e.getBoundingClientRect().height > 0;
    }).length,
  }));
  await ctx.close();
  return { engine, path, ...r };
}

const result = {
  base: BASE,
  at: new Date().toISOString(),
  pages: [],
  keyboard: [],
  reduced: [],
  versions: {},
};
for (const engine of ENGINES) {
  const browser = await types[engine].launch();
  result.versions[engine] = browser.version();
  for (const path of ROUTES) {
    for (const vp of WIDTHS) {
      const r = await one(browser, engine, path, vp);
      result.pages.push(r);
      const bad =
        r.errors.length ||
        r.failed.length ||
        r.hidden.length ||
        r.overflowX > 0 ||
        r.cornerOk === false ||
        r.shell === 'STILL VISIBLE';
      console.log(
        engine,
        path,
        vp[0],
        bad
          ? 'ISSUE ' +
              JSON.stringify({
                e: r.errors,
                f: r.failed,
                h: r.hidden,
                o: r.overflowX,
                c: r.cornerOk,
                s: r.shell,
              })
          : 'ok',
        r.format,
      );
    }
    result.keyboard.push(await keyboard(browser, engine, path));
    result.reduced.push(await reduced(browser, engine, path));
  }
  await browser.close();
}
writeFileSync(arg('--out', 'docs/qa/qa-matrix.json'), JSON.stringify(result, null, 1));
console.log(
  'keyboard',
  JSON.stringify(result.keyboard.filter((k) => k.invisible.length || k.noRing.length)),
);
console.log(
  'reduced',
  JSON.stringify(result.reduced.filter((r) => r.split || r.animatedBlocks || r.invisibleText)),
);
