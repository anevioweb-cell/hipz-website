export default function SectionHeader({
  eyebrow,
  title,
  children,
  as: Tag = 'h2',
  className = '',
}) {
  return (
    <header className={`flex flex-col gap-4 ${className}`}>
      {eyebrow && <p className="font-mono text-label uppercase">{eyebrow}</p>}
      <Tag className="max-w-[18ch] font-display text-h2 font-extrabold">{title}</Tag>
      {children && <div className="max-w-prose text-lead">{children}</div>}
    </header>
  );
}
