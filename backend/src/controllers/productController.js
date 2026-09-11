
const Product = require("../models/Product");
const { uploadToCloudinary } = require("../utils/uploadImage");

/* =====================================================
   GET ALL PRODUCTS
   GET /api/products

   Query:
   ?page=1&limit=10

   Example:
   /api/products?page=1&limit=10
===================================================== */

const getProducts = async (req, res) => {
    try {
        let page = Number.parseInt(req.query.page, 10);
        let limit = Number.parseInt(req.query.limit, 10);

        // Default values
        if (!Number.isInteger(page) || page < 1) {
            page = 1;
        }

        if (!Number.isInteger(limit) || limit < 1) {
            limit = 10;
        }

        // Prevent very large requests
        if (limit > 50) {
            limit = 50;
        }

        const skip = (page - 1) * limit;

        /* -------------------------------------------------
           Only active products
        ------------------------------------------------- */

        const filter = {
            active: true,
        };

        /* -------------------------------------------------
           Category filter (ignore "All")
        ------------------------------------------------- */

        if (
            req.query.category &&
            req.query.category.trim() &&
            req.query.category.trim() !== "All"
        ) {
            const escapedCategory = req.query.category
                .trim()
                .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

            filter.category = {
                $regex: new RegExp(`^${escapedCategory}$`, "i"),
            };
        }

        /* -------------------------------------------------
           Search query filter
        ------------------------------------------------- */

        if (req.query.search && req.query.search.trim()) {
            const escapedSearch = req.query.search
                .trim()
                .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

            const searchRegex = new RegExp(escapedSearch, "i");

            filter.$or = [
                { name: searchRegex },
                { description: searchRegex },
                { brand: searchRegex },
                { partNumber: searchRegex },
                { category: searchRegex },
            ];
        }

        /* -------------------------------------------------
           Total count
        ------------------------------------------------- */

        const total = await Product.countDocuments(filter);

        /* -------------------------------------------------
           Products
        ------------------------------------------------- */

        const products = await Product.find(filter)
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit)
            .lean();

        /* -------------------------------------------------
           Pagination
        ------------------------------------------------- */

        const totalPages =
            total === 0
                ? 0
                : Math.ceil(total / limit);

        const hasMore =
            page < totalPages;

        return res.status(200).json({
            success: true,

            count: products.length,

            total,

            page,

            limit,

            totalPages,

            hasMore,

            products,
        });
    } catch (error) {
        console.error(
            "Get Products Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch products",
            products: [],
        });
    }
};


/* =====================================================
   GET SINGLE PRODUCT
   GET /api/products/:id
===================================================== */

const getProductById = async (req, res) => {
    try {
        const product =
            await Product.findOne({
                _id: req.params.id,
                active: true,
            }).lean();

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        console.error(
            "Get Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch product",
        });
    }
};


/* =====================================================
   CREATE PRODUCT(S)
   POST /api/products

   Supports:

   Single:
   {
       "name": "Brake Pad",
       "category": "Brakes",
       "price": 100
   }

   Multiple:
   [
       {
           "name": "Brake Pad",
           "category": "Brakes",
           "price": 100
       },
       {
           "name": "Oil Filter",
           "category": "Maintenance",
           "price": 50
       }
   ]
===================================================== */

