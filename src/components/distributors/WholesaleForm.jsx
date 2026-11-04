import { useRef, useState } from 'react';
import SectionHeader from '../SectionHeader.jsx';
import Button from '../Button.jsx';
import { wilayas } from '../../data/wilayas.js';
import { copy } from '../../data/copy.js';
import { BUSINESS_TYPES, MESSAGE_MAX, validateRequest } from '../../lib/validate.js';
import { submitWholesaleRequest } from '../../lib/submit.js';
import { setRequestType, useRequestType } from '../../lib/requestType.js';

const EMPTY = {
  business: '',
  contact: '',
  phone: '',
  email: '',
  wilaya: '',
  message: '',
  website: '',
};
const ORDER = ['business', 'contact', 'phone', 'email', 'wilaya', 'type', 'message'];

const inputCls =
  'mt-2 block min-h-12 w-full rounded-2xl border-2 border-ink/20 bg-white px-4 py-3 text-body text-ink outline-none transition-colors focus:border-ink focus:ring-4 focus:ring-brand-lime aria-[invalid=true]:border-error';

function Field({ id, label, required, hint, error, children }) {
  const f = copy.distributors.form;
  // the visual "*" is hidden from screen readers; inputs also carry required / aria-required
  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label}
        {required && (
          <>
            <span aria-hidden="true"> *</span>
            <span className="sr-only"> (required)</span>
          </>
        )}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-sm opacity-70">
          {hint}
        </p>
      )}
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm font-medium text-error">
          {f.errors[error]}
        </p>
      )}
    </div>
  );
}

