import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents, deleteEvent } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, formatDate } from '../../components/EventCard';
import { useToast } from '../../components/Toast';

export default function OrganizerEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getEvents().then(evts => setEvents(evts.filter(e => e.organizerId === user?.id)));
  }, [user]);

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleDelete(id) {
    if (!confirm('Delete this event? This cannot be undone.')) return;
    await deleteEvent(id);
    setEvents(ev => ev.filter(e => e.id !== id));
    toast('Event deleted');
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>My Events</h1>
          <p className="page-subtitle">Manage your created events</p>
        </div>
        <Link to="/organizer/events/create" className="btn btn-primary">+ Create Event</Link>
      </div>

      <div className="card">
        <input
          placeholder="Search events…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 300, marginBottom: 16 }}
        />

        <div className="events-grid">
          {filtered.map(e => (
            <div key={e.id} className="card event-list-card">
              <div className="flex-center gap-2" style={{ marginBottom: 10 }}>
                <span className="badge badge-blue">{e.category}</span>
                <StatusBadge status={e.status} />
              </div>
              <h3 style={{ marginBottom: 6 }}>{e.title}</h3>
              <p className="text-dim text-sm" style={{ marginBottom: 12, lineHeight: 1.5 }}>{e.description}</p>
              <div className="text-sm text-dim" style={{ marginBottom: 4 }}>📅 {formatDate(e.startDate)}</div>
              <div className="text-sm text-dim" style={{ marginBottom: 12 }}>📍 {e.venueName}</div>

              <div className="capacity-bar" style={{ marginBottom: 6 }}>
                <div
                  className="capacity-fill"
                  style={{
                    width: `${Math.min(100, Math.round((e.registered / e.capacity) * 100))}%`,
                    background: 'var(--primary)'
                  }}
                />
              </div>
              <div className="text-xs text-dim" style={{ marginBottom: 16 }}>
                {e.registered}/{e.capacity} registered
              </div>

              <div className="flex gap-2">
                <Link to={`/organizer/events/${e.id}`} className="btn btn-ghost btn-sm">Participants</Link>
                <Link to={`/organizer/events/${e.id}/edit`} className="btn btn-ghost btn-sm">Edit</Link>
                <button className="btn btn-danger btn-sm ml-auto" onClick={() => handleDelete(e.id)}>Delete</button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--text-dim)', padding: 48 }}>
              No events found. <Link to="/organizer/events/create">Create one →</Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
