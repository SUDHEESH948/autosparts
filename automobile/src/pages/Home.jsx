import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import PRODUCTS from "../data/products";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <>
            <Hero />

            <section className="bg-slate-50 px-6 py-16">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex items-end justify-between">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-widest text-[#0084D1]">
                                Premium Parts
                            </span>
                            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">
                                Featured Products
                            </h2>
                        </div>
                        <Link
                            to="/products"
                            className="text-xs font-bold uppercase tracking-wider text-[#0084D1] transition-colors hover:text-sky-700 hover:underline"
                        >
                            View All Products →
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {PRODUCTS.map((item, index) => (
                            <div key={item.id || index} className="h-[420px]">
                                <ProductCard product={item} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}