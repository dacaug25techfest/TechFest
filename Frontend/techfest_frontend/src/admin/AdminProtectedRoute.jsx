import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const isAdmin = localStorage.getItem('adminAuth') === 'true';

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return children;
}

export default AdminProtectedRoute;
