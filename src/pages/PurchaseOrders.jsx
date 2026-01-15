import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import "../style/PurchaseOrders.css";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState(""); // e.g., "PENDING", "RECEIVED"
  const [supplierFilter, setSupplierFilter] = useState("");

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
  
  const filteredOrders = orders.filter(po => {
  return (
    (statusFilter === "" || po.status === statusFilter) &&
    (supplierFilter === "" || po.supplier_name.toLowerCase().includes(supplierFilter.toLowerCase()))
    );
  });

  if (loading) {
    return <h3 className="loading">Loading purchase orders...</h3>;
  }

  if (error) {
    return <h3 style={{ color: "red" }}>{error}</h3>;
  }

  return (
    <><Navbar />
    <div className="purchase-orders-page">
      <div className="purchase-orders-header">
        <h2>Purchase Orders</h2>

        <div className="purchase-orders-buttons">
          {user.role === "Admin" && (
            <button onClick={() => navigate("/purchase-orders/create")}>Create PO
            </button>
          )}
        </div>
      </div>

      <div className="purchase-orders-filters">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="PENDING">PENDING</option>
          <option value="RECEIVED">RECEIVED</option>
        </select>

        <input
          type="text"
          placeholder="Search supplier..."
          value={supplierFilter}
          onChange={(e) => setSupplierFilter(e.target.value)}
        />
      </div>

      <div className="purchase-orders-table">
        <table>
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
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="5" align="center">No purchase orders found</td>
              </tr>
            ) : (
              filteredOrders.map(po => (
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
              ))
            )}
          </tbody>
        </table>
    </div>
  </div>
  </>
  );
}
