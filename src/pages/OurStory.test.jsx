import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'motion/react';
import OurStory from './OurStory.jsx';
import { story } from '../data/story.js';
import { creatorPhotos } from '../data/creators.js';
import { PUBLIC_CONTACT } from '../data/site.js';

const selected = creatorPhotos.filter((c) => c.selected);
const src = (kind = 'owner') => ({ kind, ref: 'test fixture' });
// FAKE data — tests only
const full = {
  ...story,
  foundedYear: { value: 1999, source: src() },
  plantName: { value: 'Test Plant', source: src() },
  plantCity: { value: 'Test City', source: src() },
  originNote: { en: 'Test origin note.', ar: 'نص', source: src() },
  quotes: [
    { original: 'نص تجريبي', lang: 'ar', translation: 'Test text', by: 'Test', source: src() },
  ],
  milestones: [{ label: 'Test milestone', date: '1999-01-01', source: src() }],
};
const view = (props) =>
  render(
    <LazyMotion features={domAnimation}>
      <MemoryRouter>
        <OurStory {...props} />
      </MemoryRouter>
    </LazyMotion>,
  );

describe('/our-story', () => {
  it('renders with only the minimum confirmed facts: no optional block, no null leaks', () => {
    const { container } = view();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    for (const id of ['story-origin', 'story-milestones', 'story-quotes', 'story-plant'])
      expect(screen.queryByTestId(id)).toBeNull();
    expect(container.textContent).not.toMatch(/\bnull\b|\bundefined\b|N\/A|NaN/);
  });

  it('renders every optional block with full (fake) data, quotes with a labelled translation', () => {
    view({ data: full });
    for (const id of ['story-origin', 'story-milestones', 'story-quotes', 'story-plant'])
      expect(screen.getByTestId(id)).toBeInTheDocument();
    const q = screen.getByTestId('story-quotes');
    expect(within(q).getByText('نص تجريبي')).toHaveAttribute('lang', 'ar');
    expect(q).toHaveTextContent('Translation: Test text');
    expect(screen.getByTestId('story-plant')).toHaveTextContent('Test Plant · Test City');
  });

  it('hides unverified launch-video entries', () => {
    view({
      data: {
        ...story,
        quotes: [
          { original: 'نص', lang: 'ar', translation: 'T', by: 'X', source: src('launch-video') },
        ],
      },
    });
    expect(screen.queryByTestId('story-quotes')).toBeNull();
  });

  it('gives every image alt text, uses only selected photos and captions names only where verified', () => {
    const { container } = view();
    const imgs = [...container.querySelectorAll('img')];
    expect(imgs.length).toBeGreaterThan(0);
    for (const img of imgs) expect(img.hasAttribute('alt')).toBe(true);
    const creatorImgs = imgs.filter((i) => i.getAttribute('src').includes('/creators/'));
    const used = new Set(
      creatorImgs.map((i) => i.getAttribute('src').match(/creators\/([a-z]+-\d+)/)[1]),
    );
    for (const id of used) expect(selected.map((c) => c.id)).toContain(id);
    for (const i of creatorImgs) expect(i.getAttribute('alt').length).toBeGreaterThan(20);
    expect(screen.getByTestId('hero-caption')).toHaveTextContent(/^Kada & Miloud$/);
  });

  it('never shows a one-sided solo block; shows it only when both have solo photos', () => {
    const solo = (id, who) => ({
      ...creatorPhotos.find((c) => c.id === 'miloud-01'),
      id,
      selected: true,
      people: [who],
      caption: who === 'kada' ? 'Kada' : 'Miloud',
    });
    // today: no solo photos at all
    const a = view();
    expect(screen.queryByTestId('solo')).toBeNull();
    a.unmount();
    // only Miloud (or only Kada): still no solo block
    const b = view({ photos: [...selected, solo('m1', 'miloud'), solo('m2', 'miloud')] });
    expect(screen.queryByTestId('solo')).toBeNull();
    b.unmount();
    const c = view({ photos: [...selected, solo('k1', 'kada')] });
    expect(screen.queryByTestId('solo')).toBeNull();
    c.unmount();
    // both: the block appears, interleaved
    view({ photos: [...selected, solo('k1', 'kada'), solo('m1', 'miloud')] });
    const block = screen.getByTestId('solo');
    expect(within(block).getByText('Kada')).toBeInTheDocument();
    expect(within(block).getByText('Miloud')).toBeInTheDocument();
  });

  it('uses only duo photos and never the same crop twice', () => {
    const { container } = view();
    expect(selected.every((c) => c.people === null || c.people.length === 2)).toBe(true);
    const collage = screen.getByTestId('collage');
    expect(within(collage).getAllByRole('img').length).toBeGreaterThanOrEqual(2);
    const crops = [...container.querySelectorAll('img')]
      .filter((i) => i.getAttribute('src').includes('/creators/'))
      .map(
        (i) =>
          `${i.getAttribute('src').match(/creators\/([a-z]+-\d+)/)[1]} ${i.style.objectPosition} ${i.closest('[style*="scale"]')?.getAttribute('style') ?? ''} ${i.alt}`,
      );
    expect(new Set(crops).size).toBe(crops.length);
  });

  it('external links open safely with accessible names; no TikTok, no phone numbers', () => {
    const { container } = view();
    for (const a of container.querySelectorAll('a[target="_blank"]')) {
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
      expect(a.getAttribute('aria-label')).toMatch(/opens in a new tab/);
    }
    expect(container.innerHTML).not.toMatch(/tiktok/i);
    for (const p of PUBLIC_CONTACT.phones) expect(container.textContent).not.toContain(p.display);
    expect(container.querySelector('a[href^="tel:"]')).toBeNull();
    expect(container.textContent).not.toMatch(/330|ml\b/);
  });
});
