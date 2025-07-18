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

      // const userDetailEndpoint = '/profiles/user-info';

      // const user = await getRequest(userDetailEndpoint, setLoading, setError);
      setPin(res);

    };

    if (auth) fetchPinDetail();
  }, [auth]);

  if (!auth || loading) return <MainLoading />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!pin) return null;

  return (
    <div className="flex justify-center items-start p-4 bg-gray-100 min-h-screen">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <img
          src={pin.image}
          alt={pin.caption}
          className="w-full h-auto object-cover"
        />
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{pin.caption}</h1>
          
          {pin.tags && pin.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {pin.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-sm font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p>
              <span className="font-semibold">Created by:</span> {pin.creator}
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
