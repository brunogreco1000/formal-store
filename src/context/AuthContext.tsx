// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface AuthContextType {
  userId: string | null;
  accessToken: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (id: string, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('accessToken');
    if (storedUser && storedToken) {
      setUserId(storedUser);
      setAccessToken(storedToken);
    }
    setLoading(false);
  }, []);

  const isLoggedIn = !!accessToken && !!userId;

  const login = (id: string, token: string) => {
    setUserId(id);
    setAccessToken(token);
    localStorage.setItem('userId', id);
    localStorage.setItem('accessToken', token); 
  };

  const logout = () => {
    setUserId(null);
    setAccessToken(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ userId, accessToken, isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
