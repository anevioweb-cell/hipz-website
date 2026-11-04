// Shared class names for the /distributors hero bottles: used by the React page AND by the static
// pre-JS first frame generated in vite.config.js, so both are pixel-identical.
export const DIST_BOTTLES = {
  wrap: 'pointer-events-none absolute right-[6%] bottom-[-12%] flex items-end gap-1 opacity-95 max-[1199px]:right-[-22%] max-[1199px]:bottom-[-26%] max-[1199px]:opacity-25',
  lemon: 'h-[440px] w-auto -rotate-6 drop-shadow-2xl lg:h-[600px]',
  peach: 'h-[420px] w-auto rotate-6 drop-shadow-2xl lg:h-[580px]',
  // the React copies are 2 px shorter than the static frame's, so they are never a *larger* LCP candidate
  // than the pre-JS paint (invisible difference)
  lemonReact: 'h-[438px] w-auto -rotate-6 drop-shadow-2xl lg:h-[598px]',
  peachReact: 'h-[418px] w-auto rotate-6 drop-shadow-2xl lg:h-[578px]',
  lemonSizes: '220px',
  peachSizes: '180px',
};
