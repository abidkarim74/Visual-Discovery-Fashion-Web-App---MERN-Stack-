import { postRequest } from "../../api/apiRequests";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import MainLoading from "./MainLoading";
import { useNavigate } from "react-router-dom";

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
    <div className="absolute top-14 right-4 w-56 bg-white rounded-xl shadow-xl z-50 animate-fade-in transition-all">
      {error && (
        <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-t-xl">
          {error}
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-4 border-b">
        {auth.user?.profilePic ? (
          <img
            src={`http://localhost:8080${auth.user?.profilePic}`}
            alt={auth.user?.username[0]}
            className="w-10 h-10 rounded-full object-cover border border-gray-300"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-semibold">
            {auth.user?.firstname[0]}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-sm text-gray-900">
            {auth.user?.username}
          </h3>
          <p className="text-xs text-gray-500">{auth.user?.email}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 transition-colors"
      >
        {loading ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
};

export default HeaderProfileDropDown;
