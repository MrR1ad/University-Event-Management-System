import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { getMe } from "../api";

const NAV_SECTIONS = [
  {
    title: "Student",
    roles: ["Admin", "Student"],
    items: [
      { to: "/student", label: "Dashboard" },
      { to: "/student/events", label: "Browse Events" },
      { to: "/student/registrations", label: "My Registrations" },
    ],
  },
  {
    title: "Organizer",
    roles: ["Admin", "Organizer"],
    items: [
      { to: "/organizer", label: "Dashboard" },
      { to: "/organizer/events", label: "My Events" },
      { to: "/organizer/events/new", label: "Create Event" },
    ],
  },
  {
    title: "Admin",
    roles: ["Admin"],
    items: [
      { to: "/admin", label: "Dashboard" },
      { to: "/admin/events", label: "All Events" },
      { to: "/admin/users", label: "Users" },
      { to: "/admin/venues", label: "Venues" },
      { to: "/admin/reports", label: "Reports" },
    ],
  },
];

const DASHBOARD_ROUTES = ["/student", "/organizer", "/admin"];

function isRouteActive(pathname, itemPath) {
  if (DASHBOARD_ROUTES.includes(itemPath)) {
    return pathname === itemPath;
  }

  if (itemPath === "/organizer/events/new") {
    return pathname === itemPath;
  }

  if (itemPath === "/organizer/events") {
    return (
      pathname === "/organizer/events" ||
      (pathname.startsWith("/organizer/events/") &&
        pathname !== "/organizer/events/new")
    );
  }

  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

export default function Sidebar() {
  const { instance } = useMsal();
  const location = useLocation();
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


      <div
        className="user-profile"
        title={`${user?.name || "Signed in user"}\n${user?.email || "No email available"}\nRole: ${role}`}
        style={{ marginTop: 0, marginBottom: 24 }}
      >
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

            {section.items.map((item) => {
              const active = isRouteActive(location.pathname, item.to);

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-pill ${active ? "active" : ""}`}
                >
                  <span className="icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <button
        type="button"
        className="nav-pill logout-pill"
        onClick={handleLogout}
      >
        <span className="icon">↪</span>
        <span>Logout</span>
      </button>
    </aside>
  );
}