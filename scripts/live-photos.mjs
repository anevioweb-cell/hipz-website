// Phase 8 photo acceptance on the LIVE site: every creator photo on /our-story loads (HTTP 200, image
// content-type, naturalWidth > 0) in Chromium, Firefox and WebKit at 390/768/1024/1440, and the static
// pre-JS first frame shows the hero photo. Screenshots → docs/shots/live/ (gitignored).
// Usage: node scripts/live-photos.mjs [https://hipz-website-snowy.vercel.app]
import { chromium, firefox, webkit } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.argv[2] || 'https://hipz-website-snowy.vercel.app';
const OUT = 'docs/shots/live';
mkdirSync(OUT, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
let failures = 0;

for (const type of [chromium, firefox, webkit]) {
  const browser = await type.launch();
  for (const [w, h] of [
    [390, 844],
    [768, 1024],
    [1024, 768],
    [1440, 900],
  ]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const responses = new Map();
    const bad = [];
    page.on('response', (r) => {
      responses.set(r.url(), { status: r.status(), type: r.headers()['content-type'] || '' });
      if (r.status() >= 400) bad.push(`${r.status()} ${r.url().replace(BASE, '')}`);
    });
    await page.goto(BASE + '/our-story', { waitUntil: 'load', timeout: 60000 });
    await sleep(1500);
    await page.screenshot({ path: `${OUT}/${type.name()}-story-hero-${w}.png` });
    // scroll through so lazy images load, then back to the duo band and gallery
    const end = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < end; y += Math.round(h * 0.5)) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await sleep(250);
    }
    await sleep(1500);
    for (const id of ['duo', 'bottling-title']) {
      await page.evaluate((i) => document.getElementById(i)?.scrollIntoView(), id);
      await sleep(900);
      await page.screenshot({ path: `${OUT}/${type.name()}-story-${id}-${w}.png` });
    }
    const imgs = await page.evaluate(() =>
      [...document.querySelectorAll('#root img')]
        .filter((i) => (i.currentSrc || i.src).includes('/creators/'))
        .map((i) => ({
          src: i.currentSrc || i.src,
          complete: i.complete,
          natural: i.naturalWidth,
          where: i.closest('[data-testid="collage"]')
            ? 'collage'
            : i.closest('section[aria-labelledby="story-title"]')
              ? 'hero'
              : 'gallery',
          visibility: getComputedStyle(i).visibility,
        })),
    );
    for (const i of imgs) {
      const r = responses.get(i.src);
      i.status = r?.status ?? 'cached/unknown';
      i.type = r?.type ?? '';
      i.ok =
        i.complete &&
        i.natural > 0 &&
        i.visibility !== 'hidden' &&
        (i.status === 200 || i.status === 304) &&
        /image\//.test(i.type);
      if (!i.ok) failures++;
    }
    const row = { engine: type.name(), width: w, images: imgs, notFound: bad };
    if (bad.length) failures++;
    results.push(row);
    const by = (k) => imgs.filter((i) => i.where === k);
    console.log(
      `${type.name()} ${w}: hero ${by('hero').filter((i) => i.ok).length}/${by('hero').length}, collage ${by('collage').filter((i) => i.ok).length}/${by('collage').length}, gallery ${by('gallery').filter((i) => i.ok).length}/${by('gallery').length}, 404s ${bad.length}`,
      imgs
        .filter((i) => !i.ok)
        .map(
          (i) => `${i.src.split('/').pop()} ${i.status} ${i.type} nw=${i.natural} ${i.visibility}`,
        )
        .join('; '),
    );
    await ctx.close();
  }
  // static pre-JS first frame: block the app bundle, so only the HTML + its static frame can paint
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  await page.route(/\/assets\/.*\.js$/, (r) => r.abort());
  await page.goto(BASE + '/our-story', { waitUntil: 'load', timeout: 60000 });
  await sleep(1500);
  const shell = await page.evaluate(() => {
    const img = document.querySelector('#hero-shell img');
    return img
      ? {
          natural: img.naturalWidth,
          src: (img.currentSrc || img.src).split('/').pop(),
          visible: getComputedStyle(document.getElementById('hero-shell')).visibility,
        }
      : null;
  });
  await page.screenshot({ path: `${OUT}/${type.name()}-story-prejs-390.png` });
  console.log(`${type.name()} pre-JS frame:`, JSON.stringify(shell));
  if (!shell || !shell.natural) failures++;
  results.push({ engine: type.name(), preJsFrame: shell });
  await ctx.close();
  await browser.close();
}
writeFileSync(`${OUT}/photos.json`, JSON.stringify(results, null, 1));
console.log(failures ? `✖ ${failures} problem(s)` : '✔ all creator photos load everywhere');
process.exit(failures ? 1 : 0);
