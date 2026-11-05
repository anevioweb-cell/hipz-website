// Measures MOTION NUMBERS of the reference site (computed styles / positions over time).
// Records numbers and behaviors only; copies no code, assets or text.
// Usage: npm run measure:reference   → docs/design/reference-measurements.json + docs/reference-shots/*.png
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const URL = 'https://joybliss.framer.website/';
const SHOTS = 'docs/reference-shots';
mkdirSync(SHOTS, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {};

const named = (n) => `[data-framer-name="${n}"]`;

async function setup(browser, width, height) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    isMobile: width < 600,
    hasTouch: width < 600,
  });
  const page = await ctx.newPage();
  return { ctx, page };
}

// Samples a function in the page every `step` ms for `total` ms using rAF timestamps.
async function sample(page, fnSrc, total, step) {
  return page.evaluate(
    async ({ fnSrc: src, total: t, step: s }) => {
      const fn = new Function(`return (${src})`)();
      const rows = [];
      const t0 = performance.now();
      while (performance.now() - t0 < t) {
        rows.push({ t: Math.round(performance.now() - t0), v: fn() });
        await new Promise((r) => setTimeout(r, s));
      }
      return rows;
    },
    { fnSrc, total, step },
  );
}

async function desktop(browser) {
  const { ctx, page } = await setup(browser, 1440, 900);
  const res = {};

  // ---- hero entrance: sample from the very first paint
  await page.addInitScript(() => {
    window.__rows = [];
    const t0 = performance.now();
    const grab = () => {
      const g = (sel) => {
        const e = document.querySelector(sel);
        if (!e) return null;
        const c = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        return { tf: c.transform, op: c.opacity, y: Math.round(r.top), w: Math.round(r.width) };
      };
      window.__rows.push({
        t: Math.round(performance.now() - t0),
        nav: g('[data-framer-name="Navbar"]'),
        h1: g('h1'),
        photo: g('[data-framer-name="Photo"]'),
        lead: g('[data-framer-name="Lead"]'),
        pill: g('[data-framer-name="Pill"]'),
        badge: g('[data-framer-name="Star badge"]'),
      });
      if (performance.now() - t0 < 3500) requestAnimationFrame(grab);
    };
    requestAnimationFrame(grab);
  });
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(4000);
  const rows = await page.evaluate(() => window.__rows);
  // keep ~every 5th row to stay readable
  res.heroEntrance = rows.filter((_, i) => i % 6 === 0);
  await page.screenshot({ path: `${SHOTS}/desktop-hero.png` });

  // ---- marquee (yellow ticker): positions over time
  const ticker = await page.evaluate(() => {
    const t = document.querySelector('[data-framer-name="Ticker"]');
    if (!t) return null;
    const kids = [...t.querySelectorAll('*')];
    const moving = kids.find((k) => getComputedStyle(k).transform !== 'none') || t;
    return {
      found: true,
      movingName: moving.getAttribute('data-framer-name'),
      cls: moving.tagName,
    };
  });
  res.tickerInfo = ticker;
  const tickRows = await sample(
    page,
    `() => {
      const t = document.querySelector('[data-framer-name="Ticker"]');
      const items = t ? t.querySelectorAll('[data-framer-name="Item"]') : [];
      const first = items[0];
      return first ? first.getBoundingClientRect().left : null;
    }`,
    3000,
    250,
  );
  res.tickerSamples = tickRows;
  const xs = tickRows.filter((r) => r.v !== null).slice(1);
  if (xs.length > 3) {
    const dx = xs[xs.length - 1].v - xs[0].v;
    const dt = (xs[xs.length - 1].t - xs[0].t) / 1000;
    res.tickerSpeedPxPerSec = Math.round((dx / dt) * 10) / 10; // negative = leftward
  }
  res.tickerGeometry = await page.evaluate(() => {
    const t = document.querySelector('[data-framer-name="Ticker"]');
    if (!t) return null;
    const it = t.querySelectorAll('[data-framer-name="Item"]');
    const r = t.getBoundingClientRect();
    return {
      h: Math.round(r.height),
      items: it.length,
      itemW: it[0] && Math.round(it[0].getBoundingClientRect().width),
      gap:
        it[1] &&
        it[0] &&
        Math.round(it[1].getBoundingClientRect().left - it[0].getBoundingClientRect().right),
    };
  });

  // ---- flavor carousel: scroll container, arrows, snap
  res.carousel = await page.evaluate(() => {
    const l = document.querySelector('[data-framer-name="Flavor list"]');
    if (!l) return null;
    const c = getComputedStyle(l);
    return {
      scrollWidth: l.scrollWidth,
      clientWidth: l.clientWidth,
      overflowX: c.overflowX,
      snap: c.scrollSnapType,
      behavior: c.scrollBehavior,
      cards: l.querySelectorAll('[data-framer-name="Flavor card"]').length,
    };
  });
  await page.locator(named('Flavors')).scrollIntoViewIfNeeded();
  await sleep(800);
  const next = page.locator(named('Next')).first();
  const before = await page.evaluate(
    () => document.querySelector('[data-framer-name="Flavor list"]')?.scrollLeft,
  );
  if (await next.count()) {
    await next.click({ force: true }).catch(() => {});
    const crow = await sample(
      page,
      `() => document.querySelector('[data-framer-name="Flavor list"]').scrollLeft`,
      1200,
      80,
    );
    res.carouselNextClick = { before, samples: crow.filter((_, i) => i % 2 === 0) };
  }
  await page.screenshot({ path: `${SHOTS}/desktop-flavors.png` });

  // ---- parallax / reveal: transform vs scroll
  async function trackAtScrolls(selector, ys) {
    const rows = [];
    for (const y of ys) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await sleep(900);
      rows.push(
        await page.evaluate(
          ({ sel, yy }) => {
            const e = document.querySelector(sel);
            if (!e) return { y: yy, missing: true };
            const c = getComputedStyle(e);
            const r = e.getBoundingClientRect();
            return {
              scrollY: yy,
              tf: c.transform,
              op: c.opacity,
              topInViewport: Math.round(r.top),
            };
          },
          { sel: selector, yy: y },
        ),
      );
    }
    return rows;
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(500);
  res.heroPhotoParallax = await trackAtScrolls(named('Photo'), [0, 150, 300, 450, 600, 800]);

  // ---- scroll reveals: find elements that start transformed/transparent, scroll through the page,
  //      record the viewport-relative position at which they settle.
  const reveals = await page.evaluate(async () => {
    const sleepIn = (ms) => new Promise((r) => setTimeout(r, ms));
    window.scrollTo(0, 0);
    await sleepIn(400);
    const cands = [...document.querySelectorAll('[data-framer-name]')].filter((e) => {
      const c = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return (
        (c.transform !== 'none' || parseFloat(c.opacity) < 1) &&
        r.top + scrollY > 900 &&
        r.width > 40
      );
    });
    const state = new Map(
      cands.map((e) => [
        e,
        {
          name: e.getAttribute('data-framer-name'),
          init: getComputedStyle(e).transform + ' | op ' + getComputedStyle(e).opacity,
        },
      ]),
    );
    const done = [];
    const H = document.documentElement.scrollHeight;
    for (let y = 0; y < H; y += 120) {
      window.scrollTo(0, y);
      await sleepIn(120);
      for (const [e, s] of state) {
        if (s.settled) continue;
        const c = getComputedStyle(e);
        if (c.transform === 'none' && parseFloat(c.opacity) === 1) {
          const r = e.getBoundingClientRect();
          s.settled = true;
          s.topAtSettleVh = Math.round((r.top / innerHeight) * 100);
          done.push(s);
        }
      }
    }
    return done.slice(0, 40);
  });
  res.scrollReveals = reveals;

  // ---- hover states (computed style before/after)
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(600);
  async function hover(selector, props) {
    const loc = page.locator(selector).first();
    if (!(await loc.count())) return { missing: selector };
    await loc.scrollIntoViewIfNeeded();
    await sleep(500);
    const read = () =>
      loc.evaluate((e, ps) => {
        const o = {};
        const c = getComputedStyle(e);
        for (const p of ps) o[p] = c[p];
        o.children = [...e.querySelectorAll('*')].slice(0, 6).map((k) => {
          const kc = getComputedStyle(k);
          return {
            name: k.getAttribute('data-framer-name'),
            tf: kc.transform,
            bg: kc.backgroundColor,
            w: Math.round(k.getBoundingClientRect().width),
          };
        });
        return o;
      }, props);
    const before = await read();
    await loc.hover({ force: true });
    const frames = [];
    for (let i = 0; i < 6; i++) {
      await sleep(80);
      frames.push(await read());
    }
    const after = frames[frames.length - 1];
    await page.mouse.move(5, 5);
    return { before, firstFrame: frames[0], after };
  }
  res.hover = {
    heroButton: await hover(named('Pill'), ['backgroundColor', 'transform', 'color']),
    flavorCard: await hover(named('Flavor card'), ['transform', 'backgroundColor', 'boxShadow']),
    can: await hover(named('Can'), ['transform']),
    pillLabel: await hover(named('Label'), ['transform', 'color']),
  };

  // ---- reveal trigger offsets (fine scroll) + idle float periods + arrow-chip hover
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(2500);
  res.revealTriggers = await page.evaluate(async () => {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    const names = ['Moment cards', 'Cloud', 'Pillar', 'Review rows', 'Brand', 'Links'];
    const out = [];
    for (const n of names) {
      const e = document.querySelector(`[data-framer-name="${n}"]`);
      if (!e) continue;
      const docTop =
        e.getBoundingClientRect().top +
        scrollY -
        parseFloat(getComputedStyle(e).transform.split(',')[5] || 0);
      window.scrollTo(0, Math.max(0, docTop - innerHeight - 100));
      await wait(500);
      let hit = null;
      for (let y = Math.max(0, docTop - innerHeight - 100); y < docTop + 200 && !hit; y += 20) {
        window.scrollTo(0, y);
        await wait(50);
        const c = getComputedStyle(e);
        if (parseFloat(c.opacity) > 0.02) {
          hit = { elementTopVh: Math.round(((docTop - y) / innerHeight) * 100), init: c.transform };
        }
      }
      // settle time after trigger
      const t0 = performance.now();
      let settleMs = null;
      while (performance.now() - t0 < 2500) {
        const c = getComputedStyle(e);
        if (
          parseFloat(c.opacity) >= 0.999 &&
          (c.transform === 'none' || /matrix\(1, 0, 0, 1, 0, 0\)/.test(c.transform))
        ) {
          settleMs = Math.round(performance.now() - t0);
          break;
        }
        await wait(16);
      }
      out.push({ name: n, trigger: hit, settleMsAfterTrigger: settleMs });
    }
    return out;
  });
  await page.evaluate(() => window.scrollTo(0, 1000));
  await sleep(1200);
  res.floatBlob = await sample(
    page,
    `() => { const b = document.querySelector('[data-framer-name="Blob"]'); if (!b) return null; const m = getComputedStyle(b).transform.match(/matrix\\(([^)]+)\\)/); if (!m) return null; const v = m[1].split(',').map(Number); return +(Math.atan2(v[1], v[0]) * 180 / Math.PI).toFixed(2); }`,
    9000,
    300,
  );
  const arrowHover = page.locator(named('Pill')).first();
  if (await arrowHover.count()) {
    await arrowHover.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollTo(0, 0));
    await sleep(600);
    const readArrow = () =>
      page.evaluate(() => {
        const p = document.querySelector('[data-framer-name="Pill"]');
        const g = (n) => {
          const e = p.querySelector(`[data-framer-name="${n}"]`);
          if (!e) return null;
          const c = getComputedStyle(e);
          return {
            tf: c.transform,
            bg: c.backgroundColor,
            color: c.color,
            w: Math.round(e.getBoundingClientRect().width),
            left: Math.round(e.getBoundingClientRect().left),
          };
        };
        return {
          pill: g('Pill') || { bg: getComputedStyle(p).backgroundColor },
          label: g('Label'),
          arrow: g('Arrow'),
          icon: [...p.querySelectorAll('svg')].map((v) => getComputedStyle(v).transform),
        };
      });
    const beforeA = await readArrow();
    await arrowHover.hover({ force: true });
    const hf = [];
    for (let i = 0; i < 8; i++) {
      await sleep(60);
      hf.push(await readArrow());
    }
    res.pillHover = { before: beforeA, frames: hf };
    await page.mouse.move(5, 5);
  }
  const canBox = page.locator(named('Flavor card')).first();
  if (await canBox.count()) {
    await canBox.scrollIntoViewIfNeeded();
    await sleep(900);
    const readCan = () =>
      page.evaluate(() => {
        const c = document.querySelector(
          '[data-framer-name="Flavor card"] [data-framer-name="Can"]',
        );
        const b = document.querySelector(
          '[data-framer-name="Flavor card"] [data-framer-name="Blob"]',
        );
        const cd = document.querySelector('[data-framer-name="Flavor card"]');
        return {
          can: getComputedStyle(c).transform,
          blob: getComputedStyle(b).transform,
          card: getComputedStyle(cd).transform,
          shadow: getComputedStyle(cd).boxShadow,
        };
      });
    const b0 = await readCan();
    await canBox.hover({ force: true });
    const cf = [];
    for (let i = 0; i < 8; i++) {
      await sleep(70);
      cf.push(await readCan());
    }
    res.cardHoverFrames = { before: b0, frames: cf };
    await page.mouse.move(5, 5);
  }

  // ---- page transition: click a flavor link, sample opacity of root + URL
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(2500);
  const link = page.locator('a[href*="flavors/"]').first();
  if (await link.count()) {
    await link.scrollIntoViewIfNeeded();
    const pt = await page.evaluate(() => {
      window.__pt = [];
      const t0 = performance.now();
      const loop = () => {
        const root = document.querySelector('#main') || document.body;
        window.__pt.push({
          t: Math.round(performance.now() - t0),
          op: getComputedStyle(root).opacity,
          path: location.pathname,
          y: scrollY,
        });
        if (performance.now() - t0 < 2500) requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
      return true;
    });
    void pt;
    await link.click({ force: true });
    await sleep(2800);
    res.pageTransition = (await page.evaluate(() => window.__pt)).filter((_, i) => i % 10 === 0);
    await page.screenshot({ path: `${SHOTS}/desktop-flavor-page.png` });
  }

  // ---- ingredients stage: sticky / floating cans vs scroll
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(2000);
  const stageTop = await page.evaluate(
    () =>
      document.querySelector('[data-framer-name="Ingredients"]')?.getBoundingClientRect().top +
      scrollY,
  );
  const cans = [];
  for (const dy of [0, 200, 400, 600, 800]) {
    await page.evaluate((y) => window.scrollTo(0, y), (stageTop || 0) + dy - 100);
    await sleep(900);
    cans.push(
      await page.evaluate(() => {
        const s = document.querySelector('[data-framer-name="Stage"]');
        const cs = [
          ...document.querySelectorAll('[data-framer-name="Cans"] > *, [data-framer-name="Cloud"]'),
        ].slice(0, 4);
        const sr = s?.getBoundingClientRect();
        return {
          scrollY: Math.round(scrollY),
          stageTop: sr && Math.round(sr.top),
          stagePos: s && getComputedStyle(s).position,
          items: cs.map((e) => ({
            n: e.getAttribute('data-framer-name'),
            tf: getComputedStyle(e).transform,
            top: Math.round(e.getBoundingClientRect().top),
          })),
        };
      }),
    );
  }
  res.ingredientsStage = cans;
  // sticky detection
  res.stickyElements = await page.evaluate(() =>
    [...document.querySelectorAll('*')]
      .filter((e) => getComputedStyle(e).position === 'sticky')
      .slice(0, 10)
      .map((e) => ({ n: e.getAttribute('data-framer-name'), top: getComputedStyle(e).top })),
  );

  // ---- review rows (marquee) speed
  await page.evaluate(() =>
    document.querySelector('[data-framer-name="Reviews"]')?.scrollIntoView(),
  );
  await sleep(1000);
  const rowSamples = await sample(
    page,
    `() => ['Row 1','Row 2'].map(n => { const r = document.querySelector('[data-framer-name="'+n+'"] [data-framer-name="Review"]'); return r ? r.getBoundingClientRect().left : null; })`,
    3000,
    250,
  );
  const sp = (i) => {
    const v = rowSamples.filter((r) => r.v && r.v[i] !== null);
    if (v.length < 3) return null;
    return Math.round(((v.at(-1).v[i] - v[0].v[i]) / ((v.at(-1).t - v[0].t) / 1000)) * 10) / 10;
  };
  res.reviewRows = {
    row1PxPerSec: sp(0),
    row2PxPerSec: sp(1),
    samples: rowSamples.filter((_, i) => i % 3 === 0),
  };

  // ---- pack card reveal
  res.packCard = await trackAtScrolls(named('Pack card'), [4800, 5200, 5600]);

  await ctx.close();
  return res;
}

