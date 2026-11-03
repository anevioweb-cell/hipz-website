import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Distributors() {
  return (
    <Section tone="paper" className="pt-32">
      <SectionHeader as="h1" title="Distributors" />
      <div className="mt-12">
        <EmptyState title="Ways to work with Hipz">
          Wholesale details and the request form will appear here.
        </EmptyState>
      </div>
    </Section>
  );
}
