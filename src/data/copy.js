// ALL site copy lives here. Every leaf carries a `draft` flag: `draft(...)` = waiting for the owner,
// `approved(...)` = reviewed. Phase 8: the owner reviewed all copy (docs/COPY_REVIEW.md) → all approved.
// New copy starts as `draft(...)` again.
// Rules: no health claims, ingredients, calories, sugar/fruit-content claims, origin, awards, numbers,
// fake reviews or customer names. Arabic accent words go in `ar` and render through <Ar>.
// eslint-disable-next-line no-unused-vars -- kept for new, not yet reviewed copy
const draft = (fields) => ({ draft: true, ...fields });
// Owner-approved copy: draft: false.
const approved = (fields) => ({ draft: false, ...fields });

export const copy = {
  // Per-page <title> + meta description + link preview text (Open Graph / Twitter). Neutral, no claims.
  meta: {
    '/': approved({ title: 'Hipz', description: 'Hipz: lemon and peach soda from Kada & Miloud.' }),
    '/flavors': approved({
      title: 'Flavors — Hipz',
      description: 'Two flavors, one smile: Hipz Lemon and Hipz Peach.',
    }),
    '/flavors/lemon': approved({
      title: 'Lemon — Hipz',
      description: 'Hipz Lemon. Serve it ice cold.',
    }),
    '/flavors/peach': approved({
      title: 'Peach — Hipz',
      description: 'Hipz Peach. Serve it ice cold.',
    }),
    '/distributors': approved({
      title: 'Distributors — Hipz',
      description: 'Shops, wholesalers, cafés and events: get in touch with the Hipz team.',
    }),
    '/our-story': approved({
      title: 'Our story — Hipz',
      description: 'Kada & Miloud and Hipz: two friends, two flavors, one smile.',
    }),
    imageAlt: approved({
      text: 'A bottle of Hipz Lemon with lemon slices and splashes, and the Hipz logo.',
    }),
  },
  // Error states (404, crash fallback, failed page load). Short and calm, no blame.
  errors: {
    notFound: approved({
      title: 'Page not found',
      text: 'This page does not exist, but the drinks do.',
      cta: 'Back home',
    }),
    crash: approved({
      title: 'Something went wrong',
      text: 'Please reload the page.',
      reload: 'Reload',
      home: 'Back home',
    }),
    chunk: approved({
      title: 'This page did not load',
      text: 'Check your connection and reload.',
    }),
  },
  nav: {
    flavors: approved({ text: 'Flavors' }),
    distributors: approved({ text: 'Distributors' }),
    story: approved({ text: 'Our story' }),
    buy: approved({ text: 'Where to buy' }),
    menuOpen: approved({ text: 'Open menu' }),
    menuClose: approved({ text: 'Close menu' }),
  },
  hero: {
    eyebrow: approved({ ar: 'عطشان؟' }),
    headline: approved({ lines: ['Thirsty?', 'Say Hipz.'] }),
    subtitle: approved({ text: 'Lemon or peach. Ice cold. Fizz on.' }),
    primaryCta: approved({ text: 'Meet the flavors' }),
    secondaryCta: approved({ text: 'Find it' }),
    pause: approved({ text: 'Pause' }),
    play: approved({ text: 'Play' }),
    switchLabel: approved({ text: 'Choose a flavor' }),
  },
  ticker: {
    items: approved({
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
    lemon: approved({
      tagline: 'Bright. Loud. Cold.',
      blurb: 'A sunny-day mood in a bottle. Pop it open, pass it around.',
    }),
    peach: approved({
      tagline: 'Golden hour. Ice cold.',
      blurb: 'A golden-hour mood in a bottle. Pop it open, say cheers.',
    }),
    both: approved({
      name: 'Both flavors',
      tagline: 'Can’t pick? Don’t.',
      blurb: 'Lemon and peach, side by side.',
    }),
    findIt: approved({ text: 'Find it' }),
    meet: approved({ text: 'Meet' }),
    more: approved({ title: 'More to sip.' }),
    attributesTitle: approved({ title: 'The basics' }),
    attrLabels: approved({ format: 'Format', cap: 'Cap', serve: 'Serve', size: 'Size' }),
    closing: approved({ title: 'Cold one, please.', text: 'Find your Hipz near you.' }),
    pageTitle: approved({ title: 'Flavors', subtitle: 'Two flavors. One smile.' }),
    prev: approved({ text: 'Previous flavor' }),
    next: approved({ text: 'Next flavor' }),
    carouselLabel: approved({ text: 'Flavors' }),
  },
  sections: {
    flavors: approved({ title: 'A flavor for every mood.', eyebrow: 'Lemon · Peach' }),
  },
  moments: {
    header: approved({
      eyebrow: 'Moments',
      lines: ['A Hipz for', 'every moment.'],
      text: 'Cold, fizzy and made to pass around, wherever the day takes you.',
    }),
    // one entry per card (ids match src/data/moments.js); `ar` is the Arabic accent word
    match: approved({
      title: 'Match night',
      ar: 'ماتش',
      text: 'Kick-off in five. Grab a cold one before the first whistle.',
    }),
    road: approved({
      title: 'Road trip',
      ar: 'طريق',
      text: 'Windows down, playlist up, a bottle in the door.',
    }),
    friends: approved({
      title: 'Friends over',
      ar: 'لمّة',
      text: 'Someone brings the snacks. Someone brings the Hipz.',
    }),
    study: approved({
      title: 'Study break',
      ar: 'راحة',
      text: 'Ten minutes off the books. Pop, sip, back to it.',
    }),
  },
  why: {
    header: approved({ eyebrow: 'Why Hipz', lines: ['Simple.', 'Cold. Ours.'], cta: 'Our story' }),
    // only owner-confirmed statements (BRAND_BRIEF rows 12, 22, 25, 33): two flavors, the creators' own
    // soda brand, a serving mood. No ingredient / health / origin / quality / number claims.
    pillars: approved({
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
          title: 'Serve it ice cold.',
          text: 'Straight from the fridge, or over ice.',
        },
      ],
    }),
  },
  both: {
    feature: approved({
      eyebrow: 'Both flavors',
      lines: ['Can’t pick?', 'Don’t.'],
      text: 'Lemon and peach, side by side.',
      cta: 'Find it',
    }),
  },
  community: {
    header: approved({
      eyebrow: 'Community',
      lines: ['Share your', 'Hipz moment.'],
      text: 'Snap it, tag @hipzdrink and use #hipz.',
      cta: 'Tag @hipzdrink',
      label: 'Hipz on Instagram',
    }),
    // words used on the designed fallback tiles (never handles, names or quotes)
    words: approved({
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
    pageTitle: approved({ text: 'Distributors — Hipz' }),
    hero: approved({
      eyebrow: 'Distributors',
      ar: 'هايبز عندك',
      lines: ['Bring Hipz', 'to your shelves.'],
      text: 'Shops, wholesalers, cafés and events: tell us about your business and the Hipz team will get in touch.',
      primary: 'Send a request',
      secondary: 'Call us',
    }),
    contact: approved({
      eyebrow: 'Service commercial',
      lines: ['Talk to', 'the Hipz team.'],
      text: 'Call the commercial service, or send Hipz a message on Instagram.',
      callPrefix: 'Call the Hipz commercial service on',
      instagram: 'Message Hipz on Instagram',
    }),
    ways: approved({
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
    form: approved({
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
    finder: approved({
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
    closing: approved({ lines: ['Lemon or peach?', 'Both.'], cta: 'See the flavors' }),
  },
  story: {
    // /our-story. Describes only the visible, the mood and the brand idea — no founding story, dates,
    // numbers or production claims. Optional blocks (origin, milestones, quotes, plant) only render when
    // src/data/story.js has confirmed data; their headings are here.
    pageTitle: approved({ title: 'Our story' }),
    hero: approved({
      eyebrow: 'Our story',
      ar: 'قصتنا',
      lines: ['Two friends.', 'One smile.'],
      text: 'Kada & Miloud, and the soda that’s theirs.',
      cta: 'Meet the duo',
    }),
    duo: approved({
      eyebrow: 'The duo',
      ar: 'قادة و ميلود',
      lines: ['Kada & Miloud.', 'The owners of Hipz.'],
      text: 'Two friends, two flavors, one smile. Follow them, and Hipz, where they post.',
      follow: 'Follow',
    }),
    bottling: approved({
      eyebrow: 'Behind the bottles',
      lines: ['At the', 'bottling line.'],
      text: 'The duo with Hipz bottles, from the brand’s own posts.',
    }),
    flavors: approved({
      eyebrow: 'Two flavors, one smile',
      ar: 'ليمون · خوخ',
      lines: ['Lemon.', 'Peach.', 'One smile.'],
      cta: 'See the flavors',
    }),
    origin: approved({ eyebrow: 'How it started', foundedLabel: 'Since' }),
    milestones: approved({ eyebrow: 'Milestones', lines: ['Along', 'the way.'] }),
    quotes: approved({ eyebrow: 'In their words', translation: 'Translation' }),
    plant: approved({ eyebrow: 'Where it’s made' }),
    closing: approved({
      lines: ['Want Hipz', 'on your shelves?'],
      cta: 'Become a distributor',
      follow: 'Follow the duo and Hipz',
    }),
  },
  footer: {
    tagline: approved({ text: 'Smile in a bottle.' }),
    follow: approved({ text: 'Follow along' }),
  },
};
