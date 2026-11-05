import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import MomentsSection from './MomentsSection.jsx';
import WhySection from './WhySection.jsx';
import BothFlavorsFeature from './BothFlavorsFeature.jsx';
import CommunitySection, { CommunityRows } from './CommunitySection.jsx';
import { moments } from '../../data/moments.js';
import { communityPosts, fallbackTiles } from '../../data/community.js';
import { copy } from '../../data/copy.js';

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);
const CLAIMS =
  /calorie|sugar|vitamin|natural|organic|real fruit|made in|award|the best|review|customer|\d+\s?ml/i;

describe('Moments', () => {
  it('has four data-driven cards with copy, an icon or an optional image slot, and no claims', () => {
    expect(moments).toHaveLength(4);
    for (const m of moments) {
      expect(copy.moments[m.id].title).toBeTruthy();
      expect(copy.moments[m.id].ar).toBeTruthy();
      expect(m.icon).toBeTruthy();
      expect(m.image).toBeNull();
    }
    const { container } = wrap(<MomentsSection />);
    expect(container.querySelectorAll('article')).toHaveLength(4);
    expect(container.textContent).not.toMatch(CLAIMS);
    expect(container.textContent).not.toMatch(/\bnull\b|undefined/);
  });
  it('cards are not interactive (no links, buttons or focus stops)', () => {
    const { container } = wrap(<MomentsSection />);
    expect(
      container.querySelectorAll('article a, article button, article [tabindex]'),
    ).toHaveLength(0);
  });
});

describe('Why Hipz', () => {
  it('shows exactly the three owner-confirmed pillars, numbered, without claims', () => {
    const { container } = wrap(<WhySection />);
    expect(container.querySelectorAll('ol > li')).toHaveLength(3);
    expect(container.textContent).toMatch(/Kada & Miloud/);
    expect(container.textContent).toMatch(/ice cold/i);
    expect(container.textContent).not.toMatch(CLAIMS);
  });
});

describe('Both flavors feature', () => {
  it('has one "Find it" CTA to /distributors and no pack/price/cart wording', () => {
    const { container } = wrap(<BothFlavorsFeature />);
    expect(screen.getByRole('link', { name: 'Find it' })).toHaveAttribute('href', '/distributors');
    expect(container.textContent).not.toMatch(/pack|bundle|save|price|ship|cart|\d+\s?x\b/i);
  });
});

describe('Community', () => {
  it('ships with no posts and renders the designed fallback tiles (decorative, no handles)', () => {
    expect(communityPosts).toEqual([]);
    const { container } = wrap(<CommunitySection />);
    const rows = screen.getByTestId('community-rows');
    expect(rows).toHaveAttribute('aria-hidden', 'true');
    expect(container.textContent).not.toMatch(/@(?!hipzdrink)\w+/); // only our own handle in the CTA copy
    expect(container.textContent).not.toMatch(CLAIMS);
    expect(fallbackTiles.length).toBeGreaterThan(6);
  });
  it('CTA opens the Hipz Instagram safely', () => {
    wrap(<CommunitySection />);
    const cta = screen.getByRole('link', { name: /Tag @hipzdrink/ });
    expect(cta).toHaveAttribute('href', 'https://www.instagram.com/hipzdrink/');
    expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
  });
  it('renders real posts as accessible links when the array is filled later', () => {
    const posts = [
      {
        image: 'bottle-lemon',
        handle: '@someone',
        link: 'https://www.instagram.com/p/x/',
        alt: 'A post',
      },
    ];
    wrap(<CommunityRows posts={posts} />);
    expect(screen.getByTestId('community-rows')).not.toHaveAttribute('aria-hidden');
    expect(screen.getAllByRole('link', { name: /@someone on Instagram/ }).length).toBeGreaterThan(
      0,
    );
  });
});

describe('repository content', () => {
  it('has no TikTok reference in any source file', () => {
    const files = import.meta.glob(['../../**/*.{js,jsx}', '!../../**/*.test.{js,jsx}'], {
      query: '?raw',
      import: 'default',
      eager: true,
    });
    expect(Object.keys(files).length).toBeGreaterThan(20);
    for (const [path, src] of Object.entries(files)) expect(src, path).not.toMatch(/tiktok/i);
  });
});
