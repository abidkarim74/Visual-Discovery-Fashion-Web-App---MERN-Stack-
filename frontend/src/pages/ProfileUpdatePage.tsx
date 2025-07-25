import { AuthContext } from "../context/authContext";
import { useContext, useState, useEffect } from "react";
import MainLoading from "../components/sub/MainLoading";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { putRequest } from "../api/apiRequests";

const ProfileUpdatePage = () => {
  const auth = useContext(AuthContext);

  if (!auth) return <MainLoading />;

  const params = useParams();
  const navigate = useNavigate();

  if (params.username !== auth?.user?.username) {
    navigate("/");
  }

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    bio: "",
    profilePic: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (auth?.user) {
      setFormData({
        username: auth.user.username || "",
        firstname: auth.user.firstname || "",
        lastname: auth.user.lastname || "",
        bio: auth.user.bio || "",
        profilePic: null,
      });

      setPreview(auth.user.profilePic || null);
    }
  }, [auth?.user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, profilePic: e.target.files![0] }));
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", formData.username);
    data.append("firstname", formData.firstname);
    data.append("lastname", formData.lastname);
    data.append("bio", formData.bio);
    if (formData.profilePic) {
      data.append("file", formData.profilePic);
    }

    const endpoint = "/profiles/update-user";

    console.log(formData);

    const res = await putRequest(endpoint, data, setLoading, setError);

    auth.setUser(res);

    console.log(res);
    navigate(`/${auth?.user?.username}/profile`);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Update Profile</h2>
      <form onSubmit={handleSubmit} className="grid gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-tr from-red-400 to-pink-400 shadow-md">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                No Image
              </div>
            )}
          </div>
          <label className="cursor-pointer px-5 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-purple-500 transition">
            📷 Upload Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-purple-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-purple-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-gray-700">
            Tell us about yourself
          </label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-purple-200 rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400"
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-2 rounded-md text-lg font-medium shadow-md transition duration-200"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileUpdatePage;
