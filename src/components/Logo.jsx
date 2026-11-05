import { Link } from 'react-router-dom';

// Real Hipz logo, derived from the supplied brand/logo.jpg (see docs/ASSET_REPORT.md).
// tone "light" = white logo (for dark backgrounds), "dark" = ink logo (for bright backgrounds).
// The only source is a 150 px file (no vector): never show the wordmark taller than 52 px (≈ 74 CSS px
// wide), so it stays sharp on 2× screens. Enforced by Logo.test.jsx.
export default function Logo({ className = '', height = 'h-12', tone = 'light' }) {
  return (
    <Link to="/" aria-label="Hipz — home" className={`inline-block ${className}`}>
      <img
        src={tone === 'dark' ? '/logo-ink.png' : '/logo-white.png'}
        alt="Hipz"
        width="398"
        height="279"
        className={`${height} w-auto`}
        onError={(e) => {
          e.currentTarget.style.visibility = 'hidden';
        }}
      />
    </Link>
  );
}
