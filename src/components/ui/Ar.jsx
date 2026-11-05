// Arabic accent word. Isolates direction so it never reorders surrounding English text.
export default function Ar({ children, display = false, className = '' }) {
  return (
    <span lang="ar" dir="rtl" className={`ar ${display ? 'ar-display' : ''} ${className}`.trim()}>
      {children}
    </span>
  );
}
