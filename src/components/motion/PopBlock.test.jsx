import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'motion/react';
import PopBlock from './PopBlock.jsx';
import { riseFor } from '../../motion.js';

const wrap = (ui) => render(<LazyMotion features={domAnimation}>{ui}</LazyMotion>);

describe('<PopBlock>', () => {
  it('starts hidden with the measured offset (transform/opacity only)', () => {
    wrap(<PopBlock y={70}>card</PopBlock>);
    const el = screen.getByText('card');
    expect(el.style.opacity).toBe('0');
    expect(el.style.transform).toMatch(/translateY\(70px\)/);
  });
  it('picks the measured curve and duration for each offset', () => {
    expect(riseFor(70)).toMatchObject({ duration: 0.785, ease: [0.25, 0.9, 0.35, 1] });
    expect(riseFor(30)).toMatchObject({ duration: 0.703 });
    expect(riseFor(10)).toMatchObject({ duration: 0.355, ease: [0.25, 0.2, 0.25, 1] });
  });
  it('shows itself at once when keyboard focus enters it', async () => {
    wrap(
      <PopBlock y={10} delay={1.5}>
        <a href="#x">Go</a>
      </PopBlock>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    link.focus();
    await new Promise((r) => setTimeout(r, 50));
    // the !important final-state classes win over the inline entrance style
    expect(link.parentElement.className).toMatch(/opacity-100!/);
    expect(link.parentElement.className).toMatch(/transform-none!/);
  });
  it('is shown immediately when IntersectionObserver is missing (fail-safe)', () => {
    const IO = window.IntersectionObserver;
    delete window.IntersectionObserver;
    try {
      wrap(<PopBlock y={50}>row</PopBlock>);
      expect(screen.getByText('row').style.opacity).not.toBe('0');
    } finally {
      window.IntersectionObserver = IO;
    }
  });
});
