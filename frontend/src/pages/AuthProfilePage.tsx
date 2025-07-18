import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";

const AuthProfilePage = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }

  const { user } = auth;

  console.log(user);

  return (
    <div className="profile px-4 py-6 bg-white min-h-screen">
      {/* Profile Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <img
          src={`http://localhost:8080${user?.profilePic}`}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover border shadow"
        />
        <h2 className="text-2xl font-semibold mt-4">
          {user?.firstname} {user?.lastname}
        </h2>
        <p className="text-gray-500 mt-2">{user?.username}</p>
        <div className="followers flex justify-center gap-6 mt-2 text-sm text-gray-800 font-medium">
          <h3>
            {user?.followers?.length}{" "}
            <span className="text-gray-500">Followers</span>
          </h3>
          <h3>
            {user?.followings?.length}{" "}
            <span className="text-gray-500">Followings</span>
          </h3>
        </div>
        <div className="share-edit flex gap-3 justify-center mt-4">
          <button className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100 transition">
            Share
          </button>
          <button className="px-4 py-1 text-sm border rounded-full hover:bg-gray-100 transition">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Posts Grid (like Pinterest) */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {/* Replace these with dynamic content later */}
        {[...Array(12)].map((_, index) => (
          <div
            key={index}
            className="break-inside-avoid bg-gray-100 rounded-lg shadow-md overflow-hidden"
          >
            <img
              src={`https://source.unsplash.com/random/300x${300 + index}`}
              alt={`Post ${index}`}
              className="w-full h-auto object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthProfilePage;
