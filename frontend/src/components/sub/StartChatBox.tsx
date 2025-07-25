import { useState, useRef, useEffect } from "react";
import { postRequest } from "../../api/apiRequests";
import { IoSend } from "react-icons/io5";

interface Props {
  setMessage: (value: string) => void;
  message: string;
  otherId: string;
  onClose: () => void;
}

const StartChatBox: React.FC<Props> = ({ setMessage, message, otherId, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = "/messages/create-conversation";
    const res = await postRequest(endpoint, { otherId, message }, setLoading, setError);

    console.log(res);

    setMessage("");
    setLoading(false);
    onClose(); // Close after sending (optional)
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
      <div
        ref={boxRef}
        className="w-full px-4 sm:px-6 max-w-xl"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-indigo-300 rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          <input
            id="start-chat"
            type="text"
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          />
          <button
            type="submit"
            disabled={!message.trim() || loading}
            className="flex items-center justify-center gap-1 sm:w-auto px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : <><IoSend className="text-lg" /> Send</>}
          </button>
        </form>
        {error && <p className="mt-3 text-center text-sm text-red-500">{error}</p>}
      </div>
    </div>
  );
};

export default StartChatBox;
