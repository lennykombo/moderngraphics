import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EcommerceUI from "./pages/EcommerceUI";
import ProductDetail from "./components/ProductDetail";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EcommerceUI />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
