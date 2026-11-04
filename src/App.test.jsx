import { describe, expect, it } from 'vitest';
import { act, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

// lazy routes (/distributors, /our-story): load their chunks, then let Suspense resolve
const renderAt = async (path) => {
  await Promise.all([import('./pages/Distributors.jsx'), import('./pages/OurStory.jsx')]);
  let r;
  await act(async () => {
    r = render(
      <MemoryRouter initialEntries={[path]}>
        <App />
      </MemoryRouter>,
    );
  });
  return r;
};

describe('routes', () => {
  it.each([
    ['/', 'Thirsty? Say Hipz.'],
    ['/flavors', 'Flavors'],
    ['/flavors/peach', 'Peach'],
    ['/flavors/lemon', 'Lemon'],
    ['/distributors', 'Bring Hipz to your shelves.'],
    ['/our-story', 'Two friends.'],
    ['/nope', 'Page not found'],
    ['/flavors/mango', 'Page not found'],
    ['/credits', 'Page not found'],
  ])('%s renders its h1 without crashing', async (path, title) => {
    await renderAt(path);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
  });
});

describe('flavor pages', () => {
  it('shows only verified attributes and never a size or placeholder text', async () => {
    const { container } = await renderAt('/flavors/lemon');
    expect(container.textContent).toMatch(/PET bottle with screw cap/);
    expect(container.textContent).toMatch(/Serve ice cold/);
    expect(container.textContent).not.toMatch(/\bnull\b|undefined|N\/A|medium/i);
    // the confirmed size appears exactly once, as text in "The basics"
    expect(container.textContent.match(/330 ml/g)).toHaveLength(1);
    expect(document.title).toBe('Lemon — Hipz');
  });
  it('renders the 404 for an unknown flavor slug', async () => {
    await renderAt('/flavors/mango');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
  });
  it('footer shows the social links safely and no TikTok or phone numbers', async () => {
    const { container } = await renderAt('/');
    const footer = screen.getByRole('contentinfo');
    const links = within(footer).getAllByRole('link', { name: /opens in a new tab/ });
    expect(links).toHaveLength(3);
    for (const a of links) {
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    }
    expect(container.textContent).not.toMatch(/tiktok|05 ?60|07 ?70/i);
  });
});

describe('home page', () => {
  it('assembles the sections in order and never renders a size', async () => {
    const { container } = await renderAt('/');
    const ids = [...container.querySelectorAll('main section[id]')].map((s) => s.id);
    expect(ids).toEqual(['flavors', 'moments', 'why', 'both', 'community']);
    expect(container.textContent).not.toMatch(/330|\bml\b|medium/i);
  });
});

describe('commercial phone numbers', () => {
  it('appear only on /distributors (never in the footer or other pages)', async () => {
    for (const path of [
      '/',
      '/flavors',
      '/flavors/lemon',
      '/flavors/peach',
      '/our-story',
      '/nope',
    ]) {
      const { container, unmount } = await renderAt(path);
      expect(container.textContent, path).not.toMatch(/60404339|70787889/);
      expect(container.querySelector('a[href^="tel:"]'), path).toBeNull();
      unmount();
    }
    const { container } = await renderAt('/distributors');
    expect(container.textContent).toMatch(/05 60404339/);
    expect(container.textContent).toMatch(/07 70787889/);
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent).not.toMatch(/60404339|70787889/);
  });
  it('are only written in PUBLIC_CONTACT in the source', async () => {
    const files = import.meta.glob(['./**/*.{js,jsx}', '!./**/*.test.{js,jsx}'], {
      query: '?raw',
      import: 'default',
      eager: true,
    });
    const withNumbers = Object.entries(files)
      .filter(([, src]) => /60404339|70787889/.test(src))
      .map(([p]) => p);
    expect(withNumbers).toEqual(['./data/site.js']);
  });
});

describe('every page (Phase 6 sweep)', () => {
  const ROUTES = [
    '/',
    '/flavors',
    '/flavors/lemon',
    '/flavors/peach',
    '/distributors',
    '/our-story',
  ];
  it.each(ROUTES)(
    '%s: no TikTok, safe external links, alt on every image, no null leaks',
    async (path) => {
      const { container } = await renderAt(path);
      expect(container.innerHTML).not.toMatch(/tiktok/i);
      for (const a of container.querySelectorAll('a[target="_blank"]')) {
        expect(a.getAttribute('rel'), a.href).toBe('noopener noreferrer');
        expect(a.getAttribute('aria-label') || a.textContent.trim(), a.href).toBeTruthy();
      }
      for (const img of container.querySelectorAll('img'))
        expect(img.hasAttribute('alt'), img.getAttribute('src')).toBe(true);
      expect(container.textContent).not.toMatch(/\bnull\b|\bundefined\b|N\/A|NaN/);
    },
  );
  it.each(ROUTES)('%s: the volume appears only inside "The basics"', async (path) => {
    const { container } = await renderAt(path);
    const basics = [...container.querySelectorAll('section')].find((s) =>
      within(s).queryByRole('heading', { name: 'The basics' }),
    );
    const outside = container.cloneNode(true);
    if (basics) {
      const idx = [...container.querySelectorAll('section')].indexOf(basics);
      outside.querySelectorAll('section')[idx].remove();
    }
    expect(outside.textContent).not.toMatch(/\b330\b|\bml\b|medium/i);
  });
  it('/our-story references only selected creator photos', async () => {
    const { creatorPhotos } = await import('./data/creators.js');
    const allowed = creatorPhotos.filter((c) => c.selected).map((c) => c.image);
    const { container } = await renderAt('/our-story');
    const used = [...container.querySelectorAll('img, source')]
      .flatMap((e) => (e.getAttribute('srcset') || e.getAttribute('src') || '').split(','))
      .map((s) => s.trim().match(/\/images\/(creators\/[a-z]+-\d+)-/)?.[1])
      .filter(Boolean);
    expect(used.length).toBeGreaterThan(0);
    for (const u of new Set(used)) expect(allowed).toContain(u);
  });
});
