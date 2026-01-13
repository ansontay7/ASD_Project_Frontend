import { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import api from "../api/axios";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [inventory, setInventory] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pieType, setPieType] = useState("value"); // "value" or "quantity"

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch inventory and transactions
      const [inventoryRes, transactionsRes] = await Promise.all([
        api.get("/inventory"),
        api.get("/stock/transaction?limit=10&order=desc")
      ]);

      setInventory(inventoryRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h3>Loading dashboard...</h3>;
  if (error) return <h3 style={{ color: "red" }}>{error}</h3>;

  // Low stock and stats
  const lowStockItems = inventory.filter(item => item.quantity < item.reorder_level);
  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.quantity * item.unit_price, 0);
  const totalItems = inventory.length;

  // Bar chart for stock by item
  const barData = {
  labels: inventory.map(item => item.item_name),
  datasets: [
    {
      label: "Normal Stock",
      data: inventory.map(item =>
        item.quantity >= item.reorder_level ? item.quantity : 0
      ),
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
    {
      label: "Low Stock",
      data: inventory.map(item =>
        item.quantity < item.reorder_level ? item.quantity : 0
      ),
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    }
  ]
};


  // Pie chart for stock by category
  const categoryMap = {};
  inventory.forEach(item => {
    if (categoryMap[item.category]) {
      categoryMap[item.category] += pieType === "value" ? item.quantity * item.unit_price : item.quantity;
    } else {
      categoryMap[item.category] = pieType === "value" ? item.quantity * item.unit_price : item.quantity;
    }
  });

  const pieData = {
    labels: Object.keys(categoryMap),
    datasets: [
      {
        label: pieType === "value" ? "Stock Value by Category" : "Stock Quantity by Category",
        data: Object.values(categoryMap),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
      }
    ]
  };

  return (
    <div>
      <h2>Dashboard</h2>

      {/* Stats */}
      <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
        <div style={{ padding: "20px", backgroundColor: "#f2f2f2", flex: 1 }}>
          <h3>Low Stock Items</h3>
          <p>{lowStockItems.length}</p>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#f2f2f2", flex: 1 }}>
          <h3>Total Inventory Value (RM)</h3>
          <p>{totalInventoryValue.toFixed(2)}</p>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#f2f2f2", flex: 1 }}>
          <h3>Total Items</h3>
          <p>{totalItems}</p>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <div style={{ marginTop: "40px" }}>
          <h3>⚠ Low Stock Alerts</h3>
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead style={{ backgroundColor: "#ffcccc" }}>
              <tr>
                <th>Item Name</th>
                <th>Current Quantity</th>
                <th>Reorder Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockItems.map(item => (
                <tr key={item.item_id} style={{ backgroundColor: "#ffe6e6" }}>
                  <td>{item.item_name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.reorder_level}</td>
                  <td style={{ color: "red", fontWeight: "bold" }}>⚠ Low Stock</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bar Chart */}
      <div style={{ marginTop: "40px", maxWidth: "900px" }}>
        <h3>Stock by Item</h3>
        <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: "top" } } }} />
      </div>

      {/* Pie Chart with dropdown */}
      <div style={{ marginTop: "40px", maxWidth: "600px" }}>
        <h3>📊 Stock by Category</h3>

        <label>
          View as:{" "}
          <select value={pieType} onChange={e => setPieType(e.target.value)}>
            <option value="value">Stock Value (RM)</option>
            <option value="quantity">Stock Quantity</option>
          </select>
        </label>

        <Pie data={pieData} options={{ responsive: true, plugins: { legend: { position: "right" } } }} />
      </div>

      {/* Recent Stock Movements */}
      <div style={{ marginTop: "40px" }}>
        <h3>🕒 Recent Stock Movements (Last 10)</h3>
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead style={{ backgroundColor: "#d9edf7" }}>
            <tr>
              <th>Date</th>
              <th>Item Name</th>
              <th>Transaction Type</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" align="center">No recent transactions</td>
              </tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.transaction_id}>
                  <td>{new Date(tx.created_at).toLocaleString()}</td>
                  <td>{tx.item_name}</td>
                  <td style={{ color: tx.transaction_type === "IN" ? "green" : "red", fontWeight: "bold" }}>
                    {tx.transaction_type}
                  </td>
                  <td>{tx.quantity}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
