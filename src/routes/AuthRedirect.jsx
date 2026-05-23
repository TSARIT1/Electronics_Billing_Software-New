import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../services/auth";

const AuthRedirect = ({ children }) => {
  const user = getCurrentUser();
  if (user) return <Navigate to="/" replace />;
  return children;
};

export default AuthRedirect;
