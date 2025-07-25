import { postRequest } from "../../api/apiRequests";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import MainLoading from "./MainLoading";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";


interface HeaderProfileDropDownProps {
  isOpen: boolean;
}

const HeaderProfileDropDown = ({ isOpen }: HeaderProfileDropDownProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const auth = useContext(AuthContext);
  if (!auth) return <MainLoading />;

  const { setAccessToken, setUser } = auth;

  if (!isOpen) return null;

  const handleLogout = async () => {
    const endpoint = "/auth/logout";
    const res = await postRequest(endpoint, {}, setLoading, setError);

    if (res) {
      setAccessToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  return (
    <div className="absolute top-14 right-4 w-64 bg-white rounded-xl shadow-xl z-50 animate-fade-in transition-all border border-gray-100">
      {error && (
        <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-t-xl">
          {error}
        </div>
      )}

      <Link to={`/${auth.user?.username}/profile`} className="flex items-center gap-4 px-4 py-4 border-b">
        {auth.user?.profilePic ? (
          <img
            src={`http://localhost:8080${auth.user?.profilePic}`}
            alt={auth.user?.username[0]}
            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-400 shadow-sm"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-semibold shadow-sm">
            {auth.user?.firstname[0]}
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-gray-900">
            {auth.user?.username}
          </span>
          <span className="text-xs text-gray-500">{auth.user?.email}</span>
        </div>
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <FiLogOut className="text-gray-500" />
        {loading ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
};

export default HeaderProfileDropDown;
