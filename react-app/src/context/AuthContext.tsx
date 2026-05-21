import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api';

export interface AuthUser {
  id: number;
  name: string;
  email: string | null;
  mobile: string | null;
  emirate: string | null;
  user_type: 'admin' | 'staff' | 'user';
  avatar: string | null;
  is_verified: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null, loading: true,
  login: () => {}, logout: () => {}, refresh: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = () => {
    api.get('/auth/me').then((r) => setUser(r.data)).catch(() => setUser(null)).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const login = (u: AuthUser) => setUser(u);
  const logout = () => { api.post('/auth/logout').finally(() => setUser(null)); };

  return <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
