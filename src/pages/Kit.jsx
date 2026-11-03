import Ar from '../components/Ar.jsx';
import Button from '../components/Button.jsx';
import Chip from '../components/Chip.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FlavorTheme from '../components/FlavorTheme.jsx';
import InsetCard from '../components/InsetCard.jsx';
import Marquee from '../components/Marquee.jsx';
import Reveal from '../components/Reveal.jsx';
import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import { useToast } from '../components/toast-context.js';
import { flavors } from '../data/flavors.js';

const colors = [
  ['brand-lime', 'REAL logo avatar'],
  ['brand-leaf', 'REAL label green'],
  ['lemon', 'REAL lemon bottle'],
  ['lemon-cap', 'REAL lemon cap'],
  ['peach', 'REAL peach bottle'],
  ['peach-cap', 'REAL peach cap'],
  ['ink', 'PLACEHOLDER'],
  ['ink-soft', 'PLACEHOLDER'],
  ['paper', 'PLACEHOLDER'],
  ['white', 'PLACEHOLDER'],
];
const swatch = {
  'brand-lime': 'bg-brand-lime',
  'brand-leaf': 'bg-brand-leaf',
  lemon: 'bg-lemon',
  'lemon-cap': 'bg-lemon-cap',
  peach: 'bg-peach',
  'peach-cap': 'bg-peach-cap',
  ink: 'bg-ink',
  'ink-soft': 'bg-ink-soft',
  paper: 'bg-paper',
  white: 'bg-white',
};

// Development-only review page (route registered only when import.meta.env.DEV).
export default function Kit() {
  const toast = useToast();
  return (
    <>
      <Section tone="ink" className="pt-28">
        <SectionHeader as="h1" title="Kit" eyebrow="Tokens and components" />
        <h2 className="mt-12 font-display text-h3 font-bold">Colors</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
          {colors.map(([name, note]) => (
            <li key={name} className="overflow-hidden rounded-card bg-white text-ink shadow-card">
              <div className={`h-20 ${swatch[name]}`} />
              <p className="p-3 font-mono text-label">
                {name}
                <br />
                {note}
              </p>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 font-display text-h3 font-bold">Type</h2>
        <p className="mt-4 font-display text-display font-extrabold">Display</p>
        <p className="font-display text-h2 font-extrabold">Heading two</p>
        <p className="font-display text-h3 font-bold">Heading three</p>
        <p className="text-lead">Lead paragraph in Inter.</p>
        <p>Body text in Inter.</p>
        <p className="font-mono text-label uppercase">Label in DM Mono</p>
        <p className="text-lead">
          English with <Ar>هايبز</Ar> inline, and <Ar display>هايبز</Ar> display.
        </p>
        <h2 className="mt-12 font-display text-h3 font-bold">Buttons and chips</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="lime">Lime</Button>
          <Button variant="ghost" arrow={false}>
            Ghost
          </Button>
          <Button onClick={() => toast.show('Done — this is a Toast.')}>Show toast</Button>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Chip>Paper</Chip>
          <Chip tone="lime">Lime</Chip>
          <Chip tone="outline">Outline</Chip>
          {flavors.map((f) => (
            <FlavorTheme key={f.slug} flavor={f}>
              <Chip tone="flavor">{f.name}</Chip>
            </FlavorTheme>
          ))}
        </div>
        <h2 className="mt-12 font-display text-h3 font-bold">Radii, shadows, empty state</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="h-32 rounded-card bg-white shadow-card" />
          <div className="h-32 rounded-inset bg-white shadow-pop" />
          <EmptyState title="Nothing here yet">Empty states stay honest.</EmptyState>
        </div>
      </Section>
      <Marquee className="bg-brand-lime py-4" speed={80} label="Marquee sample">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="px-6 font-display text-h2 font-extrabold">
            Marquee ✦
          </span>
        ))}
      </Marquee>
      <Section tone="ink">
        <Reveal>
          <p className="font-display text-h2 font-extrabold">Reveal on scroll</p>
        </Reveal>
        <InsetCard tone="lemon" className="mt-8 p-10">
          <p className="font-display text-h3 font-bold">InsetCard</p>
        </InsetCard>
      </Section>
    </>
  );
}
