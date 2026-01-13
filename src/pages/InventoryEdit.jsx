import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";

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
    <div>
      <h2>Edit Inventory Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name: </label>
          <input name="item_name" value={item.item_name} onChange={handleChange} />
        </div>
        <div>
          <label>Quantity: </label>
          <input type="number" name="quantity" value={item.quantity} onChange={handleChange} />
        </div>
        <div>
          <label>Reorder Level: </label>
          <input type="number" name="reorder_level" value={item.reorder_level} onChange={handleChange} />
        </div>
        <div>
            <label>Category: </label>
            <input name="category" value={item.category} onChange={handleChange} />
        </div>
        <div>
            <label>Unit Price: </label>
            <input type="number" name="unit_price" value={item.unit_price} onChange={handleChange} />
        </div>
        <div>
            <label>Supplier ID: </label>
            <input type="number" name="supplier_id" value={item.supplier_id} onChange={handleChange} />
        </div>
        <button type="submit">💾 Save</button>
        <button type="button" onClick={() => navigate("/inventory")}>Cancel</button>
      </form>
    </div>
  );
}
