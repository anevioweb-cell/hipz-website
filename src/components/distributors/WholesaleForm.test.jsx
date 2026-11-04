import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WholesaleForm from './WholesaleForm.jsx';
import { setRequestType } from '../../lib/requestType.js';

let fetchSpy;
beforeEach(() => {
  fetchSpy = vi.fn(() => Promise.reject(new Error('no network')));
  vi.stubGlobal('fetch', fetchSpy);
  setRequestType('');
});
afterEach(() => vi.unstubAllGlobals());

describe('<WholesaleForm>', () => {
  it('labels every field and marks the required ones', () => {
    render(<WholesaleForm />);
    for (const name of [/Business name/, /Contact person/, /^Phone/, /Wilaya/, /Business type/]) {
      const el = screen.getByLabelText(name);
      expect(el).toBeRequired();
      expect(el).toHaveAttribute('aria-required', 'true');
    }
    expect(screen.getByLabelText(/Email/)).not.toBeRequired();
    expect(screen.getByLabelText(/Message/)).toHaveAttribute('dir', 'auto');
    expect(screen.getByLabelText(/Business name/)).toHaveAttribute('autocomplete', 'organization');
    expect(screen.getByLabelText(/^Phone/)).toHaveAttribute('autocomplete', 'tel');
    // 69 wilayas + placeholder, names only (no code numbers), official order
    const options = [...screen.getByLabelText(/Wilaya/).querySelectorAll('option')];
    expect(options).toHaveLength(70);
    expect(screen.getByRole('option', { name: 'Algiers (الجزائر)' })).toBeInTheDocument();
    for (const o of options) expect(o.textContent).not.toMatch(/\d/);
    expect(options[1].textContent).toMatch(/^Adrar/);
    expect(options[69].textContent).toMatch(/^El Abiodh Sidi Cheikh/);
  });

  it('shows inline errors tied with aria-describedby and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    render(<WholesaleForm />);
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    const business = screen.getByLabelText(/Business name/);
    expect(business).toHaveFocus();
    expect(business).toHaveAttribute('aria-invalid', 'true');
    expect(business.getAttribute('aria-describedby')).toContain('business-error');
    expect(document.getElementById('business-error')).toHaveTextContent('This field is required.');
    expect(screen.getByRole('status')).toHaveTextContent('Please check the highlighted fields.');
  });

  it('completes with the keyboard, shows the designed success state, sends nothing and clears the data', async () => {
    const user = userEvent.setup();
    render(<WholesaleForm />);
    setRequestType('wholesale'); // as if "Get in touch" was clicked
    await user.type(screen.getByLabelText(/Business name/), 'محل الأمل');
    await user.type(screen.getByLabelText(/Contact person/), 'Karim');
    await user.type(screen.getByLabelText(/^Phone/), '+213 770 78 78 89');
    await user.selectOptions(screen.getByLabelText(/Wilaya/), '31');
    expect(screen.getByLabelText(/Business type/)).toHaveValue('wholesale');
    await user.click(screen.getByRole('button', { name: 'Send request' }));
    const success = await screen.findByTestId('form-success', {}, { timeout: 3000 });
    expect(success).toHaveTextContent('Thanks!');
    expect(success).toHaveTextContent('The Hipz team will get back to you.');
    expect(success.textContent).not.toMatch(/24|hour|day|within/i);
    expect(fetchSpy).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.getByRole('heading', { name: 'Thanks!' })).toHaveFocus());
    await user.click(screen.getByRole('button', { name: 'Send another request' }));
    expect(screen.getByLabelText(/Business name/)).toHaveValue('');
  });

  it('has a hidden honeypot field outside the tab order', () => {
    const { container } = render(<WholesaleForm />);
    const hp = container.querySelector('input[name="website"]');
    expect(hp).toHaveAttribute('tabindex', '-1');
    expect(hp.closest('[aria-hidden="true"]')).toBeTruthy();
  });
});
