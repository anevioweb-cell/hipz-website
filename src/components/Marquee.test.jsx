import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Marquee from './Marquee.jsx';

describe('<Marquee>', () => {
  it('duplicates content for a seamless loop and hides the copy from assistive tech', () => {
    render(<Marquee label="ticker">item</Marquee>);
    expect(screen.getAllByText('item')).toHaveLength(2);
    expect(screen.getByRole('group', { name: 'ticker' })).toBeInTheDocument();
  });
});

describe('<Marquee> speed', () => {
  it('exposes duration/direction as CSS variables and exposes the measured speed as a duration', () => {
    render(
      <Marquee label="m" reverse>
        x
      </Marquee>,
    );
    const el = screen.getByRole('group', { name: 'm' });
    expect(el.style.getPropertyValue('--marquee-direction')).toBe('reverse');
    expect(el.style.getPropertyValue('--marquee-duration')).toMatch(/s$/);
  });
});

describe('<Marquee> pause control (WCAG 2.2.2)', () => {
  it('has a pause button that pauses the track', async () => {
    const { default: userEvent } = await import('@testing-library/user-event');
    render(<Marquee label="band">item</Marquee>);
    const btn = screen.getByRole('button', { name: 'Pause moving text' });
    await userEvent.click(btn);
    expect(screen.getByRole('button', { name: 'Play moving text' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('group', { name: 'band' }).className).toMatch(/is-paused/);
  });
});
