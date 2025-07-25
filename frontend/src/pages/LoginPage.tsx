import { useState } from "react";
import { postRequest } from "../api/apiRequests";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>;
  }

  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const endpoint = "/auth/login";

    if (password === "" || username === "") {
      setError("Username and password cannot be left empty!");
      return;
    }

    const data = await postRequest(
      endpoint,
      { username, password },
      setLoading,
      setError
    );
    console.log("Access token:: ", data.accessToken);
    auth.setAccessToken(data.accessToken);
    auth.setLoading(false);
    navigate("/");
  };
  return (
    <div className="h-full flex items-center justify-center  from-indigo-200 to-indigo-400 p-4">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8 space-y-6">
        <h3 className="text-2xl  text-center text-gray-800">
          Welcome back to{" "}
          <span className="text-indigo-600 font-bold">LumSpire</span>
        </h3>

        <h2 className="text-3xl font-bold text-center text-indigo-700">
          Login
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Your password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Don&apos;t have an account?{" "}
            <Link
              to="/signup"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
