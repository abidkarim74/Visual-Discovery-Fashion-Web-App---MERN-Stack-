import { useState } from "react";
import { postRequest } from "../api/apiRequests";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";
import { useNavigate } from "react-router-dom";


const SignupPage = () => {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>
  }
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    const endpoint = '/auth/signup';
    const res = await postRequest(endpoint, formData, setLoading, setError);
    auth.setAccessToken(res.accessToken);
    auth.setLoading(false);
    navigate("/");
  };

  return (
    <div className="signup-page flex items-center justify-center min-h-screen bg-[#f8f8f8] px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg space-y-5"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Sign Up</h2>

        <div className="flex space-x-4">
          <input
            type="text"
            name="firstname"
            placeholder="First name"
            value={formData.firstname}
            onChange={handleChange}
            className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
          <input
            type="text"
            name="lastname"
            placeholder="Last name"
            value={formData.lastname}
            onChange={handleChange}
            className="w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          />
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Retype Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
          required
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-200"
        >
          {loading? 'Signing up...': 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default SignupPage;
