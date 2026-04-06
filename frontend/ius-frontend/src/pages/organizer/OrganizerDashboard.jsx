import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, formatDate } from '../../components/EventCard';
import { MOCK_REGISTRATIONS } from '../../mockData';

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    getEvents().then(evts => setEvents(evts.filter(e => e.organizerId === user?.id)));
  }, [user]);

  const totalRegs = events.reduce((s, e) => s + e.registered, 0);
  const upcoming = events.filter(e => e.status === 'Upcoming').length;
  const avgFill = events.length
    ? Math.round(events.reduce((s, e) => s + (e.registered / e.capacity) * 100, 0) / events.length)
    : 0;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>My Dashboard</h1>
          <p className="page-subtitle">Overview of your events</p>
        </div>
        <Link to="/organizer/events/create" className="btn btn-primary">+ Create Event</Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-label">My Events</div>
          <div className="stat-card-value">{events.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Upcoming</div>
          <div className="stat-card-value">{upcoming}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Registrations</div>
          <div className="stat-card-value">{totalRegs}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Avg Fill Rate</div>
          <div className="stat-card-value">{avgFill}%</div>
        </div>
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h2>My Events</h2>
          <Link to="/organizer/events" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Registered</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {events.slice(0, 5).map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-head)' }}>{e.title}</td>
                  <td className="text-dim text-sm">{formatDate(e.startDate)}</td>
                  <td className="text-dim text-sm">{e.venueName}</td>
                  <td className="text-sm">{e.registered}/{e.capacity}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td>
                    <Link to={`/organizer/events/${e.id}`} className="btn btn-ghost btn-sm">Detail →</Link>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 32 }}>
                  No events yet. <Link to="/organizer/events/create">Create your first event →</Link>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
