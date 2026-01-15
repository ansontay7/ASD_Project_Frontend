import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";
import logo from "../assets/logo.png";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      console.log("User detected, redirecting:", user);
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      alert("Login success");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-panel">
          {/* Logo */}
          <div className="login-logo">
            <img src={logo} alt="Company Logo" />
          </div>

          <h2 className="login-title">Inventory Management System</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}
