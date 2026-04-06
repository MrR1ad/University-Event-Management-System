import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const NAV_ITEMS = {
  Admin: [
    { to: '/admin',         icon: '⬛', label: 'Dashboard'   },
    { to: '/admin/events',  icon: '📅', label: 'All Events'  },
    { to: '/admin/users',   icon: '👥', label: 'Users'       },
    { to: '/admin/venues',  icon: '📍', label: 'Venues'      },
    { to: '/admin/reports', icon: '📊', label: 'Reports'     },
  ],
  Organizer: [
    { to: '/organizer',              icon: '⬛', label: 'Dashboard'    },
    { to: '/organizer/events',       icon: '📅', label: 'My Events'    },
    { to: '/organizer/events/create',icon: '✚',  label: 'Create Event' },
  ],
  Student: [
    { to: '/student',               icon: '⬛', label: 'Dashboard'        },
    { to: '/student/events',        icon: '🔍', label: 'Browse Events'    },
    { to: '/student/registrations', icon: '🎟', label: 'My Registrations' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = NAV_ITEMS[user?.role] || [];

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">IUS</span>
        <div>
          <div className="sidebar-logo-title">Campus</div>
          <div className="sidebar-logo-sub">Event Management</div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">{user?.name?.charAt(0)}</div>
        <div>
          <div className="sidebar-user-name">{user?.name}</div>
          <span className={`badge badge-${roleBadge(user?.role)}`}>{user?.role}</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {items.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === `/${user?.role.toLowerCase()}`}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout btn btn-ghost btn-sm" onClick={handleLogout}>
        ← Logout
      </button>
    </aside>
  );
}

function roleBadge(role) {
  return { Admin: 'red', Organizer: 'purple', Student: 'blue' }[role] || 'blue';
}
