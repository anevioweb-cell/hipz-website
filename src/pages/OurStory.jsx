import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function OurStory() {
  return (
    <Section tone="ink" className="pt-32">
      <SectionHeader as="h1" title="Our story" />
      <div className="mt-12">
        <EmptyState title="The story">The story will appear here once it is confirmed.</EmptyState>
      </div>
    </Section>
  );
}
