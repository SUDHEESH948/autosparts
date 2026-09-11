import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const NAV_LINKS = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Products", path: "/products" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-[9999] w-full transition-all duration-300 ${
        scrolled ? "py-2 md:py-3" : "py-4 md:py-5"
      }`}
    >
      {/* NAVBAR CONTAINER */}
      <div className="relative mx-auto flex h-16 md:h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* =====================================================
            LOGO (Scales responsively so it doesn't crowd nav)
        ====================================================== */}
        <Link
          to="/"
          className="z-20 flex shrink-0 items-center"
        >
          <img
            src={logo}
            alt="Ezin Zahan Auto Spare Parts Trading LLC logo"
            className="h-20 w-auto max-w-36  rounded-xl object-contain transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* =====================================================
            NAVIGATION (Centered with safe tablet margins)
        ====================================================== */}
        <div
          className={`hidden md:flex items-center rounded-full border border-white/20 p-1 lg:p-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] backdrop-blur-xl transition-all duration-300 ${
            scrolled
              ? "bg-[#0b1220]/90 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
              : "bg-[#121b2d]/60"
          }`}
        >
          <nav className="flex items-center gap-0.5 lg:gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`group relative flex h-9 md:h-10 items-center justify-center rounded-full px-3.5 lg:px-5 text-[11px] lg:text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}

                  {/* Active indicator */}
                  <span
                    className={`pointer-events-none absolute bottom-1 left-1/2 h-[2px] -translate-x-1/2 rounded-full bg-blue-500 transition-all duration-300 ${
                      isActive ? "w-4" : "w-0 group-hover:w-4"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Placeholder spacer to keep the center nav perfectly balanced on desktop */}
        <div className="hidden md:block w-12 md:w-[140px] lg:w-[170px] shrink-0 pointer-events-none" />

        {/* =====================================================
            MOBILE / TABLET BURGER BUTTON (< md screens)
        ====================================================== */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#121b2d]/70 text-slate-200 backdrop-blur-xl transition-all duration-300 hover:bg-[#0b1220] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* =====================================================
          MOBILE / TABLET DROPDOWN
      ====================================================== */}
      {mobileMenuOpen && (
        <div className="absolute left-1/2 top-[76px] md:top-[90px] w-[calc(100%-32px)] max-w-sm -translate-x-1/2 rounded-2xl border border-white/15 bg-[#0b1220]/95 p-3 shadow-2xl backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;

              return (
                <Link
                  key={link.label}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}