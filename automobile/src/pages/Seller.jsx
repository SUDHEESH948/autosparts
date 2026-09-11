import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  MoreHorizontal,
  Package,
  Boxes,
  AlertTriangle,
  Star,
  Upload,
  X,
  Image as ImageIcon,
  Barcode,
  Car,
  CheckCircle2,
  ChevronDown,
  Grid3X3,
  List,
  Save,
  Tag,
  IndianRupee,
  Hash,
  CalendarDays,
  ShieldCheck,
  MessageCircle,
  MapPin,
  Loader2,
} from "lucide-react";
import { ProductService } from "../api/api";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22600%22%20height%3D%22450%22%20viewBox%3D%220%200%20600%20450%22%3E%3Crect%20fill%3D%22%23f1f5f9%22%20width%3D%22600%22%20height%3D%22450%22%2F%3E%3Ccircle%20cx%3D%22300%22%20cy%3D%22200%22%20r%3D%2245%22%20fill%3D%22%23cbd5e1%22%2F%3E%3Cpath%20d%3D%22M260%20270h80v12h-80zm-30%2024h140v8H230z%22%20fill%3D%22%2394a3b8%22%2F%3E%3Ctext%20fill%3D%22%2364748b%22%20font-family%3D%22system-ui%2C%20sans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20x%3D%2250%25%22%20y%3D%2275%25%22%20text-anchor%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E";

const getSellerImageUrl = (img) => {
  if (!img || typeof img !== "string" || img.includes("example.com") || img.includes("via.placeholder.com")) {
    return FALLBACK_IMAGE;
  }
  return img;
};

const CATEGORIES = [
  "All Categories",
  "Brakes",
  "Engine",
  "Lighting",
  "Suspension",
  "Electrical",
  "Maintenance",
  "Wheels",
  "Accessories",
  "Exhaust",
];

const PRODUCT_TYPES = ["Item", "Service", "File", "Dynamic"];

const VEHICLE_MAKES = [
  "Universal",
  "Toyota",
  "Honda",
  "Hyundai",
  "Kia",
  "Maruti Suzuki",
  "Mahindra",
  "Tata",
  "Ford",
  "Volkswagen",
  "Skoda",
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Nissan",
  "Renault",
];

const EMPTY_FORM = {
  name: "",
  category: "Brakes",
  brand: "",
  partNumber: "",
  barcode: "",
  price: "",
  stock: "",
  type: "Item",
  description: "",
  vehicleMake: "Universal",
  vehicleModel: "",
  vehicleYear: "",
  image: "",
  imageFile: null,
};

