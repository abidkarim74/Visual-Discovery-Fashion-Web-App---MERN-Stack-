import { AuthContext } from "../context/authContext";
import { useContext, useEffect, useState } from "react";
import MainLoading from "../components/sub/MainLoading";
import { getRequest, postRequest } from "../api/apiRequests";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";

const CreatedPage = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pins, setPins] = useState<any[]>([]);

  useEffect(() => {
    const fetchPins = async () => {
      const endpoint = "/pins/auth-pins";
      const res = await getRequest(endpoint, setLoading, setError);

      if (res) {
        setPins(res);
      }
    };

    fetchPins();
  }, [auth]);

  const [deleteMessage, setDeleteMessage] = useState<string | null>(null);

  const deletePinFunc = async (pinId: string) => {
    const endpoint = "/feed/delete-pin";

    const res = await postRequest(endpoint, { pinId }, setLoading, setError);
    if (res) {
      setDeleteMessage(res.message);
      setPins((prevPins) => {
        const updated = prevPins.filter((p: any) => p._id !== pinId);
        return updated;
      });
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
    if (deleteMessage) {
      const timer = setTimeout(() => {
        setDeleteMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [deleteMessage]);

  return (
    <div className="h-full px-2 py-3">
      <div className="max-w-5xl mx-auto">
        {!loading && auth && (
          <div className="flex justify-center border-b border-indigo-200 pb-2 mb-6">
            <h3 className="text-2xl font-semibold text-indigo-700 text-center">
              Your Creations
            </h3>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md mb-4">
            {error}
          </div>
        )}
        {deleteMessage && (
          <div className="bg-green-200 text-red-700 px-4 py-2 rounded-md mb-4">
            {deleteMessage}
          </div>
        )}

        {pins.length > 0 ? (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {pins.map((p: any) => (
              <Link
                to={`/pins/${p._id}`}
                key={p._id}
                className="block group break-inside-avoid overflow-hidden rounded-xl bg-white relative transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative overflow-hidden rounded-xl">
                  <LazyLoadImage
                    effect="blur"
                    src={`http://localhost:8080${p.image}`}
                    alt={p.caption}
                    className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-hover:rotate-1"
                  />
                  <button
                    className="absolute top-2 right-2 bg-[crimson] hover:bg-red-800 text-white text-[11px] font-semibold px-4 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg"
                    onClick={(e) => {
                      e.preventDefault();
                      deletePinFunc(p._id);
                    }}
                  >
                    Delete
                  </button>

                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300 pointer-events-none rounded-xl"></div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center mt-6">
            {!loading && auth && (
              <p className="text-gray-500 text-center">
                You haven’t created any pins yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatedPage;
