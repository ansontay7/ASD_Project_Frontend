import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useState } from "react";

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
    <div>
      <h2>Receive Purchase Order #{id}</h2>
      <button onClick={receivePO} disabled={receiving}>
        ✅ Confirm Receive
      </button>
    </div>
  );
}
