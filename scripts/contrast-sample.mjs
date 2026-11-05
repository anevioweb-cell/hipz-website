// Phase 7 Part 2: resolves axe "needs review" colour-contrast items (text over images, gradients or
// transformed pieces) by WORST-PIXEL sampling: hide all text, screenshot, and compare the text colour
// with every background pixel under the element's box. Large text (≥ 24 px, or ≥ 18.66 px bold) needs
// 3:1, other text 4.5:1. Reads docs/a11y-audit.json; writes docs/contrast-sample.json.
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const BASE = 'http://localhost:4174';
const audit = JSON.parse(readFileSync('docs/a11y-audit.json', 'utf8'));
const lum = ([r, g, b]) => {
  const f = (c) => ((c /= 255) <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch();
const out = [];
for (const row of audit.filter((r) => r.state === 'default' || r.state === 'mobile menu open')) {
  const cc = row.incomplete.find((i) => i.id === 'color-contrast');
  if (!cc) continue;
  const page = await (
    await browser.newContext({
      viewport: { width: row.width, height: row.width < 600 ? 844 : 900 },
      reducedMotion: 'reduce',
    })
  ).newPage();
  await page.goto(BASE + row.path, { waitUntil: 'load' });
  await sleep(1500);
  if (row.state === 'mobile menu open') {
    await page.getByRole('button', { name: /open menu/i }).click();
    await sleep(500);
  }
  for (const node of cc.nodes) {
    const loc = page.locator(node.target).first();
    if (!(await loc.count())) continue;
    await loc.scrollIntoViewIfNeeded().catch(() => {});
    await sleep(150);
    const info = await loc.evaluate((e) => {
      const c = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      const rgb = c.color
        .match(/[\d.]+/g)
        .map(Number)
        .slice(0, 3);
      const size = parseFloat(c.fontSize);
      const bold = +c.fontWeight >= 700;
      return {
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        rgb,
        large: size >= 24 || (bold && size >= 18.66),
        text: e.textContent.trim().slice(0, 30),
      };
    });
    if (info.w < 1 || info.h < 1) continue;
    await page.addStyleTag({
      content:
        '*, *::before, *::after { color: transparent !important; text-shadow: none !important; caret-color: transparent !important; }',
    });
    await sleep(60);
    const shot = await page.screenshot();
    const { data, info: im } = await sharp(shot).raw().toBuffer({ resolveWithObject: true });
    const vals = [];
    for (let y = Math.max(0, Math.floor(info.y)); y < Math.min(im.height, info.y + info.h); y += 2)
      for (
        let x = Math.max(0, Math.floor(info.x));
        x < Math.min(im.width, info.x + info.w);
        x += 2
      ) {
        const k = (y * im.width + x) * im.channels;
        vals.push(ratio(info.rgb, [data[k], data[k + 1], data[k + 2]]));
      }
    // un-hide text for the next node
    await page.evaluate(() =>
      document
        .querySelectorAll('style')
        .forEach((s) => s.textContent.includes('color: transparent !important') && s.remove()),
    );
    if (!vals.length) continue;
    vals.sort((a, b) => a - b);
    const need = info.large ? 3 : 4.5;
    const res = {
      path: row.path,
      width: row.width,
      state: row.state,
      text: info.text,
      large: info.large,
      worst: +vals[0].toFixed(2),
      p5: +vals[Math.floor(vals.length * 0.05)].toFixed(2),
      need,
      pass: vals[0] >= need,
    };
    out.push(res);
    if (!res.pass) console.log('LOW', JSON.stringify(res));
  }
  await page.context().close();
}
await browser.close();
writeFileSync('docs/contrast-sample.json', JSON.stringify(out, null, 1));
const fails = out.filter((o) => !o.pass);
console.log(
  `${out.length} text nodes sampled; ${fails.length} below the AA threshold at their worst pixel; lowest:`,
  out
    .sort((a, b) => a.worst / a.need - b.worst / b.need)
    .slice(0, 5)
    .map((o) => `${o.path}@${o.width} "${o.text}" ${o.worst}/${o.need}`),
);
