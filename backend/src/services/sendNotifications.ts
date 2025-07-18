import { getReceivedSocketId } from "../socket/socketio.js";
import { io } from "../socket/socketio.js";


export const sendNotificationService = (
  newNotifcation: any,
  receiverId: string,
) => {
  setImmediate(() => {
    const receiverSocketId = receiverId
      ? getReceivedSocketId(receiverId)
      : null;

    if (receiverSocketId)
      io.to(receiverSocketId).emit("newNotification", newNotifcation);
  });
};
