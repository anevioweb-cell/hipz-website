// Public site facts. Everything here is confirmed by the owner (docs/BRAND_BRIEF.md).
export const SITE = {
  name: 'Hipz',
  nameAr: 'هايبز',
};

// Owner-supplied social links. Shown in the footer.
export const SOCIAL_LINKS = [
  {
    id: 'hipz-instagram',
    label: 'Hipz on Instagram',
    short: 'Hipz · Instagram',
    href: 'https://www.instagram.com/hipzdrink/',
  },
  {
    id: 'kada-miloud-youtube',
    label: 'Kada & Miloud on YouTube',
    short: 'Kada & Miloud · YouTube',
    href: 'https://www.youtube.com/@kadaWmiloud',
  },
  {
    id: 'kada-miloud-instagram',
    label: 'Kada & Miloud on Instagram',
    short: 'Kada & Miloud · Instagram',
    href: 'https://www.instagram.com/kadawmiloud/',
  },
];

// Commercial-service numbers from the Instagram bio. The owner allowed them on /distributors ONLY.
// Keep them here so they can be removed in one place. `display` is shown exactly as in the bio; the
// tel: link is built by normalising it (src/lib/phone.js → +213560404339 / +213770787889).
export const PUBLIC_CONTACT = {
  label: 'Service commercial', // as written in the Instagram bio
  phones: [{ display: '05 60404339' }, { display: '07 70787889' }],
};
