import { sendMessageFunc, getConversationsFunc, createConversationFunc, deleteChats, messagesListFunc, unreadConversationsFunc, readMessagesFunc} from "../controllers/messagesControllers.js";
import { Router } from "express";
import { verifyUser } from "../middleware/protectRoutes.js";


const messageRoutes = Router();


messageRoutes.get('/delete', deleteChats);
messageRoutes.post('/send-message', verifyUser, sendMessageFunc);
messageRoutes.post('/create-conversation', verifyUser, createConversationFunc);
messageRoutes.get('/get-all-conversations', verifyUser, getConversationsFunc);
messageRoutes.get('/unread-chats', verifyUser, unreadConversationsFunc);
messageRoutes.post('/read-chats', verifyUser, readMessagesFunc);
messageRoutes.get('/:conversationId', verifyUser, messagesListFunc);



export default messageRoutes;