// Creator photos for /our-story (Phase 6) — NOT used on any page yet, and no text about who is shown is
// rendered anywhere. Sources and identification notes: docs/CREATOR_PHOTOS.md.
// Identification rule (owner): from context only (account, caption, tags) plus the owner's description —
// Kada is the SHORTER of the two, Miloud the TALLER. No face recognition or face matching was used.
// `image` = generated set name (npm run images → public/images/creators/, gitignored);
// `focal` = point to keep in view when cropping (fractions of the image, set by hand).
// `people` lists who is shown, left to right; null = not determinable (e.g. both seated).
// Written permission from Kada and Miloud is required before any public use (ROADMAP pre-launch list).
export const creatorPhotos = [
  {
    id: 'miloud-01',
    image: 'creators/miloud-01',
    people: ['miloud'],
    confidence: 'high (his own account, solo photo)',
    shot: 'close-up portrait, indoor',
    focal: { x: 0.5, y: 0.38 },
  },
  {
    id: 'miloud-02',
    image: 'creators/miloud-02',
    people: ['miloud'],
    confidence: 'high (his own account, solo photo)',
    shot: 'half body, outdoor golden hour',
    focal: { x: 0.47, y: 0.3 },
  },
  {
    id: 'miloud-03',
    image: 'creators/miloud-03',
    people: ['miloud'],
    confidence: 'high (his own account, solo photo)',
    shot: 'studio portrait, seated, suit',
    focal: { x: 0.5, y: 0.25 },
  },
  {
    id: 'miloud-04',
    image: 'creators/miloud-04',
    people: ['miloud'],
    confidence: 'high (his own account, solo photo)',
    shot: 'studio close-up, suit',
    focal: { x: 0.52, y: 0.3 },
  },
  {
    id: 'both-01',
    image: 'creators/both-01',
    people: ['kada', 'miloud'],
    confidence:
      'medium (left/right from the owner height rule: shorter left = Kada, taller right = Miloud)',
    shot: 'both in the bottling plant with Hipz Lemon bottles',
    focal: { x: 0.5, y: 0.32 },
  },
  {
    id: 'both-02',
    image: 'creators/both-02',
    people: ['kada', 'miloud'],
    confidence: 'medium (same scene and rule as both-01)',
    shot: 'both in the bottling plant with Hipz Lemon bottles (same as the supplied source-photo.jpg)',
    focal: { x: 0.5, y: 0.32 },
  },
  {
    id: 'both-03',
    image: 'creators/both-03',
    people: null,
    confidence: 'both confirmed by the channel; who is left/right not determinable (seated)',
    shot: 'official YouTube channel avatar, both seated',
    focal: { x: 0.5, y: 0.45 },
  },
];
