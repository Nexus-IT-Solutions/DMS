import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const storedUser = localStorage.getItem('dms_user');
  const user = JSON.parse(storedUser);
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
};

export default ProtectedAdminRoute;
