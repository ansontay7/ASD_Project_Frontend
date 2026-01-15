import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      {/* Left side: App name */}
      <div className="navbar-left">
        <h2 className="navbar-title">Inventory Management</h2>

        {/* Hamburger (mobile/tablet only) */}
        {user && (
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            ☰
          </button>
        )}
      </div>

      {/* Right side: Navigation links */}
      {user && (
        <div className={`navbar-right ${menuOpen ? "open" : ""}`}>
          <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>
          <Link to="/inventory" className="nav-link" onClick={() => setMenuOpen(false)}>Inventory</Link>
          <Link to="/stock-out" className="nav-link" onClick={() => setMenuOpen(false)}>Stock OUT</Link>

          {user.role === "Admin" && (
            <>
              <Link to="/stock-in" className="nav-link" onClick={() => setMenuOpen(false)}>Stock IN</Link>
              <Link to="/stock-history" className="nav-link" onClick={() => setMenuOpen(false)}>Stock Transaction</Link>
              <Link to="/purchase-orders" className="nav-link" onClick={() => setMenuOpen(false)}>Purchase Orders</Link>
              <Link to="/suppliers" className="nav-link" onClick={() => setMenuOpen(false)}>Supplier Management</Link>
            </>
          )}

          <button onClick={() => {logout();setMenuOpen(false); }} className="nav-button logout-button">Logout</button>
        </div>
      )}
    </nav>
  );
}
