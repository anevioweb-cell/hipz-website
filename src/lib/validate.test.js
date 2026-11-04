import { describe, expect, it } from 'vitest';
import { validateRequest, MESSAGE_MAX } from './validate.js';

const ok = {
  business: 'Superette El Amel',
  contact: 'Karim',
  phone: '0560404339',
  email: '',
  wilaya: '16',
  type: 'shop',
  message: '',
};

describe('validateRequest', () => {
  it('accepts a complete request (Latin or Arabic names, +213 phone)', () => {
    expect(validateRequest(ok)).toEqual({});
    expect(
      validateRequest({
        ...ok,
        business: 'محل الأمل',
        contact: 'كريم بن علي',
        phone: '+213 770 78 78 89',
      }),
    ).toEqual({});
  });
  it('requires business, contact, phone, wilaya and type', () => {
    expect(validateRequest({})).toEqual({
      business: 'required',
      contact: 'required',
      phone: 'required',
      wilaya: 'required',
      type: 'required',
    });
    expect(validateRequest({ ...ok, business: '  ' }).business).toBe('required');
  });
  it('rejects non-Algerian or malformed phones', () => {
    expect(validateRequest({ ...ok, phone: '+33612345678' }).phone).toBe('phone');
    expect(validateRequest({ ...ok, phone: '0860404339' }).phone).toBe('phone');
  });
  it('checks email only when filled', () => {
    expect(validateRequest({ ...ok, email: 'a@b.dz' })).toEqual({});
    expect(validateRequest({ ...ok, email: 'not-an-email' }).email).toBe('email');
    expect(validateRequest({ ...ok, email: 'a@b' }).email).toBe('email');
  });
  it('only accepts real wilaya codes and known types', () => {
    expect(validateRequest({ ...ok, wilaya: '70' }).wilaya).toBe('required');
    expect(validateRequest({ ...ok, type: 'vip' }).type).toBe('required');
    expect(validateRequest({ ...ok, wilaya: '69', type: 'other' })).toEqual({});
  });
  it('caps the message length', () => {
    expect(validateRequest({ ...ok, message: 'x'.repeat(MESSAGE_MAX) })).toEqual({});
    expect(validateRequest({ ...ok, message: 'x'.repeat(MESSAGE_MAX + 1) }).message).toBe(
      'tooLong',
    );
  });
});
