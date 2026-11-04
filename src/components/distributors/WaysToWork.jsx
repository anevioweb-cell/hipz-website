import SectionHeader from '../SectionHeader.jsx';
import Reveal from '../Reveal.jsx';
import { setRequestType } from '../../lib/requestType.js';
import { copy } from '../../data/copy.js';

// "Ways to work with Hipz" — list rows in the measured pillar style (border-top rows, 28 px padding/gap,
// rise 50 px on reveal). Each row: who it is for + a "Get in touch" anchor that pre-selects the type.
export default function WaysToWork() {
  const w = copy.distributors.ways;
  return (
    <section id="ways" className="bg-paper text-ink">
      <div className="mx-auto grid max-w-site gap-12 px-gutter py-[72px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-gutter-lg lg:py-[120px]">
        <SectionHeader eyebrow={w.eyebrow} lines={w.lines} />
        <ul className="flex flex-col">
          {w.items.map((item, i) => (
            <Reveal
              as="li"
              key={item.id}
              y={50}
              delay={i * 0.08}
              className="flex flex-col gap-4 border-t border-ink/15 py-7 last:border-b sm:flex-row sm:items-center sm:justify-between sm:gap-7"
            >
              <div>
                <h3 className="font-display text-[1.75rem] leading-tight font-bold">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-[44ch] opacity-80">{item.text}</p>
              </div>
              <a
                href="#request"
                onClick={() => setRequestType(item.id)}
                aria-label={`${w.cta}: ${item.title}`}
                className="inline-flex min-h-11 shrink-0 items-center gap-3 self-start rounded-pill bg-ink py-1.5 pr-1.5 pl-5 font-medium text-paper hover:bg-ink-soft sm:self-auto"
              >
                {w.cta}
                <span
                  aria-hidden="true"
                  className="grid size-9 place-items-center rounded-full bg-brand-lime text-ink"
                >
                  ↓
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
