// Public site facts. Everything here is confirmed by the owner (docs/BRAND_BRIEF.md).
export const SITE = {
  name: 'Hipz',
  nameAr: 'هايبز',
};

// Owner-supplied social links (no TikTok anywhere). Shown in the footer.
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
    short: 'Kada & Miloud',
    href: 'https://www.instagram.com/kadawmiloud/',
  },
];

// Commercial-service numbers from the Instagram bio. The owner allowed them on the distributors
// page ONLY. Keep them here so they can be removed in one place. `tel` is the international form
// of the same number (Algeria +213, leading 0 dropped).
export const PUBLIC_CONTACT = {
  label: 'Commercial service',
  phones: [
    { display: '05 60404339', tel: '+213560404339' },
    { display: '07 70787889', tel: '+213770787889' },
  ],
};
