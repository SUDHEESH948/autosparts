import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import INITIAL_PRODUCTS from "../data/products";
import { ProductService } from "../api/api";
import { subscribeToProductsChanged } from "../utils/productSync";

export default function Home() {
    const [products, setProducts] = useState(INITIAL_PRODUCTS);

    const loadFeatured = async () => {
        try {
            const data = await ProductService.getAll(1, 6);
            if (data?.products && data.products.length > 0) {
                setProducts(data.products);
            }
        } catch {
            // Fallback to initial local products
        }
    };

    useEffect(() => {
        loadFeatured();

        const unsubscribe = subscribeToProductsChanged(() => {
            loadFeatured();
        });

        const handleFocus = () => {
            if (document.visibilityState === "visible") {
                loadFeatured();
            }
        };

        window.addEventListener("focus", handleFocus);
        document.addEventListener("visibilitychange", handleFocus);

        return () => {
            unsubscribe();
            window.removeEventListener("focus", handleFocus);
            document.removeEventListener("visibilitychange", handleFocus);
        };
    }, []);

    return (
        <>
            <Hero />

            <section className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#0084D1]">
                                Top Quality Parts
                            </span>
                            <h2 className="mt-2 text-2xl font-black text-slate-900 md:text-3xl">
                                Featured Products
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            className="text-xs font-bold uppercase tracking-wider text-[#0084D1] hover:underline"
                        >
                            View All Products →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {products.slice(0, 6).map((item) => (
                            <ProductCard key={item._id || item.id} product={item} />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
