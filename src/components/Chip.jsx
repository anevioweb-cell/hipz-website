export default function Chip({ children, tone = 'paper', className = '' }) {
  const tones = {
    paper: 'bg-paper text-ink',
    lime: 'bg-brand-lime text-ink',
    flavor: 'bg-flavor text-ink',
    outline: 'ring-1 ring-current',
  };
  return (
    <span
      className={`inline-flex items-center rounded-pill px-3.5 py-1.5 font-mono text-label uppercase ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
