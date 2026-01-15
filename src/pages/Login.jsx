import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../style/Login.css";
import logo from "../assets/logo.png";

export default function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      console.log("User detected, redirecting:", user);
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await login(email, password);
      alert("Login success");
    } catch {
      setError("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !email.trim() || !password.trim();

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

            {error && <div className="login-error">{error}</div>}

            <button type="submit" disabled={isDisabled}>{loading ? "Logging in..." : "Login"}</button>
          </form>

          <div style={{ marginTop: "10px", fontSize: "0.9rem", textAlign: "center" }}>
            Don’t have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
