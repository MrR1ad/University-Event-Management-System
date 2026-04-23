import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getMyRegistrations, cancelRegistration } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../components/EventCard';
import { useToast } from '../../components/Toast';

const CATEGORY_COLORS = {
  Workshop:'#74b9ff', Seminar:'#a29bfe', Competition:'#fdcb6e',
  Cultural:'#55efc4', Sports:'#ff7675', Academic:'#6c5ce7', Social:'#fd79a8',
};

export default function StudentRegistrations() {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [filter, setFilter] = useState('All');
  const { toast } = useToast();

  useEffect(() => { getMyRegistrations(user?.id).then(setRegistrations); }, [user]);

  const filtered = filter === 'All' ? registrations
    : registrations.filter(r => r.status === filter);

  async function handleCancel(reg) {
    if (!confirm(`Cancel "${reg.event?.title}"?`)) return;
    await cancelRegistration(reg.id);
    setRegistrations(rs => rs.filter(r => r.id !== reg.id));
    toast('Registration cancelled', 'info');
  }

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>My Registrations</h1>
            <p className="page-subtitle">Events you've signed up for</p>
          </div>
          <Link to="/student/events" className="btn btn-primary">Browse Events</Link>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {['All', 'Confirmed', 'Waitlisted'].map(f => (
            <button key={f}
              className="btn"
              style={{
                borderRadius: 50,
                background: filter === f ? 'var(--accent)' : 'white',
                color: filter === f ? 'white' : '#555',
                border: '1px solid rgba(0,0,0,0.08)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
              }}
              onClick={() => setFilter(f)}>
              {f}
              <span style={{
                background: filter === f ? 'rgba(255,255,255,0.25)' : 'rgba(0,51,102,0.1)',
                color: filter === f ? 'white' : 'var(--accent)',
                borderRadius: 999, padding: '2px 8px', fontSize: '0.75rem', fontWeight: 800, marginLeft: 4
              }}>
                {f === 'All' ? registrations.length : registrations.filter(r => r.status === f).length}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="content-card" style={{ textAlign: 'center', padding: 60, color: '#b2bec3' }}>
            No registrations found. <Link to="/student/events" style={{ color: 'var(--accent)', fontWeight: 700 }}>Browse events →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filtered.map(r => {
              const color = CATEGORY_COLORS[r.event?.category] || '#74b9ff';
              return (
                <div key={r.id} className="soft-card" style={{ '--course-color': color, flexDirection: 'row', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 18, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                    🎟
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 6 }}>
                      <span className="badge badge-blue">{r.event?.category}</span>
                      <span className={`badge ${r.status === 'Confirmed' ? 'badge-green' : 'badge-yellow'}`}>{r.status}</span>
                    </div>
                    <h4 style={{ margin: '0 0 6px', color: '#2d3436', fontWeight: 800, fontSize: '0.98rem' }}>{r.event?.title}</h4>
                    <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>📅 {formatDate(r.event?.startDate)}</span>
                      <span style={{ fontSize: '0.8rem', color: '#888' }}>📍 {r.event?.venueName}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                    <Link to={`/student/events/${r.eventId}`} className="soft-action-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                      View
                    </Link>
                    {r.event?.status !== 'Past' && (
                      <button className="soft-action-btn" onClick={() => handleCancel(r)}
                        style={{ background: '#fff5f5', color: '#e74c3c' }}>Cancel</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
