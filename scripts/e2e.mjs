// `npm run e2e` (Phase 7 Part 5): end-to-end flows in a real browser (Chromium by default) against the
// production build, served with the vercel.json rules (scripts/serve-vercel.mjs). Not part of
// `npm run check`. Hard time limit: the run aborts after 120 s, so it can never hang.
// Usage: npm run e2e            (builds first)   ·   node scripts/e2e.mjs [--engine webkit|firefox]
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { chromium, firefox, webkit } from 'playwright';

const PORT = 4195;
// --base https://… runs the flows against a deployed site (no local server)
const LIVE = process.argv.includes('--base')
  ? process.argv[process.argv.indexOf('--base') + 1]
  : null;
const B = LIVE || `http://localhost:${PORT}`;
const engine = process.argv.includes('--engine')
  ? process.argv[process.argv.indexOf('--engine') + 1]
  : 'chromium';
const started = Date.now();
const kill = setTimeout(() => {
  console.error('✖ e2e aborted: time limit (120 s) reached');
  process.exit(1);
}, 120_000);

const server = LIVE
  ? { kill() {} }
  : spawn('node', ['scripts/serve-vercel.mjs', 'dist', String(PORT)], { stdio: 'ignore' });
for (let i = 0; i < 50; i++) {
  try {
    await fetch(B);
    break;
  } catch {
    await new Promise((r) => setTimeout(r, 100));
  }
}

const browser = await { chromium, firefox, webkit }[engine].launch();
const results = [];
async function flow(name, fn, viewport = { width: 1440, height: 900 }) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  const t = Date.now();
  try {
    await fn(page, ctx);
    assert.deepEqual(errors, [], 'no uncaught page errors');
    results.push([name, 'pass', Date.now() - t]);
  } catch (e) {
    results.push([name, `FAIL: ${e.message.split('\n')[0]}`, Date.now() - t]);
  }
  await ctx.close();
}
const tab = (page) => page.keyboard.press(engine === 'webkit' ? 'Alt+Tab' : 'Tab');

await flow('hero switcher and Pause', async (p) => {
  await p.goto(B + '/');
  const peach = p.getByRole('button', { name: /Peach/ }).first();
  await peach.click();
  assert.equal(await peach.getAttribute('aria-pressed'), 'true');
  await p.getByRole('button', { name: /^Pause$/ }).click();
  await p.getByRole('button', { name: /^Play$/ }).waitFor();
});

await flow(
  'flavor carousel by keyboard',
  async (p) => {
    await p.goto(B + '/');
    const region = p.locator('[aria-roledescription="carousel"] [role="region"]');
    await region.scrollIntoViewIfNeeded();
    await region.focus();
    const before = await region.evaluate((e) => e.scrollLeft);
    await p.keyboard.press('ArrowRight');
    await p.waitForTimeout(700);
    assert.ok(
      (await region.evaluate((e) => e.scrollLeft)) > before,
      'ArrowRight scrolls the carousel',
    );
  },
  { width: 390, height: 844 },
);

await flow('navigate to each flavor', async (p) => {
  for (const [slug, name] of [
    ['lemon', 'Lemon'],
    ['peach', 'Peach'],
  ]) {
    await p.goto(B + '/flavors');
    const link = p.locator(`#root a[href="/flavors/${slug}"]`).first(); // not the static frame
    // blocks rise into place for ~0.7 s after entering the view (measured motion): let it settle
    await link.scrollIntoViewIfNeeded();
    await p.waitForTimeout(1200);
    await link.click();
    await p.waitForURL(`**/flavors/${slug}`, { waitUntil: 'commit' }); // client-side navigation
    await p.getByRole('heading', { level: 1, name }).waitFor({ timeout: 5000 });
    // the size appears exactly once, in "The basics"
    assert.equal(((await p.locator('main').textContent()).match(/330 ml/g) || []).length, 1);
  }
});

await flow('unknown flavor and unknown page show the 404', async (p) => {
  for (const path of ['/flavors/mango', '/nope/deep/link']) {
    const res = await p.goto(B + path);
    assert.equal(res.status(), 200, 'SPA fallback');
    await p.getByRole('heading', { level: 1, name: 'Page not found' }).waitFor();
  }
});

