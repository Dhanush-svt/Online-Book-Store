import { Navigate } from "react-router-dom";
import { auth } from "../services/api";

// Wrap any route element with this to require a specific role's token.
// Usage: <PrivateRoute role="user"><Cart /></PrivateRoute>
export default function PrivateRoute({ role, redirectTo, children }) {
  if (!auth.isLoggedIn(role)) {
    return <Navigate to={redirectTo} replace />;
  }
  return children;
}
