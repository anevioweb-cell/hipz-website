import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import FlavorCarousel from './FlavorCarousel.jsx';

const items = [1, 2, 3].map((n) => <div key={n}>item {n}</div>);

afterEach(() => {
  delete Element.prototype.scrollBy;
  delete HTMLElement.prototype.scrollWidth;
  delete HTMLElement.prototype.clientWidth;
});

describe('<FlavorCarousel>', () => {
  it('is a labelled carousel with numbered slides', () => {
    render(<FlavorCarousel label="Flavors">{items}</FlavorCarousel>);
    const carousel = screen.getByRole('group', { name: 'Flavors' });
    expect(carousel).toHaveAttribute('aria-roledescription', 'carousel');
    const slides = screen
      .getAllByRole('group')
      .filter((g) => g.getAttribute('aria-roledescription') === 'slide');
    expect(slides.map((s) => s.getAttribute('aria-label'))).toEqual(['1 of 3', '2 of 3', '3 of 3']);
  });
  it('hides the arrows when everything fits', () => {
    render(<FlavorCarousel>{items}</FlavorCarousel>);
    expect(screen.queryByRole('button', { name: 'Next flavor' })).toBeNull();
  });
  it('shows arrows on overflow and scrolls one step with arrow keys and buttons', () => {
    const scrollBy = vi.fn();
    Element.prototype.scrollBy = scrollBy;
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      configurable: true,
      get: () => 1200,
    });
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get: () => 400,
    });
    render(<FlavorCarousel>{items}</FlavorCarousel>);
    const scroller = screen.getByRole('region');
    fireEvent.keyDown(scroller, { key: 'ArrowRight' });
    expect(scrollBy.mock.calls.at(-1)[0].left).toBeGreaterThan(0);
    fireEvent.keyDown(scroller, { key: 'ArrowLeft' });
    expect(scrollBy.mock.calls.at(-1)[0].left).toBeLessThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Next flavor' }));
    expect(scrollBy.mock.calls.at(-1)[0].left).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Previous flavor' })).toBeDisabled();
  });
});
