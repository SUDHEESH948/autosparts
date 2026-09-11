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

import Home from "./pages/Home";

const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const Contact = lazy(() => import("./pages/Contact"));
const Seller = lazy(() => import("./pages/Seller"));

// =====================================================
// COMMON LAYOUT
// =====================================================

function AppContent() {
  const location = useLocation();

  // Seller pages don't use the main navbar or footer
  const isSellerRoute =
    location.pathname.startsWith("/seller");

  // Home doesn't need top padding
  const isHomeRoute =
    location.pathname === "/";

  return (
    <div className="min-h-screen">

      {/* =====================================================
          SCROLL TO TOP ON ROUTE CHANGE
      ====================================================== */}

      <ScrollToTop />

      {/* =====================================================
          MAIN WEBSITE NAVIGATION
      ====================================================== */}

      {!isSellerRoute && <Navbar />}

      {/* =====================================================
          PAGE CONTENT
      ====================================================== */}

      <main
        className={
          !isSellerRoute && !isHomeRoute
            ? "pt-24"
            : ""
        }
      >
    
          <Routes>

            {/* =================================================
                MAIN WEBSITE
            ================================================= */}

            <Route
              path="/"
              element={<Home />}
            />

            <Route
              path="/about"
              element={<About />}
            />

            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/contact"
              element={<Contact />}
            />

            {/* =================================================
                SELLER SECTION
            ================================================= */}

            <Route
              path="/seller"
              element={<Seller />}
            />

          </Routes>
        
      </main>

      {/* =====================================================
          COMMON FOOTER
          Hidden on Seller page
      ====================================================== */}

      {!isSellerRoute && <Footer />}

      {/* =====================================================
          FLOATING WHATSAPP BUTTON
          Hidden on Seller page
      ====================================================== */}

      {!isSellerRoute && <WhatsAppButton />}

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