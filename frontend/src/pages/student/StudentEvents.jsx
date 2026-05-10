import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getEvents } from '../../api/index';
import EventCard from '../../components/EventCard';
import { MOCK_CATEGORIES } from '../../mockData';

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('Upcoming');
  const navigate = useNavigate();

  useEffect(() => { getEvents().then(setEvents); }, []);

  const filtered = events.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.description.toLowerCase().includes(search.toLowerCase());
    const matchCat    = filterCategory === 'All' || e.category === filterCategory;
    const matchStatus = filterStatus === 'All'   || e.status === filterStatus;
    return matchSearch && matchCat && matchStatus;
  });

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>Browse Events</h1>
            <p className="page-subtitle">Discover and register for campus events</p>
          </div>
          <span className="badge badge-blue">{filtered.length} events</span>
        </div>

        <div className="filter-row">
          <input placeholder="🔍  Search events…" value={search}
            onChange={e => setSearch(e.target.value)} style={{ maxWidth: 280 }} />
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} style={{ maxWidth: 180 }}>
            <option value="All">All Categories</option>
            {MOCK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={{ maxWidth: 160 }}>
            <option value="All">All Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Past">Past</option>
          </select>
        </div>

        <div className="events-grid">
          {filtered.map(e => (
            <EventCard key={e.id} event={e} actions={
              <button className="soft-action-btn primary" style={{ flex: 1 }}
                onClick={() => navigate(`/student/events/${e.id}`)}>
                View Details
              </button>
            } />
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#b2bec3', padding: 60 }}>
              No events match your filters.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
