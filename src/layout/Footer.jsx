import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import PopBlock from '../components/PopBlock.jsx';
import { navLinks } from './navLinks.js';
import { copy } from '../data/copy.js';
import { SOCIAL_LINKS } from '../data/site.js';

// Phone numbers stay out of the footer (PUBLIC_CONTACT is for /distributors only).
// Measured entrance: brand block and link columns rise 40 px, links ≈ 0.12 s after the brand.
export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-site flex-col gap-12 px-gutter pt-24 pb-9 lg:px-gutter-lg">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <PopBlock y={40} className="flex flex-col gap-4">
            <Logo height="h-20" />
            <p className="font-display text-h3 font-bold">{copy.footer.tagline.text}</p>
          </PopBlock>
          <PopBlock y={40} delay={0.12} className="flex flex-wrap gap-16">
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-3">
                {navLinks.map((l) => (
                  <li key={l.to}>
                    <Link className="hover:underline" to={l.to}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <nav aria-label="Social">
              <p className="mb-3 font-mono text-label uppercase opacity-70">
                {copy.footer.follow.text}
              </p>
              <ul className="flex flex-col gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <li key={s.id}>
                    <a
                      className="inline-flex items-center gap-2 hover:underline"
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${s.short} (opens in a new tab)`}
                    >
                      {s.short}
                      <svg
                        aria-hidden="true"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M3 9l6-6M4 3h5v5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </PopBlock>
        </div>
        <p className="border-t border-white/15 pt-6 text-sm opacity-70">
          © {new Date().getFullYear()} Hipz
        </p>
      </div>
    </footer>
  );
}
