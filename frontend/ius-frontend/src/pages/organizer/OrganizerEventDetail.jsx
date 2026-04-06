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
    toast('Checked in!', 'success');
  }

  const filtered = registrations.filter(r =>
    r.userName.toLowerCase().includes(search.toLowerCase())
  );

  const checkedInCount = registrations.filter(r => r.checkedIn).length;

  if (!event) return <DashboardLayout><p style={{ color: 'var(--text-dim)', padding: 32 }}>Loading…</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1>{event.title}</h1>
          <p className="page-subtitle">Participant management & check-in</p>
        </div>
        <div className="flex gap-2">
          <Link to={`/organizer/events/${id}/edit`} className="btn btn-ghost">Edit Event</Link>
        </div>
      </div>

      {/* Event summary */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="event-detail-grid">
          <div>
            <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Date</div>
            <div className="text-sm" style={{ color: 'var(--text-head)' }}>{formatDate(event.startDate)} → {formatDate(event.endDate)}</div>
          </div>
          <div>
            <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Venue</div>
            <div className="text-sm" style={{ color: 'var(--text-head)' }}>{event.venueName}</div>
          </div>
          <div>
            <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Capacity</div>
            <div className="text-sm" style={{ color: 'var(--text-head)' }}>{event.registered} / {event.capacity}</div>
          </div>
          <div>
            <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Check-ins</div>
            <div className="text-sm" style={{ color: 'var(--green)' }}>{checkedInCount} / {registrations.length}</div>
          </div>
          <div>
            <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Status</div>
            <StatusBadge status={event.status} />
          </div>
          <div>
            <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Category</div>
            <span className="badge badge-blue">{event.category}</span>
          </div>
        </div>
      </div>

      {/* Participants */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: 16 }}>
          <h2>Participants ({registrations.length})</h2>
          <input
            placeholder="Search participants…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 240 }}
          />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Registered At</th>
                <th>Status</th>
                <th>Check-in</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="flex flex-center gap-2">
                      <div className="user-avatar-sm">{r.userName.charAt(0)}</div>
                      <span style={{ fontWeight: 500, color: 'var(--text-head)' }}>{r.userName}</span>
                    </div>
                  </td>
                  <td className="text-dim text-sm">{formatDate(r.registeredAt)}</td>
                  <td>
                    <span className={`badge ${r.status === 'Confirmed' ? 'badge-green' : 'badge-yellow'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.checkedIn ? (
                      <span className="badge badge-green">✓ Checked In</span>
                    ) : (
                      <button className="btn btn-ghost btn-sm" onClick={() => handleCheckIn(r.id)}>
                        Check In
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-dim)', padding: 32 }}>No participants yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
