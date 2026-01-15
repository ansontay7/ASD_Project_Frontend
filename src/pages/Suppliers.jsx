import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import Navbar from "../components/Navbar";
import "../style/Suppliers.css";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/suppliers");
      setSuppliers(res.data);
    } catch (err) {
      setError("Failed to load suppliers");
    } finally {
      setLoading(false);
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

  if (loading) {
    return <h3 className="loading">Loading suppliers...</h3>;
  }

  if (error) {
    return <h3 style={{ color: "red" }}>{error}</h3>;
  }

  return (
    <><Navbar />
    <div className="suppliers-page">
      <div className="suppliers-header">
        <h2>Suppliers</h2>

        {/* Admin create */}
        {user?.role === "Admin" && (
          <Link to="/suppliers/create">
            <button className="btn-create">Create Supplier</button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="suppliers-filters">
        <input
          placeholder="Search supplier..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="suppliers-table">
        <table>
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
                <td colSpan={user?.role === "Admin" ? 5 : 4} className="empty">No suppliers found</td>
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
                        <button className="btn-edit">✏ Edit</button>
                      </Link>

                      <button className="btn-delete" onClick={() => deleteSupplier(s.supplier_id)}>
                        🗑 Delete
                      </button>
                    </td>
                  )}
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
