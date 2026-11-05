// Creator photos for /our-story (Phase 6). Sources and identification notes: docs/CREATOR_PHOTOS.md.
// Identification rule (owner): from context only (account, caption, tags) plus the owner's description —
// Kada is the SHORTER of the two, Miloud the TALLER. No face recognition or face matching was used.
// `image` = generated set name (npm run images → public/images/creators/, gitignored);
// `focal` = point to keep in view when cropping (fractions of the image, set by hand).
// `selected` = actually shown on a page. ONLY selected photos are copied into the build (dist/); the rest
// stay local (vite.config.js prunes them, scripts/check-dist.mjs fails the check if one slips through).
// `use` = where /our-story shows it: 'hero' (duo, big), 'solo' (duo-band collage, labelled with the one
// person on his own account), 'bottling' (the bottling-line gallery). Solo photos of Kada are picked up
// automatically once an entry with people: ['kada'], use: 'solo', selected: true exists.
// `alt` describes only what is visible; `caption` names people ONLY where identity is verified (own
// account, or the owner's height rule in the factory photos: Kada the shorter, Miloud the taller); the
// seated avatar is captioned "Kada & Miloud" without left/right.
// Phase 7 (owner): only photos of Kada AND Miloud together are used; solo photos stay unselected and the
// owner will not source more. A solo block can only ever render when BOTH have a selected solo photo.
// `crops` = extra art-directed crops of the same photo for other sections (never the same crop twice):
// { use, order, zoom (≥ 1), focal (zoom origin, fractions), alt (visible only), caption (names only if verified) }.
// `people` lists who is shown, left to right; null = not determinable (e.g. both seated).
// Written permission from Kada and Miloud is required before any public use (ROADMAP pre-launch list).
export const creatorPhotos = [
  {
    id: 'miloud-01',
    selected: false,
    use: 'solo',
    alt: 'Close-up portrait of a man with dark hair and a beard in a black hoodie, in a room with a lamp and plants.',
    caption: 'Miloud',
    image: 'creators/miloud-01',
    people: ['miloud'],
    confidence: 'high (his own account, solo photo)',
    shot: 'close-up portrait, indoor',
    focal: { x: 0.5, y: 0.38 },
  },
  {
    id: 'miloud-02',
    selected: false,
    use: 'solo',
    alt: 'A man in a knitted beanie and a brown overshirt outdoors in warm evening light.',
    caption: 'Miloud',
    image: 'creators/miloud-02',
    people: ['miloud'],
    confidence: 'high (his own account, solo photo)',
    shot: 'half body, outdoor golden hour',
    focal: { x: 0.47, y: 0.3 },
  },
  {
    id: 'miloud-03',
    selected: false,
    use: 'solo',
    alt: 'A man in a dark suit seated in a studio.',
    caption: 'Miloud',
    image: 'creators/miloud-03',
    people: ['miloud'],
    confidence: 'high (his own account, solo photo)',
    shot: 'studio portrait, seated, suit',
    focal: { x: 0.5, y: 0.25 },
  },
  {
    id: 'miloud-04',
    selected: false,
    use: 'solo',
    alt: 'Studio portrait of a man in a navy suit and red tie against a lilac background.',
    caption: 'Miloud',
    image: 'creators/miloud-04',
    people: ['miloud'],
    confidence: 'high (his own account, solo photo)',
    shot: 'studio close-up, suit',
    focal: { x: 0.52, y: 0.3 },
  },
  {
    id: 'both-01',
    selected: true,
    use: 'bottling',
    alt: 'Two men in white protective coats stand beside a pallet stacked with Hipz Lemon bottles in a bright bottling hall.',
    caption: 'Kada (left) and Miloud (right) at the bottling line, next to a pallet of Hipz Lemon.',
    image: 'creators/both-01',
    people: ['kada', 'miloud'],
    confidence:
      'medium (left/right from the owner height rule: shorter left = Kada, taller right = Miloud)',
    shot: 'both in the bottling plant with Hipz Lemon bottles',
    crops: [
      {
        use: 'collage',
        order: 2,
        zoom: 2.3,
        focal: { x: 0.5, y: 0.64 },
        alt: 'Close-up of a pallet stacked high with yellow Hipz Lemon bottles.',
        caption: 'Hipz Lemon, stacked at the bottling line',
      },
    ],
    focal: { x: 0.5, y: 0.32 },
  },
  {
    id: 'both-02',
    selected: true,
    use: 'bottling',
    alt: 'In a bright bottling hall, one man holds a Hipz Lemon bottle towards the camera while the other stands on the right by a pallet of bottles.',
    caption: 'Kada holds up a Hipz Lemon; Miloud stands on the right.',
    image: 'creators/both-02',
    people: ['kada', 'miloud'],
    confidence: 'medium (same scene and rule as both-01)',
    shot: 'both in the bottling plant with Hipz Lemon bottles (same as the supplied source-photo.jpg)',
    crops: [
      {
        use: 'collage',
        order: 1,
        zoom: 1.3,

        focal: { x: 0.5, y: 0.34 },
        alt: 'Close crop of two smiling men in white protective coats in a bright bottling hall, one holding a Hipz Lemon bottle forward.',
        caption: 'Kada (left) & Miloud (right)',
      },
    ],
    focal: { x: 0.5, y: 0.32 },
  },
  {
    id: 'both-03',
    selected: true,
    use: 'hero',
    alt: 'Two smiling men in dark sweatshirts sitting side by side in front of a warm, patterned backdrop.',
    caption: 'Kada & Miloud',
    image: 'creators/both-03',
    people: null,
    confidence: 'both confirmed by the channel; who is left/right not determinable (seated)',
    shot: 'official YouTube channel avatar, both seated',
    focal: { x: 0.56, y: 0.42 },
  },
];

// Image set names of the photos that a page may use (and that the build keeps).
export const usedCreatorImages = () => creatorPhotos.filter((c) => c.selected).map((c) => c.image);
