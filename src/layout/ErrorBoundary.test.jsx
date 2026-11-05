import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary.jsx';
import Picture from '../components/ui/Picture.jsx';
import { isChunkError, retryOnce } from '../lib/lazyRetry.js';

function Boom({ error }) {
  throw error;
}
const view = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('<ErrorBoundary>', () => {
  it('shows the designed fallback (logo, message, reload, home) instead of a blank screen', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    view(
      <ErrorBoundary resetKey="/a">
        <Boom error={new Error('render failed')} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('img', { name: 'Hipz' })).toBeInTheDocument();
    spy.mockRestore();
    warn.mockRestore();
  });
  it('explains a failed page load (lazy chunk) and resets on route change', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const chunk = new TypeError('Failed to fetch dynamically imported module: /assets/X.js');
    const { rerender } = view(
      <ErrorBoundary resetKey="/x">
        <Boom error={chunk} />
      </ErrorBoundary>,
    );
    expect(screen.getByRole('heading', { name: 'This page did not load' })).toBeInTheDocument();
    rerender(
      <MemoryRouter>
        <ErrorBoundary resetKey="/y">
          <p>fine again</p>
        </ErrorBoundary>
      </MemoryRouter>,
    );
    expect(screen.getByText('fine again')).toBeInTheDocument();
    spy.mockRestore();
    warn.mockRestore();
  });
});

describe('lazy chunk retry', () => {
  it('retries a failed import once, then gives up', async () => {
    let n = 0;
    const flaky = () =>
      ++n === 1 ? Promise.reject(new Error('Loading chunk 1 failed')) : Promise.resolve('ok');
    await expect(retryOnce(flaky, 1)()).resolves.toBe('ok');
    expect(n).toBe(2);
    let m = 0;
    const dead = () => {
      m++;
      return Promise.reject(new Error('Failed to fetch dynamically imported module'));
    };
    await expect(retryOnce(dead, 1)()).rejects.toThrow();
    expect(m).toBe(2);
    expect(isChunkError(new Error('Importing a module script failed.'))).toBe(true);
    expect(isChunkError(new Error('x is undefined'))).toBe(false);
  });
});

describe('<Picture> on error', () => {
  it('hides a failed image but keeps its size (no broken icon, no layout shift)', () => {
    const { container } = render(<Picture name="bottle-lemon" alt="Lemon bottle" />);
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('width');
    fireEvent.error(img);
    expect(img.style.visibility).toBe('hidden');
    expect(img).toHaveAttribute('width');
    expect(img).toHaveAttribute('data-failed', 'true');
  });
});
