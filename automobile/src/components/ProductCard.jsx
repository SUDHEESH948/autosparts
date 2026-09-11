import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  ArrowRight,
  Package,
  ShieldCheck,
  Wrench,
  ImageOff,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

/* =====================================================
   CONFIG
===================================================== */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const PRODUCT_LIMIT = 10;

/* =====================================================
   API
===================================================== */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   IMAGE URL
===================================================== */

const getImageUrl = (image) => {
  if (!image || typeof image !== "string") {
    return "";
  }

  const cleanImage = image.trim();

  if (!cleanImage) {
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

/* =====================================================
   PRICE
===================================================== */

const formatPrice = (price) => {
  if (
    price === undefined ||
    price === null ||
    price === ""
  ) {
    return "Price on request";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return String(price);
  }

  return `AED ${numericPrice.toLocaleString("en-IN")}`;
};

/* =====================================================
   PRODUCT CARD COMPONENT
===================================================== */

export default function ProductCard() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(true);

  /* ===================================================
     FETCH PRODUCTS
  =================================================== */

  const fetchProducts = async (
    pageNumber = 1,
    append = false
  ) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError("");
      }

      const response = await api.get(
        "/api/products",
        {
          params: {
            page: pageNumber,
            limit: PRODUCT_LIMIT,
          },
        }
      );

      console.log(
        `Products API response - Page ${pageNumber}:`,
        response.data
      );

      const backendProducts = Array.isArray(
        response.data?.products
      )
        ? response.data.products
        : [];

      /* ================================================
         UPDATE PRODUCTS
      ================================================ */

      if (append) {
        setProducts((previousProducts) => {
          /*
            Prevent duplicate products in case
            backend returns overlapping data.
          */

          const existingIds = new Set(
            previousProducts.map(
              (product) =>
                product._id || product.id
            )
          );

          const newProducts =
            backendProducts.filter(
              (product) =>
                !existingIds.has(
                  product._id || product.id
                )
            );

          return [
            ...previousProducts,
            ...newProducts,
          ];
        });
      } else {
        setProducts(backendProducts);
      }

      /* ================================================
         CHECK WHETHER MORE PRODUCTS EXIST
      ================================================ */

      /*
        If backend returns less than 10 products,
        we know there are no more products.
      */

      const moreAvailable =
        backendProducts.length ===
        PRODUCT_LIMIT;

      setHasMore(moreAvailable);

      setPage(pageNumber);
    } catch (err) {
      console.error(
        "Products fetch error:",
        err
      );

      if (!append) {
        setError(
          err?.response?.data?.message ||
            "Failed to load products."
        );

        setProducts([]);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  /* ===================================================
     INITIAL LOAD
  =================================================== */

  useEffect(() => {
    fetchProducts(1, false);
  }, []);

  /* ===================================================
     LOAD MORE
  =================================================== */

  const handleLoadMore = () => {
    if (loadingMore || !hasMore) {
      return;
    }

    const nextPage = page + 1;

    fetchProducts(nextPage, true);
  };

  /* ===================================================
     LOADING
  =================================================== */

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0084D1]">
            Inventory
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase text-slate-950">
            Automotive Products
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({
            length: 4,
          }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-52 animate-pulse bg-slate-100" />

              <div className="space-y-3 p-5">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

                <div className="h-6 w-3/4 animate-pulse rounded bg-slate-100" />

                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

                <div className="h-10 w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  /* ===================================================
     ERROR
  =================================================== */

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-500" />

          <h3 className="font-bold text-red-700">
            Unable to load products
          </h3>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            type="button"
            onClick={() =>
              fetchProducts(1, false)
            }
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-red-700"
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </section>
    );
  }

  /* ===================================================
     EMPTY
  =================================================== */

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <Package className="mx-auto mb-4 h-10 w-10 text-slate-300" />

          <h3 className="text-lg font-bold text-slate-700">
            No products available
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Products added by the seller
            will appear here.
          </p>
        </div>
      </section>
    );
  }

  /* ===================================================
     PRODUCTS
  =================================================== */

  return (
    <section className="mx-auto max-w-7xl px-6 py-14">

      {/* HEADER */}

      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#0084D1]">
            Inventory
          </p>

          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-slate-950 sm:text-4xl">
            Automotive Products
          </h2>
        </div>

        <span className="hidden text-xs font-semibold text-slate-400 sm:block">
          Showing {products.length} Products
        </span>
      </div>

      {/* PRODUCT GRID */}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <SingleProductCard
            key={
              product._id ||
              product.id
            }
            product={product}
          />
        ))}
      </div>

      {/* =================================================
          LOAD MORE
      ================================================= */}

      {hasMore && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="
              inline-flex
              min-w-[180px]
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0084D1]
              px-6
              py-3
              text-sm
              font-bold
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:bg-[#0072b5]
              hover:shadow-md
              active:scale-[0.98]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loadingMore ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Loading...
              </>
            ) : (
              <>
                Load More

                <ArrowRight
                  size={18}
                />
              </>
            )}
          </button>
        </div>
      )}

      {/* =================================================
          NO MORE PRODUCTS
      ================================================= */}

      {!hasMore &&
        products.length > 0 && (
          <div className="mt-10 text-center">
            <p className="text-sm font-medium text-slate-400">
              All products have been loaded.
            </p>
          </div>
        )}
    </section>
  );
}

