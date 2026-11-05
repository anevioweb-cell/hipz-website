import Marquee from '../motion/Marquee.jsx';
import Ar from '../ui/Ar.jsx';
import { copy } from '../../data/copy.js';
import { speeds } from '../../motion.js';

// Band under the hero: neutral words only (copy.ticker). Leftward at the measured 60 px/s, with a
// pause button (it moves longer than 5 s).
export default function Ticker({ className = '' }) {
  const items = copy.ticker.items.items;
  return (
    <Marquee
      className={`bg-brand-lime py-5 text-ink ${className}`}
      speed={speeds.ticker}
      label="Hipz"
    >
      {[0, 1, 2].map((rep) =>
        items.map((item, i) => (
          <span
            key={`${rep}-${i}`}
            className="flex items-center gap-8 pr-8 font-display text-h2 font-extrabold whitespace-nowrap"
          >
            {item.ar ? <Ar display>{item.ar}</Ar> : item.text}
            <span aria-hidden="true">✦</span>
          </span>
        )),
      )}
    </Marquee>
  );
}
