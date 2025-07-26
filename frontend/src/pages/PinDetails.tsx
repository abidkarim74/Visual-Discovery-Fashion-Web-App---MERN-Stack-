import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext, useState, useEffect } from "react";
import { getRequest, postRequest } from "../api/apiRequests";
import MainLoading from "../components/sub/MainLoading";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import CommentSection from "../components/sub/CommentSection";

const PinDetails = () => {
  const auth = useContext(AuthContext);
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pin, setPin] = useState<any>(null);

  const endpoint = "/pins/" + params.id;

  useEffect(() => {
    const fetchPinDetail = async () => {
      setLoading(true);
      const res = await getRequest(endpoint, setLoading, setError);

      if (res) {
        setPin(res);
      }
    };

    if (auth) fetchPinDetail();
  }, [auth]);

  const [showFullImage, setShowFullImage] = useState(false);
  let formattedDate = "";
  if (pin) {
    formattedDate = new Date(pin.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  const [showComments, setShowComments] = useState(false);

  if (!auth) return <MainLoading />;
  if (error) return <p className="text-red-500 text-center mt-8">{error}</p>;
  if (!pin) return null;

  return (
    <div className="pin-details px-2 py-4 h-full text-black">
      <div className="upper flex flex-col md:flex-row gap-8 px-6 py-3">
        <div className="w-full md:w-[30%]">
          <div className="relative rounded-2xl overflow-hidden shadow-lg max-h-[65vh] w-full group bg-gray-900">
            <div className="absolute inset-0 bg-black/30 z-0" />
            <LazyLoadImage
              src={`http://localhost:8080${pin.image}`}
              effect="blur"
              alt={pin.caption}
              className="w-full h-full object-contain relative z-10 transition-transform duration-300 ease-in-out group-hover:scale-105 group-hover:brightness-105"
            />

            <button
              onClick={() => setShowFullImage(true)}
              className="absolute bottom-4 right-4 px-4 py-1.5 text-sm rounded-full font-semibold bg-black text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
            >
              View Full Image
            </button>

            {showFullImage && (
              <div
                className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50"
                onClick={() => setShowFullImage(false)}
              >
                <img
                  src={`http://localhost:8080${pin.image}`}
                  alt="Full Preview"
                  className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl transition-all"
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-[70%] grid grid-rows-[auto_auto_1fr] grid-cols-2 gap-4">
          <div className="col-span-1">
            {pin.creator && (
              <Link
                to={`/${pin.creator.username}`}
                className="flex items-center gap-3"
              >
                <img
                  src={`http://localhost:8080${pin.creator.profilePic}`}
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white ring-2 ring-indigo-500 hover:ring-indigo-600 transition duration-300"
                />

                <p className="font-medium">{pin.creator.username}</p>
              </Link>
            )}
            <div className=" break-words mt-4">
              <h2 className="text-2xl font-bold"> {pin.caption}</h2>
              <span className="text-xs text-gray-500">
                Created on {formattedDate}
              </span>
            </div>
          </div>

          <div className="col-span-1 flex justify-end items-start gap-4">
            <button className="bg-gray-200 text-xs px-4 py-1.5 rounded-full font-semibold">
              Save
            </button>
            <a
              href={`http://localhost:8080${pin.image}`}
              download
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-1.5 rounded-full font-semibold"
            >
              Download
            </a>
          </div>

          <div className="col-span-2">
            <div className="flex items-center gap-4 mt-2 text-gray-700 text-sm">
              <button className="flex items-center gap-1 hover:text-red-500 transition">
                <span>{pin.likers.length}</span>
                <AiFillHeart className="w-8 h-8" />
              </button>

              <button className="flex items-center gap-1 hover:text-indigo-600 transition">
                <span>{pin.comments.length}</span>

                <FaRegComment className="w-8 h-8" />
              </button>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
              <div className="open-comments bg-gray-100 p-3 mt-3 rounded-md flex items-center justify-between">
                <span className="text-sm text-gray-700 font-semibold">
                  {showComments ? "Hide comments" : "View comments"}
                </span>
                <button
                  onClick={() => setShowComments(!showComments)}
                  className="text-black"
                >
                  {showComments ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} />
                  )}
                </button>
              </div>
            </div>
            {showComments && <CommentSection pin={pin}></CommentSection>}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-bold mb-2">Similar Pins</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-indigo-100 rounded-xl h-24 animate-pulse" />
          <div className="bg-indigo-100 rounded-xl h-24 animate-pulse" />
          <div className="bg-indigo-100 rounded-xl h-24 animate-pulse" />
          <div className="bg-indigo-100 rounded-xl h-24 animate-pulse" />
          <div className="bg-indigo-100 rounded-xl h-24 animate-pulse" />
        </div>
      </div>
    </div>
  );
};

export default PinDetails;
