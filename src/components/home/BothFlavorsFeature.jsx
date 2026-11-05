import Button from '../ui/Button.jsx';
import Parallax from '../motion/Parallax.jsx';
import Picture from '../ui/Picture.jsx';
import PopBlock from '../motion/PopBlock.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';
import { flavors } from '../../data/flavors.js';
import { copy } from '../../data/copy.js';

// "Both flavors" band — the reference's variety-pack section, adapted. Measured frame: inset card with
// the page margin (14 px, 8 px on phones), radius 32 px (24 px on phones), ≈ 643 px tall on desktop,
// ≈ 600 px on phones, text block ≈ 653 px wide on the left, 56 px side padding.
// Ours: a lemon/peach split background and both full bottles. Scroll interplay: the bottles drift in
// opposite directions (transform only); hover tilts them apart. No pack, quantity, price or cart.
export default function BothFlavorsFeature() {
  const f = copy.both.feature;
  const [lemon, peach] = flavors;
  return (
    <section id="both" className="bg-paper">
      <div className="hero-frame-wrap">
        <div className="group relative grid min-h-[600px] items-center overflow-hidden rounded-[var(--frame-r)] bg-[linear-gradient(172deg,var(--color-lemon)_0%,var(--color-lemon)_52%,var(--color-peach)_52%,var(--color-peach)_100%)] lg:bg-[linear-gradient(100deg,var(--color-lemon)_0%,var(--color-lemon)_52%,var(--color-peach)_52%,var(--color-peach)_100%)] px-5 pt-14 text-ink lg:min-h-[643px] lg:grid-cols-[minmax(0,653px)_1fr] lg:px-14 lg:pt-0">
          <PopBlock className="relative z-10 flex flex-col items-start gap-6 lg:py-16">
            <SectionHeader eyebrow={f.eyebrow} lines={f.lines}>
              {f.text}
            </SectionHeader>
            <Button to="/distributors" variant="primary">
              {f.cta}
            </Button>
          </PopBlock>
          <div
            aria-hidden="true"
            className="relative mt-8 flex h-[420px] items-end justify-center gap-2 lg:mt-0 lg:h-full lg:min-h-[643px] lg:items-center"
          >
            <Parallax mode="element" distance={-28}>
              <div className="-rotate-6 transition-transform duration-(--duration-slow) ease-(--ease-spring) group-hover:-translate-x-3 group-hover:-rotate-12 motion-reduce:transition-none">
                <Picture
                  name={lemon.images.bottle}
                  alt=""
                  sizes="(min-width: 1024px) 200px, 150px"
                  imgClassName="h-[380px] w-auto drop-shadow-2xl lg:h-[520px]"
                />
              </div>
            </Parallax>
            <Parallax mode="element" distance={28}>
              <div className="rotate-6 transition-transform duration-(--duration-slow) ease-(--ease-spring) group-hover:translate-x-3 group-hover:rotate-12 motion-reduce:transition-none">
                <Picture
                  name={peach.images.bottle}
                  alt=""
                  sizes="(min-width: 1024px) 160px, 120px"
                  imgClassName="h-[380px] w-auto drop-shadow-2xl lg:h-[520px]"
                />
              </div>
            </Parallax>
          </div>
        </div>
      </div>
    </section>
  );
}
