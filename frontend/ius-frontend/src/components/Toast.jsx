import { useState, useCallback } from 'react';
import './Toast.css';

let _show = null;

export function useToast() {
  return { toast: (msg, type = 'success') => _show?.(msg, type) };
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  _show = useCallback((msg, type) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  }, []);

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          {t.type === 'success' ? '✓' : '✕'} {t.msg}
        </div>
      ))}
    </div>
  );
}
