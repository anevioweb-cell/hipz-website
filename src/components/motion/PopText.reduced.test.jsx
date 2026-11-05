import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('motion/react', async (orig) => ({ ...(await orig()), useReducedMotion: () => true }));

const { default: PopText } = await import('./PopText.jsx');

describe('<PopText> under prefers-reduced-motion', () => {
  it('renders plain, unsplit, fully visible text', () => {
    render(<PopText as="h2" lines={['Plain', 'text']} />);
    const h = screen.getByRole('heading', { level: 2 });
    expect(h).toHaveTextContent('Plain text');
    expect(h.querySelectorAll('[data-pop]')).toHaveLength(0);
    expect(h).not.toHaveAttribute('aria-label');
  });
});
