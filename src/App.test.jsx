import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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
    ['/distributors', 'Distributors'],
    ['/our-story', 'Our story'],
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
    expect(container.textContent).not.toMatch(/\bnull\b|undefined|N\/A|\d+\s?ml|medium/i);
    expect(document.title).toBe('Lemon — Hipz');
  });
  it('renders the 404 for an unknown flavor slug', () => {
    renderAt('/flavors/mango');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Page not found');
  });
  it('footer shows the social links safely and no TikTok or phone numbers', () => {
    const { container } = renderAt('/');
    const links = screen.getAllByRole('link', { name: /opens in a new tab/ });
    expect(links).toHaveLength(3);
    for (const a of links) {
      expect(a).toHaveAttribute('target', '_blank');
      expect(a).toHaveAttribute('rel', 'noopener noreferrer');
    }
    expect(container.textContent).not.toMatch(/tiktok|05 ?60|07 ?70/i);
  });
});
