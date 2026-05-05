// ─── MOCK DATA ──────────────────────────────────────────────────────────────
// All data is fake. When backend is ready, replace usage of this file
// with real API calls from src/api/*.js

export const MOCK_VENUES = [
  { id: 1, name: 'Main Auditorium',  location: 'Building A, Floor 1', capacity: 300 },
  { id: 2, name: 'Seminar Room 101', location: 'Building B, Floor 1', capacity: 40  },
  { id: 3, name: 'Computer Lab 3',   location: 'Building C, Floor 2', capacity: 60  },
  { id: 4, name: 'Open Courtyard',   location: 'Campus Center',       capacity: 500 },
  { id: 5, name: 'Conference Hall',  location: 'Building A, Floor 3', capacity: 120 },
];

export const MOCK_CATEGORIES = [
  'Workshop', 'Seminar', 'Competition', 'Cultural', 'Sports', 'Academic', 'Social',
];

export const MOCK_EVENTS = [
  {
    id: 1, title: 'AI & Machine Learning Workshop', category: 'Workshop',
    description: 'Hands-on workshop covering the fundamentals of machine learning using Python and scikit-learn. Participants will build their first ML model.',
    startDate: '2026-04-15T10:00', endDate: '2026-04-15T14:00',
    capacity: 60, registered: 54, status: 'Upcoming',
    venueId: 3, venueName: 'Computer Lab 3',
    organizerId: 2, organizerName: 'Sara Kovač',
    image: null,
  },
  {
    id: 2, title: 'IUS Spring Cultural Night', category: 'Cultural',
    description: 'An evening celebrating the diverse cultures of IUS students. Music, food, and performances from around the world.',
    startDate: '2026-04-20T18:00', endDate: '2026-04-20T22:00',
    capacity: 300, registered: 210, status: 'Upcoming',
    venueId: 1, venueName: 'Main Auditorium',
    organizerId: 2, organizerName: 'Sara Kovač',
    image: null,
  },
  {
    id: 3, title: 'Research Paper Writing Seminar', category: 'Seminar',
    description: 'Learn how to structure, write and publish academic research papers. Hosted by the IUS Research Department.',
    startDate: '2026-04-10T09:00', endDate: '2026-04-10T11:00',
    capacity: 40, registered: 40, status: 'Upcoming',
    venueId: 2, venueName: 'Seminar Room 101',
    organizerId: 2, organizerName: 'Sara Kovač',
    image: null,
  },
  {
    id: 4, title: 'Hackathon Spring 2026', category: 'Competition',
    description: '24-hour coding competition. Teams of 2-4 students compete to build the best solution for a real-world problem.',
    startDate: '2026-05-02T08:00', endDate: '2026-05-03T08:00',
    capacity: 120, registered: 88, status: 'Upcoming',
    venueId: 5, venueName: 'Conference Hall',
    organizerId: 2, organizerName: 'Sara Kovač',
    image: null,
  },
  {
    id: 5, title: 'Career Fair 2026', category: 'Academic',
    description: 'Meet representatives from 30+ companies. Bring your CV and be ready for on-spot interviews.',
    startDate: '2026-03-20T10:00', endDate: '2026-03-20T17:00',
    capacity: 500, registered: 480, status: 'Past',
    venueId: 4, venueName: 'Open Courtyard',
    organizerId: 2, organizerName: 'Sara Kovač',
    image: null,
  },
  {
    id: 6, title: 'Basketball Tournament', category: 'Sports',
    description: 'Inter-faculty basketball tournament. Register your team and compete for the IUS championship.',
    startDate: '2026-04-18T14:00', endDate: '2026-04-18T20:00',
    capacity: 80, registered: 32, status: 'Upcoming',
    venueId: 4, venueName: 'Open Courtyard',
    organizerId: 2, organizerName: 'Sara Kovač',
    image: null,
  },
];

export const MOCK_REGISTRATIONS = [
  { id: 1, eventId: 1, userId: 3, userName: 'Amir Hodžić', registeredAt: '2026-04-01T10:22', checkedIn: false, status: 'Confirmed' },
  { id: 2, eventId: 2, userId: 3, userName: 'Amir Hodžić', registeredAt: '2026-04-02T08:14', checkedIn: false, status: 'Confirmed' },
  { id: 3, eventId: 3, userId: 3, userName: 'Amir Hodžić', registeredAt: '2026-04-03T14:55', checkedIn: false, status: 'Waitlisted' },
  { id: 4, eventId: 1, userId: 4, userName: 'Lejla Muratović', registeredAt: '2026-04-01T11:00', checkedIn: true,  status: 'Confirmed' },
  { id: 5, eventId: 1, userId: 5, userName: 'Edin Bašić',     registeredAt: '2026-04-01T12:30', checkedIn: false, status: 'Confirmed' },
  { id: 6, eventId: 2, userId: 6, userName: 'Amina Suljić',   registeredAt: '2026-04-02T09:00', checkedIn: false, status: 'Confirmed' },
];

export const MOCK_USERS = [
  { id: 1, name: 'Admin User',      email: 'admin@ius.edu.ba',     role: 'Admin',     status: 'Active',   joinedAt: '2025-09-01' },
  { id: 2, name: 'Sara Kovač',      email: 'organizer@ius.edu.ba', role: 'Organizer', status: 'Active',   joinedAt: '2025-09-05' },
  { id: 3, name: 'Amir Hodžić',     email: 'student@ius.edu.ba',   role: 'Student',   status: 'Active',   joinedAt: '2025-09-10' },
  { id: 4, name: 'Lejla Muratović', email: 'lejla@ius.edu.ba',     role: 'Student',   status: 'Active',   joinedAt: '2025-09-10' },
  { id: 5, name: 'Edin Bašić',      email: 'edin@ius.edu.ba',      role: 'Student',   status: 'Active',   joinedAt: '2025-09-11' },
  { id: 6, name: 'Amina Suljić',    email: 'amina@ius.edu.ba',     role: 'Student',   status: 'Inactive', joinedAt: '2025-09-12' },
];

// Stats used in admin dashboard
export const MOCK_STATS = {
  totalEvents: 6,
  totalUsers: 6,
  totalRegistrations: 6,
  upcomingEvents: 5,
};
