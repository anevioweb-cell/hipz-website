import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import Button from './Button.jsx';
import Chip from './Chip.jsx';
import Ar from './Ar.jsx';
import Picture from './Picture.jsx';
import Parallax from './Parallax.jsx';
import SplitLines from './SplitLines.jsx';
import FlavorTheme from './FlavorTheme.jsx';
import { flavors } from '../data/flavors.js';
import { SITE } from '../data/site.js';
import { copy } from '../data/copy.js';
import { ease, duration, heroScaleFrom } from '../motion.js';

const ADVANCE_MS = 6000;

// Two-state hero (lemon / peach). Mechanics follow the reference measurement:
// sticky full-height wrapper (following sections slide over it), image scale 1.35 → 1 over ≈1.2 s on
// load, page-scroll parallax of −0.3 px/px, dark card with light text. Our additions: line reveal
// headline, flavor switch with auto-advance (pauses on hover/focus/pause button; none under
// prefers-reduced-motion). Only transform + opacity are animated.
export default function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [held, setHeld] = useState(false);
  const auto = playing && !held && !reduce;

  useEffect(() => {
    if (!auto) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % flavors.length), ADVANCE_MS);
    return () => clearInterval(id);
  }, [auto]);

  const active = flavors[index];

  return (
    <div className="sticky top-0 z-0 h-svh min-h-[600px] p-inset">
      <section
        aria-label="Hipz"
        className="relative h-full overflow-hidden rounded-inset-sm bg-ink text-paper lg:rounded-inset"
        onMouseEnter={() => setHeld(true)}
        onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={() => setHeld(false)}
      >
        {flavors.map((f, i) => {
          const on = i === index;
          const first = i === 0;
          return (
            <FlavorTheme key={f.slug} flavor={f} className="pointer-events-none absolute inset-0">
              <motion.div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(70%_90%_at_78%_55%,var(--color-flavor),transparent_70%)] opacity-60"
                initial={false}
                animate={{ opacity: on ? 0.6 : 0 }}
                transition={{ duration: duration.reveal, ease }}
              />
              <Parallax className="absolute inset-x-0 top-0 h-[58%] lg:left-auto lg:h-full lg:w-auto">
                <motion.div
                  className="hero-mask h-full w-full"
                  initial={
                    first && !reduce
                      ? { opacity: 1, scale: heroScaleFrom }
                      : { opacity: on ? 1 : 0, scale: 1 }
                  }
                  animate={{ opacity: on ? 1 : 0, scale: 1 }}
                  transition={{
                    opacity: { duration: duration.reveal, ease },
                    scale: { duration: duration.hero, ease },
                  }}
                  style={{ transformOrigin: '60% 40%' }}
                >
                  <Picture
                    name={f.heroImage}
                    alt={`${f.name} Hipz bottle`}
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    priority={first}
                    className="block h-full w-full lg:flex lg:justify-end"
                    imgClassName="h-full w-full object-cover object-top lg:w-auto lg:max-w-none"
                  />
                </motion.div>
              </Parallax>
            </FlavorTheme>
          );
        })}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-36 bg-linear-to-b from-ink/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[72%] bg-linear-to-t from-ink via-ink/85 to-transparent lg:inset-y-0 lg:right-auto lg:h-full lg:w-[64%] lg:bg-linear-to-r lg:via-ink/80"
        />

        <div className="relative z-10 flex h-full flex-col justify-end gap-6 px-gutter pb-8 lg:max-w-[48rem] lg:px-12 lg:pb-12">
          <Chip tone="outline" className="self-start">
            {SITE.name} <Ar className="ml-2">{SITE.nameAr}</Ar>
          </Chip>
          <SplitLines
            lines={copy.hero.headline.lines}
            delay={0.5}
            className="max-w-[10ch] font-display text-display font-extrabold"
          />
          <p className="max-w-[34ch] text-lead">{copy.hero.subtitle.text}</p>
          <div className="flex flex-wrap gap-3">
            <Button href="#flavors" variant="secondary">
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
              className="flex gap-1.5 rounded-pill bg-ink/85 p-1.5"
            >
              {flavors.map((f, i) => (
                <button
                  key={f.slug}
                  type="button"
                  aria-pressed={i === index}
                  onClick={() => setIndex(i)}
                  className={`inline-flex items-center gap-2 rounded-pill px-3 py-2 text-sm font-medium transition-colors sm:px-4 sm:text-base ${
                    i === index ? 'bg-paper text-ink' : 'bg-white/15 text-paper hover:bg-white/25'
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
                className="rounded-pill bg-ink/85 px-4 py-2 text-sm font-medium hover:bg-ink sm:text-base"
              >
                {playing ? copy.hero.pause.text : copy.hero.play.text}
              </button>
            )}
          </div>
        </div>

        <p className="sr-only" role="status" aria-live={auto ? 'off' : 'polite'}>
          {active.name}
        </p>
      </section>
    </div>
  );
}
