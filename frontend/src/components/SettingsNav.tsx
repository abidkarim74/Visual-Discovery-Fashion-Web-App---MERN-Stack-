import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import MainLoading from "./sub/MainLoading";

const SettingsNav = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }

  return (
    <nav className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-2xl shadow-lg space-y-6">
      <Link
        to={`/${auth.user?.username}/update-profile`}
        className="block text-lg font-semibold text-pink-600 hover:underline"
      >
        ✏️ Edit Profile
      </Link>

      <div className="preferences border-t pt-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Preferences</h2>

        <div className="flex items-center justify-between px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition">
          <h3 className="text-gray-700 font-medium">🔔 Notifications</h3>
          <button className="px-3 py-1 text-sm bg-pink-500 text-white rounded-full hover:bg-pink-600 transition">
            On/Off
          </button>
        </div>

        <Link
          to="#"
          className="flex items-center justify-between px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition"
        >
          <h3 className="text-gray-700 font-medium">🔑 Change Password</h3>
          <span className="text-gray-400">→</span>
        </Link>
      </div>

      <div className="account border-t pt-4">
        <Link
          to="#"
          className="block px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition text-gray-700 font-medium"
        >
          👤 Personal Information
        </Link>
      </div>
    </nav>
  );
};

export default SettingsNav;
