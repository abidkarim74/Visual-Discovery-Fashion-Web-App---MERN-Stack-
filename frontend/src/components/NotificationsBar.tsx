import { getRequest, postRequest } from "../api/apiRequests";
import { AuthContext } from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import MainLoading from "./sub/MainLoading";
import NotificationContext from "../context/notificationContext";
import { Link } from "react-router-dom";

const formatTime = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);

  if (diffMins < 1) return "just now";
  if (diffMins < 60)
    return `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
  if (diffHours < 24)
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;

  return date.toLocaleString();
};

interface Props {
  setOpen: (value: boolean) => void
}

const NotificationBar: React.FC<Props> = ({setOpen}) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }

  const notificationContext = useContext(NotificationContext);

  if (!notificationContext) {
    return <MainLoading />;
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
      setNotifications(res);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [auth]);

  const readNotification = async () => {
    const endpoint = "/notifications/read";
    await postRequest(endpoint, {}, setLoading, setError);
    notificationContext.setCount(0);
  };

  useEffect(() => {
    readNotification();
  }, [auth]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="notification-bar bg-white rounded-3xl shadow-lg max-h-[500px] w-full sm:w-[400px] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-indigo-100 border-2 border-indigo-300">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Notifications
      </h3>

      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : notifications.length === 0 ? (
        <p className="text-gray-500 text-sm">No notifications found.</p>
      ) : (
        <div className="notification-bar">
          <ul className="space-y-3">
            {notifications.map((n, idx) => (
              <li
                key={idx}
                className={`p-4 rounded-xl flex items-center gap-4 transition-all duration-200 ${
                  n.seen
                    ? "bg-gray-50 hover:bg-gray-100"
                    : "bg-indigo-50 hover:bg-indigo-100"
                }`}
              >
                <img
                  src={`http://localhost:8080${n.source.profilePic}`}
                  alt={n.source.username}
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800 leading-snug">
                    <span className="font-semibold">{n.source.username}</span>:{" "}
                    {n.text}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(n.createdAt)}
                  </p>
                </div>
                {!n.seen && (
                  <span className="ml-auto w-2.5 h-2.5 bg-indigo-500 rounded-full" />
                )}
                {n.context && (
                  <Link
                    onClick={() => setOpen(false)}
                    to={n.context}
                    className="ml-4 text-sm text-indigo-600 hover:underline shrink-0"
                  >
                    View
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBar;
