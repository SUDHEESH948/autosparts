const RAW_API_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL) ||
  (typeof process !== "undefined" && process.env && (process.env.REACT_APP_API_URL || process.env.VITE_API_URL)) ||
  "https://autosparts.onrender.com";

const API_BASE = `${RAW_API_URL.replace(/\/+$/, "")}/api/products`;

export const ProductService = {
  // GET /api/products?page=1&limit=50
  async getAll(page = 1, limit = 50) {
    const res = await fetch(`${API_BASE}?page=${page}&limit=${limit}`);
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to load products");
    }
    return data;
  },

  // POST /api/products/upload (Cloudinary upload)
  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Image upload failed");
    }
    return data.imageUrl;
  },

  // POST /api/products (JSON body)
  async create(payload) {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to create product");
    }
    return data;
  },

  // PUT /api/products/:id (JSON body)
  async update(id, payload) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to update product");
    }
    return data;
  },

  // DELETE /api/products/:id
  async delete(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to delete product");
    }
    return data;
  },
};

export default ProductService;