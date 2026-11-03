import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('motion/react', async (orig) => ({ ...(await orig()), useReducedMotion: () => true }));

const { default: Hero } = await import('./Hero.jsx');

describe('<Hero> under prefers-reduced-motion', () => {
  it('has no Pause button, no effects and does not auto-advance', async () => {
    vi.useFakeTimers();
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: /^(Pause|Play)$/ })).toBeNull();
    expect(screen.queryByTestId('thirst-fx')).toBeNull();
    vi.advanceTimersByTime(30000);
    expect(screen.getByRole('button', { name: /Lemon/ })).toHaveAttribute('aria-pressed', 'true');
    vi.useRealTimers();
  });
});
