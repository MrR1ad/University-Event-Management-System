// ─── API LAYER ───────────────────────────────────────────────────────────────
// All functions here are STUBS using mock data.
// When backend is ready:
//   1. npm install axios
//   2. Replace each function body with the real axios call shown in the comment
//   3. Make sure the token header is set in each request

import {
  MOCK_EVENTS, MOCK_REGISTRATIONS, MOCK_USERS, MOCK_VENUES, MOCK_STATS
} from '../mockData';

// Helper to simulate network delay
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

// ── AUTH ─────────────────────────────────────────────────────────────────────
// Real: POST /api/auth/login   { email, password }
export async function apiLogin(email, password) {
  await delay();
  return null; // handled by AuthContext mock
}

// Real: POST /api/auth/register  { name, email, password, role }
export async function apiRegister(data) {
  await delay();
  return null; // handled by AuthContext mock
}

// ── EVENTS ───────────────────────────────────────────────────────────────────
// Real: GET /api/events
export async function getEvents() {
  await delay();
  return [...MOCK_EVENTS];
}

// Real: GET /api/events/:id
export async function getEventById(id) {
  await delay();
  return MOCK_EVENTS.find(e => e.id === id) || null;
}

// Real: POST /api/events  (Organizer only)
export async function createEvent(data) {
  await delay();
  return { ...data, id: Date.now(), registered: 0, status: 'Upcoming' };
}

// Real: PUT /api/events/:id  (Organizer/Admin)
export async function updateEvent(id, data) {
  await delay();
  return { ...data, id };
}

// Real: DELETE /api/events/:id  (Organizer/Admin)
export async function deleteEvent(id) {
  await delay();
  return { success: true };
}

// ── REGISTRATIONS ────────────────────────────────────────────────────────────
// Real: GET /api/registrations?userId=:id
export async function getMyRegistrations(userId) {
  await delay();
  const regs = MOCK_REGISTRATIONS.filter(r => r.userId === userId);
  return regs.map(r => ({
    ...r,
    event: MOCK_EVENTS.find(e => e.id === r.eventId),
  }));
}

// Real: GET /api/registrations?eventId=:id
export async function getRegistrationsByEvent(eventId) {
  await delay();
  return MOCK_REGISTRATIONS.filter(r => r.eventId === eventId);
}

// Real: POST /api/registrations  { eventId, userId }
export async function registerForEvent(eventId, userId) {
  await delay();
  return { id: Date.now(), eventId, userId, registeredAt: new Date().toISOString(), status: 'Confirmed', checkedIn: false };
}

// Real: DELETE /api/registrations/:id
export async function cancelRegistration(registrationId) {
  await delay();
  return { success: true };
}

// Real: PATCH /api/registrations/:id/checkin
export async function checkInParticipant(registrationId) {
  await delay();
  return { success: true, checkedIn: true };
}

// ── VENUES ───────────────────────────────────────────────────────────────────
// Real: GET /api/venues
export async function getVenues() {
  await delay();
  return [...MOCK_VENUES];
}

// ── USERS (Admin only) ───────────────────────────────────────────────────────
// Real: GET /api/users
export async function getUsers() {
  await delay();
  return [...MOCK_USERS];
}

// Real: PATCH /api/users/:id/role  { role }
export async function updateUserRole(userId, role) {
  await delay();
  return { success: true };
}

// Real: PATCH /api/users/:id/status  { status }
export async function toggleUserStatus(userId, status) {
  await delay();
  return { success: true };
}

// ── STATS (Admin only) ───────────────────────────────────────────────────────
// Real: GET /api/stats
export async function getStats() {
  await delay();
  return { ...MOCK_STATS };
}
