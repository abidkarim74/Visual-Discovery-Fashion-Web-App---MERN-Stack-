import { getReceivedSocketId } from "../socket/socketio.js";
import { io } from "../socket/socketio.js";
import { AuthenticatedUser } from "../interfaces/AuthInterface";

export const sendMessageService = (
  newMessage: any,
  receiverId: string,
  user: AuthenticatedUser
) => {
  setImmediate(() => {
    const receiverSocketId = receiverId
      ? getReceivedSocketId(receiverId)
      : null;
    const senderSocketId = getReceivedSocketId(user?.id as string);

    if (receiverSocketId)
      io.to(receiverSocketId).emit("newMessage", newMessage);

    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }
  });
};
