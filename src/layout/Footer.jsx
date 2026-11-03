import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { navLinks } from './navLinks.js';

// Only confirmed public facts: the Instagram handle. No phone numbers (not approved for publishing).
export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto flex max-w-site flex-col gap-12 px-gutter pt-24 pb-9 lg:px-gutter-lg">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <Logo className="text-5xl" />
          <nav aria-label="Footer" className="flex gap-16">
            <ul className="flex flex-col gap-3">
              {navLinks.map((l) => (
                <li key={l.to}>
                  <Link className="hover:underline" to={l.to}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  className="hover:underline"
                  href="https://www.instagram.com/hipzdrink/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="border-t border-white/15 pt-6 text-sm opacity-70">
          © {new Date().getFullYear()} Hipz
        </p>
      </div>
    </footer>
  );
}
