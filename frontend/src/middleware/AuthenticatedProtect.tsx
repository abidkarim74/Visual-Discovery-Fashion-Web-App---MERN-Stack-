import { useContext } from "react";
import React from "react";
import { AuthContext } from "../context/authContext";
import { Navigate } from "react-router-dom";
import MainLoading from "../components/sub/MainLoading";

interface Props {
  children: React.ReactNode;
}

export const AuthenticatedProtection = ({ children }: Props) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>
  }
  const { loading, accessToken } = auth;

  if (loading) {
    return <MainLoading />;
  }

  if (accessToken) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};
