import { Router } from "express";
import { verifyUser } from "../middleware/protectRoutes.js";
import { notificationListFunc, sendNotfictionFunc, unreadReactNotificationFunc, readNotificationsFunc} from "../controllers/notificationsControllers.js";


const notificationRoutes = Router();

notificationRoutes.get('/all', verifyUser, notificationListFunc);
notificationRoutes.post('/create', verifyUser, sendNotfictionFunc);
notificationRoutes.get('/unread', verifyUser, unreadReactNotificationFunc);
notificationRoutes.post('/read', verifyUser, readNotificationsFunc);

export default notificationRoutes;