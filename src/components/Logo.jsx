import { Link } from 'react-router-dom';

// Real Hipz logo, derived from the supplied public/logo.jpg (white on transparent, see docs/ASSET_REPORT.md).
export default function Logo({ className = '', height = 'h-12' }) {
  return (
    <Link to="/" aria-label="Hipz — home" className={`inline-block ${className}`}>
      <img
        src="/logo-white.png"
        alt="Hipz"
        width="398"
        height="279"
        className={`${height} w-auto`}
      />
    </Link>
  );
}
