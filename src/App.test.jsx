import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

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
  ])('%s renders its h1 without crashing', (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
  });
});

describe('flavor pages', () => {
  it('shows only verified attributes and never a size or placeholder text', () => {
    const { container } = renderAt('/flavors/lemon');
    expect(container.textContent).toMatch(/PET bottle with screw cap/);
    expect(container.textContent).toMatch(/Serve ice cold/);
    expect(container.textContent).not.toMatch(/\bnull\b|undefined|N\/A|medium/i);
    // the confirmed size appears exactly once, as text in "The basics"
    expect(container.textContent.match(/330 ml/g)).toHaveLength(1);
    expect(document.title).toBe('Lemon — Hipz');
  });
  it('renders the 404 for an unknown flavor slug', () => {
    renderAt('/flavors/mango');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
  });
  it('footer shows the social links safely and no TikTok or phone numbers', () => {
    const { container } = renderAt('/');
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
  it('assembles the sections in order and never renders a size', () => {
    const { container } = renderAt('/');
    const ids = [...container.querySelectorAll('main section[id]')].map((s) => s.id);
    expect(ids).toEqual(['flavors', 'moments', 'why', 'both', 'community']);
    expect(container.textContent).not.toMatch(/330|\bml\b|medium/i);
  });
});

describe('commercial phone numbers', () => {
  it('appear only on /distributors (never in the footer or other pages)', () => {
    for (const path of [
      '/',
      '/flavors',
      '/flavors/lemon',
      '/flavors/peach',
      '/our-story',
      '/nope',
    ]) {
      const { container, unmount } = renderAt(path);
      expect(container.textContent, path).not.toMatch(/60404339|70787889/);
      expect(container.querySelector('a[href^="tel:"]'), path).toBeNull();
      unmount();
    }
    const { container } = renderAt('/distributors');
    expect(container.textContent).toMatch(/05 60404339/);
    expect(container.textContent).toMatch(/07 70787889/);
    const footer = screen.getByRole('contentinfo');
    expect(footer.textContent).not.toMatch(/60404339|70787889/);
  });
  it('are only written in PUBLIC_CONTACT in the source', () => {
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
