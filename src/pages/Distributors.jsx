import Ar from '../components/ui/Ar.jsx';
import Button from '../components/ui/Button.jsx';
import Picture from '../components/ui/Picture.jsx';
import PopBlock from '../components/motion/PopBlock.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import PopText from '../components/motion/PopText.jsx';
import { heroText } from '../motion.js';
import ContactBand, { PhoneLinks } from '../components/distributors/ContactBand.jsx';
import WaysToWork from '../components/distributors/WaysToWork.jsx';
import WholesaleForm from '../components/distributors/WholesaleForm.jsx';
import StoreFinder from '../components/distributors/StoreFinder.jsx';
import { flavors } from '../data/flavors.js';
import { PUBLIC_CONTACT } from '../data/site.js';
import { telHref } from '../lib/phone.js';
import { copy } from '../data/copy.js';
import { DIST_BOTTLES } from '../lib/distHeroClasses.js';
import { hideHeroShell } from '../lib/heroShell.js';
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
          <div aria-hidden="true" className={DIST_BOTTLES.wrap}>
            <Picture
              name={lemon.images.bottle}
              alt=""
              sizes={DIST_BOTTLES.lemonSizes}
              priority
              onLoad={hideHeroShell}
              imgClassName={DIST_BOTTLES.lemonReact}
            />
            <Picture
              name={peach.images.bottle}
              alt=""
              sizes={DIST_BOTTLES.peachSizes}
              priority
              imgClassName={DIST_BOTTLES.peachReact}
            />
          </div>
          <div className="detail-frame-content relative z-10 mx-auto flex max-w-site flex-col justify-end gap-5 px-gutter pt-28 pb-10 lg:px-gutter-lg lg:pb-16">
            <p className="font-mono text-label uppercase">
              {h.eyebrow} · <Ar>{h.ar}</Ar>
            </p>
            <PopText
              as="h1"
              trigger="load"
              delay={heroText.delay}
              lines={h.lines}
              className="max-w-[12ch] font-display text-display font-extrabold landscape:text-[clamp(3rem,6.2vw,6.5rem)]"
            />
            <PopText
              as="p"
              variant="soft"
              trigger="load"
              delay={heroText.leadDelay}
              text={h.text}
              className="max-w-[40ch] text-lead"
            />
            <PopBlock
              y={10}
              immediate
              delay={heroText.buttonDelay}
              className="flex flex-wrap gap-3"
            >
              <Button href="#request" variant="primary">
                {h.primary}
              </Button>
              <Button
                href={telHref(first)}
                variant="ghost"
                arrow={false}
                aria-label={`${h.secondary} · ${first} — ${copy.distributors.contact.callPrefix} ${first}`}
              >
                {h.secondary} · <span dir="ltr">{first}</span>
              </Button>
            </PopBlock>
          </div>
        </section>
      </div>

      {/* z-10: the sections slide over the static pre-JS frame (see .hero-shell--dist) */}
      <div className="relative z-10 bg-paper">
        <ContactBand />
        <WaysToWork />
        <WholesaleForm />
        <StoreFinder />

        <section id="closing" className="bg-paper text-ink">
          <div className="hero-frame-wrap">
            <div className="relative grid items-center gap-8 overflow-hidden rounded-[var(--frame-r)] bg-[linear-gradient(100deg,var(--color-lemon)_0%,var(--color-lemon)_50%,var(--color-peach)_50%,var(--color-peach)_100%)] px-5 py-14 lg:grid-cols-2 lg:px-14">
              <PopBlock className="flex flex-col items-start gap-6">
                <SectionHeader lines={copy.distributors.closing.lines} />
                <Button to="/flavors" variant="primary">
                  {copy.distributors.closing.cta}
                </Button>
                <div>
                  <p className="font-mono text-label uppercase">{PUBLIC_CONTACT.label}</p>
                  <PhoneLinks size="sm" className="mt-2" />
                </div>
              </PopBlock>
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
      </div>
    </>
  );
}
