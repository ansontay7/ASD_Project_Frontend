import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function CreateSupplier() {
  const [form, setForm] = useState({
    supplier_name: "",
    contact_person: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submitSupplier = async (e) => {
    e.preventDefault();

    if (!form.supplier_name || !form.contact_person || !form.email || !form.phone) {
      alert("All Field Must Fill");
      return;
    }

    try {
      await api.post("/suppliers", form);
      alert("Supplier created successfully");
      navigate("/suppliers");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create supplier");
    }
  };

  return (
    <div>
      <h2>Create Supplier</h2>

      <h4>Supplier Name*</h4>
      <form onSubmit={submitSupplier}>
        <input
          name="supplier_name"
          placeholder="Supplier Name *"
          value={form.supplier_name}
          onChange={handleChange}
        />

        <br /><br />

        <h4>Contact Person*</h4>
        <input
          name="contact_person"
          placeholder="Contact Person"
          value={form.contact_person}
          onChange={handleChange}
        />

        <br /><br />

        <h4>Email*</h4>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <br /><br />

        <h4>Phone Number*</h4>
        <input
          name="phone"
          type="Number"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <br /><br />

        <button type="submit">➕ Create Supplier</button>
      </form>

      <br />

      <Link to="/suppliers">
        <button>📋 Back to Supplier List</button>
      </Link>
    </div>
  );
}
