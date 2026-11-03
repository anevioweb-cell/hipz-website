import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Button from '../components/Button.jsx';

export default function NotFound() {
  return (
    <Section tone="paper" className="pt-32">
      <SectionHeader as="h1" title="Page not found" />
      <div className="mt-10">
        <Button to="/" variant="lime">
          Back home
        </Button>
      </div>
    </Section>
  );
}