async function mobile(browser) {
  const { ctx, page } = await setup(browser, 390, 844);
  const res = {};
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(3500);
  await page.screenshot({ path: `${SHOTS}/mobile-hero.png` });
  res.navbarButtons = await page.evaluate(() =>
    [...document.querySelectorAll('[data-framer-name="Navbar"] *')]
      .map((e) => e.getAttribute('data-framer-name'))
      .filter(Boolean),
  );
  // mobile menu: try clicking elements in the navbar's right side
  res.menu = { note: 'attempted' };
  const navBox = await page.locator(named('Navbar')).first().boundingBox();
  res.navBox = navBox;
  const beforeDom = await page.evaluate(() => document.querySelectorAll('*').length);
  const trigger = page.locator(`${named('Navbar')} ${named('Actions')} > *`).last();
  if (await trigger.count()) {
    await trigger.click({ force: true }).catch(() => {});
    await sleep(900);
    res.menu.domBefore = beforeDom;
    res.menu.domAfter = await page.evaluate(() => document.querySelectorAll('*').length);
    res.menu.names = await page.evaluate(() =>
      [
        ...new Set(
          [...document.querySelectorAll('[data-framer-name]')].map((e) =>
            e.getAttribute('data-framer-name'),
          ),
        ),
      ].filter((n) => /menu|drawer|overlay|close|cart/i.test(n)),
    );
    await page.screenshot({ path: `${SHOTS}/mobile-after-actions-click.png` });
  }
  // mobile marquee speed
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 90000 });
  await sleep(2500);
  const mt = await sample(
    page,
    `() => { const i = document.querySelector('[data-framer-name="Ticker"] [data-framer-name="Item"]'); return i ? i.getBoundingClientRect().left : null; }`,
    3000,
    250,
  );
  const mv = mt.filter((r) => r.v !== null).slice(1);
  if (mv.length > 3)
    res.tickerSpeedPxPerSec =
      Math.round(((mv.at(-1).v - mv[0].v) / ((mv.at(-1).t - mv[0].t) / 1000)) * 10) / 10;
  // layout at 390
  res.layout = await page.evaluate(() => {
    const g = (n) => {
      const e = document.querySelector(`[data-framer-name="${n}"]`);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { w: Math.round(r.width), h: Math.round(r.height) };
    };
    return { hero: g('Hero'), card: g('Flavor card'), moments: g('Moments'), pack: g('Pack card') };
  });
  await ctx.close();
  return res;
}

const browser = await chromium.launch();
try {
  out.desktop1440 = await desktop(browser);
  out.mobile390 = await mobile(browser);
} finally {
  await browser.close();
}
writeFileSync('docs/design/reference-measurements.json', JSON.stringify(out, null, 1));
console.log('wrote docs/design/reference-measurements.json; screenshots in', SHOTS);
console.log(
  'ticker px/s (desktop):',
  out.desktop1440.tickerSpeedPxPerSec,
  '(mobile):',
  out.mobile390.tickerSpeedPxPerSec,
);
console.log(
  'review rows px/s:',
  out.desktop1440.reviewRows?.row1PxPerSec,
  out.desktop1440.reviewRows?.row2PxPerSec,
);
