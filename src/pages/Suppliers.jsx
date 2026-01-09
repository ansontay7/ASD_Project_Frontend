import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      alert("Failed to load suppliers");
    }
  };

  const deleteSupplier = async (id) => {
    if (!window.confirm("Delete this supplier?")) return;

    try {
      await api.delete(`/suppliers/${id}`);
      alert("Supplier deleted");
      fetchSuppliers();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  const filteredSuppliers = suppliers.filter((s) =>
    s.supplier_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Suppliers</h2>

      {/* Search */}
      <input
        placeholder="Search supplier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />

      {/* Admin create */}
      {user?.role === "Admin" && (
        <Link to="/suppliers/create">
          <button>➕ Create Supplier</button>
        </Link>
      )}

      <br /><br />

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier Name</th>
            <th>Email</th>
            <th>Phone</th>
            {user?.role === "Admin" && <th>Actions</th>}
          </tr>
        </thead>

        <tbody>
          {filteredSuppliers.length === 0 ? (
            <tr>
              <td colSpan="5" align="center">No suppliers found</td>
            </tr>
          ) : (
            filteredSuppliers.map((s) => (
              <tr key={s.supplier_id}>
                <td>{s.supplier_id}</td>
                <td>{s.supplier_name}</td>
                <td>{s.email || "-"}</td>
                <td>{s.phone || "-"}</td>

                {user?.role === "Admin" && (
                  <td>
                    <Link to={`/suppliers/${s.supplier_id}/edit`}>
                      <button>✏ Edit</button>
                    </Link>
                    &nbsp;
                    <button onClick={() => deleteSupplier(s.supplier_id)}>
                      🗑 Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <br />

      <Link to="/dashboard">
        <button>🏠 Back to Dashboard</button>
      </Link>
    </div>
  );
}
