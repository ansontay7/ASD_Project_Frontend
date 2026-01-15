import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../style/CreateItem.css";

export default function CreateItem() {
  const navigate = useNavigate();

  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [unitPrice, setUnitPrice] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState([]);

  /* Load suppliers for dropdown */
  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      alert("Failed to load suppliers");
    }
  };

  const submitItem = async (e) => {
    e.preventDefault();

    if (!itemName || !category || !quantity || !unitPrice || !reorderLevel || !supplierId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      await api.post("/inventory", {
        item_name: itemName,
        category,
        quantity: Number(quantity),
        unit_price: Number(unitPrice),
        reorder_level: Number(reorderLevel),
        supplier_id: supplierId || null,
      });

      alert("Item created successfully");
      navigate("/inventory");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create item");
    }
  };

  return (
    <div className="create-item-page">
      <div className="create-item-container">
      <div className="create-item-header">
        <h2>Create Inventory Item</h2>
      </div>

      <div className="create-item-form-wrapper">
        <form onSubmit={submitItem}>

          <div className="form-group">
            <h4>Item Name</h4>
            <input
              placeholder="Item Name *"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            </div>

          <div className="form-group">
            <h4>Category</h4>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">-- Select Category --</option>
              <option value="Raw Material">Raw Material</option>
              <option value="Finished Goods">Finished Goods</option>
            </select>
          </div>

          <div className="form-group">
            <h4>Quantity</h4>
            <input
              type="number"
              min="0"
              step="1"
              placeholder="Initial Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="form-group">
            <h4>Unit Price</h4>
            <input
              type="number"
              step="0.10"
              placeholder="Unit Price *"
              value={unitPrice}
              onChange={(e) => setUnitPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <h4>Reorder Quantity</h4>
            <input
              type="number"
              min="0"
              placeholder="Reorder Level *"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value)}
            />
          </div>

          <div className="form-group">
            <h4>Supplier</h4>
            <select
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
            >
              <option value="">-- Supplier --</option>
              {suppliers.map((s) => (
                <option key={s.supplier_id} value={s.supplier_id}>
                  {s.supplier_name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit">Create Item</button>
          </div>
        </form>
      </div>

      <div className="navigation-section">
        <Link to="/inventory">
          <button>⬅ Back to Inventory</button>
        </Link>
      </div>
    </div>
  </div>
  );
}
