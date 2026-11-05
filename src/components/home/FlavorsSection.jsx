import SectionHeader from '../ui/SectionHeader.jsx';
import PopBlock from '../motion/PopBlock.jsx';
import FlavorCard from '../flavor/FlavorCard.jsx';
import BothFlavorsCard from '../flavor/BothFlavorsCard.jsx';
import FlavorCarousel from '../flavor/FlavorCarousel.jsx';
import { flavors } from '../../data/flavors.js';
import { copy } from '../../data/copy.js';

// Home flavors section (target of the hero's "Meet the flavors"): heading, then cards for Lemon, Peach
// and the "Both flavors" tile. Reveal offsets follow the reference's flavor cards (rise 70 px).
export default function FlavorsSection() {
  return (
    <section id="flavors" className="bg-paper text-ink">
      <div className="mx-auto max-w-site px-gutter pt-section lg:px-gutter-lg lg:pt-section-lg">
        <PopBlock>
          <SectionHeader
            as="h2"
            eyebrow={copy.sections.flavors.eyebrow}
            title={copy.sections.flavors.title}
          />
        </PopBlock>
      </div>
      <div className="pt-10 lg:pb-8">
        <FlavorCarousel>
          {flavors.map((f, i) => (
            <PopBlock key={f.slug} y={70} delay={i * 0.1}>
              <FlavorCard flavor={f} tilt={i % 2 ? -13 : 13} />
            </PopBlock>
          ))}
          <PopBlock key="both" y={70} delay={0.2}>
            <BothFlavorsCard />
          </PopBlock>
        </FlavorCarousel>
      </div>
    </section>
  );
}
