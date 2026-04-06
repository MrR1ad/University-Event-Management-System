import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Mock users for frontend dev — replace with real API calls later
const MOCK_USERS = [
  { id: 1, name: 'Admin User',    email: 'admin@ius.edu.ba',     role: 'Admin',     token: 'mock-admin-token' },
  { id: 2, name: 'Sara Kovač',    email: 'organizer@ius.edu.ba', role: 'Organizer', token: 'mock-org-token' },
  { id: 3, name: 'Amir Hodžić',   email: 'student@ius.edu.ba',   role: 'Student',   token: 'mock-student-token' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ius_user');
    return saved ? JSON.parse(saved) : null;
  });

  // TODO: replace body with real API call → api/auth.js → login()
  function login(email, password) {
    const found = MOCK_USERS.find(u => u.email === email);
    if (!found) throw new Error('User not found');
    localStorage.setItem('ius_user', JSON.stringify(found));
    setUser(found);
    return found;
  }

  // TODO: replace body with real API call → api/auth.js → register()
  function register(name, email, password, role) {
    const newUser = { id: Date.now(), name, email, role, token: 'mock-token' };
    localStorage.setItem('ius_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  }

  function logout() {
    localStorage.removeItem('ius_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
