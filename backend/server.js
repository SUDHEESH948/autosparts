require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./src/config/db");
const productRoutes = require("./src/routes/productRoutes");
const authRoutes = require("./src/routes/authRoutes");
const createDefaultUser = require("./src/seed/defaultUser");

const app = express();

/* =====================================================
   DATABASE
===================================================== */

connectDB()
    .then(async () => {
        console.log("MongoDB connected successfully");

        // Create default seller if it doesn't exist
        await createDefaultUser();
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });

/* =====================================================
   CORS
===================================================== */

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow Postman, curl, mobile apps and
            // server-to-server requests
            if (!origin) {
                return callback(null, true);
            }

            // Allow configured origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow Vercel deployments
            if (origin.endsWith(".vercel.app")) {
                return callback(null, true);
            }

            return callback(
                new Error("CORS origin not allowed")
            );
        },

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS",
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization",
        ],

        credentials: true,
    })
);

/* =====================================================
   BODY PARSER
===================================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================================
   REQUEST LOGGER
===================================================== */

app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
    );

    next();
});

/* =====================================================
   HEALTH CHECK
===================================================== */

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Ezin Zahan Spare Parts API is running",
        status: "OK",
    });
});

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "API is healthy",
        service: "Ezin Zahan Spare Parts",
        timestamp: new Date().toISOString(),
    });
});

/* =====================================================
   AUTH ROUTES
===================================================== */

app.use("/api/auth", authRoutes);

/* =====================================================
   PRODUCT ROUTES
===================================================== */

app.use("/api/products", productRoutes);

/* =====================================================
   404
===================================================== */

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
        path: req.originalUrl,
    });
});

/* =====================================================
   ERROR HANDLER
===================================================== */

app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);

    if (err.message === "CORS origin not allowed") {
        return res.status(403).json({
            success: false,
            message: "CORS origin not allowed",
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

/* =====================================================
   SERVER
===================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log("==========================================");
    console.log(" Ezin Zahan Spare Parts Backend");
    console.log("==========================================");
    console.log(` Server: http://localhost:${PORT}`);
    console.log(` Login:  http://localhost:${PORT}/api/auth/login`);
    console.log(` Products: http://localhost:${PORT}/api/products`);
    console.log("==========================================");
});