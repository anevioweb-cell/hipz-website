import { useParams } from 'react-router-dom';
import { m, useReducedMotion } from 'motion/react';
import Section from '../components/Section.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import PopBlock from '../components/PopBlock.jsx';
import Button from '../components/Button.jsx';
import Chip from '../components/Chip.jsx';
import Ar from '../components/Ar.jsx';
import Bottle from '../components/Bottle.jsx';
import FlavorScene from '../components/FlavorScene.jsx';
import FlavorTheme from '../components/FlavorTheme.jsx';
import FlavorCard from '../components/FlavorCard.jsx';
import BothFlavorsCard from '../components/BothFlavorsCard.jsx';
import { getFlavor, otherFlavor } from '../data/flavors.js';
import { copy } from '../data/copy.js';
import { useNavTone } from '../hooks/useNavTone.js';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { detailHero, duration, ease } from '../motion.js';
import NotFound from './NotFound.jsx';
import { hideHeroShell } from '../lib/heroShell.js';

// Only verified attributes are shown (format, cap color, serving suggestion); unknown ones are hidden.
const ATTRS = ['format', 'cap', 'serve'];

function FlavorPage({ flavor }) {
  const reduce = useReducedMotion();
  useNavTone('dark');
  usePageTitle(`${flavor.name} — Hipz`);
  const other = otherFlavor(flavor.slug);
  const attrs = ATTRS.filter((k) => flavor.attributes?.[k]);
  // "The basics": verified attributes + the confirmed volume (written as text, never on an image)
  const basics = [
    ...attrs.map((k) => ({
      key: k,
      label: copy.flavors.attrLabels[k],
      value: flavor.attributes[k],
    })),
    ...(flavor.volume
      ? [
          {
            key: 'size',
            label: copy.flavors.attrLabels.size,
            value: `${flavor.volume.amount} ${flavor.volume.unit}`,
          },
        ]
      : []),
  ];

  return (
    <FlavorTheme flavor={flavor} className="contents">
      {/* same measured inset frame as the home hero (the reference detail page also uses 14 px / 32 px
          rounded inset blocks); min-height instead of a fixed height so the text never clips */}
      <div className="hero-frame-wrap">
        <section className="detail-frame relative overflow-hidden" aria-label={flavor.name}>
          <m.div
            key={flavor.slug}
            className="absolute inset-0"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: duration.base, ease }}
          >
            <FlavorScene flavor={flavor} effects="low" priority onImageLoad={hideHeroShell} />
          </m.div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[64%] bg-linear-to-r from-paper/65 via-paper/40 to-transparent landscape:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[68%] bg-linear-to-t from-ink via-ink/80 to-transparent portrait:block"
          />
          <div className="relative z-10 mx-auto detail-frame-content flex max-w-site flex-col justify-end gap-5 px-gutter pt-28 pb-10 text-ink portrait:text-paper lg:px-gutter-lg lg:pb-16 landscape:[&>*]:max-w-[min(34rem,46vw)]">
            {/* measured detail-page entrance (docs/MOTION_SPEC.md): a cascade of blocks after load —
                heading +0.16 s (y 40), then text blocks +0.26…0.47 s (y 30), chips pop +0.63 s */}
            <ul className="flex flex-wrap gap-2" aria-label="Facts">
              {attrs.map((k, i) => (
                <PopBlock as="li" key={k} variant="badge" delay={detailHero.chips + i * 0.15}>
                  <Chip tone="paper">{flavor.attributes[k]}</Chip>
                </PopBlock>
              ))}
            </ul>
            <PopBlock y={40} delay={detailHero.heading}>
              <h1 className="font-display text-display font-extrabold landscape:text-[clamp(3rem,6.2vw,6.5rem)]">
                {flavor.name}
              </h1>
            </PopBlock>
            <PopBlock y={30} delay={detailHero.blocks[0]} className="self-start">
              <Ar display className="text-h2">
                {flavor.nameAr}
              </Ar>
            </PopBlock>
            <PopBlock y={30} delay={detailHero.blocks[1]}>
              <p className="font-display text-h3 font-bold">{copy.flavors[flavor.slug].tagline}</p>
            </PopBlock>
            <PopBlock y={30} delay={detailHero.blocks[2]}>
              <p className="max-w-[36ch] text-lead">{copy.flavors[flavor.slug].blurb}</p>
            </PopBlock>
            <PopBlock y={30} delay={detailHero.blocks[3]} className="flex flex-wrap gap-3">
              <Button to="/distributors" variant="primary">
                {copy.flavors.findIt.text}
              </Button>
              <Button to="/flavors" variant="ghost" arrow={false}>
                {copy.flavors.pageTitle.title}
              </Button>
            </PopBlock>
          </div>
        </section>
      </div>

      {basics.length > 0 && (
        <Section tone="paper">
          <div className="grid items-center gap-12 lg:grid-cols-[320px_1fr]">
            <PopBlock className="mx-auto flex justify-center">
              <Bottle
                flavor={flavor}
                sizes="200px"
                imgClassName="h-[460px] w-auto drop-shadow-2xl"
              />
            </PopBlock>
            <div>
              <PopBlock>
                <SectionHeader as="h2" title={copy.flavors.attributesTitle.title} />
              </PopBlock>
              <dl className="mt-8 grid gap-5 sm:grid-cols-2">
                {basics.map((b, i) => (
                  <PopBlock
                    key={b.key}
                    delay={i * 0.1}
                    y={50}
                    className="rounded-card bg-white p-7 shadow-card"
                  >
                    <dt className="font-mono text-label uppercase opacity-70">{b.label}</dt>
                    <dd className="mt-3 font-display text-h3 font-bold">{b.value}</dd>
                  </PopBlock>
                ))}
              </dl>
            </div>
          </div>
        </Section>
      )}

      <Section tone="paper" className="border-t border-ink/10">
        <PopBlock>
          <SectionHeader as="h2" title={copy.flavors.more.title} />
        </PopBlock>
        <div className="mt-10 flex flex-wrap justify-center gap-5">
          <PopBlock y={70}>
            <FlavorCard flavor={other} tilt={-13} />
          </PopBlock>
          <PopBlock y={70} delay={0.1}>
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
    </FlavorTheme>
  );
}

export default function FlavorDetail() {
  const { slug } = useParams();
  const flavor = getFlavor(slug);
  if (!flavor) return <NotFound />;
  return <FlavorPage flavor={flavor} />;
}
