import { droplets, bubbles } from '../../data/fx.js';

// Condensation droplets sliding down the bottle and fizz bubbles rising from its base.
// `box` is the bottle box in container pixels ({left, top, width, height}); `intensity` "low" uses fewer
// particles (detail pages). Transform/opacity animations only (CSS keyframes in index.css).
// `paused` freezes every animation (offscreen / hidden tab).
export default function ThirstEffects({ box, intensity = 'full', paused = false }) {
  if (!box) return null;
  const d = intensity === 'low' ? droplets.slice(0, 4) : droplets;
  const b = intensity === 'low' ? bubbles.slice(0, 6) : bubbles;
  return (
    <div
      aria-hidden="true"
      data-testid="thirst-fx"
      data-paused={paused ? 'true' : 'false'}
      className={`pointer-events-none absolute ${paused ? 'fx-paused' : ''}`}
      style={{
        left: box.left,
        top: box.top,
        width: box.width,
        height: box.height,
        '--travel': `${Math.round(box.height * 0.32)}px`,
        '--rise': `${Math.round(box.height * 0.55)}px`,
      }}
    >
      {d.map((p, i) => (
        <span
          key={`d${i}`}
          className="fx-droplet"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            '--s': `${p.size}px`,
            '--t': `${p.dur}s`,
            '--d': `${p.delay}s`,
          }}
        />
      ))}
      {b.map((p, i) => (
        <span
          key={`b${i}`}
          className="fx-bubble"
          style={{
            left: `${p.x}%`,
            '--s': `${p.size}px`,
            '--t': `${p.dur}s`,
            '--d': `${p.delay}s`,
            '--sway': `${p.sway}px`,
          }}
        />
      ))}
    </div>
  );
}
