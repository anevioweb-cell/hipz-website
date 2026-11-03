import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Hero from './Hero.jsx';

const setup = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>,
  );

describe('<Hero>', () => {
  it('has one h1, both flavor switches, and links to flavors and distributors', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Smile in a bottle.');
    expect(screen.getByRole('button', { name: /Lemon/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Peach/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('link', { name: /Meet the flavors/ })).toHaveAttribute(
      'href',
      '#flavors',
    );
    expect(screen.getByRole('link', { name: /Become a distributor/ })).toHaveAttribute(
      'href',
      '/distributors',
    );
  });
  it('switches flavor manually', async () => {
    setup();
    await userEvent.click(screen.getByRole('button', { name: /Peach/ }));
    expect(screen.getByRole('button', { name: /Peach/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Lemon/ })).toHaveAttribute('aria-pressed', 'false');
  });
  it('offers a pause control for the auto-advance', () => {
    setup();
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
  });
});
