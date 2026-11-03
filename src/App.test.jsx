import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('routes', () => {
  it.each([
    ['/', 'Smile in a bottle.'],
    ['/flavors', 'Flavors'],
    ['/flavors/peach', 'Peach'],
    ['/distributors', 'Distributors'],
    ['/our-story', 'Our story'],
    ['/nope', 'Page not found'],
    ['/flavors/mango', 'Page not found'],
    ['/credits', 'Page not found'],
  ])('%s renders its h1 without crashing', (path, title) => {
    renderAt(path);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(title);
  });
});