await flow('distributors form: errors, success, nothing sent (DEMO_MODE)', async (p) => {
  await p.goto(B + '/distributors');
  await p.getByRole('button', { name: /send/i }).first().click();
  await p.waitForTimeout(200);
  assert.equal(
    await p.evaluate(() => document.activeElement.id),
    'business',
    'focus moves to the first error',
  );
  assert.ok((await p.locator('[aria-invalid="true"]').count()) >= 4);
  const sent = [];
  p.on('request', (r) => sent.push(`${r.method()} ${r.url()}`));
  await p.fill('#business', 'Test shop');
  await p.fill('#contact', 'Test person');
  await p.fill('#phone', '0555 12 34 56');
  await p.selectOption('#wilaya', '16');
  await p.selectOption('#type', 'shop');
  await p.getByRole('button', { name: /send/i }).first().click();
  await p.getByTestId('form-success').waitFor({ timeout: 5000 });
  assert.deepEqual(sent, [], 'no request at all during submit');
  const storage = await p.evaluate(() => [
    localStorage.length,
    sessionStorage.length,
    document.cookie,
  ]);
  assert.deepEqual(storage, [0, 0, '']);
});

await flow('store finder empty state', async (p) => {
  await p.goto(B + '/distributors');
  await p.selectOption('#finder-wilaya', '09');
  await p.getByRole('button', { name: /show stockists/i }).click();
  await p.getByText('No stockists listed here yet').waitFor();
});

await flow('our story renders (duo photos only)', async (p) => {
  await p.goto(B + '/our-story');
  assert.equal(
    (await p.locator('h1').textContent()).replace(/\s+/g, ' ').trim(),
    'Two friends. One smile.',
  );
  await p.getByTestId('collage').waitFor();
  assert.equal(await p.getByTestId('solo').count(), 0, 'no one-sided solo block');
  const srcs = await p
    .locator('img[src*="/creators/"]')
    .evaluateAll((l) => l.map((i) => i.getAttribute('src')));
  assert.ok(
    srcs.every((s) => /creators\/both-0[123]/.test(s)),
    'only duo photos',
  );
});

await flow(
  'mobile menu traps focus and closes on Escape',
  async (p) => {
    await p.goto(B + '/');
    // the navbar's measured entrance moves it 24 px during the first ~0.8 s: let it settle first
    await p.waitForTimeout(1200);
    await p.getByRole('button', { name: /open menu/i }).click();
    await p.getByRole('dialog').waitFor();
    await p.waitForTimeout(400); // the menu moves focus inside once it is open
    for (let i = 0; i < 12; i++) {
      await tab(p);
      assert.ok(
        await p.evaluate(() => !!document.activeElement.closest('[role="dialog"]')),
        'focus stays in the menu',
      );
    }
    await p.keyboard.press('Escape');
    await p.waitForTimeout(900); // the menu fades out (≈ 0.4 s)
    assert.equal(await p.locator('[role="dialog"]').count(), 0);
  },
  { width: 390, height: 844 },
);

await flow('content rules on every page (TikTok, phones, volume)', async (p) => {
  for (const path of [
    '/',
    '/flavors',
    '/flavors/lemon',
    '/flavors/peach',
    '/distributors',
    '/our-story',
    '/nope',
  ]) {
    await p.goto(B + path);
    await p.waitForTimeout(400);
    const html = await p.content();
    const text = await p.locator('body').textContent();
    assert.ok(!/tiktok/i.test(html), `${path}: no TikTok`);
    const phones = /60404339|70787889/.test(text) || /tel:/.test(html);
    assert.equal(phones, path === '/distributors', `${path}: phone numbers only on /distributors`);
    const vol = (text.match(/330 ml/g) || []).length;
    assert.equal(vol, path.startsWith('/flavors/') ? 1 : 0, `${path}: volume only in "The basics"`);
  }
});

await browser.close();
server.kill();
clearTimeout(kill);
const fails = results.filter((r) => r[1] !== 'pass');
for (const [n, r, ms] of results)
  console.log(`${r === 'pass' ? '✔' : '✖'} ${n} (${ms} ms)${r === 'pass' ? '' : ' — ' + r}`);
console.log(
  `${results.length - fails.length}/${results.length} flows passed on ${engine} in ${((Date.now() - started) / 1000).toFixed(1)} s`,
);
process.exit(fails.length ? 1 : 0);
