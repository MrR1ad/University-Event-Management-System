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

  function set(field, val) { setForm(f => ({ ...f, [field]: val })); }

  function openCreate() {
    setForm({ name: '', location: '', capacity: '' });
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(v) {
    setForm({ name: v.name, location: v.location, capacity: v.capacity });
    setEditId(v.id);
    setShowModal(true);
  }

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
      <div className="page-header">
        <div>
          <h1>Venues</h1>
          <p className="page-subtitle">Manage campus event locations</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Venue</button>
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Capacity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(v => (
                <tr key={v.id}>
                  <td style={{ fontWeight: 500, color: 'var(--text-head)' }}>{v.name}</td>
                  <td className="text-dim text-sm">{v.location}</td>
                  <td className="text-sm">{v.capacity}</td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn btn-ghost btn-sm" onClick={() => openEdit(v)}>Edit</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(v.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <Modal title={editId ? 'Edit Venue' : 'Add Venue'} onClose={() => setShowModal(false)}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Venue Name</label>
              <input placeholder="Main Auditorium" value={form.name} onChange={e => set('name', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Location</label>
              <input placeholder="Building A, Floor 1" value={form.location} onChange={e => set('location', e.target.value)} required />
            </div>
            <div className="form-group">
              <label>Capacity</label>
              <input type="number" placeholder="100" value={form.capacity} onChange={e => set('capacity', e.target.value)} required min="1" />
            </div>
            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Venue</button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}
