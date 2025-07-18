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

  if (!isOpen) {
    return null;
  }
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>;
  }
  const { setAccessToken, setUser } = auth;

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
    <div className="absolute top-12 right-0 bg-white shadow-lg rounded-md w-48 py-2 z-50">
      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}
      <div className="px-4 py-2 border-b">
        <h3 className="font-semibold text-gray-800">Username</h3>
      </div>
      <button
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
        onClick={handleLogout}
      >
        {loading ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
};

export default HeaderProfileDropDown;
