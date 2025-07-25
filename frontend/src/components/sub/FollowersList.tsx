import { getRequest } from "../../api/apiRequests";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import MainLoading from "./MainLoading";
import { Link } from "react-router-dom";


interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}


const FollowersList: React.FC<Props> = ({ isOpen, setIsOpen }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [followers, setFollowers] = useState<any[]>([]);

  useEffect(() => {
    const fetchFollowersListFunc = async () => {
      const endpoint = "/profiles/followers-list";
      const res = await getRequest(endpoint, setLoading, setError);

      if (res) {
        setFollowers(res);
        setIsOpen(true);
      }
    };
    fetchFollowersListFunc();
  }, [auth]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[95%] max-w-md">
        <h3 className="text-xl font-semibold text-center mb-4">Followers</h3>

        {loading && (
          <div className="flex justify-center items-center py-4">
            <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="space-y-4 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400">
          {!loading &&
            followers.map((f: any) => (
              <Link
                to={`/${f.username}`}
                key={f.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <img
                  src={`http://localhost:8080${f.profilePic}`}
                  alt={`${f.firstname} ${f.lastname}`}
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                  <p className="font-medium">
                    {f.firstname} {f.lastname}
                  </p>
                  <p className="text-sm text-gray-500">@{f.username}</p>
                </div>
              </Link>
            ))}
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="mt-6 w-full py-2  text-white rounded-xl bg-indigo-500 hover:bg-indigo-600 transition duration-300 shadow-md font-semibold tracking-wide"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default FollowersList;
