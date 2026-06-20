// Protected route component
// Prevents unauthorized access to dashboard pages.

import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {

  // Retrieve token from browser storage
  const token = localStorage.getItem("token");

  // Redirect unauthenticated users
  if (!token) {
    return <Navigate to="/" />;
  }

  // Allow authenticated users
  return children;
}

export default ProtectedRoute;