import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Logo from '../components/Logo.jsx';
import { navLinks } from './navLinks.js';
import { ease, duration, stagger } from '../motion.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const linkCls = ({ isActive }) =>
    `rounded-pill px-4 py-2 font-medium transition-colors hover:bg-white/20 ${isActive ? 'bg-white/20' : ''}`;

  return (
    <motion.header
      className="absolute inset-x-0 top-0 z-40 px-gutter pt-6 text-paper lg:px-gutter-lg"
      initial={reduce ? false : { y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: duration.slow, ease, delay: 0.2 }}
    >
      <nav aria-label="Main" className="mx-auto flex max-w-site items-center justify-between">
        <Logo />
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} className={linkCls}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full bg-white/15 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="text-xl leading-none">
            {open ? '✕' : '☰'}
          </span>
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-50 flex flex-col bg-ink px-gutter pt-6 pb-10 text-paper"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration.page }}
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                className="grid size-11 place-items-center rounded-full bg-white/15"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <span aria-hidden="true">✕</span>
              </button>
            </div>
            <ul className="mt-16 flex flex-col gap-4">
              {navLinks.map((l, i) => (
                <motion.li
                  key={l.to}
                  initial={reduce ? false : { opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: duration.base, ease, delay: 0.1 + i * stagger }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-display font-extrabold"
                  >
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
