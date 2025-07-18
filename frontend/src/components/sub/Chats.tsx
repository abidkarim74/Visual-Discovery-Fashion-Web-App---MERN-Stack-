import React, { useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { getRequest, postRequest } from "../../api/apiRequests";
import { useContext } from "react";
import MainLoading from "./MainLoading";
import { ImArrowLeft } from "react-icons/im";
import MessageContext from "../../context/messageContext";


interface Props {
  conversationId: string | null;
  setChat: (value: string | null) => void;
  receiverId: string | null;
  setReceiverId: (value: string | null) => void;
}


const Chats: React.FC<Props> = ({
  conversationId,
  setChat,
  receiverId,
  setReceiverId,
}) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>;
  }

  console.log("Here");
  const messageContext = useContext(MessageContext);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (messageContext?.message) {
      setMessages((prevMessages) => [...prevMessages, messageContext.message]);
    }
  }, [messageContext?.message]);

  const fetchMessages = async () => {
    setLoading(true);
    const endpoint = "/messages/" + conversationId;
    const res = await getRequest(endpoint, setLoading, setError);

    setMessages(res);

    console.log(res);
  };

  useEffect(() => {
    fetchMessages();
  }, [auth.loading]);

  if (!conversationId) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        No chat selected!
      </div>
    );
  }

  const handleBack = (e: any) => {
    e.preventDefault();
    setChat(null);
  };

  const [text, setText] = useState("");

  const handleMessageSend = async (e: any) => {
    const newMessage = {
      
    }
    console.log("Receiver ID: ", receiverId);
    e.preventDefault();
    setLoading(true);
    const endpoint = "/messages/send-message";
    const res = await postRequest(
      endpoint,
      { conversationId, text, receiverId },
      setLoading,
      setError
    );

    setText("");
  };

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop =
        scrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-[80vh] border rounded-3xl overflow-hidden shadow-xl bg-white">
      <div className="flex items-center justify-between px-5 py-3 border-b bg-white shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <ImArrowLeft className="text-gray-600 text-lg" />
          </button>

          <div className="flex -space-x-2">
            <img
              src="https://via.placeholder.com/40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow"
            />
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
        ref={scrollContainerRef}
      >
        <h3 className="text-center text-gray-400 text-sm italic py-2">
          Enjoy your chat...
        </h3>

        {messages.map((msg: any) => {
          const isSender = msg.sender.username === auth.user?.username;
          const profilePic = isSender
            ? msg.receiver.profilePic
            : msg.sender.profilePic;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-2 ${
                isSender ? "justify-end" : "justify-start"
              }`}
            >
              {!isSender && (
                <img
                  src={`http://localhost:8080${profilePic}`}
                  alt="Sender"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300 shadow"
                />
              )}

              <div
                className={`max-w-xs p-3 rounded-3xl shadow-sm transition-all duration-300 ${
                  isSender
                    ? "bg-blue-100 text-gray-900 rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="text-sm leading-snug break-words">{msg.text}</p>
                <span className="block text-[10px] mt-1 text-gray-500 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <form
        className="bg-white px-5 py-3 flex items-center gap-3 border-t shadow-inner"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          type="text"
          placeholder="Type something nice…"
          value={text}
          onChange={(e: any) => setText(e.target.value)}
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 placeholder:text-sm transition-all"
        />

        <button
          onClick={handleMessageSend}
          type="submit"
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-full text-sm transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chats;
