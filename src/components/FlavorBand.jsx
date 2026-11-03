import Button from './Button.jsx';
import Ar from './Ar.jsx';
import Reveal from './Reveal.jsx';
import FlavorScene from './FlavorScene.jsx';
import FlavorTheme from './FlavorTheme.jsx';
import { copy } from '../data/copy.js';

// Big band in a flavor's color: name, one line of draft copy, links, and the 4:5 portrait scene.
// `flip` swaps the sides (alternating bands on /flavors). Effects run at low intensity and pause
// offscreen.
export default function FlavorBand({ flavor, flip = false, first = false }) {
  // the first band paints immediately (no reveal): its heading is the page's LCP candidate
  const Wrap = first ? 'div' : Reveal;
  return (
    <FlavorTheme flavor={flavor} className="contents">
      <section className="bg-flavor text-ink" aria-labelledby={`band-${flavor.slug}`}>
        <div
          className={`mx-auto grid max-w-site items-center gap-10 px-gutter py-section lg:grid-cols-2 lg:gap-16 lg:px-gutter-lg lg:py-section-lg ${
            first ? 'pt-32 lg:pt-40' : ''
          }`}
        >
          <Wrap className={flip ? 'lg:order-2' : ''}>
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[34rem] overflow-hidden rounded-inset-sm shadow-pop lg:rounded-inset">
              <FlavorScene
                flavor={flavor}
                effects="low"
                crop="portrait"
                sizes="(min-width: 1024px) 34rem, 100vw"
                priority={first}
              />
            </div>
          </Wrap>
          <Wrap
            {...(first ? {} : { delay: 0.1, y: 60 })}
            className="flex flex-col items-start gap-5"
          >
            <h2 id={`band-${flavor.slug}`} className="font-display text-display font-extrabold">
              {flavor.name}
            </h2>
            <Ar display className="self-start text-h2">
              {flavor.nameAr}
            </Ar>
            <p className="font-display text-h3 font-bold">{copy.flavors[flavor.slug].tagline}</p>
            <p className="max-w-[36ch] text-lead">{copy.flavors[flavor.slug].blurb}</p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button to={`/flavors/${flavor.slug}`} variant="primary">
                {copy.flavors.meet.text} {flavor.name}
              </Button>
              <Button to="/distributors" variant="ghost" arrow={false}>
                {copy.flavors.findIt.text}
              </Button>
            </div>
          </Wrap>
        </div>
      </section>
    </FlavorTheme>
  );
}
