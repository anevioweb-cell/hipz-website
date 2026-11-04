import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, m, useAnimationControls, useReducedMotion } from 'motion/react';
import Logo from '../components/Logo.jsx';
import Button from '../components/Button.jsx';
import { navLinks } from './navLinks.js';
import { useNavToneValue } from '../hooks/useNavTone.js';
import { copy } from '../data/copy.js';
import { ease, duration, navDelay, navEase, stagger } from '../motion.js';

const FOCUSABLE = 'a[href], button:not([disabled])';

// Overlay navbar over the hero. Entrance per the reference measurement: translateY(−24px) + opacity 0,
// holds ~0.3 s, then ≈0.9 s decelerating. No cart (no shop): a simple "Where to buy" button.
// The mobile hamburger is a deliberate deviation (the reference has none): full-screen dialog,
// focus trap, ESC closes, scroll lock, reduced-motion safe.
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const entrance = useAnimationControls();
  const [navShown, setNavShown] = useState(false); // !important final state once focused
  const navTimer = useRef(0);
  useEffect(() => {
    if (reduce) return undefined;
    navTimer.current = setTimeout(
      () => entrance.start({ y: 0, opacity: 1 }, { duration: duration.nav, ease: navEase }),
      navDelay * 1000,
    );
    return () => clearTimeout(navTimer.current);
  }, [reduce, entrance]);
  const tone = useNavToneValue();
  const dark = tone === 'dark'; // bright area behind the navbar → ink text/logo
  const toggleRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const dialog = dialogRef.current;
    const toggle = toggleRef.current;
    dialog.querySelector(FOCUSABLE)?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [...dialog.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      toggle?.focus();
    };
  }, [open]);

  const linkCls = ({ isActive }) =>
    `rounded-pill px-4 py-2 font-medium transition-colors ${
      dark
        ? `hover:bg-ink/10 ${isActive ? 'bg-ink/10' : ''}`
        : `hover:bg-white/20 ${isActive ? 'bg-white/20' : ''}`
    }`;

  return (
    <m.header
      // offsets measured inside the reference frame: frame margin + 16/32/38 px sides, + 14/24/29 px top
      className={`absolute inset-x-0 top-0 z-40 px-6 pt-[22px] lg:px-11 lg:pt-9 min-[1200px]:px-[52px] min-[1200px]:pt-[43px] ${dark ? 'text-ink' : 'text-paper'}${navShown ? ' opacity-100! transform-none!' : ''}`}
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={entrance}
      // keyboard focus during the entrance jumps to the final state (never focus an invisible link)
      onFocusCapture={() => {
        clearTimeout(navTimer.current);
        entrance.stop();
        setNavShown(true);
      }}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-site items-center justify-between">
        <Logo tone={dark ? 'dark' : 'light'} />
        <div className="hidden items-center gap-2 md:flex">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} className={linkCls}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Button to="/distributors" variant={dark ? 'primary' : 'secondary'} className="ml-2">
            {copy.nav.buy.text}
          </Button>
        </div>
        <button
          ref={toggleRef}
          type="button"
          className={`grid size-11 place-items-center rounded-full md:hidden ${dark ? 'bg-ink/10' : 'bg-white/15'}`}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={copy.nav.menuOpen.text}
          onClick={() => setOpen(true)}
        >
          <span aria-hidden="true" className="text-xl leading-none">
            ☰
          </span>
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={dialogRef}
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-50 flex flex-col bg-ink px-gutter pt-6 pb-10 text-paper"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.base }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full bg-white/15"
                aria-label={copy.nav.menuClose.text}
                onClick={() => setOpen(false)}
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <ul className="mt-14 flex flex-col gap-4">
              {navLinks.map((l, i) => (
                <m.li
                  key={l.to}
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration.base, ease, delay: 0.1 + i * stagger }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-h2 font-extrabold"
                  >
                    {l.label}
                  </NavLink>
                </m.li>
              ))}
            </ul>
            <div className="mt-auto">
              <Button to="/distributors" variant="lime" onClick={() => setOpen(false)}>
                {copy.nav.buy.text}
              </Button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </m.header>
  );
}
