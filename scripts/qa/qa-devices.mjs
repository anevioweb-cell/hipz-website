// Phase 7 Part 1: device emulation (Playwright device profiles: viewport, DPR, touch, mobile UA).
// iPhone SE / iPhone 15 Pro Max / iPad portrait+landscape on WebKit, Pixel 7 on Chromium.
// Checks: carousel swipe + scroll-snap settling, mobile-menu focus trap + Escape, rotation, safe-area CSS,
// overflow at every route, 320 px width and 200 % zoom (= 640 CSS px on a 1280 window) reflow.
// Emulation is not a real device: notches, dynamic toolbars and Safari itself are not reproduced.
import { chromium, webkit, devices } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:4174';
const ROUTES = ['/', '/flavors', '/flavors/lemon', '/flavors/peach', '/distributors', '/our-story'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = { at: new Date().toISOString(), devices: [], reflow: [] };

const DEVICES = [
  ['iPhone SE', webkit, devices['iPhone SE']],
  ['iPhone 15 Pro Max', webkit, devices['iPhone 15 Pro Max']],
  ['Pixel 7', chromium, devices['Pixel 7']],
  ['iPad portrait', webkit, devices['iPad (gen 7)']],
  ['iPad landscape', webkit, devices['iPad (gen 7) landscape']],
];

async function overflowAll(page) {
  const res = {};
  for (const r of ROUTES) {
    await page.goto(BASE + r, { waitUntil: 'load' });
    await sleep(600);
    res[r] = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  }
  return res;
}

for (const [name, type, profile] of DEVICES) {
  const browser = await type.launch();
  const ctx = await browser.newContext({ ...profile });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const r = {
    device: name,
    engine: type.name(),
    viewport: profile.viewport,
    dpr: profile.deviceScaleFactor,
  };
  r.overflow = await overflowAll(page);

  // carousel: swipe (real touch gesture on Chromium via CDP; programmatic scroll elsewhere) + snap settles
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await sleep(800);
  const car = page
    .locator(
      '[data-carousel], [aria-roledescription="carousel"] [class*="overflow-x"], #flavors [class*="snap-x"]',
    )
    .first();
  if (await car.count()) {
    await car.scrollIntoViewIfNeeded();
    await sleep(800);
    const box = await car.boundingBox();
    const before = await car.evaluate((e) => e.scrollLeft);
    if (type.name() === 'chromium') {
      // a real touch drag (touchStart → touchMove × 12 → touchEnd) through CDP
      const cdp = await ctx.newCDPSession(page);
      const y = Math.round(box.y + Math.min(box.height / 2, 300));
      const x0 = Math.round(box.x + box.width * 0.8);
      await cdp.send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: x0, y }],
      });
      for (let i = 1; i <= 12; i++) {
        await cdp.send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: x0 - i * 20, y }],
        });
        await sleep(16);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } else {
      await car.evaluate((e) => e.scrollBy({ left: e.clientWidth * 0.5, behavior: 'smooth' }));
    }
    await sleep(1200);
    r.carousel = await car.evaluate((e, before) => {
      // the carousel snaps card CENTRES (snap-center): after the swipe one card centre sits on the
      // container centre (±2 px), or the track is at an end
      const slides = [...e.querySelectorAll('[aria-roledescription="slide"]')];
      const cr = e.getBoundingClientRect();
      const mid = cr.left + cr.width / 2;
      const off = slides.map((c) => {
        const r = c.getBoundingClientRect();
        return Math.round(r.left + r.width / 2 - mid);
      });
      return {
        moved: e.scrollLeft - before,
        snapType: getComputedStyle(e).scrollSnapType,
        snapped:
          off.some((o) => Math.abs(o) <= 2) ||
          e.scrollLeft <= 1 ||
          e.scrollLeft + e.clientWidth >= e.scrollWidth - 2,
      };
    }, before);
  } else r.carousel = 'not found';

  // mobile menu: focus trap and Escape (only where the menu button is visible)
  const menuBtn = page.getByRole('button', { name: /open menu/i });
  if (await menuBtn.isVisible().catch(() => false)) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await menuBtn.click();
    await sleep(500);
    const escaped = [];
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press(type.name() === 'webkit' ? 'Alt+Tab' : 'Tab');
      await sleep(40);
      escaped.push(await page.evaluate(() => !!document.activeElement.closest('[role="dialog"]')));
    }
    await page.keyboard.press('Escape');
    await sleep(500);
    r.menu = {
      trapped: escaped.every(Boolean),
      closedOnEscape: !(await page.locator('[role="dialog"]').count()),
      focusBack: await page.evaluate(() =>
        /open menu/i.test(
          document.activeElement.getAttribute('aria-label') || document.activeElement.textContent,
        ),
      ),
    };
  } else r.menu = 'desktop nav (no menu button)';

  // safe-area CSS present
  r.safeArea = await page.evaluate(() => ({
    viewportFit: /viewport-fit=cover/.test(document.querySelector('meta[name=viewport]').content),
    bodyPadding: getComputedStyle(document.body).paddingLeft,
    textSizeAdjust:
      getComputedStyle(document.documentElement).webkitTextSizeAdjust ||
      getComputedStyle(document.documentElement).textSizeAdjust,
  }));

  // rotation (phones/tablets): swap the viewport and re-check overflow and the hero frame
  if (profile.isMobile) {
    const { width, height } = profile.viewport;
    await page.setViewportSize({ width: height, height: width });
    await page.goto(BASE + '/', { waitUntil: 'load' });
    await sleep(800);
    r.rotated = await page.evaluate(() => {
      const f = document.querySelector('#root .hero-frame-wrap > *');
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        frameH: f ? Math.round(f.getBoundingClientRect().height) : null,
        vh: window.innerHeight,
      };
    });
  }
  r.errors = errors;
  out.devices.push(r);
  console.log(JSON.stringify(r));
  await browser.close();
}

// reflow: 320 px wide (WCAG 1.4.10) and 200 % zoom on a 1280 px window (= 640 CSS px)
for (const [label, w, h] of [
  ['320 px', 320, 640],
  ['200 % zoom of 1280×800', 640, 400],
]) {
  const browser = await chromium.launch();
  const page = await (await browser.newContext({ viewport: { width: w, height: h } })).newPage();
  const res = await overflowAll(page);
  out.reflow.push({ label, overflow: res });
  console.log(label, JSON.stringify(res));
  await browser.close();
}
writeFileSync('docs/qa/qa-devices.json', JSON.stringify(out, null, 1));
