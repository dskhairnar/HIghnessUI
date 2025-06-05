interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  category: string;
  rating: number;
  slug: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Premium Display Panel",
    price: 299.99,
    image: "/images/products/display-1.jpg",
    shortDescription:
      "High-resolution display panel with advanced color accuracy and wide viewing angles.",
    category: "Displays",
    rating: 4.5,
    slug: "premium-display-panel",
  },
  {
    id: 2,
    name: "Touch Screen Module",
    price: 199.99,
    image: "/images/products/touch-1.jpg",
    shortDescription:
      "Responsive touch screen module with multi-touch support and anti-glare coating.",
    category: "Touch Screens",
    rating: 4.8,
    slug: "touch-screen-module",
  },
  {
    id: 3,
    name: "LCD Controller Board",
    price: 149.99,
    image: "/images/products/controller-1.jpg",
    shortDescription:
      "Advanced LCD controller board with multiple input options and high processing power.",
    category: "Controllers",
    rating: 4.2,
    slug: "lcd-controller-board",
  },
  {
    id: 4,
    name: "OLED Display Panel",
    price: 399.99,
    image: "/images/products/oled-1.jpg",
    shortDescription:
      "Ultra-thin OLED display with perfect blacks and vibrant colors.",
    category: "Displays",
    rating: 4.9,
    slug: "oled-display-panel",
  },
  {
    id: 5,
    name: "Industrial Touch Panel",
    price: 449.99,
    image: "/images/products/touch-2.jpg",
    shortDescription:
      "Rugged industrial-grade touch panel with IP65 rating and extended temperature range.",
    category: "Touch Screens",
    rating: 4.7,
    slug: "industrial-touch-panel",
  },
  {
    id: 6,
    name: "Display Driver IC",
    price: 79.99,
    image: "/images/products/driver-1.jpg",
    shortDescription:
      "High-performance display driver IC with advanced power management.",
    category: "Components",
    rating: 4.4,
    slug: "display-driver-ic",
  },
];

export const categories: Category[] = [
  {
    id: 1,
    name: "Displays",
    description: "High-quality display panels and modules",
    image: "/images/categories/displays.jpg",
    slug: "displays",
  },
  {
    id: 2,
    name: "Touch Screens",
    description: "Interactive touch screen solutions",
    image: "/images/categories/touch-screens.jpg",
    slug: "touch-screens",
  },
  {
    id: 3,
    name: "Controllers",
    description: "Display controllers and driver boards",
    image: "/images/categories/controllers.jpg",
    slug: "controllers",
  },
  {
    id: 4,
    name: "Components",
    description: "Individual display components and ICs",
    image: "/images/categories/components.jpg",
    slug: "components",
  },
];

export const featuredProducts: Product[] = products.slice(0, 4);
export const featuredCategories: Category[] = categories.slice(0, 3); 