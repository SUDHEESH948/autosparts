import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { lazy, Suspense, useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import WhatsAppButton from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Contact = lazy(() => import("./pages/Contact"));
const Seller = lazy(() => import("./pages/Seller"));
const Login = lazy(() => import("./pages/Login"));

// =====================================================
// COMMON LAYOUT
// =====================================================

function AppContent() {
  const location = useLocation();

  // Seller and Login pages don't use the customer navbar or footer
  const isSellerRoute = location.pathname.startsWith("/seller");
  const isLoginRoute = location.pathname.toLowerCase().startsWith("/login");
  const isCustomLayout = isSellerRoute || isLoginRoute;

  // Home doesn't need top padding
  const isHomeRoute = location.pathname === "/";

  return (
    <div className="min-h-screen">
      {/* =====================================================
          SCROLL TO TOP ON ROUTE CHANGE
      ====================================================== */}
      <ScrollToTop />

      {/* =====================================================
          MAIN WEBSITE NAVIGATION
      ====================================================== */}
      {!isCustomLayout && <Navbar />}

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}
      <main
        className={
          !isCustomLayout && !isHomeRoute
            ? "pt-24"
            : ""
        }
      >
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          }
        >
          <Routes>
            {/* =================================================
                MAIN WEBSITE
            ================================================= */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />

            {/* =================================================
                AUTHENTICATION & SELLER PORTAL
            ================================================= */}
            <Route path="/login" element={<Login />} />
            <Route path="/Login" element={<Login />} />
            <Route
              path="/seller"
              element={
                <ProtectedRoute>
                  <Seller />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </main>

      {/* =====================================================
          COMMON FOOTER
          Hidden on Seller and Login pages
      ====================================================== */}
      {!isCustomLayout && <Footer />}

      {/* =====================================================
          FLOATING WHATSAPP BUTTON
          Hidden on Seller and Login pages
      ====================================================== */}
      {!isCustomLayout && <WhatsAppButton />}
    </div>
  );
}

// =====================================================
// APP
// =====================================================

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial logo loading screen
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;