import React, { useState } from "react";
import {
  ArrowRight,
  Package,
  ShieldCheck,
  Wrench,
  ImageOff,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://autosparts.onrender.com";

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  const cleanImage = image.trim();

  if (
    !cleanImage ||
    cleanImage.includes("example.com") ||
    cleanImage.includes("via.placeholder.com")
  ) {
    return "";
  }

  if (
    cleanImage.startsWith("http://") ||
    cleanImage.startsWith("https://") ||
    cleanImage.startsWith("data:")
  ) {
    return cleanImage;
  }

  if (cleanImage.startsWith("/")) {
    return `${API_BASE_URL}${cleanImage}`;
  }

  return `${API_BASE_URL}/${cleanImage}`;
};

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "Price on request";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return String(price);
  }

  return `AED ${numericPrice.toLocaleString("en-IN")}`;
};

/* =====================================================
   SINGLE PRODUCT CARD (Default Export)
===================================================== */

export default function ProductCard({ product, onInquire }) {
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return null;
  }

  const name = product.name || "Unnamed Product";
  const category = product.category || "Auto Parts";
  const description = product.description || "No product description available.";
  const price = product.price;
  const brand = product.brand || "";
  const partNumber = product.partNumber || "";
  const stock = Number(product.stock) || 0;

  const rawImage = product.image || product.imageUrl || "";
  const imageUrl = getImageUrl(rawImage);

  const handleWhatsApp = () => {
    if (onInquire) {
      onInquire(product);
      return;
    }

    const message =
      `Hello Ezin Zahan Spare Parts,\n\n` +
      `I am interested in this product:\n\n` +
      `Product: ${name}\n` +
      `Part Number: ${partNumber || "N/A"}\n` +
      `Category: ${category}\n` +
      `Price: ${formatPrice(price)}\n\n` +
      `Is this item available?`;

    window.open(
      `https://wa.me/971568706629?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* IMAGE */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-slate-100 p-4 text-center">
            <ImageOff size={36} className="text-slate-300" />
            <span className="mt-2 text-[11px] font-semibold text-slate-400">
              No image preview
            </span>
          </div>
        )}

        {/* CATEGORY PILL */}
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur">
          {category}
        </div>

        {/* STOCK PILL */}
        <div
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
            stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {stock > 0 ? `${stock} In Stock` : "Out of Stock"}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-1 flex-col p-5">
        {/* CATEGORY LABEL */}
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#0084D1]">
          {category}
        </p>

        {/* PRODUCT NAME */}
        <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-gray-900">
          {name}
        </h3>

        {/* DESCRIPTION */}
        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-500">
          {description}
        </p>

        {/* SPEC BADGES */}
        {(brand || partNumber) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {brand && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                <ShieldCheck size={13} />
                {brand}
              </span>
            )}

            {partNumber && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
                <Wrench size={13} />
                {partNumber}
              </span>
            )}
          </div>
        )}

        {/* CARD FOOTER */}
        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Price</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(price)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0084D1]/10 text-[#0084D1]">
              <Package size={20} />
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsApp}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0084D1] px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#0072b5] active:scale-[0.98]"
          >
            Inquire on WhatsApp
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </article>
  );
}