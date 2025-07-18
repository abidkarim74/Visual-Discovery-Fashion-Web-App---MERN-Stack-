import { createContext, useState, useEffect, useContext, useRef } from "react";
import io, { Socket } from "socket.io-client";
import { AuthContext } from "./authContext";
import MainLoading from "../components/sub/MainLoading";


interface ISocketContext {
  socket: Socket | null;
  onlineUsers: string[];
  notification: any
  setNotification: (value: any) => void
}

const SocketContext = createContext<ISocketContext | undefined>(undefined);

export const useSocketContext = (): ISocketContext => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error(
      "useSocketContext must be used within a SocketContextProvider"
    );
  }
  return context;
};

const socketURL = "http://localhost:8080";

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [notification, setNotification] = useState(null);
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>;
  }

  useEffect(() => {
    if (auth.accessToken && !auth.loading) {
      const socket = io(socketURL, {
        query: { userId: auth.user?.id },
      });
      socketRef.current = socket;

      socket.on("getOnlineUsers", (users: string[]) => {
        setOnlineUsers(() => users);
      });

      return () => {
        socket.disconnect();
        socketRef.current = null;
      };
    } else if (!auth.user && !auth.loading) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    }
  }, [auth?.user, auth?.loading, auth?.accessToken]);

  if (auth.user) {
    console.log("Online Users: ", onlineUsers);
  }

  console.log("Online Users: ", onlineUsers);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers, notification, setNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
