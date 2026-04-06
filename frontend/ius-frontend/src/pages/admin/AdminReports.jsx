import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents, getUsers } from '../../api/index';
import { MOCK_REGISTRATIONS, MOCK_CATEGORIES } from '../../mockData';
import './Reports.css';

export default function AdminReports() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getEvents().then(setEvents);
    getUsers().then(setUsers);
  }, []);

  // Registrations per event
  const eventReport = events.map(e => {
    const regs = MOCK_REGISTRATIONS.filter(r => r.eventId === e.id);
    const checkedIn = regs.filter(r => r.checkedIn).length;
    const fillRate = Math.round((e.registered / e.capacity) * 100);
    return { ...e, registrations: regs.length, checkedIn, fillRate };
  });

  // Registrations per category
  const catReport = MOCK_CATEGORIES.map(cat => {
    const catEvents = events.filter(e => e.category === cat);
    const total = catEvents.reduce((s, e) => s + e.registered, 0);
    return { category: cat, events: catEvents.length, registrations: total };
  }).filter(c => c.events > 0);

  // Role distribution
  const roleCount = users.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1; return acc;
  }, {});

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="page-subtitle">Platform-wide attendance and participation data</p>
        </div>
      </div>

      {/* Summary row */}
      <div className="stats-grid" style={{ marginBottom: 28 }}>
        <div className="stat-card">
          <div className="stat-card-label">Avg Fill Rate</div>
          <div className="stat-card-value">
            {events.length ? Math.round(eventReport.reduce((s,e) => s + e.fillRate, 0) / events.length) : 0}%
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total Check-ins</div>
          <div className="stat-card-value">{eventReport.reduce((s,e) => s + e.checkedIn, 0)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Active Students</div>
          <div className="stat-card-value">{users.filter(u => u.role === 'Student' && u.status === 'Active').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Active Organizers</div>
          <div className="stat-card-value">{users.filter(u => u.role === 'Organizer').length}</div>
        </div>
      </div>

      {/* Event attendance table */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h2 style={{ marginBottom: 16 }}>Event Attendance Report</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Event</th>
                <th>Category</th>
                <th>Capacity</th>
                <th>Registered</th>
                <th>Checked In</th>
                <th>Fill Rate</th>
              </tr>
            </thead>
            <tbody>
              {eventReport.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-head)' }}>{e.title}</td>
                  <td><span className="badge badge-blue">{e.category}</span></td>
                  <td className="text-sm">{e.capacity}</td>
                  <td className="text-sm">{e.registered}</td>
                  <td className="text-sm">{e.checkedIn}</td>
                  <td>
                    <div className="report-fill-row">
                      <div className="report-bar-bg">
                        <div
                          className="report-bar-fill"
                          style={{
                            width: `${e.fillRate}%`,
                            background: e.fillRate >= 90 ? 'var(--green)' : e.fillRate >= 60 ? 'var(--primary)' : 'var(--yellow)'
                          }}
                        />
                      </div>
                      <span className="text-sm" style={{ minWidth: 36 }}>{e.fillRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="reports-two-col">
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>By Category</h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Category</th><th>Events</th><th>Total Registrations</th></tr>
              </thead>
              <tbody>
                {catReport.map(c => (
                  <tr key={c.category}>
                    <td><span className="badge badge-blue">{c.category}</span></td>
                    <td className="text-sm">{c.events}</td>
                    <td className="text-sm">{c.registrations}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 16 }}>User Roles</h2>
          {Object.entries(roleCount).map(([role, count]) => (
            <div key={role} className="role-report-row">
              <span className="text-sm" style={{ color: 'var(--text-head)', fontWeight: 500 }}>{role}</span>
              <div className="report-bar-bg" style={{ flex: 1, margin: '0 12px' }}>
                <div
                  className="report-bar-fill"
                  style={{
                    width: `${Math.round((count / users.length) * 100)}%`,
                    background: role === 'Admin' ? 'var(--red)' : role === 'Organizer' ? 'var(--purple)' : 'var(--primary)'
                  }}
                />
              </div>
              <span className="text-sm text-dim">{count} ({users.length ? Math.round((count/users.length)*100) : 0}%)</span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
