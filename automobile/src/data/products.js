import BrakePad from "../assets/BrakePad.png";
import AirFilter from "../assets/AirFilte.png";
import led from "../assets/led.png";

const PRODUCTS = [
    {
        id: 1,
        name: "Premium Brake Pad Set",
        category: "Brakes",
        price: 89,
        image: BrakePad,
        description:
            "High-performance brake pads designed for reliable stopping power and long-lasting durability.",
    },
    {
        id: 2,
        name: "Performance Air Filter",
        category: "Engine",
        price: 49,
        image: AirFilter,
        description:
            "Premium air filter that improves airflow and helps your engine perform efficiently.",
    },
    {
        id: 3,
        name: "LED Headlight Kit",
        category: "Lighting",
        price: 129,
        image: led,
        description:
            "Bright and energy-efficient LED headlights with improved visibility and modern styling.",
    },
];

export default PRODUCTS;