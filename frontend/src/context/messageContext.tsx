import { createContext } from "react";
import type { MessageContextType } from "../types/ChatTypes";


const MessageContext = createContext<MessageContextType | null>(null);


export default MessageContext;