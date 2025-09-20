import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedOfficerRoute = () => {
  const user = JSON.parse(localStorage.getItem('dms_user'));
  if (!user || user.role !== 'officer') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default ProtectedOfficerRoute;
