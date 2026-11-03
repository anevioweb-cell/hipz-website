import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import SplitLines from './SplitLines.jsx';

describe('<SplitLines>', () => {
  it('renders every line inside one heading', () => {
    render(<SplitLines lines={['One', 'Two']} />);
    const h = screen.getByRole('heading', { level: 1 });
    expect(h).toHaveTextContent('One Two');
    expect(h.querySelectorAll('span.block')).toHaveLength(2);
  });
});
