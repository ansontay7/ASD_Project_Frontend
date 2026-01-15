import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../style/InventoryEdit.css";

export default function InventoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState({ item_name: "", quantity: 0, reorder_level: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchItem();
  }, []);

  const fetchItem = async () => {
    try {
      const res = await api.get(`/inventory/${id}`);
      setItem(res.data);
    } catch (err) {
      setError("Failed to load item");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/inventory/${id}`, item);
      navigate("/inventory"); // back to inventory list
    } catch (err) {
      setError("Failed to update item");
    }
  };

  if (loading) return <h3>Loading item...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  return (
    <div className="inventory-edit-page">
      <div className="inventory-edit-container">

        <div className="inventory-edit-header">
          <h2>Edit Inventory Item</h2>
        </div>

        <form className="inventory-edit-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <h4>Name</h4>
            <input
              name="item_name"
              value={item.item_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <h4>Quantity</h4>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <h4>Reorder Level</h4>
            <input
              type="number"
              name="reorder_level"
              value={item.reorder_level}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <h4>Category</h4>
            <input
              name="category"
              value={item.category || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <h4>Unit Price</h4>
            <input
              type="number"
              name="unit_price"
              value={item.unit_price || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <h4>Supplier ID</h4>
            <input
              type="number"
              name="supplier_id"
              value={item.supplier_id || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button type="submit">💾 Save</button>
          </div>

          <div className="navigation-section">
            <button type="button" onClick={() => navigate("/inventory")}>
              ⬅ Back to Inventory
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
