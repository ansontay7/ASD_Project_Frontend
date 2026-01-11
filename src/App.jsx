import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./auth/ProtectedRoute";
import Inventory from "./pages/Inventory";
import PurchaseOrders from "./pages/PurchaseOrders";
import CreateItem from "./pages/CreateItem";
import CreatePO from "./pages/CreatePO";
import ReceivePO from "./pages/ReceivePO";
import PurchaseOrderDetails from "./pages/PurchaseOrderDetails";
import StockOut from "./pages/StockOut";
import StockIn from "./pages/StockIn";
import StockHistory from "./pages/StockHistory";
import CreateSupplier from "./pages/CreateSupplier";
import Suppliers from "./pages/Suppliers";
import EditSupplier from "./pages/EditSupplier";



function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>}/>
      <Route path="/inventory" element={<ProtectedRoute> <Inventory /> </ProtectedRoute>} />
      <Route path="/purchase-orders" element={<ProtectedRoute> <PurchaseOrders /> </ProtectedRoute>}/>
      <Route path="/purchase-orders/:id" element={<ProtectedRoute> <PurchaseOrderDetails /> </ProtectedRoute>}/>
      <Route path="/inventory/create" element={<ProtectedRoute role="Admin"><CreateItem /></ProtectedRoute>}/>
      <Route path="/purchase-orders/create" element={<ProtectedRoute role="Admin"> <CreatePO /> </ProtectedRoute>}/>
      <Route path="/purchase-orders/:id/receive" element={<ProtectedRoute role="Admin"> <ReceivePO /> </ProtectedRoute>}/>
      <Route path="/stock-out" element={<ProtectedRoute role="Admin"> <StockOut /> </ProtectedRoute>}/>
      <Route path="/stock-in" element={<ProtectedRoute role="Admin"><StockIn /></ProtectedRoute>} />
      <Route path="/stock-history" element={<ProtectedRoute> <StockHistory /> </ProtectedRoute>}/>
      <Route path="/suppliers" element={<ProtectedRoute> <Suppliers /> </ProtectedRoute>}/>
      <Route path="/suppliers/create" element={<ProtectedRoute role="Admin"> <CreateSupplier /> </ProtectedRoute>}/>
      <Route path="/suppliers/:id/edit" element={<ProtectedRoute role="Admin"><EditSupplier /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
