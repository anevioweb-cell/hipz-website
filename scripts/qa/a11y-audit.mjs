// Phase 7 Part 2: axe-core audit of every route and key UI states (WCAG 2.0/2.1/2.2 A+AA + best practice).
// Usage: node scripts/qa/a11y-audit.mjs [--base http://localhost:4174] → docs/qa/a11y-audit.json
import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { writeFileSync } from 'node:fs';

const BASE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : 'http://localhost:4174';
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// reveal everything (scroll through) so axe sees the final state, not mid-animation opacity
async function settle(page) {
  const end = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < end; y += 400) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await sleep(120);
  }
  await sleep(1500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(1800);
}

const STATES = [
  ['/', 'default', 1440],
  ['/', 'default', 390],
  ['/flavors', 'default', 1440],
  ['/flavors/lemon', 'default', 1440],
  ['/flavors/peach', 'default', 390],
  ['/distributors', 'default', 1440],
  ['/our-story', 'default', 1440],
  ['/our-story', 'default', 390],
  ['/no-such-page', '404', 1440],
  [
    '/',
    'mobile menu open',
    390,
    async (p) => {
      await p.getByRole('button', { name: /open menu/i }).click();
      await sleep(600);
    },
  ],
  [
    '/',
    'hero switcher paused',
    1440,
    async (p) => {
      await p.getByRole('button', { name: /^pause$/i }).click();
      await sleep(300);
    },
  ],
  [
    '/',
    'carousel focused',
    1440,
    async (p) => {
      const slide = p.locator('[aria-roledescription="carousel"] a').first();
      await slide.focus();
      await sleep(300);
    },
  ],
  [
    '/distributors',
    'form with errors',
    1440,
    async (p) => {
      await p.getByRole('button', { name: /send/i }).first().click();
      await sleep(500);
    },
  ],
  [
    '/distributors',
    'form success',
    1440,
    async (p) => {
      await p.fill('#business', 'Test shop');
      await p.fill('#contact', 'Test person');
      await p.fill('#phone', '0555123456');
      await p.selectOption('#wilaya', '16');
      await p.selectOption('#type', 'shop');
      await p.getByRole('button', { name: /send/i }).first().click();
      await sleep(1600);
    },
  ],
  [
    '/distributors',
    'store finder empty state',
    1440,
    async (p) => {
      await p.selectOption('#finder-wilaya', '09');
      await p.getByRole('button', { name: /show stockists/i }).click();
      await sleep(400);
    },
  ],
];

const browser = await chromium.launch();
const out = [];
for (const [path, state, width, act] of STATES) {
  const ctx = await browser.newContext({ viewport: { width, height: width < 600 ? 844 : 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: 'load' });
  await settle(page);
  if (act) await act(page);
  const r = await new AxeBuilder({ page }).withTags(TAGS).analyze();
  const pick = (list) =>
    list.map((v) => ({
      id: v.id,
      impact: v.impact,
      help: v.help,
      nodes: v.nodes
        .map((n) => ({
          target: n.target.join(' '),
          summary: (n.failureSummary || '').slice(0, 300),
        }))
        .slice(0, v.id === 'color-contrast' ? 200 : 8),
    }));
  const row = {
    path,
    state,
    width,
    violations: pick(r.violations),
    incomplete: pick(r.incomplete),
    passes: r.passes.length,
  };
  out.push(row);
  console.log(
    `${path} [${state}] @${width}: ${row.violations.length} violations, ${row.incomplete.length} needs-review, ${row.passes} passes`,
  );
  for (const v of row.violations)
    console.log(
      '  ✖',
      v.id,
      v.impact,
      v.nodes
        .map((n) => n.target)
        .join(' | ')
        .slice(0, 200),
    );
  for (const v of row.incomplete)
    console.log(
      '  ?',
      v.id,
      v.nodes.length,
      'nodes',
      v.nodes
        .map((n) => n.target)
        .join(' | ')
        .slice(0, 160),
    );
  await ctx.close();
}
await browser.close();
writeFileSync('docs/qa/a11y-audit.json', JSON.stringify(out, null, 1));
