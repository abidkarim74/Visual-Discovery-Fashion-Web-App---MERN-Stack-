import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaQuoteLeft } from "react-icons/fa";
import { HiOutlineUserCircle } from "react-icons/hi";
import FolowersList from "../components/sub/FollowersList";
import FollowingsList from "../components/sub/FollowingsList";


const AuthProfilePage = () => {
  const auth = useContext(AuthContext);

  if (!auth) return <MainLoading />;

  const { user } = auth;

  const [followerOpen, setFollowerOpen] = useState<boolean>(false);
  const [followingOpen, setFollowingOpen] = useState<boolean>(false);
 
  console.log(followerOpen);

  return (
    <div className="profile px-4 py-6 bg-white h-full overflow-x-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center mb-10">
        {user?.profilePic ? (
          <img
            src={`http://localhost:8080${user?.profilePic}`}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md ring-2 ring-indigo-300"
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

        <div className="flex gap-10 mt-4 text-sm text-gray-800 justify-center">
          <Link
            to="#"
            className="flex flex-col items-center hover:text-indigo-600 transition duration-200"
            onClick={() => setFollowerOpen((prev) => !prev)}
          >
            <span className="text-base font-semibold">
              {user?.followers?.length}
            </span>
            <span className="text-gray-500 text-xs">Followers</span>
          </Link>

          <Link
            to="#"
            className="flex flex-col items-center hover:text-indigo-600 transition duration-200"
            onClick={() => setFollowingOpen(prev => !prev)}
          >
            <span className="text-base font-semibold">
              {user?.followings?.length}
            </span>
            <span className="text-gray-500 text-xs">Following</span>
          </Link>
        </div>

        {followerOpen && <FolowersList isOpen={followerOpen} setIsOpen={setFollowerOpen}></FolowersList>}

        {followingOpen && <FollowingsList isOpen={followingOpen} setIsOpen={setFollowingOpen}></FollowingsList>}

        <div className="flex gap-4 mt-4">
          <button className="px-5 py-2 text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 transition rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300">
            Share
          </button>

          <Link
            to={`/${auth.user?.username}/update-profile`}
            className="px-5 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 hover:bg-indigo-50 transition rounded-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      <div className="about bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-2xl shadow-sm px-6 py-5 max-w-3xl mx-auto mt-8 w-full">
        <div className="flex items-center gap-3 mb-4">
          <HiOutlineUserCircle className="text-xl text-indigo-500" />
          <h3 className="text-lg font-semibold text-gray-800">Hey there!</h3>
        </div>
        <div className="text-gray-700 text-sm leading-relaxed flex items-start gap-2">
          <FaQuoteLeft className="text-indigo-400 mt-1" />
          <p className="italic">
            {user?.bio ||
              "No bio added yet. You can update your bio from Edit Profile."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthProfilePage;
