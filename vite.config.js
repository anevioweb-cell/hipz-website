import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { images } from './src/data/images.generated.js';
import { DIST_BOTTLES } from './src/lib/distHeroClasses.js';
import { STORY_HERO } from './src/lib/storyHeroClasses.js';
import { creatorPhotos } from './src/data/creators.js';
import { pruneCreatorImages } from './scripts/creator-images.mjs';
import { META_ROUTES, metaTags, withMeta } from './src/lib/pageMeta.js';
import { copy } from './src/data/copy.js';
import { SITE_URL } from './src/config.js';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

// Build-only HTML tweaks for the first paint (measured with Lighthouse mobile, see the Phase 4 report):
// 1. preload the display font (headline) so it does not reflow when it arrives (CLS 0);
//    the body font is not preloaded any more: it competed with the hero image (the LCP element).
// 2. inline the (small, ~7 kB gz) stylesheet so it no longer blocks rendering on a separate request.
// Hashed file names are read from the bundle.
const firstPaintTweaks = () => ({
  name: 'first-paint-tweaks',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      if (!ctx.bundle) return html;
      const fonts = Object.keys(ctx.bundle)
        .filter((f) => /bricolage-grotesque-latin-wght-normal/.test(f))
        .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${f}" />`);
      let out = html.replace('</head>', `${fonts.join('\n    ')}\n  </head>`);
      for (const [file, chunk] of Object.entries(ctx.bundle)) {
        if (!file.endsWith('.css') || chunk.type !== 'asset') continue;
        const link = new RegExp(
          `<link rel="stylesheet"[^>]*href="/${file.replace('.', '\\.')}"[^>]*>`,
        );
        if (link.test(out)) out = out.replace(link, () => `<style>${chunk.source}</style>`);
      }
      return out;
    },
  },
});

