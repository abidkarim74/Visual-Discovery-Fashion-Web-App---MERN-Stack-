import React, { useEffect, useRef } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

interface Props {
  pins: any[];
  loading: boolean;
  error: string | null;
  onClose: () => void;
  setQuery: (value: string) => void;
  setClose: (value: boolean) => void;
}

const SearchResults: React.FC<Props> = ({
  pins,
  setQuery,
  loading,
  error,
  onClose,
  setClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setQuery("");
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div
        ref={modalRef}
        className="w-full max-w-3xl mx-4 bg-white shadow-xl rounded-2xl p-6 flex flex-col max-h-[80vh]"
      >
        <h3 className="text-xl font-semibold mb-4 text-center text-indigo-700">
          Search Results
        </h3>

        <div className="overflow-y-auto flex-grow pr-1">
          {loading && (
            <div className="flex justify-center items-center h-24">
              <div className="w-6 h-6 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && error && pins.length === 0 && (
            <div className="text-center text-gray-500">No results found.</div>
          )}

          {!loading && pins.length > 0 && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pins.map((pin, index) => (
                <li
                  key={index}
                  className="p-4 rounded-xl shadow hover:shadow-md transition flex flex-col items-center"
                >
                  <Link
                    to={`/pins/${pin._id}`}
                    className="w-32 h-32 rounded-lg overflow-hidden mb-2 group relative"
                    onClick={() => setClose(false)}
                  >
                    <LazyLoadImage
                      effect="blur"
                      src={`http://localhost:8080${pin.image}`}
                      alt=""
                      className="w-full h-full object-cover transform group-hover:scale-110 group-hover:brightness-75 transition duration-300 ease-in-out"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-10 opacity-0 group-hover:opacity-100 transition duration-300 rounded-lg"></div>
                  </Link>

                  <p className="text-indigo-800 text-sm text-center">
                    {pin.caption || "Untitled Pin"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-4 sticky bottom-0 bg-indigo-600 text-white rounded-xl py-2 hover:bg-purple-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
