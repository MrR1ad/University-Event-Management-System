import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getMyRegistrations, cancelRegistration } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../components/EventCard';
import { useToast } from '../../components/Toast';

export default function StudentRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('All');
  const { toast } = useToast();

  useEffect(() => {
    getMyRegistrations(user?.id).then(setRegistrations);
  }, [user]);

  const filtered = registrations.filter(r => {
    if (filter === 'All') return true;
    if (filter === 'Confirmed') return r.status === 'Confirmed';
    if (filter === 'Waitlisted') return r.status === 'Waitlisted';
    return true;
  });

  async function handleCancel(reg) {
    if (!confirm(`Cancel registration for "${reg.event?.title}"?`)) return;
    await cancelRegistration(reg.id);
    setRegistrations(rs => rs.filter(r => r.id !== reg.id));
    toast('Registration cancelled', 'info');
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>My Registrations</h1>
          <p className="page-subtitle">Events you've signed up for</p>
        </div>
        <Link to="/student/events" className="btn btn-primary">Browse Events</Link>
      </div>

      {/* Filter tabs */}
      <div className="filter-tabs" style={{ marginBottom: 20 }}>
        {['All', 'Confirmed', 'Waitlisted'].map(f => (
          <button
            key={f}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => setFilter(f)}
          >
            {f}
            <span className="badge badge-blue" style={{ fontSize: 11, padding: '1px 7px' }}>
              {f === 'All' ? registrations.length
                : registrations.filter(r => r.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--text-dim)' }}>
          No registrations found.{' '}
          <Link to="/student/events">Browse and register for events →</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map(r => (
            <div key={r.id} className="card reg-row">
              <div className="reg-row-info">
                <div className="flex-center gap-2" style={{ marginBottom: 6 }}>
                  <span className="badge badge-blue">{r.event?.category}</span>
                  <span className={`badge ${r.status === 'Confirmed' ? 'badge-green' : 'badge-yellow'}`}>
                    {r.status}
                  </span>
                </div>
                <h3 style={{ marginBottom: 4 }}>{r.event?.title}</h3>
                <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                  <span className="text-sm text-dim">📅 {formatDate(r.event?.startDate)}</span>
                  <span className="text-sm text-dim">📍 {r.event?.venueName}</span>
                  <span className="text-sm text-dim">Registered: {formatDate(r.registeredAt)}</span>
                </div>
              </div>
              <div className="reg-row-actions">
                <Link to={`/student/events/${r.eventId}`} className="btn btn-ghost btn-sm">View Event</Link>
                {r.event?.status !== 'Past' && (
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(r)}>Cancel</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
