// ALL site copy lives here. Every leaf carries `draft: true` until the owner approves it.
// Rules: no health claims, ingredients, calories, sugar/fruit-content claims, origin, awards, numbers,
// fake reviews or customer names. Arabic accent words go in `ar` and render through <Ar>.
const draft = (fields) => ({ draft: true, ...fields });
// Owner-approved copy (Phase 4): draft: false.
const approved = (fields) => ({ draft: false, ...fields });

export const copy = {
  nav: {
    flavors: draft({ text: 'Flavors' }),
    distributors: draft({ text: 'Distributors' }),
    story: draft({ text: 'Our story' }),
    buy: draft({ text: 'Where to buy' }),
    menuOpen: draft({ text: 'Open menu' }),
    menuClose: draft({ text: 'Close menu' }),
  },
  hero: {
    eyebrow: approved({ ar: 'عطشان؟' }),
    headline: approved({ lines: ['Thirsty?', 'Say Hipz.'] }),
    subtitle: draft({ text: 'Lemon or peach. Ice cold. Fizz on.' }),
    primaryCta: draft({ text: 'Meet the flavors' }),
    secondaryCta: draft({ text: 'Find it' }),
    pause: draft({ text: 'Pause' }),
    play: draft({ text: 'Play' }),
    switchLabel: draft({ text: 'Choose a flavor' }),
  },
  ticker: {
    items: draft({
      items: [
        { text: 'Hipz' },
        { text: 'Lemon' },
        { ar: 'هايبز' },
        { text: 'Ice cold' },
        { text: 'Peach' },
        { ar: 'خوخ' },
        { text: 'Pop it' },
        { ar: 'ليمون' },
        { text: 'Share it' },
      ],
    }),
  },
  flavors: {
    lemon: draft({
      tagline: 'Bright. Loud. Cold.',
      blurb: 'A sunny-day mood in a bottle. Pop it open, pass it around.',
    }),
    peach: draft({
      tagline: 'Golden hour. Ice cold.',
      blurb: 'A golden-hour mood in a bottle. Pop it open, say cheers.',
    }),
    both: draft({
      name: 'Both flavors',
      tagline: 'Can’t pick? Don’t.',
      blurb: 'Lemon and peach, side by side.',
    }),
    findIt: draft({ text: 'Find it' }),
    meet: draft({ text: 'Meet' }),
    more: draft({ title: 'More to sip.' }),
    attributesTitle: draft({ title: 'The basics' }),
    attrLabels: draft({ format: 'Format', cap: 'Cap', serve: 'Serve', size: 'Size' }),
    closing: draft({ title: 'Cold one, please.', text: 'Find your Hipz near you.' }),
    pageTitle: draft({ title: 'Flavors', subtitle: 'Two flavors. One smile.' }),
    prev: draft({ text: 'Previous flavor' }),
    next: draft({ text: 'Next flavor' }),
    carouselLabel: draft({ text: 'Flavors' }),
  },
  sections: {
    flavors: draft({ title: 'A flavor for every mood.', eyebrow: 'Lemon · Peach' }),
  },
  moments: {
    header: draft({
      eyebrow: 'Moments',
      lines: ['A Hipz for', 'every moment.'],
      text: 'Cold, fizzy and made to pass around, wherever the day takes you.',
    }),
    // one entry per card (ids match src/data/moments.js); `ar` is the Arabic accent word
    match: draft({
      title: 'Match night',
      ar: 'ماتش',
      text: 'Kick-off in five. Grab a cold one before the first whistle.',
    }),
    road: draft({
      title: 'Road trip',
      ar: 'طريق',
      text: 'Windows down, playlist up, a bottle in the door.',
    }),
    friends: draft({
      title: 'Friends over',
      ar: 'لمّة',
      text: 'Someone brings the snacks. Someone brings the Hipz.',
    }),
    study: draft({
      title: 'Study break',
      ar: 'راحة',
      text: 'Ten minutes off the books. Pop, sip, back to it.',
    }),
  },
  why: {
    header: draft({ eyebrow: 'Why Hipz', lines: ['Simple.', 'Cold. Ours.'], cta: 'Our story' }),
    // only owner-confirmed statements (BRAND_BRIEF rows 12, 22, 25, 33): two flavors, the creators' own
    // soda brand, a serving mood. No ingredient / health / origin / quality / number claims.
    pillars: draft({
      items: [
        {
          id: 'two',
          title: 'Two flavors. That’s it.',
          text: 'Lemon or peach. Pick a side, or have both.',
          ar: 'ليمون أو خوخ',
        },
        {
          id: 'creators',
          title: 'Kada & Miloud’s own soda.',
          text: 'Hipz is the soda brand of Kada & Miloud.',
        },
        {
          id: 'cold',
          title: 'Best served ice cold.',
          text: 'Straight from the fridge, or over ice.',
        },
      ],
    }),
  },
  both: {
    feature: draft({
      eyebrow: 'Both flavors',
      lines: ['Can’t pick?', 'Don’t.'],
      text: 'Lemon and peach, side by side.',
      cta: 'Find it',
    }),
  },
  community: {
    header: draft({
      eyebrow: 'Community',
      lines: ['Share your', 'Hipz moment.'],
      text: 'Snap it, tag @hipzdrink and use #hipz.',
      cta: 'Tag @hipzdrink',
      label: 'Hipz on Instagram',
    }),
    // words used on the designed fallback tiles (never handles, names or quotes)
    words: draft({
      items: [
        { text: '#hipz' },
        { ar: 'هايبز' },
        { text: 'Lemon' },
        { text: 'Peach' },
        { ar: 'ليمون' },
        { ar: 'خوخ' },
        { text: 'Ice cold' },
      ],
    }),
  },
  footer: {
    tagline: draft({ text: 'Smile in a bottle.' }),
    follow: draft({ text: 'Follow along' }),
  },
};