/* =====================================================
   SINGLE PRODUCT CARD
===================================================== */

function SingleProductCard({
  product,
}) {
  const [imageError, setImageError] =
    useState(false);

  if (!product) {
    return null;
  }

  /* ===================================================
     PRODUCT DATA
  =================================================== */

  const productId =
    product._id ||
    product.id;

  const name =
    product.name ||
    "Unnamed Product";

  const category =
    product.category ||
    "Auto Parts";

  const description =
    product.description ||
    "No product description available.";

  const price =
    product.price;

  const brand =
    product.brand || "";

  const partNumber =
    product.partNumber || "";

  const stock =
    Number(product.stock) || 0;

  /* ===================================================
     IMAGE
  =================================================== */

  const rawImage =
    product.image ||
    product.imageUrl ||
    "";

  const imageUrl =
    getImageUrl(rawImage);

  /* ===================================================
     WHATSAPP
  =================================================== */

  const handleWhatsApp = () => {
    const message =
      `Hello Ezin Zahan Spare Parts,\n\n` +
      `I am interested in this product:\n\n` +
      `Product: ${name}\n` +
      `Part Number: ${
        partNumber || "N/A"
      }\n` +
      `Category: ${category}\n` +
      `Price: AED ${
        price ?? "On request"
      }\n\n` +
      `Is this item available?`;

    window.open(
      `https://wa.me/971568706629?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ===================================================
     UI
  =================================================== */

  return (
    <article
      className="
        group
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* IMAGE */}

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            onError={() =>
              setImageError(true)
            }
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center bg-slate-100">
            <ImageOff
              size={40}
              className="text-slate-300"
            />

            <span className="mt-2 text-xs text-slate-400">
              Image not available
            </span>
          </div>
        )}

        {/* CATEGORY */}

        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
          {category}
        </div>

        {/* STOCK */}

        <div
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
            stock > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {stock > 0
            ? `${stock} In Stock`
            : "Out of Stock"}
        </div>
      </div>

      {/* CONTENT */}

      <div className="flex flex-1 flex-col p-5">

        {/* CATEGORY */}

        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#0084D1]">
          {category}
        </p>

        {/* NAME */}

        <h3 className="line-clamp-2 min-h-[56px] text-lg font-bold leading-7 text-gray-900">
          {name}
        </h3>

        {/* DESCRIPTION */}

        <p className="mt-2 line-clamp-2 min-h-[40px] text-sm leading-5 text-gray-500">
          {description}
        </p>

        {/* FEATURES */}

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

        {/* BOTTOM */}

        <div className="mt-auto pt-5">

          <div className="mb-4 flex items-center justify-between">

            <div>
              <p className="text-xs text-gray-400">
                Price
              </p>

              <p className="text-xl font-bold text-gray-900">
                {formatPrice(price)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0084D1]/10 text-[#0084D1]">
              <Package size={20} />
            </div>

          </div>

          {/* BUTTON */}

          <button
            type="button"
            onClick={handleWhatsApp}
            className="
              flex
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0084D1]
              px-4
              py-3
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:bg-[#0072b5]
              active:scale-[0.98]
            "
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