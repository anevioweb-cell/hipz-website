import { Component } from 'react';
import Logo from '../components/ui/Logo.jsx';
import { copy } from '../data/copy.js';
import { isChunkError } from '../lib/lazyRetry.js';

// Designed fallback for any render error (and for a lazy page that still fails after its retry):
// logo, a short message, Reload and Back home. Never a blank screen. `resetKey` (the route) clears it.
export function ErrorPage({ chunk = false }) {
  const t = chunk ? { ...copy.errors.crash, ...copy.errors.chunk } : copy.errors.crash;
  return (
    <section role="alert" className="bg-paper px-gutter pt-36 pb-section text-ink lg:px-gutter-lg">
      <div className="mx-auto flex max-w-site flex-col items-start gap-6">
        <Logo tone="dark" height="h-12" />
        <h1 className="font-display text-h2 font-extrabold">{t.title}</h1>
        <p className="max-w-prose text-lead">{t.text}</p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-11 items-center rounded-pill bg-ink px-6 font-medium text-paper hover:bg-ink-soft"
          >
            {t.reload}
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center rounded-pill border-2 border-ink px-6 font-medium hover:bg-ink hover:text-paper"
          >
            {t.home}
          </a>
        </div>
      </div>
    </section>
  );
}

export default class ErrorBoundary extends Component {
  state = { error: null, key: this.props.resetKey };

  static getDerivedStateFromError(error) {
    return { error };
  }

  static getDerivedStateFromProps(props, state) {
    // navigating to another route clears the error
    return props.resetKey !== state.key ? { error: null, key: props.resetKey } : null;
  }

  componentDidCatch(error) {
    // visible in the console for debugging; nothing is sent anywhere (no tracking, DEMO_MODE site)
    console.warn('Hipz: page error caught by ErrorBoundary', error);
  }

  render() {
    if (this.state.error) return <ErrorPage chunk={isChunkError(this.state.error)} />;
    return this.props.children;
  }
}
