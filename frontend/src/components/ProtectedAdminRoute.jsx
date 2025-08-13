import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const user = JSON.parse(localStorage.getItem('dms_user'));
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }
  return <Outlet />;
};

export default ProtectedAdminRoute;
