import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Button from './Button.jsx';

describe('<Button>', () => {
  it('renders a link when given `to`', () => {
    render(
      <MemoryRouter>
        <Button to="/flavors">Go</Button>
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Go' })).toHaveAttribute('href', '/flavors');
  });
  it('renders a button and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Click' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
});
