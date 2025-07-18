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


const Sidebar = () => {
  const notificationContext = useContext(NotificationContext);

  if (!notificationContext) {
    return <MainLoading></MainLoading>;
  }

  const [openMessenger, setOpenMessenger] = useState<boolean>(false);
  const [openNotificationBar, setOpenNotificationBar] =
    useState<boolean>(false);

  return (
    <div className="relative h-screen flex">
      <aside className="w-20 h-[85%] bg-white border-r flex flex-col justify-between items-center">
        <div className="flex flex-col items-center gap-6 pt-6">
          <Link to="/" className="text-2xl hover:text-red-500">
            <AiFillHome />
          </Link>
          <button
            className="text-2xl hover:text-red-500"
            onClick={() => {
              setOpenMessenger((prev) => !prev);
              setOpenNotificationBar(false);
            }}
          >
            <FiMessageSquare />
          </button>
          <button
            className="relative text-2xl hover:text-red-500"
            onClick={() => {
              setOpenNotificationBar((prev) => !prev);
              setOpenMessenger(false);
            }}
          >
            <IoMdNotificationsOutline />

            {notificationContext?.count > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {notificationContext?.count}
              </span>
            )}
          </button>

          <Link to="/pin/create" className="text-2xl hover:text-red-500">
            <FiPlus />
          </Link>
        </div>

        <div className="pb-6">
          <button className="text-2xl hover:text-red-500">
            <FiSettings />
          </button>
        </div>
      </aside>

      {openMessenger && (
        <div className="absolute rounded-3xl left-20 top-4 w-[400px] h-[80%] bg-white border-2 shadow-md z-10">
          <Messenger />
        </div>
      )}

      {openNotificationBar && (
        <div className="absolute left-20 top-4 w-[400px] h-[80%] bg-white border-2 shadow-md z-10 rounded-lg">
          <NotificationBar />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
