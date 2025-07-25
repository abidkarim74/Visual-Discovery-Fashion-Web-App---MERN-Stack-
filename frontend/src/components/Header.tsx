import { useState } from "react";
import HeaderProfileDropDown from "./sub/HeaderProfileDropDown";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "./sub/MainLoading";
import { FiMenu } from "react-icons/fi";
import lumspire from "./lumspire.png";
import { NavLink } from "react-router-dom";


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

  return (
    <div className="w-full sticky top-0 z-50 bg-white shadow-sm px-6 py-2 flex items-center justify-between">
      {/* Brand */}
      <Link to="/" className="flex items-center">
        <img
          src={lumspire}
          alt="Lumspire Logo"
          className="h-8 w-auto object-contain md:h-8 lg:h-10 rounded-full"
        />
      </Link>

      {/* Search */}
      <form className="flex-1 mx-4 max-w-2xl">
        <input
          type="search"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
        />
      </form>

      <nav className="relative">
        {/* Desktop Nav */}
        <div className="hidden sm:flex gap-3 border-b pb-2">
          <NavLink
            to="/pins/created"
            className={({ isActive }) =>
              `text-sm sm:text-base md:text-lg font-medium transition duration-300 border-b-2 ${
                isActive
                  ? "text-indigo-600 border-indigo-500"
                  : "text-gray-600 border-transparent hover:text-black hover:border-indigo-500"
              }`
            }
          >
            Created
          </NavLink>
          <NavLink
            to="/pins/saved"
            className={({ isActive }) =>
              `text-sm sm:text-base md:text-lg font-medium transition duration-300 border-b-2 ${
                isActive
                  ? "text-indigo-600 border-indigo-500"
                  : "text-gray-600 border-transparent hover:text-black hover:border-indigo-500"
              }`
            }
          >
            Saved
          </NavLink>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={handleToggleMobileMenu}
            className="text-2xl text-gray-700 focus:outline-none"
          >
            <FiMenu />
          </button>
        </div>

        {/* Mobile Dropdown */}
        {showMobileMenu && (
          <div className="absolute right-0 top-12 bg-white rounded-md shadow-md px-4 py-3 flex flex-col gap-3 w-40 sm:hidden z-50">
            <NavLink
              to="/pins/created"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `font-medium pb-1 transition duration-300 border-b ${
                  isActive
                    ? "text-indigo-600 border-indigo-500"
                    : "text-gray-700 border-transparent hover:text-indigo-600 hover:border-indigo-500"
                }`
              }
            >
              Created
            </NavLink>
            <NavLink
              to="/pins/saved"
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `font-medium pb-1 transition duration-300 border-b ${
                  isActive
                    ? "text-indigo-600 border-indigo-500"
                    : "text-gray-700 border-transparent hover:text-indigo-600 hover:border-indigo-500"
                }`
              }
            >
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
