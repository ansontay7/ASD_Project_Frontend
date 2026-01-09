import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

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
    <div>
      <h2>Create Purchase Order</h2>

      <Link to="/dashboard">
        <button>🏠 Back to Dashboard</button>
      </Link>

      <br /><br />

      {/* ✅ Supplier Dropdown */}
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

      <h4>Items</h4>

      {items.map((item, index) => (
        <div key={index}>
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
      ))}

      <br />

      <button onClick={addItem}>➕ Add Item</button>
      <br /><br />
      <button onClick={submitPO}>Submit PO</button>
    </div>
  );
}
