import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EcommerceUI from "./pages/EcommerceUI";
import ProductDetail from "./components/ProductDetail";
import ProtectedRoute from "./components/ProtectedRoute";
import About from "./pages/About";

// Lazy-loaded: only fetched when someone actually visits /login or /dashboard
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./components/Login"));

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EcommerceUI />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/about" element={< About />} />
        <Route
          path="/login"
          element={
            <Suspense fallback={<PageLoader />}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute>
              <Suspense fallback={<PageLoader />}>
                <Dashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex gap-1.5">
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}















/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        {/*<Route path="/product/:id" element={<ProductDetail />} />*//*
        <Route path="/product/:slug" element={<ProductDetail />} />
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
}*/
