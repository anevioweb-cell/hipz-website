import { Link } from 'react-router-dom';
import Ar from '../components/ui/Ar.jsx';
import Button from '../components/ui/Button.jsx';
import Parallax from '../components/motion/Parallax.jsx';
import Picture from '../components/ui/Picture.jsx';
import PopBlock from '../components/motion/PopBlock.jsx';
import PopText from '../components/motion/PopText.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { soloPhotos, story as realStory, storySections, visibleOptional } from '../data/story.js';
import { creatorPhotos } from '../data/creators.js';
import { flavors } from '../data/flavors.js';
import { SITE, SOCIAL_LINKS } from '../data/site.js';
import { copy } from '../data/copy.js';
import { cardStagger, heroText } from '../motion.js';
import { STORY_HERO } from '../lib/storyHeroClasses.js';
import { hideHeroShell } from '../lib/heroShell.js';
import { useNavTone } from '../hooks/useNavTone.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

// /our-story — the reference has no About/Story page (checked: its routes are home, four flavor pages
// and 404), so this page is designed from its measured language: the rounded inset frame, type scale,
// spacing and the Phase 6 motion (character pop, measured block rises).
// Content: ONLY confirmed facts (src/data/story.js) and the selected creator photos
// (src/data/creators.js). Optional blocks render only when story.js has confirmed data. No numbers.
const realPhotos = creatorPhotos.filter((c) => c.selected);
const pos = (p) => `${Math.round(p.focal.x * 100)}% ${Math.round(p.focal.y * 100)}%`;