export default function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [viewMode, setViewMode] = useState("grid");

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [imagePreview, setImagePreview] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const fileInputRef = useRef(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAll(1, 50);
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to load products from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const search = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.brand?.toLowerCase().includes(search) ||
        product.partNumber?.toLowerCase().includes(search) ||
        product.barcode?.toLowerCase().includes(search) ||
        product.vehicleMake?.toLowerCase().includes(search) ||
        product.vehicleModel?.toLowerCase().includes(search);

      const matchesCategory =
        category === "All Categories" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, category]);

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.stock > 0).length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockProducts = products.filter((p) => Number(p.stock) === 0).length;

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImagePreview("");
    setShowProductModal(true);
  };

  const openEditProduct = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      category: product.category || "Brakes",
      brand: product.brand || "",
      partNumber: product.partNumber || "",
      barcode: product.barcode || "",
      price: product.price ?? "",
      stock: product.stock ?? "",
      type: product.type || "Item",
      description: product.description || "",
      vehicleMake: product.vehicleMake || "Universal",
      vehicleModel: product.vehicleModel || "",
      vehicleYear: product.vehicleYear || "",
      image: product.image || "",
      imageFile: null,
    });
    setImagePreview(product.image || "");
    setShowProductModal(true);
    setOpenMenu(null);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setImagePreview("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setImagePreview(URL.createObjectURL(file));
    setForm((prev) => ({ ...prev, imageFile: file }));
  };

  const removeImage = () => {
    setImagePreview("");
    setForm((prev) => ({ ...prev, image: "", imageFile: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) return alert("Product name is required.");
    if (!form.brand.trim()) return alert("Brand is required.");
    if (!form.partNumber.trim()) return alert("Part Number is required.");
    if (!form.price || Number(form.price) < 0) return alert("Enter a valid price.");
    if (form.stock === "" || Number(form.stock) < 0) return alert("Enter a valid stock quantity.");

    try {
      setSubmitting(true);

      let finalImageUrl = form.image;
      if (form.imageFile) {
        finalImageUrl = await ProductService.uploadImage(form.imageFile);
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        brand: form.brand.trim(),
        partNumber: form.partNumber.trim(),
        barcode: form.barcode.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        type: form.type,
        description: form.description.trim(),
        vehicleMake: form.vehicleMake,
        vehicleModel: form.vehicleModel.trim(),
        vehicleYear: form.vehicleYear.trim(),
        image: finalImageUrl || "",
        active: true,
      };

      if (editingProduct) {
        const id = editingProduct._id || editingProduct.id;
        await ProductService.update(id, payload);
      } else {
        await ProductService.create(payload);
      }

      await loadProducts();
      closeProductModal();
    } catch (err) {
      console.error(err);
      alert(err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (productId) => {
    const target = products.find((p) => (p._id || p.id) === productId);
    if (!window.confirm(`Delete "${target?.name || "this item"}"?`)) return;

    try {
      await ProductService.delete(productId);
      setProducts((prev) => prev.filter((item) => (item._id || item.id) !== productId));
      setOpenMenu(null);
    } catch (err) {
      console.error(err);
      alert(err.message || "Could not delete product.");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#eef8ff] text-slate-900 antialiased"
      style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
    >
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e2231a] text-white shadow-lg shadow-red-100">
              <Car size={21} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight">Shoppy</div>
              <div className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400 sm:block">
                Seller Center
              </div>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-5 py-2 text-xs font-semibold text-slate-500 md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            shoppy.gg/seller/dashboard
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <div className="text-sm font-bold">Kristin Watson</div>
              <div className="text-xs text-slate-400">Seller Account</div>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 font-black text-white">
              K
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600">
              <ShieldCheck size={15} /> Seller Center
            </div>
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Product Management
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your automotive spare parts, inventory, and listings.
            </p>
          </div>

          <button
            onClick={openAddProduct}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e2231a] px-5 py-3 text-sm font-black text-white shadow-lg shadow-red-100 transition hover:-translate-y-0.5 hover:bg-[#c91d16]"
          >
            <Plus size={19} /> Add Product
          </button>
        </div>

        {/* Profile Card */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-black text-white">
                  K
                </div>
                <span className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-4 border-white bg-emerald-500" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black">Kristin Watson</h2>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-600">
                    <ShieldCheck size={13} /> Verified Seller
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-600 font-bold">● Online</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={13} /> Dubai, UAE
                  </span>
                  <span>•</span>
                  <span>Seller since 2012</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-xl bg-amber-50 px-3 py-2 text-sm font-black text-amber-700">
                <Star size={16} className="fill-amber-400 text-amber-400" /> 4.8
              </div>
              <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50">
                <MessageCircle size={16} /> Storefront
              </button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-5">
          <DashboardStat icon={<Package size={19} />} title="Total Products" value={totalProducts} description="All listings" />
          <DashboardStat icon={<CheckCircle2 size={19} />} title="Active" value={activeProducts} description="Available products" iconClass="bg-emerald-50 text-emerald-600" />
          <DashboardStat icon={<AlertTriangle size={19} />} title="Low Stock" value={lowStockProducts} description="5 units or less" iconClass="bg-amber-50 text-amber-600" />
          <DashboardStat icon={<Boxes size={19} />} title="Out of Stock" value={outOfStockProducts} description="Needs restocking" iconClass="bg-red-50 text-red-600" />
          <DashboardStat icon={<Star size={19} />} title="Feedback" value="217" description="Customer reviews" iconClass="bg-blue-50 text-blue-600" />
        </section>

        {/* Product Table / Grid Area */}
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-black">
                  My Products
                  <span className="ml-2 text-sm font-bold text-slate-400">
                    {filteredProducts.length}
                  </span>
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Synchronized directly with your MongoDB database.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`rounded-xl border p-2.5 ${viewMode === "grid" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-400"}`}
                >
                  <Grid3X3 size={17} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`rounded-xl border p-2.5 ${viewMode === "list" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 text-slate-400"}`}
                >
                  <List size={17} />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 md:flex-row">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search product, Part #, barcode, brand or vehicle..."
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="relative md:w-56">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold outline-none focus:border-blue-400"
                >
                  {CATEGORIES.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-5">
            {loading ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
                <Loader2 className="animate-spin text-blue-600" size={32} />
                <p className="text-sm font-medium text-slate-500">Loading catalog from MongoDB...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <EmptyProducts onAdd={openAddProduct} />
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => {
                  const id = product._id || product.id;
                  return (
                    <SellerProductCard
                      key={id}
                      product={product}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                      onEdit={openEditProduct}
                      onDelete={deleteProduct}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const id = product._id || product.id;
                  return (
                    <SellerProductList
                      key={id}
                      product={product}
                      openMenu={openMenu}
                      setOpenMenu={setOpenMenu}
                      onEdit={openEditProduct}
                      onDelete={deleteProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Product Modal */}
      {showProductModal && (
        <ProductModal
          form={form}
          updateForm={updateForm}
          editingProduct={editingProduct}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
          onClose={closeProductModal}
          onSubmit={saveProduct}
          submitting={submitting}
        />
      )}
    </div>
  );
}

function DashboardStat({ icon, title, value, description, iconClass = "bg-slate-100 text-slate-700" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>{icon}</div>
      <div className="mt-4 text-2xl font-black">{value}</div>
      <div className="mt-1 text-sm font-bold text-slate-700">{title}</div>
      <div className="mt-1 text-[11px] text-slate-400">{description}</div>
    </div>
  );
}

function SellerProductCard({ product, openMenu, setOpenMenu, onEdit, onDelete }) {
  const id = product._id || product.id;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = Number(product.stock) === 0;

  return (
    <article className="group relative overflow-visible rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/40">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-slate-100">
        <img
          src={getSellerImageUrl(product.image)}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-black uppercase text-slate-700 shadow-sm">
            {product.type || "Item"}
          </span>
          {outOfStock && (
            <span className="rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-black text-white">
              Out of Stock
            </span>
          )}
          {lowStock && (
            <span className="rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-black text-white">
              Low Stock
            </span>
          )}
        </div>

        <div className="absolute right-3 top-3">
          <button
            onClick={() => setOpenMenu(openMenu === id ? null : id)}
            className="rounded-lg bg-white/95 p-2 text-slate-500 shadow-sm hover:text-slate-900"
          >
            <MoreHorizontal size={17} />
          </button>
          {openMenu === id && (
            <ProductMenu onEdit={() => onEdit(product)} onDelete={() => onDelete(id)} />
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
            {product.category}
          </span>
          <span className="text-[10px] font-bold text-slate-400">
            Part #: {product.partNumber}
          </span>
        </div>

        <h3 className="mt-2 line-clamp-1 text-base font-black">{product.name}</h3>
        <p className="mt-1 text-xs font-semibold text-slate-400">{product.brand}</p>

        <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <Car size={14} />
          <span className="truncate">
            {product.vehicleMake} {product.vehicleModel}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between border-t border-slate-100 pt-4">
          <div>
            <div className="flex items-center gap-1 text-lg font-black">
              <IndianRupee size={16} />
              {Number(product.price).toLocaleString("en-IN")}
            </div>
            <div
              className={`mt-1 text-[10px] font-bold ${lowStock ? "text-amber-600" : outOfStock ? "text-red-600" : "text-emerald-600"
                }`}
            >
              {product.stock} units in stock
            </div>
          </div>

          <button
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-600"
          >
            <Edit3 size={13} /> Edit
          </button>
        </div>
      </div>
    </article>
  );
}

function SellerProductList({ product, openMenu, setOpenMenu, onEdit, onDelete }) {
  const id = product._id || product.id;

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-3 transition hover:border-blue-200 hover:shadow-md sm:flex-row">
      <div className="h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-36">
        <img
          src={getSellerImageUrl(product.image)}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600">
              {product.category}
            </span>
            <h3 className="mt-1 text-base font-black">{product.name}</h3>
            <p className="mt-1 text-xs text-slate-400">
              {product.brand} · Part #: {product.partNumber}
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Car size={13} /> {product.vehicleMake} {product.vehicleModel}
              </span>
              {product.barcode && (
                <span className="flex items-center gap-1">
                  <Barcode size={13} /> {product.barcode}
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setOpenMenu(openMenu === id ? null : id)}
              className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900"
            >
              <MoreHorizontal size={18} />
            </button>
            {openMenu === id && (
              <ProductMenu onEdit={() => onEdit(product)} onDelete={() => onDelete(id)} />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-lg font-black">
              ₹{Number(product.price).toLocaleString("en-IN")}
            </span>
            <span className="ml-3 text-xs font-bold text-emerald-600">
              {product.stock} in stock
            </span>
          </div>

          <button
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-blue-600"
          >
            <Edit3 size={14} /> Edit Product
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductMenu({ onEdit, onDelete }) {
  return (
    <div className="absolute right-0 top-11 z-50 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
      <button
        onClick={onEdit}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-slate-600 hover:bg-slate-50"
      >
        <Edit3 size={14} /> Edit
      </button>
      <button
        onClick={onDelete}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-bold text-red-600 hover:bg-red-50"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );
}

function EmptyProducts({ onAdd }) {
  return (
    <div className="flex min-h-[380px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
        <Package size={30} />
      </div>
      <h3 className="mt-5 text-lg font-black">No products found</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        No records match your filters or your database is empty.
      </p>
      <button
        onClick={onAdd}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-blue-600"
      >
        <Plus size={17} /> Add Product
      </button>
    </div>
  );
}

function ProductModal({
  form,
  updateForm,
  editingProduct,
  imagePreview,
  fileInputRef,
  onImageUpload,
  onRemoveImage,
  onClose,
  onSubmit,
  submitting,
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-5"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              {editingProduct ? <Edit3 size={17} /> : <Plus size={18} />}
            </div>
            <div>
              <h2 className="text-lg font-black sm:text-xl">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-xs text-slate-400">
                Data is stored directly in MongoDB cluster.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 p-5 sm:p-6 lg:grid-cols-[300px_1fr]">
            {/* Image Upload Area */}
            <div>
              <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                Product Image
              </label>
              <p className="mt-1 text-xs text-slate-400">
                Uploaded securely to Cloudinary (Max 5MB)
              </p>

              <div className="mt-3">
                {imagePreview ? (
                  <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                    <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={onRemoveImage}
                      className="absolute right-3 top-3 rounded-lg bg-white p-2 text-red-500 shadow-lg hover:bg-red-50"
                    >
                      <X size={17} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-blue-300 hover:bg-blue-50/50"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm">
                      <ImageIcon size={25} />
                    </div>
                    <span className="mt-4 text-sm font-bold text-slate-600">Choose File</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onImageUpload}
                  className="hidden"
                />
              </div>

              <div className="mt-6">
                <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Product Type
                </label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {PRODUCT_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => updateForm("type", type)}
                      className={`rounded-xl border px-3 py-2.5 text-xs font-bold ${form.type === type
                          ? "border-blue-500 bg-blue-50 text-blue-600"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inputs Area */}
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                  label="Product Name"
                  required
                  icon={<Tag size={15} />}
                  value={form.name}
                  onChange={(v) => updateForm("name", v)}
                  placeholder="e.g. Premium Brake Pad Set"
                />
                <FormInput
                  label="Brand"
                  required
                  icon={<ShieldCheck size={15} />}
                  value={form.brand}
                  onChange={(v) => updateForm("brand", v)}
                  placeholder="e.g. Bosch"
                />
                <FormSelect
                  label="Category"
                  value={form.category}
                  onChange={(v) => updateForm("category", v)}
                  options={CATEGORIES.filter((c) => c !== "All Categories")}
                />
                <FormInput
                  label="Part Number"
                  required
                  icon={<Hash size={15} />}
                  value={form.partNumber}
                  onChange={(v) => updateForm("partNumber", v)}
                  placeholder="e.g. BRK-BOS-001"
                />
                <FormInput
                  label="Barcode"
                  icon={<Barcode size={15} />}
                  value={form.barcode}
                  onChange={(v) => updateForm("barcode", v)}
                  placeholder="e.g. 8901234567001"
                />
                <FormInput
                  label="Price (INR)"
                  required
                  type="number"
                  icon={<IndianRupee size={15} />}
                  value={form.price}
                  onChange={(v) => updateForm("price", v)}
                  placeholder="0"
                />
                <FormInput
                  label="Stock Quantity"
                  required
                  type="number"
                  icon={<Boxes size={15} />}
                  value={form.stock}
                  onChange={(v) => updateForm("stock", v)}
                  placeholder="0"
                />
                <FormInput
                  label="Compatible Model Year"
                  icon={<CalendarDays size={15} />}
                  value={form.vehicleYear}
                  onChange={(v) => updateForm("vehicleYear", v)}
                  placeholder="e.g. 2018 - 2024"
                />
              </div>

              {/* Compatibility Box */}
              <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600">
                    <Car size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black">Vehicle Compatibility</h3>
                    <p className="text-[10px] text-slate-400">
                      Vehicle details mapped directly to MongoDB schema.
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormSelect
                    label="Vehicle Make"
                    value={form.vehicleMake}
                    onChange={(v) => updateForm("vehicleMake", v)}
                    options={VEHICLE_MAKES}
                  />
                  <FormInput
                    label="Vehicle Model"
                    icon={<Car size={15} />}
                    value={form.vehicleModel}
                    onChange={(v) => updateForm("vehicleModel", v)}
                    placeholder="e.g. Innova Crysta"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-black uppercase tracking-wide text-slate-500">
                  Product Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                  placeholder="Describe specifications, material, compatibility notes..."
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <AlertTriangle size={17} className="mt-0.5 shrink-0 text-amber-500" />
                <p className="text-xs leading-5 text-amber-700">
                  <strong>Part Number is unique:</strong> The backend checks for duplicate part numbers before saving.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#e2231a] px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-100 hover:bg-[#c91d16] disabled:opacity-50"
            >
              {submitting ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
              {editingProduct ? "Save Changes" : "Publish Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FormInput({ label, value, onChange, placeholder, icon, required = false, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-wide text-slate-500">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative mt-2">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          min={type === "number" ? "0" : undefined}
          className={`h-11 w-full rounded-xl border border-slate-200 bg-white pr-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 ${icon ? "pl-10" : "px-3"
            }`}
        />
      </div>
    </div>
  );
}

function FormSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</label>
      <div className="relative mt-2">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 pr-10 text-sm font-medium outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
        >
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
    </div>
  );
}