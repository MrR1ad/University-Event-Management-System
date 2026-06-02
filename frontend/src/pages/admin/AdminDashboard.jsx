import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import { getStats, getEvents } from "../../api/index";
import { StatusBadge, formatDate } from "../../components/EventCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentEvents, setRecentEvents] = useState([]);

  useEffect(() => {
    getStats().then(setStats);
    getEvents().then((evts) => setRecentEvents(evts.slice(0, 5)));
  }, []);

  return (
    <DashboardLayout>
      <div className="view-fade-in">
        <div className="page-header">
          <div>
            <h1>Admin Dashboard</h1>
            <p className="page-subtitle">Platform overview</p>
          </div>
        </div>

        <div className="stats-grid">
          {[
            {
              label: "Total Events",
              value: stats?.totalEvents ?? "—",
              sub: "All time",
            },
            {
              label: "Upcoming Events",
              value: stats?.upcomingEvents ?? "—",
              sub: "Next 30 days",
            },
            {
              label: "Total Users",
              value: stats?.totalUsers ?? "—",
              sub: "Registered users",
            },
            {
              label: "Total Registrations",
              value: stats?.totalRegistrations ?? "—",
              sub: "Across all events",
            },
          ].map((s) => (
            <div key={s.label} className="stat-card stat-card-clean">
              <div className="stat-card-label">{s.label}</div>
              <div className="stat-card-value">{s.value}</div>
              <div className="stat-card-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="content-card">
          <div className="page-header" style={{ marginBottom: 20 }}>
            <h2
              style={{
                fontWeight: 800,
                color: "#2d3436",
                fontSize: "1.1rem",
              }}
            >
              Recent Events
            </h2>

            <Link to="/admin/events" className="btn btn-ghost btn-sm">
              View all →
            </Link>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Date</th>
                  <th>Organizer</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentEvents.map((e) => (
                  <tr key={e.id}>
                    <td style={{ fontWeight: 700, color: "#2d3436" }}>
                      {e.title}
                    </td>

                    <td className="text-dim text-sm">
                      {formatDate(e.startDate)}
                    </td>

                    <td className="text-dim text-sm">
                      {e.organizerName || "Organizer"}
                    </td>

                    <td className="text-sm">
                      {e.registered}/{e.capacity}
                    </td>

                    <td>
                      <StatusBadge status={e.status} />
                    </td>
                  </tr>
                ))}

                {recentEvents.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        textAlign: "center",
                        color: "#b2bec3",
                        padding: 40,
                      }}
                    >
                      No recent events available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}