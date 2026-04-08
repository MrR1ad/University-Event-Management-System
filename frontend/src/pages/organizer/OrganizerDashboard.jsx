import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, formatDate } from '../../components/EventCard';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(evts => setEvents(evts.filter(e => e.organizerId === user?.id)));
  }, [user]);

  const totalRegs = events.reduce((s, e) => s + e.registered, 0);
  const upcoming  = events.filter(e => e.status === 'Upcoming').length;
  const avgFill   = events.length
    ? Math.round(events.reduce((s, e) => s + (e.registered / e.capacity) * 100, 0) / events.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        {/* Hero card matching the design */}
        <div style={{
          background: 'linear-gradient(135deg, var(--accent) 0%, #4facfe 100%)',
          borderRadius: 35, padding: 'clamp(28px,4vw,50px)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 24, boxShadow: '0 20px 40px rgba(0,51,102,0.25)',
          flexWrap: 'wrap', gap: 20,
        }}>
          <div>
            <div style={{ background: 'rgba(255,255,255,0.2)', display: 'inline-block',
              padding: '5px 14px', borderRadius: 10, fontSize: '0.8rem', fontWeight: 700,
              color: 'white', marginBottom: 12 }}>
              Event Organizer
            </div>
            <h1 style={{ color: 'white', fontSize: 'clamp(1.4rem,3vw,2.2rem)', margin: '0 0 18px', fontWeight: 800 }}>
              Welcome back,<br />{user?.name?.split(' ')[0]} 🎪
            </h1>
            <Link to="/organizer/events/create" className="btn" style={{
              background: 'white', color: 'var(--accent)', fontWeight: 800, borderRadius: 50 }}>
              + Create Event
            </Link>
          </div>
          <span style={{ fontSize: 'clamp(4rem,8vw,7rem)', animation: 'float 3s ease-in-out infinite' }}>🎪</span>
        </div>

        <div className="stats-grid">
          {[
            { label: 'My Events',         value: events.length, icon: '📅' },
            { label: 'Upcoming',          value: upcoming,      icon: '🔔' },
            { label: 'Total Registered',  value: totalRegs,     icon: '🎟' },
            { label: 'Avg Fill Rate',     value: `${avgFill}%`, icon: '📈' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{s.icon}</div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}</div>
            </div>
          ))}
        </div>

        <div className="content-card">
          <div className="page-header" style={{ marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, color: '#2d3436', fontSize: '1.1rem' }}>My Events</h2>
            <Link to="/organizer/events" className="btn btn-ghost btn-sm">View all →</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Event</th><th>Date</th><th>Registered</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 700, color: '#2d3436' }}>{e.title}</td>
                    <td className="text-dim text-sm">{formatDate(e.startDate)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div className="capacity-bar" style={{ width: 60, flex: 'none' }}>
                          <div className="capacity-fill" style={{
                            width: `${Math.min(100, Math.round((e.registered / e.capacity) * 100))}%`,
                            background: 'var(--accent)'
                          }} />
                        </div>
                        <span className="text-sm">{e.registered}/{e.capacity}</span>
                      </div>
                    </td>
                    <td><StatusBadge status={e.status} /></td>
                    <td><Link to={`/organizer/events/${e.id}`} className="btn btn-ghost btn-sm">Detail →</Link></td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: '#b2bec3', padding: 40 }}>
                    No events yet. <Link to="/organizer/events/create" style={{ color: 'var(--accent)', fontWeight: 700 }}>Create one →</Link>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
