// ─── REAL API LAYER ──────────────────────────────────────────────────────────
// Replaces the mock layer. All functions now call the real .NET backend.
// Base URL points to your backend dev server.

import axios from 'axios';

const BASE_URL = 'http://localhost:5226/api';

// ── AXIOS INSTANCE ────────────────────────────────────────────────────────────
// Automatically attaches the JWT token to every request
const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('ius_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// If the backend returns 401 (token expired), clear local storage and reload
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('ius_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────────────────────
// POST /api/auth/login
export async function apiLogin(email, password) {
  const res = await api.post('/auth/login', { email, password });
  return res.data; // AuthResponse: { token, userId, fullName, email, role }
}

// POST /api/auth/register
export async function apiRegister(fullName, email, password, role) {
  const res = await api.post('/auth/register', { fullName, email, password, role });
  return res.data;
}

// ── EVENTS ────────────────────────────────────────────────────────────────────
// GET /api/events
export async function getEvents() {
  const res = await api.get('/events');
  return res.data;
}

// GET /api/events/:id
export async function getEventById(id) {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

// POST /api/events  (Organizer/Admin)
export async function createEvent(data) {
  const res = await api.post('/events', data);
  return res.data;
}

// PUT /api/events/:id  (Organizer/Admin)
export async function updateEvent(id, data) {
  const res = await api.put(`/events/${id}`, data);
  return res.data;
}

// DELETE /api/events/:id  (Organizer/Admin)
export async function deleteEvent(id) {
  await api.delete(`/events/${id}`);
  return { success: true };
}

// ── REGISTRATIONS ─────────────────────────────────────────────────────────────
// GET /api/registrations?userId=:id
export async function getMyRegistrations(userId) {
  const res = await api.get('/registrations', { params: { userId } });
  // Shape the response to match what the frontend expects
  return res.data.map(r => ({
    ...r,
    eventId: r.eventId,
    event: {
      id:           r.eventId,
      title:        r.eventTitle,
      startDate:    r.startDate,
      venueName:    r.venueName,
      category:     r.category,
      status:       r.status,
    },
  }));
}

// GET /api/registrations?eventId=:id
export async function getRegistrationsByEvent(eventId) {
  const res = await api.get('/registrations', { params: { eventId } });
  return res.data;
}

// POST /api/registrations
export async function registerForEvent(eventId) {
  const res = await api.post('/registrations', { eventId });
  return res.data;
}

// DELETE /api/registrations/:id
export async function cancelRegistration(registrationId) {
  await api.delete(`/registrations/${registrationId}`);
  return { success: true };
}

// PATCH /api/registrations/:id/checkin
export async function checkInParticipant(registrationId) {
  const res = await api.patch(`/registrations/${registrationId}/checkin`);
  return res.data;
}

// ── VENUES ────────────────────────────────────────────────────────────────────
// GET /api/venues
export async function getVenues() {
  const res = await api.get('/venues');
  return res.data;
}

// POST /api/venues  (Admin)
export async function createVenue(data) {
  const res = await api.post('/venues', data);
  return res.data;
}

// PUT /api/venues/:id  (Admin)
export async function updateVenue(id, data) {
  const res = await api.put(`/venues/${id}`, data);
  return res.data;
}

// DELETE /api/venues/:id  (Admin)
export async function deleteVenue(id) {
  await api.delete(`/venues/${id}`);
  return { success: true };
}

// ── USERS (Admin) ─────────────────────────────────────────────────────────────
// GET /api/users
export async function getUsers() {
  const res = await api.get('/users');
  return res.data;
}

// PATCH /api/users/:id/role
export async function updateUserRole(userId, role) {
  const res = await api.patch(`/users/${userId}/role`, { role });
  return res.data;
}

// PATCH /api/users/:id/status  (Admin)
export async function toggleUserStatus(userId, status) {
  // TODO: add a status field to ApplicationUser and a backend endpoint for this
  // For now returns mock response since backend doesn't have this endpoint yet
  return { success: true };
}

// DELETE /api/users/:id
export async function deleteUser(userId) {
  await api.delete(`/users/${userId}`);
  return { success: true };
}

// ── STATS (Admin) ─────────────────────────────────────────────────────────────
// GET /api/stats
export async function getStats() {
  const res = await api.get('/stats');
  return {
    totalEvents:        res.data.totalEvents,
    upcomingEvents:     res.data.upcomingEvents,
    totalUsers:         res.data.totalUsers,
    totalRegistrations: res.data.totalRegistrations,
  };
}
