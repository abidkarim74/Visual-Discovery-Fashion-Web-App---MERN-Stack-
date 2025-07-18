import { AiFillHome } from "react-icons/ai";
import { FiMessageSquare, FiSettings, FiPlus } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import Messenger from "./Messenger";
import NotificationBar from "./NotificationsBar";
import { useState } from "react";
import { useContext } from "react";
import NotificationContext from "../context/notificationContext";
import MainLoading from "./sub/MainLoading";

const BottomBar = () => {
  const notificationContext = useContext(NotificationContext);

  if (!notificationContext) {
    return <MainLoading></MainLoading>;
  }
  const [openMessenger, setOpenMessenger] = useState(false);
  const [openNotificationBar, setOpenNotificationBar] = useState(false);

  return (
    <div className="fixed inset-0 z-40 pointer-events-none">
      {openMessenger && (
        <div className="absolute top-16 left-0 w-full h-[80%] bg-white shadow-md border-t pointer-events-auto overflow-y-auto z-50">
          <Messenger />
        </div>
      )}

      {openNotificationBar && (
        <div className="absolute bottom-16 left-0 w-full h-80 bg-white shadow-md border-t pointer-events-auto overflow-y-auto z-50">
          <NotificationBar />
        </div>
      )}

      <div className="md:hidden h-16 bg-white border-t shadow-md flex justify-around items-center fixed bottom-0 left-0 right-0 pointer-events-auto">
        <button className="text-2xl text-gray-700 hover:text-red-500">
          <AiFillHome />
        </button>

        <button
          className="text-2xl text-gray-700 hover:text-red-500"
          onClick={() => {
            setOpenMessenger((prev) => !prev);
            setOpenNotificationBar(false);
          }}
        >
          <FiMessageSquare />
        </button>

        <button
          className="relative flex items-center justify-center text-2xl text-gray-700 hover:text-red-500 w-12 h-12"
          onClick={() => {
            setOpenNotificationBar((prev) => !prev);
            setOpenMessenger(false);
          }}
        >
          <IoMdNotificationsOutline />

          {notificationContext?.count > 0 && (
            <span className="absolute -top-0 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full">
              {notificationContext?.count}
            </span>
          )}
        </button>

        <button className="text-2xl text-gray-700 hover:text-red-500">
          <FiPlus />
        </button>

        <button className="text-2xl text-gray-700 hover:text-red-500">
          <FiSettings />
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
