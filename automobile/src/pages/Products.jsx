
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

const INITIAL_LIMIT = 10;

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";


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
   MAIN COMPONENT
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

    const [hasMore, setHasMore] = useState(true);

    const [totalProducts, setTotalProducts] = useState(0);

    const categoryRef = useRef(null);


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
       FETCH PRODUCTS
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


                /* =========================================
                   SEARCH
                ========================================= */

                if (search.trim()) {
                    params.search = search.trim();
                }


                /* =========================================
                   CATEGORY
                ========================================= */

                if (
                    selectedCategory &&
                    selectedCategory !== "All"
                ) {
                    params.category = selectedCategory;
                }


                const response = await api.get(
                    "/api/products",
                    {
                        params,
                    }
                );


                /*
                 * Supports common backend response formats:
                 *
                 * {
                 *   success: true,
                 *   products: [...]
                 * }
                 *
                 * OR
                 *
                 * {
                 *   data: [...]
                 * }
                 *
                 * OR
                 *
                 * [...]
                 */

                const responseData = response.data;


                let receivedProducts = [];

                let total = 0;


                if (Array.isArray(responseData)) {

                    receivedProducts = responseData;

                    total = responseData.length;

                } else if (
                    Array.isArray(
                        responseData?.products
                    )
                ) {

                    receivedProducts =
                        responseData.products;

                    total =
                        Number(
                            responseData.total
                        ) ||
                        Number(
                            responseData.pagination?.total
                        ) ||
                        receivedProducts.length;

                } else if (
                    Array.isArray(
                        responseData?.data
                    )
                ) {

                    receivedProducts =
                        responseData.data;

                    total =
                        Number(
                            responseData.total
                        ) ||
                        Number(
                            responseData.pagination?.total
                        ) ||
                        receivedProducts.length;
                }


                /* =========================================
                   NORMALIZE PRODUCTS
                ========================================= */

                const normalizedProducts =
                    receivedProducts.map(
                        (product, index) => ({
                            ...product,

                            id:
                                product.id ||
                                product._id ||
                                `product-${pageNumber}-${index}`,

                            name:
                                product.name ||
                                product.title ||
                                "Product",

                            category:
                                product.category ||
                                "Other",

                            price:
                                product.price ??
                                0,

                            image:
                                product.image ||
                                product.imageUrl ||
                                product.imageURL ||
                                product.images?.[0] ||
                                "",

                            description:
                                product.description ||
                                "",
                        })
                    );


                /* =========================================
                   UPDATE PRODUCTS
                ========================================= */

                setProducts((currentProducts) => {

                    if (!append) {
                        return normalizedProducts;
                    }


                    /*
                     * Prevent duplicate products when
                     * Load More is clicked.
                     */

                    const existingIds =
                        new Set(
                            currentProducts.map(
                                (item) =>
                                    item.id
                            )
                        );


                    const newProducts =
                        normalizedProducts.filter(
                            (item) =>
                                !existingIds.has(
                                    item.id
                                )
                        );


                    return [
                        ...currentProducts,
                        ...newProducts,
                    ];
                });


                /* =========================================
                   TOTAL
                ========================================= */

                setTotalProducts(total);


                /* =========================================
                   HAS MORE
                ========================================= */

                if (total > 0) {

                    const currentlyLoaded =
                        append
                            ? products.length +
                              normalizedProducts.length
                            : normalizedProducts.length;


                    setHasMore(
                        normalizedProducts.length >=
                            INITIAL_LIMIT &&
                        currentlyLoaded < total
                    );

                } else {

                    setHasMore(
                        normalizedProducts.length >=
                            INITIAL_LIMIT
                    );
                }


                setPage(pageNumber);

            } catch (err) {

                console.error(
                    "Failed to fetch products:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    "Unable to load products. Please try again."
                );

                if (!append) {
                    setProducts([]);
                }

            } finally {

                setLoading(false);

                setLoadingMore(false);
            }
        },
        [products.length]
    );


    /* =====================================================
       INITIAL PRODUCTS
    ===================================================== */

    useEffect(() => {

        fetchProducts({
            pageNumber: 1,
            append: false,
            search: "",
            selectedCategory: "All",
        });

    }, []);


    /* =====================================================
       SEARCH / CATEGORY CHANGE
    ===================================================== */

    useEffect(() => {

        const timer = setTimeout(() => {

            setPage(1);

            setProducts([]);

            setHasMore(true);

            fetchProducts({
                pageNumber: 1,
                append: false,
                search: searchQuery,
                selectedCategory: category,
            });

        }, 350);


        return () => clearTimeout(timer);

    }, [searchQuery, category]);


    /* =====================================================
       LOAD MORE
    ===================================================== */

    const loadMoreProducts = async () => {

        if (
            loadingMore ||
            loading ||
            !hasMore
        ) {
            return;
        }


        await fetchProducts({
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

        const message = `Hi, I am interested in:

Product: ${product.name}
Category: ${product.category}
Price: AED ${product.price}

Please provide more details.`;


        const whatsappUrl =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                message
            )}`;


        window.open(
            whatsappUrl,
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

    const scrollCategories = (direction) => {

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
       RETRY
    ===================================================== */

    const retryProducts = () => {

        fetchProducts({
            pageNumber: 1,
            append: false,
            search: searchQuery,
            selectedCategory: category,
        });
    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-gradient-to-br
                from-sky-50
                via-white
                to-blue-100
                text-slate-900
            "
            style={{
                fontFamily:
                    "Montserrat, sans-serif",
            }}
        >

            {/* =====================================================
                ANIMATIONS
            ====================================================== */}

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
                        transform:
                            scale(.96)
                            translateY(15px);
                    }

                    to {
                        opacity: 1;
                        transform:
                            scale(1)
                            translateY(0);
                    }
                }


                @keyframes whatsappPulse {

                    0% {
                        transform: scale(1);
                    }

                    50% {
                        transform: scale(1.08);
                    }

                    100% {
                        transform: scale(1);
                    }
                }


                .fade-up {
                    animation:
                        fadeUp .6s ease both;
                }


                .card-pop {
                    animation:
                        popIn .5s
                        cubic-bezier(.16,1,.3,1)
                        both;
                }


                .whatsapp-button:hover {
                    animation:
                        whatsappPulse .35s
                        ease-in-out;
                }


                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }


                .scrollbar-hide {
                    scrollbar-width: none;
                    -ms-overflow-style: none;
                }


                @media (prefers-reduced-motion: reduce) {

                    .fade-up,
                    .card-pop,
                    .whatsapp-button {
                        animation: none !important;
                    }
                }

            `}</style>


            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div
                className="
                    pointer-events-none
                    fixed
                    inset-0
                    overflow-hidden
                "
            >

                <div
                    className="
                        absolute
                        -right-24
                        -top-24
                        h-72
                        w-72
                        rounded-full
                        bg-sky-300/30
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-24
                        left-10
                        h-64
                        w-64
                        rounded-full
                        bg-blue-300/30
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        left-1/2
                        top-1/2
                        h-96
                        w-96
                        -translate-x-1/2
                        -translate-y-1/2
                        rounded-full
                        bg-sky-200/20
                        blur-3xl
                    "
                />

            </div>


            <div className="relative z-10">

                {/* =====================================================
                    HERO
                ====================================================== */}

                <section
                    className="
                        relative
                        overflow-hidden
                        border-b
                        border-slate-200
                        bg-gradient-to-br
                        from-sky-50
                        via-white
                        to-blue-100
                        px-6
                        py-20
                    "
                >

                    <div
                        className="
                            absolute
                            -right-24
                            -top-24
                            h-72
                            w-72
                            rounded-full
                            bg-sky-300/30
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-24
                            left-10
                            h-64
                            w-64
                            rounded-full
                            bg-blue-300/30
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            mx-auto
                            max-w-5xl
                            text-center
                        "
                    >

                        <div
                            className="
                                mb-5
                                flex
                                items-center
                                justify-center
                                gap-3
                            "
                            style={{
                                opacity:
                                    heroIn
                                        ? 1
                                        : 0,

                                transform:
                                    heroIn
                                        ? "translateY(0)"
                                        : "translateY(14px)",

                                transition:
                                    "all .6s cubic-bezier(.16,1,.3,1)",
                            }}
                        >

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-sky-200
                                    bg-white
                                    shadow-sm
                                "
                            >

                                <Wrench
                                    className="
                                        h-5
                                        w-5
                                    "
                                    style={{
                                        color:
                                            PRIMARY_BLUE,
                                    }}
                                />

                            </div>


                            <span
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[.28em]
                                "
                                style={{
                                    color:
                                        PRIMARY_BLUE,
                                }}
                            >
                                Premium Automotive Store
                            </span>

                        </div>


                        <h1
                            className="
                                text-4xl
                                font-black
                                uppercase
                                leading-[.95]
                                tracking-[-.04em]
                                text-slate-950
                                sm:text-5xl
                                md:text-6xl
                            "
                            style={{
                                opacity:
                                    heroIn
                                        ? 1
                                        : 0,

                                transform:
                                    heroIn
                                        ? "translateY(0)"
                                        : "translateY(20px)",

                                transition:
                                    "all .65s cubic-bezier(.16,1,.3,1) .08s",
                            }}
                        >

                            Upgrade Your{" "}

                            <span
                                style={{
                                    color:
                                        PRIMARY_BLUE,
                                }}
                            >
                                Machine
                            </span>

                        </h1>


                        <p
                            className="
                                mx-auto
                                mt-6
                                max-w-2xl
                                text-sm
                                font-medium
                                leading-7
                                text-slate-600
                                sm:text-base
                            "
                            style={{
                                opacity:
                                    heroIn
                                        ? 1
                                        : 0,

                                transform:
                                    heroIn
                                        ? "translateY(0)"
                                        : "translateY(20px)",

                                transition:
                                    "all .65s cubic-bezier(.16,1,.3,1) .16s",
                            }}
                        >

                            Premium automotive components,
                            replacement parts and accessories
                            built for modern automotive
                            enthusiasts.

                        </p>

                    </div>

                </section>


                {/* =====================================================
                    TRUST FEATURES
                ====================================================== */}

                <section
                    id="services"
                    className="
                        relative
                        overflow-hidden
                        border-b
                        border-slate-200
                        bg-white/70
                        backdrop-blur-md
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-32
                            top-0
                            h-64
                            w-64
                            rounded-full
                            bg-sky-200/30
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            mx-auto
                            max-w-7xl
                            px-6
                            py-8
                            md:py-10
                        "
                    >

                        <div
                            className="
                                grid
                                grid-cols-1
                                divide-y
                                divide-slate-200
                                md:grid-cols-3
                                md:divide-x
                                md:divide-y-0
                            "
                        >

                            <TrustItem
                                index={0}
                                icon={
                                    <ShieldCheck
                                        className="h-5 w-5"
                                    />
                                }
                                title="Genuine Products"
                                description="Quality verified components"
                            />


                            <TrustItem
                                index={1}
                                icon={
                                    <Truck
                                        className="h-5 w-5"
                                    />
                                }
                                title="Fast Delivery"
                                description="Quick and secure shipping"
                            />


                            <TrustItem
                                index={2}
                                icon={
                                    <Package
                                        className="h-5 w-5"
                                    />
                                }
                                title="Easy Returns"
                                description="Hassle-free return policy"
                            />

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    PRODUCTS
                ====================================================== */}

                <section
                    id="products"
                    className="
                        relative
                        mx-auto
                        max-w-7xl
                        px-6
                        py-16
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================== */}

                    <div
                        className="
                            mb-8
                            flex
                            items-end
                            justify-between
                            gap-6
                        "
                    >

                        <div>

                            <span
                                className="
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[.28em]
                                "
                                style={{
                                    color:
                                        PRIMARY_BLUE,
                                }}
                            >
                                Premium Collection
                            </span>


                            <h2
                                className="
                                    mt-2
                                    text-3xl
                                    font-black
                                    uppercase
                                    tracking-tight
                                    text-slate-950
                                    sm:text-4xl
                                "
                            >
                                Automotive Products
                            </h2>


                            <p
                                className="
                                    mt-2
                                    max-w-xl
                                    text-xs
                                    font-medium
                                    leading-6
                                    text-slate-500
                                    sm:text-sm
                                "
                            >
                                Browse our latest performance
                                and replacement components.
                            </p>

                        </div>


                        <span
                            className="
                                hidden
                                whitespace-nowrap
                                pb-1
                                text-xs
                                font-bold
                                text-slate-400
                                lg:block
                            "
                        >
                            {totalProducts || products.length}{" "}
                            item
                            {(totalProducts || products.length) === 1
                                ? ""
                                : "s"}
                        </span>

                    </div>


                    {/* =================================================
                        SEARCH
                    ================================================== */}

                    <div
                        className="
                            mb-6
                            flex
                            w-full
                            items-center
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            px-4
                            py-3.5
                            shadow-[0_8px_30px_rgba(15,23,42,.05)]
                            transition-all
                            focus-within:border-sky-300
                            focus-within:ring-4
                            focus-within:ring-sky-500/10
                        "
                    >

                        <Search
                            className="
                                mr-3
                                h-4
                                w-4
                                flex-shrink-0
                            "
                            style={{
                                color:
                                    PRIMARY_BLUE,
                            }}
                        />


                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                            placeholder="Search automotive products..."
                            className="
                                w-full
                                bg-transparent
                                text-sm
                                font-medium
                                text-slate-700
                                outline-none
                                placeholder:text-slate-400
                            "
                        />


                        {searchQuery && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearchQuery("")
                                }
                                className="
                                    ml-2
                                    rounded-md
                                    px-2
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                    text-slate-400
                                    transition-colors
                                    hover:text-sky-600
                                "
                            >
                                Clear
                            </button>

                        )}

                    </div>


                    {/* =================================================
                        CATEGORIES
                    ================================================== */}

                    <div
                        className="
                            relative
                            mb-9
                        "
                    >

                        <button
                            type="button"
                            onClick={() =>
                                scrollCategories("left")
                            }
                            className="
                                absolute
                                left-0
                                top-1/2
                                z-20
                                flex
                                h-9
                                w-9
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                                shadow-lg
                                transition-all
                                hover:bg-sky-50
                                active:scale-90
                                md:hidden
                            "
                            style={{
                                color:
                                    PRIMARY_BLUE,
                            }}
                        >
                            <ChevronLeft
                                className="h-5 w-5"
                            />
                        </button>


                        <div
                            ref={categoryRef}
                            className="
                                scrollbar-hide
                                flex
                                items-center
                                gap-2
                                overflow-x-auto
                                px-11
                                pb-2
                                md:px-0
                            "
                        >

                            {CATEGORIES.map(
                                (item) => (

                                    <button
                                        key={item}
                                        type="button"
                                        onClick={() =>
                                            setCategory(
                                                item
                                            )
                                        }
                                        className={`
                                            flex-shrink-0
                                            whitespace-nowrap
                                            rounded-full
                                            border
                                            px-5
                                            py-2.5
                                            text-[11px]
                                            font-bold
                                            uppercase
                                            tracking-wide
                                            transition-all
                                            duration-200
                                            active:scale-95

                                            ${
                                                category ===
                                                item
                                                    ? "border-transparent text-white shadow-lg"
                                                    : "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600"
                                            }
                                        `}
                                        style={
                                            category ===
                                            item
                                                ? {
                                                      backgroundColor:
                                                          PRIMARY_BLUE,
                                                  }
                                                : undefined
                                        }
                                    >
                                        {item}
                                    </button>

                                )
                            )}

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                scrollCategories(
                                    "right"
                                )
                            }
                            className="
                                absolute
                                right-0
                                top-1/2
                                z-20
                                flex
                                h-9
                                w-9
                                -translate-y-1/2
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                                shadow-lg
                                transition-all
                                hover:bg-sky-50
                                active:scale-90
                                md:hidden
                            "
                            style={{
                                color:
                                    PRIMARY_BLUE,
                            }}
                        >
                            <ChevronRight
                                className="h-5 w-5"
                            />
                        </button>

                    </div>


                    {/* =================================================
                        ERROR
                    ================================================== */}

                    {error && (

                        <div
                            className="
                                mb-8
                                rounded-2xl
                                border
                                border-red-200
                                bg-red-50
                                p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >

                                <AlertCircle
                                    className="
                                        mt-0.5
                                        h-5
                                        w-5
                                        flex-shrink-0
                                        text-red-500
                                    "
                                />


                                <div className="flex-1">

                                    <h3
                                        className="
                                            text-sm
                                            font-bold
                                            text-red-700
                                        "
                                    >
                                        Unable to load products
                                    </h3>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-red-600
                                        "
                                    >
                                        {error}
                                    </p>


                                    <button
                                        type="button"
                                        onClick={
                                            retryProducts
                                        }
                                        className="
                                            mt-4
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            bg-red-600
                                            px-4
                                            py-2.5
                                            text-[10px]
                                            font-extrabold
                                            uppercase
                                            tracking-wider
                                            text-white
                                            transition-all
                                            hover:bg-red-700
                                            active:scale-95
                                        "
                                    >

                                        <RefreshCw
                                            className="
                                                h-3.5
                                                w-3.5
                                            "
                                        />

                                        Try Again

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        INITIAL LOADING
                    ================================================== */}

                    {loading ? (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-6
                                sm:grid-cols-2
                                lg:grid-cols-4
                            "
                        >

                            {Array.from({
                                length: 8,
                            }).map((_, index) => (

                                <div
                                    key={index}
                                    className="
                                        h-[380px]
                                        animate-pulse
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-white
                                    "
                                >

                                    <div
                                        className="
                                            h-56
                                            rounded-t-2xl
                                            bg-slate-100
                                        "
                                    />

                                    <div className="p-5">

                                        <div
                                            className="
                                                h-4
                                                w-3/4
                                                rounded
                                                bg-slate-100
                                            "
                                        />

                                        <div
                                            className="
                                                mt-3
                                                h-3
                                                w-1/2
                                                rounded
                                                bg-slate-100
                                            "
                                        />

                                        <div
                                            className="
                                                mt-6
                                                h-10
                                                w-full
                                                rounded-xl
                                                bg-slate-100
                                            "
                                        />

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : products.length > 0 ? (

                        <>
                            {/* =========================================
                                PRODUCT GRID
                            ========================================== */}

                            <div
                                className="
                                    grid
                                    grid-cols-1
                                    gap-6
                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                "
                            >

                                {products.map(
                                    (
                                        product,
                                        index
                                    ) => (

                                        <React.Fragment
                                            key={
                                                product.id
                                            }
                                        >

                                            <ProductCard
                                                product={
                                                    product
                                                }
                                                flipped={
                                                    flippedId ===
                                                    product.id
                                                }
                                                animationDelay={
                                                    Math.min(
                                                        index,
                                                        7
                                                    ) *
                                                    60
                                                }
                                                onFlip={() =>
                                                    handleCardClick(
                                                        product.id
                                                    )
                                                }
                                            />

                                        </React.Fragment>

                                    )
                                )}

                            </div>


                            {/* =========================================
                                LOAD MORE
                            ========================================== */}

                            {hasMore && (

                                <div
                                    className="
                                        mt-12
                                        flex
                                        justify-center
                                    "
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            loadMoreProducts
                                        }
                                        disabled={
                                            loadingMore
                                        }
                                        className="
                                            inline-flex
                                            min-w-[180px]
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-xl
                                            px-7
                                            py-3.5
                                            text-[11px]
                                            font-extrabold
                                            uppercase
                                            tracking-wider
                                            text-white
                                            shadow-lg
                                            transition-all
                                            hover:-translate-y-0.5
                                            active:scale-95
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                        "
                                        style={{
                                            backgroundColor:
                                                PRIMARY_BLUE,
                                        }}
                                    >

                                        {loadingMore ? (

                                            <>
                                                <Loader2
                                                    className="
                                                        h-4
                                                        w-4
                                                        animate-spin
                                                    "
                                                />

                                                Loading...

                                            </>

                                        ) : (

                                            <>
                                                Load More
                                            </>
                                        )}

                                    </button>

                                </div>

                            )}


                            {!hasMore &&
                                products.length >=
                                    INITIAL_LIMIT && (

                                    <div
                                        className="
                                            mt-12
                                            text-center
                                        "
                                    >

                                        <p
                                            className="
                                                text-xs
                                                font-semibold
                                                text-slate-400
                                            "
                                        >
                                            All products loaded
                                        </p>

                                    </div>

                                )}

                        </>

                    ) : (

                        /* =============================================
                           EMPTY STATE
                        ============================================== */

                        <div
                            className="
                                fade-up
                                rounded-2xl
                                border
                                border-slate-200
                                bg-white
                                py-20
                                text-center
                                shadow-sm
                            "
                        >

                            <Search
                                className="
                                    mx-auto
                                    mb-4
                                    h-10
                                    w-10
                                    text-slate-300
                                "
                            />


                            <h3
                                className="
                                    text-sm
                                    font-extrabold
                                    uppercase
                                    tracking-wide
                                    text-slate-500
                                "
                            >
                                No products found
                            </h3>


                            <p
                                className="
                                    mt-2
                                    text-xs
                                    font-medium
                                    text-slate-400
                                "
                            >
                                Try another search or category.
                            </p>


                            <button
                                type="button"
                                onClick={
                                    clearFilters
                                }
                                className="
                                    mt-5
                                    rounded-xl
                                    px-6
                                    py-3
                                    text-[10px]
                                    font-extrabold
                                    uppercase
                                    tracking-wider
                                    text-white
                                    shadow-lg
                                    transition-all
                                    hover:-translate-y-0.5
                                    active:scale-95
                                "
                                style={{
                                    backgroundColor:
                                        PRIMARY_BLUE,
                                }}
                            >
                                Clear Filters
                            </button>

                        </div>

                    )}

                </section>

            </div>


            {/* =====================================================
                FLOATING WHATSAPP
            ====================================================== */}

            <button
                type="button"
                onClick={() =>
                    openWhatsApp({
                        name: "Automotive Product",
                        category:
                            category === "All"
                                ? "Automotive"
                                : category,
                        price: "Please ask",
                    })
                }
                className="
                    whatsapp-button
                    fixed
                    bottom-6
                    right-6
                    z-50
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-full
                    bg-white
                    shadow-[0_10px_35px_rgba(15,23,42,.18)]
                    transition-all
                    hover:-translate-y-1
                    md:bottom-8
                    md:right-8
                "
                aria-label="Contact us on WhatsApp"
            >

                <img
                    src={whatsappIcon}
                    alt="WhatsApp"
                    className="
                        h-8
                        w-8
                        object-contain
                    "
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
                    rootMargin:
                        "0px 0px -40px 0px",
                }
            );


        observer.observe(element);


        return () =>
            observer.disconnect();

    }, []);


    return (

        <div
            ref={itemRef}
            className={`
                group
                relative
                flex
                items-center
                gap-4
                rounded-xl
                px-5
                py-6
                transition-all
                duration-500
                ease-out
                md:px-7
                md:py-5

                ${
                    isVisible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-6 opacity-0"
                }
            `}
            style={{
                transitionDelay:
                    `${index * 120}ms`,
            }}
        >

            <div
                className="
                    relative
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-sky-100
                    bg-gradient-to-br
                    from-sky-50
                    via-white
                    to-blue-50
                    shadow-sm
                    transition-all
                    duration-500
                    group-hover:scale-110
                    group-hover:rotate-3
                    group-hover:border-sky-200
                "
            >

                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-br
                        from-sky-500/10
                        to-blue-400/10
                        opacity-0
                        transition-opacity
                        duration-500
                        group-hover:opacity-100
                    "
                />


                <div
                    className="
                        relative
                        text-sky-600
                        transition-transform
                        duration-500
                        group-hover:scale-110
                    "
                >
                    {icon}
                </div>

            </div>


            <div className="min-w-0">

                <h3
                    className="
                        text-[13px]
                        font-extrabold
                        leading-tight
                        tracking-tight
                        text-slate-900
                        transition-colors
                        duration-300
                        group-hover:text-sky-600
                    "
                >
                    {title}
                </h3>


                <p
                    className="
                        mt-1.5
                        text-[10px]
                        font-medium
                        leading-relaxed
                        text-slate-500
                    "
                >
                    {description}
                </p>

            </div>

        </div>
    );
}

