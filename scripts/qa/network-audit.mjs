// Phase 7 Part 3: request log per route (cold load at 390, then a full scroll so lazy images load):
// every request's host and transfer size → proves zero third-party requests and reports bytes per page.
// Also: main-thread busy time on the home page while idle (hero visible vs. scrolled offscreen).
// Usage: node scripts/qa/network-audit.mjs [--base http://localhost:4174] → docs/qa/network-audit.json
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:4174';
const origin = new URL(BASE).origin;
const ROUTES = [
  '/',
  '/flavors',
  '/flavors/lemon',
  '/flavors/peach',
  '/distributors',
  '/our-story',
  '/no-such-page',
];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = { origin, pages: [], idleCpu: null };
const browser = await chromium.launch();

for (const route of ROUTES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  const reqs = new Map();
  cdp.on('Network.requestWillBeSent', (e) =>
    reqs.set(e.requestId, { url: e.request.url, bytes: 0, type: e.type }),
  );
  cdp.on('Network.loadingFinished', (e) => {
    const r = reqs.get(e.requestId);
    if (r) r.bytes = e.encodedDataLength;
  });
  await page.goto(BASE + route, { waitUntil: 'load' });
  await sleep(1200);
  const atLoad = [...reqs.values()].reduce((s, r) => s + r.bytes, 0);
  const end = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < end; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(150);
  }
  await sleep(1500);
  const all = [...reqs.values()];
  const third = all.filter(
    (r) => !r.url.startsWith(origin) && !r.url.startsWith('data:') && !r.url.startsWith('blob:'),
  );
  const byType = {};
  for (const r of all) byType[r.type] = (byType[r.type] || 0) + r.bytes;
  const row = {
    route,
    requests: all.length,
    thirdParty: third.map((r) => r.url),
    kbAtLoad: Math.round(atLoad / 1024),
    kbAfterScroll: Math.round(all.reduce((s, r) => s + r.bytes, 0) / 1024),
    kbByType: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, Math.round(v / 1024)])),
  };
  out.pages.push(row);
  console.log(
    `${route}: ${row.requests} requests, third-party ${row.thirdParty.length}, ${row.kbAtLoad} KB at load, ${row.kbAfterScroll} KB after full scroll`,
    JSON.stringify(row.kbByType),
  );
  await ctx.close();
}

// idle CPU on home: TaskDuration over 5 s, hero in view (auto-advance + effects running) vs scrolled away
{
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Performance.enable');
  const task = async () =>
    (await cdp.send('Performance.getMetrics')).metrics.find((m) => m.name === 'TaskDuration').value;
  await page.goto(BASE + '/', { waitUntil: 'load' });
  await sleep(4000);
  let a = await task();
  await sleep(5000);
  const top = (await task()) - a;
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await sleep(2500);
  a = await task();
  await sleep(5000);
  const away = (await task()) - a;
  out.idleCpu = {
    heroVisibleMsPer5s: Math.round(top * 1000),
    scrolledAwayMsPer5s: Math.round(away * 1000),
  };
  console.log('idle main-thread time per 5 s on home:', JSON.stringify(out.idleCpu));
  await ctx.close();
}
await browser.close();
writeFileSync('docs/qa/network-audit.json', JSON.stringify(out, null, 1));
