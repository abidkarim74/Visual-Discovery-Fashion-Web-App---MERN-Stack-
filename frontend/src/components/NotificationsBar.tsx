import { getRequest, postRequest } from "../api/apiRequests";
import { AuthContext } from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import MainLoading from "./sub/MainLoading";
import NotificationContext from "../context/notificationContext";


const formatTime = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  // const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;

  return date.toLocaleString();
};

const NotificationBar = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }

  const notificationContext = useContext(NotificationContext);

  if (!notificationContext) {
    return <MainLoading></MainLoading>;
  }

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const endpoint = "/notifications/all";

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);

    const res = await getRequest(endpoint, setLoading, setError);
    

    if (res) {
      for (let i = 0; i < res.length; i++) {
        if (res[i].target === auth.user?.id) {
          notificationContext.setChecker(true);
        }
      }
      console.log(res);
      setNotifications(res);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [auth]);

  const readNotification = async () => {
    const endpoint = "/notifications/read";
    const res = await postRequest(endpoint, {}, setLoading, setError);

    notificationContext.setCount(0);

    console.log(res);
  };

  useEffect(() => {
    readNotification();
  }, [auth]);

  if (loading) {
    return <div className="p-4">Loading notifications...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="notification-bar bg-white rounded-xl shadow-lg max-h-[500px] w-full sm:w-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-100">
      <h3 className="text-xl font-bold border-b pb-2 text-gray-700">
        Notifications
      </h3>

      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications found.</p>
      ) : (
        <ul className="space-y-3">
          {notifications.map((n, idx) => (
            <li
              key={idx}
              className={`p-4 rounded-xl flex items-center gap-3 transition-all duration-200 ${
                n.seen
                  ? "bg-gray-50 hover:bg-gray-100"
                  : "bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <img
                src={`http://localhost:8080${n.source.profilePic}`}
                alt={n.source.username}
                className="w-12 h-12 rounded-full object-cover border border-gray-200"
              />
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  <span className="font-semibold">{n.source.username}</span>:{" "}
                  {n.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTime(n.createdAt)}
                </p>
              </div>
              {!n.seen && (
                <span className="ml-auto inline-block w-2.5 h-2.5 bg-blue-500 rounded-full" />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationBar;
