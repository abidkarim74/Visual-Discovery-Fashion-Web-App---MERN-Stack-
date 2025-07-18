import { useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import MainLoading from "./sub/MainLoading";
import type { Conversation, Message } from "../types/ChatTypes";
import Conversations from "./sub/Conversations";
import Chats from "./sub/Chats";



const Messenger = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    return <MainLoading></MainLoading>
  }
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);


  return (
    <div className="rounded-3xl">

      {selectedChat ?
        <Chats conversationId={selectedChat} setChat={setSelectedChat} receiverId={receiverId} setReceiverId={setReceiverId} ></Chats>
        :
        <Conversations setChat={setSelectedChat} setReceiverId={setReceiverId}></Conversations>}
    
    </div>
  );
};
export default Messenger;