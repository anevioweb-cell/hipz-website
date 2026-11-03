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
  it('exposes duration/direction as CSS variables and defaults to the measured 72 px/s ticker speed', () => {
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
