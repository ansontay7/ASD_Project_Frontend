import { createContext, useContext, useState } from "react";
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
    };

    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
