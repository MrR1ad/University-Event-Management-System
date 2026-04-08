import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { createEvent, updateEvent, getEventById, getVenues } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/Toast';
import { MOCK_CATEGORIES } from '../../mockData';

export default function EventForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', category: 'Workshop',
    startDate: '', endDate: '', capacity: '', venueId: '', status: 'Upcoming',
  });

  useEffect(() => {
    getVenues().then(setVenues);
    if (isEdit) {
      getEventById(Number(id)).then(ev => {
        if (ev) setForm({
          title: ev.title, description: ev.description, category: ev.category,
          startDate: ev.startDate, endDate: ev.endDate, capacity: ev.capacity,
          venueId: ev.venueId, status: ev.status,
        });
      });
    }
  }, [id]);

  function set(f, v) { setForm(x => ({ ...x, [f]: v })); }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form, capacity: Number(form.capacity), venueId: Number(form.venueId),
        organizerId: user.id, organizerName: user.name,
        venueName: venues.find(v => v.id === Number(form.venueId))?.name || '',
      };
      if (isEdit) { await updateEvent(Number(id), payload); toast('Event updated!'); }
      else        { await createEvent(payload);             toast('Event created!'); }
      navigate('/organizer/events');
    } finally { setLoading(false); }
  }

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>{isEdit ? 'Edit Event' : 'Create Event'}</h1>
            <p className="page-subtitle">{isEdit ? 'Update event details' : 'Fill in the details for your new event'}</p>
          </div>
        </div>

        <div className="content-card" style={{ maxWidth: 740 }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Event Title</label>
              <input placeholder="e.g. AI Workshop Spring 2026"
                value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea rows={4}
                placeholder="Describe what participants will learn or experience…"
                value={form.description} onChange={e => set('description', e.target.value)} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={form.category} onChange={e => set('category', e.target.value)}>
                  {MOCK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={form.status} onChange={e => set('status', e.target.value)}>
                  {['Upcoming','Ongoing','Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date & Time</label>
                <input type="datetime-local" value={form.startDate}
                  onChange={e => set('startDate', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>End Date & Time</label>
                <input type="datetime-local" value={form.endDate}
                  onChange={e => set('endDate', e.target.value)} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Venue</label>
                <select value={form.venueId} onChange={e => set('venueId', e.target.value)} required>
                  <option value="">Select venue…</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name} (cap: {v.capacity})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Capacity</label>
                <input type="number" placeholder="50" value={form.capacity}
                  onChange={e => set('capacity', e.target.value)} required min="1" />
              </div>
            </div>

            <div className="flex gap-3" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => navigate('/organizer/events')}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving…' : isEdit ? 'Update Event' : 'Create Event'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
