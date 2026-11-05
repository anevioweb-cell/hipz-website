import { Link } from 'react-router-dom';
import Bottle from './Bottle.jsx';
import Button from '../ui/Button.jsx';
import { flavors } from '../../data/flavors.js';
import { copy } from '../../data/copy.js';

const base =
  'group relative flex h-[520px] w-[78vw] max-w-[300px] flex-col items-center overflow-hidden rounded-card bg-linear-to-br from-lemon to-peach pt-9 pb-8 text-ink shadow-card lg:h-[618px] lg:w-[319px] lg:max-w-none';

// "Both flavors" tile (replaces the reference's variety pack): Lemon and Peach bottles together.
// No pack, quantity or price is implied. Links to /flavors.
export default function BothFlavorsCard() {
  const [lemon, peach] = flavors;
  return (
    <article className={base}>
      <div className="relative h-[297px] w-[277px] shrink-0">
        <div className="absolute bottom-0 left-6 -rotate-6 transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover:-translate-y-3 group-hover:-rotate-12 motion-reduce:transition-none">
          <Bottle flavor={lemon} sizes="120px" imgClassName="h-[290px] w-auto drop-shadow-xl" />
        </div>
        <div className="absolute right-6 bottom-0 rotate-6 transition-transform duration-(--duration-base) ease-(--ease-spring) group-hover:-translate-y-3 group-hover:rotate-12 motion-reduce:transition-none">
          <Bottle flavor={peach} sizes="120px" imgClassName="h-[290px] w-auto drop-shadow-xl" />
        </div>
      </div>
      <div className="mt-6 flex flex-1 flex-col items-center gap-2 px-6 text-center">
        <h3 className="font-display text-h2 leading-none font-extrabold">
          <Link to="/flavors" className="after:absolute after:inset-0 after:content-['']">
            {copy.flavors.both.name}
          </Link>
        </h3>
        <p className="mt-1 max-w-[24ch] opacity-90">{copy.flavors.both.tagline}</p>
        <Button to="/distributors" variant="primary" className="relative z-10 mt-auto">
          {copy.flavors.findIt.text}
        </Button>
      </div>
    </article>
  );
}
