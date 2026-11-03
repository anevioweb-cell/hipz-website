import { Link } from 'react-router-dom';
import Bottle from './Bottle.jsx';
import Button from './Button.jsx';
import Ar from './Ar.jsx';
import FlavorTheme from './FlavorTheme.jsx';
import { copy } from '../data/copy.js';

const base =
  'group relative flex h-[520px] w-[78vw] max-w-[300px] flex-col items-center overflow-hidden rounded-card bg-white pt-9 pb-8 text-ink shadow-card lg:h-[618px] lg:w-[319px] lg:max-w-none';

// Card size follows the reference (319×618 desktop, 269–300 wide on phones). Hover (proposal, the
// reference only micro-settles): bottle lifts and tilts, blob turns — CSS transform only, off under
// reduced motion. Whole card links to the flavor; "Find it" goes to /distributors (no cart/prices).
export default function FlavorCard({ flavor, tilt = 12 }) {
  return (
    <FlavorTheme flavor={flavor} className="contents">
      <article className={base}>
        <div className="relative h-[297px] w-[277px] shrink-0">
          <div
            aria-hidden="true"
            className="blob absolute inset-4 bg-flavor transition-transform duration-(--duration-slow) ease-(--ease-spring) group-hover:scale-105 motion-reduce:transition-none"
            style={{ rotate: `${tilt}deg` }}
          />
          <div className="absolute inset-0 flex items-center justify-center transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover:-translate-y-3 group-hover:-rotate-3 motion-reduce:transition-none">
            {/* full-bottle cutout, sized by height like the reference can (≈ 347 px over a 297 px blob) */}
            <Bottle
              flavor={flavor}
              sizes="140px"
              imgClassName="h-[330px] w-auto drop-shadow-xl lg:h-[347px]"
            />
          </div>
        </div>
        <div className="mt-6 flex flex-1 flex-col items-center gap-2 px-6 text-center">
          <h3 className="font-display text-h2 leading-none font-extrabold">
            <Link
              to={`/flavors/${flavor.slug}`}
              className="after:absolute after:inset-0 after:content-['']"
            >
              {flavor.name}
            </Link>
          </h3>
          <Ar display className="text-h3">
            {flavor.nameAr}
          </Ar>
          <p className="mt-1 max-w-[24ch] opacity-80">{copy.flavors[flavor.slug].tagline}</p>
          <Button to="/distributors" variant="primary" className="relative z-10 mt-auto">
            {copy.flavors.findIt.text}
          </Button>
        </div>
      </article>
    </FlavorTheme>
  );
}
