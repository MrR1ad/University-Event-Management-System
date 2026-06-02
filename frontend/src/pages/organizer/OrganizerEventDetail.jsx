import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getEventById, getRegistrationsByEvent, checkInParticipant } from '../../api/index';
import { StatusBadge, formatDate } from '../../components/EventCard';
import { useToast } from '../../components/Toast';

export default function OrganizerEventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    getEventById(Number(id)).then(setEvent);
    getRegistrationsByEvent(Number(id)).then(setRegistrations);
  }, [id]);

  async function handleCheckIn(regId) {
    await checkInParticipant(regId);
    setRegistrations(rs => rs.map(r => r.id === regId ? { ...r, checkedIn: true } : r));
    toast('Checked in!');
  }

  const filtered = registrations.filter(r =>
    r.userName.toLowerCase().includes(search.toLowerCase())
  );
  const checkedInCount = registrations.filter(r => r.checkedIn).length;

  if (!event) return <DashboardLayout><p style={{ color: '#b2bec3', padding: 40 }}>Loading…</p></DashboardLayout>;

  const pct = Math.min(100, Math.round((event.registered / event.capacity) * 100));

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>{event.title}</h1>
            <p className="page-subtitle">Participants & check-in management</p>
          </div>
          <Link to={`/organizer/events/${id}/edit`} className="btn btn-ghost">Edit Event</Link>
        </div>

        {/* Event summary pills */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          {[
            { label: 'Date',       value: formatDate(event.startDate) },
            { label: 'Venue',      value: event.venueName },
            { label: 'Registered', value: `${event.registered}/${event.capacity}` },
            { label: 'Checked In', value: `${checkedInCount}/${registrations.length}` },
          ].map(p => (
            <div key={p.label} style={{
              background: 'white', borderRadius: 20, padding: '12px 20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.8)',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b2bec3',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{p.label}</div>
              <div style={{ fontWeight: 700, color: '#2d3436', fontSize: '0.95rem' }}>{p.value}</div>
            </div>
          ))}
          <div style={{ background: 'white', borderRadius: 20, padding: '12px 20px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.8)' }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#b2bec3',
              textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Fill Rate</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div className="capacity-bar" style={{ width: 80, flex: 'none' }}>
                <div className="capacity-fill" style={{ width: `${pct}%`, background: pct >= 80 ? '#00b894' : 'var(--accent)' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#2d3436' }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* Participants table */}
        <div className="content-card">
          <div className="page-header" style={{ marginBottom: 20 }}>
            <h2 style={{ fontWeight: 800, color: '#2d3436', fontSize: '1.1rem' }}>
              Participants ({registrations.length})
            </h2>
            <input placeholder="Search participants…" value={search}
              onChange={e => setSearch(e.target.value)} style={{ maxWidth: 240 }} />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Registered At</th><th>Status</th><th>Check-in</th></tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="flex-center gap-2">
                        <div className="user-avatar-sm">{r.userName.charAt(0)}</div>
                        <span style={{ fontWeight: 700, color: '#2d3436' }}>{r.userName}</span>
                      </div>
                    </td>
                    <td className="text-dim text-sm">{formatDate(r.registeredAt)}</td>
                    <td>
                      <span className={`badge ${r.status === 'Confirmed' ? 'badge-green' : 'badge-yellow'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      {r.checkedIn
                        ? <span className="badge badge-green">✓ Checked In</span>
                        : <button className="btn btn-ghost btn-sm" onClick={() => handleCheckIn(r.id)}>Check In</button>
                      }
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#b2bec3', padding: 40 }}>No participants yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
