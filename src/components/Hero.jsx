import { useEffect, useRef, useState } from 'react';
import { m, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';
import Button from './Button.jsx';
import Chip from './Chip.jsx';
import Ar from './Ar.jsx';
import Parallax from './Parallax.jsx';
import SplitLines from './SplitLines.jsx';
import FlavorTheme from './FlavorTheme.jsx';
import FlavorScene from './FlavorScene.jsx';
import { flavors } from '../data/flavors.js';
import { SITE } from '../data/site.js';
import { copy } from '../data/copy.js';
import { duration, ease } from '../motion.js';

const ADVANCE_MS = 7000;
const CROSSFADE = 0.6; // s, opacity only (≤ 600 ms)

// Full-bleed two-state hero (lemon / peach).
// Reference mechanics (measured): sticky full-height wrapper that following sections slide over,
// scene scale 1.35 → 1 over ≈1.2 s, page-scroll parallax −0.3 px/px, navbar timing.
// Ours: crossfade between scenes, thirst effects (droplets, fizz, float, pointer parallax, light bloom),
// auto-advance every 7 s that pauses on hover, focus, hidden tab, offscreen and the Pause button.
// Under prefers-reduced-motion: no auto-advance, no Pause button, no effects.
export default function Hero() {
  const reduce = useReducedMotion();
  const rootRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const [inView, setInView] = useState(true);
  const [covered, setCovered] = useState(false);
  const [tabHidden, setTabHidden] = useState(false);
  const [first, setFirst] = useState(false); // first scene mounts right after the text's first paint
  const [second, setSecond] = useState(false); // second scene mounts after idle

  const offscreen = !inView || covered;
  const idle = offscreen || tabHidden; // effects freeze
  const auto = playing && !held && !idle && !reduce;

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setCovered(y > window.innerHeight * 0.95));

  useEffect(() => {
    const el = rootRef.current;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.05,
    });
    io.observe(el);
    const onVis = () => setTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    // Let the headline paint first (it is Chrome's LCP candidate: a full-viewport image is ignored),
    // then start the hero image request so it can never race the text paint.
    let raf2;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setFirst(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  useEffect(() => {
    const ric = window.requestIdleCallback ?? ((cb) => setTimeout(cb, 1200));
    const cancel = window.cancelIdleCallback ?? clearTimeout;
    const id = ric(() => setSecond(true));
    return () => cancel(id);
  }, []);

  useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % flavors.length), ADVANCE_MS);
    return () => clearInterval(id);
  }, [auto]);

  const active = flavors[index];

  return (
    <div className="sticky top-0 z-0 h-svh min-h-[600px]">
      <section
        ref={rootRef}
        aria-label="Hipz"
        data-fx-paused={idle ? 'true' : 'false'}
        className="relative h-full overflow-hidden bg-paper"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        <Parallax className="absolute inset-0">
          {flavors.map((f, i) => {
            if ((i === 0 && !first) || (i > 0 && !second)) return null;
            const on = i === index;
            return (
              <m.div
                key={f.slug}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: on ? 1 : 0 }}
                transition={{ duration: CROSSFADE, ease }}
                aria-hidden={!on}
              >
                <FlavorScene
                  flavor={f}
                  priority={i === 0}
                  intro={i === 0}
                  pointer
                  effects={on ? 'full' : 'none'}
                  paused={idle}
                />
              </m.div>
            );
          })}
        </Parallax>

        {/* phones / portrait: headline sits on a dark scrim with light text */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[68%] bg-linear-to-t from-ink via-ink/80 to-transparent portrait:block"
        />

        <FlavorTheme flavor={active} className="contents">
          <div className="relative z-10 flex h-full flex-col justify-end gap-5 px-gutter pt-28 pb-8 text-ink portrait:text-paper lg:px-12 lg:pb-14 landscape:max-w-[min(46rem,48vw)]">
            <m.div initial={false}>
              <Chip tone="outline" className="self-start">
                {SITE.name} <Ar className="ml-2">{copy.hero.eyebrow.ar}</Ar>
              </Chip>
            </m.div>
            <SplitLines
              immediate
              lines={copy.hero.headline.lines}
              delay={0.05}
              className="font-display text-display font-extrabold landscape:text-[clamp(3rem,6.2vw,6.5rem)]"
            />
            {/* the subtitle stays static: it is the largest text, i.e. Chrome's LCP candidate (a full-viewport
                image is ignored as LCP), so it must paint immediately */}
            <p className="max-w-[34ch] text-lead">{copy.hero.subtitle.text}</p>
            <m.div
              className="flex flex-col gap-5"
              initial={false}
              animate={{ y: 0 }}
              transition={{ duration: duration.reveal, ease, delay: 0.6 }}
            >
              <div className="flex flex-wrap gap-3">
                <Button href="#flavors" variant="flavor">
                  {copy.hero.primaryCta.text}
                </Button>
                <Button to="/distributors" variant="ghost" arrow={false}>
                  {copy.hero.secondaryCta.text}
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div
                  role="group"
                  aria-label={copy.hero.switchLabel.text}
                  className="flex gap-1.5 rounded-pill bg-paper/70 p-1.5"
                >
                  {flavors.map((f, i) => (
                    <button
                      key={f.slug}
                      type="button"
                      aria-pressed={i === index}
                      onClick={() => setIndex(i)}
                      className={`inline-flex items-center gap-2 rounded-pill px-3 py-2 text-sm font-medium text-ink transition-colors sm:px-4 sm:text-base ${
                        i === index ? 'bg-ink text-paper' : 'hover:bg-paper'
                      }`}
                    >
                      <FlavorTheme flavor={f} className="contents">
                        <span aria-hidden="true" className="size-3 rounded-full bg-flavor" />
                      </FlavorTheme>
                      {f.name} <Ar>{f.nameAr}</Ar>
                    </button>
                  ))}
                </div>
                {!reduce && (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => !p)}
                    aria-pressed={!playing}
                    className="rounded-pill bg-paper/70 px-4 py-2 text-sm font-medium text-ink hover:bg-paper sm:text-base"
                  >
                    {playing ? copy.hero.pause.text : copy.hero.play.text}
                  </button>
                )}
              </div>
            </m.div>
          </div>
        </FlavorTheme>
        <p className="sr-only" role="status" aria-live={auto ? 'off' : 'polite'}>
          {active.name}
        </p>
      </section>
    </div>
  );
}
