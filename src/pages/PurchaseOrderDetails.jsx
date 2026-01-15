import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import "../style/PurchaseOrderDetails.css";

export default function PurchaseOrderDetails() {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchPODetails();
  }, []);

  const fetchPODetails = async () => {
    try {
      const res = await api.get(`/purchase-orders/${id}`);
      console.log("PO DETAILS:", res.data);
      setItems(res.data); // 👈 array
    } catch (err) {
      alert("Failed to load PO details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="Loading">Loading PO...</p>;

  return (
    <div className="po-page">
      <div className="po-container">
        <div className="po-header">
          <h2>Purchase Order #{id}</h2>
        </div>

        <div className="po-items-section">
          <h3>PO Items</h3>

          <table className="po-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Ordered Qty</th>
                <th>Unit Price</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="4">No items found</td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.item_name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.unit_price}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="po-actions">
          <Link to="/purchase-orders">
                <button className="btn back-btn">Back to Purchase Order</button>
          </Link>

          <Link to={`/purchase-orders/${id}/receive`}>
            <button className="btn confirm-btn">Receive PO</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
