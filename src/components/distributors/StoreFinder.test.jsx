import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StoreFinder from './StoreFinder.jsx';
import { stores } from '../../data/stores.js';

describe('<StoreFinder>', () => {
  it('the real stores file is empty', () => expect(stores).toEqual([]));

  it('shows the designed empty state for any wilaya with the real (empty) data', async () => {
    const user = userEvent.setup();
    render(<StoreFinder />);
    await user.selectOptions(screen.getByLabelText('Your wilaya'), '09');
    await user.click(screen.getByRole('button', { name: 'Show stockists' }));
    const region = screen.getByTestId('finder-results');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toHaveTextContent('No stockists listed here yet');
    expect(region).toHaveTextContent('09 — Blida');
    expect(
      within(region).getByRole('link', { name: /Call the Hipz commercial service on 05 60404339/ }),
    ).toHaveAttribute('href', 'tel:+213560404339');
    expect(within(region).getByRole('link', { name: 'Send a request' })).toHaveAttribute(
      'href',
      '#request',
    );
  });

  it('lists stores filtered by wilaya when data exists (fake data)', async () => {
    const fake = [
      {
        id: 'a',
        name: 'Superette A',
        wilayaCode: '31',
        address: 'Rue 1, Oran',
        phone: '041 33 22 11',
        mapUrl: 'https://maps.example/a',
      },
      { id: 'b', name: 'محل ب', wilayaCode: '31', address: 'وهران' },
      { id: 'c', name: 'Shop C', wilayaCode: '16', address: 'Alger' },
    ];
    const user = userEvent.setup();
    render(<StoreFinder stores={fake} />);
    await user.selectOptions(screen.getByLabelText('Your wilaya'), '31');
    await user.click(screen.getByRole('button', { name: 'Show stockists' }));
    const region = screen.getByTestId('finder-results');
    expect(region).toHaveTextContent('2 stockists in Oran');
    expect(within(region).getAllByRole('listitem')).toHaveLength(2);
    expect(within(region).queryByText('Shop C')).toBeNull();
    expect(within(region).getByRole('link', { name: '041 33 22 11' })).toHaveAttribute(
      'href',
      'tel:+21341332211',
    );
    expect(within(region).getByRole('link', { name: /Map: Superette A/ })).toHaveAttribute(
      'rel',
      'noopener noreferrer',
    );
  });
});
