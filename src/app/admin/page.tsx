"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Users,
  Package,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle,
  Truck,
  Clock,
  LayoutDashboard,
  Calendar,
  Settings,
  HelpCircle,
  FileText,
  Search,
  SlidersHorizontal,
  ChevronDown,
  LogOut,
  Sparkles,
  Percent,
  Shirt,
  Download,
  X,
  Upload,
  ShieldAlert,
  LogIn,
  ArrowLeft
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import AuthModal from "../../components/features/AuthModal";

interface Color {
  name: string;
  hex: string;
  images?: string[];
}

interface Product {
  id: string;
  name: string;
  category: string;
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

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface Order {
  id: string;
  customerEmail: string;
  customerName?: string;
  phone?: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Paid" | "paid";
  total: number;
  items: OrderItem[];
  deliveryLocation?: string;
  deliveryOption?: string;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  activeProducts: number;
}

const COLOR_PRESETS = [
  { name: "Camel", hex: "#c19a6b" },
  { name: "Charcoal", hex: "#4b5563" },
  { name: "Sage", hex: "#9ca998" },
  { name: "Midnight", hex: "#0f172a" },
  { name: "Oatmeal", hex: "#eae6df" },
  { name: "Olive", hex: "#556b2f" },
  { name: "Cream", hex: "#fdfbf7" },
  { name: "Taupe", hex: "#b3a99f" },
  { name: "Ivory", hex: "#faf9f6" },
  { name: "Black", hex: "#171717" },
  { name: "White", hex: "#ffffff" },
  { name: "Cognac", hex: "#9a3412" },
  { name: "Chalk", hex: "#f4f4f5" }
];

const SIZE_PRESETS = ["XS", "S", "M", "L", "XL", "XXL", "36", "37", "38", "39", "40", "41", "42", "One Size"];

const IMAGE_PRESETS = [
  {
    name: "Trench Coat",
    url: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Silk Shirt",
    url: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Knit Dress",
    url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Cardigan",
    url: "https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Shoulder Bag",
    url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Linen Trousers",
    url: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Loafers",
    url: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Poplin Shirt",
    url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Wool Sweater",
    url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Denim Jeans",
    url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Ribbed Beanie",
    url: "https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop"
  },
  {
    name: "Silk Scarf",
    url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop"
  }
];

export default function AdminDashboard() {
  const { language, setLanguage } = useLanguage();
  const { user, token, isLoading: isAuthLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<"dashboard" | "orders" | "products-fashion" | "products-trendy" | "products-promotions" | "settings" | "dashboard1">("dashboard");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, averageOrderValue: 0, activeProducts: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliverySettings, setDeliverySettings] = useState({ standardPrice: 2, expressPrice: 5 });

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Profile state
  const [adminProfile, setAdminProfile] = useState({
    name: "Erren",
    email: "erren@userflow.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
  });
  const [editProfileForm, setEditProfileForm] = useState(adminProfile);

  // Sub-states for modal form additions
  const [imageTab, setImageTab] = useState<"upload" | "preset" | "url">("upload");
  const [customColorName, setCustomColorName] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#c19a6b");
  const [customSize, setCustomSize] = useState("");

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    category: string;
    price: string;
    oldPrice: string;
    image: string;
    description: string;
    sizes: string[];
    colors: Color[];
    inStock: boolean;
    free_delivery: boolean;
  }>({
    name: "",
    category: "Fashion Sheet",
    price: "",
    oldPrice: "",
    image: "",
    description: "",
    sizes: ["S", "M", "L"],
    colors: [{ name: "Camel", hex: "#c19a6b", images: [] }],
    inStock: true,
    free_delivery: false
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [tableSearchQuery, setTableSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<"all" | "week" | "month" | "year">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deliveryTimeFilter, setDeliveryTimeFilter] = useState<"day" | "month" | "year">("month");
  const [confirmEnableAll, setConfirmEnableAll] = useState(false);
  const [confirmDisableAll, setConfirmDisableAll] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const statsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!statsRes.ok || !statsRes.headers.get("content-type")?.includes("application/json")) {
        throw new Error(`Stats HTTP error ${statsRes.status} or non-JSON response`);
      }
      const statsData = await statsRes.json();
      setStats(statsData);

      const ordersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (!ordersRes.ok || !ordersRes.headers.get("content-type")?.includes("application/json")) {
        throw new Error(`Orders HTTP error ${ordersRes.status} or non-JSON response`);
      }
      const ordersData = await ordersRes.json();
      setOrders(ordersData.sort((a: Order, b: Order) => new Date(b.date).getTime() - new Date(a.date).getTime()));

      const productsRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
      if (!productsRes.ok || !productsRes.headers.get("content-type")?.includes("application/json")) {
        throw new Error(`Products HTTP error ${productsRes.status} or non-JSON response`);
      }
      const productsData = await productsRes.json();
      setProducts(productsData);

      const deliveryRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delivery-settings`);
      if (deliveryRes.ok) {
        const deliveryData = await deliveryRes.json();
        setDeliverySettings(deliveryData);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
      showToast("Could not sync with backend server API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const savedProfile = localStorage.getItem("adminProfile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setAdminProfile(parsed);
        setEditProfileForm(parsed);
      } catch (e) { }
    }
  }, []);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Order status updated to ${newStatus}`);
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to update status.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        showToast("Product deleted successfully");
        fetchData();
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to delete product.");
    }
  };

  const handleToggleFreeDelivery = async (productId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/toggle-free-delivery`, {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prevProducts =>
          prevProducts.map(p =>
            p.id === productId ? { ...p, free_delivery: data.free_delivery } : p
          )
        );
        showToast("Free delivery status toggled successfully");
      } else {
        showToast("Failed to toggle free delivery status.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error toggling free delivery.");
    }
  };

  const handleToggleSize = (size: string) => {
    setFormData(prev => {
      const alreadySelected = prev.sizes.includes(size);
      const newSizes = alreadySelected
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSize = customSize.trim().toUpperCase();
    if (cleanSize && !formData.sizes.includes(cleanSize)) {
      setFormData(prev => ({
        ...prev,
        sizes: [...prev.sizes, cleanSize]
      }));
      setCustomSize("");
    }
  };

  const handleTogglePresetColor = (preset: { name: string; hex: string }) => {
    setFormData(prev => {
      const exists = prev.colors.some(c => c.name.toLowerCase() === preset.name.toLowerCase() || c.hex.toLowerCase() === preset.hex.toLowerCase());
      const newColors = exists
        ? prev.colors.filter(c => c.name.toLowerCase() !== preset.name.toLowerCase() && c.hex.toLowerCase() !== preset.hex.toLowerCase())
        : [...prev.colors, { name: preset.name, hex: preset.hex, images: [] }];
      return { ...prev, colors: newColors };
    });
  };

  const handleAddCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customColorName.trim();
    const hex = customColorHex.trim();
    if (name && hex) {
      const exists = formData.colors.some(c => c.name.toLowerCase() === name.toLowerCase() || c.hex.toLowerCase() === hex.toLowerCase());
      if (!exists) {
        setFormData(prev => ({
          ...prev,
          colors: [...prev.colors, { name, hex, images: [] }]
        }));
        setCustomColorName("");
      } else {
        showToast("Color already exists in this product list.");
      }
    }
  };

  const handleRemoveColor = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== idx)
    }));
  };

  const handleAddImageToColor = (colorIdx: number, url: string) => {
    if (url === "upload") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFormData(prev => {
              const updatedColors = [...prev.colors];
              const color = { ...updatedColors[colorIdx] };
              color.images = [...(color.images || []), reader.result as string];
              updatedColors[colorIdx] = color;
              return { ...prev, colors: updatedColors };
            });
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    } else if (url === "url") {
      const inputUrl = prompt("Enter product variation image URL:");
      if (inputUrl && inputUrl.trim()) {
        setFormData(prev => {
          const updatedColors = [...prev.colors];
          const color = { ...updatedColors[colorIdx] };
          color.images = [...(color.images || []), inputUrl.trim()];
          updatedColors[colorIdx] = color;
          return { ...prev, colors: updatedColors };
        });
      }
    } else {
      setFormData(prev => {
        const updatedColors = [...prev.colors];
        const color = { ...updatedColors[colorIdx] };
        color.images = [...(color.images || []), url];
        updatedColors[colorIdx] = color;
        return { ...prev, colors: updatedColors };
      });
    }
  };

  const handleRemoveImageFromColor = (colorIdx: number, imgIdx: number) => {
    setFormData(prev => {
      const updatedColors = [...prev.colors];
      const color = { ...updatedColors[colorIdx] };
      color.images = (color.images || []).filter((_, i) => i !== imgIdx);
      updatedColors[colorIdx] = color;
      return { ...prev, colors: updatedColors };
    });
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setImageTab("upload");

    let defaultCategory = "Fashion Sheet";
    if (activeMenu === "products-trendy") defaultCategory = "Trendy Outfits";
    if (activeMenu === "products-promotions") defaultCategory = "Promotions";

    setFormData({
      name: "",
      category: defaultCategory,
      price: "",
      oldPrice: "",
      image: "",
      description: "",
      sizes: ["S", "M", "L"],
      colors: [
        { name: "Camel", hex: "#c19a6b", images: [] },
        { name: "Black", hex: "#171717", images: [] }
      ],
      inStock: true,
      free_delivery: false
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setImageTab(product.image.startsWith("data:") ? "upload" : "url");

    // Safety checks in case database has old string values or different formats
    let parsedSizes: string[] = [];
    if (Array.isArray(product.sizes)) {
      parsedSizes = product.sizes;
    } else if (typeof product.sizes === "string") {
      parsedSizes = (product.sizes as string)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    let parsedColors: Color[] = [];
    if (Array.isArray(product.colors)) {
      parsedColors = product.colors.map(c => ({
        name: c.name,
        hex: c.hex,
        images: Array.isArray(c.images) ? c.images : []
      }));
    }

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price.toString(),
      oldPrice: product.oldPrice?.toString() || "",
      image: product.image,
      description: product.description,
      sizes: parsedSizes,
      colors: parsedColors,
      inStock: product.inStock,
      free_delivery: product.free_delivery || false
    });
    setIsProductModalOpen(true);
  };

  const handleSubmitProductForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Custom validations with descriptive Toast feedback
    if (!formData.name.trim()) {
      showToast("Please enter a product name.");
      return;
    }
    if (!formData.price.trim() || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      showToast("Please enter a valid positive price.");
      return;
    }
    if (formData.sizes.length === 0) {
      showToast("Please select at least one product size.");
      return;
    }
    if (formData.colors.length === 0) {
      showToast("Please add at least one color option.");
      return;
    }
    if (!formData.description.trim()) {
      showToast("Please enter a product description.");
      return;
    }
    const payload = {
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
      image: formData.image || undefined,
      description: formData.description,
      sizes: formData.sizes,
      colors: formData.colors,
      inStock: formData.inStock,
      free_delivery: formData.free_delivery
    };

    try {
      let res;
      if (editingProduct) {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        showToast(editingProduct ? "Product updated successfully" : "Product created successfully");
        setIsProductModalOpen(false);
        fetchData();
      } else {
        let errMsg = "Error saving product.";
        if (res.headers.get("content-type")?.includes("application/json")) {
          const errorData = await res.json();
          errMsg = errorData.error || errMsg;
        } else {
          errMsg = `Server error ${res.status}`;
        }
        showToast(errMsg);
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving product.");
    }
  };

  const filteredOrders = orders.filter(o =>
    o.id.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
    o.customerEmail.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
    o.items.some(item => item.name.toLowerCase().includes(tableSearchQuery.toLowerCase()))
  );

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(tableSearchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(tableSearchQuery.toLowerCase());
    if (activeMenu === "products-fashion") {
      return matchesSearch && p.category === "Fashion Sheet";
    }
    if (activeMenu === "products-trendy") {
      return matchesSearch && p.category === "Trendy Outfits";
    }
    if (activeMenu === "products-promotions") {
      return matchesSearch && p.category === "Promotions";
    }
    return matchesSearch;
  });

  // 1. Filter orders by selected interactive date range filter
  const filteredOrdersForStats = orders.filter(order => {
    const orderDate = new Date(order.date);
    if (dateFilter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return orderDate >= oneWeekAgo;
    }
    if (dateFilter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return orderDate >= oneMonthAgo;
    }
    if (dateFilter === "year") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return orderDate >= oneYearAgo;
    }
    return true; // "all"
  });

  // 1.5 Compute Delivery Data for Power BI view
  const getDeliveryStats = () => {
    let jtCount = 0;
    let virakCount = 0;
    let jtRevenue = 0;
    let virakRevenue = 0;

    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const now = new Date();

      let inRange = false;
      if (deliveryTimeFilter === "day") {
        inRange = orderDate.toDateString() === now.toDateString();
      } else if (deliveryTimeFilter === "month") {
        inRange = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      } else if (deliveryTimeFilter === "year") {
        inRange = orderDate.getFullYear() === now.getFullYear();
      }

      if (inRange) {
        if (order.deliveryOption === "J&T Express" || order.deliveryOption === "J&T") {
          jtCount++;
          jtRevenue += deliverySettings.standardPrice;
        } else if (order.deliveryOption === "Virak Buntham") {
          virakCount++;
          virakRevenue += deliverySettings.expressPrice;
        }
      }
    });

    return { jtCount, virakCount, jtRevenue, virakRevenue };
  };

  const handleExportDeliveryData = () => {
    const csvRows = ["Order ID,Date,Customer,Delivery Option,Shipping Cost,Order Total,Status"];

    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const now = new Date();
      let inRange = false;
      if (deliveryTimeFilter === "day") {
        inRange = orderDate.toDateString() === now.toDateString();
      } else if (deliveryTimeFilter === "month") {
        inRange = orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
      } else if (deliveryTimeFilter === "year") {
        inRange = orderDate.getFullYear() === now.getFullYear();
      }

      if (inRange && (order.deliveryOption === "J&T Express" || order.deliveryOption === "J&T" || order.deliveryOption === "Virak Buntham")) {
        const cost = (order.deliveryOption === "Virak Buntham") ? deliverySettings.expressPrice : deliverySettings.standardPrice;
        csvRows.push(`${order.id},"${orderDate.toLocaleString()}","${order.customerName || 'Guest'}","${order.deliveryOption}",${cost},${order.total},${order.status}`);
      }
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `delivery_data_${deliveryTimeFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deliveryStats = getDeliveryStats();
  const totalDeliveries = deliveryStats.jtCount + deliveryStats.virakCount;
  const jtPercent = totalDeliveries > 0 ? Math.round((deliveryStats.jtCount / totalDeliveries) * 100) : 0;
  const virakPercent = totalDeliveries > 0 ? Math.round((deliveryStats.virakCount / totalDeliveries) * 100) : 0;

  // 2. Compute dynamic stats and sales shares for category and timeline
  const getOrderStats = () => {
    let totalRevenue = 0;
    let totalOrdersCount = 0;
    let totalUnitsSold = 0;
    const categoryRevenueMap: Record<string, number> = {
      "Fashion Sheet": 0,
      "Trendy Outfits": 0,
      "Promotions": 0
    };

    // Group sales by day/date for the trend chart
    const dailySalesMap: Record<string, { dateStr: string; revenue: number; ordersCount: number }> = {};

    filteredOrdersForStats.forEach(order => {
      let orderMatchesCategory = false;
      let orderRevenue = 0;
      let orderUnits = 0;

      order.items.forEach(item => {
        const product = products.find(p => p.name === item.name || p.id === item.id);
        const category = product?.category || "Fashion Sheet";

        if (categoryFilter === "all" || category === categoryFilter) {
          orderMatchesCategory = true;
          const itemRevenue = item.price * item.quantity;
          orderRevenue += itemRevenue;
          orderUnits += item.quantity;

          if (categoryRevenueMap[category] !== undefined) {
            categoryRevenueMap[category] += itemRevenue;
          } else {
            categoryRevenueMap[category] = itemRevenue;
          }
        }
      });

      if (orderMatchesCategory) {
        totalRevenue += orderRevenue;
        totalUnitsSold += orderUnits;
        totalOrdersCount++;

        const dObj = new Date(order.date);
        const dateKey = dObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (!dailySalesMap[dateKey]) {
          dailySalesMap[dateKey] = { dateStr: dateKey, revenue: 0, ordersCount: 0 };
        }
        dailySalesMap[dateKey].revenue += orderRevenue;
        dailySalesMap[dateKey].ordersCount++;
      }
    });

    const averageOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;

    return {
      totalRevenue,
      totalOrdersCount,
      totalUnitsSold,
      averageOrderValue,
      categoryRevenueMap,
      dailySales: Object.values(dailySalesMap)
    };
  };

  const currentStats = getOrderStats();

  // 3. Export CSV handler
  const handleExportCSV = () => {
    const headers = ["Order ID", "Customer Email", "Status", "Total Amount ($)", "Date", "Items Count"];
    const rows = filteredOrdersForStats.map(o => [
      o.id,
      o.customerEmail,
      o.status,
      o.total,
      new Date(o.date).toLocaleDateString(),
      o.items.reduce((sum, item) => sum + item.quantity, 0)
    ]);

    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sales_report_${dateFilter}_category_${categoryFilter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Sales report CSV exported successfully!");
  };

  // 4. Aggregated Sales Data for Best & Slow Sellers (respect category and date filter!)
  const productSalesMap: Record<string, { name: string; image: string; category: string; quantity: number; revenue: number }> = {};

  products.forEach(p => {
    if (categoryFilter === "all" || p.category === categoryFilter) {
      productSalesMap[p.id || (p as any)._id] = {
        name: p.name,
        image: p.image,
        category: p.category,
        quantity: 0,
        revenue: 0
      };
    }
  });

  filteredOrdersForStats.forEach(order => {
    order.items.forEach(item => {
      const pId = item.id || products.find(p => p.name === item.name)?.id || item.name;
      if (productSalesMap[pId]) {
        productSalesMap[pId].quantity += item.quantity;
        productSalesMap[pId].revenue += item.quantity * item.price;
      } else if (categoryFilter === "all" || products.find(p => p.name === item.name)?.category === categoryFilter) {
        productSalesMap[pId] = {
          name: item.name,
          image: products.find(p => p.name === item.name)?.image || "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=200",
          category: products.find(p => p.name === item.name)?.category || "Accessories",
          quantity: item.quantity,
          revenue: item.quantity * item.price
        };
      }
    });
  });

  const salesList = Object.entries(productSalesMap).map(([id, data]) => ({
    id,
    ...data
  }));

  const topSold = [...salesList]
    .sort((a, b) => b.quantity - a.quantity || b.revenue - a.revenue)
    .slice(0, 5);

  const leastSold = [...salesList]
    .sort((a, b) => a.quantity - b.quantity || a.revenue - b.revenue)
    .slice(0, 5);

  // Generate beautiful trend chart points
  const trendData = currentStats.dailySales.length >= 2
    ? currentStats.dailySales
    : [
      { dateStr: "Mon", revenue: 120 },
      { dateStr: "Tue", revenue: 250 },
      { dateStr: "Wed", revenue: 190 },
      { dateStr: "Thu", revenue: 480 },
      { dateStr: "Fri", revenue: 350 },
      { dateStr: "Sat", revenue: 600 },
      { dateStr: "Sun", revenue: 520 }
    ];

  const maxVal = Math.max(...trendData.map(d => d.revenue), 100);
  const chartHeight = 160;
  const chartWidth = 500;
  const padding = 20;

  // Compute SVG coordinates
  const points = trendData.map((d, idx) => {
    const x = padding + (idx / (trendData.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (d.revenue / maxVal) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });

  const linePath = points.reduce((path, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`
    : "";

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-indigo-600" size={36} />
          <p className="text-xs font-semibold tracking-wider text-slate-500 uppercase">Verifying Credentials...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 text-white font-sans antialiased flex items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative subtle background gradients */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="relative max-w-md w-full bg-stone-900/60 border border-stone-850 rounded-2xl p-8 shadow-2xl backdrop-blur-md text-center space-y-6 z-10">
          <div className="mx-auto w-16 h-16 bg-red-950/40 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 shadow-lg shadow-red-500/10">
            <ShieldAlert size={32} />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-serif font-bold uppercase tracking-wider text-white">Access Denied</h2>
            <p className="text-xs text-stone-400 max-w-xs mx-auto leading-relaxed">
              This area is restricted to administrators. Please sign in with an administrator account to access the Control Panel.
            </p>
          </div>

          <div className="flex flex-col gap-2 pt-2 text-stone-950">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full bg-white hover:bg-stone-100 text-stone-950 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn size={14} />
              Sign In as Admin
            </button>
            <Link
              href="/"
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all border border-stone-700 flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft size={14} />
              Back to Storefront
            </Link>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased flex">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] animate-slide-up">
          <div className="px-5 py-4 rounded-xl border border-slate-200 shadow-xl text-xs sm:text-sm font-semibold text-slate-800 bg-white/95 backdrop-blur-md">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200/60 hidden md:flex flex-col justify-between p-6 flex-shrink-0 sticky top-0 h-screen">
        <div className="space-y-8">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-serif font-black text-lg shadow-md shadow-indigo-600/20">
              F
            </div>
            <div>
              <span className="block text-sm font-bold tracking-wider text-slate-900">Fluzen</span>
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-widest">Store Admin</span>
            </div>
          </div>

          {/* Nav List */}
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Menu</span>
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "orders", label: "Orders Register", icon: ShoppingBag },
              { id: "products-fashion", label: "Fashion Sheet", icon: Shirt },
              { id: "products-trendy", label: "Trendy Outfits", icon: Sparkles },
              { id: "products-promotions", label: "Promotions", icon: Percent },
              { id: "dashboard1", label: "Delivery Admin", icon: Truck },
              { id: "settings", label: "Settings", icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveMenu(item.id as any);
                    setTableSearchQuery("");
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${isActive
                    ? "bg-indigo-50 text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                >
                  <Icon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Help Center */}
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Support</span>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer">
              <HelpCircle size={16} className="text-slate-400" />
              <span>Help Center</span>
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-50 cursor-pointer">
              <FileText size={16} className="text-slate-400" />
              <span>API Docs</span>
            </button>
          </div>
        </div>

        {/* Profile Card Footer */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => setIsProfileModalOpen(true)}
            title="Edit Profile"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden bg-indigo-100 border border-indigo-200 flex items-center justify-center">
              <img
                src={adminProfile.avatar || `https://ui-avatars.com/api/?name=${adminProfile.name || "Admin"}`}
                alt="Admin avatar"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + (adminProfile.name || "Admin");
                }}
              />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900">{adminProfile.name}</span>
              <span className="block text-[9px] text-slate-400 truncate max-w-[120px]">{adminProfile.email}</span>
            </div>
          </div>
          <Link href="/" className="text-slate-400 hover:text-slate-900 p-1.5 hover:bg-slate-50 rounded-lg transition-colors" title="Exit to storefront">
            <LogOut size={16} />
          </Link>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Control Bar */}
        <header className="h-20 bg-white border-b border-slate-200/60 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile Logo Button */}
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-serif font-black text-sm md:hidden">
              F
            </div>
            <div className="hidden sm:block">
              <h2 className="text-base font-bold text-slate-900">Good morning, {adminProfile.name} 👋</h2>
              <p className="text-[10px] text-slate-400 font-medium">Welcome back to your store workspace.</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative hidden lg:flex items-center">
              <Search className="absolute left-3.5 text-slate-400" size={15} />
              <input
                type="text"
                placeholder="Global search..."
                className="bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-xs w-60 outline-none focus:border-indigo-400 focus:bg-white transition-all"
              />
            </div>

            {/* Date range display */}
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-semibold text-slate-600 uppercase tracking-wider">
              <Calendar size={13} className="text-slate-400" />
              <span>Feb 12, 2026 - Feb 18, 2026</span>
            </div>

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center gap-0.5 border border-slate-200 rounded-full p-0.5 bg-slate-50">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${language === "en"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-400 hover:text-slate-700"
                  }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("kh")}
                className={`px-2.5 py-1 text-[10px] font-bold rounded-full transition-all cursor-pointer ${language === "kh"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                  : "text-slate-400 hover:text-slate-700"
                  }`}
              >
                KH
              </button>
            </div>

            {/* Storefront Link button */}
            <Link
              href="/"
              className="text-xs bg-slate-900 hover:bg-indigo-650 text-white font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all shadow-sm hidden sm:inline-flex items-center gap-1.5"
            >
              <span>Storefront</span>
            </Link>
          </div>
        </header>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={32} />
            <p className="text-slate-500 text-sm font-medium">Loading panel view...</p>
          </div>
        ) : (
          <div className="flex-1 p-6 sm:p-8 space-y-8 overflow-y-auto">

            {/* 1. Dashboard View */}
            {activeMenu === "dashboard" && (
              <div className="space-y-8 animate-fade-in">

                {/* Interactive Power BI Filter Bar */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200/50 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 text-indigo-650 rounded-lg">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Power BI Interactive Analytics</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Filter revenue, orders, and averages in real time</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Category Filter */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Category:</span>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none font-semibold text-slate-700 focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        <option value="Fashion Sheet">Fashion Sheet</option>
                        <option value="Trendy Outfits">Trendy Outfits</option>
                        <option value="Promotions">Promotions</option>
                      </select>
                    </div>

                    {/* Date range picker */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline:</span>
                      <div className="flex bg-slate-50 p-1 border border-slate-200 rounded-xl">
                        {[
                          { id: "all", label: "All Time" },
                          { id: "year", label: "1 Year" },
                          { id: "month", label: "30 Days" },
                          { id: "week", label: "7 Days" }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            onClick={() => setDateFilter(btn.id as any)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${dateFilter === btn.id
                              ? "bg-white text-indigo-600 shadow-sm"
                              : "text-slate-400 hover:text-slate-700"
                              }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Export CSV Button */}
                    <button
                      onClick={handleExportCSV}
                      className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <FileText size={12} />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Greeting Mobile */}
                <div className="sm:hidden space-y-0.5">
                  <h2 className="text-lg font-bold text-slate-900">Good morning, {adminProfile.name} 👋</h2>
                  <p className="text-[10px] text-slate-400 font-medium">Store status update</p>
                </div>

                {/* Current Delivery Rates Banner */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2.5 rounded-xl border border-white/5">
                      <Truck size={20} className="text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">Active Delivery Rates</h4>
                      <p className="text-[10px] text-slate-300 font-medium">Currently applied to all new customer checkouts</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">J&T Express</span>
                      <span className="text-sm sm:text-lg font-black text-white">${deliverySettings.standardPrice.toFixed(2)}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Virak Buntham</span>
                      <span className="text-sm sm:text-lg font-black text-white">${deliverySettings.expressPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* KPI metrics row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                  {/* Metric 1 */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Total Revenue</span>
                      <span className="text-emerald-500 font-bold">+12.4%</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">${currentStats.totalRevenue.toLocaleString()}</span>
                      {/* Micro Sparkline SVG */}
                      <svg className="w-16 h-8 text-emerald-500" viewBox="0 0 100 40" fill="none">
                        <path d="M0,35 Q15,10 30,28 T60,5 T90,22 T100,10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Average Order Value</span>
                      <span className="text-emerald-500 font-bold">+8.5%</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">${currentStats.averageOrderValue}</span>
                      <svg className="w-16 h-8 text-emerald-500" viewBox="0 0 100 40" fill="none">
                        <path d="M0,30 Q20,10 40,25 T80,10 T100,5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Metric 3 */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Orders Count</span>
                      <span className="text-emerald-500 font-bold">+19.5%</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">{currentStats.totalOrdersCount}</span>
                      <svg className="w-16 h-8 text-emerald-500" viewBox="0 0 100 40" fill="none">
                        <path d="M0,35 Q10,30 20,20 T50,22 T70,8 T100,12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Metric 4 */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/50 shadow-xs space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>Units Sold</span>
                      <span className="text-indigo-500 font-bold">+15.2%</span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-semibold tracking-tight text-slate-900">{currentStats.totalUnitsSold}</span>
                      <svg className="w-16 h-8 text-indigo-500" viewBox="0 0 100 40" fill="none">
                        <path d="M0,10 Q20,8 40,22 T70,18 T100,32" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                  {/* Revenue Trend Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-xs lg:col-span-2 space-y-6 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-wide">Revenue Trend</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Daily income trajectory for filtered criteria</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                          Live Data
                        </span>
                      </div>
                    </div>

                    {/* Responsive Area Chart */}
                    <div className="relative h-44 w-full">
                      {points.length > 0 ? (
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                          <defs>
                            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.00" />
                            </linearGradient>
                          </defs>

                          {/* Grid Lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
                            const y = padding + ratio * (chartHeight - padding * 2);
                            const val = Math.round(maxVal - ratio * maxVal);
                            return (
                              <g key={i} className="opacity-40">
                                <line
                                  x1={padding}
                                  y1={y}
                                  x2={chartWidth - padding}
                                  y2={y}
                                  stroke="#e2e8f0"
                                  strokeDasharray="3 3"
                                  strokeWidth="1"
                                />
                                <text
                                  x={padding - 5}
                                  y={y + 3}
                                  fill="#94a3b8"
                                  fontSize="8"
                                  fontWeight="700"
                                  textAnchor="end"
                                >
                                  ${val}
                                </text>
                              </g>
                            );
                          })}

                          {/* Area path */}
                          {areaPath && (
                            <path d={areaPath} fill="url(#chart-gradient)" />
                          )}

                          {/* Line path */}
                          {linePath && (
                            <path
                              d={linePath}
                              fill="none"
                              stroke="#4f46e5"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          )}

                          {/* Points */}
                          {points.map((p, idx) => (
                            <g key={idx} className="group cursor-pointer">
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="4"
                                fill="#ffffff"
                                stroke="#4f46e5"
                                strokeWidth="2.5"
                              />
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r="8"
                                fill="#4f46e5"
                                fillOpacity="0"
                                className="hover:fill-opacity-10 transition-all"
                              />
                              {/* Axis Labels */}
                              <text
                                x={p.x}
                                y={chartHeight - 3}
                                fill="#94a3b8"
                                fontSize="8"
                                fontWeight="700"
                                textAnchor="middle"
                              >
                                {p.dateStr}
                              </text>
                            </g>
                          ))}
                        </svg>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                          No sales data found for the selected filter.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Category Share Distribution Card */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-xs flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-wide">Category Share</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Revenue contribution by category</p>
                    </div>

                    <div className="space-y-4 my-6">
                      {Object.entries(currentStats.categoryRevenueMap).map(([cat, rev]) => {
                        const pct = currentStats.totalRevenue > 0
                          ? Math.round((rev / currentStats.totalRevenue) * 100)
                          : 0;

                        const colorClass = cat === "Fashion Sheet"
                          ? "bg-indigo-600"
                          : cat === "Trendy Outfits"
                            ? "bg-sky-500"
                            : "bg-amber-500";

                        return (
                          <div key={cat} className="space-y-1.5">
                            <div className="flex justify-between items-center text-[10px] font-bold tracking-wide">
                              <span className="text-slate-600 uppercase flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${colorClass}`} />
                                {cat}
                              </span>
                              <span className="text-slate-900">${rev.toLocaleString()}.00 ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${colorClass} rounded-full transition-all duration-700`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>BI Share Engine</span>
                      <span className="text-indigo-600">Reactive Calculations</span>
                    </div>
                  </div>
                </div>

                {/* Sales Performance (Most and Least Sold) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                  {/* 1. Best Selling Products (Most Sold) */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-wide">Best Selling Products</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Top performing products this month</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        High Demand
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {topSold.map((product, idx) => (
                        <div key={product.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 w-4 font-mono">#{idx + 1}</span>
                            <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top" />
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-slate-800 truncate max-w-[180px]" title={product.name}>{product.name}</span>
                              <span className="block text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">{product.category}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="block text-xs font-bold text-slate-900">{product.quantity} sold</span>
                            <span className="block text-[10px] text-emerald-600 font-medium mt-0.5">+${product.revenue}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 2. Slow Selling Products (Least Sold) */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-xs space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-wide">Slow Moving Products</h3>
                        <p className="text-[10px] text-slate-400 font-medium">Stagnant or low sales volume this month</p>
                      </div>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        Low Demand
                      </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {leastSold.map((product, idx) => (
                        <div key={product.id} className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-400 w-4 font-mono">#{idx + 1}</span>
                            <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                              <img src={product.image} alt={product.name} className="w-full h-full object-cover object-top" />
                            </div>
                            <div>
                              <span className="block text-xs font-semibold text-slate-800 truncate max-w-[180px]" title={product.name}>{product.name}</span>
                              <span className="block text-[9px] text-slate-400 uppercase tracking-wider mt-0.5">{product.category}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`block text-xs font-bold ${product.quantity === 0 ? "text-slate-400" : "text-slate-700"}`}>
                              {product.quantity} sold
                            </span>
                            <span className="block text-[10px] text-slate-400 font-medium mt-0.5 font-sans">
                              {product.quantity === 0 ? "$0 revenue" : `$${product.revenue}`}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Sales Data Table */}
                <div className="bg-white rounded-2xl border border-slate-200/50 shadow-xs p-6 space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-wide">Sales data</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Manage recent incoming orders</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Table search query */}
                      <div className="relative flex items-center">
                        <Search className="absolute left-3 text-slate-450" size={13} />
                        <input
                          type="text"
                          placeholder="Search..."
                          value={tableSearchQuery}
                          onChange={(e) => setTableSearchQuery(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-indigo-400"
                        />
                      </div>
                      <button className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                        <SlidersHorizontal size={13} />
                      </button>
                    </div>
                  </div>

                  {filteredOrders.length === 0 ? (
                    <p className="text-center py-8 text-xs text-slate-400">No orders match search.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            <th className="pb-3">Transaction ID</th>
                            <th className="pb-3">Customer</th>
                            <th className="pb-3">Email</th>
                            <th className="pb-3">Purchased Product</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {filteredOrders.slice(0, 5).map((order) => {
                            // Assign beautiful mock avatars
                            const isSarah = order.customerEmail.includes("sarah");
                            const isJames = order.customerEmail.includes("james");
                            const name = isSarah ? "Livia Torff" : isJames ? "Arthur Taylor" : "Mathew Andre";
                            const avatar = isSarah
                              ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop"
                              : isJames
                                ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                                : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop";

                            return (
                              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3.5 font-mono font-medium text-slate-900 uppercase tracking-wide">{order.id.replace("FS-", "FRD")}</td>
                                <td className="py-3.5">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200">
                                      <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-semibold text-slate-850">{name}</span>
                                  </div>
                                </td>
                                <td className="py-3.5">
                                  <a href={`mailto:${order.customerEmail}`} className="text-indigo-600 hover:underline">{order.customerEmail}</a>
                                </td>
                                <td className="py-3.5 text-slate-500 font-medium">
                                  {order.items[0]?.name || "Luxury Outfit"}
                                </td>
                                <td className="py-3.5">
                                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${order.status === "Delivered"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : order.status === "Shipped"
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-amber-50 text-amber-700"
                                    }`}>
                                    <span>{order.status}</span>
                                  </span>
                                </td>
                                <td className="py-3.5 text-right text-slate-400 font-medium">
                                  {new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* 2. Orders View */}
            {activeMenu === "orders" && (
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-xs p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-wide">Orders Register</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Track and update order fulfillment statuses</p>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-3 text-slate-400" size={13} />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-indigo-400 w-52"
                    />
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <p className="text-center py-12 text-xs text-slate-400">No orders cataloged.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <th className="pb-3 pr-4">Order ID</th>
                          <th className="pb-3 pr-4">Customer</th>
                          <th className="pb-3 pr-4">Delivery Details</th>
                          <th className="pb-3 pr-4">Date</th>
                          <th className="pb-3 pr-4">Products</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3 pr-4">Total</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 font-mono font-medium text-slate-900 pr-4">{order.id}</td>
                            <td className="py-4 pr-4">
                              <div className="space-y-0.5">
                                <p className="font-semibold text-slate-800">{order.customerName || "Guest"}</p>
                                {order.phone && <p className="text-[10px] text-slate-500">📞 {order.phone}</p>}
                                <p className="text-[10px] text-slate-400">{order.customerEmail}</p>
                              </div>
                            </td>
                            <td className="py-4 text-slate-650">
                              <div className="space-y-0.5">
                                <p className="font-semibold text-slate-800">{order.deliveryLocation || "Not Specified"}</p>
                                <p className="text-[10px] text-indigo-650 font-bold uppercase tracking-wider">{order.deliveryOption || "J&T"}</p>
                              </div>
                            </td>
                            <td className="py-4 text-slate-400">
                              {new Date(order.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </td>
                            <td className="py-4 text-slate-500">
                              <div className="space-y-0.5">
                                {order.items.map((i, idx) => (
                                  <p key={idx}>
                                    • {i.name} - <span className="text-[10px] text-slate-400 uppercase">{i.size}</span> / <span className="text-[10px] text-slate-400">{i.color}</span> ({i.quantity}x)
                                  </p>
                                ))}
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ${order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700"
                                : order.status === "Shipped"
                                  ? "bg-blue-50 text-blue-700"
                                  : order.status.toLowerCase() === "paid"
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}>
                                <span>{order.status}</span>
                              </span>
                            </td>
                            <td className="py-4 font-semibold text-slate-900">${order.total}.00</td>
                            <td className="py-4 text-right">
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                className="text-xs bg-slate-50 border border-slate-200 rounded p-1 outline-none text-slate-700 focus:border-slate-400 cursor-pointer"
                              >
                                <option value="paid">Paid</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 3. Products View */}
            {["products-fashion", "products-trendy", "products-promotions"].includes(activeMenu) && (
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-xs p-6 space-y-6 animate-fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                      {activeMenu === "products-fashion" ? "Fashion Sheet Manager" :
                        activeMenu === "products-trendy" ? "Trendy Outfits Manager" :
                          "Promotions Manager"}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-medium">Create and delete listings in the storefront</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 text-slate-400" size={13} />
                      <input
                        type="text"
                        placeholder="Search products..."
                        value={tableSearchQuery}
                        onChange={(e) => setTableSearchQuery(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none focus:border-indigo-400 w-44"
                      />
                    </div>
                    <button
                      onClick={handleOpenCreateModal}
                      className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-600/10"
                    >
                      <Plus size={14} />
                      <span>Add Product</span>
                    </button>
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <p className="text-center py-12 text-xs text-slate-400">No products match search criteria.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          <th className="pb-3">Visual</th>
                          <th className="pb-3">Name</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Availability</th>
                          <th className="pb-3">Free Delivery</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4">
                              <div className="relative w-10 h-14 rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover object-top"
                                />
                              </div>
                            </td>
                            <td className="py-4 font-semibold text-slate-900 max-w-[200px] truncate" title={product.name}>
                              {product.name}
                            </td>
                            <td className="py-4 text-slate-500 uppercase tracking-wider">{product.category}</td>
                            <td className="py-4">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-800">${product.price}.00</span>
                                {product.oldPrice && product.oldPrice > product.price && (
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className="text-[10px] text-slate-400 line-through">${product.oldPrice}.00</span>
                                    <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded">
                                      -{Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${product.inStock ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                                }`}>
                                {product.inStock ? "In Stock" : "Out of Stock"}
                              </span>
                            </td>
                            <td className="py-4">
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleToggleFreeDelivery(product.id)}
                                  className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                    product.free_delivery
                                      ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs shadow-emerald-500/10"
                                      : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                                  }`}
                                >
                                  🚚 Free Delivery
                                </button>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  product.free_delivery
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : "bg-slate-100 text-slate-500 border border-slate-200"
                                }`}>
                                  {product.free_delivery ? "Free Delivery" : "Normal Delivery"}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-right space-x-2">
                              <button
                                onClick={() => handleOpenEditModal(product)}
                                className="p-1 text-slate-400 hover:text-slate-850 hover:bg-slate-50 rounded transition-colors cursor-pointer"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* 4. Delivery Admin (Dashboard1) */}
            {activeMenu === "dashboard1" && (
              <div className="flex flex-col xl:flex-row gap-6 animate-fade-in">
                {/* Delivery Settings Form & Free Delivery Settings */}
                <div className="flex flex-col gap-6 flex-shrink-0 w-full xl:w-[400px]">
                  {/* Delivery Settings Form */}
                  <div className="bg-white rounded-2xl border border-slate-200/50 shadow-xs p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-wide">Delivery Pricing</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Set the delivery prices for checkout</p>
                    </div>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/delivery-settings`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(deliverySettings)
                          });
                          if (res.ok) {
                            showToast("Delivery prices updated successfully!");
                          } else {
                            showToast("Failed to update delivery prices.");
                          }
                        } catch (error) {
                          showToast("Error updating delivery prices.");
                        }
                      }}
                      className="space-y-4 text-xs"
                    >
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-slate-800">J&T Express (Standard) Price ($)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={deliverySettings.standardPrice}
                          onChange={(e) => setDeliverySettings({ ...deliverySettings, standardPrice: Number(e.target.value) })}
                          className="bg-slate-50 border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="font-semibold text-slate-800">Virak Buntham (Express) Price ($)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={deliverySettings.expressPrice}
                          onChange={(e) => setDeliverySettings({ ...deliverySettings, expressPrice: Number(e.target.value) })}
                          className="bg-slate-50 border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 rounded-lg"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-indigo-650 text-white font-semibold tracking-wider uppercase px-6 py-2.5 rounded-xl transition-all shadow cursor-pointer mt-4"
                      >
                        Update Prices
                      </button>
                    </form>

                    {/* Current Active Prices Preview */}
                    <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-3">Live Pricing Preview</h4>
                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-slate-600">J&T Express <span className="text-slate-400 font-normal">(Standard)</span></span>
                        <span className="text-sm font-black text-emerald-600">${deliverySettings.standardPrice.toFixed(2)}</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-4 flex justify-between items-center">
                        <span className="text-[11px] font-semibold text-slate-600">Virak Buntham <span className="text-slate-400 font-normal">(Express)</span></span>
                        <span className="text-sm font-black text-amber-600">${deliverySettings.expressPrice.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Free Delivery Quick Manager */}
                  <div className="bg-white rounded-2xl border border-slate-200/50 shadow-xs p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-wide">Free Delivery Settings</h3>
                      <p className="text-[10px] text-slate-400 font-medium">Configure products that qualify for free shipping</p>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirmEnableAll) {
                            setConfirmEnableAll(true);
                            setTimeout(() => setConfirmEnableAll(false), 3000);
                            return;
                          }
                          setConfirmEnableAll(false);
                          try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/bulk-free-delivery`, {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                ...(token ? { Authorization: `Bearer ${token}` } : {})
                              },
                              body: JSON.stringify({ free_delivery: true })
                            });
                            if (res.ok) {
                              showToast("Set free delivery for all products successfully!");
                              fetchData();
                            } else {
                              showToast("Failed to bulk update free delivery.");
                            }
                          } catch (err) {
                            showToast("Error updating bulk free delivery.");
                          }
                        }}
                        className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer ${
                          confirmEnableAll
                            ? "bg-amber-600 hover:bg-amber-700 text-white animate-pulse"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        <Truck size={12} />
                        {confirmEnableAll ? "Are you sure?" : "Enable All"}
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          if (!confirmDisableAll) {
                            setConfirmDisableAll(true);
                            setTimeout(() => setConfirmDisableAll(false), 3000);
                            return;
                          }
                          setConfirmDisableAll(false);
                          try {
                            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/bulk-free-delivery`, {
                              method: "PUT",
                              headers: {
                                "Content-Type": "application/json",
                                ...(token ? { Authorization: `Bearer ${token}` } : {})
                              },
                              body: JSON.stringify({ free_delivery: false })
                            });
                            if (res.ok) {
                              showToast("Disabled free delivery for all products successfully!");
                              fetchData();
                            } else {
                              showToast("Failed to bulk reset free delivery.");
                            }
                          } catch (err) {
                            showToast("Error resetting bulk free delivery.");
                          }
                        }}
                        className={`flex-1 text-[10px] font-bold uppercase tracking-wider py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer ${
                          confirmDisableAll
                            ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-650 border border-slate-200"
                        }`}
                      >
                        <X size={12} />
                        {confirmDisableAll ? "Confirm Disable" : "Disable All"}
                      </button>
                    </div>

                    {/* Product List Checklist */}
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                      {products.map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <img src={p.image} className="w-8 h-10 object-cover rounded bg-white border border-slate-100 flex-shrink-0" alt="" />
                            <div className="truncate">
                              <span className="block font-semibold text-slate-800 truncate" title={p.name}>{p.name}</span>
                              <span className="block text-[9px] text-slate-400 uppercase tracking-wider">{p.category}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleToggleFreeDelivery(p.id)}
                            className={`px-2 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all flex-shrink-0 ${
                              p.free_delivery
                                ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xs"
                                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                            }`}
                          >
                            {p.free_delivery ? "Free" : "Normal"}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Power BI Dashboard Canvas */}
                <div className="flex-1 bg-[#f3f2f1] rounded-xl border border-slate-200 overflow-hidden flex flex-col shadow-sm">

                  {/* Top Header / App Bar */}
                  <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#F2C811] p-1.5 rounded flex items-center justify-center">
                        <Truck size={14} className="text-black" />
                      </div>
                      <h3 className="text-sm font-semibold text-slate-800">Delivery Analytics Report</h3>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-[10px] text-slate-500">Last updated: Just now</div>
                      <button
                        onClick={handleExportDeliveryData}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors cursor-pointer"
                        title="Export filtered data to CSV/Excel"
                      >
                        <Download size={12} />
                        Export Data
                      </button>
                    </div>
                  </div>

                  {/* Canvas Body */}
                  <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto min-h-[500px]">

                    {/* Slicers / Filters Bar */}
                    <div className="bg-white rounded border border-slate-200 p-2.5 flex items-center gap-4 shadow-sm">
                      <span className="text-xs font-semibold text-slate-600 pl-2">Time Slicer:</span>
                      <div className="flex bg-[#f3f2f1] border border-slate-200 rounded p-0.5">
                        {["day", "month", "year"].map((f) => (
                          <button
                            key={f}
                            onClick={() => setDeliveryTimeFilter(f as any)}
                            className={`px-4 py-1 text-[11px] font-semibold capitalize rounded transition-all cursor-pointer ${deliveryTimeFilter === f
                              ? "bg-white text-slate-900 shadow-xs border-slate-200"
                              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                              }`}
                          >
                            This {f}
                          </button>
                        ))}
                      </div>
                    </div>

                    {totalDeliveries === 0 ? (
                      <div className="flex-1 bg-white rounded border border-slate-200 flex flex-col items-center justify-center py-16">
                        <div className="bg-slate-100 p-4 rounded-full mb-3"><Truck size={24} className="text-slate-400" /></div>
                        <p className="text-sm text-slate-600 font-medium">No data available for the selected timeframe.</p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-4">
                        {/* KPI Cards Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { title: "Total Deliveries", val: totalDeliveries, color: "border-l-indigo-500" },
                            { title: "Total Revenue", val: `$${(deliveryStats.jtRevenue + deliveryStats.virakRevenue).toFixed(2)}`, color: "border-l-emerald-500" },
                            { title: "J&T Share", val: `${jtPercent}%`, color: "border-l-[#10B981]" },
                            { title: "Virak Share", val: `${virakPercent}%`, color: "border-l-[#F59E0B]" }
                          ].map((kpi, i) => (
                            <div key={i} className={`bg-white rounded border border-slate-200 p-4 shadow-sm border-l-4 ${kpi.color} flex flex-col justify-center h-[90px]`}>
                              <span className="block text-[10px] text-slate-500 uppercase tracking-widest mb-1">{kpi.title}</span>
                              <span className="block text-2xl font-light text-slate-800">{kpi.val}</span>
                            </div>
                          ))}
                        </div>

                        {/* Charts Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">

                          {/* Deliveries by Partner Chart */}
                          <div className="bg-white rounded border border-slate-200 p-4 shadow-sm flex flex-col min-h-[220px]">
                            <h4 className="text-xs font-semibold text-slate-700 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-indigo-500" />
                              Volume by Partner
                            </h4>
                            <div className="flex-1 flex items-end gap-10 justify-center pt-8 pb-2 px-4 border-l border-b border-slate-100 relative">
                              {/* Grid lines */}
                              <div className="absolute left-0 top-4 w-full border-t border-slate-100 border-dashed"></div>
                              <div className="absolute left-0 top-1/2 w-full border-t border-slate-100 border-dashed"></div>

                              <div className="flex flex-col items-center gap-2 group w-20 z-10">
                                <span className="text-xs font-semibold text-slate-600 bg-white/80 px-1">{deliveryStats.jtCount}</span>
                                <div className="w-12 bg-[#10B981] transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer shadow-sm" style={{ height: `${(deliveryStats.jtCount / Math.max(totalDeliveries, 1)) * 130}px` }}></div>
                                <span className="text-[10px] font-semibold text-slate-500 text-center">J&T Express</span>
                              </div>
                              <div className="flex flex-col items-center gap-2 group w-20 z-10">
                                <span className="text-xs font-semibold text-slate-600 bg-white/80 px-1">{deliveryStats.virakCount}</span>
                                <div className="w-12 bg-[#F59E0B] transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer shadow-sm" style={{ height: `${(deliveryStats.virakCount / Math.max(totalDeliveries, 1)) * 130}px` }}></div>
                                <span className="text-[10px] font-semibold text-slate-500 text-center">Virak Buntham</span>
                              </div>
                            </div>
                          </div>

                          {/* Revenue by Partner Chart (Horizontal Bars) */}
                          <div className="bg-white rounded border border-slate-200 p-4 shadow-sm flex flex-col min-h-[220px]">
                            <h4 className="text-xs font-semibold text-slate-700 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              Revenue Contribution
                            </h4>
                            <div className="flex-1 flex flex-col justify-center gap-6 px-2">
                              <div>
                                <div className="flex justify-between text-[11px] mb-2">
                                  <span className="font-semibold text-slate-600">J&T Express</span>
                                  <span className="font-bold text-slate-800">${deliveryStats.jtRevenue.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-6 overflow-hidden">
                                  <div className="bg-[#10B981] h-full transition-all duration-1000 ease-out" style={{ width: `${(deliveryStats.jtRevenue / Math.max(deliveryStats.jtRevenue + deliveryStats.virakRevenue, 1)) * 100}%` }} />
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-[11px] mb-2">
                                  <span className="font-semibold text-slate-600">Virak Buntham</span>
                                  <span className="font-bold text-slate-800">${deliveryStats.virakRevenue.toFixed(2)}</span>
                                </div>
                                <div className="w-full bg-slate-100 h-6 overflow-hidden">
                                  <div className="bg-[#F59E0B] h-full transition-all duration-1000 ease-out" style={{ width: `${(deliveryStats.virakRevenue / Math.max(deliveryStats.jtRevenue + deliveryStats.virakRevenue, 1)) * 100}%` }} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Settings View */}
            {activeMenu === "settings" && (
              <div className="bg-white rounded-2xl border border-slate-200/50 shadow-xs p-6 space-y-6 animate-fade-in max-w-xl">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-wide">Workspace Settings</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Manage server parameters and configuration rules</p>
                </div>

                <div className="space-y-4 text-xs divide-y divide-slate-100">
                  <div className="pt-4 flex justify-between items-center">
                    <div>
                      <span className="block font-semibold text-slate-800">Email Notifications</span>
                      <span className="block text-[10px] text-slate-400">Receive email digests for customer checkouts</span>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <div>
                      <span className="block font-semibold text-slate-800">Auto-fulfillment</span>
                      <span className="block text-[10px] text-slate-400">Mark orders as Shipped automatically in 24 hours</span>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <div>
                      <span className="block font-semibold text-slate-800">Simulate Network Delay</span>
                      <span className="block text-[10px] text-slate-400">Delay catalog fetching to display spinners</span>
                    </div>
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Product Create/Edit Dialog Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs" onClick={() => setIsProductModalOpen(false)} />

          <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 transform animate-slide-up flex flex-col max-h-[90vh]">
            <h3 className="text-base font-serif font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-3 mb-4">
              {editingProduct ? "Edit Clothing Listing" : "Add New Apparel Listing"}
            </h3>

            <form id="product-form" onSubmit={handleSubmitProductForm} noValidate className="space-y-4 overflow-y-auto pr-1 flex-1 no-scrollbar pb-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Silk Wrap Dress"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-400 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-2 py-2.5 text-[11px] outline-none focus:border-indigo-400 rounded-lg text-slate-800"
                  >
                    <option value="Fashion Sheet">Fashion Sheet</option>
                    <option value="Trendy Outfits">Trendy Outfits</option>
                    <option value="Promotions">Promotions</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stock Availability</label>
                  <select
                    value={formData.inStock ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.value === "true" })}
                    className="w-full bg-slate-50 border border-slate-200 px-2 py-2.5 text-[11px] outline-none focus:border-indigo-400 rounded-lg text-slate-800"
                  >
                    <option value="true">In Stock</option>
                    <option value="false">Out of Stock</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Free Delivery</label>
                  <select
                    value={formData.free_delivery ? "true" : "false"}
                    onChange={(e) => setFormData({ ...formData, free_delivery: e.target.value === "true" })}
                    className="w-full bg-slate-50 border border-slate-200 px-2 py-2.5 text-[11px] outline-none focus:border-indigo-400 rounded-lg text-slate-800"
                  >
                    <option value="false">Normal</option>
                    <option value="true">🚚 Free</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Price ($)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 195"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-400 rounded-lg"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Was Price ($ - Optional)</label>
                    {formData.price && formData.oldPrice && Number(formData.oldPrice) > Number(formData.price) && (
                      <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        Discount: {Math.round(((Number(formData.oldPrice) - Number(formData.price)) / Number(formData.oldPrice)) * 100)}%
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    placeholder="e.g. 250"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-400 rounded-lg"
                  />
                </div>
              </div>

              {/* Sizes section */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sizes Selection</label>
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {SIZE_PRESETS.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleToggleSize(size)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${isSelected
                          ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-350 hover:bg-slate-100"
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
                {/* Custom size input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Custom size (e.g. 44, XL)"
                    value={customSize}
                    onChange={(e) => setCustomSize(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-400 rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSize}
                    className="bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Add Size
                  </button>
                </div>
              </div>

              {/* Colors section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Colors Options</label>

                {/* Current Active Colors list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                  {formData.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-2 p-3 bg-slate-50 border border-slate-200/80 rounded-xl shadow-2xs relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-205"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="font-semibold text-slate-800 text-xs">{color.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="text-slate-400 hover:text-red-500 cursor-pointer transition-colors text-[10px] font-bold uppercase tracking-wider"
                        >
                          Remove
                        </button>
                      </div>

                      {/* Color Specific Images */}
                      <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                        <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          Images ({color.images?.length || 0})
                        </span>

                        <div className="flex flex-wrap gap-1.5 items-center">
                          {color.images?.map((img, imgIdx) => (
                            <div key={imgIdx} className="relative w-9 h-12 rounded-lg border border-slate-200 overflow-hidden bg-white group/thumb">
                              <img src={img} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleRemoveImageFromColor(idx, imgIdx)}
                                className="absolute inset-0 bg-red-650/90 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity text-[8px] font-bold cursor-pointer"
                              >
                                Del
                              </button>
                            </div>
                          ))}

                          {/* Action Selector to add images */}
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleAddImageToColor(idx, e.target.value);
                                e.target.value = "";
                              }
                            }}
                            className="h-7 bg-white border border-slate-205 rounded-md text-[9px] font-semibold text-slate-650 px-1.5 outline-none focus:border-indigo-400 cursor-pointer max-w-[80px]"
                          >
                            <option value="">+ Add...</option>
                            <optgroup label="Presets">
                              {IMAGE_PRESETS.map((p, pIdx) => (
                                <option key={pIdx} value={p.url}>{p.name}</option>
                              ))}
                            </optgroup>
                            <option value="upload">Upload Custom...</option>
                            <option value="url">Enter URL...</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                  {formData.colors.length === 0 && (
                    <span className="text-xs text-slate-400 font-medium italic col-span-full">No colors selected (minimum 1 required)</span>
                  )}
                </div>

                {/* Preset colors swatches */}
                <div className="space-y-1">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Quick Add Presets</span>
                  <div className="flex flex-wrap gap-1.5">
                    {COLOR_PRESETS.map((preset) => {
                      const exists = formData.colors.some(c => c.name.toLowerCase() === preset.name.toLowerCase() || c.hex.toLowerCase() === preset.hex.toLowerCase());
                      return (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => handleTogglePresetColor(preset)}
                          title={`${preset.name} (${preset.hex})`}
                          className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all cursor-pointer ${exists
                            ? "ring-2 ring-indigo-500 border-white scale-110 shadow-xs"
                            : "border-slate-200 hover:scale-105"
                            }`}
                          style={{ backgroundColor: preset.hex }}
                        >
                          {exists && <span className="text-[10px] text-white font-bold drop-shadow-xs">✓</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Color Creator */}
                <div className="space-y-1.5 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider">Custom Color Picker</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Color name (e.g. Lavender)"
                      value={customColorName}
                      onChange={(e) => setCustomColorName(e.target.value)}
                      className="flex-1 bg-white border border-slate-200 px-3 py-2 text-xs outline-none focus:border-indigo-400 rounded-lg"
                    />
                    <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                      <input
                        type="color"
                        value={customColorHex}
                        onChange={(e) => setCustomColorHex(e.target.value)}
                        className="w-6 h-6 border-0 cursor-pointer p-0 bg-transparent"
                      />
                      <span className="text-[10px] font-mono text-slate-500">{customColorHex.toUpperCase()}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddCustomColor}
                      className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Add Custom
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Section */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Visual Image</label>

                  {/* Tab options */}
                  <div className="flex bg-slate-105 p-0.5 rounded-lg border border-slate-200">
                    {(["upload", "preset", "url"] as const).map((tab) => (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setImageTab(tab)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${imageTab === tab
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500 hover:text-slate-900"
                          }`}
                      >
                        {tab === "upload" ? "Upload" : tab === "preset" ? "Presets" : "URL"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main preview box */}
                {formData.image && (
                  <div className="relative aspect-[3/4] w-32 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 mx-auto shadow-sm group">
                    <img
                      src={formData.image}
                      alt="Visual Preview"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                        className="p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Tab content 1: Upload */}
                {imageTab === "upload" && (
                  <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/10 rounded-xl p-4 transition-all text-center relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="space-y-1 pointer-events-none">
                      <Plus size={20} className="mx-auto text-slate-400" />
                      <span className="block text-xs font-semibold text-slate-700">Choose file or drag & drop</span>
                      <span className="block text-[10px] text-slate-400">Supports PNG, JPG, WEBP up to 5MB</span>
                    </div>
                  </div>
                )}

                {/* Tab content 2: Presets */}
                {imageTab === "preset" && (
                  <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1.5 bg-slate-50 rounded-xl border border-slate-200 scrollbar-thin">
                    {IMAGE_PRESETS.map((p) => {
                      const isSelected = formData.image === p.url;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: p.url }))}
                          className={`relative aspect-[3/4] rounded-lg overflow-hidden border transition-all cursor-pointer ${isSelected
                            ? "ring-2 ring-indigo-500 border-white scale-95 shadow-md"
                            : "border-slate-200 hover:scale-102 hover:shadow-xs"
                            }`}
                        >
                          <img
                            src={p.url}
                            alt={p.name}
                            className="w-full h-full object-cover object-top"
                          />
                          <div className="absolute inset-x-0 bottom-0 bg-slate-900/60 p-1 text-[8px] font-bold text-white uppercase text-center truncate">
                            {p.name}
                          </div>
                          {isSelected && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold shadow-xs">
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {imageTab === "url" && (
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-205 px-4 py-2.5 text-xs outline-none focus:border-indigo-400 rounded-lg"
                  />
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail the fabrics, fits, and silhouettes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-indigo-400 rounded-lg resize-none"
                />
              </div>
            </form>

            <div className="flex gap-3 pt-4 border-t border-slate-100 justify-end flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="border border-slate-200 text-slate-650 text-xs font-semibold tracking-wider uppercase px-5 py-2.5 rounded-full hover:bg-slate-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="product-form"
                className="bg-slate-900 hover:bg-indigo-650 text-white text-xs font-semibold tracking-wider uppercase px-6 py-2.5 rounded-full transition-all shadow cursor-pointer"
              >
                Save Product
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-slate-200/50 shadow-2xl w-full max-w-md overflow-hidden animate-slide-up flex flex-col">

            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900 tracking-wide">Edit Profile</h2>
              <button onClick={() => setIsProfileModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">Name</label>
                <input
                  type="text"
                  value={editProfileForm.name}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, name: e.target.value })}
                  className="bg-slate-50 border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 rounded-lg text-sm"
                  placeholder="Your Name"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <input
                  type="email"
                  value={editProfileForm.email}
                  onChange={(e) => setEditProfileForm({ ...editProfileForm, email: e.target.value })}
                  className="bg-slate-50 border border-slate-200 px-3 py-2 outline-none focus:border-indigo-400 rounded-lg text-sm"
                  placeholder="Email"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">Profile Picture</label>
                <div className="flex items-center gap-4 mt-1">
                  <div className="relative overflow-hidden group rounded-full w-16 h-16 border border-slate-200 shadow-sm flex-shrink-0">
                    <img
                      src={editProfileForm.avatar || `https://ui-avatars.com/api/?name=${editProfileForm.name || "Admin"}`}
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=" + (editProfileForm.name || "Admin"); }}
                      className="w-full h-full object-cover"
                      alt="Preview"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Upload size={18} className="text-white" />
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      title="Upload new avatar"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setEditProfileForm({ ...editProfileForm, avatar: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800">Upload new avatar</span>
                    <span className="text-[10px] text-slate-500">Click the image to upload. Recommended size: 200x200px.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50">
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-slate-600 bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setAdminProfile(editProfileForm);
                  localStorage.setItem("adminProfile", JSON.stringify(editProfileForm));
                  setIsProfileModalOpen(false);
                  showToast("Profile updated successfully!");
                }}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-indigo-650 shadow transition-colors flex items-center gap-2"
              >
                <CheckCircle size={14} /> Save Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
