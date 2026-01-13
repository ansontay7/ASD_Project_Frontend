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

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

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

    try {
      await api.delete(`/inventory/${id}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const categories = [...new Set(items.map((item) => item.category))];

  const filteredItems = items.filter(
    (item) =>
      item.item_name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "" || item.category === categoryFilter)
  );

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

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        style={{ marginLeft: "10px" }}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <br /><br 
      />
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
            <th>Category</th>
            <th>Quantity</th>
            {user.role === "Admin" && <th>Unit Price</th>}
            <th>Reorder Level</th>
            {user.role === "Admin" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan={user.role === "Admin" ? 5 : 4} align="center">
                No items found
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                {user.role === "Admin" && (
                <td>{item.unit_price}</td>
                )}
                <td>{item.reorder_level}</td>
                {user.role === "Admin" && (
                  <td>
                    <button onClick={() => navigate(`/inventory/edit/${item.item_id}`)}>
                      ✏ Edit
                    </button>
                    &nbsp;
                    <button onClick={() => deleteItem(item.item_id)}>🗑 Delete</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
