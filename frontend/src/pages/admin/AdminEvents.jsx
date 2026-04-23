import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents, deleteEvent } from '../../api/index';
import { StatusBadge, formatDate } from '../../components/EventCard';
import { useToast } from '../../components/Toast';

export default function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { toast } = useToast();

  useEffect(() => { getEvents().then(setEvents); }, []);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleDelete(id) {
    if (!confirm('Delete this event?')) return;
    await deleteEvent(id);
    setEvents(ev => ev.filter(e => e.id !== id));
    toast('Event deleted');
  }

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>All Events</h1>
            <p className="page-subtitle">Manage every event on the platform</p>
          </div>
          <span className="badge badge-blue">{filtered.length} events</span>
        </div>

        <div className="content-card">
          <div className="filter-row">
            <input placeholder="Search events…" value={search}
              onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ maxWidth: 180 }}>
              <option value="All">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Past">Past</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th><th>Category</th><th>Date</th>
                  <th>Venue</th><th>Capacity</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 700, color: '#2d3436', maxWidth: 200 }}>{e.title}</td>
                    <td><span className="badge badge-blue">{e.category}</span></td>
                    <td className="text-dim text-sm">{formatDate(e.startDate)}</td>
                    <td className="text-dim text-sm">{e.venueName}</td>
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
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} style={{ textAlign: 'center', color: '#b2bec3', padding: 40 }}>
                    No events found
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