const createProduct = async (req, res) => {
    try {
        const products = Array.isArray(req.body)
            ? req.body
            : [req.body];

        if (!products.length) {
            return res.status(400).json({
                success: false,
                message: "At least one product is required",
            });
        }

        /* -------------------------------------------------
           Validate products
        ------------------------------------------------- */

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            if (
                !product ||
                !product.name ||
                !product.category ||
                product.price === undefined ||
                product.price === null ||
                product.price === ""
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Product ${i + 1}: ` +
                        "Name, category and price are required",
                });
            }

            if (
                Number.isNaN(
                    Number(product.price)
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Product ${i + 1}: ` +
                        "Price must be a valid number",
                });
            }

            if (
                product.stock !== undefined &&
                product.stock !== null &&
                Number.isNaN(
                    Number(product.stock)
                )
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        `Product ${i + 1}: ` +
                        "Stock must be a valid number",
                });
            }
        }

        /* -------------------------------------------------
           Check duplicate part numbers in request
        ------------------------------------------------- */

        const partNumbers = products
            .map((product) =>
                product.partNumber
                    ? String(
                          product.partNumber
                      ).trim()
                    : ""
            )
            .filter(Boolean);

        const duplicatePartNumbers = [
            ...new Set(
                partNumbers.filter(
                    (partNumber, index) =>
                        partNumbers.indexOf(
                            partNumber
                        ) !== index
                )
            ),
        ];

        if (
            duplicatePartNumbers.length > 0
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "Duplicate part numbers found in request",
                duplicatePartNumbers,
            });
        }

        /* -------------------------------------------------
           Check existing part numbers
        ------------------------------------------------- */

        if (partNumbers.length > 0) {
            const existingProducts =
                await Product.find({
                    partNumber: {
                        $in: partNumbers,
                    },
                }).select("partNumber");

            if (
                existingProducts.length > 0
            ) {
                const existingPartNumbers =
                    existingProducts.map(
                        (product) =>
                            product.partNumber
                    );

                return res.status(409).json({
                    success: false,
                    message:
                        "One or more part numbers already exist",
                    duplicatePartNumbers:
                        existingPartNumbers,
                });
            }
        }

        /* -------------------------------------------------
           Prepare products
        ------------------------------------------------- */

        const productsToCreate =
            products.map((product) => ({
                name: String(
                    product.name
                ).trim(),

                category: String(
                    product.category
                ).trim(),

                description:
                    product.description !==
                    undefined
                        ? String(
                              product.description
                          ).trim()
                        : "",

                price: Number(
                    product.price
                ),

                image:
                    product.image !==
                    undefined
                        ? String(
                              product.image
                          ).trim()
                        : "",

                brand:
                    product.brand !==
                    undefined
                        ? String(
                              product.brand
                          ).trim()
                        : "",

                partNumber:
                    product.partNumber !==
                    undefined
                        ? String(
                              product.partNumber
                          ).trim()
                        : "",

                barcode:
                    product.barcode !==
                    undefined
                        ? String(
                              product.barcode
                          ).trim()
                        : "",

                stock:
                    product.stock !==
                        undefined &&
                    product.stock !== null
                        ? Number(
                              product.stock
                          )
                        : 0,

                type:
                    product.type !==
                    undefined
                        ? product.type
                        : "Item",

                vehicleMake:
                    product.vehicleMake !==
                    undefined
                        ? product.vehicleMake
                        : "Universal",

                vehicleModel:
                    product.vehicleModel !==
                    undefined
                        ? product.vehicleModel
                        : "",

                vehicleYear:
                    product.vehicleYear !==
                    undefined
                        ? product.vehicleYear
                        : "",

                featured:
                    product.featured === true,

                active:
                    product.active !== false,
            }));

        /* -------------------------------------------------
           Insert
        ------------------------------------------------- */

        const createdProducts =
            await Product.insertMany(
                productsToCreate,
                {
                    ordered: true,
                }
            );

        return res.status(201).json({
            success: true,

            message:
                `${createdProducts.length} product` +
                `${
                    createdProducts.length ===
                    1
                        ? ""
                        : "s"
                } created successfully`,

            count: createdProducts.length,

            products: createdProducts,
        });
    } catch (error) {
        console.error(
            "Create Product(s) Error:",
            error
        );

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "A product with this part number already exists",
                duplicatePartNumber:
                    error?.keyValue
                        ?.partNumber || null,
            });
        }

        if (
            error.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Product validation failed",

                errors: Object.values(
                    error.errors
                ).map(
                    (err) =>
                        err.message
                ),
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to create product(s)",
        });
    }
};


/* =====================================================
   UPDATE PRODUCT
   PUT /api/products/:id
===================================================== */

const updateProduct = async (req, res) => {
    try {
        const product =
            await Product.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true,
                }
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Product updated successfully",
            product,
        });
    } catch (error) {
        console.error(
            "Update Product Error:",
            error
        );

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Another product already uses this part number",
            });
        }

        return res.status(500).json({
            success: false,
            message:
                "Failed to update product",
        });
    }
};


/* =====================================================
   DELETE PRODUCT
   DELETE /api/products/:id
===================================================== */

const deleteProduct = async (req, res) => {
    try {
        const product =
            await Product.findByIdAndDelete(
                req.params.id
            );

        if (!product) {
            return res.status(404).json({
                success: false,
                message:
                    "Product not found",
            });
        }

        return res.status(200).json({
            success: true,
            message:
                "Product deleted successfully",
        });
    } catch (error) {
        console.error(
            "Delete Product Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to delete product",
        });
    }
};


/* =====================================================
   UPLOAD PRODUCT IMAGE
   POST /api/products/upload
===================================================== */

const uploadProductImage = async (
    req,
    res
) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message:
                    "No image file provided",
            });
        }

        const timestamp =
            Date.now();

        const fileName =
            `product_${timestamp}`;

        const imageUrl =
            await uploadToCloudinary(
                req.file.buffer,
                fileName
            );

        return res.status(200).json({
            success: true,
            message:
                "Image uploaded successfully",
            imageUrl,
        });
    } catch (error) {
        console.error(
            "Upload Image Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to upload image",
        });
    }
};


/* =====================================================
   EXPORTS
===================================================== */

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
};

