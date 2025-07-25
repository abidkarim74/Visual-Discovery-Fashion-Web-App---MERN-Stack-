import { getRequest } from "../../api/apiRequests";
import { AuthContext } from "../../context/authContext";
import { useContext, useEffect, useState } from "react";
import MainLoading from "./MainLoading";
import { Link } from "react-router-dom";

interface Props {
  setChat: (value: string) => void;
  setReceiverId: (value: string) => void;
}

const Conversation: React.FC<Props> = ({ setChat, setReceiverId }) => {
  const auth = useContext(AuthContext);

  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  const endpoint = "/messages/get-all-conversations";

  const fetchConversations = async () => {
    setLoading(true);
    const res = await getRequest(endpoint, setLoading, setError);
    setConversations(res);
  };

  useEffect(() => {
    fetchConversations();
  }, [auth?.loading]);

  if (!auth) {
    return <MainLoading />;
  }

  return (
    <div className="w-full max-w-xs border-r h-[80%] border-gray-200 bg-white overflow-y-auto">
      {/* Sticky header */}
      <h2 className="text-xl font-semibold px-4 py-3 sticky top-0 bg-white z-10 border-b">
        Chats
      </h2>

      <div className="flex flex-col">
        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {error && <p className="text-center text-red-500 py-4">{error}</p>}

        {/* Chat list */}
        {conversations.length > 0 &&
          conversations.map((con: any) => (
            <Link
              to="#"
              key={con._id}
              className="hover:bg-gray-100 transition duration-200 px-4 py-3 flex items-center gap-3"
              onClick={() => {
                setChat(con._id);
                setReceiverId(
                  auth.user?.username === con.participants[0].username
                    ? con.participants[1]._id
                    : con.participants[0]._id
                );
              }}
            >
              {/* Get the other participant */}
              {con.participants
                .filter((p: any) => p.username !== auth.user?.username)
                .map((pa: any) => (
                  <div className="flex items-center gap-3" key={pa.username}>
                    <img
                      src={`http://localhost:8080${pa.profilePic}`}
                      alt={pa.username}
                      className="w-10 h-10 rounded-full object-cover border border-gray-300"
                    />
                    <p className="text-sm font-medium text-gray-800">
                      {pa.username}
                    </p>
                  </div>
                ))}
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Conversation;
