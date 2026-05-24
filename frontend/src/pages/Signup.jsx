import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "USER",
  });

  const navigate = useNavigate();

  const signup = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/signup", form);
      alert("Signup successful");
      navigate("/login");
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.error ||
        error?.message ||
        "Signup failed";
      alert(message);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={signup}>
        <h1>Signup</h1>

        <input
          placeholder="Name"
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

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

        <select onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>

        <button type="submit">Signup</button>

        <p>
          Already have account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;
