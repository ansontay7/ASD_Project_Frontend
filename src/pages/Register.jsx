import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "../style/Login.css"; // you can reuse login styles
import logo from "../assets/logo.png";

export default function Register() {
  const { setAuthUser } = useAuth(); // assume your AuthContext has a setter for login
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://asd-project-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto-login: store user/token in AuthContext
      setAuthUser({
        token: data.token,
        user_id: data.user_id,
        role: data.role,
        name,
      });

      navigate("/dashboard"); // redirect after successful registration

    } catch (err) {
      console.error(err);
      setError("Server error, please try again");
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || !name.trim() || !email.trim() || !password.trim();

  return (
    <div className="login-page">
      <div className="login-overlay">
        <div className="login-panel">
          {/* Logo */}
          <div className="login-logo">
            <img src={logo} alt="Company Logo" />
          </div>

          <h2 className="login-title">Create an Account</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <input
              placeholder="User Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
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

            <button type="submit" disabled={isDisabled}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div style={{ marginTop: "10px", fontSize: "0.9rem", textAlign: "center"}}>
            Already have an account? <a href="/">Login</a>
          </div>
        </div>
      </div>
    </div>
  );
}
