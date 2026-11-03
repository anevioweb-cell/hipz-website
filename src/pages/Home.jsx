import Hero from '../components/Hero.jsx';
import Ticker from '../components/Ticker.jsx';
import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import Reveal from '../components/Reveal.jsx';
import { copy } from '../data/copy.js';

const placeholders = [
  { id: 'flavors', key: 'flavors', tone: 'paper' },
  { id: 'moments', key: 'moments', tone: 'ink' },
  { id: 'why', key: 'why', tone: 'paper' },
  { id: 'community', key: 'community', tone: 'ink' },
  { id: 'pack', key: 'pack', tone: 'lime' },
];

// Phase 2: hero + ticker are real; the sections below are empty placeholders so routing and scroll
// can be tested. They slide over the sticky hero (z-10, solid backgrounds).
export default function Home() {
  return (
    <>
      <Hero />
      <div className="relative z-10">
        <Ticker />
        {placeholders.map(({ id, key, tone }) => (
          <Section key={id} id={id} tone={tone} className="scroll-mt-0">
            <Reveal>
              <SectionHeader
                as="h2"
                eyebrow={copy.sections[key].eyebrow}
                title={copy.sections[key].title}
              />
            </Reveal>
            <Reveal className="mt-10" y={60}>
              <EmptyState title={copy.sections.empty.title}>{copy.sections.empty.text}</EmptyState>
            </Reveal>
          </Section>
        ))}
      </div>
    </>
  );
}
