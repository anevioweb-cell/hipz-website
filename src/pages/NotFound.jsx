import Section from '../components/ui/Section.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import Button from '../components/ui/Button.jsx';
import { copy } from '../data/copy.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

// On-brand 404 (unknown routes and unknown flavor slugs).
export default function NotFound() {
  const t = copy.errors.notFound;
  usePageTitle(`${t.title} — Hipz`);
  return (
    <Section tone="ink" className="pt-32">
      <SectionHeader as="h1" title={t.title}>
        {t.text}
      </SectionHeader>
      <div className="mt-10">
        <Button to="/" variant="lime">
          {t.cta}
        </Button>
      </div>
    </Section>
  );
}
