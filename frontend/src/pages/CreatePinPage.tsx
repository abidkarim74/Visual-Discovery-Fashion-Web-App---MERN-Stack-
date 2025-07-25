import { useState } from "react";
import { postRequest } from "../api/apiRequests";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import MainLoading from "../components/sub/MainLoading";
import { useNavigate } from "react-router-dom";


const CreatePinPage = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>;
  }
  const [caption, setCaption] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      setError("Please select an image and fill the fields!");
      return;
    }
    setLoading(true);

    const formData = new FormData();
    if (image) formData.append("file", image);
    formData.append("caption", caption);
    formData.append("tags", JSON.stringify(tags));

    const endpoint = "/pins/create";
    const res = await postRequest(endpoint, formData, setLoading, setError);

    if (res) {
      navigate("/pins/created");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-600">
        Create a Pin
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100"
      >
        {/* Image Upload Section */}
        <div className="flex flex-col items-center justify-center">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto rounded-lg mb-4 max-h-96 object-cover"
            />
          ) : (
            <div className="w-full border-2 border-dashed border-indigo-300 rounded-lg flex items-center justify-center h-64 mb-4">
              <span className="text-indigo-300">No image selected</span>
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-600
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:font-medium
                   file:bg-indigo-100 file:text-indigo-700
                   hover:file:bg-indigo-200 transition"
          />
        </div>

        {/* Form Fields Section */}
        <div className="flex flex-col gap-6">
          <div>
            <label
              htmlFor="caption"
              className="block text-gray-700 font-medium mb-1"
            >
              Caption
            </label>
            <input
              id="caption"
              type="text"
              placeholder="Give your pin a title..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label
              htmlFor="tags"
              className="block text-gray-700 font-medium mb-1"
            >
              Tags
            </label>
            <input
              id="tags"
              type="text"
              placeholder="Press Enter or comma to add"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full border border-indigo-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="ml-2 text-indigo-500 hover:text-indigo-700 font-bold"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            className="mt-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transition"
          >
            {loading ? "Creating Pin..." : "Post Pin"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePinPage;
