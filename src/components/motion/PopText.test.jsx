import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import PopText from './PopText.jsx';

describe('<PopText>', () => {
  it('gives a heading one accessible name and hides the split characters', () => {
    render(<PopText as="h2" lines={['Say', 'Hipz.']} />);
    const h = screen.getByRole('heading', { level: 2, name: 'Say Hipz.' });
    const pieces = h.querySelector('[aria-hidden="true"]');
    expect(pieces).toBeTruthy();
    // one span per character, each starting at scale 0 (transform only)
    const chars = h.querySelectorAll('[data-pop]');
    expect([...chars].map((c) => c.textContent).join('')).toBe('SayHipz.');
    for (const c of chars) expect(c.style.transform).toBe('scale(0)');
    // lines keep their own block, words are never broken inside
    expect(h.querySelectorAll('span.block')).toHaveLength(2);
    expect(h.querySelector('.whitespace-nowrap')).toBeTruthy();
  });

  it('uses a visually hidden, non-selectable copy for paragraphs (aria-label is not allowed on p)', () => {
    const { container } = render(
      <PopText as="p" variant="soft" text="Two friends, two flavors." />,
    );
    const p = container.querySelector('p');
    expect(p).not.toHaveAttribute('aria-label');
    const sr = p.querySelector('.sr-only');
    expect(sr).toHaveTextContent('Two friends, two flavors.');
    expect(sr.className).toMatch(/select-none/);
    const chars = p.querySelectorAll('[data-pop]');
    expect(chars[0].style.opacity).toBe('0');
    expect(chars[0].style.transform).toMatch(/translateY\(20px\) rotate\(5deg\)/);
  });

  it('never splits Arabic words into letters', () => {
    const { container } = render(<PopText as="p" text="Hipz هايبز" />);
    const pieces = [...container.querySelectorAll('[data-pop]')].map((c) => c.textContent);
    expect(pieces).toContain('هايبز');
    expect(pieces).toEqual(['H', 'i', 'p', 'z', 'هايبز']);
  });

  it('shows the text without animation when IntersectionObserver is missing (fail-safe)', () => {
    const IO = window.IntersectionObserver;
    delete window.IntersectionObserver;
    try {
      const { container } = render(<PopText as="h2" text="Hello" />);
      for (const c of container.querySelectorAll('[data-pop]'))
        expect(c.style.transform).toBe('none');
    } finally {
      window.IntersectionObserver = IO;
    }
  });
});
