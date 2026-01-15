import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../style/StockIn.css";
import Navbar from "../components/Navbar";

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
    <><Navbar />
    <div className="stock-in-page">
      <div className="stock-in-container">

        <div className="stock-in-header">
          <h2>Stock IN</h2>
        </div>

        <div className="stock-in-form">
          <form onSubmit={submitStockIn}>

            <div className="form-group">
              <h4>Item*</h4>
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
            </div>

            <div className="form-group">
              <h4>Quantity*</h4>
              <input
                type="number"
                placeholder="Quantity"
                min="1"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
              />
            </div>

            <div className="form-group">
              <h4>Reason</h4>
              <textarea
                placeholder="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                cols={50}
                style={{ resize: "vertical" }}
              />
            </div>

            <div className="form-actions">
              <button type="submit">⬆ Stock IN</button>
            </div>
            </form>
          </div>

          <div className="navigation-section">
            <Link to="/dashboard">
              <button>Back to Dashboard</button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
