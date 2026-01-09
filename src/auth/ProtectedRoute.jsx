import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  console.log("ProtectedRoute user:", user);
  
  // Not logged in
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Role restriction
  if (role && user.role !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
