import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "./components/Toast";

import RoleRedirect from "./auth/RoleRedirect";
import ProtectedRoute from "./auth/ProtectedRoute";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminVenues from "./pages/admin/AdminVenues";
import AdminReports from "./pages/admin/AdminReports";

import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import EventForm from "./pages/organizer/EventForm";
import OrganizerEventDetail from "./pages/organizer/OrganizerEventDetail";

import StudentDashboard from "./pages/student/StudentDashboard";
import StudentEvents from "./pages/student/StudentEvents";
import StudentEventDetail from "./pages/student/StudentEventDetail";
import StudentRegistrations from "./pages/student/StudentRegistrations";

export default function App() {
  return (
    <BrowserRouter>
      <ToastContainer />

      <Routes>
        <Route path="/" element={<RoleRedirect />} />
        <Route path="/auth" element={<RoleRedirect />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/venues"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminVenues />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminReports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/organizer"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer"]}>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer"]}>
              <OrganizerEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/new"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer"]}>
              <EventForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer"]}>
              <OrganizerEventDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/events/:id/edit"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer"]}>
              <EventForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer", "Student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer", "Student"]}>
              <StudentEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/events/:id"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer", "Student"]}>
              <StudentEventDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/registrations"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Organizer", "Student"]}>
              <StudentRegistrations />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
