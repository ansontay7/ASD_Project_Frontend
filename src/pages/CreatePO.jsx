import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";
import "../style/CreatePO.css";

export default function CreatePO() {
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [items, setItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSuppliers();
    fetchInventory();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      alert("Failed to load suppliers");
    }
  };

  const fetchInventory = async () => {
    const res = await api.get("/inventory");
    setInventory(res.data);
  };

  const addItem = () => {
    setItems([
      ...items,
      { item_id: "", quantity: 1, unit_price: 0 },
    ]);
  };

  const removeItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
  };

  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const submitPO = async () => {
    if (!supplierId || items.length === 0) {
      alert("Please select supplier and add items");
      return;
    }

    try {
      await api.post("/purchase-orders", {
        supplier_id: Number(supplierId),
        items,
      });

      alert("Purchase Order Created");
      navigate("/purchase-orders");
    } catch (err) {
      alert("Failed to create PO");
    }
  };

  return (
    <div className="create-po-page">
      <div className="create-po-container">

        <div className="create-po-header">
          <h2>Create Purchase Order</h2>
        </div>

        <div className="supplier-section">
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
          >
            <option value="">-- Select Supplier --</option>
            {suppliers.map((s) => (
              <option key={s.supplier_id} value={s.supplier_id}>
                {s.supplier_name}
              </option>
            ))}
          </select>
        </div>

        <div className="items-section">
          <h4>Items</h4>

          {items.map((item, index) => (
            <div key={index} className="item-card">

              <div className="form-group">
                <p>Item</p>
                <select
                  value={item.item_id}
                  onChange={(e) =>
                    updateItem(index, "item_id", e.target.value)
                  }
                >
                  <option value="">Select Item</option>
                  {inventory.map((i) => (
                    <option key={i.item_id} value={i.item_id}>
                      {i.item_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <p>Quantity</p>
                <input
                  type="number"
                  min="1"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, "quantity", Number(e.target.value))
                  }
                />
              </div>

              <div className="form-group">
                <p>Price</p>
                <input
                  type="number"
                  placeholder="Unit Price"
                  value={item.unit_price}
                  onChange={(e) =>
                    updateItem(index, "unit_price", Number(e.target.value))
                  }
                />
              </div>

              <div className="item-actions">
                <button
                  type="button"
                  className="remove-item-btn"
                  onClick={() => removeItem(index)}
                >
                  Remove
                </button>
              </div>

            </div>
          ))}
        </div>

        <div className="actions-section">
          <button onClick={addItem}>Add Item</button>
        </div>

        <div className="submit-section">
          <button onClick={submitPO}>Submit PO</button>
        </div>

        <div className="navigation-section">
          <Link to="/purchase-orders">
            <button>Back to Purchase Orders</button>
          </Link>
        </div>

      </div>
    </div>
  );
}
