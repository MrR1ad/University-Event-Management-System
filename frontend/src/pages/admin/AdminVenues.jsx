import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getVenues } from '../../api/index';
import Modal from '../../components/Modal';
import { useToast } from '../../components/Toast';

export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', capacity: '' });
  const [editId, setEditId] = useState(null);
  const { toast } = useToast();

  useEffect(() => { getVenues().then(setVenues); }, []);

  function set(f, v) { setForm(x => ({ ...x, [f]: v })); }

  function openCreate() { setForm({ name: '', location: '', capacity: '' }); setEditId(null); setShowModal(true); }
  function openEdit(v)   { setForm({ name: v.name, location: v.location, capacity: v.capacity }); setEditId(v.id); setShowModal(true); }

  function handleSave(e) {
    e.preventDefault();
    if (editId) {
      setVenues(vs => vs.map(v => v.id === editId ? { ...v, ...form, capacity: Number(form.capacity) } : v));
      toast('Venue updated');
    } else {
      setVenues(vs => [...vs, { id: Date.now(), ...form, capacity: Number(form.capacity) }]);
      toast('Venue created');
    }
    setShowModal(false);
  }

  function handleDelete(id) {
    if (!confirm('Delete this venue?')) return;
    setVenues(vs => vs.filter(v => v.id !== id));
    toast('Venue deleted');
  }

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>Venues</h1>
            <p className="page-subtitle">Manage campus event locations</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}>+ Add Venue</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {venues.map(v => (
            <div key={v.id} className="soft-card" style={{ '--course-color': '#74b9ff' }}>
              <div className="card-top" style={{ marginBottom: 16 }}>
                <div className="mood-badge">📍 Venue</div>
                <span className="badge badge-blue">{v.capacity} cap.</span>
              </div>
              <div className="course-icon-bg" style={{ fontSize: '1.8rem', marginBottom: 12 }}>🏛️</div>
              <h4 style={{ margin: '0 0 6px', color: '#2d3436', fontWeight: 800 }}>{v.name}</h4>
              <p style={{ fontSize: '0.85rem', color: '#888', marginBottom: 20 }}>{v.location}</p>
              <div className="soft-card-actions">
                <button className="soft-action-btn" onClick={() => openEdit(v)}>Edit</button>
                <button className="soft-action-btn primary" onClick={() => handleDelete(v.id)}
                  style={{ background: '#fff5f5', color: '#e74c3c' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <Modal title={editId ? 'Edit Venue' : 'Add Venue'} emoji="📍" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Venue Name</label>
              <input placeholder="Main Auditorium" value={form.name}
                onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input placeholder="Building A, Floor 1" value={form.location}
                onChange={e => set('location', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input type="number" placeholder="100" value={form.capacity}
                onChange={e => set('capacity', e.target.value)} required min="1" />
            </div>
            <div className="flex gap-3" style={{ justifyContent: 'flex-end', marginTop: 8 }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Venue</button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}
