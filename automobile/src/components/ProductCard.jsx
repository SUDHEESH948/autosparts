
import React, { useMemo } from "react";
import {
  ArrowRight,
  Package,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://autosparts.onrender.com";

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22450%22%20viewBox%3D%220%200%20600%20450%22%3E%3Crect%20fill%3D%22%23f1f5f9%22%20width%3D%22600%22%20height%3D%22450%22%2F%3E%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2245%22%20fill%3D%22%23cbd5e1%22%2F%3E%3Cpath%20d%3D%22M260%20270h80v12h-80zm-30%2024h140v8H230z%22%20fill%3D%22%2394a3b8%22%2F%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%3EAuto%20Spare%20Part%3C%2Ftext%3E%3C%2Fsvg%3E";

/* =====================================================
   IMAGE URL
===================================================== */

const getImageUrl = (image) => {
  if (
    !image ||
    typeof image !== "string" ||
    image.includes("example.com") ||
    image.includes("via.placeholder.com")
  ) {
    return PLACEHOLDER_IMAGE;
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("data:")
  ) {
    return image;
  }

  if (image.startsWith("/")) {
    return `${API_BASE_URL}${image}`;
  }

  return `${API_BASE_URL}/${image}`;
};

/* =====================================================
   PRICE FORMATTER
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
   PRODUCT CARD
===================================================== */

const ProductCard = ({ product, onInquire, onFlip, flipped }) => {
  const navigate = useNavigate();

  /* ---------------------------------------------------
     NO PRODUCT
  --------------------------------------------------- */

  if (!product) {
    return null;
  }

  /* ---------------------------------------------------
     PRODUCT DATA
  --------------------------------------------------- */

  const productId =
    product._id ||
    product.id ||
    product.productId;

  const productName =
    product.name ||
    product.productName ||
    product.title ||
    "Product";

  const category =
    product.category ||
    product.categoryName ||
    "Auto Parts";

  const description =
    product.description ||
    product.shortDescription ||
    "High-quality automotive product.";

  const price =
    product.price ??
    product.sellingPrice ??
    product.amount;

  const brand = product.brand || "";

  const partNumber =
    product.partNumber || "";

  const stock =
    product.stock !== undefined &&
    product.stock !== null
      ? Number(product.stock)
      : 0;

  /* ---------------------------------------------------
     IMAGE
  --------------------------------------------------- */

  const rawImage =
    product.image ||
    product.imageUrl ||
    product.productImage ||
    product.thumbnail ||
    (Array.isArray(product.images)
      ? product.images[0]
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

    if (brand) {
      result.push(brand);
    }

    if (partNumber) {
      result.push(partNumber);
    }

    if (result.length === 0) {
      result.push(
        stock > 0 ? "In Stock" : "Out of Stock"
      );
    }

    return result.slice(0, 2);
  }, [brand, partNumber, stock]);

  /* ---------------------------------------------------
     VIEW PRODUCT
  --------------------------------------------------- */

  const handleViewProduct = () => {
    if (onInquire) {
      onInquire(product);
      return;
    }

    if (!productId) {
      console.error(
        "Product ID missing:",
        product
      );
      return;
    }

    navigate("/products");
  };

  /* ---------------------------------------------------
     IMAGE ERROR
  --------------------------------------------------- */

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src =
      PLACEHOLDER_IMAGE;
  };

  /* =====================================================
     UI
  ===================================================== */

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
      {/* IMAGE */}

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
              stock > 0
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }
          `}
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

        {/* FEATURES */}

        {features.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {features.map(
              (feature, index) => (
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
              )
            )}
          </div>
        )}

        {/* BOTTOM */}

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

            {/* ICON */}

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

          {/* BUTTON */}

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
            {onInquire ? "Inquire on WhatsApp" : "View Product"}

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
