import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });

    console.log("LOGIN RESPONSE:", res.data);

    // 1️⃣ Save token FIRST
    localStorage.setItem("token", res.data.token);

    // 2️⃣ Decode token
    const decoded = jwtDecode(res.data.token);

    // 3️⃣ Set user ONCE
    const userData = {
      user_id: decoded.user_id,
      role: decoded.role,
      name: decoded.name,
    };

    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      setUser({
        user_id: decoded.user_id,
        role: decoded.role,
        name: decoded.name,
      });

      const expiryTime = decoded.exp * 1000 - Date.now();

      if (expiryTime <= 0) {
        logout();
      } else {
        const timeout = setTimeout(logout, expiryTime);
        return () => clearTimeout(timeout);
      }
    } catch {
      logout();
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    let timer;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(logout, 10 * 60 * 1000); // 10 minutes
    };

    const events = ["mousemove", "keydown", "click", "scroll"];

    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timer);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
