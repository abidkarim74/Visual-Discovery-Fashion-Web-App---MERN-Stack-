import { useState, useContext } from "react";
import { postRequest } from "../api/apiRequests";
import { useNavigate } from "react-router-dom";
import MainLoading from "../components/sub/MainLoading";
import { AuthContext } from "../context/authContext";

const SignUpPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  if (!auth) return <MainLoading />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { username, email, firstname, lastname, password, confirmPassword } = form;

    if (!username || !email || !firstname || !lastname || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const endpoint = "/auth/signup";
    const payload = { username, email, password, firstname, lastname };

    const data = await postRequest(endpoint, payload, setLoading, setError);
    auth.setAccessToken(data.accessToken);
    navigate("/");
  };

  return (
    <div className="h-full flex items-center justify-center p-4 from-indigo-100 to-indigo-300">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-center text-indigo-700">
          Join <span className="font-bold text-indigo-800">LumSpire</span>
        </h2>
        <h3 className="text-lg font-medium text-center text-gray-700">
          Create your account
        </h3>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <div>
            <label htmlFor="username" className="block mb-1 text-gray-700">
              Username
            </label>
            <input
              name="username"
              id="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700">
              Email
            </label>
            <input
              name="email"
              id="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label htmlFor="firstname" className="block mb-1 text-gray-700">
                First Name
              </label>
              <input
                name="firstname"
                id="firstname"
                type="text"
                value={form.firstname}
                onChange={handleChange}
                placeholder="First name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastname" className="block mb-1 text-gray-700">
                Last Name
              </label>
              <input
                name="lastname"
                id="lastname"
                type="text"
                value={form.lastname}
                onChange={handleChange}
                placeholder="Last name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-1/2">
              <label htmlFor="password" className="block mb-1 text-gray-700">
                Password
              </label>
              <input
                name="password"
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter a password"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="confirmPassword" className="block mb-1 text-gray-700">
                Retype Password
              </label>
              <input
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
