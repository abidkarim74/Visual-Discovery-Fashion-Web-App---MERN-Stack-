import lumspire from "./lumspire.png";
import { Link } from "react-router-dom";

const UnauthenticatedHeader = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-white  px-6 py-3 flex items-center justify-between border-b border-indigo-200">
      <Link to="/" className="flex items-center gap-2">
        <img
          src={lumspire}
          alt="LumSpire Logo"
          className="h-8 w-8 md:h-10 md:w-10 object-cover rounded-full"
        />
        <span className="text-lg md:text-xl font-semibold text-indigo-600 tracking-wide">
          LumSpire
        </span>
      </Link>
    </header>
  );
};

export default UnauthenticatedHeader;
