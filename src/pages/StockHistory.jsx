import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

export default function StockHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await api.get("/stock/transaction");
      setHistory(res.data);
    } catch (err) {
      alert("Failed to load stock history");
    }
  };

  return (
    <div>
      <h2>📊 Stock Transaction History</h2>

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Date</th>
            <th>Item</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Performed By</th>
          </tr>
        </thead>

        <tbody>
          {history.map((h) => (
            <tr key={h.transaction_id}>
              <td>{new Date(h.created_at).toLocaleString()}</td>
              <td>{h.item_name}</td>
              <td
                style={{
                  color: h.transaction_type === "IN" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {h.transaction_type}
              </td>
              <td>{h.quantity}</td>
              <td>{h.performed_by}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />

      <Link to="/dashboard">
        <button>🏠 Back to Dashboard</button>
      </Link>
    </div>
  );
}
