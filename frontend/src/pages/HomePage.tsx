import { AuthContext } from "../context/authContext";
import { useContext, useEffect, useState, useRef } from "react";
import MainLoading from "../components/sub/MainLoading";
import { getRequest, postRequest} from "../api/apiRequests";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";


const HomePage = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }

  const [pins, setPins] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchPins = async (pg: number) => {
    try {
      setLoading(true);
      const endpoint = `/pins/all?page=${pg}&limit=10`;
      const res = await getRequest(endpoint, setLoading, setError);

      console.log(res.pins);

      const fetchedPins = res.pins || [];
      const newHasMore = res?.hasMore ?? false;


      setPins((prev) => (pg === 1 ? fetchedPins : [...prev, ...fetchedPins]));
      setHasMore(newHasMore);
    } catch (err) {
      setError("Failed to load pins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!auth.loading && auth.user) {
      setPins([]);
      setPage(1);
      setHasMore(true);
    }
  }, [auth.loading, auth.user]);

  useEffect(() => {
    if (loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
      }
    });

    if (loaderRef.current) {
      observer.current.observe(loaderRef.current);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    if (!auth.loading && auth.user && hasMore) {
      fetchPins(page);
    }
  }, [page, auth.loading, auth.user]);


  const sendSaveNotification = async (receiverId:string) => {
    const endpoint = '/notifications/create';
    setLoading(true);
    const res = await postRequest(endpoint, { text: `${auth.user?.username} saved your pin.`, receiverId }, setLoading, setError);
    
    console.log('Notification response: ', res);

  }

  return (
    <div className="max-w-7xl mx-auto px-1 py-2">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {pins.map((pin: any) => (
          <Link
            to={`/pins/${pin._id}`}
            key={pin._id}
            className="block group break-inside-avoid overflow-hidden rounded-lg  transition-all duration-300 ease-in-out bg-white"
          >
            <div className="relative">
              <LazyLoadImage
                effect="blur"
                src={`http://localhost:8080${pin.image}`}
                alt={pin.caption}
                className="w-full h-auto object-cover rounded-lg transform group-hover:scale-105 transition-transform duration-300"
              />
              <button
                className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-5 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  sendSaveNotification(pin.creator);
                }}
              >
                Save
              </button>
            </div>
          </Link>
        ))}
      </div>

      {loading && (
        <p className="text-gray-500 text-center mt-4">Loading more...</p>
      )}

      {!loading && hasMore && <div ref={loaderRef} className="h-10 mt-4" />}
      {!hasMore && pins.length > 0 && (
        <p className="text-center text-sm text-gray-400 mt-4">
          No more pins to load
        </p>
      )}
    </div>
  );
};

export default HomePage;
