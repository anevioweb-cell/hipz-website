import SectionHeader from '../SectionHeader.jsx';
import PopBlock from '../PopBlock.jsx';
import { PUBLIC_CONTACT, SOCIAL_LINKS } from '../../data/site.js';
import { telHref } from '../../lib/phone.js';
import { copy } from '../../data/copy.js';

const INSTAGRAM = SOCIAL_LINKS.find((s) => s.id === 'hipz-instagram');

// The two commercial-service numbers as large tap targets. The number is also plain visible text, so
// desktop users can read/copy it; the accessible name says what the link does.
export function PhoneLinks({ className = '', size = 'lg' }) {
  const c = copy.distributors.contact;
  const big = size === 'lg';
  return (
    <ul className={`flex flex-col gap-3 ${className}`}>
      {PUBLIC_CONTACT.phones.map((p) => (
        <li key={p.display}>
          <a
            href={telHref(p.display)}
            aria-label={`${c.callPrefix} ${p.display}`}
            className={`inline-flex min-h-11 items-center rounded-pill font-display font-extrabold underline-offset-8 hover:underline ${
              big ? 'text-[clamp(2.25rem,6vw,4.5rem)] leading-none' : 'text-h3'
            }`}
          >
            <span dir="ltr">{p.display}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export default function ContactBand() {
  const c = copy.distributors.contact;
  return (
    <section id="commercial-service" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-site gap-10 px-gutter py-[72px] lg:grid-cols-2 lg:items-end lg:px-gutter-lg lg:py-[110px]">
        <SectionHeader eyebrow={c.eyebrow} lines={c.lines}>
          {c.text}
        </SectionHeader>
        <PopBlock y={50} className="flex flex-col gap-6 lg:items-end">
          <PhoneLinks className="lg:items-end" />
          <a
            href={INSTAGRAM.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${c.instagram} (opens in a new tab)`}
            className="inline-flex min-h-11 items-center gap-2 font-medium underline underline-offset-4"
          >
            {c.instagram}
            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 9l6-6M4 3h5v5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </a>
        </PopBlock>
      </div>
    </section>
  );
}
