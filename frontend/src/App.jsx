import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "./components/Toast";

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
        <Route path="/" element={<Navigate to="/student" replace />} />

        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/venues" element={<AdminVenues />} />
        <Route path="/admin/reports" element={<AdminReports />} />

        <Route path="/organizer" element={<OrganizerDashboard />} />
        <Route path="/organizer/events" element={<OrganizerEvents />} />
        <Route path="/organizer/events/create" element={<EventForm />} />
        <Route
          path="/organizer/events/:id"
          element={<OrganizerEventDetail />}
        />
        <Route path="/organizer/events/:id/edit" element={<EventForm />} />

        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/events/:id" element={<StudentEventDetail />} />
        <Route
          path="/student/registrations"
          element={<StudentRegistrations />}
        />

        <Route path="*" element={<Navigate to="/student" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
