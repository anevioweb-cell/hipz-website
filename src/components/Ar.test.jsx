import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Ar from './Ar.jsx';

describe('<Ar>', () => {
  it('marks Arabic text as rtl with lang="ar"', () => {
    render(<Ar>هايبز</Ar>);
    const el = screen.getByText('هايبز');
    expect(el).toHaveAttribute('lang', 'ar');
    expect(el).toHaveAttribute('dir', 'rtl');
    expect(el).toHaveClass('ar');
  });
  it('uses the display font class when asked', () => {
    render(<Ar display>هايبز</Ar>);
    expect(screen.getByText('هايبز')).toHaveClass('ar-display');
  });
});
