// Rounded card inset from the viewport edge (the reference's hero / pack pattern).
export default function InsetCard({ tone = 'ink', className = '', children, as: Tag = 'div' }) {
  const tones = {
    ink: 'bg-ink text-paper',
    lime: 'bg-brand-lime text-ink',
    lemon: 'bg-lemon text-ink',
  };
  return (
    <div className="p-inset">
      <Tag
        className={`overflow-hidden rounded-inset-sm lg:rounded-inset ${tones[tone]} ${className}`}
      >
        {children}
      </Tag>
    </div>
  );
}
