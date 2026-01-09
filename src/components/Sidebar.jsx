import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <h3>Inventory System</h3>

      <Link to="/dashboard">Dashboard</Link>
      <Link to="/inventory">Inventory</Link>
      <Link to="/purchase-orders">Purchase Orders</Link>

      {user.role === "Admin" && (
        <>
          <Link to="/receive-po">Receive PO</Link>
          <Link to="/stock-out">Stock OUT</Link>
          <Link to="/stock-history">Stock Transactions</Link>
          <Link to="/suppliers">Suppliers</Link>
        </>
      )}

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Sidebar;
