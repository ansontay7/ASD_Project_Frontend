import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../style/StockHistory.css";

export default function StockHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get("/stock/transaction");
      setHistory(res.data);
    } catch (err) {
      setError("Failed to load stock history");
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = history.filter((h) => {
    const matchesItem = h.item_name.toLowerCase().includes(searchItem.toLowerCase());

    const transactionDate = new Date(h.created_at);

    const matchesStartDate = startDate ? transactionDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? transactionDate <= new Date(endDate) : true;

    return matchesItem && matchesStartDate && matchesEndDate;
  });

  if (loading) {
    return <h3 className="loading">Loading stock history...</h3>;
  }

  if (error) {
    return <h3 style={{ color: "red" }}>{error}</h3>;
  }
  
  return (
    <><Navbar />
    <div className="stock-history-container">

      <div className="page-header">
        <h2>Stock Transaction History</h2>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by item..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <h4 className="fliter-start-date">Start Date</h4>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <h4 className="fliter-end-date">End Date</h4>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Reason</th>
              <th>Performed By</th>
            </tr>
          </thead>

          <tbody>
            {filteredHistory.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty">
                  No transactions found
                </td>
              </tr>
            ) : (
              filteredHistory.map((h) => (
                <tr key={h.transaction_id}>
                  <td>{new Date(h.created_at).toLocaleString()}</td>
                  <td>{h.item_name}</td>
                  <td className={h.transaction_type === "IN" ? "type-in" : "type-out"}>
                    {h.transaction_type}
                  </td>
                  <td>{h.quantity}</td>
                  <td>{h.reason || "—"}</td>
                  <td>{h.performed_by}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </>
  );
}
