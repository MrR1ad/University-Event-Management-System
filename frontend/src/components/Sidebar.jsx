import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = {
  Admin: [
    { to: '/admin',               icon: '🏠', label: 'Dashboard'   },
    { to: '/admin/events',        icon: '📅', label: 'All Events'  },
    { to: '/admin/users',         icon: '👥', label: 'Users'       },
    { to: '/admin/venues',        icon: '📍', label: 'Venues'      },
    { to: '/admin/reports',       icon: '📊', label: 'Reports'     },
  ],
  Organizer: [
    { to: '/organizer',               icon: '🏠', label: 'Dashboard'    },
    { to: '/organizer/events',        icon: '📅', label: 'My Events'    },
    { to: '/organizer/events/create', icon: '✨', label: 'Create Event' },
  ],
  Student: [
    { to: '/student',               icon: '🏠', label: 'Dashboard'        },
    { to: '/student/events',        icon: '🔍', label: 'Browse Events'    },
    { to: '/student/registrations', icon: '🎟', label: 'My Registrations' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_ITEMS[user?.role] || [];

  function handleLogout() { logout(); navigate('/login'); }

  return (
    <aside className="ultra-sidebar">
      <div className="brand" onClick={() => navigate(`/${user?.role?.toLowerCase()}`)}>
        <div className="ius-logo">IUS</div>
        <span>Sarajevo</span>
      </div>

      <nav className="sidebar-nav">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === `/${user?.role?.toLowerCase()}`}
            className={({ isActive }) => `nav-pill ${isActive ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="user-profile" onClick={handleLogout} title="Click to logout">
        <div className="avatar">👤</div>
        <div className="user-info">
          <p>{user?.name}</p>
          <span>{user?.role} · Logout</span>
        </div>
      </div>
    </aside>
  );
}
