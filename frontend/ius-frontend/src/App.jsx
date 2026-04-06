import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from './components/Toast';
import { ProtectedRoute, RoleRoute } from './routes/ProtectedRoute';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEvents from './pages/admin/AdminEvents';
import AdminUsers from './pages/admin/AdminUsers';
import AdminVenues from './pages/admin/AdminVenues';
import AdminReports from './pages/admin/AdminReports';

// Organizer
import OrganizerDashboard from './pages/organizer/OrganizerDashboard';
import OrganizerEvents from './pages/organizer/OrganizerEvents';
import EventForm from './pages/organizer/EventForm';
import OrganizerEventDetail from './pages/organizer/OrganizerEventDetail';

// Student
import StudentDashboard from './pages/student/StudentDashboard';
import StudentEvents from './pages/student/StudentEvents';
import StudentEventDetail from './pages/student/StudentEventDetail';
import StudentRegistrations from './pages/student/StudentRegistrations';

function RootRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={`/${user.role.toLowerCase()}`} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Root */}
          <Route path="/" element={<RootRedirect />} />

          {/* Auth */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin routes */}
          <Route path="/admin" element={<RoleRoute role="Admin"><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/events"  element={<RoleRoute role="Admin"><AdminEvents /></RoleRoute>} />
          <Route path="/admin/users"   element={<RoleRoute role="Admin"><AdminUsers /></RoleRoute>} />
          <Route path="/admin/venues"  element={<RoleRoute role="Admin"><AdminVenues /></RoleRoute>} />
          <Route path="/admin/reports" element={<RoleRoute role="Admin"><AdminReports /></RoleRoute>} />

          {/* Organizer routes */}
          <Route path="/organizer" element={<RoleRoute role="Organizer"><OrganizerDashboard /></RoleRoute>} />
          <Route path="/organizer/events" element={<RoleRoute role="Organizer"><OrganizerEvents /></RoleRoute>} />
          <Route path="/organizer/events/create" element={<RoleRoute role="Organizer"><EventForm /></RoleRoute>} />
          <Route path="/organizer/events/:id/edit" element={<RoleRoute role="Organizer"><EventForm /></RoleRoute>} />
          <Route path="/organizer/events/:id" element={<RoleRoute role="Organizer"><OrganizerEventDetail /></RoleRoute>} />

          {/* Student routes */}
          <Route path="/student" element={<RoleRoute role="Student"><StudentDashboard /></RoleRoute>} />
          <Route path="/student/events" element={<RoleRoute role="Student"><StudentEvents /></RoleRoute>} />
          <Route path="/student/events/:id" element={<RoleRoute role="Student"><StudentEventDetail /></RoleRoute>} />
          <Route path="/student/registrations" element={<RoleRoute role="Student"><StudentRegistrations /></RoleRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </AuthProvider>
  );
}
