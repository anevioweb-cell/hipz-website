import { Link } from 'react-router-dom';

// PLACEHOLDER wordmark: the real logo is custom lettering and is NOT imitated with a font.
// Swap this for the supplied vector logo file once it is in docs/inputs/.
export default function Logo({ className = '' }) {
  return (
    <Link
      to="/"
      aria-label="Hipz — home"
      className={`font-display text-3xl font-extrabold ${className}`}
    >
      Hipz
    </Link>
  );
}
