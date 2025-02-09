import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Redirect providers trying to access user dashboard
  if (window.location.pathname === '/dashboard' && userRole === 'provider') {
    return <Navigate to="/provider-dashboard" />;
  }

  // Redirect users trying to access provider dashboard
  if (window.location.pathname === '/provider-dashboard' && userRole !== 'provider') {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default PrivateRoute;