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
    headline: draft({ lines: ['Smile in', 'a bottle.'] }),
    subtitle: draft({ text: 'Lemon and peach. Ice cold. Pop one, share it.' }),
    primaryCta: draft({ text: 'Meet the flavors' }),
    secondaryCta: draft({ text: 'Become a distributor' }),
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
    follow: draft({ text: 'Instagram' }),
  },
};
