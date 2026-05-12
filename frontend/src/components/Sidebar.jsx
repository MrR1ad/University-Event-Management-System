import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { getMe } from "../api";

const NAV_SECTIONS = [
  {
    title: "Student",
    roles: ["Admin", "Student"],
    items: [
      { to: "/student", icon: "📊", label: "Dashboard" },
      { to: "/student/events", icon: "🎟️", label: "Browse Events" },
      { to: "/student/registrations", icon: "✅", label: "My Registrations" },
    ],
  },
  {
    title: "Organizer",
    roles: ["Admin", "Organizer"],
    items: [
      { to: "/organizer", icon: "📊", label: "Dashboard" },
      { to: "/organizer/events", icon: "📌", label: "My Events" },
      { to: "/organizer/events/new", icon: "✨", label: "Create Event" },
    ],
  },
  {
    title: "Admin",
    roles: ["Admin"],
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
  const { instance } = useMsal();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const me = await getMe();
        setUser(me);
      } catch (error) {
        console.error("Failed to load current user", error);
      }
    }

    loadUser();
  }, []);

  const role = user?.primaryRole || "Student";

  const visibleSections = NAV_SECTIONS.filter((section) =>
    section.roles.includes(role),
  );

  const handleLogout = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "http://localhost:5173/",
    });
  };

  return (
    <aside className="ultra-sidebar">
      <div className="brand">
        <div className="ius-logo">IUS</div>
        <span>Sarajevo</span>
      </div>

      <div className="user-profile" style={{ marginTop: 0, marginBottom: 24 }}>
        <div className="avatar">👤</div>
        <div className="user-info" style={{ minWidth: 0 }}>
          <p
            title={user?.name || "Signed in user"}
            style={{
              maxWidth: 150,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.name || "Signed in user"}
          </p>
          <span>{role}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {visibleSections.map((section) => (
          <div key={section.title} style={{ marginBottom: 22 }}>
            <h4
              style={{
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#9aa4b2",
                margin: "0 0 10px 12px",
              }}
            >
              {section.title}
            </h4>

            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-pill ${isActive ? "active" : ""}`
                }
              >
                <span className="icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <button
        type="button"
        className="nav-pill"
        onClick={handleLogout}
        style={{
          border: "none",
          marginTop: "auto",
          background: "rgba(255,255,255,0.65)",
          width: "100%",
          fontFamily: "inherit",
        }}
      >
        <span className="icon">🚪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}
