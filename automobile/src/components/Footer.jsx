import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <footer id="contact" className="border-t border-white/10 bg-[#0c0e12] pt-16 text-slate-300">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 border-b border-white/10 pb-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {/* BRAND COLUMN */}
            <div className="sm:col-span-2 md:col-span-3 lg:col-span-1">
              <a href="/" className="inline-block">
                <img
                  src={logo}
                  alt="Ezin Zahan Auto Spare Parts Trading LLC"
                  className="h-18 object-contain transition-transform duration-300 hover:scale-105"
                />
              </a>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
                High-quality OEM & aftermarket automotive spare parts for workshops, fleets, and vehicle owners across Dubai and the UAE.
              </p>

              {/* SOCIAL ICONS */}
              <div className="mt-5 flex items-center gap-2.5">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                >
                  <svg className="h-4 w-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/10 text-slate-200 transition duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* SHOP COLUMN */}
            <FooterColumn
              title="Shop"
              links={[
                "Brake Systems",
                "Filters & Fluids",
                "Suspension & Steering",
                "Engine Components",
                "Exhaust Systems",
                "Electrical & Lighting",
                "Batteries",
                "Tools & Garage Equipment",
              ]}
            />

            {/* CUSTOMER SERVICE COLUMN */}
            <FooterColumn
              title="Customer Support"
              links={[
                "Help & Support Center",
                "Track Order Status",
                "Returns & Warranty",
                "Shipping & Delivery",
                "Vehicle Fitment Guide",
                "Contact Our Specialists",
              ]}
            />

            {/* COMPANY COLUMN */}
            <FooterColumn
              title="Company"
              links={[
                "About Us",
                "Wholesale & Fleet Supply",
                "Authorized Brands",
                "Careers",
                "Privacy Policy",
                "Terms of Service",
              ]}
            />

            {/* NEWSLETTER COLUMN */}
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white">
                Stay Updated
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                Get restock notifications, seasonal maintenance guides, and trade discounts.
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="mt-4 space-y-2.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    aria-label="Email Address for newsletter"
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 transition focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-600 py-2.5 text-xs font-semibold uppercase tracking-wider text-white shadow-sm transition hover:bg-blue-500 active:scale-[0.99]"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          {/* BOTTOM BAR */}
          <div className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-slate-400 md:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-2 text-center md:text-left">
              <span>
                © {new Date().getFullYear()} Ezin Zahan Auto Spare Parts Trading LLC. P.O. Box No. 237590, Dubai, UAE. All rights reserved.
              </span>
              <span className="text-slate-600">&bull;</span>
              <Link
                to="/login"
                className="text-slate-400 hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                Seller Portal
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
              {["VISA", "MASTERCARD", "AMEX", "APPLE PAY"].map((item) => (
                <span
                  key={item}
                  className="rounded border border-white/10 bg-white/[0.03] px-2.5 py-1 text-slate-400"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* BACK TO TOP BUTTON */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className={`fixed bottom-24 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#121b2d]/90 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-blue-600 active:scale-95 ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
          }`}
      >
        <ArrowUp size={18} />
      </button>
    </>
  );
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-white">
        {title}
      </h4>

      <ul className="space-y-2.5 text-sm">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-slate-400 transition-colors duration-150 hover:text-white"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}