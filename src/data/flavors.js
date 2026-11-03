// Flavors: exactly two, confirmed by the owner (docs/BRAND_BRIEF.md rows 12–14, 22).
// Unknown facts stay null — in particular `volume`: the size is unknown and must never be shown.
// Colors reference tokens in src/index.css; hex values live ONLY there.
export const flavors = [
  {
    slug: 'lemon',
    name: 'Lemon',
    nameAr: 'ليمون',
    accent: 'var(--color-lemon)',
    accentDeep: 'var(--color-lemon-cap)',
    onAccent: 'var(--color-ink)',
    description: null,
    volume: null,
    heroImage: 'hero-lemon',
    bottleImage: 'bottle-lemon',
  },
  {
    slug: 'peach',
    name: 'Peach',
    nameAr: 'خوخ',
    accent: 'var(--color-peach)',
    accentDeep: 'var(--color-peach-cap)',
    onAccent: 'var(--color-ink)',
    description: null,
    volume: null,
    heroImage: 'hero-peach',
    bottleImage: 'bottle-peach',
  },
];

export const getFlavor = (slug) => flavors.find((f) => f.slug === slug);
