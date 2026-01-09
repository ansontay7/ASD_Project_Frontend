import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, logout } = useAuth();
  
  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, ({user.role})</p>

      <hr />
      <button onClick={logout}>Logout</button>

      <Link to="/inventory">
        <button>View Inventory</button>
      </Link>

      <Link to="/stock-in">
        <button>Stock IN</button>
      </Link>

      {user.role === "Admin" && (
        <>
          <Link to="/stock-out">
            <button>Stock OUT</button>
          </Link>

          <Link to="/stock-history">
            <button>View Stock Transaction</button>
          </Link>

          <Link to="/purchase-orders">
            <button>View Purchase Orders</button>
          </Link>

          <Link to="/purchase-orders/create">
            <button>Create Purchase Order</button>
          </Link>

          <Link to="/suppliers">
            <button>Supplier Management</button>
          </Link>
        </>
      )}
    </div>
  );
}
