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
  // /distributors — neutral invitation to get in touch. No areas, distributors, stores, prices,
  // margins, minimum orders, delivery or reply-time promises (owner, Phase 5).
  distributors: {
    pageTitle: draft({ text: 'Distributors — Hipz' }),
    hero: draft({
      eyebrow: 'Distributors',
      ar: 'هايبز عندك',
      lines: ['Bring Hipz', 'to your shelves.'],
      text: 'Shops, wholesalers, cafés and events: tell us about your business and the Hipz team will get in touch.',
      primary: 'Send a request',
      secondary: 'Call us',
    }),
    contact: draft({
      eyebrow: 'Service commercial',
      lines: ['Talk to', 'the Hipz team.'],
      text: 'Call the commercial service, or send Hipz a message on Instagram.',
      callPrefix: 'Call the Hipz commercial service on',
      instagram: 'Message Hipz on Instagram',
    }),
    ways: draft({
      eyebrow: 'Ways to work with Hipz',
      lines: ['Who can', 'reach out?'],
      cta: 'Get in touch',
      items: [
        {
          id: 'shop',
          title: 'Shops & supermarkets',
          text: 'Grocers, mini-markets and supermarkets that want Hipz in their fridges.',
        },
        {
          id: 'wholesale',
          title: 'Wholesalers & distributors',
          text: 'Wholesalers and distributors who supply shops in their area.',
        },
        {
          id: 'horeca',
          title: 'Cafés & restaurants',
          text: 'Cafés, restaurants, snack bars and food trucks.',
        },
        {
          id: 'events',
          title: 'Events & partnerships',
          text: 'Events, clubs, venues and brand partnerships.',
        },
      ],
    }),
    form: draft({
      eyebrow: 'Wholesale request',
      lines: ['Send a', 'request.'],
      text: 'Fields marked * are required.',
      business: 'Business name',
      contact: 'Contact person',
      phone: 'Phone',
      phoneHint: 'Algerian number, e.g. 05 XX XX XX XX or +213 5XX XX XX XX',
      email: 'Email (optional)',
      wilaya: 'Wilaya',
      wilayaPlaceholder: 'Choose your wilaya',
      type: 'Business type',
      typePlaceholder: 'Choose a type',
      other: 'Other',
      message: 'Message (optional)',
      messageHint: 'Up to 1000 characters.',
      honeypot: 'Leave this field empty',
      submit: 'Send request',
      sending: 'Sending…',
      errors: {
        required: 'This field is required.',
        phone: 'Enter an Algerian phone number (mobile 05/06/07 or a landline).',
        email: 'Enter a valid email address, or leave it empty.',
        tooLong: 'Please keep it under 1000 characters.',
        summary: 'Please check the highlighted fields.',
      },
      success: {
        title: 'Thanks!',
        text: 'The Hipz team will get back to you.',
        again: 'Send another request',
      },
      unavailable: {
        title: 'Not available yet',
        text: 'Requests can’t be sent from this page yet. Please call the commercial service instead.',
      },
    }),
    finder: draft({
      eyebrow: 'Store finder',
      lines: ['Find Hipz', 'near you.'],
      select: 'Your wilaya',
      placeholder: 'Choose a wilaya',
      button: 'Show stockists',
      empty: {
        title: 'No stockists listed here yet',
        text: 'No Hipz stockists are listed on this page for this wilaya. Want to stock Hipz? Call the commercial service or send a request.',
        call: 'Call us',
        form: 'Send a request',
      },
      one: 'stockist in',
      many: 'stockists in',
      map: 'Map',
    }),
    closing: draft({ lines: ['Lemon or peach?', 'Both.'], cta: 'See the flavors' }),
  },
  story: {
    // /our-story. Describes only the visible, the mood and the brand idea — no founding story, dates,
    // numbers or production claims. Optional blocks (origin, milestones, quotes, plant) only render when
    // src/data/story.js has confirmed data; their headings are here.
    pageTitle: draft({ title: 'Our story' }),
    hero: draft({
      eyebrow: 'Our story',
      ar: 'قصتنا',
      lines: ['Two friends.', 'One smile.'],
      text: 'Kada & Miloud, and the soda that’s theirs.',
      cta: 'Meet the duo',
    }),
    duo: draft({
      eyebrow: 'The duo',
      ar: 'قادة و ميلود',
      lines: ['Kada & Miloud.', 'The owners of Hipz.'],
      text: 'Two friends, two flavors, one smile. Follow them, and Hipz, where they post.',
      follow: 'Follow',
    }),
    bottling: draft({
      eyebrow: 'Behind the bottles',
      lines: ['At the', 'bottling line.'],
      text: 'The duo with Hipz bottles, from the brand’s own posts.',
    }),
    flavors: draft({
      eyebrow: 'Two flavors, one smile',
      ar: 'ليمون · خوخ',
      lines: ['Lemon.', 'Peach.', 'One smile.'],
      cta: 'See the flavors',
    }),
    origin: draft({ eyebrow: 'How it started', foundedLabel: 'Since' }),
    milestones: draft({ eyebrow: 'Milestones', lines: ['Along', 'the way.'] }),
    quotes: draft({ eyebrow: 'In their words', translation: 'Translation' }),
    plant: draft({ eyebrow: 'Where it’s made' }),
    closing: draft({
      lines: ['Want Hipz', 'on your shelves?'],
      cta: 'Become a distributor',
      follow: 'Follow the duo and Hipz',
    }),
  },
  footer: {
    tagline: draft({ text: 'Smile in a bottle.' }),
    follow: draft({ text: 'Follow along' }),
  },
};
