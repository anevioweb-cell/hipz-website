import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Hero from './Hero.jsx';

const observers = [];
class CapturingIO {
  constructor(cb) {
    observers.push(cb);
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}
let original;
beforeEach(() => {
  original = window.IntersectionObserver;
  observers.length = 0;
  window.IntersectionObserver = CapturingIO;
});
afterEach(() => {
  window.IntersectionObserver = original;
});

const setup = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>,
  );

describe('<Hero>', () => {
  it('has one h1, both flavor switches, and links to the flavors section and /distributors', () => {
    setup();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Thirsty? Say Hipz.');
    expect(screen.getByRole('button', { name: /Lemon/ })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /Peach/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('link', { name: /Meet the flavors/ })).toHaveAttribute(
      'href',
      '#flavors',
    );
    expect(screen.getByRole('link', { name: /Find it/ })).toHaveAttribute('href', '/distributors');
  });
  it('switches flavor manually and offers a pause control', async () => {
    setup();
    expect(screen.getByRole('button', { name: 'Pause' })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Peach/ }));
    expect(screen.getByRole('button', { name: /Peach/ })).toHaveAttribute('aria-pressed', 'true');
  });
  it('runs the thirst effects on the active scene only', async () => {
    setup();
    const fx = await screen.findAllByTestId('thirst-fx');
    expect(fx).toHaveLength(1);
    expect(fx[0].querySelectorAll('.fx-droplet').length).toBeLessThanOrEqual(10);
    expect(fx[0].querySelectorAll('.fx-bubble').length).toBeGreaterThanOrEqual(12);
    expect(fx[0].querySelectorAll('.fx-bubble').length).toBeLessThanOrEqual(18);
    expect(fx[0]).toHaveAttribute('data-paused', 'false');
  });
  it('pauses every effect when the hero leaves the viewport', async () => {
    const { container } = setup();
    await screen.findByTestId('thirst-fx');
    act(() => observers.forEach((cb) => cb([{ isIntersecting: false }])));
    expect(container.querySelector('section')).toHaveAttribute('data-fx-paused', 'true');
    expect(screen.getByTestId('thirst-fx')).toHaveAttribute('data-paused', 'true');
    act(() => observers.forEach((cb) => cb([{ isIntersecting: true }])));
    expect(screen.getByTestId('thirst-fx')).toHaveAttribute('data-paused', 'false');
  });
});
