// components/context/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, roles }) => {
  const { authState } = useContext(AuthContext);

  if (authState.loading) {
    return <div>Loading...</div>;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.some(role => authState.user.roles.includes(role))) {
    return <Navigate to="/accessdenied" />;
  }

  return children;
};

export default ProtectedRoute;

