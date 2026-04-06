import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents, deleteEvent } from '../../api/index';
import { StatusBadge, formatDate } from '../../components/EventCard';
import { useToast } from '../../components/Toast';
import { MOCK_CATEGORIES } from '../../mockData';

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
      <div className="page-header">
        <div>
          <h1>All Events</h1>
          <p className="page-subtitle">Manage every event on the platform</p>
        </div>
      </div>

      <div className="card">
        <div className="filter-row">
          <input
            placeholder="Search events…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 280 }}
          />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Past">Past</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-wrap" style={{ marginTop: 16 }}>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Venue</th>
                <th>Capacity</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-head)' }}>{e.title}</td>
                  <td><span className="badge badge-blue">{e.category}</span></td>
                  <td className="text-dim text-sm">{formatDate(e.startDate)}</td>
                  <td className="text-dim text-sm">{e.venueName}</td>
                  <td className="text-sm">{e.registered}/{e.capacity}</td>
                  <td><StatusBadge status={e.status} /></td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(e.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 32 }}>No events found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
