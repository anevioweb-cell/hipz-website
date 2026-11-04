// DEMO_MODE: when true NOTHING is sent anywhere. Forms and "quick add" only simulate success.
// Before any public launch this must be replaced by a real backend (or consciously kept).
export const DEMO_MODE = true;

// Smooth scrolling (Lenis, loaded after first paint, off under prefers-reduced-motion).
export const SMOOTH_SCROLL = true;

// Endpoint for the wholesale request form when DEMO_MODE is false. null = not configured: the form then
// shows a visible "not available yet" state (see src/lib/submit.js).
export const FORM_ENDPOINT = null;
