export default function EmptyState({ title, children, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-card border-2 border-dashed border-current/30 px-6 py-12 text-center ${className}`}
    >
      <span aria-hidden="true" className="size-10 rounded-full bg-brand-lime" />
      <h3 className="font-display text-h3 font-bold">{title}</h3>
      {children && <p className="max-w-[44ch] opacity-80">{children}</p>}
      {action}
    </div>
  );
}
