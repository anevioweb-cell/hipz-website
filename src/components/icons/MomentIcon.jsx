// Simple line icons drawn for the Moments cards (our own SVG, 48×48, currentColor).
const paths = {
  ball: (
    <>
      <circle cx="24" cy="24" r="17" />
      <path d="M24 16l6.5 4.7-2.5 7.6h-8l-2.5-7.6L24 16zM24 7v9M30.5 20.7l8.6-2.8M28 28.3l5.3 7.3M20 28.3l-5.3 7.3M17.5 20.7l-8.6-2.8" />
    </>
  ),
  road: (
    <>
      <path d="M17 6L8 42M31 6l9 36" />
      <path d="M24 8v5M24 19v5M24 30v5M24 40v2" />
    </>
  ),
  friends: (
    <>
      <circle cx="17" cy="17" r="6" />
      <circle cx="32" cy="19" r="5" />
      <path d="M6 40c0-7 5-12 11-12s11 5 11 12M27 40c0-5.5 2.5-9.5 6-10.5 4.5 1 8 5 8 10.5" />
    </>
  ),
  book: (
    <>
      <path d="M24 12c-4-3-10-4-17-3v28c7-1 13 0 17 3 4-3 10-4 17-3V9c-7-1-13 0-17 3z" />
      <path d="M24 12v28" />
    </>
  ),
};

export default function MomentIcon({ name, className = '' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      width="48"
      height="48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
