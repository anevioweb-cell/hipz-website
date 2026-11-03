const tones = {
  ink: 'bg-ink text-paper',
  paper: 'bg-paper text-ink',
  lime: 'bg-brand-lime text-ink',
  lemon: 'bg-lemon text-ink',
  white: 'bg-white text-ink',
};

// Full-bleed band with the site container inside. `tone` picks the band color.
export default function Section({
  tone = 'paper',
  id,
  className = '',
  children,
  as: Tag = 'section',
  ...rest
}) {
  return (
    <Tag id={id} className={`${tones[tone]} ${className}`} {...rest}>
      <div className="mx-auto w-full max-w-site px-gutter py-section lg:px-gutter-lg lg:py-section-lg">
        {children}
      </div>
    </Tag>
  );
}
