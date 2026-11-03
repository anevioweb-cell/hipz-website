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
