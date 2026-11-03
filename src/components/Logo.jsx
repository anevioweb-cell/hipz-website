import { Link } from 'react-router-dom';

// Real Hipz logo, derived from the supplied public/logo.jpg (see docs/ASSET_REPORT.md).
// tone "light" = white logo (for dark backgrounds), "dark" = ink logo (for bright backgrounds).
export default function Logo({ className = '', height = 'h-12', tone = 'light' }) {
  return (
    <Link to="/" aria-label="Hipz — home" className={`inline-block ${className}`}>
      <img
        src={tone === 'dark' ? '/logo-ink.png' : '/logo-white.png'}
        alt="Hipz"
        width="398"
        height="279"
        className={`${height} w-auto`}
      />
    </Link>
  );
}
