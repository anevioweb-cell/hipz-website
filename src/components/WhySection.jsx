import Ar from './Ar.jsx';
import Button from './Button.jsx';
import Reveal from './Reveal.jsx';
import SectionHeader from './SectionHeader.jsx';
import { copy } from '../data/copy.js';

// Why Hipz — structure measured on the reference "ritual" block: two columns (intro ≈ 662 px left,
// pillars ≈ 624 px right, 64 px gap, padding 120/32 px), each pillar a row with its number beside a
// 28 px title and 16 px text (padding 28/0, gap 28), pillars rise 50 px on reveal.
// Deviation on request: the reference numbers are small 14 px mono labels; ours are large display
// numerals. Only owner-confirmed statements are used (copy.why.pillars).
export default function WhySection() {
  const h = copy.why.header;
  const pillars = copy.why.pillars.items;
  return (
    <section id="why" className="bg-paper text-ink">
      <div className="mx-auto grid max-w-site gap-12 px-gutter py-[72px] lg:grid-cols-[minmax(0,662fr)_minmax(0,624fr)] lg:gap-16 lg:px-gutter-lg lg:py-[120px]">
        <div className="flex flex-col items-start gap-9">
          <SectionHeader eyebrow={h.eyebrow} lines={h.lines} />
          <Button to="/our-story" variant="primary">
            {h.cta}
          </Button>
        </div>
        <ol className="flex flex-col">
          {pillars.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              y={50}
              delay={i * 0.1}
              className="flex gap-7 border-t border-ink/15 py-7 last:border-b"
            >
              <span
                aria-hidden="true"
                className="w-[2.2ch] shrink-0 font-display text-[clamp(3rem,5vw,4.5rem)] leading-[0.85] font-extrabold text-ink"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-[1.75rem] leading-tight font-bold">{p.title}</h3>
                <p className="mt-2 text-body opacity-80">
                  {p.text}
                  {p.ar && (
                    <>
                      {' '}
                      <Ar>{p.ar}</Ar>
                    </>
                  )}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
