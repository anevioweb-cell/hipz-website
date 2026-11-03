import { useParams } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import Reveal from '../components/Reveal.jsx';
import Button from '../components/Button.jsx';
import Chip from '../components/Chip.jsx';
import Ar from '../components/Ar.jsx';
import Bottle from '../components/Bottle.jsx';
import FlavorScene from '../components/FlavorScene.jsx';
import FlavorTheme from '../components/FlavorTheme.jsx';
import FlavorCard from '../components/FlavorCard.jsx';
import BothFlavorsCard from '../components/BothFlavorsCard.jsx';
import SplitLines from '../components/SplitLines.jsx';
import { getFlavor, otherFlavor } from '../data/flavors.js';
import { copy } from '../data/copy.js';
import { useNavTone } from '../hooks/useNavTone.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { duration, ease } from '../motion.js';
import NotFound from './NotFound.jsx';

// Only verified attributes are shown (format, cap color, serving suggestion); unknown ones are hidden.
const ATTRS = ['format', 'cap', 'serve'];

function FlavorPage({ flavor }) {
  const reduce = useReducedMotion();
  useNavTone('dark');
  usePageTitle(`${flavor.name} — Hipz`);
  const other = otherFlavor(flavor.slug);
  const attrs = ATTRS.filter((k) => flavor.attributes?.[k]);

  return (
    <FlavorTheme flavor={flavor} className="contents">
      <section
        className="relative min-h-[88svh] overflow-hidden bg-flavor"
        aria-label={flavor.name}
      >
        <m.div
          key={flavor.slug}
          className="absolute inset-0"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: duration.base, ease }}
        >
          <FlavorScene flavor={flavor} effects="low" priority />
        </m.div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[68%] bg-linear-to-t from-ink via-ink/80 to-transparent portrait:block"
        />
        <div className="relative z-10 mx-auto flex min-h-svh max-w-site flex-col justify-end gap-5 px-gutter pt-28 pb-10 text-ink portrait:text-paper lg:px-gutter-lg lg:pb-16 landscape:[&>*]:max-w-[min(34rem,46vw)]">
          <ul className="flex flex-wrap gap-2" aria-label="Facts">
            {attrs.map((k) => (
              <li key={k}>
                <Chip tone="paper">{flavor.attributes[k]}</Chip>
              </li>
            ))}
          </ul>
          <SplitLines
            immediate
            lines={[flavor.name]}
            delay={0.05}
            className="font-display text-display font-extrabold landscape:text-[clamp(3rem,6.2vw,6.5rem)]"
          />
          <Ar display className="self-start text-h2">
            {flavor.nameAr}
          </Ar>
          <p className="font-display text-h3 font-bold">{copy.flavors[flavor.slug].tagline}</p>
          <p className="max-w-[36ch] text-lead">{copy.flavors[flavor.slug].blurb}</p>
          <div className="flex flex-wrap gap-3">
            <Button to="/distributors" variant="primary">
              {copy.flavors.findIt.text}
            </Button>
            <Button to="/flavors" variant="ghost" arrow={false}>
              {copy.flavors.pageTitle.title}
            </Button>
          </div>
        </div>
      </section>

      {attrs.length > 0 && (
        <Section tone="paper">
          <div className="grid items-center gap-12 lg:grid-cols-[320px_1fr]">
            <Reveal className="mx-auto w-[260px]">
              <Bottle flavor={flavor} sizes="260px" />
            </Reveal>
            <div>
              <Reveal>
                <SectionHeader as="h2" title={copy.flavors.attributesTitle.title} />
              </Reveal>
              <dl className="mt-8 grid gap-5 sm:grid-cols-3">
                {attrs.map((k, i) => (
                  <Reveal
                    key={k}
                    delay={i * 0.1}
                    y={50}
                    className="rounded-card bg-white p-7 shadow-card"
                  >
                    <dt className="font-mono text-label uppercase opacity-70">
                      {copy.flavors.attrLabels[k]}
                    </dt>
                    <dd className="mt-3 font-display text-h3 font-bold">{flavor.attributes[k]}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </Section>
      )}

      <Section tone="paper" className="border-t border-ink/10">
        <Reveal>
          <SectionHeader as="h2" title={copy.flavors.more.title} />
        </Reveal>
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <Reveal y={70}>
            <FlavorCard flavor={other} tilt={-13} />
          </Reveal>
          <Reveal y={70} delay={0.1}>
            <BothFlavorsCard />
          </Reveal>
        </div>
      </Section>

      <Section tone="ink">
        <Reveal className="flex flex-col items-start gap-6">
          <SectionHeader as="h2" title={copy.flavors.closing.title}>
            {copy.flavors.closing.text}
          </SectionHeader>
          <Button to="/distributors" variant="lime">
            {copy.flavors.findIt.text}
          </Button>
        </Reveal>
      </Section>
    </FlavorTheme>
  );
}

export default function FlavorDetail() {
  const { slug } = useParams();
  const flavor = getFlavor(slug);
  if (!flavor) return <NotFound />;
  return <FlavorPage flavor={flavor} />;
}
