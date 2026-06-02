import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { getVenues, createVenue, updateVenue, deleteVenue } from "../../api/index";
import Modal from "../../components/Modal";
import { useToast } from "../../components/Toast";

export default function AdminVenues() {
  const [venues, setVenues] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", capacity: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getVenues().then(setVenues);
  }, []);

  function set(f, v) {
    setForm((x) => ({ ...x, [f]: v }));
  }

  function openCreate() {
    setForm({ name: "", location: "", capacity: "" });
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(v) {
    setForm({ name: v.name, location: v.location, capacity: v.capacity });
    setEditId(v.id);
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: form.name,
        location: form.location,
        capacity: Number(form.capacity),
      };

      if (editId) {
        const updated = await updateVenue(editId, payload);
        setVenues((vs) => vs.map((v) => (v.id === editId ? updated : v)));
        toast("Venue updated");
      } else {
        const created = await createVenue(payload);
        setVenues((vs) => [...vs, created]);
        toast("Venue created");
      }

      setShowModal(false);
    } catch (err) {
      toast(err.response?.data?.message || "Failed to save venue", "error");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this venue?")) return;

    try {
      await deleteVenue(id);
      setVenues((vs) => vs.filter((v) => v.id !== id));
      toast("Venue deleted");
    } catch (err) {
      toast("Failed to delete venue", "error");
    }
  }

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>Venues</h1>
            <p className="page-subtitle">Manage campus event locations</p>
          </div>

          <button className="btn btn-primary" onClick={openCreate}>
            Add Venue
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {venues.map((v) => (
            <div
              key={v.id}
              className="soft-card"
              style={{ "--course-color": "#74b9ff" }}
            >
              <div className="card-top" style={{ marginBottom: 16 }}>
                <div className="mood-badge">Venue</div>
                <span className="badge badge-blue">{v.capacity} cap.</span>
              </div>

              <h4
                style={{
                  margin: "0 0 6px",
                  color: "#2d3436",
                  fontWeight: 800,
                }}
              >
                {v.name}
              </h4>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  marginBottom: 20,
                }}
              >
                {v.location}
              </p>

              <div className="soft-card-actions">
                <button className="soft-action-btn" onClick={() => openEdit(v)}>
                  Edit
                </button>

                <button
                  className="soft-action-btn"
                  onClick={() => handleDelete(v.id)}
                  style={{ background: "#fff5f5", color: "#e74c3c" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}

          {venues.length === 0 && (
            <div
              style={{
                gridColumn: "1/-1",
                textAlign: "center",
                color: "#b2bec3",
                padding: 60,
              }}
            >
              No venues yet. Click <strong>Add Venue</strong> to create one.
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal
          title={editId ? "Edit Venue" : "Add Venue"}
          onClose={() => setShowModal(false)}
        >
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Venue Name</label>
              <input
                placeholder="Main Auditorium"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input
                placeholder="Building A, Floor 1"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Capacity</label>
              <input
                type="number"
                placeholder="100"
                value={form.capacity}
                onChange={(e) => set("capacity", e.target.value)}
                required
                min="1"
              />
            </div>

            <div
              className="flex gap-3"
              style={{ justifyContent: "flex-end", marginTop: 8 }}
            >
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Saving…" : "Save Venue"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </DashboardLayout>
  );
}