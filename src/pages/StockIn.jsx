import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function StockIn() {
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const res = await api.get("/inventory");
    setItems(res.data);
  };

  const submitStockIn = async (e) => {
    e.preventDefault();

    if (!itemId || !qty || !user?.user_id) {
      alert("Please fill all fields and ensure you are logged in.");
      return;
    }

    try {
      await api.post("/stock/transaction", {
        item_id: Number(itemId),
        transaction_type: "IN", // ✅ Stock IN
        quantity: Number(qty),
        reason: reason || "No reason provided",
      });

      alert("Stock IN successful");
      navigate("/inventory");
    } catch (err) {
      alert(err.response?.data?.message || "Stock IN failed");
    }
  };

  return (
    <div>
      <h2>Stock IN</h2>

      <h4>Item*</h4>
      <form onSubmit={submitStockIn}>
        <select
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
        >
          <option value="">-- Select Item --</option>
          {items.map((i) => (
            <option key={i.item_id} value={i.item_id}>
              {i.item_name}
            </option>
          ))}
        </select>

        <br /><br />

        <h4>Quantity*</h4>
        <input
          type="number"
          placeholder="Quantity"
          min="1"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        <br /><br />

        <h4>Reason</h4>
        <textarea
          placeholder="Reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={4}
          cols={50}
          style={{ resize: "vertical" }}
        />

        <br /><br />

        <button type="submit">⬆ Stock IN</button>
      </form>

      <br />

      <Link to="/dashboard">
        <button>🏠 Back to Dashboard</button>
      </Link>
    </div>
  );
}
