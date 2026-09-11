import axios from "axios";

/*
|--------------------------------------------------------------------------
| API BASE URL
|--------------------------------------------------------------------------
|
| Local:
| http://localhost:5000
|
| Production:
| VITE_API_URL=https://your-backend-url.onrender.com
|
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "https://autosparts.onrender.com";

const productsApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

/*
|--------------------------------------------------------------------------
| GET PRODUCTS
|--------------------------------------------------------------------------
|
| GET /api/products
|
| Examples:
|
| /api/products?page=1&limit=10
|
| /api/products?page=1&limit=10&search=brake
|
| /api/products?page=1&limit=10&category=Brakes
|
|--------------------------------------------------------------------------
*/

export const getProducts = async ({
    page = 1,
    limit = 10,
    search = "",
    category = "",
} = {}) => {
    const params = {
        page,
        limit,
    };

    if (search && search.trim()) {
        params.search = search.trim();
    }

    if (
        category &&
        category.trim() &&
        category !== "All"
    ) {
        params.category = category.trim();
    }

    const response = await productsApi.get("/api/products", {
        params,
    });

    return response.data;
};

/*
|--------------------------------------------------------------------------
| GET SINGLE PRODUCT
|--------------------------------------------------------------------------
*/

export const getProductById = async (id) => {
    const response = await productsApi.get(
        `/api/products/${id}`
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| CREATE PRODUCT
|--------------------------------------------------------------------------
*/

export const createProduct = async (productData) => {
    const response = await productsApi.post(
        "/api/products",
        productData
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| UPDATE PRODUCT
|--------------------------------------------------------------------------
*/

export const updateProduct = async (id, productData) => {
    const response = await productsApi.put(
        `/api/products/${id}`,
        productData
    );

    return response.data;
};

/*
|--------------------------------------------------------------------------
| DELETE PRODUCT
|--------------------------------------------------------------------------
*/

export const deleteProduct = async (id) => {
    const response = await productsApi.delete(
        `/api/products/${id}`
    );

    return response.data;
};

export default productsApi;