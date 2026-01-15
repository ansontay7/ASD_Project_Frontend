import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import "../style/EditSupplier.css";

export default function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadSupplier();
  }, []);

  const loadSupplier = async () => {
    try {
      const res = await api.get(`/suppliers/${id}`);
      setName(res.data.supplier_name);
      setEmail(res.data.email || "");
      setPhone(res.data.phone || "");
    } catch {
      alert("Failed to load supplier");
    }
  };

  const updateSupplier = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/suppliers/${id}`, {
        supplier_name: name,
        email,
        phone,
      });

      alert("Supplier updated");
      navigate("/suppliers");
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <div className="edit-supplier-page">
      <div className="edit-supplier-container">

        <div className="edit-supplier-header">
          <h2>Edit Supplier</h2>
        </div>

        <form className="edit-supplier-form" onSubmit={updateSupplier}>

          <div className="form-group">
            <h4>Supplier Name</h4>
            <input
              placeholder="Supplier Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <h4>Email</h4>
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <h4>Phone</h4>
            <input
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="form-actions">
            <button type="submit">💾 Update Supplier</button>
          </div>

          <div className="navigation-section">
            <Link to="/suppliers">
              <button type="button">⬅ Back to Suppliers</button>
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
