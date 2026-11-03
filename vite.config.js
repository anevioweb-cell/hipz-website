import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Preloads the two above-the-fold fonts (display + body, latin) in the built HTML so text does not
// reflow when they arrive (avoids layout shift on the hero). Hashed file names are read from the bundle.
const preloadCriticalFonts = () => ({
  name: 'preload-critical-fonts',
  transformIndexHtml: {
    order: 'post',
    handler(html, ctx) {
      if (!ctx.bundle) return html;
      const wanted = [/bricolage-grotesque-latin-wght-normal/, /inter-latin-wght-normal/];
      const tags = Object.keys(ctx.bundle)
        .filter((f) => wanted.some((re) => re.test(f)))
        .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="/${f}" />`);
      return html.replace('</head>', `${tags.join('\n    ')}\n  </head>`);
    },
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), preloadCriticalFonts()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: false,
    css: false,
  },
});
