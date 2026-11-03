import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { images } from './src/data/images.generated.js';

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

// Static first frame of the home hero, painted by the browser BEFORE React loads (route "/" only).
// With the measured inset frame the hero image is no longer full-viewport, so Chrome counts it as the
// LCP element; without this shell it could only paint after the JS bundle had run. The shell uses the
// exact same image set / art direction / crop / 1.35 start scale as the React hero and is removed as
// soon as the React hero image has loaded (src/components/Hero.jsx). Decorative duplicate: alt="".
const heroShell = () => ({
  name: 'hero-shell',
  transformIndexHtml(html) {
    const wide = 'hero-lemon-wide';
    const por = 'hero-lemon-portrait';
    if (!images[wide] || !images[por]) return html;
    const set = (n, ext) =>
      images[n].variants.map((v) => `/images/${n}-${v.width}.${ext} ${v.width}w`).join(', ');
    const pct = (x) => `${Math.round(x * 1000) / 10}%`;
    const big = images[wide].variants.at(-1);
    const P = '(max-aspect-ratio: 1/1)';
    const vars = `--pos-wide:${pct(images[wide].focal.x)} 50%;--pos-portrait:${pct(images[por].focal.x)} 50%;--origin:${Math.round(images[wide].focal.x * 100)}% 50%`;
    const shell = `<template id="hero-shell-tpl"><div id="hero-shell" class="hero-shell hero-frame-wrap" aria-hidden="true"><div class="hero-frame"><div class="hero-shell-scene" style="${vars}"><picture><source media="${P}" type="image/avif" srcset="${set(por, 'avif')}" sizes="100vw" /><source media="${P}" type="image/webp" srcset="${set(por, 'webp')}" sizes="100vw" /><source type="image/avif" srcset="${set(wide, 'avif')}" sizes="100vw" /><source type="image/webp" srcset="${set(wide, 'webp')}" sizes="100vw" /><img src="/images/${wide}-${big.width}.jpg" srcset="${set(wide, 'jpg')}" sizes="100vw" width="${big.width}" height="${big.height}" alt="" fetchpriority="high" /></picture></div></div></div></template>
    <script>if (location.pathname === '/') document.body.appendChild(document.getElementById('hero-shell-tpl').content.cloneNode(true));</script>`;
    return html.replace('<div id="root"></div>', `${shell}\n    <div id="root"></div>`);
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), firstPaintTweaks(), heroShell()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
    css: false,
  },
});
