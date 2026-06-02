import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import {
  getEventById,
  getMyRegistrations,
  registerForEvent,
  cancelRegistration,
} from "../../api/index";
import { StatusBadge, formatDate } from "../../components/EventCard";
import { useToast } from "../../components/Toast";

const TEMP_USER_ID = 1;

const CATEGORY_COLORS = {
  Workshop: "#74b9ff",
  Seminar: "#a29bfe",
  Competition: "#fdcb6e",
  Cultural: "#55efc4",
  Sports: "#ff7675",
  Academic: "#6c5ce7",
  Social: "#fd79a8",
};

export default function StudentEventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState(null);
  const [myReg, setMyReg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const eventId = Number(id);

    getEventById(eventId).then(setEvent);

    getMyRegistrations(TEMP_USER_ID).then((regs) =>
      setMyReg(regs.find((r) => r.eventId === eventId) || null),
    );
  }, [id]);

  const isFull = event && event.registered >= event.capacity;
  const pct = event
    ? Math.min(100, Math.round((event.registered / event.capacity) * 100))
    : 0;
  const color = event
    ? CATEGORY_COLORS[event.category] || "#74b9ff"
    : "#74b9ff";

  async function handleRegister() {
    setLoading(true);

    try {
      const eventId = Number(id);
      const reg = await registerForEvent(eventId, TEMP_USER_ID);

      setMyReg({ ...reg, event, eventId });
      setEvent((e) => ({ ...e, registered: e.registered + 1 }));

      toast(isFull ? "⏳ Added to waitlist!" : "Successfully registered!");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!confirm("Cancel your registration?")) return;

    setLoading(true);

    try {
      await cancelRegistration(myReg.id);

      setMyReg(null);
      setEvent((e) => ({ ...e, registered: Math.max(0, e.registered - 1) }));

      toast("Registration cancelled", "info");
    } finally {
      setLoading(false);
    }
  }

  if (!event) {
    return (
      <DashboardLayout>
        <p style={{ color: "#b2bec3", padding: 40 }}>Loading…</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <button
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 20 }}
          onClick={() => navigate("/student/events")}
        >
          ← Back to Events
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0,1fr) 300px",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div>
            <div
              className="soft-card"
              style={{ "--course-color": color, marginBottom: 20 }}
            >
              <div className="card-top" style={{ marginBottom: 16 }}>
                <div className="mood-badge">{event.category}</div>
                <StatusBadge status={event.status} />
              </div>

              <h1
                style={{
                  fontSize: "clamp(1.3rem,2.5vw,1.8rem)",
                  color: "#2d3436",
                  marginBottom: 14,
                  fontWeight: 800,
                }}
              >
                {event.title}
              </h1>

              <p
                style={{
                  color: "#636e72",
                  lineHeight: 1.75,
                  fontSize: "0.95rem",
                }}
              >
                {event.description}
              </p>
            </div>

            <div className="content-card">
              <h3
                style={{
                  fontWeight: 800,
                  color: "#2d3436",
                  marginBottom: 20,
                  fontSize: "1rem",
                }}
              >
                Event Details
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                }}
              >
                {[
                  { label: "Start", value: formatDate(event.startDate) },
                  { label: "End", value: formatDate(event.endDate) },
                  { label: "Venue", value: event.venueName },
                  { label: "Organizer", value: event.organizerName },
                ].map((d) => (
                  <div
                    key={d.label}
                    style={{
                      background: "#f8faff",
                      borderRadius: 16,
                      padding: "14px 18px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        color: "#b2bec3",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: 6,
                      }}
                    >
                      {d.label}
                    </div>

                    <div
                      style={{
                        fontWeight: 700,
                        color: "#2d3436",
                        fontSize: "0.9rem",
                      }}
                    >
                      {d.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className="soft-card"
            style={{ "--course-color": color, position: "sticky", top: 20 }}
          >
            <h3
              style={{
                fontWeight: 800,
                color: "#2d3436",
                marginBottom: 18,
                fontSize: "1rem",
              }}
            >
              Registration
            </h3>

            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: "0.82rem",
                    color: "#888",
                    fontWeight: 600,
                  }}
                >
                  Spots filled
                </span>
                <span
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 800,
                    color: "#2d3436",
                  }}
                >
                  {event.registered}/{event.capacity}
                </span>
              </div>

              <div className="soft-progress-bar">
                <div
                  className="soft-progress-fill"
                  style={{
                    width: `${pct}%`,
                    background: isFull
                      ? "#e74c3c"
                      : pct >= 80
                        ? "#fdcb6e"
                        : color,
                  }}
                />
              </div>

              {isFull && (
                <p
                  style={{
                    fontSize: "0.78rem",
                    color: "#f39c12",
                    marginTop: 8,
                    fontWeight: 700,
                  }}
                >
                  ⚠ Event full — you'll join the waitlist
                </p>
              )}
            </div>

            {myReg ? (
              <>
                <div
                  style={{
                    background:
                      myReg.status === "Confirmed" ? "#e8f8f0" : "#fef9e7",
                    borderRadius: 20,
                    padding: 18,
                    textAlign: "center",
                    marginBottom: 14,
                  }}
                >
                <div
                  className="status-marker"
                  style={{
                    margin: "0 auto 10px",
                    background:
                      myReg.status === "Confirmed"
                        ? "rgba(0, 184, 148, 0.12)"
                        : "rgba(243, 156, 18, 0.12)",
                    color:
                      myReg.status === "Confirmed"
                        ? "#00b894"
                        : "#f39c12",
                  }}
                >
                  {myReg.status === "Confirmed" ? "Confirmed" : "Waitlisted"}
                </div>

                  <div
                    style={{
                      fontWeight: 800,
                      color: "#2d3436",
                      marginBottom: 6,
                    }}
                  >
                    {myReg.status === "Confirmed"
                      ? "You're Registered!"
                      : "You're Waitlisted"}
                  </div>

                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "#888",
                      lineHeight: 1.5,
                    }}
                  >
                    {myReg.status === "Confirmed"
                      ? "You are confirmed for this event."
                      : "We'll notify you if a spot opens."}
                  </div>
                </div>

                {event.status !== "Past" && (
                  <button
                    className="btn btn-danger"
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      borderRadius: 50,
                    }}
                    onClick={handleCancel}
                    disabled={loading}
                  >
                    {loading ? "Cancelling…" : "Cancel Registration"}
                  </button>
                )}
              </>
            ) : (
              <button
                className="btn btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  borderRadius: 50,
                  padding: 13,
                }}
                onClick={handleRegister}
                disabled={
                  loading ||
                  event.status === "Past" ||
                  event.status === "Cancelled"
                }
              >
                {loading
                  ? "Processing…"
                  : isFull
                    ? "Join Waitlist"
                    : "Register Now"}
              </button>
            )}

            {event.status === "Past" && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.8rem",
                  color: "#b2bec3",
                  marginTop: 10,
                }}
              >
                This event has ended
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(max-width:700px){.event-two-col{grid-template-columns:1fr!important}}`}</style>
    </DashboardLayout>
  );
}
