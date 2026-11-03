import { Link } from 'react-router-dom';
import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import FlavorTheme from '../components/FlavorTheme.jsx';
import { flavors } from '../data/flavors.js';

export default function Flavors() {
  return (
    <Section tone="paper" className="pt-32">
      <SectionHeader as="h1" title="Flavors" />
      <ul className="mt-12 grid gap-5 md:grid-cols-2">
        {flavors.map((f) => (
          <li key={f.slug}>
            <FlavorTheme flavor={f}>
              <Link
                to={`/flavors/${f.slug}`}
                className="flex h-80 items-end rounded-card bg-flavor p-8 font-display text-h2 font-extrabold shadow-card"
              >
                {f.name}
              </Link>
            </FlavorTheme>
          </li>
        ))}
      </ul>
    </Section>
  );
}
