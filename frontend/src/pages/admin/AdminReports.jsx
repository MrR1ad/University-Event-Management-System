import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents, getUsers } from '../../api/index';
import { MOCK_REGISTRATIONS, MOCK_CATEGORIES } from '../../mockData';

export default function AdminReports() {
  const [events, setEvents] = useState([]);
  const [users, setUsers]   = useState([]);

  useEffect(() => {
    getEvents().then(setEvents);
    getUsers().then(setUsers);
  }, []);

  const eventReport = events.map(e => {
    const regs      = MOCK_REGISTRATIONS.filter(r => r.eventId === e.id);
    const checkedIn = regs.filter(r => r.checkedIn).length;
    const fillRate  = Math.round((e.registered / e.capacity) * 100);
    return { ...e, regCount: regs.length, checkedIn, fillRate };
  });

  const catReport = MOCK_CATEGORIES.map(cat => {
    const catEvts = events.filter(e => e.category === cat);
    return { category: cat, events: catEvts.length, registrations: catEvts.reduce((s, e) => s + e.registered, 0) };
  }).filter(c => c.events > 0);

  const roleCount = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});

  const avgFill = eventReport.length
    ? Math.round(eventReport.reduce((s, e) => s + e.fillRate, 0) / eventReport.length)
    : 0;

  const barColor = (pct) => pct >= 90 ? '#00b894' : pct >= 60 ? 'var(--accent)' : '#fdcb6e';

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>Reports & Analytics</h1>
            <p className="page-subtitle">Platform-wide data and attendance</p>
          </div>
        </div>

        <div className="stats-grid">
          {[
            { label: 'Avg Fill Rate',     value: `${avgFill}%`,  icon: '📈' },
            { label: 'Total Check-ins',   value: eventReport.reduce((s,e) => s+e.checkedIn, 0), icon: '✅' },
            { label: 'Active Students',   value: users.filter(u => u.role==='Student' && u.status==='Active').length, icon: '🎓' },
            { label: 'Active Organizers', value: users.filter(u => u.role==='Organizer').length, icon: '🎪' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: '1.5rem', marginBottom: 10 }}>{s.icon}</div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* Event attendance */}
        <div className="content-card" style={{ marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, color: '#2d3436', fontSize: '1.1rem', marginBottom: 20 }}>
            Event Attendance Report
          </h2>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Event</th><th>Category</th><th>Cap.</th><th>Registered</th><th>Checked In</th><th>Fill Rate</th></tr>
              </thead>
              <tbody>
                {eventReport.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 700, color: '#2d3436' }}>{e.title}</td>
                    <td><span className="badge badge-blue">{e.category}</span></td>
                    <td className="text-sm">{e.capacity}</td>
                    <td className="text-sm">{e.registered}</td>
                    <td><span className="badge badge-green">{e.checkedIn}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="capacity-bar" style={{ width: 80, flex: 'none' }}>
                          <div className="capacity-fill" style={{ width: `${e.fillRate}%`, background: barColor(e.fillRate) }} />
                        </div>
                        <span className="text-sm" style={{ fontWeight: 700 }}>{e.fillRate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Two-col */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div className="content-card">
            <h2 style={{ fontWeight: 800, color: '#2d3436', fontSize: '1.1rem', marginBottom: 20 }}>By Category</h2>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Category</th><th>Events</th><th>Registrations</th></tr></thead>
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

          <div className="content-card">
            <h2 style={{ fontWeight: 800, color: '#2d3436', fontSize: '1.1rem', marginBottom: 20 }}>User Roles</h2>
            {Object.entries(roleCount).map(([role, count]) => {
              const pct = Math.round((count / users.length) * 100);
              const colors = { Admin: '#e74c3c', Organizer: '#6c5ce7', Student: 'var(--accent)' };
              return (
                <div key={role} style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#2d3436' }}>{role}</span>
                    <span className="text-sm text-dim">{count} ({pct}%)</span>
                  </div>
                  <div className="capacity-bar">
                    <div className="capacity-fill" style={{ width: `${pct}%`, background: colors[role] || 'var(--accent)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
