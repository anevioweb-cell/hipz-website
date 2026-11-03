// ALL site copy lives here. Every leaf carries `draft: true` until the owner approves it.
// Rules: no health claims, ingredients, calories, sugar/fruit-content claims, origin, awards, numbers,
// fake reviews or customer names. Arabic accent words go in `ar` and render through <Ar>.
const draft = (fields) => ({ draft: true, ...fields });

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
    eyebrow: draft({ ar: 'عطشان؟' }),
    headline: draft({ lines: ['Thirsty?', 'Say Hipz.'] }),
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
    attrLabels: draft({ format: 'Format', cap: 'Cap', serve: 'Serve' }),
    closing: draft({ title: 'Cold one, please.', text: 'Find your Hipz near you.' }),
    pageTitle: draft({ title: 'Flavors', subtitle: 'Two flavors. One smile.' }),
    prev: draft({ text: 'Previous flavor' }),
    next: draft({ text: 'Next flavor' }),
    carouselLabel: draft({ text: 'Flavors' }),
  },
  sections: {
    flavors: draft({ title: 'A flavor for every mood.', eyebrow: 'Lemon · Peach' }),
    moments: draft({ title: 'Pop. Sip. Smile.', eyebrow: 'Moments' }),
    why: draft({ title: 'Made to be shared.', eyebrow: 'Why Hipz' }),
    community: draft({ title: 'Seen with Hipz.', eyebrow: 'Community' }),
    pack: draft({ title: 'Can’t pick one? Take both.', eyebrow: 'Pack' }),
    empty: draft({ title: 'Coming soon', text: 'This part of the page is on its way.' }),
  },
  footer: {
    tagline: draft({ text: 'Smile in a bottle.' }),
    follow: draft({ text: 'Follow along' }),
  },
};
