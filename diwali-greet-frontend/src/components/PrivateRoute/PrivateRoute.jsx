import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  console.log(">>token", !!token ? "FOUND" : "UNDEFINED");

  const isAuthenticated = !!token;

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
