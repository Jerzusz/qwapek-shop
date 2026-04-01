import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../api';

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('adminToken'));
  const [username, setUsername] = useState(() => localStorage.getItem('adminUsername'));
  const [role, setRole] = useState(() => localStorage.getItem('adminRole'));
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const { data } = await authApi.login(credentials);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUsername', data.username);
      localStorage.setItem('adminRole', data.role);
      setToken(data.token);
      setUsername(data.username);
      setRole(data.role);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Błąd logowania' };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    localStorage.removeItem('adminRole');
    setToken(null);
    setUsername(null);
    setRole(null);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AdminContext.Provider value={{ token, username, role, isAuthenticated, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
