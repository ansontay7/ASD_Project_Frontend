import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";



export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPO();
  }, []);

  const fetchPO = async () => {
    try {
      setLoading(true);
      const res = await api.get("/purchase-orders");
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h3>Loading purchase orders...</h3>;
  }

  if (error) {
    return <h3 style={{ color: "red" }}>{error}</h3>;
  }
  
  return (
    <div>
      <h2>Purchase Orders</h2>

      <Link to="/dashboard">
        <button>🏠 Back to Dashboard</button>
      </Link>

      {user.role === "Admin" && (
        <button onClick={() => navigate("/purchase-orders/create")}>
          ➕ Create PO
        </button>
      )}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>PO ID</th>
            <th>Supplier</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(po => (
            <tr key={po.po_id}>
              <td>{po.po_id}</td>
              <td>{po.supplier_name}</td>
              <td>{new Date(po.created_at).toLocaleString()}</td>
              <td>{po.status}</td>
              <td>
                <button onClick={() => navigate(`/purchase-orders/${po.po_id}`)}>
                  View
                </button>

                {user.role === "Admin" && po.status !== "RECEIVED" && (
                  <button
                    onClick={() =>
                      navigate(`/purchase-orders/${po.po_id}/receive`)
                    }
                  >
                    Receive
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
