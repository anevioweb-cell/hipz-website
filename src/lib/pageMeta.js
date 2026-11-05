// Per-page <title>, meta description and link-preview tags (Open Graph + Twitter card), written into
// static HTML at build time (vite.config.js) because chat apps (WhatsApp, Instagram DM) read the HTML
// without running JavaScript. Text comes from copy.meta; the image is public/og.jpg (1200×630).
// noindex (robots meta, robots.txt, X-Robots-Tag) does not stop link previews: chat apps fetch the page
// for the person who shares it; they do not index it.

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * @param {string} route e.g. '/flavors/lemon'
 * @param {{ title: string, description: string }} meta
 * @param {{ siteUrl?: string, imageAlt?: string }} opts — siteUrl empty → relative URLs (no og:url)
 */
export function metaTags(route, meta, { siteUrl = '', imageAlt = '' } = {}) {
  const base = siteUrl.replace(/\/$/, '');
  const abs = (p) => (base ? base + p : p);
  const t = esc(meta.title);
  const d = esc(meta.description);
  return [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:site_name" content="Hipz" />',
    `<meta property="og:title" content="${t}" />`,
    `<meta property="og:description" content="${d}" />`,
    ...(base ? [`<meta property="og:url" content="${abs(route === '/' ? '/' : route)}" />`] : []),
    `<meta property="og:image" content="${abs('/og.jpg')}" />`,
    '<meta property="og:image:type" content="image/jpeg" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${esc(imageAlt)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${t}" />`,
    `<meta name="twitter:description" content="${d}" />`,
    `<meta name="twitter:image" content="${abs('/og.jpg')}" />`,
  ].join('\n    ');
}

export const META_ROUTES = [
  '/',
  '/flavors',
  '/flavors/lemon',
  '/flavors/peach',
  '/distributors',
  '/our-story',
];

/** Replace the <!--page-meta-->…<!--/page-meta--> block of an HTML document. */
export const withMeta = (html, tags) =>
  html.replace(
    /<!--page-meta-->[\s\S]*?<!--\/page-meta-->/,
    `<!--page-meta-->${tags}<!--/page-meta-->`,
  );
