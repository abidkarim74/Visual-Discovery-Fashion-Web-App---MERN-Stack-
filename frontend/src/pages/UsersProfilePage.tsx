import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";
import { getRequest, postRequest } from "../api/apiRequests";
import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import StartChatBox from "../components/sub/StartChatBox";

const UserProfilePage = () => {
  const auth = useContext(AuthContext);

  if (!auth) return <MainLoading />;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [following, setFollowing] = useState<boolean>(false);
  const params = useParams();
  const navigate = useNavigate();

  // const isFollowing = useMemo(() => {
  //   return user?.followers?.some(
  //     (f: any) => f.username === auth?.user?.username
  //   );
  // }, [user?.followers, auth?.user?.username]);

  // useEffect(() => {
  //   setFollowing(isFollowing);

  // }, [isFollowing, user]);

  console.log("Following: ", following);

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
      setUser(res);
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

  const handleToggleFollow = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      try {
        const endpoint = `/profiles/toogle-follow`;
        await postRequest(endpoint, { id: user?.id }, setLoading, setError);

        setUser((prev: any) => {
          if (!prev || !auth?.user) return prev;

          const isCurrentlyFollowing = prev.followers.some(
            (f: any) => f.username === auth.user?.username
          );

          const updatedFollowers = isCurrentlyFollowing
            ? prev.followers.filter(
                (f: any) => f.username !== auth.user?.username
              )
            : [...prev.followers, auth.user];

          setFollowing((prev) => !prev);

          return {
            ...prev,
            followers: updatedFollowers,
          };
        });
      } catch (err) {
        console.error(err);
        setError("Failed to toggle follow status.");
      } finally {
        setLoading(false);
      }
    },
    [user?.id, auth?.user]
  );

  const [message, setMessage] = useState<string>("");
  const [messageOpen, setMessageOpen] = useState<boolean>(false);

  if (!user) return <MainLoading />;

  return (
    <div className="profile px-4 py-6 bg-white min-h-screen">
      {error && <h2 className="text-red-600">{error}</h2>}

      <div>
        <div className="flex flex-col items-center text-center mb-8">
          <img
            src={user?.profilePic || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border shadow"
          />
          <h2 className="text-2xl font-semibold mt-4">
            {user?.firstname} {user?.lastname}
          </h2>
          <p className="text-gray-500 mt-2">@{user?.username}</p>

          <div className="followers flex justify-center gap-6 mt-2 text-sm text-gray-800 font-medium">
            <h3>
              {user?.followers?.length ?? 0}{" "}
              <span className="text-gray-500">Followers</span>
            </h3>
            <h3>
              {user?.followings?.length ?? 0}{" "}
              <span className="text-gray-500">Followings</span>
            </h3>
          </div>

          {auth.user?.username !== user?.username && (
            <div className="relative flex gap-3 justify-center mt-4">
              <button
                className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100 transition"
                disabled={loading}
              >
                Share
              </button>

              <button
                className="px-4 py-1 text-sm font-medium border border-gray-300 rounded-full bg-white hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                disabled={loading}
                type="button"
                onClick={() => setMessageOpen((prev) => !prev)}
              >
                Message
              </button>

              <button
                className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100 transition"
                type="button"
                onClick={handleToggleFollow}
                disabled={loading}
              >
                {loading ? "Loading" : following ? "Unfollow" : "Follow"}
              </button>

              {messageOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-[28rem] bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                  <StartChatBox message={message} setMessage={setMessage} otherId={ user.id} />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4"></div>
      </div>
    </div>
  );
};

export default UserProfilePage;