function ExternalIcon() {
  return (
    <svg aria-hidden="true" width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3 9l6-6M4 3h5v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function SocialLinks({ tone = 'paper', className = '' }) {
  const cls =
    tone === 'paper'
      ? 'border-paper/40 hover:bg-paper hover:text-ink'
      : 'border-ink/30 hover:bg-ink hover:text-paper';
  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {SOCIAL_LINKS.map((s) => (
        <li key={s.id}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            // the accessible name starts with the visible text (WCAG 2.5.3)
            aria-label={`${s.short} (opens in a new tab)`}
            className={`inline-flex min-h-11 items-center gap-2 rounded-pill border-2 px-5 py-2 font-medium transition-colors ${cls}`}
          >
            {s.short}
            <ExternalIcon />
          </a>
        </li>
      ))}
    </ul>
  );
}

// Smile arc echoing the logo's smile (our own SVG).
function Smile({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 70" className={className} fill="none">
      <path
        d="M12 14c32 44 184 44 216 0"
        stroke="currentColor"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TILTS = [-2, 3, -1.5, 2.5, -3];
const pct = (f) => `${Math.round(f.x * 100)}% ${Math.round(f.y * 100)}%`;

// A zoomed, art-directed crop of a photo: scaled around its focal point inside the tile (transform only),
// with a higher-resolution source chosen through `sizes`.
function CropImage({ photo, crop, base }) {
  const zoom = Math.max(1, crop.zoom);
  const sizes = base
    .split(', ')
    .map((part) => part.replace(/(\d+vw)$/, (vw) => `calc(${vw} * ${zoom})`))
    .join(', ');
  return (
    <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
      <div
        className="h-full w-full"
        style={{ transform: `scale(${zoom})`, transformOrigin: pct(crop.focal) }}
      >
        <Picture
          name={photo.image}
          alt={crop.alt}
          sizes={sizes}
          className="block h-full w-full"
          imgClassName="h-full w-full object-cover"
          style={{ objectPosition: pct(crop.focal) }}
        />
      </div>
    </div>
  );
}

export default function OurStory({ data = realStory, photos = realPhotos }) {
  useNavTone('dark');
  usePageTitle(`${copy.story.pageTitle.title} — Hipz`);
  const t = copy.story;
  const sections = new Set(storySections(data, photos));
  const opt = visibleOptional(data);
  const hero = photos.find((p) => p.use === 'hero');
  // solo photos interleaved person by person (Kada, Miloud, …), at most 4 — used only when balanced
  const byPerson = ['kada', 'miloud'].map((who) => soloPhotos(photos, who));
  const solos = [];
  for (let i = 0; solos.length < 4 && i < 4; i++)
    for (const list of byPerson) if (list[i] && solos.length < 4) solos.push(list[i]);
  // collage = art-directed crops of the duo photos (different from the hero and gallery crops)
  const collage = photos
    .flatMap((photo) =>
      (photo.crops || []).filter((c) => c.use === 'collage').map((crop) => ({ photo, crop })),
    )
    .sort((a, b) => (a.crop.order ?? 9) - (b.crop.order ?? 9));
  const bottling = photos.filter((p) => p.use === 'bottling');
  const [lemon, peach] = flavors;

  return (
    <>
      {/* 1. framed hero */}
      <div className="hero-frame-wrap">
        <section
          className="detail-frame relative overflow-hidden bg-peach-soft text-ink portrait:bg-ink"
          aria-labelledby="story-title"
        >
          {hero && (
            <>
              <div className={STORY_HERO.photoReact}>
                <Picture
                  name={hero.image}
                  alt={hero.alt}
                  sizes={STORY_HERO.sizes}
                  priority
                  onLoad={hideHeroShell}
                  imgClassName={STORY_HERO.img}
                  style={{ objectPosition: pos(hero) }}
                />
              </div>
              {/* landscape: blend the photo edge into the peach ground; portrait: dark scrim for the text */}
              <div aria-hidden="true" className={STORY_HERO.blend} />
              <div aria-hidden="true" className={STORY_HERO.scrim} />
              <div aria-hidden="true" className={STORY_HERO.topFade} />
            </>
          )}
          <div className="detail-frame-content relative z-10 mx-auto flex max-w-site flex-col justify-end gap-5 px-gutter pt-28 pb-10 portrait:text-paper lg:px-gutter-lg lg:pb-16 landscape:[&>*]:max-w-[min(30rem,34vw)]">
            <PopBlock y={30} immediate delay={heroText.groupDelay} className="flex flex-col gap-5">
              <p className="font-mono text-label uppercase">
                {t.hero.eyebrow} · <Ar>{t.hero.ar}</Ar>
              </p>
              <PopText
                as="h1"
                id="story-title"
                trigger="load"
                lines={t.hero.lines}
                delay={heroText.delay}
                className="font-display text-display font-extrabold landscape:text-[clamp(3rem,5.4vw,6rem)]"
              />
              <PopText
                as="p"
                variant="soft"
                trigger="load"
                delay={heroText.leadDelay}
                text={t.hero.text}
                className="max-w-[34ch] text-lead"
              />
            </PopBlock>
            {hero && (
              <p className="text-sm font-medium opacity-80" data-testid="hero-caption">
                {hero.caption}
              </p>
            )}
            <PopBlock y={10} immediate delay={heroText.buttonDelay}>
              <Button href="#duo" variant="flavor">
                {t.hero.cta}
              </Button>
            </PopBlock>
          </div>
        </section>
      </div>

      {/* z-10: the sections slide over the static pre-JS frame */}
      <div className="relative z-10 bg-paper">
        {/* 2. the duo band */}
        <section id="duo" className="scroll-mt-4 bg-ink text-paper">
          <div className="mx-auto grid max-w-site gap-14 px-gutter py-section lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-gutter-lg lg:py-section-lg">
            <div className="flex flex-col gap-8 self-center">
              <SectionHeader eyebrow={t.duo.eyebrow} lines={t.duo.lines}>
                {t.duo.text}
              </SectionHeader>
              <PopBlock y={30}>
                <Ar display className="text-h3">
                  {t.duo.ar}
                </Ar>
                <p className="mt-6 font-mono text-label uppercase opacity-70">{t.duo.follow}</p>
                <SocialLinks className="mt-3" />
              </PopBlock>
            </div>
            {sections.has('collage') && (
              <ul
                className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10"
                data-testid="collage"
                aria-label={t.duo.eyebrow}
              >
                {collage.map(({ photo, crop }, i) => (
                  <PopBlock
                    as="li"
                    key={`${photo.id}-${i}`}
                    y={70}
                    delay={i * cardStagger}
                    className={i === 0 ? 'col-span-2' : i === 2 ? 'mt-10 sm:mt-16' : ''}
                  >
                    <Parallax mode="element" distance={[10, 22, 30][i % 3]}>
                      <figure
                        className={`group relative rotate-(--tilt) overflow-hidden rounded-inset-sm bg-ink-soft shadow-pop transition-transform duration-300 ease-out hover:scale-[1.03] hover:rotate-0 ${i === 0 ? 'aspect-[16/11]' : 'aspect-[4/5]'}`}
                        style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` }}
                      >
                        <CropImage
                          photo={photo}
                          crop={crop}
                          base={
                            i === 0
                              ? '(min-width: 1024px) 52vw, 92vw'
                              : '(min-width: 1024px) 26vw, 46vw'
                          }
                        />
                        <figcaption className="absolute bottom-3 left-3 rounded-pill bg-paper px-3 py-1 text-sm font-medium text-ink">
                          {crop.caption}
                        </figcaption>
                      </figure>
                    </Parallax>
                  </PopBlock>
                ))}
                {/* designed tile (no photo): keeps the collage complete without solo photos */}
                <PopBlock as="li" y={70} delay={collage.length * cardStagger} aria-hidden="true">
                  <Parallax mode="element" distance={30}>
                    <div
                      className="flex aspect-[4/5] rotate-(--tilt) flex-col items-center justify-center gap-2 rounded-inset-sm bg-brand-lime text-ink shadow-pop transition-transform duration-300 ease-out hover:scale-[1.03] hover:rotate-0"
                      style={{ '--tilt': `${TILTS[(collage.length + 1) % TILTS.length]}deg` }}
                    >
                      <Ar display className="text-h2">
                        {SITE.nameAr}
                      </Ar>
                      <Smile className="w-28 text-ink" />
                    </div>
                  </Parallax>
                </PopBlock>
              </ul>
            )}
          </div>
        </section>

        {/* solo photos: only when BOTH creators have one (never one-sided; none exist today) */}
        {sections.has('solo') && (
          <section className="bg-ink pb-section text-paper" data-testid="solo">
            <ul className="mx-auto grid max-w-site grid-cols-2 gap-4 px-gutter sm:gap-6 lg:grid-cols-4 lg:px-gutter-lg">
              {solos.map((p, i) => (
                <PopBlock as="li" key={p.id} y={70} delay={i * cardStagger}>
                  <figure className="relative overflow-hidden rounded-inset-sm">
                    <Picture
                      name={p.image}
                      alt={p.alt}
                      sizes="(min-width: 1024px) 22vw, 46vw"
                      imgClassName="aspect-[4/5] h-auto w-full object-cover"
                      style={{ objectPosition: pos(p) }}
                    />
                    <figcaption className="absolute bottom-3 left-3 rounded-pill bg-paper px-3 py-1 text-sm font-medium text-ink">
                      {p.caption}
                    </figcaption>
                  </figure>
                </PopBlock>
              ))}
            </ul>
          </section>
        )}

        {/* 3. at the bottling line */}
        {sections.has('bottling') && (
          <section className="bg-paper text-ink" aria-labelledby="bottling-title">
            <div className="mx-auto max-w-site px-gutter py-section lg:px-gutter-lg lg:py-section-lg">
              <div id="bottling-title">
                <SectionHeader eyebrow={t.bottling.eyebrow} lines={t.bottling.lines}>
                  {t.bottling.text}
                </SectionHeader>
              </div>
              {/* on phones a horizontal scroller: a focusable region so it can be scrolled by keyboard
                  (axe scrollable-region-focusable; same pattern as the flavor carousel) */}
              <div
                role="region"
                // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                aria-label={t.bottling.eyebrow}
                className="-mx-gutter mt-12 snap-x snap-mandatory overflow-x-auto px-gutter pb-4 lg:mx-0 lg:overflow-visible lg:px-0"
              >
                <ul className="flex gap-5 lg:grid lg:grid-cols-2 lg:gap-8">
                  {bottling.map((p, i) => (
                    <PopBlock
                      as="li"
                      key={p.id}
                      y={70}
                      delay={i * cardStagger}
                      className="w-[82%] shrink-0 snap-start sm:w-[60%] lg:w-auto"
                    >
                      <figure>
                        <div className="overflow-hidden rounded-inset-sm lg:rounded-inset">
                          <Picture
                            name={p.image}
                            alt={p.alt}
                            sizes="(min-width: 1024px) 44vw, 82vw"
                            imgClassName="aspect-[4/5] h-auto w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
                            style={{ objectPosition: pos(p) }}
                          />
                        </div>
                        <figcaption className="mt-4 max-w-[46ch] text-body opacity-80">
                          {p.caption}
                        </figcaption>
                      </figure>
                    </PopBlock>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 4. two flavors, one smile */}
        {sections.has('flavors') && (
          <section className="bg-paper text-ink" aria-labelledby="flavors-title">
            <div className="hero-frame-wrap">
              <div className="relative grid items-center gap-8 overflow-hidden rounded-[var(--frame-r)] bg-[linear-gradient(100deg,var(--color-lemon)_0%,var(--color-lemon)_50%,var(--color-peach)_50%,var(--color-peach)_100%)] px-5 py-14 lg:grid-cols-2 lg:px-14">
                <div className="flex flex-col items-start gap-6" id="flavors-title">
                  <SectionHeader eyebrow={t.flavors.eyebrow} lines={t.flavors.lines} />
                  <PopBlock y={30} className="flex flex-col items-start gap-6">
                    <Ar display className="text-h3">
                      {t.flavors.ar}
                    </Ar>
                    <Button to="/flavors" variant="primary">
                      {t.flavors.cta}
                    </Button>
                  </PopBlock>
                </div>
                <PopBlock y={120} scale={0.85}>
                  <Link
                    to="/flavors"
                    aria-label={`${t.flavors.cta}: ${lemon.name} and ${peach.name}`}
                    className="group flex flex-col items-center"
                  >
                    <span className="flex items-end justify-center gap-2">
                      <Picture
                        name={lemon.images.bottle}
                        alt=""
                        sizes="160px"
                        imgClassName="h-[300px] w-auto -rotate-6 drop-shadow-2xl transition-transform duration-300 group-hover:-rotate-12 lg:h-[420px]"
                      />
                      <Picture
                        name={peach.images.bottle}
                        alt=""
                        sizes="130px"
                        imgClassName="h-[290px] w-auto rotate-6 drop-shadow-2xl transition-transform duration-300 group-hover:rotate-12 lg:h-[410px]"
                      />
                    </span>
                    <Smile className="-mt-4 w-44 text-paper lg:w-60" />
                  </Link>
                </PopBlock>
              </div>
            </div>
          </section>
        )}

        {/* 5. optional blocks — only with confirmed data */}
        {sections.has('origin') && (
          <section className="bg-paper text-ink" data-testid="story-origin">
            <div className="mx-auto max-w-site px-gutter py-section lg:px-gutter-lg">
              <SectionHeader eyebrow={t.origin.eyebrow} title={opt.originNote?.en ?? ''} />
              {opt.originNote?.ar && (
                <PopBlock y={30} className="mt-4">
                  <Ar display className="text-h3">
                    {opt.originNote.ar}
                  </Ar>
                </PopBlock>
              )}
              {opt.foundedYear && (
                <PopBlock y={30} className="mt-6 font-mono text-label uppercase">
                  {t.origin.foundedLabel} {opt.foundedYear}
                </PopBlock>
              )}
            </div>
          </section>
        )}

        {sections.has('milestones') && (
          <section className="bg-paper text-ink" data-testid="story-milestones">
            <div className="mx-auto max-w-site border-t border-ink/10 px-gutter py-section lg:px-gutter-lg">
              <SectionHeader eyebrow={t.milestones.eyebrow} lines={t.milestones.lines} />
              <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {opt.milestones.map((m, i) => (
                  <PopBlock
                    as="li"
                    key={`${m.date}-${m.label}`}
                    y={50}
                    delay={i * cardStagger}
                    className="rounded-card bg-white p-6 shadow-card"
                  >
                    <p className="font-mono text-label uppercase opacity-70">{m.date}</p>
                    <p className="mt-2 font-display text-h3 font-bold" dir="auto">
                      {m.label}
                    </p>
                    {m.note && (
                      <p className="mt-2 opacity-80" dir="auto">
                        {m.note}
                      </p>
                    )}
                  </PopBlock>
                ))}
              </ol>
            </div>
          </section>
        )}

        {sections.has('quotes') && (
          <section className="bg-ink text-paper" data-testid="story-quotes">
            <div className="mx-auto max-w-site px-gutter py-section lg:px-gutter-lg">
              <SectionHeader title={t.quotes.eyebrow} />
              <div className="mt-10 grid gap-8 lg:grid-cols-2">
                {opt.quotes.map((q, i) => (
                  <PopBlock key={q.original} y={50} delay={i * cardStagger}>
                    <figure className="rounded-card border-2 border-paper/20 p-8">
                      <blockquote
                        lang={q.lang}
                        dir="auto"
                        className="font-display text-h3 font-bold"
                      >
                        {q.original}
                      </blockquote>
                      <p className="mt-4 text-sm">
                        <span className="font-mono text-label uppercase opacity-70">
                          {t.quotes.translation}:
                        </span>{' '}
                        <span lang="en">{q.translation}</span>
                      </p>
                      <figcaption className="mt-4 font-medium">— {q.by}</figcaption>
                    </figure>
                  </PopBlock>
                ))}
              </div>
            </div>
          </section>
        )}

        {sections.has('plant') && (
          <section className="bg-paper text-ink" data-testid="story-plant">
            <div className="mx-auto max-w-site px-gutter py-section lg:px-gutter-lg">
              <SectionHeader
                eyebrow={t.plant.eyebrow}
                title={[opt.plant.name, opt.plant.city].filter(Boolean).join(' · ')}
              />
            </div>
          </section>
        )}

        {/* 6. closing band */}
        <section className="bg-paper text-ink">
          <div className="hero-frame-wrap">
            <div className="flex flex-col items-start gap-8 rounded-[var(--frame-r)] bg-brand-lime px-5 py-14 lg:flex-row lg:items-end lg:justify-between lg:px-14 lg:py-20">
              <div className="flex flex-col items-start gap-6">
                <SectionHeader lines={t.closing.lines} />
                <PopBlock y={10}>
                  <Button to="/distributors" variant="primary">
                    {t.closing.cta}
                  </Button>
                </PopBlock>
              </div>
              <PopBlock y={30}>
                <p className="font-mono text-label uppercase">{t.closing.follow}</p>
                <SocialLinks tone="ink" className="mt-3" />
              </PopBlock>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
