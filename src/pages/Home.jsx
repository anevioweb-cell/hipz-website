import Hero from '../components/Hero.jsx';
import Ticker from '../components/Ticker.jsx';
import FlavorsSection from '../components/FlavorsSection.jsx';
import MomentsSection from '../components/MomentsSection.jsx';
import WhySection from '../components/WhySection.jsx';
import BothFlavorsFeature from '../components/BothFlavorsFeature.jsx';
import CommunitySection from '../components/CommunitySection.jsx';
import { useNavTone } from '../hooks/useNavTone.js';

// Order follows the reference where our sections map to it: hero, ticker, flavors, moments, why
// (the reference's ingredients block is skipped: no confirmed ingredients), both flavors (its pack card),
// community (its reviews). Sections slide over the sticky hero (z-10, solid backgrounds).
export default function Home() {
  useNavTone('dark');
  return (
    <>
      <Hero />
      <div className="relative z-10 bg-paper">
        <Ticker />
        <FlavorsSection />
        <MomentsSection />
        <WhySection />
        <BothFlavorsFeature />
        <CommunitySection />
      </div>
    </>
  );
}
