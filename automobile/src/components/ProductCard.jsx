import React, { useMemo } from "react";
import {
  ArrowRight,
  Package,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://autosparts.onrender.com";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80";

const DEFAULT_PRODUCT = {
  _id: "default-1",
  name: "Premium Brake Pad Set",
  category: "Brakes",
  price: 250,
  description:
    "High-performance brake pads designed for reliable stopping power and durability.",
  image: PLACEHOLDER_IMAGE,
  stock: 20,
  brand: "Brembo",
  partNumber: "BP-003",
};

/* =====================================================
   IMAGE URL HELPER
===================================================== */

const getImageUrl = (image) => {
  if (!image) {
    return PLACEHOLDER_IMAGE;
  }

  // If backend already returns a complete URL
  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  // Backend-relative image path
  if (image.startsWith("/")) {
    return `${API_BASE_URL}${image}`;
  }

  return `${API_BASE_URL}/${image}`;
};

/* =====================================================
   PRICE FORMATTER
===================================================== */

const formatPrice = (price) => {
  if (price === undefined || price === null || price === "") {
    return "Price on request";
  }

  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return price;
  }

  return `AED ${numericPrice.toLocaleString()}`;
};

/* =====================================================
   PRODUCT CARD
===================================================== */

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const currentProduct = product || DEFAULT_PRODUCT;

  /* ---------------------------------------------------
     PRODUCT DATA
  --------------------------------------------------- */

  const productId =
    currentProduct._id ||
    currentProduct.id ||
    currentProduct.productId;

  const productName =
    currentProduct.name ||
    currentProduct.productName ||
    currentProduct.title ||
    "Product";

  const category =
    currentProduct.category ||
    currentProduct.categoryName ||
    "Auto Parts";

  const description =
    currentProduct.description ||
    currentProduct.shortDescription ||
    "High-quality automotive product.";

  const price =
    currentProduct.price ??
    currentProduct.sellingPrice ??
    currentProduct.amount;

  /* ---------------------------------------------------
     IMAGE
  --------------------------------------------------- */

  const rawImage =
    currentProduct.image ||
    currentProduct.imageUrl ||
    currentProduct.productImage ||
    currentProduct.thumbnail ||
    (Array.isArray(currentProduct.images)
      ? currentProduct.images[0]
      : null);

  const imageUrl = useMemo(
    () => getImageUrl(rawImage),
    [rawImage]
  );

  /* ---------------------------------------------------
     FEATURES
  --------------------------------------------------- */

  const features = useMemo(() => {
    const result = [];

    if (currentProduct.brand) {
      result.push(currentProduct.brand);
    }

    if (currentProduct.warranty) {
      result.push(currentProduct.warranty);
    }

    if (currentProduct.stock !== undefined) {
      result.push(
        Number(currentProduct.stock) > 0
          ? "In Stock"
          : "Out of Stock"
      );
    }

    return result.slice(0, 2);
  }, [currentProduct]);

  /* ---------------------------------------------------
     VIEW PRODUCT
  --------------------------------------------------- */

  const handleViewProduct = () => {
    if (!productId) {
      console.error("Product ID missing:", currentProduct);
      return;
    }

    navigate(`/products/${productId}`);
  };

  /* ---------------------------------------------------
     IMAGE ERROR
  --------------------------------------------------- */

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = PLACEHOLDER_IMAGE;
  };

  /* ===================================================
     UI
  =================================================== */

  return (
    <article
      className="
        group
        relative
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
      {/* =================================================
          IMAGE
      ================================================= */}

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={productName}
          onError={handleImageError}
          loading="lazy"
          className="
            h-full
            w-full
            object-cover
            transition-transform
            duration-500
            group-hover:scale-105
          "
        />

        {/* CATEGORY */}

        <div
          className="
            absolute
            left-3
            top-3
            rounded-full
            bg-white/95
            px-3
            py-1
            text-xs
            font-semibold
            text-gray-700
            shadow-sm
            backdrop-blur
          "
        >
          {category}
        </div>

        {/* STOCK */}

        {product.stock !== undefined && (
          <div
            className={`
              absolute
              right-3
              top-3
              rounded-full
              px-3
              py-1
              text-xs
              font-semibold
              shadow-sm
              ${
                Number(product.stock) > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {Number(product.stock) > 0
              ? "In Stock"
              : "Out of Stock"}
          </div>
        )}
      </div>

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="flex flex-1 flex-col p-5">
        {/* CATEGORY */}

        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#0084D1]">
          {category}
        </p>

        {/* PRODUCT NAME */}

        <h3
          className="
            line-clamp-2
            min-h-[56px]
            text-lg
            font-bold
            leading-7
            text-gray-900
          "
        >
          {productName}
        </h3>

        {/* DESCRIPTION */}

        <p
          className="
            mt-2
            line-clamp-2
            min-h-[40px]
            text-sm
            leading-5
            text-gray-500
          "
        >
          {description}
        </p>

        {/* =================================================
            FEATURES
        ================================================= */}

        {features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {features.map((feature, index) => (
              <span
                key={`${feature}-${index}`}
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-gray-50
                  px-2.5
                  py-1
                  text-xs
                  font-medium
                  text-gray-600
                "
              >
                {index === 0 ? (
                  <ShieldCheck size={13} />
                ) : (
                  <Wrench size={13} />
                )}

                {feature}
              </span>
            ))}
          </div>
        )}

        {/* =================================================
            BOTTOM
        ================================================= */}

        <div className="mt-auto pt-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            {/* PRICE */}

            <div>
              <p className="text-xs text-gray-400">
                Price
              </p>

              <p className="text-xl font-bold text-gray-900">
                {formatPrice(price)}
              </p>
            </div>

            {/* PRODUCT ICON */}

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-[#0084D1]/10
                text-[#0084D1]
              "
            >
              <Package size={20} />
            </div>
          </div>

          {/* =================================================
              VIEW PRODUCT BUTTON
          ================================================= */}

          <button
            type="button"
            onClick={handleViewProduct}
            disabled={!productId}
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
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            View Product

            <ArrowRight
              size={17}
              className="
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            />
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;