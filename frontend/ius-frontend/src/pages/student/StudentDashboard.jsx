import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getMyRegistrations, getEvents } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, formatDate } from '../../components/EventCard';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [myRegs, setMyRegs] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    getMyRegistrations(user?.id).then(setMyRegs);
    getEvents().then(evts =>
      setUpcoming(evts.filter(e => e.status === 'Upcoming').slice(0, 3))
    );
  }, [user]);

  const confirmedRegs = myRegs.filter(r => r.status === 'Confirmed');
  const waitlistedRegs = myRegs.filter(r => r.status === 'Waitlisted');

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Hello, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="page-subtitle">Your upcoming campus events</p>
        </div>
        <Link to="/student/events" className="btn btn-primary">Browse Events</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">Registered</div>
          <div className="stat-card-value">{confirmedRegs.length}</div>
          <div className="stat-card-sub">Confirmed events</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Waitlisted</div>
          <div className="stat-card-value">{waitlistedRegs.length}</div>
          <div className="stat-card-sub">Pending spots</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Available Events</div>
          <div className="stat-card-value">{upcoming.length}</div>
          <div className="stat-card-sub">Open for registration</div>
        </div>
      </div>

      {/* My upcoming registrations */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h2>My Registrations</h2>
          <Link to="/student/registrations" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        {myRegs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 32 }}>
            You haven't registered for any events yet.{' '}
            <Link to="/student/events">Browse events →</Link>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Event</th><th>Date</th><th>Venue</th><th>Status</th></tr>
              </thead>
              <tbody>
                {myRegs.slice(0, 4).map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, color: 'var(--text-head)' }}>{r.event?.title}</td>
                    <td className="text-dim text-sm">{formatDate(r.event?.startDate)}</td>
                    <td className="text-dim text-sm">{r.event?.venueName}</td>
                    <td>
                      <span className={`badge ${r.status === 'Confirmed' ? 'badge-green' : 'badge-yellow'}`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Featured upcoming events */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h2>Upcoming Events</h2>
          <Link to="/student/events" className="btn btn-ghost btn-sm">See all →</Link>
        </div>
        <div className="events-grid">
          {upcoming.map(e => (
            <div key={e.id} className="card event-list-card" style={{ background: 'var(--bg-hover)' }}>
              <div className="flex-center gap-2" style={{ marginBottom: 8 }}>
                <span className="badge badge-blue">{e.category}</span>
              </div>
              <h3 style={{ marginBottom: 6, fontSize: '0.95rem' }}>{e.title}</h3>
              <div className="text-sm text-dim" style={{ marginBottom: 4 }}>📅 {formatDate(e.startDate)}</div>
              <div className="text-sm text-dim" style={{ marginBottom: 12 }}>📍 {e.venueName}</div>
              <Link to={`/student/events/${e.id}`} className="btn btn-ghost btn-sm">View & Register</Link>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
