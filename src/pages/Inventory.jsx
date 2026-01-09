import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function Inventory() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [lowStock, setLowStock] = useState([]);

  useEffect(() => {
    fetchInventory();
    fetchLowStock();
  }, []);

  const fetchInventory = async () => {
    const res = await api.get("/inventory");
    setItems(res.data);
  };

  const fetchLowStock = async () => {
    const res = await api.get("/inventory/low-stock");
    setLowStock(res.data.items);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    await api.delete(`/inventory/${id}`);
    fetchInventory();
  };

  return (
    <div>
      <h2>Inventory</h2>

      <Link to="/dashboard">
        <button>🏠 Back to Dashboard</button>
      </Link>

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
