// DEMO_MODE: when true NOTHING is sent anywhere. Forms and "quick add" only simulate success.
// Before any public launch this must be replaced by a real backend (or consciously kept).
export const DEMO_MODE = true;

// Smooth scrolling (Lenis). OFF since Phase 6: the reference scrolls natively (a 100 px wheel step lands
// within one frame, no easing or inertia — docs/design/MOTION_SPEC.md). Kept as an option, never under reduced motion.
export const SMOOTH_SCROLL = false;

// Endpoint for the wholesale request form when DEMO_MODE is false. null = not configured: the form then
// shows a visible "not available yet" state (see src/lib/submit.js).
export const FORM_ENDPOINT = null;

// Public origin of the deployed site, e.g. 'https://hipz-preview.vercel.app' (no trailing slash).
// Production domain of the Vercel project hipz-website. Link previews (WhatsApp / Instagram DM) need ABSOLUTE
// og:image / og:url values: while this is empty the tags fall back to relative paths, which most chat
// apps ignore (no preview image). noindex stays either way.
export const SITE_URL = 'https://hipz-website-snowy.vercel.app';
