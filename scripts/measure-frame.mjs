// Re-measures the reference hero FRAME (margin, radius, height) and the navbar offsets inside it,
// plus whether the flavor-detail page uses the same frame. Numbers only; nothing is copied.
// Usage: node scripts/measure-frame.mjs  → docs/reference-frame.json
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = 'https://joybliss.framer.website';
const sizes = [
  [1440, 900],
  [1366, 768],
  [1024, 768],
  [768, 1024],
  [390, 844],
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = { home: {}, detail: {} };

const measure = (page) =>
  page.evaluate(() => {
    const q = (n) => document.querySelector(`[data-framer-name="${n}"]`);
    const R = (e) => {
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return {
        x: Math.round(r.left),
        y: Math.round(r.top + scrollY),
        w: Math.round(r.width),
        h: Math.round(r.height),
        right: Math.round(window.innerWidth - r.right),
      };
    };
    const hero = q('Hero');
    const cs = hero && getComputedStyle(hero);
    const wrap = q('Hero wrap');
    const logo = q('Logo');
    const actions = q('Actions');
    const docW = document.documentElement.clientWidth; // excludes scrollbar
    const hr = hero && hero.getBoundingClientRect();
    return {
      viewport: [window.innerWidth, window.innerHeight],
      clientWidth: docW,
      hero: R(hero),
      heroMargin: hr && {
        left: Math.round(hr.left),
        right: Math.round(docW - hr.right),
        top: Math.round(hr.top + scrollY),
      },
      radius: cs && cs.borderRadius,
      overflow: cs && cs.overflow,
      wrapPadding: wrap && getComputedStyle(wrap).padding,
      wrapPosition: wrap && getComputedStyle(wrap).position,
      heroVsViewportH: hr && Math.round(hr.height - window.innerHeight),
      logo: R(logo) && {
        ...R(logo),
        fromHeroLeft: Math.round(logo.getBoundingClientRect().left - hr.left),
        fromHeroTop: Math.round(logo.getBoundingClientRect().top - hr.top),
      },
      actions: R(actions) && {
        ...R(actions),
        fromHeroRight: Math.round(hr.right - actions.getBoundingClientRect().right),
        fromHeroTop: Math.round(actions.getBoundingClientRect().top - hr.top),
      },
      pageBg: getComputedStyle(document.body).backgroundColor,
    };
  });

const browser = await chromium.launch();
try {
  for (const [w, h] of sizes) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      isMobile: w < 600,
      hasTouch: w < 600,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + '/', { waitUntil: 'domcontentloaded', timeout: 90000 });
    await sleep(3500);
    out.home[`${w}x${h}`] = await measure(page);
    await page.goto(BASE + '/flavors/ruby-orange', {
      waitUntil: 'domcontentloaded',
      timeout: 90000,
    });
    await sleep(3000);
    out.detail[`${w}x${h}`] = await page.evaluate(() => {
      // does the detail page have a framed (inset, rounded) top block?
      const cands = [...document.querySelectorAll('[data-framer-name]')]
        .map((e) => {
          const r = e.getBoundingClientRect();
          const c = getComputedStyle(e);
          return {
            n: e.getAttribute('data-framer-name'),
            x: Math.round(r.left),
            y: Math.round(r.top),
            w: Math.round(r.width),
            h: Math.round(r.height),
            radius: c.borderRadius,
            bg: c.backgroundColor,
          };
        })
        .filter((c) => c.y < 200 && c.h > 300 && c.w > 300);
      return {
        firstBlocks: cands.slice(0, 6),
        names: [
          ...new Set(
            [...document.querySelectorAll('[data-framer-name]')].map((e) =>
              e.getAttribute('data-framer-name'),
            ),
          ),
        ].slice(0, 40),
      };
    });
    await ctx.close();
  }
} finally {
  await browser.close();
}
writeFileSync('docs/reference-frame.json', JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.home, null, 0));
console.log(JSON.stringify(out.detail['1440x900']));
