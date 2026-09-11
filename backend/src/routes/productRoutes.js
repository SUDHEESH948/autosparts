
const express = require("express");
const multer = require("multer");

const router = express.Router();

const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
} = require("../controllers/productController");

/* =====================================================
   MULTER
   In-memory image upload
===================================================== */

const upload = multer({
    storage: multer.memoryStorage(),

    fileFilter: (
        req,
        file,
        callback
    ) => {
        if (
            file.mimetype &&
            file.mimetype.startsWith(
                "image/"
            )
        ) {
            callback(null, true);
        } else {
            callback(
                new Error(
                    "Only image files are allowed"
                )
            );
        }
    },

    limits: {
        fileSize:
            5 * 1024 * 1024,
    },
});


/* =====================================================
   GET PRODUCTS

   GET /api/products
   GET /api/products?page=1&limit=10
===================================================== */

router.get(
    "/",
    getProducts
);


/* =====================================================
   UPLOAD PRODUCT IMAGE

   POST /api/products/upload

   IMPORTANT:
   This must be before /:id
===================================================== */

router.post(
    "/upload",
    upload.single("image"),
    uploadProductImage
);


/* =====================================================
   GET SINGLE PRODUCT

   GET /api/products/:id
===================================================== */

router.get(
    "/:id",
    getProductById
);


/* =====================================================
   CREATE PRODUCT

   POST /api/products
===================================================== */

router.post(
    "/",
    createProduct
);


/* =====================================================
   UPDATE PRODUCT

   PUT /api/products/:id
===================================================== */

router.put(
    "/:id",
    updateProduct
);


/* =====================================================
   DELETE PRODUCT

   DELETE /api/products/:id
===================================================== */

router.delete(
    "/:id",
    deleteProduct
);


/* =====================================================
   MULTER ERROR HANDLER
===================================================== */

router.use(
    (error, req, res, next) => {
        if (
            error instanceof
            multer.MulterError
        ) {
            return res.status(400).json({
                success: false,
                message:
                    error.message,
            });
        }

        if (
            error?.message ===
            "Only image files are allowed"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    error.message,
            });
        }

        next(error);
    }
);


module.exports = router;

