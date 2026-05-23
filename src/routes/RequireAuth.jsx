import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

const RequireAuth = ({ children }) => {
  const user = getCurrentUser();
  const location = useLocation();
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default RequireAuth;
