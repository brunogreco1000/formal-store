// src/components/PrivateRoute.tsx
import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl">
        Cargando sesión...
      </div>
    );
  }

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
