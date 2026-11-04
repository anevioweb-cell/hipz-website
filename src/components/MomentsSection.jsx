import Ar from './Ar.jsx';
import Picture from './Picture.jsx';
import PopBlock from './PopBlock.jsx';
import SectionHeader from './SectionHeader.jsx';
import FlavorTheme from './FlavorTheme.jsx';
import MomentIcon from './icons/MomentIcon.jsx';
import { moments } from '../data/moments.js';
import { getFlavor } from '../data/flavors.js';
import { copy } from '../data/copy.js';

// Moments — structure measured on the reference: dark band (padding 82/20/78 px), large centered
// heading + subtitle, then ONE rounded container (radius 30 px) holding 4 cards in a grid separated by
// 2 px lines (4 columns × 310 px on desktop, stacked 180 px rows on phones); cards rise 80 px on reveal.
// Our cards: flavor-colored blocks, our own SVG icon, display title + Arabic word, a bottle peeking in.
// No people imagery: `image` (data) is an optional slot for real photos later.
// The cards are not links, so they carry no focus stop and no pointer cursor; the hover only moves the
// decorative bottle and icon (proposal — the reference card hover was not measurable).
function MomentCard({ moment }) {
  const flavor = getFlavor(moment.flavor);
  const c = copy.moments[moment.id];
  return (
    <FlavorTheme flavor={flavor} className="flex flex-1">
      <article className="group relative flex min-h-[220px] flex-1 flex-col overflow-hidden bg-flavor p-6 text-ink lg:min-h-[340px] lg:p-8">
        {moment.image ? (
          <Picture
            name={moment.image}
            alt=""
            sizes="(min-width: 1024px) 25vw, 100vw"
            className="absolute inset-0"
            imgClassName="h-full w-full object-cover"
          />
        ) : (
          <>
            <MomentIcon
              name={moment.icon}
              className="relative size-12 transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover:-rotate-12 motion-reduce:transition-none"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -bottom-16 rotate-12 transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover:-translate-y-3 group-hover:rotate-6 motion-reduce:transition-none lg:-bottom-20"
            >
              <Picture
                name={flavor.images.bottle}
                alt=""
                sizes="110px"
                imgClassName="h-[230px] w-auto drop-shadow-xl lg:h-[270px]"
              />
            </div>
          </>
        )}
        <div className="relative mt-auto max-w-[70%] pt-6">
          <h3 className="font-display text-[2rem] leading-none font-extrabold">{c.title}</h3>
          <Ar display className="mt-1 text-h3">
            {c.ar}
          </Ar>
          <p className="mt-3 text-[0.9375rem] leading-snug">{c.text}</p>
        </div>
      </article>
    </FlavorTheme>
  );
}

export default function MomentsSection() {
  const h = copy.moments.header;
  return (
    <section id="moments" className="bg-ink text-paper">
      <div className="mx-auto max-w-site px-gutter pt-[82px] pb-[78px] lg:px-gutter-lg">
        <SectionHeader
          eyebrow={h.eyebrow}
          lines={h.lines}
          align="center"
          className="[&_h2]:max-w-none"
        >
          {h.text}
        </SectionHeader>
        <PopBlock y={80} className="mt-12 lg:mt-14">
          <ul className="grid gap-[2px] overflow-hidden rounded-[30px] bg-brand-lime sm:grid-cols-2 lg:grid-cols-4">
            {moments.map((m) => (
              <li key={m.id} className="flex">
                <MomentCard moment={m} />
              </li>
            ))}
          </ul>
        </PopBlock>
      </div>
    </section>
  );
}
