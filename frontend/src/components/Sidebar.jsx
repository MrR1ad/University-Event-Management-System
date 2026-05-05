import { NavLink } from "react-router-dom";

const NAV_SECTIONS = [
  {
    title: "Student",
    items: [
      { to: "/student", icon: "🎓", label: "Dashboard" },
      { to: "/student/events", icon: "🏛️", label: "Browse Events" },
      { to: "/student/registrations", icon: "✅", label: "My Registrations" },
    ],
  },
  {
    title: "Organizer",
    items: [
      { to: "/organizer", icon: "🧑‍💼", label: "Dashboard" },
      { to: "/organizer/events", icon: "📌", label: "My Events" },
      { to: "/organizer/events/create", icon: "✨", label: "Create Event" },
    ],
  },
  {
    title: "Admin",
    items: [
      { to: "/admin", icon: "🛡️", label: "Dashboard" },
      { to: "/admin/events", icon: "📋", label: "All Events" },
      { to: "/admin/users", icon: "👥", label: "Users" },
      { to: "/admin/venues", icon: "🏛️", label: "Venues" },
      { to: "/admin/reports", icon: "📊", label: "Reports" },
    ],
  },
];

export default function Sidebar() {
  return (
    <aside className="ultra-sidebar">
      <NavLink
        to="/student"
        className="brand"
        style={{ textDecoration: "none" }}
      >
        <div className="ius-logo">IUS</div>
        <span>Sarajevo</span>
      </NavLink>

      <nav className="sidebar-nav">
        {NAV_SECTIONS.map((section) => (
          <div key={section.title} style={{ marginBottom: 22 }}>
            <p
              style={{
                fontSize: "0.72rem",
                fontWeight: 800,
                color: "#9aa3af",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                margin: "0 0 8px 12px",
              }}
            >
              {section.title}
            </p>

            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-pill ${isActive ? "active" : ""}`
                }
                style={{ textDecoration: "none" }}
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="user-profile">
        <div className="avatar">🔐</div>
        <div className="user-info">
          <p>Authentication removed</p>
          <span>OAuth will be added later</span>
        </div>
      </div>
    </aside>
  );
}
