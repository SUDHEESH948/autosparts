import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Checks if the stored JWT token exists and is not expired.
 */
export const isAuthenticated = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;

    // Parse payload to check expiration if it's a standard JWT
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return false;
      }
    }

    return true;
  } catch (error) {
    // If decoding fails, rely on token existence
    return Boolean(localStorage.getItem("token"));
  }
};

/**
 * Protects routes requiring seller authentication.
 * Redirects unauthenticated users to /login and remembers the return location.
 */
export default function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

