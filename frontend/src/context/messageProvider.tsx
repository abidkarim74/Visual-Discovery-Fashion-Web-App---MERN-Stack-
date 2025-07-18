import { useState } from "react";
import MessageContext from "./messageContext";
import { useSocketContext } from "./socketProvider";
import { useEffect } from "react";


const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [message, setMessage] = useState<any>(null);
  const { socket } = useSocketContext();

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

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export default MessageProvider;
