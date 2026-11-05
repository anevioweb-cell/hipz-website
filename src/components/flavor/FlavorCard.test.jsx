import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import FlavorCard from './FlavorCard.jsx';
import BothFlavorsCard from './BothFlavorsCard.jsx';
import { flavors } from '../../data/flavors.js';

const wrap = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('flavor cards', () => {
  it.each(flavors)('$name card links to its page and "Find it" goes to /distributors', (f) => {
    wrap(<FlavorCard flavor={f} />);
    expect(screen.getByRole('link', { name: f.name })).toHaveAttribute(
      'href',
      `/flavors/${f.slug}`,
    );
    expect(screen.getByRole('link', { name: 'Find it' })).toHaveAttribute('href', '/distributors');
    expect(screen.getByText(f.nameAr)).toHaveAttribute('lang', 'ar');
  });
  it('has no cart, price or add-to-cart interaction', () => {
    const { container } = wrap(<FlavorCard flavor={flavors[0]} />);
    expect(container.textContent).not.toMatch(/add to cart|quick add|\$|dzd|da\b|price/i);
  });
  it('"Both flavors" tile links to /flavors and claims no pack', () => {
    const { container } = wrap(<BothFlavorsCard />);
    expect(screen.getByRole('link', { name: 'Both flavors' })).toHaveAttribute('href', '/flavors');
    expect(container.textContent).not.toMatch(/pack|bundle|box|×|x\d/i);
  });
});
