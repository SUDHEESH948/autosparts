import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import PRODUCTS from "../data/products";

export default function Home() {
    return (
        <>
            <Hero />
            <section className="px-6 py-16">
                <div className="mx-auto max-w-sm">
                    <ProductCard product={PRODUCTS[0]} />
                </div>
            </section>
        </>
    );
}