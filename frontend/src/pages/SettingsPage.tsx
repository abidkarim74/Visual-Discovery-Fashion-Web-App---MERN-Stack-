import {
  Pencil,
  Bell,
  Lock,
  User,
  ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";

const SettingsPage: React.FC = () => {
  const auth = useContext(AuthContext);

  if (!auth || !auth.user) return <MainLoading />;

  return (
    <main className="w-full h-full py-10 px-4">
      <section className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>

        {/* Profile Update */}
        <Link
          to={`/${auth.user.username}/update-profile`}
          className="flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
        >
          <Pencil className="w-5 h-5 text-pink-500" />
          <span className="font-medium text-gray-700">Edit Profile</span>
        </Link>

        {/* Preferences */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">Preferences</h3>

          {/* Notifications */}
          <div className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-blue-500" />
              <span className="text-gray-700">Notifications</span>
            </div>
            <button
              type="button"
              className="text-sm bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600"
            >
              On/Off
            </button>
          </div>

          {/* Change Password */}
          <Link
            to="/change-password"
            className="flex items-center justify-between px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-yellow-500" />
              <span className="text-gray-700">Change Password</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </Link>
        </div>

        {/* Personal Info */}
        <Link
          to="/personal-info"
          className="flex items-center gap-3 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition border-t pt-4"
        >
          <User className="w-5 h-5 text-purple-500" />
          <span className="text-gray-700">Personal Information</span>
        </Link>
      </section>
    </main>
  );
};

export default SettingsPage;
