// Phase 7 Part 2: manual-check helpers per route — heading outline, landmarks, skip link, touch-target
// sizes (WCAG 2.5.8 AA ≥ 24 px; our goal ≥ 44 px), html lang, Arabic spans (lang="ar" dir="rtl"), alt text.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const BASE = 'http://localhost:4174';
const ROUTES = [
  '/',
  '/flavors',
  '/flavors/lemon',
  '/flavors/peach',
  '/distributors',
  '/our-story',
  '/no-such-page',
];
const b = await chromium.launch();
const out = [];
for (const w of [390, 1440])
  for (const r of ROUTES) {
    const p = await (
      await b.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'reduce' })
    ).newPage();
    await p.goto(BASE + r, { waitUntil: 'load' });
    await p.waitForTimeout(800);
    const res = await p.evaluate(() => {
      const vis = (e) => {
        const s = getComputedStyle(e);
        const rc = e.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && rc.width > 0 && rc.height > 0;
      };
      const heads = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter(vis)
        .map((h) => +h.tagName[1]);
      const skips = heads.filter((l, i) => i > 0 && l > heads[i - 1] + 1).length;
      const inParagraph = (e) => !!e.closest('p, li > p, dd');
      const targets = [
        ...document.querySelectorAll('a[href], button, select, input, textarea, [tabindex="0"]'),
      ]
        .filter(vis)
        .filter(
          (e) =>
            !e.closest('[aria-hidden="true"]') && e.type !== 'hidden' && !e.closest('.sr-only'),
        )
        .map((e) => {
          const rc = e.getBoundingClientRect();
          return {
            t: (e.getAttribute('aria-label') || e.textContent || e.name || e.tagName)
              .trim()
              .slice(0, 28),
            w: Math.round(rc.width),
            h: Math.round(rc.height),
            inline: inParagraph(e),
          };
        });
      const ar = [...document.querySelectorAll('.ar')];
      return {
        lang: document.documentElement.lang,
        h1: heads.filter((l) => l === 1).length,
        outline: heads.join(''),
        skips,
        landmarks: ['header', 'nav', 'main', 'footer']
          .map((t) => `${t}:${document.querySelectorAll(t).length}`)
          .join(' '),
        skipLink: !!document.querySelector('a[href="#main"], a[href="#content"]'),
        under24: targets.filter((t) => !t.inline && (t.w < 24 || t.h < 24)),
        under44: targets
          .filter((t) => !t.inline && (t.w < 44 || t.h < 44))
          .map((t) => `${t.t} ${t.w}×${t.h}`),
        arabicSpans: ar.length,
        arabicBad: ar.filter(
          (e) => e.getAttribute('lang') !== 'ar' || e.getAttribute('dir') !== 'rtl',
        ).length,
        imgNoAlt: [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt'))
          .length,
      };
    });
    out.push({ route: r, width: w, ...res });
    console.log(
      w,
      r,
      `lang=${res.lang} h1=${res.h1} outline=${res.outline} skips=${res.skips} ${res.landmarks} skip=${res.skipLink} <24:${res.under24.length} <44:${res.under44.length} ar=${res.arabicSpans}/${res.arabicBad}bad noalt=${res.imgNoAlt}`,
    );
    if (res.under44.length) console.log('   <44:', res.under44.join(' | '));
    await p.context().close();
  }
await b.close();
writeFileSync('docs/a11y-structure.json', JSON.stringify(out, null, 1));
