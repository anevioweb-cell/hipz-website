import { useParams } from 'react-router-dom';
import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import FlavorTheme from '../components/FlavorTheme.jsx';
import Button from '../components/Button.jsx';
import { getFlavor } from '../data/flavors.js';
import NotFound from './NotFound.jsx';

export default function FlavorDetail() {
  const { slug } = useParams();
  const flavor = getFlavor(slug);
  if (!flavor) return <NotFound />;
  return (
    <FlavorTheme flavor={flavor}>
      <Section tone="paper" className="pt-32">
        <SectionHeader as="h1" title={flavor.name} />
        <div className="mt-12">
          <EmptyState title="More on this flavor soon">
            Product details will appear here once they are confirmed.
          </EmptyState>
        </div>
        <div className="mt-10">
          <Button to="/flavors" variant="lime">
            All flavors
          </Button>
        </div>
      </Section>
    </FlavorTheme>
  );
}
