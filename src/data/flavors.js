// Flavors: exactly two, confirmed by the owner (docs/brand/BRAND_BRIEF.md rows 12–14, 22).
// Only verified facts live here. `volume`: 330 ml, one single size (owner statement, BRAND_BRIEF row 34).
// It is shown only as an attribute in "The basics" on flavor pages — never on images, never as "medium".
// Colors reference tokens in src/index.css; hex values live ONLY there.
// Mood copy for each flavor is in src/data/copy.js (copy.flavors[slug]).
export const flavors = [
  {
    slug: 'lemon',
    name: 'Lemon',
    nameAr: 'ليمون',
    accent: 'var(--color-lemon)',
    accentDeep: 'var(--color-lemon-cap)',
    label: 'var(--color-brand-leaf)',
    onAccent: 'var(--color-ink)',
    volume: { amount: 330, unit: 'ml' },
    images: {
      bottle: 'bottle-lemon',
      heroWide: 'hero-lemon-wide',
      heroPortrait: 'hero-lemon-portrait',
    },
    alt: 'Lemon Hipz bottle with lemon slices, ice and a splash',
    // verified attributes only: format, cap color, serving suggestion
    attributes: { format: 'PET bottle with screw cap', cap: 'Yellow cap', serve: 'Serve ice cold' },
  },
  {
    slug: 'peach',
    name: 'Peach',
    nameAr: 'خوخ',
    accent: 'var(--color-peach)',
    accentDeep: 'var(--color-peach-cap)',
    label: null,
    onAccent: 'var(--color-ink)',
    volume: { amount: 330, unit: 'ml' },
    images: {
      bottle: 'bottle-peach',
      heroWide: 'hero-peach-wide',
      heroPortrait: 'hero-peach-portrait',
    },
    alt: 'Peach Hipz bottle with peach slices, ice and a splash',
    attributes: { format: 'PET bottle with screw cap', cap: 'Orange cap', serve: 'Serve ice cold' },
  },
];

export const getFlavor = (slug) => flavors.find((f) => f.slug === slug);
export const otherFlavor = (slug) => flavors.find((f) => f.slug !== slug);
