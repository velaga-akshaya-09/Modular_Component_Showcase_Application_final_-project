import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      if (res.data?.token) {
        onLogin(res.data);
        navigate("/dashboard");
      } else {
        alert(res.data?.error || "Invalid login");
      }
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        error?.message ||
        "Login failed";
      alert(message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={login}>
        <h1>Login</h1>

        <input
          placeholder="Email"
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button type="submit">Login</button>

        <p>
          New user? <Link to="/signup">Signup</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
