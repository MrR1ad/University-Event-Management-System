import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getEventById, getMyRegistrations, registerForEvent, cancelRegistration } from '../../api/index';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge, formatDate } from '../../components/EventCard';
import { useToast } from '../../components/Toast';

export default function StudentEventDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState(null);
  const [myReg, setMyReg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getEventById(Number(id)).then(setEvent);
    getMyRegistrations(user?.id).then(regs => {
      setMyReg(regs.find(r => r.eventId === Number(id)) || null);
    });
  }, [id, user]);

  const isFull = event && event.registered >= event.capacity;
  const pct = event ? Math.round((event.registered / event.capacity) * 100) : 0;

  async function handleRegister() {
    setLoading(true);
    try {
      const reg = await registerForEvent(Number(id), user.id);
      setMyReg({ ...reg, event });
      setEvent(e => ({ ...e, registered: e.registered + 1 }));
      toast(isFull ? 'Added to waitlist!' : 'Successfully registered!');
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel your registration?')) return;
    setLoading(true);
    try {
      await cancelRegistration(myReg.id);
      setMyReg(null);
      setEvent(e => ({ ...e, registered: Math.max(0, e.registered - 1) }));
      toast('Registration cancelled', 'info');
    } finally {
      setLoading(false);
    }
  }

  if (!event) return <DashboardLayout><p style={{ color: 'var(--text-dim)', padding: 32 }}>Loading…</p></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="page-header">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/student/events')}>← Back</button>
      </div>

      <div className="event-detail-layout">
        {/* Main info */}
        <div>
          <div className="flex-center gap-2" style={{ marginBottom: 12 }}>
            <span className="badge badge-blue">{event.category}</span>
            <StatusBadge status={event.status} />
          </div>
          <h1 style={{ marginBottom: 12 }}>{event.title}</h1>
          <p style={{ color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 24 }}>{event.description}</p>

          <div className="card" style={{ marginBottom: 16 }}>
            <h3 style={{ marginBottom: 16 }}>Event Details</h3>
            <div className="event-detail-grid">
              <div>
                <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Start</div>
                <div className="text-sm" style={{ color: 'var(--text-head)' }}>{formatDate(event.startDate)}</div>
              </div>
              <div>
                <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>End</div>
                <div className="text-sm" style={{ color: 'var(--text-head)' }}>{formatDate(event.endDate)}</div>
              </div>
              <div>
                <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Venue</div>
                <div className="text-sm" style={{ color: 'var(--text-head)' }}>{event.venueName}</div>
              </div>
              <div>
                <div className="text-xs text-dim" style={{ marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.06em' }}>Organizer</div>
                <div className="text-sm" style={{ color: 'var(--text-head)' }}>{event.organizerName}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration sidebar */}
        <div>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Registration</h3>

            <div style={{ marginBottom: 16 }}>
              <div className="flex-center gap-2" style={{ marginBottom: 8, justifyContent: 'space-between' }}>
                <span className="text-sm text-dim">Spots filled</span>
                <span className="text-sm">{event.registered} / {event.capacity}</span>
              </div>
              <div className="capacity-bar">
                <div
                  className="capacity-fill"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 100 ? 'var(--red)' : pct >= 80 ? 'var(--yellow)' : 'var(--primary)'
                  }}
                />
              </div>
              {isFull && (
                <p className="text-xs" style={{ color: 'var(--yellow)', marginTop: 6 }}>
                  ⚠ Event is full — you'll be added to the waitlist
                </p>
              )}
            </div>

            {myReg ? (
              <div>
                <div className="reg-status-box">
                  <span className={`badge ${myReg.status === 'Confirmed' ? 'badge-green' : 'badge-yellow'}`} style={{ fontSize: 14 }}>
                    {myReg.status === 'Confirmed' ? '✓ Registered' : '⏳ Waitlisted'}
                  </span>
                  <p className="text-sm text-dim" style={{ marginTop: 8 }}>
                    {myReg.status === 'Confirmed'
                      ? 'You are confirmed for this event.'
                      : 'You are on the waitlist. We\'ll notify you if a spot opens.'}
                  </p>
                </div>
                {event.status !== 'Past' && (
                  <button className="btn btn-danger" style={{ width: '100%', marginTop: 12 }} onClick={handleCancel} disabled={loading}>
                    Cancel Registration
                  </button>
                )}
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleRegister}
                disabled={loading || event.status === 'Past' || event.status === 'Cancelled'}
              >
                {loading ? 'Processing…' : isFull ? 'Join Waitlist' : 'Register Now'}
              </button>
            )}

            {event.status === 'Past' && (
              <p className="text-xs text-dim" style={{ textAlign: 'center', marginTop: 8 }}>This event has ended</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
