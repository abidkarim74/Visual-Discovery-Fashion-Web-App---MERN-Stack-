import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";
import { useEffect, useState } from "react";
import { getRequest } from "../api/apiRequests";
import { LazyLoadImage } from "react-lazy-load-image-component";


const AuthProfilePage = () => {
  const auth = useContext(AuthContext);

  const [pins, setPins] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPins = async () => {
      const endpoint = "/pins/auth-pins";

      const res = await getRequest(endpoint, setLoading, setError);

      if (res) {
        console.log("Auth pins: ", res);
        setPins(res);
      }
    };
    fetchPins();
  }, [auth]);

  if (!auth) return <MainLoading />;

  const { user } = auth;

  return (
    <div className="profile px-4 py-6 bg-white min-h-screen">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-10">
        {user?.profilePic ? (
          <img
            src={`http://localhost:8080${user?.profilePic}`}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border border-gray-300 shadow-sm"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600">
            {user?.firstname[0]}
          </div>
        )}

        <h2 className="text-2xl font-semibold mt-4 tracking-tight">
          {user?.firstname} {user?.lastname}
        </h2>
        <p className="text-gray-500 text-sm mt-1">@{user?.username}</p>

        <div className="flex gap-8 mt-3 text-sm text-gray-800">
          <p>
            <span className="font-semibold">{user?.followers?.length}</span>{" "}
            <span className="text-gray-500">Followers</span>
          </p>
          <p>
            <span className="font-semibold">{user?.followings?.length}</span>{" "}
            <span className="text-gray-500">Following</span>
          </p>
        </div>

        <div className="flex gap-4 mt-4">
          <button className="px-5 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition">
            Share
          </button>
          <button className="px-5 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-100 transition">
            Edit Profile
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4 px-4">
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}


        {pins.map((pin: any) => (
          <div
            key={pin._id}
            className="break-inside-avoid mb-4 rounded-lg shadow bg-white"
          >
            <LazyLoadImage
                effect="blur"
                src={`http://localhost:8080${pin.image}`}
                alt={pin.caption}
                className="w-full h-auto object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
              />
            <div className="p-3">
              <p className="text-sm font-medium text-gray-800">
                {pin.caption || "No caption"}
              </p>
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthProfilePage;
