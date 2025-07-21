import { useState } from "react";
import HeaderProfileDropDown from "./sub/HeaderProfileDropDown";
import { ChevronDown } from "lucide-react"; 
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "./sub/MainLoading";


const Header = () => {
  const auth = useContext(AuthContext);
  if (!auth) {
    return <MainLoading></MainLoading>
  }

  
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(prev => !prev);
  };

  return (
    <div className="w-full sticky top-0 z-50 bg-white shadow-sm px-6 py-2 flex items-center justify-between">
      <div className="text-xl font-semibold text-red-600 hidden md:block">
        Lumspire
      </div>

      <form className="flex-1 mx-4 max-w-4xl">
        <input
          type="search"
          placeholder="Search"
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
        />
      </form>

      <div className="relative flex items-center space-x-2 cursor-pointer">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold text-white">
          <Link to={`/${auth.user?.username}/profile`}>{auth?.user?.profilePic ? <img src={`http://localhost:8080${auth.user.profilePic}`}></img> : <p>{auth.user?.firstname[0] }</p> }</Link>
          
        </div>
        <ChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} onClick={handleOpen} />
        
        <HeaderProfileDropDown isOpen={isOpen}  />
      </div>
    </div>
  );
};

export default Header;
