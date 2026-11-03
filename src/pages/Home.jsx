import Chip from '../components/Chip.jsx';
import Button from '../components/Button.jsx';
import Marquee from '../components/Marquee.jsx';
import Ar from '../components/Ar.jsx';
import FlavorTheme from '../components/FlavorTheme.jsx';
import InsetCard from '../components/InsetCard.jsx';
import { flavors } from '../data/flavors.js';

// Phase 1 shell only: real hero, imagery and motion arrive in Phase 2.
export default function Home() {
  return (
    <>
      <InsetCard>
        <div className="flex min-h-[calc(100svh-1.5rem)] flex-col justify-end gap-8 px-gutter pt-32 pb-12 lg:px-gutter-lg">
          <h1 className="max-w-[12ch] font-display text-display font-extrabold">Hipz</h1>
          <div className="flex flex-wrap gap-3">
            {flavors.map((f) => (
              <FlavorTheme key={f.slug} flavor={f}>
                <Chip tone="flavor">{f.name}</Chip>
              </FlavorTheme>
            ))}
          </div>
          <div>
            <Button to="/flavors" variant="secondary">
              See the flavors
            </Button>
          </div>
        </div>
      </InsetCard>
      <Marquee className="bg-brand-lime py-5 text-ink" speed={70} label="Hipz">
        {[...Array(6)].map((_, i) => (
          <span
            key={i}
            className="flex items-center gap-8 pr-8 font-display text-h2 font-extrabold"
          >
            Hipz <Ar display>هايبز</Ar>
            <span aria-hidden="true">✦</span>
          </span>
        ))}
      </Marquee>
    </>
  );
}
