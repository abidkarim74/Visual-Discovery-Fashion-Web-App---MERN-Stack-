import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";
import { getRequest, postRequest } from "../api/apiRequests";
import { useParams, useNavigate } from "react-router-dom";
import StartChatBox from "../components/sub/StartChatBox";
import { Link } from "react-router-dom";


const UserProfilePage = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();
  const [followersCount, setFollowersCount] = useState<number>(0);

  useEffect(() => {
    if (params.username === auth?.user?.username) {
      navigate(`/${params.username}/profile`);
    }
  }, [params.username, auth?.user?.username, navigate]);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = `/profiles/${params.username}`;
      const res = await getRequest(endpoint, setLoading, setError);

      if (res) {
        setUser(res);
        console.log("Check: ", res);
        setFollowersCount(res?.followers?.length);
      }
    } catch (err: any) {
      setError("Failed to load user profile.");
    } finally {
      setLoading(false);
    }
  }, [params.username]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user && auth?.user) {
      const isF = user.followers?.some((id: string) => id === auth.user?.id);
      setFollowing(isF);
    }
  }, [user]);

  const handleToggleFollow = async (targetUserId: string) => {
    const endpoint = "/profiles/toogle-follow";

    const res = await postRequest(
      endpoint,
      { targetUserId },
      setLoading,
      setError
    );

    if (res) {
      if (res.followed) {
        setFollowersCount((prev) => prev + 1);
      } else {
        setFollowersCount((prev) => prev - 1);
      }
      setFollowing(() => {
        return !following;
      });
    } else {
      setError("Something went wrong! Please try later.");
    }
  };

  const [message, setMessage] = useState<string>("");
  const [messageOpen, setMessageOpen] = useState<boolean>(false);

  const [pins, setPins] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserCreation = async () => {
      const endpoint1 = "/profiles/created/" + user.id;

      const res = await getRequest(endpoint1, setLoading, setError);

      if (res) {
        setPins(res);
      }
    };
    fetchUserCreation();
  }, [auth, user]);

  if (!user) return <MainLoading />;

  return (
    <div className="profile px-4 py-6 bg-white h-full">
      {error && (
        <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg shadow-sm mb-4 mx-auto max-w-md text-center">
          <h2 className="font-medium">{error}</h2>
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <img
            src={`http://localhost:8080${user.profilePic}`}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-indigo-300 shadow-md"
          />
          <h2 className="text-2xl font-bold text-indigo-700 mt-4">
            {user?.firstname} {user?.lastname}
          </h2>
          <p className="text-gray-500 mt-1">@{user?.username}</p>

          <div className="followers flex justify-center gap-10 mt-3 text-sm font-medium text-gray-700">
            <h3>
              {followersCount ?? 0}{" "}
              <span className="text-gray-500 font-normal">Followers</span>
            </h3>
            <h3>
              {user?.followings?.length ?? 0}{" "}
              <span className="text-gray-500 font-normal">Followings</span>
            </h3>
          </div>

          {auth.user?.username !== user?.username && (
            <div className="relative flex flex-wrap gap-4 justify-center mt-6">
              <button
                className="px-4 py-1 text-sm border border-gray-700 rounded-full bg-black hover:bg-gray-900 text-white transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Share
              </button>

              <button
                className="px-4 py-1 text-sm font-medium border border-indigo-600 text-white rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
                type="button"
                onClick={() => setMessageOpen((prev) => !prev)}
              >
                Message
              </button>

              <button
                className={`px-4 py-1 text-sm rounded-full transition shadow-sm ${
                  following
                    ? "bg-[#dc143c1a] text-[#dc143c] border border-[#dc143c66] hover:bg-[#dc143c33]"
                    : "bg-indigo-100 text-indigo-700 border border-indigo-300 hover:bg-indigo-200"
                }`}
                type="button"
                onClick={() => handleToggleFollow(user.id)}
                disabled={loading}
              >
                {loading ? "Loading..." : following ? "Unfollow" : "Follow"}
              </button>

              {messageOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[28rem] bg-white border border-gray-200 rounded-lg shadow-xl p-4 z-10">
                  <StartChatBox
                    message={message}
                    setMessage={setMessage}
                    otherId={user.id}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-center text-2xl font-semibold text-indigo-700 border-b pb-2 mb-4">
            {user.firstname} Creations
          </h3>

          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {!loading && pins.length > 0
              ? pins.map((pin:any) => (
                <Link
                    key={pin._id}
                    to={`/pins/${pin._id}`}
                    className="block overflow-hidden rounded-2xl border border-gray-700 hover:shadow-md transition"
                  >
                    <img
                      src={`http://localhost:8080${pin.image}`}
                      alt="Pin"
                      className="w-full rounded-2xl hover:opacity-90 transition"
                    />
                  </Link>
                ))
              : !loading &&
                auth && (
                  <p className="text-center text-gray-500 mt-10">
                    {user.firstname} hasn't created any pins yet.
                  </p>
                )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
