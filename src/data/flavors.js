// Flavors: exactly two, confirmed by the owner (docs/BRAND_BRIEF.md rows 12–14).
// Anything not yet confirmed is null (renders an empty state, never filler).
// Colors reference tokens in src/index.css; hex values live ONLY there.
export const flavors = [
  {
    slug: 'lemon',
    name: 'Lemon',
    nameAr: null, // unconfirmed
    accent: 'var(--color-lemon)',
    accentDeep: 'var(--color-lemon-cap)',
    onAccent: 'var(--color-ink)',
    description: null,
    volume: null,
    image: null,
  },
  {
    slug: 'peach',
    name: 'Peach',
    nameAr: null, // unconfirmed
    accent: 'var(--color-peach)',
    accentDeep: 'var(--color-peach-cap)',
    onAccent: 'var(--color-ink)',
    description: null,
    volume: null,
    image: null,
  },
];

export const getFlavor = (slug) => flavors.find((f) => f.slug === slug);
