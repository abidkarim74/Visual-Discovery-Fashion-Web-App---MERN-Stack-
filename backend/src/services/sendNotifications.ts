import { getReceivedSocketId } from "../socket/socketio.js";
import { io } from "../socket/socketio.js";


export const sendNotificationService = (
  newNotifcation: any,
  receiverId: any,
) => {
  setImmediate(() => {
    console.log('To Here...', receiverId);

    const receiverSocketId = receiverId
      ? getReceivedSocketId(receiverId._id)
      : null;
    
    console.log('ID: ', receiverSocketId)

    if (receiverSocketId) {
      console.log('Notification sent!')
      io.to(receiverSocketId).emit("newNotification", newNotifcation);
    }
  });
};
