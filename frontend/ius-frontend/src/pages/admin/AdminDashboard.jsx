import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getStats, getEvents } from '../../api/index';
import { StatusBadge, formatDate } from '../../components/EventCard';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    getStats().then(setStats);
    getEvents().then(evts => setRecentEvents(evts.slice(0, 5)));
  }, []);

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="page-subtitle">Platform overview and quick stats</p>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="Total Events"         value={stats?.totalEvents ?? '—'}         sub="All time" />
        <StatCard label="Upcoming Events"      value={stats?.upcomingEvents ?? '—'}      sub="Next 30 days" />
        <StatCard label="Total Users"          value={stats?.totalUsers ?? '—'}          sub="Registered accounts" />
        <StatCard label="Total Registrations"  value={stats?.totalRegistrations ?? '—'}  sub="Across all events" />
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h2>Recent Events</h2>
          <Link to="/admin/events" className="btn btn-ghost btn-sm">View all →</Link>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Date</th>
                <th>Organizer</th>
                <th>Capacity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-head)' }}>{e.title}</td>
                  <td className="text-dim text-sm">{formatDate(e.startDate)}</td>
                  <td className="text-dim text-sm">{e.organizerName}</td>
                  <td className="text-sm">{e.registered}/{e.capacity}</td>
                  <td><StatusBadge status={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      <div className="stat-card-sub">{sub}</div>
    </div>
  );
}
