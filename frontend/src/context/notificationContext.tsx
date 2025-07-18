import { createContext } from "react";
import type { NotificationType } from "../types/NotificationTypes";

const NotificationContext = createContext<NotificationType | null>(null);

export default NotificationContext;