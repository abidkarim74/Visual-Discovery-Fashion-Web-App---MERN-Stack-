import { useState } from "react";
import { postRequest } from "../api/apiRequests";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import MainLoading from "../components/sub/MainLoading";

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

    // if (!data || !data.accessToken) {
    //   setError("Invalid credentials or server error.");
    //   return;
    // }
    console.log('Access token:: ', data.accessToken);
    auth.setAccessToken(data.accessToken);
    auth.setLoading(false);
    navigate("/");
  };
  return (
    <div className="login-page">
      <h3>Login</h3>

      <div className="message">{error && <p>{error}</p>}</div>
      <form onSubmit={handleLogin}>
        <label htmlFor="username" id="username">
          Username
        </label>
        <input
          type="text"
          placeholder="Your username..."
          value={username}
          onChange={(e: any) => setUsername(e.target.value)}
        />

        <label htmlFor="password" id="password">
          Password
        </label>
        <input
          type="text"
          placeholder="Your password..."
          value={password}
          onChange={(e: any) => setPassword(e.target.value)}
        />
        <button type="submit">{loading ? "Logging in..." : "Login"}</button>
      </form>
    </div>
  );
};

export default LoginPage;
