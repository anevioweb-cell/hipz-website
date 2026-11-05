import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Bottle from './Bottle.jsx';
import { flavors } from '../../data/flavors.js';

describe('<Bottle>', () => {
  it.each(flavors)('renders the $name bottle with explicit size and modern formats', (flavor) => {
    const { container } = render(<Bottle flavor={flavor} />);
    const img = screen.getByAltText(`${flavor.name} Hipz bottle`);
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('height');
    expect(container.querySelector('source[type="image/avif"]')).toBeTruthy();
    expect(container.querySelector('source[type="image/webp"]')).toBeTruthy();
  });
  it('never shows a bottle size', () => {
    const { container } = render(<Bottle flavor={flavors[0]} />);
    expect(container.textContent).not.toMatch(/ml|cl|medium/i);
  });
});
