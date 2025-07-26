import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/authContext";
import MainLoading from "./MainLoading";
import { getRequest } from "../../api/apiRequests";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { formatDistanceToNow } from "date-fns";
import { Heart, MoreVertical } from "lucide-react";
import { Send } from "lucide-react";
import { postRequest } from "../../api/apiRequests";
import type { Comment } from "../../types/ChatTypes";

interface Props {
  pin: any;
}

const CommentSection: React.FC<Props> = ({ pin }) => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading />;
  }

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommentsFunc = async () => {
      const endpoint4 = "/comments/" + pin._id + "/comments-list";
      const res = await getRequest(endpoint4, setLoading, setError);

      if (res) {
        setComments(res);
      }
    };
    fetchCommentsFunc();
  }, [auth, pin]);

  const [comment, setComment] = useState<string>("");

  const addCommentFunc = async (e: any, pinId: string) => {
    e.preventDefault();

    if (comment.trim() === "") {
      setError("Comment cannot be empty!");
      return;
    }

    const commentText = comment; 
    const newComment: Comment = {
      user: {
        _id: auth.user!.id,
        username: auth.user!.username,
        profilePic: auth.user!.profilePic,
      },
      text: commentText,
      createdAt: Date.now(),
    };

    setComments((prev: Comment[]) => [newComment, ...prev]);
    setComment(""); 

    const context = 'http://localhost:5173/pins/' + pin._id; 

    const endpoint3 = "/comments/add-comment";
    await postRequest(
      endpoint3,
      { text: commentText, pinId, context },
      setLoading,
      setError
    );
  };

  return (
    <div className="comments-section mb-10 mt-4 h-[40vh]">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {error && <p className="text-red-500">{error}</p>}
      {loading && (
        <div className="flex justify-center py-6">
          <div className="spinner" />
        </div>
      )}

      {comments && (
        <div className="relative border rounded-md max-h-[300px] overflow-y-auto custom-scroll">
          <div className="space-y-4 px-4 py-2 pb-20">
            {comments.length > 0 ? (
              comments.map((comment: any) => (
                <div
                  className="p-3 bg-gray-100 rounded-lg shadow-sm"
                  key={comment._id}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <LazyLoadImage
                      effect="blur"
                      src={`http://localhost:8080${comment.user.profilePic}`}
                      alt={comment.user.username}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="font-medium">{comment.user.username}</span>
                  </div>

                  <p className="text-sm text-gray-800 ml-11">{comment.text}</p>

                  <div className="flex items-center gap-4 mt-2 ml-11 text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                    <button className="flex items-center gap-1 hover:text-red-500 transition">
                      <Heart className="w-4 h-4" />
                      Like
                    </button>
                    <button className="hover:text-gray-800 transition">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                <h3>Be the first to comment!</h3>
              </div>
            )}
          </div>

          <form className="sticky bottom-0 bg-white border-2 rounded-2xl px-4 py-3 flex items-center gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e: any) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            <button
              onClick={(e: any) => addCommentFunc(e, pin._id)}
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 text-sm rounded-full font-semibold"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
