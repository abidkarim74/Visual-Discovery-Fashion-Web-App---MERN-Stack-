import { useState, useEffect } from "react";
import { AuthContext } from "./authContext";
import type { User } from "../types/AuthTypes";
import axiosInstance from "../api/axiosInstance";


const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<null | User>(null);
  const [accessToken, setAccessToken] = useState<null | string>(null);
  const [loading, setLoading] = useState<boolean>(true);

   useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (accessToken && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);

  useEffect(() => {
    const getNewToken = async () => {
      try {
        const res = await axiosInstance.post<{ accessToken: string }>("/auth/refresh-token", {});
        setAccessToken(res.data.accessToken);
      } catch (err) {
        console.log("Not logged in!", err);
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    };
    getNewToken();
  }, []);

  useEffect(() => {
    const getAuthUser = async () => {
      const endpoint = "/auth/auth-user";
      try {
        const res = await axiosInstance.get<User>(endpoint);
        setUser(res.data);
      } catch (err) {
        console.log(err);
        setUser(null);
      }
    };
    if (accessToken) {
      getAuthUser();
    }
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        setAccessToken,
        setUser,
        loading,
        setLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
