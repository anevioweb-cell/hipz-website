// Local stand-in for the hosting rules in vercel.json (for checking only — not used in production):
// serves a build folder like Vercel would with this config — static file first, then the `rewrites` in
// order, then the matching `headers` (all that match are merged, later ones win per key).
// Usage: node scripts/qa/serve-vercel.mjs [dist] [port]
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const ROOT = process.argv[2] || 'dist';
const PORT = +(process.argv[3] || 4190);
const cfg = JSON.parse(readFileSync('vercel.json', 'utf8'));
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.avif': 'image/avif',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
};
// Vercel sources are path-to-regexp patterns; ours are literal paths or "/(regex)"
const toRe = (src) =>
  new RegExp(
    `^${
      src.startsWith('/(')
        ? src
        : src.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\\(\\\.\\\*\\\)/g, '(.*)')
    }$`,
  );
const fileFor = (p) => {
  const f = normalize(join(ROOT, decodeURIComponent(p)));
  return f.startsWith(normalize(ROOT)) && existsSync(f) && statSync(f).isFile() ? f : null;
};

createServer((req, res) => {
  const path = new URL(req.url, 'http://x').pathname;
  let file = fileFor(path);
  if (!file)
    for (const r of cfg.rewrites)
      if (toRe(r.source).test(path)) {
        file = fileFor(r.destination);
        if (file) break;
      }
  const headers = {};
  for (const h of cfg.headers)
    if (toRe(h.source).test(path)) for (const kv of h.headers) headers[kv.key] = kv.value;
  if (!file) {
    res.writeHead(404, headers).end('not found');
    return;
  }
  res.writeHead(200, {
    ...headers,
    'Content-Type': TYPES[extname(file)] || 'application/octet-stream',
  });
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`vercel-like preview of ${ROOT} on http://localhost:${PORT}`));
