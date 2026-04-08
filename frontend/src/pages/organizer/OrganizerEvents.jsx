import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents, deleteEvent } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, formatDate } from '../../components/EventCard';
import { useToast } from '../../components/Toast';

const CATEGORY_COLORS = {
  Workshop:'#74b9ff', Seminar:'#a29bfe', Competition:'#fdcb6e',
  Cultural:'#55efc4', Sports:'#ff7675', Academic:'#6c5ce7', Social:'#fd79a8',
};

export default function OrganizerEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getEvents().then(evts => setEvents(evts.filter(e => e.organizerId === user?.id)));
  }, [user]);

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  async function handleDelete(id) {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    await deleteEvent(id);
    setEvents(ev => ev.filter(e => e.id !== id));
    toast('Event deleted');
  }

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>My Events</h1>
            <p className="page-subtitle">Manage your created events</p>
          </div>
          <Link to="/organizer/events/create" className="btn btn-primary">+ Create Event</Link>
        </div>

        <div style={{ marginBottom: 24 }}>
          <input placeholder="🔍  Search events…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 320 }} />
        </div>

        <div className="events-grid">
          {filtered.map(e => {
            const color = CATEGORY_COLORS[e.category] || '#74b9ff';
            const pct = Math.min(100, Math.round((e.registered / e.capacity) * 100));
            return (
              <div key={e.id} className="soft-card" style={{ '--course-color': color }}>
                <div className="card-top">
                  <div className="mood-badge">{e.category}</div>
                  <StatusBadge status={e.status} />
                </div>
                <h4 style={{ margin: '14px 0 6px', color: '#2d3436', fontSize: '1rem' }}>{e.title}</h4>
                <p style={{ fontSize: '0.82rem', color: '#888', lineHeight: 1.5, marginBottom: 14,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {e.description}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#636e72', marginBottom: 4 }}>📅 {formatDate(e.startDate)}</div>
                <div style={{ fontSize: '0.8rem', color: '#636e72', marginBottom: 14 }}>📍 {e.venueName}</div>

                <div className="progress-section">
                  <div className="progress-label">
                    <span>Capacity</span><strong>{e.registered}/{e.capacity}</strong>
                  </div>
                  <div className="soft-progress-bar">
                    <div className="soft-progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="soft-card-actions" style={{ marginTop: 16 }}>
                  <Link to={`/organizer/events/${e.id}`} className="soft-action-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Participants
                  </Link>
                  <Link to={`/organizer/events/${e.id}/edit`} className="soft-action-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                    Edit
                  </Link>
                  <button className="soft-action-btn" onClick={() => handleDelete(e.id)}
                    style={{ background: '#fff5f5', color: '#e74c3c' }}>Delete</button>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#b2bec3', padding: 60 }}>
              No events yet. <Link to="/organizer/events/create" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create one →</Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
