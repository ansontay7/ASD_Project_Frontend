import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "10px 20px",
        backgroundColor: "#333",
        color: "#fff",
      }}
    >
      {/* Left side: App name */}
      <div>
        <h2 style={{ margin: 0, fontSize: "18px" }}>Inventory Management</h2>
        {user && <small>Welcome, ({user.name})</small>}
      </div>

      {/* Right side: Navigation links */}
      <div style={{ display: "flex", gap: "10px" }}>
        {user && (
          <>
            <Link to="/dashboard" style={{ color: "#fff", textDecoration: "none" }}>
              Dashboard
            </Link>
            <Link to="/inventory" style={{ color: "#fff", textDecoration: "none" }}>
              Inventory
            </Link>
            
            <Link to="/stock-out">
          <button>Stock OUT</button>
            </Link>

      {user.role === "Admin" && (
        <>
          
          <Link to="/stock-in">
            <button>Stock IN</button>
          </Link>

          <Link to="/stock-history">
            <button>Stock Transaction</button>
          </Link>

          <Link to="/purchase-orders">
            <button>Purchase Orders</button>
          </Link>

          <Link to="/suppliers">
            <button>Supplier Management</button>
          </Link>
        </>
      )}
      <button onClick={logout} style={{ marginLeft: "10px" }}>
              Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
