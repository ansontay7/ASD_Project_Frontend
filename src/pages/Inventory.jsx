import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Inventory() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [inventoryRes, lowStockRes] = await Promise.all([
        api.get("/inventory"),
        api.get("/inventory/low-stock"),
      ]);

      setItems(inventoryRes.data);
      setLowStock(lowStockRes.data.items);
    } catch (err) {
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/inventory/${id}`);
    fetchInventory();
  };

  if (loading) {
    return <h3>Loading inventory...</h3>;
  }

  if (error) {
    return <h3 style={{ color: "red" }}>{error}</h3>;
  }
  
  return (
    <div>
      <h2>Inventory</h2>

      <Link to="/dashboard">
        <button>🏠 Back to Dashboard</button>
      </Link>

      {user.role === "Admin" && (
        <button onClick={() => navigate("/inventory/create")}>
          ➕ Create Item
        </button>
      )}

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div style={{ color: "red" }}>
          ⚠ Low Stock Items: {lowStock.length}
        </div>
      )}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Reorder Level</th>
            {user.role === "Admin" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.item_id}>
              <td>{item.item_name}</td>
              <td>{item.quantity}</td>
              <td>{item.reorder_level}</td>

              {user.role === "Admin" && (
                <td>
                  <button onClick={() => deleteItem(item.item_id)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
