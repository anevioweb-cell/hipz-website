import Ar from '../components/Ar.jsx';
import Button from '../components/Button.jsx';
import Picture from '../components/Picture.jsx';
import Reveal from '../components/Reveal.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import SplitLines from '../components/SplitLines.jsx';
import ContactBand, { PhoneLinks } from '../components/distributors/ContactBand.jsx';
import WaysToWork from '../components/distributors/WaysToWork.jsx';
import WholesaleForm from '../components/distributors/WholesaleForm.jsx';
import { flavors } from '../data/flavors.js';
import { PUBLIC_CONTACT } from '../data/site.js';
import { telHref } from '../lib/phone.js';
import { copy } from '../data/copy.js';
import { useNavTone } from '../hooks/useNavTone.js';
import { usePageTitle } from '../hooks/usePageTitle.js';

// /distributors — the reference has no such page; it is built from its measured language: the same
// rounded inset frame as the flavor pages, the measured type scale/spacing and reveal offsets.
// It only invites contact: no areas, stores, prices, terms or reply-time promises (owner).
export default function Distributors() {
  useNavTone('dark');
  usePageTitle(copy.distributors.pageTitle.text);
  const h = copy.distributors.hero;
  const [lemon, peach] = flavors;
  const first = PUBLIC_CONTACT.phones[0].display;
  return (
    <>
      <div className="hero-frame-wrap">
        <section
          className="detail-frame relative overflow-hidden bg-brand-lime text-ink"
          aria-label={h.eyebrow}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[6%] bottom-[-12%] flex items-end gap-1 opacity-95 max-lg:right-[-18%] max-lg:bottom-[-22%] max-lg:opacity-40"
          >
            <Picture
              name={lemon.images.bottle}
              alt=""
              sizes="220px"
              priority
              imgClassName="h-[440px] w-auto -rotate-6 drop-shadow-2xl lg:h-[600px]"
            />
            <Picture
              name={peach.images.bottle}
              alt=""
              sizes="180px"
              priority
              imgClassName="h-[420px] w-auto rotate-6 drop-shadow-2xl lg:h-[580px]"
            />
          </div>
          <div className="detail-frame-content relative z-10 mx-auto flex max-w-site flex-col justify-end gap-5 px-gutter pt-28 pb-10 lg:px-gutter-lg lg:pb-16">
            <p className="font-mono text-label uppercase">
              {h.eyebrow} · <Ar>{h.ar}</Ar>
            </p>
            <SplitLines
              immediate
              lines={h.lines}
              className="max-w-[12ch] font-display text-display font-extrabold landscape:text-[clamp(3rem,6.2vw,6.5rem)]"
            />
            <p className="max-w-[40ch] text-lead">{h.text}</p>
            <div className="flex flex-wrap gap-3">
              <Button href="#request" variant="primary">
                {h.primary}
              </Button>
              <Button
                href={telHref(first)}
                variant="ghost"
                arrow={false}
                aria-label={`${copy.distributors.contact.callPrefix} ${first}`}
              >
                {h.secondary} · <span dir="ltr">{first}</span>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ContactBand />
      <WaysToWork />
      <WholesaleForm />

      <section id="closing" className="bg-paper text-ink">
        <div className="hero-frame-wrap">
          <div className="relative grid items-center gap-8 overflow-hidden rounded-[var(--frame-r)] bg-[linear-gradient(100deg,var(--color-lemon)_0%,var(--color-lemon)_50%,var(--color-peach)_50%,var(--color-peach)_100%)] px-5 py-14 lg:grid-cols-2 lg:px-14">
            <Reveal className="flex flex-col items-start gap-6">
              <SectionHeader lines={copy.distributors.closing.lines} />
              <Button to="/flavors" variant="primary">
                {copy.distributors.closing.cta}
              </Button>
              <div>
                <p className="font-mono text-label uppercase">{PUBLIC_CONTACT.label}</p>
                <PhoneLinks size="sm" className="mt-2" />
              </div>
            </Reveal>
            <div aria-hidden="true" className="flex items-end justify-center gap-2">
              <Picture
                name={lemon.images.bottle}
                alt=""
                sizes="160px"
                imgClassName="h-[340px] w-auto -rotate-6 drop-shadow-2xl lg:h-[440px]"
              />
              <Picture
                name={peach.images.bottle}
                alt=""
                sizes="130px"
                imgClassName="h-[330px] w-auto rotate-6 drop-shadow-2xl lg:h-[430px]"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
