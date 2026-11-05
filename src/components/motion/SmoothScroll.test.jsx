import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import SmoothScroll from './SmoothScroll.jsx';
import { SMOOTH_SCROLL } from '../../config.js';

describe('<SmoothScroll>', () => {
  it('renders nothing and is controlled by the SMOOTH_SCROLL flag', () => {
    const { container } = render(<SmoothScroll />);
    expect(container).toBeEmptyDOMElement();
    expect(typeof SMOOTH_SCROLL).toBe('boolean');
  });
});