// Static first frame of the page hero, painted by the browser BEFORE React loads, for "/" and the two
// flavor pages. With the measured inset frame the hero image is no longer full-viewport, so Chrome counts
// it as the LCP element; without this shell it could only paint after the JS bundle had run. Each shell
// uses the exact same image set / art direction / crop as its React hero (home: 1.35 start scale and the
// 6 % parallax extension; flavor pages: no scale) and is hidden once the React image has loaded
// (src/lib/heroShell.js). Decorative duplicate: alt="".
const heroShell = () => ({
  name: 'hero-shell',
  transformIndexHtml(html) {
    const set = (n, ext) =>
      images[n].variants.map((v) => `/images/${n}-${v.width}.${ext} ${v.width}w`).join(', ');
    const pct = (x) => `${Math.round(x * 1000) / 10}%`;
    const P = '(max-aspect-ratio: 1/1)';
    const shellFor = (id, flavor, variant) => {
      const wide = `hero-${flavor}-wide`;
      const por = `hero-${flavor}-portrait`;
      if (!images[wide] || !images[por]) return '';
      const big = images[wide].variants.at(-1);
      const vars = `--pos-wide:${pct(images[wide].focal.x)} 50%;--pos-portrait:${pct(images[por].focal.x)} 50%;--origin:${Math.round(images[wide].focal.x * 100)}% 50%`;
      return `<template id="${id}"><div id="hero-shell" class="hero-shell hero-shell--${variant} hero-frame-wrap" aria-hidden="true"><div class="hero-frame"><div class="hero-shell-scene" style="${vars}"><picture><source media="${P}" type="image/avif" srcset="${set(por, 'avif')}" sizes="100vw" /><source media="${P}" type="image/webp" srcset="${set(por, 'webp')}" sizes="100vw" /><source type="image/avif" srcset="${set(wide, 'avif')}" sizes="100vw" /><source type="image/webp" srcset="${set(wide, 'webp')}" sizes="100vw" /><img src="/images/${wide}-${big.width}.jpg" srcset="${set(wide, 'jpg')}" sizes="100vw" width="${big.width}" height="${big.height}" alt="" fetchpriority="high" /></picture></div></div></div></template>`;
    };
    const cutout = (n, sizes, cls) => {
      const big = images[n].variants.at(-1);
      return `<picture><source type="image/avif" srcset="${set(n, 'avif')}" sizes="${sizes}" /><source type="image/webp" srcset="${set(n, 'webp')}" sizes="${sizes}" /><img src="/images/${n}-${big.width}.png" srcset="${set(n, 'png')}" sizes="${sizes}" width="${big.width}" height="${big.height}" alt="" fetchpriority="high" class="${cls}" /></picture>`;
    };
    const distShell = images['bottle-lemon']
      ? `<template id="shell-dist"><div id="hero-shell" class="hero-shell hero-shell--dist hero-frame-wrap" aria-hidden="true"><div class="hero-frame bg-brand-lime"><div class="${DIST_BOTTLES.wrap}">${cutout('bottle-lemon', DIST_BOTTLES.lemonSizes, DIST_BOTTLES.lemon)}${cutout('bottle-peach', DIST_BOTTLES.peachSizes, DIST_BOTTLES.peach)}</div></div></div></template>`
      : '';
    // /our-story: the selected duo photo (only if its derivatives exist locally — they are gitignored)
    const storyPhoto = creatorPhotos.find((c) => c.selected && c.use === 'hero');
    const storyShell =
      storyPhoto && images[storyPhoto.image]
        ? (() => {
            const n = storyPhoto.image;
            const big = images[n].variants.at(-1);
            const op = `${Math.round(storyPhoto.focal.x * 100)}% ${Math.round(storyPhoto.focal.y * 100)}%`;
            return `<template id="shell-story"><div id="hero-shell" class="hero-shell hero-shell--story hero-frame-wrap" aria-hidden="true"><div class="hero-frame bg-peach-soft portrait:bg-ink"><div class="${STORY_HERO.photo}"><picture><source type="image/avif" srcset="${set(n, 'avif')}" sizes="${STORY_HERO.sizes}" /><source type="image/webp" srcset="${set(n, 'webp')}" sizes="${STORY_HERO.sizes}" /><img src="/images/${n}-${big.width}.jpg" srcset="${set(n, 'jpg')}" sizes="${STORY_HERO.sizes}" width="${big.width}" height="${big.height}" alt="" fetchpriority="high" class="${STORY_HERO.img}" style="object-position:${op}" /></picture></div><div class="${STORY_HERO.blend}"></div><div class="${STORY_HERO.scrim}"></div><div class="${STORY_HERO.topFade}"></div></div></div></template>`;
          })()
        : '';
    const templates =
      storyShell +
      distShell +
      shellFor('shell-home', 'lemon', 'home') +
      shellFor('shell-lemon', 'lemon', 'detail') +
      shellFor('shell-peach', 'peach', 'detail');
    const pick = `<script>(function(){var p=location.pathname.replace(/\\/$/,'')||'/';var id=p==='/'?'shell-home':p==='/flavors/lemon'?'shell-lemon':p==='/flavors/peach'?'shell-peach':p==='/distributors'?'shell-dist':p==='/our-story'?'shell-story':null;var t=id&&document.getElementById(id);if(t)document.body.appendChild(t.content.cloneNode(true));})();</script>`;
    return html.replace(
      '<div id="root"></div>',
      `${templates}\n    ${pick}\n    <div id="root"></div>`,
    );
  },
});

// Link previews: the home meta goes into index.html; every other route gets its own static copy
// (dist/<route>/index.html) with its own title/description/Open Graph tags, because chat apps read the
// HTML without running JS. The SPA boots the same way from any of them.
const tagsFor = (route) =>
  metaTags(route, copy.meta[route], {
    // SITE_URL from src/config.js; a SITE_URL environment variable overrides it for a one-off build
    siteUrl: process.env.SITE_URL || SITE_URL,
    imageAlt: copy.meta.imageAlt.text,
  });
const pageMeta = () => {
  let outDir = 'dist';
  return {
    name: 'page-meta',
    configResolved(c) {
      outDir = c.build.outDir;
    },
    transformIndexHtml: {
      order: 'post',
      handler: (html) => withMeta(html, tagsFor('/')),
    },
    closeBundle() {
      let html;
      try {
        html = readFileSync(`${outDir}/index.html`, 'utf8');
      } catch {
        return; // not a build
      }
      for (const route of META_ROUTES.filter((r) => r !== '/')) {
        mkdirSync(`${outDir}${route}`, { recursive: true });
        writeFileSync(`${outDir}${route}/index.html`, withMeta(html, tagsFor(route)));
      }
    },
  };
};

// public/ is copied whole by Vite; drop creator photos that no page uses (selected: false) from dist/.
const creatorImages = () => {
  let outDir = 'dist';
  return {
    name: 'creator-images',
    apply: 'build',
    configResolved(c) {
      outDir = c.build.outDir;
    },
    closeBundle() {
      pruneCreatorImages(outDir);
    },
  };
};

export default defineConfig({
  plugins: [react(), tailwindcss(), firstPaintTweaks(), heroShell(), creatorImages(), pageMeta()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
    css: false,
  },
});
