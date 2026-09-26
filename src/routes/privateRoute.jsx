import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Loader from "../component/Shared/Loader/Loader";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader></Loader>;
  }

  if (!user) {
    return <Navigate to="/sign-in" state={location.pathname}></Navigate>;
  }

  return children;
};

export default PrivateRoute;
