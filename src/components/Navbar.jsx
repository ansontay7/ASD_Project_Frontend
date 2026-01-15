import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      {/* Left side: App name */}
      <div className="navbar-left">
        <h2 className="navbar-title">Inventory Management</h2>
      </div>

      {/* Right side: Navigation links */}
      {user && (
        <div className="navbar-right">
          <Link to="/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/inventory" className="nav-link">Inventory</Link>
          <Link to="/stock-out" className="nav-link">Stock OUT</Link>

          {user.role === "Admin" && (
            <>
              <Link to="/stock-in" className="nav-link">Stock IN</Link>
              <Link to="/stock-history" className="nav-link">Stock Transaction</Link>
              <Link to="/purchase-orders" className="nav-link">Purchase Orders</Link>
              <Link to="/suppliers" className="nav-link">Supplier Management</Link>
            </>
          )}

          <button onClick={logout} className="nav-button logout-button">Logout</button>
        </div>
      )}
    </nav>
  );
}
