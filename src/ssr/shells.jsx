// Build-time (server) render of the /flavors first band, used as that page's static pre-JS first frame
// (vite.config.js → heroShell). Rendering the real component guarantees identical markup and layout.
// Built by `npm run build` with `vite build --ssr` before the client build.
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'motion/react';
import FlavorBand from '../components/flavor/FlavorBand.jsx';
import { flavors } from '../data/flavors.js';

export function flavorsFirstBand() {
  const html = renderToStaticMarkup(
    <LazyMotion features={domAnimation}>
      <MemoryRouter>
        <FlavorBand flavor={flavors[0]} first />
      </MemoryRouter>
    </LazyMotion>,
  );
  // decorative duplicate: no ids (no duplicates with the React copy), no labelling references and no
  // link targets (the page's skip link stays the first link in the document)
  return html.replace(/\s(id|aria-labelledby|aria-describedby|href)="[^"]*"/g, '');
}
