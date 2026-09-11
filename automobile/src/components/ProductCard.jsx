import { useState } from "react";
import { Wrench, ShieldCheck } from "lucide-react";
import whatsappIcon from "../assets/gemini-svg (1).svg";

const PRIMARY_BLUE = "#0084D1";
const WHATSAPP_NUMBER = "971568706629";
const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80";

export default function ProductCard({
    product,
    flipped = false,
    onFlip,
    animationDelay = 0,
}) {
    const [isHovered, setIsHovered] = useState(false);

    if (!product) return null;

    // =========================================================
    // FINAL FLIP STATE
    // =========================================================
    // Desktop: Hover = flip
    // Mobile: Tap/click = flip
    // `flipped` comes from AutoStore
    // `isHovered` handles desktop hover
    // =========================================================

    const isCardFlipped = flipped || isHovered;

    // =========================================================
    // WHATSAPP
    // =========================================================

    const openWhatsApp = (event) => {
        // Prevent WhatsApp button from triggering card flip
        event.preventDefault();
        event.stopPropagation();

        const message = `Hello Ezin Zahan Spare Parts,

I am interested in the following item:

• Product: ${product.name || "N/A"}
• Category: ${product.category || "General"}

Please share a quote and confirm availability.

Thank you!`;

        window.open(
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =========================================================
    // CARD CLICK / MOBILE TAP
    // =========================================================

    const handleFlip = (event) => {
        // Never flip when clicking a button
        if (event.target.closest("button")) {
            return;
        }

        if (typeof onFlip === "function") {
            onFlip();
        }
    };

    // =========================================================
    // KEYBOARD ACCESS
    // =========================================================

    const handleKeyDown = (event) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();

            if (typeof onFlip === "function") {
                onFlip();
            }
        }
    };

    return (
        <div
            className="product-card-wrapper card-pop"
            style={{
                animationDelay: `${animationDelay}ms`,
                perspective: "1200px",
                width: "100%",
                height: "100%",
                minHeight: "410px",
                touchAction: "manipulation",
                cursor: "pointer",
            }}
            // =====================================================
            // DESKTOP HOVER
            // =====================================================
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            // =====================================================
            // CLICK / TAP
            // =====================================================
            onClick={handleFlip}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${product.name}`}
        >
            {/* =====================================================
                3D CARD INNER
            ====================================================== */}
            <div
                className="product-card-inner"
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    minHeight: "410px",
                    transformStyle: "preserve-3d",
                    WebkitTransformStyle: "preserve-3d",
                    transition:
                        "transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1)",
                    transform: isCardFlipped
                        ? "rotateY(180deg)"
                        : "rotateY(0deg)",
                }}
            >
                {/* =====================================================
                    FRONT
                ====================================================== */}
                <div
                    className="product-card-front absolute inset-0 overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,.07)]"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(0deg)",
                    }}
                >
                    {/* IMAGE */}
                    <div className="relative h-[210px] overflow-hidden bg-slate-100">
                        <img
                            src={product.image || FALLBACK_IMAGE}
                            alt={product.name}
                            draggable="false"
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                                e.currentTarget.onerror = null;
                                e.currentTarget.src = FALLBACK_IMAGE;
                            }}
                            className="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                        />

                        {/* IMAGE OVERLAY */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                        <div className="image-shine pointer-events-none" />

                        {/* VIEW DETAILS */}
                        <span className="pointer-events-none absolute bottom-4 right-4 rounded-full bg-slate-950/75 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[.12em] text-white backdrop-blur-md">
                            View Details
                        </span>
                    </div>

                    {/* CONTENT */}
                    <div className="flex h-[200px] flex-col bg-white p-5">
                        {/* NAME */}
                        <h3 className="text-[15px] font-extrabold leading-snug tracking-tight text-slate-950">
                            {product.name}
                        </h3>

                        {/* DESCRIPTION */}
                        <p className="mt-2 line-clamp-2 text-[11px] font-medium leading-5 text-slate-500">
                            {product.description}
                        </p>

                        {/* PRICE + WHATSAPP */}
                        <div className="mt-auto flex items-end justify-between gap-3">
                            {/* PRICE */}
                            <div>
                                <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                                    Price
                                </span>

                                <span className="mt-1 block text-2xl font-black leading-none text-slate-950">
                                    AED {product.price}
                                </span>

                                {/* STOCK */}
                                <span className="mt-2 flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-wider text-emerald-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    In Stock
                                </span>
                            </div>

                            {/* WHATSAPP BUTTON */}
                            <button
                                type="button"
                                aria-label={`WhatsApp enquiry for ${product.name}`}
                                onClick={openWhatsApp}
                                onMouseEnter={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                className="whatsapp-button group flex h-12 w-12 min-h-12 min-w-12 flex-shrink-0 items-center justify-center rounded-full border border-green-200 bg-green-50 p-0 shadow-sm transition-all duration-300 hover:border-green-500 hover:bg-green-500 hover:shadow-lg hover:shadow-green-500/25 active:scale-90"
                            >
                                <img
                                    src={whatsappIcon}
                                    alt="WhatsApp"
                                    draggable="false"
                                    className="h-7 w-7 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* =====================================================
                    BACK
                ====================================================== */}
                <div
                    className="product-card-back absolute inset-0 overflow-hidden rounded-[22px] border border-slate-800 bg-slate-950 text-white shadow-[0_20px_50px_rgba(15,23,42,.25)]"
                    style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    <div className="relative flex h-full min-h-[410px] flex-col overflow-hidden p-6">
                        {/* GLOW EFFECTS */}
                        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl" />

                        <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

                        {/* TOP BAR */}
                        <div className="relative flex items-center justify-between">
                            <span className="rounded-lg border border-sky-400/20 bg-sky-400/10 px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-wider text-sky-400">
                                {product.category}
                            </span>

                            <span className="text-[8px] font-bold uppercase tracking-[.2em] text-slate-500">
                                Product Details
                            </span>
                        </div>

                        {/* ICON */}
                        <div className="relative mt-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-500/20 bg-sky-500/10">
                            <Wrench
                                className="h-6 w-6"
                                style={{ color: PRIMARY_BLUE }}
                            />
                        </div>

                        {/* NAME */}
                        <h3 className="relative mt-5 text-lg font-black uppercase leading-tight tracking-tight text-white">
                            {product.name}
                        </h3>

                        {/* DESCRIPTION */}
                        <p className="relative mt-3 text-[10px] font-medium leading-5 text-slate-400">
                            {product.description}
                        </p>

                        {/* INFO GRID */}
                        <div className="relative mt-5 grid grid-cols-2 gap-2">
                            {/* PRICE */}
                            <div className="rounded-xl border border-white/10 bg-white/[.04] p-3">
                                <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">
                                    Price
                                </span>

                                <span className="mt-1 block text-sm font-black text-white">
                                    AED {product.price}
                                </span>
                            </div>

                            {/* STATUS */}
                            <div className="rounded-xl border border-white/10 bg-white/[.04] p-3">
                                <span className="block text-[8px] font-bold uppercase tracking-wider text-slate-500">
                                    Status
                                </span>

                                <span className="mt-1 block text-[10px] font-extrabold uppercase text-emerald-400">
                                    In Stock
                                </span>
                            </div>
                        </div>

                        {/* BOTTOM ACTIONS */}
                        <div className="relative mt-auto">
                            {/* QUALITY BADGE */}
                            <div className="mb-3 flex items-center gap-2">
                                <ShieldCheck className="h-4 w-4 text-emerald-400" />

                                <span className="text-[9px] font-bold text-slate-400">
                                    Quality Verified
                                </span>
                            </div>

                            {/* WHATSAPP CTA BUTTON */}
                            <button
                                type="button"
                                onClick={openWhatsApp}
                                onMouseEnter={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-green-500 py-3.5 text-[10px] font-black uppercase tracking-[.12em] text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:bg-green-600 hover:shadow-green-500/30 active:scale-95"
                            >
                                <img
                                    src={whatsappIcon}
                                    alt="WhatsApp"
                                    draggable="false"
                                    className="h-6 w-6 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />

                                WhatsApp Enquiry
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}