// Wholesale request form. Everything goes through src/lib/submit.js (DEMO_MODE: simulated, nothing is
// sent or stored). Entered data lives only in component state and is cleared after a success.
// Accessibility: labels bound to inputs, required markers, inline errors tied with aria-describedby,
// aria-invalid, focus moves to the first invalid field, one polite live region for status.
export default function WholesaleForm() {
  const f = copy.distributors.form;
  const [values, setValues] = useState(EMPTY);
  const type = useRequestType();
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | success | unavailable | failed
  const [status, setStatus] = useState('');
  const formRef = useRef(null);
  const successRef = useRef(null);

  const set = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.value }));
  const describedBy = (id, hint) =>
    [hint && `${id}-hint`, errors[id] && `${id}-error`].filter(Boolean).join(' ') || undefined;

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = { ...values, type };
    const found = validateRequest(data);
    setErrors(found);
    const first = ORDER.find((k) => found[k]);
    if (first) {
      setStatus(f.errors.summary);
      formRef.current?.querySelector(`[name="${first}"]`)?.focus();
      return;
    }
    setState('sending');
    setStatus(f.sending);
    try {
      await submitWholesaleRequest(data);
      setValues(EMPTY); // drop the entered personal data
      setRequestType('');
      setState('success');
      setStatus(`${f.success.title} ${f.success.text}`);
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (err) {
      setState(err.code === 'NOT_AVAILABLE' ? 'unavailable' : 'failed');
      setStatus(`${f.unavailable.title}. ${f.unavailable.text}`);
    }
  };

  const again = () => {
    setState('idle');
    setErrors({});
    setStatus('');
    requestAnimationFrame(() => formRef.current?.querySelector('[name="business"]')?.focus());
  };

  return (
    <section id="request" className="scroll-mt-4 bg-paper text-ink">
      <div className="mx-auto grid max-w-site gap-12 px-gutter py-[72px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-gutter-lg lg:py-[120px]">
        <SectionHeader eyebrow={f.eyebrow} lines={f.lines}>
          {f.text}
        </SectionHeader>

        <div>
          <p role="status" aria-live="polite" className="sr-only">
            {status}
          </p>

          {state === 'success' ? (
            <div className="rounded-card bg-brand-lime p-8 lg:p-10" data-testid="form-success">
              <h3
                ref={successRef}
                tabIndex={-1}
                className="font-display text-h2 font-extrabold outline-none"
              >
                {f.success.title}
              </h3>
              <p className="mt-3 text-lead">{f.success.text}</p>
              <Button className="mt-6" onClick={again}>
                {f.success.again}
              </Button>
            </div>
          ) : (
            <form
              ref={formRef}
              noValidate
              onSubmit={onSubmit}
              className="grid gap-6 sm:grid-cols-2"
              aria-describedby="form-note"
            >
              <p id="form-note" className="sr-only">
                {f.text}
              </p>
              {(state === 'unavailable' || state === 'failed') && (
                <div
                  role="alert"
                  className="rounded-card border-2 border-error bg-white p-6 sm:col-span-2"
                  data-testid="form-unavailable"
                >
                  <p className="font-display text-h3 font-bold">{f.unavailable.title}</p>
                  <p className="mt-2">{f.unavailable.text}</p>
                </div>
              )}

              <Field id="business" label={f.business} required error={errors.business}>
                <input
                  id="business"
                  name="business"
                  type="text"
                  dir="auto"
                  autoComplete="organization"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.business}
                  aria-describedby={describedBy('business')}
                  value={values.business}
                  onChange={set('business')}
                  className={inputCls}
                />
              </Field>
              <Field id="contact" label={f.contact} required error={errors.contact}>
                <input
                  id="contact"
                  name="contact"
                  type="text"
                  dir="auto"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.contact}
                  aria-describedby={describedBy('contact')}
                  value={values.contact}
                  onChange={set('contact')}
                  className={inputCls}
                />
              </Field>
              <Field id="phone" label={f.phone} required hint={f.phoneHint} error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  dir="ltr"
                  autoComplete="tel"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.phone}
                  aria-describedby={describedBy('phone', true)}
                  value={values.phone}
                  onChange={set('phone')}
                  className={inputCls}
                />
              </Field>
              <Field id="email" label={f.email} error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  inputMode="email"
                  dir="ltr"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={describedBy('email')}
                  value={values.email}
                  onChange={set('email')}
                  className={inputCls}
                />
              </Field>
              <Field id="wilaya" label={f.wilaya} required error={errors.wilaya}>
                <select
                  id="wilaya"
                  name="wilaya"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.wilaya}
                  aria-describedby={describedBy('wilaya')}
                  value={values.wilaya}
                  onChange={set('wilaya')}
                  className={inputCls}
                >
                  <option value="">{f.wilayaPlaceholder}</option>
                  {wilayas.map((w) => (
                    <option key={w.code} value={w.code}>
                      {`${w.code} — ${w.name} (${w.nameAr})`}
                    </option>
                  ))}
                </select>
              </Field>
              <Field id="type" label={f.type} required error={errors.type}>
                <select
                  id="type"
                  name="type"
                  required
                  aria-required="true"
                  aria-invalid={!!errors.type}
                  aria-describedby={describedBy('type')}
                  value={type}
                  onChange={(e) => setRequestType(e.target.value)}
                  className={inputCls}
                >
                  <option value="">{f.typePlaceholder}</option>
                  {BUSINESS_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t === 'other'
                        ? f.other
                        : copy.distributors.ways.items.find((i) => i.id === t).title}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field id="message" label={f.message} hint={f.messageHint} error={errors.message}>
                  <textarea
                    id="message"
                    name="message"
                    dir="auto"
                    rows={5}
                    maxLength={MESSAGE_MAX + 200}
                    aria-invalid={!!errors.message}
                    aria-describedby={describedBy('message', true)}
                    value={values.message}
                    onChange={set('message')}
                    className={`${inputCls} min-h-32`}
                  />
                </Field>
              </div>
              {/* honeypot: invisible to people, tempting to bots */}
              <div
                aria-hidden="true"
                className="absolute -left-[10000px] h-px w-px overflow-hidden"
              >
                <label htmlFor="website">{f.honeypot}</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={set('website')}
                />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  disabled={state === 'sending'}
                  className="min-h-12 disabled:opacity-60"
                >
                  {state === 'sending' ? f.sending : f.submit}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
