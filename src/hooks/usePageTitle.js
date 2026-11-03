import { useEffect } from 'react';

// Sets document.title for a page (noindex stays in index.html).
export function usePageTitle(title) {
  useEffect(() => {
    const previous = document.title;
    document.title = title;
    return () => {
      document.title = previous;
    };
  }, [title]);
}
