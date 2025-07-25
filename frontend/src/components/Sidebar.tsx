import { AiFillHome } from "react-icons/ai";
import { FiMessageSquare, FiSettings, FiPlus } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Messenger from "./Messenger";
import NotificationBar from "./NotificationsBar";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import NotificationContext from "../context/notificationContext";
import MainLoading from "./sub/MainLoading";
import MessageContext from "../context/messageContext";

const Sidebar = () => {
  const notificationContext = useContext(NotificationContext);

  const messageContext = useContext(MessageContext);

  if (!notificationContext) {
    return <MainLoading></MainLoading>;
  }
  if (!messageContext) {
    return <MainLoading></MainLoading>;
  }

  const [openMessenger, setOpenMessenger] = useState<boolean>(false);
  const [openNotificationBar, setOpenNotificationBar] =
    useState<boolean>(false);

  return (
    <div className="relative h-screen flex">
      <aside className="w-20 h-[85%] bg-white border-r flex flex-col justify-between items-center">
        <div className="flex flex-col items-center gap-6 pt-6 text-gray-700">
          <Link to="/" className="text-2xl hover:text-indigo-600 transition">
            <AiFillHome />
          </Link>

          <button
            className="relative text-2xl hover:text-indigo-600 transition"
            onClick={() => {
              setOpenMessenger((prev) => !prev);
              setOpenNotificationBar(false);
            }}
          >
            <FiMessageSquare />
            {messageContext.unreadCount > 0 && (
              <span className="absolute -top-1 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {messageContext.unreadCount}
              </span>
            )}
          </button>

          <button
            className="relative text-2xl hover:text-indigo-600 transition"
            onClick={() => {
              setOpenNotificationBar((prev) => !prev);
              setOpenMessenger(false);
            }}
          >
            <IoMdNotificationsOutline />
            {notificationContext.count > 0 && (
              <span className="absolute -top-1 right-0 translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                {notificationContext.count}
              </span>
            )}
          </button>

          <Link
            to="/pin/create"
            className="text-2xl hover:text-indigo-600 transition"
          >
            <FiPlus />
          </Link>
        </div>

        <div className="pb-6">
          <Link to="/settings" className="text-2xl hover:text-red-500">
            <FiSettings />
          </Link>
        </div>
      </aside>

      {openMessenger && (
        <div className="absolute rounded-3xl left-20 top-4 w-[400px] h-[80%] bg-white border-2 shadow-md z-10">
          <Messenger />
        </div>
      )}

      {openNotificationBar && (
        <div className="absolute left-20 top-4 z-10">
          <NotificationBar />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
