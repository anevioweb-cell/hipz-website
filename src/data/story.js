// Facts for /our-story. ONLY confirmed facts, each with its source (docs/BRAND_BRIEF.md rows 42–50).
// Wording lives in src/data/copy.js (copy.story); this file holds what is TRUE and where it comes from.
//
// Optional facts are null / [] until the owner confirms them. Every optional entry needs a `source`;
// entries that come from the launch video (source.kind === 'launch-video') also need `verified: true`
// before they are shown, and quotes need the exact original-language text plus an English translation
// (shown labelled as a translation). Proposals waiting for the owner: docs/STORY_PROPOSALS.md.
// A section whose data is null or empty is NOT rendered — no placeholders.

/** @typedef {{ kind: 'public-statement'|'owner'|'brand-photos'|'launch-video'|'document', ref: string, brief?: number }} Source */

export const story = {
  confirmed: {
    owners: {
      fact: 'Kada & Miloud are the owners of Hipz (their own Instagram bio: "Owners of @hipzdrink").',
      source: {
        kind: 'public-statement',
        ref: 'https://www.instagram.com/kadawmiloud/',
        brief: 42,
      },
    },
    flavors: {
      fact: 'Two flavors: Lemon and Peach.',
      source: { kind: 'owner', ref: 'owner statement', brief: 43 },
    },
    bottle: {
      fact: 'PET bottle, 330 ml (shown only in "The basics" on flavor pages).',
      source: { kind: 'owner', ref: 'owner statement', brief: 34 },
    },
    bottlingLine: {
      fact: 'The brand’s own posts show the duo at a bottling line with Hipz bottles (visible only; no plant name, city, capacity or process).',
      source: {
        kind: 'brand-photos',
        ref: 'https://www.instagram.com/kadawmiloud/p/De9mIQDDAyc/',
        brief: 43,
      },
    },
  },

  // ---- optional, owner-confirmed later (null / [] = section hidden) ----
  /** @type {null | { value: number, source: Source }} */
  foundedYear: null,
  /** @type {null | { value: string, source: Source }} */
  plantName: null,
  /** @type {null | { value: string, source: Source }} */
  plantCity: null,
  /** @type {null | { en: string, ar?: string, source: Source, verified?: boolean }} */
  originNote: null,
  /** @type {{ original: string, lang: string, translation: string, by: string, source: Source, verified?: boolean }[]} */
  quotes: [],
  /** @type {{ label: string, date: string, note?: string, source: Source, verified?: boolean }[]} */
  milestones: [],
};

// ---------------------------------------------------------------- helpers

const hasSource = (e) => !!(e && e.source && e.source.ref);
// Video-derived entries need the owner's explicit verification.
const allowed = (e) => hasSource(e) && (e.source.kind !== 'launch-video' || e.verified === true);
const quoteOk = (q) => allowed(q) && !!q.original?.trim() && !!q.translation?.trim() && !!q.by;
const milestoneOk = (m) => allowed(m) && !!m.label?.trim() && !!m.date?.trim();

/** Only the optional data that may be shown (sourced, verified where required, complete). */
export function visibleOptional(s = story) {
  return {
    originNote:
      s.originNote && allowed(s.originNote) && s.originNote.en?.trim() ? s.originNote : null,
    quotes: (s.quotes || []).filter(quoteOk),
    milestones: (s.milestones || []).filter(milestoneOk),
    plant:
      (s.plantName && allowed(s.plantName)) || (s.plantCity && allowed(s.plantCity))
        ? {
            name: s.plantName && allowed(s.plantName) ? s.plantName.value : null,
            city: s.plantCity && allowed(s.plantCity) ? s.plantCity.value : null,
          }
        : null,
    foundedYear: s.foundedYear && allowed(s.foundedYear) ? s.foundedYear.value : null,
  };
}

/** Solo photos per person (selected, exactly one person shown). */
export const soloPhotos = (photos, who) =>
  photos.filter((p) => p.use === 'solo' && p.people?.length === 1 && p.people[0] === who);
/** A solo block may only appear when BOTH creators have at least one solo photo (never one-sided). */
export const soloBalanced = (photos) =>
  soloPhotos(photos, 'kada').length > 0 && soloPhotos(photos, 'miloud').length > 0;

/**
 * Section keys of /our-story, in page order, that have data to show.
 * `photos` = the selected creator photos (src/data/creators.js).
 */
export function storySections(s = story, photos = []) {
  const opt = visibleOptional(s);
  const duoPhotos = photos.filter((p) => p.use === 'hero');
  const collage = photos.flatMap((p) => (p.crops || []).filter((c) => c.use === 'collage'));
  const bottling = photos.filter((p) => p.use === 'bottling');
  return [
    duoPhotos.length ? 'hero' : 'hero-text',
    s.confirmed.owners ? 'duo' : null,
    s.confirmed.owners && collage.length ? 'collage' : null,
    s.confirmed.owners && soloBalanced(photos) ? 'solo' : null,
    s.confirmed.bottlingLine && bottling.length ? 'bottling' : null,
    s.confirmed.flavors ? 'flavors' : null,
    opt.originNote || opt.foundedYear ? 'origin' : null,
    opt.milestones.length ? 'milestones' : null,
    opt.quotes.length ? 'quotes' : null,
    opt.plant ? 'plant' : null,
    'closing',
  ].filter(Boolean);
}
