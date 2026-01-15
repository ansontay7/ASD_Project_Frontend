import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";
import "../style/ReceivePO.css";

export default function ReceivePO() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [receiving, setReceiving] = useState(false);

  const receivePO = async () => {
    if (receiving) return;

    try {
      setReceiving(true);
      await api.put(`/purchase-orders/${id}/receive`);
      alert("PO received successfully");
      navigate("/purchase-orders");

    } catch (err) {
      alert(err.response?.data?.message || "PO already received");
      navigate("/purchase-orders");
      
    } finally {
      setReceiving(false);
    }
  };

  return (
    <div className="receive-po-container">
      <h2 className="receive-po-title">Receive Purchase Order #{id}</h2>

      <div className="receive-po-buttons">
        <Link to="/purchase-orders">
          <button className="btn back-btn">Back to Purchase Order</button>
        </Link>
        <button className="btn confirm-btn" onClick={receivePO} disabled={receiving}>✅ Confirm Receive</button>
      </div>
    </div>
  );
}
