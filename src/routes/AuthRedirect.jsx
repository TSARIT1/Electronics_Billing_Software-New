import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

const AuthRedirect = ({ children }) => {
  const user = getCurrentUser();
  if (user) {
    if (user.role === "SUPER_ADMIN") {
      return <Navigate to="/super-admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};

export default AuthRedirect;
