import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

const RequireSuperAdmin = ({ children }) => {
  const user = getCurrentUser();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/super-admin-login" state={{ from: location }} replace />;
  }

  if (user.role !== "SUPER_ADMIN") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RequireSuperAdmin;
