import { useEffect, useState, useContext } from "react";
import NotificationContext from "./notificationContext";
import { useSocketContext } from "./socketProvider";
import { getRequest } from "../api/apiRequests";
import { AuthContext } from "./authContext";
import MainLoading from "../components/sub/MainLoading";

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }

  const [notification, setNotification] = useState<any>(null);
  const [count, setCount] = useState<number>(0);
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (data: any) => {
      console.log("New notification: ", data);
      if (auth.user?.id === data.target) {
        setCount(prev => prev + 1);
      }
      setNotification(data);
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification); // remove only the listener
    };
  }, [socket]);

  useEffect(() => {
    const countUnreadNotifications = async () => {
      const endpoint = "/notifications/unread";
      const res = await getRequest(endpoint, null, null);

      const unreadCount = res ?? 0;
      console.log("Count: ", unreadCount);
      setCount(unreadCount);
    };

    countUnreadNotifications();
  }, [auth]);

  return (
    <NotificationContext.Provider
      value={{ notification, setNotification, count, setCount }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
