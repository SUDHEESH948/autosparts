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
    brand: "Brembo",
    partNumber: "BP-001",
    stock: 25,
    description:
      "High-performance brake pads designed for reliable stopping power and long-lasting durability.",
  },
  {
    id: 2,
    name: "Performance Air Filter",
    category: "Engine",
    price: 49,
    image: AirFilter,
    brand: "K&N",
    partNumber: "AF-101",
    stock: 40,
    description:
      "Premium air filter that improves airflow and helps your engine perform efficiently.",
  },
  {
    id: 3,
    name: "LED Headlight Kit",
    category: "Lighting",
    price: 129,
    image: led,
    brand: "OSRAM",
    partNumber: "LED-001",
    stock: 18,
    description:
      "Bright and energy-efficient LED headlights with improved visibility and modern styling.",
  },
];

export default PRODUCTS;
