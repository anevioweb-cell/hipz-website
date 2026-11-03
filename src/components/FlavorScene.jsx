import { useCallback, useEffect, useState } from 'react';
import { m, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import Picture from './Picture.jsx';
import ThirstEffects from './ThirstEffects.jsx';
import { images } from '../data/images.generated.js';
import { coverBox } from '../lib/cover.js';
import { duration, ease, heroScaleFrom } from '../motion.js';

const POINTER_PX = 8; // very small pointer parallax (proposal)

// A flavor's wide/portrait scene with the thirst effects on top of the bottle.
// The bottle box and focal point come from the generated image metadata (never hard-coded here),
// and are mapped to container pixels with the object-fit: cover math.
// intro: scale 1.35 → 1 over 1.2 s (measured) + light bloom; pointer: tiny desktop parallax;
// effects "full" | "low" | "none"; paused freezes particles and float.
export default function FlavorScene({
  flavor,
  priority = false,
  intro = false,
  pointer = false,
  effects = 'full',
  paused = false,
  crop = 'auto',
  onImageLoad,
  sizes = '100vw',
  className = '',
}) {
  const reduce = useReducedMotion();
  const [box, setBox] = useState(null);
  const [seen, setSeen] = useState(true);
  const wide = images[flavor.images.heroWide];
  const portrait = images[flavor.images.heroPortrait];

  const measureRef = useCallback(
    (el) => {
      if (!el) return undefined;
      const measure = () => {
        const W = el.clientWidth || window.innerWidth;
        const H = el.clientHeight || window.innerHeight;
        // 'portrait' forces the 4:5 crop (bands); 'auto' follows the <picture> media query (VIEWPORT aspect,
        // not the container: inside the framed hero the two can differ, e.g. 768×1024)
        const portraitViewport = window.matchMedia('(max-aspect-ratio: 1/1)').matches;
        const meta = crop === 'portrait' || portraitViewport ? portrait : wide;
        setBox(
          coverBox({
            W,
            H,
            iw: meta.width,
            ih: meta.height,
            pos: { x: meta.focal.x, y: 0.5 },
            box: meta.box,
          }),
        );
      };
      measure();
      const ro = new ResizeObserver(measure);
      ro.observe(el);
      const io = new IntersectionObserver(([entry]) => setSeen(entry.isIntersecting), {
        threshold: 0,
      });
      io.observe(el);
      return () => {
        ro.disconnect();
        io.disconnect();
      };
    },
    [wide, portrait, crop],
  );

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 20 });
  const sy = useSpring(py, { stiffness: 60, damping: 20 });
  useEffect(() => {
    if (!pointer || reduce || !window.matchMedia('(pointer: fine)').matches) return undefined;
    const onMove = (e) => {
      px.set((e.clientX / window.innerWidth - 0.5) * -2 * POINTER_PX);
      py.set((e.clientY / window.innerHeight - 0.5) * -2 * POINTER_PX);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointer, reduce, px, py]);

  const origin = `${Math.round(wide.focal.x * 100)}% 50%`;
  const showFx = effects !== 'none' && !reduce;

  return (
    <div
      ref={measureRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        '--pos-wide': `${Math.round(wide.focal.x * 1000) / 10}% 50%`,
        '--pos-portrait': `${Math.round(portrait.focal.x * 1000) / 10}% 50%`,
      }}
    >
      <m.div className="absolute inset-0" style={pointer && !reduce ? { x: sx, y: sy } : undefined}>
        <div className={`scene-float absolute inset-0 ${paused || !seen ? 'fx-paused' : ''}`}>
          <m.div
            className="absolute inset-0"
            style={{ transformOrigin: origin }}
            initial={intro && !reduce ? { scale: heroScaleFrom } : false}
            animate={{ scale: 1 }}
            transition={{ duration: duration.hero, ease }}
          >
            <Picture
              name={crop === 'portrait' ? flavor.images.heroPortrait : flavor.images.heroWide}
              portrait={crop === 'portrait' ? undefined : flavor.images.heroPortrait}
              alt={flavor.alt}
              sizes={sizes}
              priority={priority}
              onLoad={onImageLoad}
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover object-(--pos-wide) portrait:object-(--pos-portrait)"
            />
            {box && (
              <m.div
                aria-hidden="true"
                className="pointer-events-none absolute rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.7),transparent_65%)]"
                style={{
                  left: box.left - box.width * 0.5,
                  top: box.top - box.height * 0.1,
                  width: box.width * 2,
                  height: box.height * 0.8,
                }}
                initial={intro && !reduce ? { opacity: 0 } : false}
                animate={{ opacity: reduce ? 0.15 : [0, 0.8, 0.3] }}
                transition={{ duration: 2.2, delay: 0.3, ease }}
              />
            )}
            {showFx && (
              <ThirstEffects
                box={box}
                intensity={effects === 'low' ? 'low' : 'full'}
                paused={paused}
              />
            )}
          </m.div>
        </div>
      </m.div>
    </div>
  );
}
