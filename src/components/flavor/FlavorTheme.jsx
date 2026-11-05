// Wraps children in a flavor's colors. The only inline style: CSS custom properties fed from data.
// --color-flavor is set directly because the @theme token resolves var(--flavor-accent) at :root,
// where it is undefined; setting it here makes bg-flavor / text-flavor follow the flavor.
export default function FlavorTheme({ flavor, className = '', children }) {
  return (
    <div
      className={className}
      style={{
        '--flavor-accent': flavor.accent,
        '--flavor-deep': flavor.accentDeep,
        '--color-flavor': flavor.accent,
      }}
    >
      {children}
    </div>
  );
}
