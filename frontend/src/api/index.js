import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5064/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// ── EVENTS ────────────────────────────────────────────────────────────────────

export async function getEvents() {
  const res = await api.get("/events");
  return res.data;
}

export async function getEventById(id) {
  const res = await api.get(`/events/${id}`);
  return res.data;
}

export async function createEvent(data) {
  const res = await api.post("/events", data);
  return res.data;
}

export async function updateEvent(id, data) {
  const res = await api.put(`/events/${id}`, data);
  return res.data;
}

export async function deleteEvent(id) {
  await api.delete(`/events/${id}`);
  return { success: true };
}

// ── REGISTRATIONS ─────────────────────────────────────────────────────────────

export async function getMyRegistrations(userId) {
  const res = await api.get("/registrations", { params: { userId } });

  return res.data.map((r) => ({
    ...r,
    eventId: r.eventId,
    event: {
      id: r.eventId,
      title: r.eventTitle,
      startDate: r.startDate,
      venueName: r.venueName,
      category: r.category,
      status: r.status,
    },
  }));
}

export async function getRegistrationsByEvent(eventId) {
  const res = await api.get("/registrations", { params: { eventId } });
  return res.data;
}

export async function registerForEvent(eventId) {
  const res = await api.post("/registrations", { eventId });
  return res.data;
}

export async function cancelRegistration(registrationId) {
  await api.delete(`/registrations/${registrationId}`);
  return { success: true };
}

export async function checkInParticipant(registrationId) {
  const res = await api.patch(`/registrations/${registrationId}/checkin`);
  return res.data;
}

// ── VENUES ────────────────────────────────────────────────────────────────────

export async function getVenues() {
  const res = await api.get("/venues");
  return res.data;
}

export async function createVenue(data) {
  const res = await api.post("/venues", data);
  return res.data;
}

export async function updateVenue(id, data) {
  const res = await api.put(`/venues/${id}`, data);
  return res.data;
}

export async function deleteVenue(id) {
  await api.delete(`/venues/${id}`);
  return { success: true };
}

// ── USERS ─────────────────────────────────────────────────────────────────────

export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

export async function updateUserRole(userId, role) {
  const res = await api.patch(`/users/${userId}/role`, { role });
  return res.data;
}

export async function toggleUserStatus(userId, status) {
  return { success: true, userId, status };
}

export async function deleteUser(userId) {
  await api.delete(`/users/${userId}`);
  return { success: true };
}

// ── STATS ─────────────────────────────────────────────────────────────────────

export async function getStats() {
  const res = await api.get("/stats");

  return {
    totalEvents: res.data.totalEvents,
    upcomingEvents: res.data.upcomingEvents,
    totalUsers: res.data.totalUsers,
    totalRegistrations: res.data.totalRegistrations,
  };
}
