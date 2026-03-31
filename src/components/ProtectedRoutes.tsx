import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const CustomerProtectedRoute: React.FC = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return <Outlet />;
};

export const AdminProtectedRoute: React.FC = () => {
  const { admin } = useAuth();
  if (!admin) return <Navigate to="/admin/login" />;
  return <Outlet />;
};
