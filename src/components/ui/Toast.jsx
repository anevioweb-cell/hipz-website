import { useCallback, useMemo, useRef, useState } from 'react';
import { ToastContext } from './toast-context.js';

// Polite live region. show(message) displays a message for `ms` then hides it.
export default function ToastProvider({ children }) {
  const [message, setMessage] = useState('');
  const timer = useRef(null);

  const show = useCallback((text, ms = 4000) => {
    setMessage(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMessage(''), ms);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-gutter"
      >
        {message && (
          <p className="pointer-events-auto rounded-pill bg-ink px-6 py-3 text-paper shadow-pop">
            {message}
          </p>
        )}
      </div>
    </ToastContext.Provider>
  );
}
