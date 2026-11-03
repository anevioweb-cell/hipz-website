import SplitLines from './SplitLines.jsx';

// Section heading. Pass `lines` (array) to reveal the heading line by line when it scrolls into view
// (SplitLines, below the fold only); otherwise `title` renders as a plain heading.
export default function SectionHeader({
  eyebrow,
  title,
  lines,
  children,
  as: Tag = 'h2',
  align = 'start',
  className = '',
}) {
  const center = align === 'center';
  const headingCls = `font-display text-h2 font-extrabold ${center ? 'mx-auto max-w-[16ch]' : 'max-w-[18ch]'}`;
  return (
    <header
      className={`flex flex-col gap-4 ${center ? 'items-center text-center' : ''} ${className}`}
    >
      {eyebrow && <p className="font-mono text-label uppercase">{eyebrow}</p>}
      {lines ? (
        <SplitLines as={Tag} inView lines={lines} className={headingCls} />
      ) : (
        <Tag className={headingCls}>{title}</Tag>
      )}
      {children && (
        <div className={`max-w-prose text-lead ${center ? 'mx-auto' : ''}`}>{children}</div>
      )}
    </header>
  );
}
