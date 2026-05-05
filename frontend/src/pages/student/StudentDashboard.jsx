import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getMyRegistrations, getEvents } from "../../api/index";
import { formatDate } from "../../components/EventCard";

const TEMP_USER_ID = 1;
const TEMP_USER_NAME = "Student";

export default function StudentDashboard() {
  const [myRegs, setMyRegs] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showRegsModal, setShowRegsModal] = useState(false);

  useEffect(() => {
    getMyRegistrations(TEMP_USER_ID).then(setMyRegs);
    getEvents().then((evts) =>
      setUpcoming(evts.filter((e) => e.status === "Upcoming").slice(0, 3)),
    );
  }, []);

  const confirmed = myRegs.filter((r) => r.status === "Confirmed");
  const waitlisted = myRegs.filter((r) => r.status === "Waitlisted");

  const CATEGORY_COLORS = {
    Workshop: "#74b9ff",
    Seminar: "#a29bfe",
    Competition: "#fdcb6e",
    Cultural: "#55efc4",
    Sports: "#ff7675",
    Academic: "#6c5ce7",
    Social: "#fd79a8",
  };

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div
          style={{
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.9)",
            borderRadius: 35,
            padding: "clamp(28px,4vw,50px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <span
              style={{
                background: "rgba(0,51,102,0.1)",
                color: "var(--accent)",
                padding: "5px 14px",
                borderRadius: 10,
                fontSize: "0.8rem",
                fontWeight: 700,
                display: "inline-block",
                marginBottom: 12,
              }}
            >
              Current Semester: Spring 2026
            </span>

            <h1
              style={{
                margin: "0 0 18px",
                color: "#2d3436",
                fontSize: "clamp(1.4rem,3vw,2.4rem)",
                fontWeight: 800,
                lineHeight: 1.15,
              }}
            >
              Welcome back, <br />
              <strong style={{ color: "var(--accent)" }}>
                {TEMP_USER_NAME}
              </strong>
            </h1>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                className="btn btn-ghost"
                style={{ borderRadius: 50, fontWeight: 700 }}
                onClick={() => setShowScheduleModal(true)}
              >
                📅 Schedule
              </button>

              <button
                className="btn btn-ghost"
                style={{ borderRadius: 50, fontWeight: 700 }}
                onClick={() => setShowRegsModal(true)}
              >
                🎟 My Registrations
              </button>

              <Link
                to="/student/events"
                className="btn btn-primary"
                style={{ borderRadius: 50 }}
              >
                🔍 Browse Events
              </Link>
            </div>
          </div>

          <span
            style={{
              fontSize: "clamp(4rem,8vw,7rem)",
              animation: "float 3s ease-in-out infinite",
            }}
          >
            🎓
          </span>
        </div>

        <div className="stats-grid">
          {[
            {
              label: "Registered",
              value: confirmed.length,
              icon: "✅",
              sub: "Confirmed",
            },
            {
              label: "Waitlisted",
              value: waitlisted.length,
              icon: "⏳",
              sub: "Pending spots",
            },
            {
              label: "Available Events",
              value: upcoming.length,
              icon: "📅",
              sub: "Open now",
            },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div style={{ fontSize: "1.5rem", marginBottom: 10 }}>
                {s.icon}
              </div>
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="content-card">
          <div className="page-header" style={{ marginBottom: 20 }}>
            <h2
              style={{ fontWeight: 800, color: "#2d3436", fontSize: "1.1rem" }}
            >
              Upcoming Events
            </h2>
            <Link to="/student/events" className="btn btn-ghost btn-sm">
              See all →
            </Link>
          </div>

          <div className="events-grid">
            {upcoming.map((e) => {
              const color = CATEGORY_COLORS[e.category] || "#74b9ff";

              return (
                <div
                  key={e.id}
                  className="soft-card"
                  style={{ "--course-color": color }}
                >
                  <div className="card-top">
                    <div className="mood-badge">{e.category}</div>
                    <span className="badge badge-green">Upcoming</span>
                  </div>

                  <h4
                    style={{
                      margin: "14px 0 6px",
                      color: "#2d3436",
                      fontSize: "0.95rem",
                    }}
                  >
                    {e.title}
                  </h4>

                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#636e72",
                      marginBottom: 4,
                    }}
                  >
                    📅 {formatDate(e.startDate)}
                  </div>

                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#636e72",
                      marginBottom: 16,
                    }}
                  >
                    📍 {e.venueName}
                  </div>

                  <Link
                    to={`/student/events/${e.id}`}
                    className="soft-action-btn primary"
                    style={{
                      display: "block",
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    View & Register
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showScheduleModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowScheduleModal(false)}
        >
          <div
            className="modal-bubbly"
            style={{ width: "min(860px, 92vw)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-soft">
              <div className="header-icon-title">
                <span className="modal-emoji">🗓️</span>
                <h3>Weekly Schedule</h3>
              </div>

              <button
                className="close-circle-btn"
                onClick={() => setShowScheduleModal(false)}
              >
                ✕
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(5,1fr)",
                gap: 14,
              }}
            >
              {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, i) => (
                <div
                  key={day}
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      fontWeight: 800,
                      fontSize: "0.8rem",
                      color: "#b2bec3",
                      textTransform: "uppercase",
                    }}
                  >
                    {day}
                  </div>

                  {i % 2 === 0 ? (
                    <>
                      <div
                        style={{
                          background: "#ff85a2",
                          borderRadius: 18,
                          padding: "14px 10px",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          textAlign: "center",
                        }}
                      >
                        Interactive Web
                        <br />
                        <span style={{ fontSize: "0.72rem", opacity: 0.85 }}>
                          09:00
                        </span>
                      </div>

                      <div
                        style={{
                          background: "#a29bfe",
                          borderRadius: 18,
                          padding: "14px 10px",
                          color: "white",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                          textAlign: "center",
                        }}
                      >
                        English Literature
                        <br />
                        <span style={{ fontSize: "0.72rem", opacity: 0.85 }}>
                          13:00
                        </span>
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        background: "#74b9ff",
                        borderRadius: 18,
                        padding: "14px 10px",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        textAlign: "center",
                      }}
                    >
                      Comp. Architecture
                      <br />
                      <span style={{ fontSize: "0.72rem", opacity: 0.85 }}>
                        11:00
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showRegsModal && (
        <div className="modal-overlay" onClick={() => setShowRegsModal(false)}>
          <div
            className="modal-bubbly"
            style={{ width: "min(500px, 92vw)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header-soft">
              <div className="header-icon-title">
                <span className="modal-emoji">🎟</span>
                <h3>My Registrations</h3>
              </div>

              <button
                className="close-circle-btn"
                onClick={() => setShowRegsModal(false)}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {myRegs.length === 0 ? (
                <p
                  style={{ textAlign: "center", color: "#b2bec3", padding: 24 }}
                >
                  No registrations yet.
                </p>
              ) : (
                myRegs.map((r) => (
                  <div
                    key={r.id}
                    style={{
                      background: "#f8faff",
                      borderRadius: 20,
                      padding: "16px 20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#2d3436",
                          marginBottom: 4,
                        }}
                      >
                        {r.event?.title}
                      </div>
                      <div style={{ fontSize: "0.8rem", color: "#888" }}>
                        {formatDate(r.event?.startDate)}
                      </div>
                    </div>

                    <span
                      className={`badge ${r.status === "Confirmed" ? "badge-green" : "badge-yellow"}`}
                    >
                      {r.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
