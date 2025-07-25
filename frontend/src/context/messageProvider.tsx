import { useState } from "react";
import MessageContext from "./messageContext";
import { useSocketContext } from "./socketProvider";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./authContext";
import MainLoading from "../components/sub/MainLoading";
import { getRequest } from "../api/apiRequests";


const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>
  }
  const [message, setMessage] = useState<any>(null);
  const { socket } = useSocketContext();

  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data: any) => {
      console.log("This is Data: ", data);
      setMessage(data);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnreadChats = async () => {
      const endpoint = '/messages/unread-chats';
      const res = await getRequest(endpoint, setLoading, setError);
      if (res) {
        setUnreadCount(res);
      }
    }
    fetchUnreadChats();

  }, [socket, auth]);

  return (
    <MessageContext.Provider value={{ message, setMessage, unreadCount, setUnreadCount }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
