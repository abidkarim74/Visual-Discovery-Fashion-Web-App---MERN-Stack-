import { useEffect, useState } from "react";
import HeaderProfileDropDown from "./sub/HeaderProfileDropDown";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "./sub/MainLoading";
import { FiMenu } from "react-icons/fi";
import lumspire from "./lumspire.png";
import { FiX } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { postRequest } from "../api/apiRequests";
import SearchResults from "./sub/SearchResults";
import { FaRegBookmark, FaPlusSquare } from "react-icons/fa";

const Header = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    return <MainLoading></MainLoading>;
  }

  const [isOpen, setOpen] = useState<boolean>(false);

  const [isOpen2, setIsOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleToggleDropdown = () => setIsOpen((prev) => !prev);
  const handleToggleMobileMenu = () => setShowMobileMenu((prev) => !prev);
  const closeMobileMenu = () => setShowMobileMenu(false);

  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResult, setSearchResult] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [openResults, setOpenResults] = useState<boolean>(false);
  const [pins, setPins] = useState([]);

  useEffect(() => {
    const searchPinsFunc = async () => {
      const endpoint = "/pins/search-pins";

      const res = await postRequest(
        endpoint,
        { searchQuery },
        setLoading,
        setError
      );
      if (res) {
        if (res.length === 0) {
          setError("No pins found for the search criteria!");
        }
        setPins(res);
        if (searchQuery == "") {
          setOpenResults(false);
        } else {
          setOpenResults(true);
        }
      }
    };
    searchPinsFunc();
  }, [auth, searchQuery]);

  return (
    <div className="w-full sticky top-0 z-50 bg-white shadow-sm px-6 py-2 flex items-center justify-between">
      <Link to="/" className="flex items-center">
        <img
          src={lumspire}
          alt="Lumspire Logo"
          className="h-8 w-8 object-contain md:h-8 lg:h-10 rounded-full"
        />
      </Link>
      <div className="w-[80%] px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 max-w-screen-xl mx-auto">
        <div className="relative w-full ml-2">
          <input
            type="text"
            value={searchQuery}
            placeholder="Search"
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200 text-sm sm:text-base"
            style={{
              WebkitAppearance: "none",
              MozAppearance: "textfield",
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition duration-200"
            >
              <FiX size={18} />
            </button>
          )}
        </div>
      </div>
      {openResults && (
        <SearchResults
          pins={pins}
          loading={loading}
          error={error}
          setClose={setOpenResults}
          setQuery={setSearchQuery}
          onClose={() => setOpenResults(false)}
        />
      )}

      <nav className="relative">
        <div className="hidden sm:flex gap-4 border-b pb-1">
          <NavLink
            to="/pins/created"
            className={({ isActive }) =>
              `relative group text-xs sm:text-sm md:text-base font-medium transition duration-300 border-b-2 flex items-center gap-1 ${
                isActive
                  ? "text-indigo-600 border-indigo-500"
                  : "text-gray-600 border-transparent hover:text-black hover:border-indigo-500"
              }`
            }
          >
            <FaPlusSquare className="text-lg" />
            <span className="hidden lg:inline">Created</span>
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[10px] px-1.5 py-0.5 rounded bg-black text-white opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none lg:hidden">
              Created Pins
            </span>
          </NavLink>

          <NavLink
            to="/pins/saved"
            className={({ isActive }) =>
              `relative group text-xs sm:text-sm md:text-base font-medium transition duration-300 border-b-2 flex items-center gap-1 ${
                isActive
                  ? "text-indigo-600 border-indigo-500"
                  : "text-gray-600 border-transparent hover:text-black hover:border-indigo-500"
              }`
            }
          >
            <FaRegBookmark className="text-lg" />
            <span className="hidden lg:inline">Saved</span>
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-[10px] px-1.5 py-0.5 rounded bg-black text-white opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none lg:hidden">
              Saved Pins
            </span>
          </NavLink>
        </div>

        <div className="sm:hidden flex items-center">
          <button
            onClick={handleToggleMobileMenu}
            className="text-2xl text-gray-700 focus:outline-none"
          >
            <FiMenu />
          </button>
        </div>

        {showMobileMenu && (
          <div className="absolute right-0 top-12 bg-white rounded-md shadow-md px-4 py-3 flex flex-col gap-3 w-40 sm:hidden z-50">
            <NavLink
              to="/pins/created"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-2 font-medium pb-1 transition duration-300 border-b ${
                  isActive
                    ? "text-indigo-600 border-indigo-500"
                    : "text-gray-700 border-transparent hover:text-indigo-600 hover:border-indigo-500"
                }`
              }
            >
              <FaPlusSquare className="text-lg" />
              Created
            </NavLink>
            <NavLink
              to="/pins/saved"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-2 font-medium pb-1 transition duration-300 border-b ${
                  isActive
                    ? "text-indigo-600 border-indigo-500"
                    : "text-gray-700 border-transparent hover:text-indigo-600 hover:border-indigo-500"
                }`
              }
            >
              <FaRegBookmark className="text-lg" />
              Saved
            </NavLink>
          </div>
        )}
      </nav>
      {/* Profile */}
      <div className="relative flex items-center space-x-2 cursor-pointer left-4">
        <Link to={`/${auth.user?.username}/profile`}>
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-indigo-400 shadow-sm hover:shadow-md transition duration-200">
            {auth?.user?.profilePic ? (
              <img
                src={`http://localhost:8080${auth.user.profilePic}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-sm font-semibold text-white">
                {auth.user?.firstname[0]}
              </div>
            )}
          </div>
        </Link>

        <ChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          onClick={handleOpen}
        />

        <HeaderProfileDropDown isOpen={isOpen} />
      </div>
    </div>
  );
};

export default Header;
