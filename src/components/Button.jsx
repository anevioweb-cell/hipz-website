import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-ink text-paper hover:bg-ink-soft',
  secondary: 'bg-white text-ink hover:bg-paper',
  lime: 'bg-brand-lime text-ink hover:bg-lemon',
  flavor: 'bg-flavor text-ink hover:brightness-95',
  ghost: 'bg-transparent text-current ring-2 ring-current hover:bg-ink hover:text-paper',
};

function ArrowChip({ onLime }) {
  return (
    <span
      aria-hidden="true"
      className={`grid size-10 place-items-center rounded-full ${onLime ? 'bg-ink text-paper' : 'bg-brand-lime text-ink'} transition-transform duration-(--duration-base) ease-(--ease-out) group-hover:rotate-45`}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

// Pill button with optional arrow chip. Renders <Link> (to), <a> (href) or <button>.
export default function Button({
  children,
  variant = 'primary',
  arrow = true,
  to,
  href,
  className = '',
  ...rest
}) {
  const cls = `group inline-flex items-center gap-4 rounded-pill py-1.5 pr-1.5 pl-5.5 font-medium transition-colors duration-(--duration-fast) ${
    arrow ? '' : 'pr-5.5'
  } ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span>{children}</span>
      {arrow && <ArrowChip onLime={variant === 'lime' || variant === 'flavor'} />}
    </>
  );
  if (to) {
    return (
      <Link to={to} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" className={cls} {...rest}>
      {inner}
    </button>
  );
}
