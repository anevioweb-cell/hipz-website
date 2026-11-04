// The static first frame painted from index.html before React loads (hero-shell Vite plugin).
// It is hidden, never removed: removing an LCP element makes Chrome's trace (used by Lighthouse)
// re-pick the React copy of the same image, which can only paint after the JS bundle has run.
export function hideHeroShell() {
  document.getElementById('hero-shell')?.classList.add('is-hidden');
}
