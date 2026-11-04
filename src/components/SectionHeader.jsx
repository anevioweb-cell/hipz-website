import PopText from './PopText.jsx';
import PopBlock from './PopBlock.jsx';

// Section heading with the measured entrance: the eyebrow label pops in (scale + opacity spring), the
// heading pops character by character, a plain-string intro paragraph rises character by character
// ("soft"); a rich (non-string) intro rises as one block. `lines` (array) keeps the line breaks;
// `title` is one line.
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
  const introCls = `max-w-prose text-lead ${center ? 'mx-auto' : ''}`;
  return (
    <header
      className={`flex flex-col gap-4 ${center ? 'items-center text-center' : ''} ${className}`}
    >
      {eyebrow && (
        <PopBlock
          variant="badge"
          className={`font-mono text-label uppercase ${center ? '' : 'origin-left self-start'}`}
        >
          <p>{eyebrow}</p>
        </PopBlock>
      )}
      <PopText as={Tag} lines={lines ?? [title]} className={headingCls} />
      {children &&
        (typeof children === 'string' ? (
          <PopText as="p" variant="soft" text={children} className={introCls} />
        ) : (
          <PopBlock y={20} className={introCls}>
            {children}
          </PopBlock>
        ))}
    </header>
  );
}
