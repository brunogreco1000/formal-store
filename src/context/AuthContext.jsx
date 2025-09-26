import { createContext, useState, useEffect, useContext } from 'react';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('accessToken') || null);
  const isLoggedIn = !!userId;

  const login = (id) => {
    setUserId(id);
    setAccessToken('fake-token'); // token fake
    localStorage.setItem('userId', id);
    localStorage.setItem('accessToken', 'fake-token');
  };

  const logout = () => {
    setUserId(null);
    setAccessToken(null);
    localStorage.removeItem('userId');
    localStorage.removeItem('accessToken');
  };

  useEffect(() => {
    const storedId = localStorage.getItem('userId');
    const storedToken = localStorage.getItem('accessToken');
    if (storedId && storedToken) {
      setUserId(storedId);
      setAccessToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userId, accessToken, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
