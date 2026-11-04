// Shared class names for the /our-story hero photo: used by the React page AND by the static pre-JS
// first frame generated in vite.config.js, so both are pixel-identical. Art direction by layout:
// landscape — the square duo photo fills the right 62 % of the frame (≈ square, no face is cut) and the
// text sits on the peach ground; portrait — the photo fills the top half (both faces stay in view) and the
// text sits on ink below it.
export const STORY_HERO = {
  photo: 'absolute inset-x-0 top-0 bottom-[50%] landscape:bottom-0 landscape:left-[38%]',
  // React copy: 2 px shorter, so it is never a *larger* LCP candidate than the pre-JS paint (invisible)
  photoReact:
    'absolute inset-x-0 top-px bottom-[calc(50%+1px)] landscape:bottom-px landscape:left-[38%]',
  img: 'h-full w-full object-cover',
  sizes: '(max-aspect-ratio: 1/1) 100vw, 62vw',
};
