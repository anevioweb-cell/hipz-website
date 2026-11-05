import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { META_ROUTES, metaTags, withMeta } from './pageMeta.js';
import { copy } from '../data/copy.js';

describe('link-preview tags', () => {
  it('has neutral meta text for every route', () => {
    for (const r of META_ROUTES) {
      expect(copy.meta[r].title, r).toMatch(/Hipz/);
      expect(copy.meta[r].description.length, r).toBeGreaterThan(20);
      expect(copy.meta[r].description.length, r).toBeLessThan(160);
    }
  });
  it('uses absolute URLs once SITE_URL is set, relative (no og:url) while it is empty', () => {
    const rel = metaTags('/flavors/lemon', copy.meta['/flavors/lemon']);
    expect(rel).toContain('<meta property="og:image" content="/og.jpg" />');
    expect(rel).not.toContain('og:url');
    const abs = metaTags('/flavors/lemon', copy.meta['/flavors/lemon'], {
      siteUrl: 'https://x.example/',
    });
    expect(abs).toContain('<meta property="og:image" content="https://x.example/og.jpg" />');
    expect(abs).toContain('<meta property="og:url" content="https://x.example/flavors/lemon" />');
    expect(abs).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(abs).toContain('<title>Lemon — Hipz</title>');
  });
  it('escapes attribute values and replaces only the marked block', () => {
    const html = '<head><!--page-meta--><title>x</title><!--/page-meta--></head>';
    const out = withMeta(html, metaTags('/', { title: 'A "B" & C', description: '<b>' }));
    expect(out).toContain('content="A &quot;B&quot; &amp; C"');
    expect(out).toContain('content="&lt;b&gt;"');
  });
});

describe('hosting config (vercel.json) and noindex', () => {
  const v = JSON.parse(readFileSync('vercel.json', 'utf8'));
  const all = v.headers.find((h) => h.source === '/(.*)').headers;
  const get = (k) => all.find((h) => h.key === k)?.value;
  it('keeps noindex as a header and sets the basic security headers', () => {
    expect(get('X-Robots-Tag')).toBe('noindex, nofollow');
    expect(get('X-Content-Type-Options')).toBe('nosniff');
    expect(get('Referrer-Policy')).toBe('strict-origin-when-cross-origin');
    expect(get('Permissions-Policy')).toMatch(/camera=\(\)/);
  });
  it('caches hashed assets forever and revalidates HTML', () => {
    const cache = (src) => v.headers.find((h) => h.source === src).headers[0].value;
    expect(cache('/assets/(.*)')).toBe('public, max-age=31536000, immutable');
    expect(cache('/((?!assets/|images/).*)')).toMatch(/max-age=0/);
  });
  it('serves every route (and any unknown deep link) through a rewrite', () => {
    for (const r of META_ROUTES.filter((x) => x !== '/'))
      expect(v.rewrites.find((w) => w.source === r)?.destination, r).toBe(`${r}/index.html`);
    expect(v.rewrites.at(-1)).toEqual({
      source: '/((?!assets/|images/).*)',
      destination: '/index.html',
    });
  });
  it('does not use cleanUrls (it breaks the /index.html SPA fallback: unknown paths got Vercel 404s)', () => {
    expect(v.cleanUrls).toBeUndefined();
  });
  it('keeps the robots meta and robots.txt', () => {
    expect(readFileSync('index.html', 'utf8')).toContain(
      '<meta name="robots" content="noindex, nofollow" />',
    );
    expect(readFileSync('public/robots.txt', 'utf8')).toMatch(/Disallow: \//);
  });
});
