import { useParams } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useContext, useState, useEffect } from "react";
import { getRequest } from "../api/apiRequests";
import MainLoading from "../components/sub/MainLoading";

const PinDetails = () => {
  const auth = useContext(AuthContext);
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pin, setPin] = useState<any>(null);

  const endpoint = '/pins/' + params.id;

  useEffect(() => {
    const fetchPinDetail = async () => {
      setLoading(true);
      const res = await getRequest(endpoint, setLoading, setError);
      console.log("Pin: ", res);
      setPin(res);
    };

    if (auth) fetchPinDetail();
  }, [auth]);

  if (!auth || loading) return <MainLoading />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!pin) return null;

  return (
    <div className="flex justify-center px-4 py-8 bg-[#f8f8f8] min-h-screen">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-xl overflow-hidden transition-transform duration-300 hover:scale-[1.01]">
        <img
          src={`http://localhost:8080${pin.image}`}
          alt={pin.caption}
          className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
        />
        <div className="p-4 sm:p-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {pin.caption}
          </h1>

          {pin.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {pin.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-[#efefef] text-gray-700 px-4 py-1 rounded-full text-sm font-medium shadow-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-500 space-y-2">
            <p>
              <span className="font-semibold">Created by:</span>{" "}
              <span className="text-gray-700">{pin.creator?.username || "Unknown"}</span>
            </p>
            <p>
              <span className="font-semibold">Posted on:</span>{" "}
              {new Date(pin.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinDetails;
