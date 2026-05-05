import { createContext, useContext, useState } from 'react';
import { apiLogin, apiRegister } from '../api/index';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ius_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Calls POST /api/auth/login → gets back { token, userId, fullName, email, role }
  async function login(email, password) {
    const data = await apiLogin(email, password);
    // Store in the same shape the rest of the app already expects
    const userObj = {
      id:    data.userId,
      name:  data.fullName,
      email: data.email,
      role:  data.role,
      token: data.token,
    };
    localStorage.setItem('ius_user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
  }

  // Calls POST /api/auth/register
  async function register(name, email, password, role) {
    const data = await apiRegister(name, email, password, role);
    const userObj = {
      id:    data.userId,
      name:  data.fullName,
      email: data.email,
      role:  data.role,
      token: data.token,
    };
    localStorage.setItem('ius_user', JSON.stringify(userObj));
    setUser(userObj);
    return userObj;
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
