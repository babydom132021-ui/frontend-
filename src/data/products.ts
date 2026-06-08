export interface Color {
  name: string;
  hex: string;
  images?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: "Fashion Sheet" | "Trendy Outfits" | "Promotions";
  price: number;
  oldPrice?: number;
  image: string;
  rating: number;
  inStock: boolean;
  sizes: string[];
  colors: Color[];
  description: string;
  free_delivery?: boolean;
}

export const products: Product[] = [
  {
    id: "fs-01",
    name: "Tailored Wool Trench Coat",
    category: "Fashion Sheet",
    price: 389,
    oldPrice: 499,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Camel", hex: "#c19a6b" },
      { name: "Black", hex: "#171717" },
      { name: "Charcoal", hex: "#4b5563" }
    ],
    description: "An elegant, double-breasted trench coat crafted from premium virgin wool blend. Features structured shoulders and a self-tie waist belt."
  },
  {
    id: "fs-02",
    name: "Minimalist Silk Button-Down Shirt",
    category: "Fashion Sheet",
    price: 159,
    oldPrice: 199,
    image: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Ivory", hex: "#faf9f6" },
      { name: "Sage", hex: "#9ca998" },
      { name: "Midnight", hex: "#0f172a" }
    ],
    description: "Lustrous mulberry silk shirt with a relaxed silhouette, classic collar, and mother-of-pearl buttons. Perfect for effortless transition from day to night."
  },
  {
    id: "fs-03",
    name: "Ribbed Knit Maxi Dress",
    category: "Fashion Sheet",
    price: 210,
    oldPrice: 280,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    inStock: true,
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Oatmeal", hex: "#eae6df" },
      { name: "Olive", hex: "#556b2f" }
    ],
    description: "Form-fitting dress knitted from premium organic cotton and linen blend. Designed with a elegant scoop neckline and side leg slit."
  },
  {
    id: "fs-04",
    name: "Classic Cashmere Cardigan",
    category: "Fashion Sheet",
    price: 280,
    oldPrice: 350,
    image: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    inStock: true,
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cream", hex: "#fdfbf7" },
      { name: "Taupe", hex: "#b3a99f" },
      { name: "Charcoal", hex: "#3f3f46" }
    ],
    description: "Enormously soft cardigan made from 100% sustainably sourced cashmere. Featuring a v-neckline and premium horn buttons."
  },
  {
    id: "to-01",
    name: "Structured Leather Shoulder Bag",
    category: "Trendy Outfits",
    price: 320,
    oldPrice: 420,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    inStock: true,
    colors: [
      { name: "Black", hex: "#18181b" },
      { name: "Cognac", hex: "#9a3412" },
      { name: "Chalk", hex: "#f4f4f5" }
    ],
    sizes: ["One Size"],
    description: "Geometric shoulder bag structured from smooth box-calf leather. Features signature gold hardware and an adjustable shoulder strap."
  },
  {
    id: "to-02",
    name: "High-Rise Tailored Linen Trousers",
    category: "Trendy Outfits",
    price: 179,
    oldPrice: 240,
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop",
    rating: 4.6,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Flax", hex: "#e4dfd5" },
      { name: "White", hex: "#ffffff" }
    ],
    description: "Breathable heavy-weight linen trousers with structured pleats, a wide leg, and dynamic high-waist design."
  },
  {
    id: "to-03",
    name: "Classic Polished Leather Loafers",
    category: "Trendy Outfits",
    price: 245,
    oldPrice: 320,
    image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    inStock: true,
    sizes: ["36", "37", "38", "39", "40", "41"],
    colors: [
      { name: "Brushed Black", hex: "#09090b" },
      { name: "Bordeaux", hex: "#4c0519" }
    ],
    description: "Timeless slip-on loafers handmade in Italy from brushed spazzolato leather. Finished with structured stitched welts."
  },
  {
    id: "to-04",
    name: "Oversized Cotton Poplin Shirt",
    category: "Trendy Outfits",
    price: 110,
    oldPrice: 150,
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop",
    rating: 4.5,
    inStock: true,
    sizes: ["S", "M", "L"],
    colors: [
      { name: "Sky Blue", hex: "#bae6fd" },
      { name: "White", hex: "#ffffff" },
      { name: "Stripe", hex: "#cbd5e1" }
    ],
    description: "Oversized long-sleeve shirt in crisp cotton poplin. Features dropped shoulders, button cuffs, and an extended back hem."
  },
  {
    id: "pr-01",
    name: "Fine Knit Mockneck Sweater",
    category: "Promotions",
    price: 98,
    oldPrice: 180,
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    inStock: true,
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: [
      { name: "Beige Marled", hex: "#d6cfc7" },
      { name: "Navy", hex: "#1e3a8a" }
    ],
    description: "Supremely cozy mockneck knitted from extra-fine merino wool. Lightweight yet highly insulating for seasonal layering."
  },
  {
    id: "pr-02",
    name: "Premium Raw Denim Jeans",
    category: "Promotions",
    price: 120,
    oldPrice: 220,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop",
    rating: 4.7,
    inStock: true,
    sizes: ["25", "26", "27", "28", "29", "30", "31", "32"],
    colors: [
      { name: "Indigo", hex: "#1e1b4b" },
      { name: "Washed Blue", hex: "#3b82f6" }
    ],
    description: "High-waist, straight-leg denim crafted from rigid Japanese selvedge cotton. Softens beautifully and molds to your shape with wear."
  },
  {
    id: "pr-03",
    name: "Ribbed Cashmere Beanie",
    category: "Promotions",
    price: 49,
    oldPrice: 95,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop",
    rating: 4.9,
    inStock: true,
    sizes: ["One Size"],
    colors: [
      { name: "Cream", hex: "#fafaf9" },
      { name: "Gray", hex: "#71717a" },
      { name: "Black", hex: "#09090b" }
    ],
    description: "Classic ribbed knit beanie crafted from plush cashmere wool. Offers exceptional warmth and a super-soft feel."
  },
  {
    id: "pr-04",
    name: "Modern Silk Square Scarf",
    category: "Promotions",
    price: 75,
    oldPrice: 140,
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop",
    rating: 4.8,
    inStock: true,
    sizes: ["One Size"],
    colors: [
      { name: "Abstract Terracotta", hex: "#c2410c" },
      { name: "Sage Floral", hex: "#86efac" }
    ],
    description: "Lustrous square scarf printed with an elegant abstract layout. Style around your neck, in your hair, or on your favorite handbag."
  }
];
