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
  // landscape: blends the photo edge into the peach ground; portrait: dark scrim above the text
  blend:
    'pointer-events-none absolute inset-y-0 left-[38%] hidden w-[22%] bg-linear-to-r from-peach-soft to-transparent landscape:block',
  scrim:
    'pointer-events-none absolute inset-x-0 bottom-[50%] hidden h-[32%] bg-linear-to-t from-ink from-10% via-ink/70 to-transparent portrait:block',
};
