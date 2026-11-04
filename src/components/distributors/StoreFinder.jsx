import { useState } from 'react';
import SectionHeader from '../SectionHeader.jsx';
import Button from '../Button.jsx';
import { wilayaLabel, wilayas } from '../../data/wilayas.js';
import { stores as realStores } from '../../data/stores.js';
import { PUBLIC_CONTACT } from '../../data/site.js';
import { normalizeDZ, telHref } from '../../lib/phone.js';
import { copy } from '../../data/copy.js';

const inputCls =
  'mt-2 block min-h-12 w-full rounded-2xl border-2 border-ink/20 bg-white px-4 py-3 text-body text-ink outline-none focus:border-ink focus:ring-4 focus:ring-brand-lime';

// Store finder. Results come from src/data/stores.js, which is EMPTY (no stockists are known): choosing a
// wilaya then shows a designed empty state that points to the commercial service or the request form.
// If stores are added later, the same component lists them, filtered by wilaya, in a live region.
export default function StoreFinder({ stores = realStores }) {
  const t = copy.distributors.finder;
  const [code, setCode] = useState('');
  const [shown, setShown] = useState(null); // wilaya code whose results are displayed
  const wilaya = wilayas.find((w) => w.code === shown);
  const results = shown ? stores.filter((s) => s.wilayaCode === shown) : [];
  const first = PUBLIC_CONTACT.phones[0].display;

  return (
    <section id="finder" className="bg-paper text-ink">
      <div className="mx-auto grid max-w-site gap-12 border-t border-ink/10 px-gutter py-[72px] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16 lg:px-gutter-lg lg:py-[120px]">
        <SectionHeader eyebrow={t.eyebrow} lines={t.lines} />
        <div>
          <form
            className="flex flex-col gap-4 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              if (code) setShown(code);
            }}
          >
            <div className="flex-1">
              <label htmlFor="finder-wilaya" className="font-medium">
                {t.select}
              </label>
              <select
                id="finder-wilaya"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={inputCls}
              >
                <option value="">{t.placeholder}</option>
                {wilayas.map((w) => (
                  <option key={w.code} value={w.code}>
                    {wilayaLabel(w)}
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" className="min-h-12" disabled={!code}>
              {t.button}
            </Button>
          </form>

          <div
            role="region"
            aria-live="polite"
            aria-label={t.eyebrow}
            className="mt-8"
            data-testid="finder-results"
          >
            {wilaya && results.length === 0 && (
              <div className="rounded-card border-2 border-dashed border-ink/25 p-8">
                <p className="font-display text-h3 font-bold">{t.empty.title}</p>
                <p className="mt-2 max-w-[52ch] opacity-80">
                  {wilaya.name}. {t.empty.text}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button
                    href={telHref(first)}
                    variant="primary"
                    arrow={false}
                    aria-label={`${t.empty.call} · ${first} — ${copy.distributors.contact.callPrefix} ${first}`}
                  >
                    {t.empty.call} · <span dir="ltr">{first}</span>
                  </Button>
                  <Button href="#request" variant="ghost" arrow={false}>
                    {t.empty.form}
                  </Button>
                </div>
              </div>
            )}
            {wilaya && results.length > 0 && (
              <>
                <p className="font-medium">
                  {results.length} {results.length === 1 ? t.one : t.many} {wilaya.name}
                </p>
                <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                  {results.map((s) => (
                    <li key={s.id} className="rounded-card bg-white p-6 shadow-card">
                      <p className="font-display text-h3 font-bold" dir="auto">
                        {s.name}
                      </p>
                      <p className="mt-2 opacity-80" dir="auto">
                        {s.address}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-4">
                        {s.phone && normalizeDZ(s.phone) && (
                          <a
                            className="inline-flex min-h-11 items-center underline"
                            href={telHref(s.phone)}
                          >
                            <span dir="ltr">{s.phone}</span>
                          </a>
                        )}
                        {s.mapUrl && (
                          <a
                            className="inline-flex min-h-11 items-center underline"
                            href={s.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${t.map}: ${s.name} (opens in a new tab)`}
                          >
                            {t.map}
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
