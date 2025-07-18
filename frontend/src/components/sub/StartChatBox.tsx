import { useState } from "react";
import { postRequest } from "../../api/apiRequests";

interface Props {
  setMessage: (value: string) => void;
  message: string;
  otherId: string;
}

const StartChatBox: React.FC<Props> = ({ setMessage, message, otherId }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = "/messages/create-conversation";
    const res = await postRequest(endpoint, { otherId, message }, setLoading, setError);

    console.log(res);

    setMessage("");
    setLoading(false);
  };

  return (
    <div className="mt-2 w-full px-3 sm:px-4 max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 sm:flex-row sm:gap-2"
      >
        <input
          id="start-chat"
          type="text"
          placeholder="Your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        />
        <button
          type="submit"
          disabled={!message.trim() || loading}
          className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default StartChatBox;
