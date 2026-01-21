import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "../style/StockOut.css";
import Navbar from "../components/Navbar";

export default function StockOut() {
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [qty, setQty] = useState("");
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadItems();
  }, []);
  console.log("Auth user:", user);
  console.log("Item ID:", itemId);
  console.log("Quantity:", qty);
  console.log("User:", user?.user_id);


  const loadItems = async () => {
    const res = await api.get("/inventory");
    setItems(res.data);
  };

  const submitStockOut = async (e) => {
    e.preventDefault();

    if (!itemId || !qty || !user?.user_id) {
      alert("Please fill all fields.");
      return;
    }

    console.log("Sending stock out request...");

    try {
      await api.post("/stock/transaction", {
        item_id: Number(itemId),
        transaction_type: "OUT", // Stock out transaction
        quantity: Number(qty),
        reason: reason || "No reason provided", // Default reason if none provided
      });

      alert("Stock OUT successful");
      navigate("/inventory");
    } catch (err) {
      alert(err.response?.data?.message || "Stock OUT failed");
    }
  };

  return (
    <>
    <Navbar />
    <div className="stock-out-page">
      <div className="stock-out-container">

        <div className="stock-out-header">
          <h2>Stock OUT</h2>
        </div>

        <div className="stock-out-form">
          <form onSubmit={submitStockOut}>

            <div className="form-group">
              <h4>Item*</h4>
              <select
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              >
                <option value="">-- Select Item --</option>
                {items.map((i) => (
                  <option key={i.item_id} value={i.item_id}>
                    {i.item_name} (Available: {i.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <h4>Quantity*</h4>
              <input
                type="number"
                placeholder="Quantity"
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
              <button type="submit">⬇ Stock OUT</button>
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
