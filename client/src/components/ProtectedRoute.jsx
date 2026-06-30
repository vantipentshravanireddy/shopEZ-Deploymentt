import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, adminOnly = false }) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (
    adminOnly &&
    user?.user?.role?.toLowerCase() !== "admin"
  ) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;