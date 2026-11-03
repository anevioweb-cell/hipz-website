// Wraps children in a flavor's colors. The only inline style: CSS custom properties fed from data.
export default function FlavorTheme({ flavor, className = '', children }) {
  return (
    <div
      className={className}
      style={{ '--flavor-accent': flavor.accent, '--flavor-deep': flavor.accentDeep }}
    >
      {children}
    </div>
  );
}
