import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import {
  Search,
  ShieldCheck,
  Wrench,
  Package,
  Truck,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import ProductCard from "../components/ProductCard";
import whatsappIcon from "../assets/gemini-svg (1).svg";

/* =====================================================
   CONFIG
===================================================== */

const PRIMARY_BLUE = "#0084D1";
const WHATSAPP_NUMBER = "971568706629";

// Initial products loaded from backend
const INITIAL_LIMIT = 12;

// Backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://autosparts.onrender.com";

/* =====================================================
   CATEGORIES
===================================================== */

const CATEGORIES = [
  "All",
  "Brakes",
  "Engine",
  "Lighting",
  "Suspension",
  "Wheels",
  "Maintenance",
  "Exhaust",
  "Exterior",
];

/* =====================================================
   AXIOS
===================================================== */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =====================================================
   AUTO STORE
===================================================== */

export default function AutoStore() {
  const [products, setProducts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All");

  const [flippedId, setFlippedId] = useState(null);
  const [heroIn, setHeroIn] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const categoryRef = useRef(null);
  const isFirstMount = useRef(true);

  /* =====================================================
     HERO ANIMATION
  ===================================================== */

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setHeroIn(true);
    });

    return () => cancelAnimationFrame(raf);
  }, []);

  /* =====================================================
     FETCH PRODUCTS FROM BACKEND ONLY
  ===================================================== */

  const fetchProducts = useCallback(
    async ({
      pageNumber = 1,
      append = false,
      search = "",
      selectedCategory = "All",
    } = {}) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError("");

        const params = {
          page: pageNumber,
          limit: INITIAL_LIMIT,
        };

        /* Search */
        if (search.trim()) {
          params.search = search.trim();
        }

        /* Category */
        if (
          selectedCategory &&
          selectedCategory !== "All"
        ) {
          params.category = selectedCategory;
        }

        console.log(
          "Fetching products:",
          `${API_BASE_URL}/api/products`,
          params
        );

        const response = await api.get(
          "/api/products",
          {
            params,
          }
        );

        const responseData = response.data;

        console.log(
          "Backend product response:",
          responseData
        );

        /* =================================================
           ONLY USE PRODUCTS FROM BACKEND
        ================================================= */

        const backendProducts =
          Array.isArray(responseData)
            ? responseData
            : Array.isArray(
                responseData?.products
              )
            ? responseData.products
            : [];

        /* =================================================
           NORMALIZE BACKEND PRODUCTS
        ================================================= */

        const normalizedProducts =
          backendProducts.map(
            (item, index) => ({
              ...item,

              id:
                item._id ||
                item.id ||
                `backend-product-${pageNumber}-${index}`,

              name:
                item.name ||
                "Unnamed Product",

              partNumber:
                item.partNumber ||
                item.sku ||
                "N/A",

              category:
                item.category ||
                "General",

              price:
                Number(item.price) || 0,

              description:
                item.description || "",

              brand:
                item.brand || "",

              barcode:
                item.barcode || "",

              stock:
                Number(item.stock) || 0,

              vehicleMake:
                item.vehicleMake ||
                "Universal",

              vehicleModel:
                item.vehicleModel || "",

              vehicleYear:
                item.vehicleYear || "",

              /* IMPORTANT:
                 No dummy image.
                 Only use backend image.
              */

              image:
                item.image ||
                item.imageUrl ||
                "",
            })
          );

        /* =================================================
           UPDATE PRODUCTS
        ================================================= */

        setProducts((currentProducts) => {
          if (!append) {
            return normalizedProducts;
          }

          const existingIds =
            new Set(
              currentProducts.map(
                (product) =>
                  product.id
              )
            );

          const newProducts =
            normalizedProducts.filter(
              (product) =>
                !existingIds.has(
                  product.id
                )
            );

          return [
            ...currentProducts,
            ...newProducts,
          ];
        });

        /* =================================================
           PAGINATION
        ================================================= */

        const total = Number(
          responseData?.total ??
            normalizedProducts.length
        );

        setTotalProducts(total);

        if (
          typeof responseData?.hasMore ===
          "boolean"
        ) {
          setHasMore(
            responseData.hasMore
          );
        } else {
          setHasMore(
            normalizedProducts.length ===
              INITIAL_LIMIT
          );
        }

        setPage(pageNumber);
      } catch (err) {
        console.error(
          "Fetch products error:",
          err
        );

        const backendMessage =
          err?.response?.data?.message;

        setError(
          backendMessage ||
            "Unable to connect to the product database."
        );

        if (!append) {
          setProducts([]);
          setTotalProducts(0);
          setHasMore(false);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  /* =====================================================
     INITIAL LOAD + SEARCH + CATEGORY
  ===================================================== */

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;

      fetchProducts({
        pageNumber: 1,
        append: false,
        search: searchQuery,
        selectedCategory: category,
      });

      return;
    }

    const timer = setTimeout(() => {
      setPage(1);

      fetchProducts({
        pageNumber: 1,
        append: false,
        search: searchQuery,
        selectedCategory: category,
      });
    }, 350);

    return () => {
      clearTimeout(timer);
    };
  }, [
    searchQuery,
    category,
    fetchProducts,
  ]);

  /* =====================================================
     LOAD MORE
  ===================================================== */

  const loadMoreProducts = () => {
    if (
      loadingMore ||
      loading ||
      !hasMore
    ) {
      return;
    }

    fetchProducts({
      pageNumber: page + 1,
      append: true,
      search: searchQuery,
      selectedCategory: category,
    });
  };

  /* =====================================================
     WHATSAPP
  ===================================================== */

  const openWhatsApp = (product) => {
    const message = `Hello Ezin Zahan Spare Parts,

I am inquiring about:

• Product: ${product.name}
• Part #: ${product.partNumber || "N/A"}
• Category: ${product.category || "N/A"}
• Price: AED ${product.price ?? "Custom quote"}

Is this item currently available?`;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =====================================================
     MOBILE CARD FLIP
  ===================================================== */

  const handleCardClick = (productId) => {
    if (window.innerWidth < 768) {
      setFlippedId((current) =>
        current === productId
          ? null
          : productId
      );
    }
  };

  /* =====================================================
     CATEGORY SCROLL
  ===================================================== */

  const scrollCategories = (
    direction
  ) => {
    if (!categoryRef.current) {
      return;
    }

    categoryRef.current.scrollBy({
      left:
        direction === "left"
          ? -220
          : 220,
      behavior: "smooth",
    });
  };

  /* =====================================================
     CLEAR FILTERS
  ===================================================== */

  const clearFilters = () => {
    setSearchQuery("");
    setCategory("All");
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-blue-100 text-slate-900"
      style={{
        fontFamily:
          "Montserrat, sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(.96) translateY(15px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes whatsappPulse {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.08);
          }
        }

        .fade-up {
          animation: fadeUp .6s ease both;
        }

        .card-pop {
          animation:
            popIn .5s cubic-bezier(.16,1,.3,1)
            both;
        }

        .whatsapp-button:hover {
          animation:
            whatsappPulse .35s ease-in-out;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>

      {/* =================================================
          DECORATIVE BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />

        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-blue-300/30 blur-3xl" />
      </div>

      <div className="relative z-10">

        {/* =================================================
            HERO
        ================================================= */}

        <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-sky-50 via-white to-blue-100 px-6 py-16 sm:py-20">
          <div className="relative z-10 mx-auto max-w-5xl text-center">

            <div
              className="mb-5 flex items-center justify-center gap-3"
              style={{
                opacity: heroIn ? 1 : 0,
                transform: heroIn
                  ? "translateY(0)"
                  : "translateY(14px)",
                transition:
                  "all .6s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-sky-200 bg-white shadow-sm">
                <Wrench
                  className="h-5 w-5"
                  style={{
                    color: PRIMARY_BLUE,
                  }}
                />
              </div>

              <span
                className="text-xs font-bold uppercase tracking-[.28em]"
                style={{
                  color: PRIMARY_BLUE,
                }}
              >
                Ezin Zahan Spare Parts
              </span>
            </div>

            <h1
              className="text-4xl font-black uppercase leading-[.95] tracking-[-.04em] text-slate-950 sm:text-5xl md:text-6xl"
              style={{
                opacity: heroIn ? 1 : 0,
                transform: heroIn
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition:
                  "all .65s cubic-bezier(.16,1,.3,1) .08s",
              }}
            >
              Upgrade Your{" "}
              <span
                style={{
                  color: PRIMARY_BLUE,
                }}
              >
                Machine
              </span>
            </h1>

            <p
              className="mx-auto mt-6 max-w-2xl text-sm font-medium leading-7 text-slate-600 sm:text-base"
              style={{
                opacity: heroIn ? 1 : 0,
                transform: heroIn
                  ? "translateY(0)"
                  : "translateY(20px)",
                transition:
                  "all .65s cubic-bezier(.16,1,.3,1) .16s",
              }}
            >
              Certified replacement components,
              performance parts, and automotive
              accessories.
            </p>
          </div>
        </section>

        {/* =================================================
            TRUST ITEMS
        ================================================= */}

        <section
          id="services"
          className="relative border-b border-slate-200 bg-white/70 backdrop-blur-md"
        >
          <div className="mx-auto max-w-7xl px-6 py-6 md:py-8">

            <div className="grid grid-cols-1 divide-y divide-slate-200 md:grid-cols-3 md:divide-x md:divide-y-0">

              <TrustItem
                index={0}
                icon={
                  <ShieldCheck className="h-5 w-5" />
                }
                title="Genuine OEM & Aftermarket"
                description="Verified parts with warranty backing"
              />

              <TrustItem
                index={1}
                icon={
                  <Truck className="h-5 w-5" />
                }
                title="Fast Dispatch"
                description="Direct delivery across UAE and GCC"
              />

              <TrustItem
                index={2}
                icon={
                  <Package className="h-5 w-5" />
                }
                title="Exact Fit Guaranteed"
                description="Check compatibility before shipping"
              />

            </div>
          </div>
        </section>

        {/* =================================================
            PRODUCTS
        ================================================= */}

        <section
          id="products"
          className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16"
        >

          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-[.28em]"
                style={{
                  color: PRIMARY_BLUE,
                }}
              >
                Inventory
              </span>

              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-slate-950 sm:text-4xl">
                Automotive Products
              </h2>
            </div>

            <span className="hidden pb-1 text-xs font-bold text-slate-400 lg:block">
              {totalProducts}{" "}
              {totalProducts === 1
                ? "part"
                : "parts"}{" "}
              listed
            </span>
          </div>

          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="mb-6 flex w-full items-center rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm transition-all focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-500/10">

            <Search
              className="mr-3 h-4 w-4 shrink-0"
              style={{
                color: PRIMARY_BLUE,
              }}
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(
                  e.target.value
                )
              }
              placeholder="Search by part name, brand, part #, or vehicle model..."
              className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none placeholder:text-slate-400"
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() =>
                  setSearchQuery("")
                }
                className="ml-2 rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-sky-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="relative mb-9">

            <button
              type="button"
              onClick={() =>
                scrollCategories("left")
              }
              className="absolute left-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg md:hidden"
              style={{
                color: PRIMARY_BLUE,
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div
              ref={categoryRef}
              className="scrollbar-hide flex items-center gap-2 overflow-x-auto px-10 pb-2 md:px-0"
            >
              {CATEGORIES.map(
                (item) => {
                  const active =
                    category === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setCategory(item)
                      }
                      className={`shrink-0 whitespace-nowrap rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-wide transition-all ${
                        active
                          ? "border-transparent text-white shadow-md"
                          : "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600"
                      }`}
                      style={
                        active
                          ? {
                              backgroundColor:
                                PRIMARY_BLUE,
                            }
                          : undefined
                      }
                    >
                      {item}
                    </button>
                  );
                }
              )}
            </div>

            <button
              type="button"
              onClick={() =>
                scrollCategories("right")
              }
              className="absolute right-0 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow-lg md:hidden"
              style={{
                color: PRIMARY_BLUE,
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 p-5">
              <div className="flex items-start gap-3">

                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

                <div className="flex-1">

                  <h3 className="text-sm font-bold text-red-700">
                    Unable to load products
                  </h3>

                  <p className="mt-1 text-xs text-red-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      fetchProducts({
                        pageNumber: 1,
                        append: false,
                        search: searchQuery,
                        selectedCategory:
                          category,
                      })
                    }
                    className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white hover:bg-red-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Try Again
                  </button>

                </div>
              </div>
            </div>
          )}

          {/* =================================================
              LOADING
          ================================================= */}

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

              {Array.from({
                length: 8,
              }).map((_, index) => (
                <div
                  key={index}
                  className="h-[360px] animate-pulse rounded-2xl border border-slate-200 bg-white"
                >
                  <div className="h-48 rounded-t-2xl bg-slate-100" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-3/4 rounded bg-slate-100" />
                    <div className="h-3 w-1/2 rounded bg-slate-100" />
                    <div className="mt-4 h-9 w-full rounded-xl bg-slate-100" />
                  </div>
                </div>
              ))}

            </div>
          ) : products.length > 0 ? (
            <>
              {/* =================================================
                  BACKEND PRODUCTS ONLY
              ================================================= */}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                {products.map(
                  (product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      flipped={
                        flippedId ===
                        product.id
                      }
                      animationDelay={
                        Math.min(
                          index,
                          7
                        ) * 50
                      }
                      onFlip={() =>
                        handleCardClick(
                          product.id
                        )
                      }
                      onInquire={() =>
                        openWhatsApp(
                          product
                        )
                      }
                    />
                  )
                )}

              </div>

              {/* =================================================
                  LOAD MORE
              ================================================= */}

              {hasMore && (
                <div className="mt-12 flex justify-center">

                  <button
                    type="button"
                    onClick={
                      loadMoreProducts
                    }
                    disabled={loadingMore}
                    className="inline-flex min-w-[180px] items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:opacity-60"
                    style={{
                      backgroundColor:
                        PRIMARY_BLUE,
                    }}
                  >

                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Parts"
                    )}

                  </button>
                </div>
              )}

              {!hasMore &&
                products.length > 0 && (
                  <div className="mt-12 text-center">
                    <p className="text-xs font-semibold text-slate-400">
                      All available parts loaded
                    </p>
                  </div>
                )}
            </>
          ) : (
            /* =================================================
               EMPTY STATE
            ================================================= */

            <div className="fade-up rounded-2xl border border-slate-200 bg-white py-16 text-center shadow-sm">

              <Search className="mx-auto mb-4 h-10 w-10 text-slate-300" />

              <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
                No matching parts found
              </h3>

              <p className="mt-2 text-xs font-medium text-slate-400">
                Try searching for another keyword or vehicle brand.
              </p>

              <button
                type="button"
                onClick={
                  clearFilters
                }
                className="mt-5 rounded-xl px-6 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md"
                style={{
                  backgroundColor:
                    PRIMARY_BLUE,
                }}
              >
                Reset Filters
              </button>

            </div>
          )}
        </section>
      </div>

      {/* =====================================================
          WHATSAPP
      ===================================================== */}

      <button
        type="button"
        onClick={() =>
          openWhatsApp({
            name:
              "General Spare Parts Inquiry",
            category:
              category === "All"
                ? "Catalog"
                : category,
            price:
              "Custom quote",
          })
        }
        className="whatsapp-button fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl transition-all hover:-translate-y-1 md:bottom-8 md:right-8"
        aria-label="Direct WhatsApp Order"
      >
        <img
          src={whatsappIcon}
          alt="WhatsApp"
          className="h-8 w-8 object-contain"
        />
      </button>
    </div>
  );
}

/* =====================================================
   TRUST ITEM
===================================================== */

function TrustItem({
  icon,
  title,
  description,
  index = 0,
}) {
  const itemRef = useRef(null);
  const [isVisible, setIsVisible] =
    useState(false);

  useEffect(() => {
    const element =
      itemRef.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (
            entry.isIntersecting
          ) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.2,
        }
      );

    observer.observe(element);

    return () =>
      observer.disconnect();
  }, []);

  return (
    <div
      ref={itemRef}
      className={`group flex items-center gap-4 px-5 py-5 transition-all duration-500 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0"
      }`}
      style={{
        transitionDelay:
          `${index * 100}ms`,
      }}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 shadow-sm transition-transform group-hover:scale-105">
        {icon}
      </div>

      <div className="min-w-0">
        <h3 className="text-xs font-extrabold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-[10px] text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}