import { useContext } from "react";
import { Navigate } from "react-router-dom";
import MainLoading from "../components/sub/MainLoading";
import { AuthContext } from "../context/authContext";

interface Props {
  children: React.ReactNode;
}

const ProtectRoutes = ({ children }: Props) => {
  const auth = useContext(AuthContext);

  if (!auth) return null;

  const { accessToken, loading } = auth;

  if (loading) {
    return <MainLoading />;
  }

  if (!accessToken) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectRoutes;
