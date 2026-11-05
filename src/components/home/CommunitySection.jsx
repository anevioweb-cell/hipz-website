import Ar from '../ui/Ar.jsx';
import Button from '../ui/Button.jsx';
import { useState } from 'react';
import { useReducedMotion } from 'motion/react';
import Marquee, { MotionToggle } from '../motion/Marquee.jsx';
import Picture from '../ui/Picture.jsx';
import PopBlock from '../motion/PopBlock.jsx';
import SectionHeader from '../ui/SectionHeader.jsx';
import FlavorTheme from '../flavor/FlavorTheme.jsx';
import { communityPosts, fallbackTiles } from '../../data/community.js';
import { getFlavor } from '../../data/flavors.js';
import { SOCIAL_LINKS } from '../../data/site.js';
import { copy } from '../../data/copy.js';
import { speeds } from '../../motion.js';

// Community — replaces the reference's reviews marquee (yellow band, padding 110/0, gap 56 px, two rows
// moving in opposite directions at the measured 54 px/s, cards ≈ 456×276 px, radius 28 px).
// No reviews, customer names, quotes or other creators' posts. While `communityPosts` is empty the rows
// show designed tiles made only from our assets (bottles, flavor blocks, logo, brand words); the rows are
// decorative (aria-hidden). Real posts (with permission) render as links instead.
const HIPZ_INSTAGRAM = SOCIAL_LINKS.find((s) => s.id === 'hipz-instagram');
const tileBase =
  'relative flex h-[276px] shrink-0 items-center justify-center overflow-hidden rounded-card';

function Word({ index }) {
  const w = copy.community.words.items[index];
  return w.ar ? <Ar display>{w.ar}</Ar> : <span>{w.text}</span>;
}

function Tile({ tile }) {
  if (tile.kind === 'bottle') {
    const f = getFlavor(tile.flavor);
    return (
      <FlavorTheme flavor={f} className="contents">
        <div
          className={`${tileBase} w-[220px] ${tile.tone === 'paper' ? 'bg-paper' : 'bg-flavor'}`}
        >
          <Picture
            name={f.images.bottle}
            alt=""
            sizes="100px"
            imgClassName="h-[250px] w-auto rotate-6 drop-shadow-xl"
          />
        </div>
      </FlavorTheme>
    );
  }
  if (tile.kind === 'logo') {
    return (
      <div className={`${tileBase} w-[276px] bg-brand-lime`}>
        <img
          src="/logo-white.png"
          alt=""
          width="398"
          height="279"
          loading="lazy"
          className="h-[52px] w-auto"
        />
      </div>
    );
  }
  if (tile.kind === 'color') {
    const f = getFlavor(tile.flavor);
    return (
      <FlavorTheme flavor={f} className="contents">
        <div
          className={`${tileBase} w-[300px] bg-flavor font-display text-h2 font-extrabold text-ink`}
        >
          <Word index={tile.word} />
        </div>
      </FlavorTheme>
    );
  }
  const tones = {
    ink: 'bg-ink text-paper',
    lime: 'bg-brand-lime text-ink',
    paper: 'bg-paper text-ink',
  };
  return (
    <div
      className={`${tileBase} w-[360px] px-6 font-display text-h2 font-extrabold ${tones[tile.tone]}`}
    >
      <Word index={tile.word} />
    </div>
  );
}

function PostTile({ post }) {
  return (
    <a
      href={post.link}
      target="_blank"
      rel="noopener noreferrer"
      className={`${tileBase} w-[276px] bg-ink`}
      aria-label={`${post.handle} on Instagram (opens in a new tab)`}
    >
      <Picture
        name={post.image}
        alt={post.alt}
        sizes="276px"
        className="absolute inset-0"
        imgClassName="h-full w-full object-cover"
      />
    </a>
  );
}

export function CommunityRows({ posts = communityPosts }) {
  const hasPosts = posts.length > 0;
  const reduce = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const half = Math.ceil(fallbackTiles.length / 2);
  const rows = hasPosts
    ? [posts.filter((_, i) => i % 2 === 0), posts.filter((_, i) => i % 2 === 1)]
    : [fallbackTiles.slice(0, half), fallbackTiles.slice(half)];
  return (
    <div className="relative">
      <div
        className="flex flex-col gap-5"
        aria-hidden={hasPosts ? undefined : 'true'}
        data-testid="community-rows"
      >
        {rows.map((row, r) => (
          <Marquee
            key={r}
            speed={speeds.reviewRows}
            reverse={r === 1}
            label={hasPosts ? 'Community posts' : undefined}
            paused={paused}
            control={false}
          >
            {row.map((item, i) => (
              <div key={i} className="pr-5">
                {hasPosts ? <PostTile post={item} /> : <Tile tile={item} />}
              </div>
            ))}
          </Marquee>
        ))}
      </div>
      {/* one control for both rows, outside the aria-hidden wrapper (WCAG 2.2.2) */}
      {!reduce && (
        <MotionToggle
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          className="absolute right-[max(1rem,env(safe-area-inset-right))] -bottom-14"
        />
      )}
    </div>
  );
}

export default function CommunitySection() {
  const h = copy.community.header;
  return (
    <section id="community" className="overflow-hidden bg-lemon text-ink">
      <div className="mx-auto flex max-w-site flex-col items-start gap-6 px-gutter pt-[72px] lg:flex-row lg:items-end lg:justify-between lg:px-gutter-lg lg:pt-[110px]">
        <SectionHeader eyebrow={h.eyebrow} lines={h.lines}>
          {h.text}
        </SectionHeader>
        <Button
          href={HIPZ_INSTAGRAM.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${h.cta} (${h.label}, opens in a new tab)`}
          variant="primary"
        >
          {h.cta}
        </Button>
      </div>
      <PopBlock y={60} className="pt-10 pb-[72px] lg:pt-14 lg:pb-[110px]">
        <CommunityRows />
      </PopBlock>
    </section>
  );
}
