export default function Modal({ title, emoji, onClose, children }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-bubbly" onClick={e => e.stopPropagation()}>
        <div className="modal-header-soft">
          <div className="header-icon-title">
            {emoji && <span className="modal-emoji">{emoji}</span>}
            <h3>{title}</h3>
          </div>
          <button className="close-circle-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
