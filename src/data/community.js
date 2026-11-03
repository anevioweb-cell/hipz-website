// Community section data.
// `communityPosts`: REAL posts only, added later with permission: { image, handle, link, alt }.
// While it is empty the section shows designed tiles built from our own assets (no user content,
// no handles, no names, no quotes).
export const communityPosts = [];

// Designed fallback tiles: bottles, flavor blocks, the logo and brand words (copy.community.words).
// The band itself is lemon, so lemon items sit on paper / ink tiles to stay visible.
export const fallbackTiles = [
  { kind: 'bottle', flavor: 'lemon', tone: 'paper' },
  { kind: 'word', word: 0, tone: 'ink' },
  { kind: 'color', flavor: 'peach', word: 1 },
  { kind: 'logo' },
  { kind: 'bottle', flavor: 'peach' },
  { kind: 'word', word: 2, tone: 'lime' },
  { kind: 'word', word: 4, tone: 'ink' },
  { kind: 'word', word: 3, tone: 'paper' },
  { kind: 'color', flavor: 'peach', word: 5 },
  { kind: 'word', word: 6, tone: 'ink' },
];
