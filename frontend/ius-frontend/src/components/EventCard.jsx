import { useNavigate } from 'react-router-dom';
import './EventCard.css';

export default function EventCard({ event, actions }) {
  const navigate = useNavigate();
  const pct = Math.round((event.registered / event.capacity) * 100);
  const isFull = event.registered >= event.capacity;

  return (
    <div className="event-card">
      <div className="event-card-header">
        <span className={`badge badge-${categoryColor(event.category)}`}>{event.category}</span>
        <StatusBadge status={event.status} />
      </div>

      <h3 className="event-card-title">{event.title}</h3>
      <p className="event-card-desc">{event.description}</p>

      <div className="event-card-meta">
        <div className="event-meta-item">
          <span className="meta-icon">📅</span>
          {formatDate(event.startDate)}
        </div>
        <div className="event-meta-item">
          <span className="meta-icon">📍</span>
          {event.venueName}
        </div>
        <div className="event-meta-item">
          <span className="meta-icon">👤</span>
          {event.organizerName}
        </div>
      </div>

      <div className="event-capacity">
        <div className="event-capacity-row">
          <span className="text-sm text-dim">Capacity</span>
          <span className="text-sm">{event.registered} / {event.capacity}</span>
        </div>
        <div className="capacity-bar">
          <div
            className="capacity-fill"
            style={{ width: `${pct}%`, background: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--yellow)' : 'var(--primary)' }}
          />
        </div>
        {isFull && <span className="text-xs" style={{ color: 'var(--yellow)' }}>⚠ Waitlist available</span>}
      </div>

      {actions && <div className="event-card-actions">{actions}</div>}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = { Upcoming: 'green', Ongoing: 'yellow', Past: 'red', Cancelled: 'red' };
  return <span className={`badge badge-${map[status] || 'blue'}`}>{status}</span>;
}

function categoryColor(cat) {
  const map = { Workshop:'blue', Seminar:'purple', Competition:'yellow', Cultural:'green', Sports:'red', Academic:'blue', Social:'green' };
  return map[cat] || 'blue';
}

export function formatDate(dt) {
  return new Date(dt).toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
}
