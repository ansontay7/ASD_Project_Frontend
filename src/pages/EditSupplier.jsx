import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router-dom";

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
    <div>
      <h2>Edit Supplier</h2>

      <form onSubmit={updateSupplier}>
        <input
          placeholder="Supplier Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />

        <input
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <br /><br />

        <button type="submit">💾 Update Supplier</button>
      </form>

      <br />

      <Link to="/suppliers">
        <button>⬅ Back</button>
      </Link>
    </div>
  );
}
