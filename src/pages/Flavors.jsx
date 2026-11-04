import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import PopBlock from '../components/PopBlock.jsx';
import Button from '../components/Button.jsx';
import FlavorBand from '../components/FlavorBand.jsx';
import BothFlavorsCard from '../components/BothFlavorsCard.jsx';
import { flavors } from '../data/flavors.js';
import { copy } from '../data/copy.js';
import { useNavTone } from '../hooks/useNavTone.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

// The reference has no flavors listing (its /flavors is a 404), so this is a showcase:
// two alternating bands in each flavor's color, the "Both flavors" tile and a closing call to action.
export default function Flavors() {
  useNavTone('dark');
  usePageTitle('Flavors — Hipz');
  return (
    <>
      <h1 className="sr-only">{copy.flavors.pageTitle.title}</h1>
      {flavors.map((f, i) => (
        <FlavorBand key={f.slug} flavor={f} flip={i % 2 === 1} first={i === 0} />
      ))}
      <Section tone="paper">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <PopBlock>
            <SectionHeader
              as="h2"
              eyebrow={copy.flavors.pageTitle.subtitle}
              title={copy.flavors.both.name}
            />
            <p className="mt-4 max-w-[34ch] text-lead">{copy.flavors.both.blurb}</p>
          </PopBlock>
          <PopBlock delay={0.1} y={70} className="flex justify-center">
            <BothFlavorsCard />
          </PopBlock>
        </div>
      </Section>
      <Section tone="ink">
        <PopBlock className="flex flex-col items-start gap-6">
          <SectionHeader as="h2" title={copy.flavors.closing.title}>
            {copy.flavors.closing.text}
          </SectionHeader>
          <Button to="/distributors" variant="lime">
            {copy.flavors.findIt.text}
          </Button>
        </PopBlock>
      </Section>
    </>
  );
}
