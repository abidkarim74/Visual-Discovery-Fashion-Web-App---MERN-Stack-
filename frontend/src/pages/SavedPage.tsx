import { getRequest, postRequest } from "../api/apiRequests";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";


const SavedPage = () => {
  const auth = useContext(AuthContext);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pins, setPins] = useState([]);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedPins = async () => {
      const endpoint = "/feed/saved-pins";
      const res = await getRequest(endpoint, setLoading, setError);
      if (res) {
        setPins(res.pins || []);
      }
    };
    if (auth) fetchSavedPins();
  }, [auth]);

  const unsavePinFunc = async (pinId: string) => {
    const endpoint = "/feed/unsave-pin";
    setLoading(true);

    const res = await postRequest(endpoint, { pinId }, setLoading, setError);

    if (res) {
      setPins((prev) => prev.filter((pin: any) => pin._id !== pinId));
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!auth) return <MainLoading />;

  return (
    <div className="px-4 py-6 h-full">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold text-indigo-700 text-center mb-8 border-b pb-2 border-indigo-200">
          Your Saved Pins
        </h3>

        {loading && <MainLoading />}

        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {success && (
          <div className="flex justify-center">
            <div
              className={`bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded shadow-sm mb-4 transition-opacity duration-500 ${
                success ? "opacity-100" : "opacity-0"
              }`}
            >
              <p>{success}</p>
            </div>
          </div>
        )}

        {!loading && pins.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            You haven’t saved any pins yet.
          </p>
        )}

        <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
          {pins.map((pin: any) => (
            <Link
              to={`/pins/${pin._id}`}
              key={pin._id}
              className="break-inside-avoid"
            >
              <div className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                <LazyLoadImage
                  effect="blur"
                  src={`http://localhost:8080${pin.image}`}
                  alt={pin.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <button
                  className="absolute top-2 right-2 bg-[yellow] hover:bg-yellow-400 text-gray text-[11px] font-semibold px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    unsavePinFunc(pin._id);
                  }}
                >
                  Unsave
                </button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SavedPage;
