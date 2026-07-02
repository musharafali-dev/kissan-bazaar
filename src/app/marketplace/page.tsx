"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  FileSpreadsheet, 
  Check, 
  X, 
  Star, 
  Info, 
  ChevronRight, 
  Send,
  User,
  Truck,
  Package,
  Calendar,
  Wallet
} from "lucide-react";

interface Crop {
  id: number;
  name: string;
  farmer: string;
  location: string;
  price: number;
  unit: string;
  rating: number;
  reviewsCount: number;
  isOrganic: boolean;
  grade: string;
  image: string;
  harvested: string;
  stock: number;
}

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("all");
  
  // Views: 'grid' or 'map'
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  
  // Modals / Overlays
  const [activeChatFarmer, setActiveChatFarmer] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{[key: string]: {sender: "buyer" | "farmer", text: string, time: string}[]}>({
    "Sajid Ali": [
      { sender: "farmer", text: "Assalam-o-Alaikum! Fresh apricots are ready. How much do you need?", time: "10:30 AM" }
    ]
  });
  
  const [selectedBulkCrop, setSelectedBulkCrop] = useState<Crop | null>(null);
  const [bulkQty, setBulkQty] = useState("500");
  const [bulkPriceOffer, setBulkPriceOffer] = useState("");
  const [quoteSuccess, setQuoteSuccess] = useState(false);

  // Cart & Checkout state
  const [cart, setCart] = useState<{crop: Crop, quantity: number}[]>([]);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0=none, 1=details, 2=success
  
  // Checkout Form Details
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    phone: "",
    address: "",
    paymentMethod: "cod"
  });

  // Tracked Order state (sandbox)
  const [trackedOrder, setTrackedOrder] = useState<{
    id: string;
    farmer: string;
    crop: string;
    qty: number;
    total: number;
    status: "pending" | "packed" | "shipped" | "delivered";
  } | null>(null);

  // Mock database crops
  const initialCrops: Crop[] = [
    {
      id: 1,
      name: "Fresh Gilgit Apricots",
      farmer: "Sajid Ali",
      location: "Hunza Valley, GB",
      price: 180,
      unit: "kg",
      rating: 4.9,
      reviewsCount: 28,
      isOrganic: true,
      grade: "A",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFF8E7'/><circle cx='200' cy='160' r='80' fill='%23E9B44C'/><circle cx='180' cy='140' r='40' fill='%23F4A460' opacity='0.3'/><path d='M200 80 Q220 40 260 40 Q240 70 200 80' fill='%232D6A4F'/><circle cx='195' cy='155' r='5' fill='%23fff' opacity='0.6'/></svg>",
      harvested: "Today",
      stock: 850
    },
    {
      id: 2,
      name: "Red Swat Tomatoes",
      farmer: "Ghulam Rasool",
      location: "Swat Valley, KP",
      price: 120,
      unit: "kg",
      rating: 4.8,
      reviewsCount: 42,
      isOrganic: true,
      grade: "A",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFEEEE'/><circle cx='200' cy='160' r='80' fill='%23E63946'/><circle cx='170' cy='130' r='30' fill='%23FF5A5F' opacity='0.3'/><path d='M200 80 L190 60 L210 60 Z' fill='%232D6A4F'/><path d='M180 75 Q200 65 220 75' fill='none' stroke='%232D6A4F' stroke-width='8' stroke-linecap='round'/><circle cx='190' cy='145' r='5' fill='%23fff' opacity='0.6'/></svg>",
      harvested: "Yesterday",
      stock: 450
    },
    {
      id: 3,
      name: "Organic Red Potatoes",
      farmer: "Muhammad Irfan",
      location: "Okara, Punjab",
      price: 80,
      unit: "kg",
      rating: 4.7,
      reviewsCount: 19,
      isOrganic: true,
      grade: "B",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23F5EDD0'/><ellipse cx='200' cy='160' rx='95' ry='70' fill='%23A47551'/><circle cx='160' cy='140' r='4' fill='%237B5537'/><circle cx='240' cy='170' r='3' fill='%237B5537'/><circle cx='200' cy='130' r='3' fill='%237B5537'/><circle cx='170' cy='140' r='20' fill='%23BC987E' opacity='0.2'/></svg>",
      harvested: "2 days ago",
      stock: 2400
    },
    {
      id: 4,
      name: "Sindhri Mangoes",
      farmer: "Bashir Khan",
      location: "Mirpur Khas, Sindh",
      price: 250,
      unit: "kg",
      rating: 5.0,
      reviewsCount: 88,
      isOrganic: false,
      grade: "A",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFFDE6'/><path d='M200 90 C150 90 120 140 120 180 C120 220 170 230 200 230 C240 230 280 190 280 150 C280 110 240 90 200 90 Z' fill='%23FFC300'/><path d='M190 90 Q170 50 150 60 Q180 75 190 90' fill='%232D6A4F'/><circle cx='180' cy='130' r='10' fill='%23FFD700' opacity='0.5'/></svg>",
      harvested: "Today",
      stock: 1500
    },
    {
      id: 5,
      name: "Desi Buffalo Ghee",
      farmer: "Amjad Ali",
      location: "Sahiwal, Punjab",
      price: 1800,
      unit: "kg",
      rating: 4.9,
      reviewsCount: 35,
      isOrganic: true,
      grade: "Premium",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFFDF0'/><path d='M150 220 L250 220 L240 120 L160 120 Z' fill='%23E9B44C'/><circle cx='200' cy='160' r='25' fill='%23FFF'/><path d='M200 70 C180 70 160 120 160 120 L240 120 C240 120 220 70 200 70 Z' fill='%23A47551'/></svg>",
      harvested: "3 days ago",
      stock: 120
    },
    {
      id: 6,
      name: "Hunza Sweet Cherries",
      farmer: "Sajid Ali",
      location: "Hunza Valley, GB",
      price: 320,
      unit: "kg",
      rating: 4.8,
      reviewsCount: 16,
      isOrganic: true,
      grade: "A",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFF0F5'/><circle cx='170' cy='170' r='40' fill='%23900C3F'/><circle cx='240' cy='180' r='35' fill='%23C70039'/><path d='M170 130 Q200 100 230 110' fill='none' stroke='%232D6A4F' stroke-width='6' stroke-linecap='round'/><path d='M240 145 Q210 110 230 110' fill='none' stroke='%232D6A4F' stroke-width='6' stroke-linecap='round'/></svg>",
      harvested: "Yesterday",
      stock: 380
    }
  ];

  // Filter Logic
  const filteredCrops = initialCrops.filter((crop) => {
    const matchesSearch = crop.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          crop.farmer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          crop.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
      (selectedCategory === "fruits" && ["apricots", "mangoes", "cherries", "apples"].some(f => crop.name.toLowerCase().includes(f))) ||
      (selectedCategory === "vegetables" && ["tomatoes", "potatoes", "onions"].some(v => crop.name.toLowerCase().includes(v))) ||
      (selectedCategory === "dairy" && ["ghee", "butter", "milk"].some(d => crop.name.toLowerCase().includes(d)));

    const matchesOrganic = !isOrganicOnly || crop.isOrganic;
    const matchesGrade = selectedGrade === "all" || crop.grade === selectedGrade;
    
    return matchesSearch && matchesCategory && matchesOrganic && matchesGrade;
  });

  // Cart operations
  const addToCart = (crop: Crop) => {
    const existing = cart.find(item => item.crop.id === crop.id);
    if (existing) {
      setCart(cart.map(item => item.crop.id === crop.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { crop, quantity: 1 }]);
    }
    setShowCartDrawer(true);
  };

  const updateCartQty = (id: number, amount: number) => {
    setCart(cart.map(item => {
      if (item.crop.id === id) {
        const nextQty = item.quantity + amount;
        return nextQty > 0 ? { ...item, quantity: nextQty } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleWishlist = (id: number) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  // Submit quote request (B2B)
  const handleRequestQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBulkCrop) return;
    setQuoteSuccess(true);
    setTimeout(() => {
      setQuoteSuccess(false);
      setSelectedBulkCrop(null);
    }, 2000);
  };

  // Chat message sender
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChatFarmer || !chatMessage.trim()) return;
    
    const newMessage = { sender: "buyer" as const, text: chatMessage, time: "Just Now" };
    setChatHistory({
      ...chatHistory,
      [activeChatFarmer]: [...(chatHistory[activeChatFarmer] || []), newMessage]
    });
    setChatMessage("");

    // Mock quick farmer auto-response
    setTimeout(() => {
      const response = { 
        sender: "farmer" as const, 
        text: "Ji bilkul, is rate par deal pakki. Order place kar dein.", 
        time: "Just Now" 
      };
      setChatHistory(prev => ({
        ...prev,
        [activeChatFarmer]: [...(prev[activeChatFarmer] || []), response]
      }));
    }, 1500);
  };

  // Place Order checkout
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    // Simulate placing the order
    const totalAmount = cart.reduce((total, item) => total + (item.crop.price * item.quantity), 0);
    setTrackedOrder({
      id: "KB-" + Math.floor(100000 + Math.random() * 900000),
      farmer: cart[0].crop.farmer,
      crop: cart[0].crop.name,
      qty: cart[0].quantity,
      total: totalAmount,
      status: "pending"
    });
    
    setCart([]);
    setCheckoutStep(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-offwhite to-sage/30 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ========================================================
            HEADER ROW
            ======================================================== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Verified Agricultural Hub</span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-primary-dark mt-1">
              Direct Marketplace
            </h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* View Mode Toggle */}
            <div className="bg-sage/40 p-1.5 rounded-full flex gap-1 shadow-inner border border-primary/5">
              <button 
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[38px] ${viewMode === "grid" ? 'bg-primary text-white shadow-sm' : 'text-primary-dark hover:bg-sage/20'}`}
              >
                Grid Catalog
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[38px] ${viewMode === "map" ? 'bg-primary text-white shadow-sm' : 'text-primary-dark hover:bg-sage/20'}`}
              >
                Nearby Farmers Map
              </button>
            </div>

            {/* Shopping Cart button */}
            <button 
              onClick={() => setShowCartDrawer(true)}
              className="p-3 bg-primary hover:bg-primary-dark text-white rounded-full transition-all relative flex items-center justify-center shadow-lg shadow-primary/10 min-h-[48px] min-w-[48px]"
              aria-label="Open Cart"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-secondary text-foreground text-xs font-black flex items-center justify-center border-2 border-offwhite animate-bounce">
                  {cart.reduce((tot, i) => tot + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ========================================================
            SANDBOX ORDER TRACKER BANNER
            ======================================================== */}
        {trackedOrder && (
          <div className="glass-panel p-5 mb-8 border-white/60 shadow-glass animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                  <Truck size={12} /> Live Order Tracking
                </span>
                <h3 className="text-base font-bold text-foreground">Order ID: <span className="text-primary-dark">{trackedOrder.id}</span></h3>
                <p className="text-xs text-foreground/60 mt-0.5">Purchasing {trackedOrder.qty}kg of {trackedOrder.crop} from {trackedOrder.farmer}</p>
              </div>

              {/* Status progression bar */}
              <div className="flex items-center gap-2 flex-grow max-w-md w-full justify-between">
                {[
                  { key: "pending", label: "Pending" },
                  { key: "packed", label: "Packed" },
                  { key: "shipped", label: "Shipped" },
                  { key: "delivered", label: "Delivered" }
                ].map((st, index) => {
                  const statuses = ["pending", "packed", "shipped", "delivered"];
                  const activeIndex = statuses.indexOf(trackedOrder.status);
                  const stepIndex = statuses.indexOf(st.key);
                  return (
                    <React.Fragment key={st.key}>
                      <div className="flex flex-col items-center">
                        <button 
                          onClick={() => setTrackedOrder({ ...trackedOrder, status: st.key as any })}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${stepIndex <= activeIndex ? 'bg-primary border-primary text-white shadow' : 'bg-white border-sage-dark text-foreground/40'}`}
                          title={`Set status to ${st.label}`}
                        >
                          {stepIndex < activeIndex ? <Check size={14} /> : index + 1}
                        </button>
                        <span className="text-[10px] font-bold mt-1 text-foreground/80">{st.label}</span>
                      </div>
                      {index < 3 && (
                        <div className={`flex-grow h-1 rounded transition-colors ${stepIndex < activeIndex ? 'bg-primary' : 'bg-sage-dark/40'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              <button 
                onClick={() => setTrackedOrder(null)}
                className="text-xs font-bold text-foreground/50 hover:text-foreground/80 p-2 min-h-[48px]"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            VIEW MODE: MAP OF NEARBY FARMERS
            ======================================================== */}
        {viewMode === "map" ? (
          <div className="glass-panel p-6 border-white/60 shadow-glass mb-8 aspect-[16/9] min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            {/* Mock Map Background Canvas */}
            <div className="absolute inset-0 bg-sage-light/20 z-0">
              {/* Map grid lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-30 pointer-events-none">
                {Array.from({length:36}).map((_, i) => (
                  <div key={i} className="border border-primary/10" />
                ))}
              </div>
              
              {/* Stylized topography paths */}
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <path d="M 50 150 Q 200 50 400 200 T 800 100" fill="none" stroke="#2D6A4F" strokeWidth="8" />
                <path d="M 100 250 Q 300 120 600 280" fill="none" stroke="#A47551" strokeWidth="4" />
              </svg>
            </div>

            {/* Map Header Overlay */}
            <div className="relative z-10 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-primary/5 shadow max-w-sm">
              <h3 className="text-sm font-bold text-primary-dark">Interactive Farmer Locator</h3>
              <p className="text-xs text-foreground/60 mt-1">Viewing verified farms within a <span className="font-bold text-primary">{radius} km</span> radius around Hunza/Gilgit.</p>
            </div>

            {/* Interactive Pins */}
            <div className="absolute top-[25%] left-[20%] z-10 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg animate-bounce border-2 border-white">
                👨‍🌾
              </div>
              <div className="absolute top-12 left-0 bg-white p-3 rounded-2xl shadow border border-primary/15 hidden group-hover:block w-48 text-xs">
                <p className="font-bold text-primary-dark">Hunza Apricot Orchards</p>
                <p className="text-[10px] text-foreground/60">Farmer: Sajid Ali</p>
                <button 
                  onClick={() => setActiveChatFarmer("Sajid Ali")}
                  className="mt-2 w-full bg-primary text-white py-1 rounded-full font-bold text-[10px]"
                >
                  Chat with Sajid
                </button>
              </div>
            </div>

            <div className="absolute bottom-[35%] right-[25%] z-10 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg animate-bounce border-2 border-white">
                👩‍🌾
              </div>
              <div className="absolute top-12 left-0 bg-white p-3 rounded-2xl shadow border border-primary/15 hidden group-hover:block w-48 text-xs">
                <p className="font-bold text-primary-dark">Swat Tomato Fields</p>
                <p className="text-[10px] text-foreground/60">Farmer: Ghulam Rasool</p>
                <button 
                  onClick={() => setActiveChatFarmer("Ghulam Rasool")}
                  className="mt-2 w-full bg-primary text-white py-1 rounded-full font-bold text-[10px]"
                >
                  Chat with Ghulam
                </button>
              </div>
            </div>

            <div className="absolute top-[50%] left-[60%] z-10 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground shadow-lg animate-bounce border-2 border-white">
                📍
              </div>
              <div className="absolute top-12 left-0 bg-white p-3 rounded-2xl shadow border-primary/15 hidden group-hover:block w-48 text-xs">
                <p className="font-bold text-foreground">You are here</p>
                <p className="text-[10px] text-foreground/60">Okara Town Center</p>
              </div>
            </div>

            {/* Map Zoom Controls */}
            <div className="relative z-10 self-end flex flex-col gap-1 shadow bg-white p-1 rounded-full border border-primary/10">
              <button className="w-8 h-8 rounded-full hover:bg-sage/10 text-primary font-bold">+</button>
              <button className="w-8 h-8 rounded-full hover:bg-sage/10 text-primary font-bold">-</button>
            </div>

          </div>
        ) : (
          /* ========================================================
              VIEW MODE: GRID CATALOG & FILTERS
              ======================================================== */
          <>
            {/* Filter Toolbar */}
            <div className="glass-panel p-6 mb-8 shadow-glass-soft border-white/50 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Category Filter */}
              <div className="lg:col-span-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {["all", "fruits", "vegetables"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`py-2 rounded-xl text-xs font-bold capitalize transition-all min-h-[38px] ${selectedCategory === cat ? 'bg-primary text-white shadow-sm' : 'bg-white hover:bg-sage/10 border border-primary/10 text-primary'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search input */}
              <div className="lg:col-span-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                  Search Crops
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search name, region..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/70 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary text-xs font-sans min-h-[38px]"
                  />
                </div>
              </div>

              {/* Radius filter */}
              <div className="lg:col-span-3">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5 flex justify-between">
                  <span>Farmer Distance</span>
                  <span className="text-primary font-bold">{radius} km</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="150" 
                  value={radius}
                  onChange={(e) => setRadius(parseInt(e.target.value))}
                  className="w-full accent-primary h-2 bg-sage/60 rounded-lg cursor-pointer my-3.5"
                />
              </div>

              {/* Grade & Organic filter */}
              <div className="lg:col-span-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    Quality Grade
                  </label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-xs font-sans min-h-[38px]"
                  >
                    <option value="all">All Grades</option>
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="Premium">Premium</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer py-2">
                    <input 
                      type="checkbox"
                      checked={isOrganicOnly}
                      onChange={() => setIsOrganicOnly(!isOrganicOnly)}
                      className="rounded text-primary border-primary/20 accent-primary w-4 h-4 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-foreground/75">Organic Certified</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Crops Catalog Grid */}
            {filteredCrops.length === 0 ? (
              <div className="glass-panel p-16 text-center border-white/60 shadow-glass-soft py-24">
                <Info size={48} className="text-primary/30 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-black text-primary-dark">No crops match your filter criteria</h3>
                <p className="text-sm text-foreground/50 mt-1 max-w-sm mx-auto">Try widening your radius or searching for general crops like potato or apricot.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCrops.map((crop) => (
                  <div key={crop.id} className="glass-panel overflow-hidden flex flex-col justify-between group shadow-glass-soft border-white/60 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                    
                    {/* Visual Crop Card Header */}
                    <div className="aspect-[4/3] relative w-full overflow-hidden bg-sage-light">
                      <Image 
                        src={crop.image} 
                        alt={crop.name} 
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      
                      {/* Quality Grade Badge */}
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-primary px-2.5 py-1 rounded-full shadow-sm border border-primary/10">
                        Grade {crop.grade}
                      </span>
                      
                      {/* Organic certified badge */}
                      {crop.isOrganic && (
                        <span className="absolute top-3 right-3 bg-secondary text-foreground text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                          Organic
                        </span>
                      )}

                      {/* Stock availability */}
                      <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-xs font-bold text-white px-2 py-0.5 rounded">
                        Available: {crop.stock}kg
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs text-foreground/50 mb-1">
                          <span className="flex items-center gap-1"><MapPin size={12} /> {crop.location}</span>
                          <span>Harvested {crop.harvested}</span>
                        </div>
                        
                        <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                          {crop.name}
                        </h3>

                        {/* Farmer card info */}
                        <div className="flex items-center justify-between bg-primary/5 py-1.5 px-3 rounded-xl border border-primary/5 mb-4">
                          <span className="text-xs font-semibold text-primary-dark flex items-center gap-1">
                            👨‍🌾 {crop.farmer}
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          </span>
                          
                          {/* Chat Shortcut */}
                          <button 
                            onClick={() => setActiveChatFarmer(crop.farmer)}
                            className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                          >
                            <MessageSquare size={10} /> Chat Direct
                          </button>
                        </div>
                      </div>

                      {/* Footer pricing and direct CTAs */}
                      <div className="pt-3 border-t border-sage/20 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">Direct Price</span>
                            <span className="text-lg font-black text-primary">Rs. {crop.price}<span className="text-xs text-foreground/60 font-medium">/{crop.unit}</span></span>
                          </div>
                          
                          <div className="flex gap-1">
                            {/* B2B Quote Request */}
                            <button 
                              onClick={() => setSelectedBulkCrop(crop)}
                              className="p-2 border border-primary/20 hover:bg-primary/5 rounded-full text-primary min-h-[48px] min-w-[48px] flex items-center justify-center"
                              title="Request Bulk Quote"
                            >
                              <FileSpreadsheet size={18} />
                            </button>
                            <button 
                              onClick={() => toggleWishlist(crop.id)}
                              className="p-2 border border-primary/20 hover:bg-red-50 rounded-full text-red-500 min-h-[48px] min-w-[48px] flex items-center justify-center"
                              title="Add to Wishlist"
                            >
                              <Heart size={18} className={wishlist.includes(crop.id) ? "fill-red-500 text-red-500" : ""} />
                            </button>
                          </div>
                        </div>

                        {/* Direct Buy Button */}
                        <button 
                          onClick={() => addToCart(crop)}
                          className="w-full bg-primary hover:bg-primary-dark text-white font-sans text-xs font-bold py-2.5 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 min-h-[48px]"
                        >
                          <ShoppingBag size={14} />
                          <span>Add to Basket</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ========================================================
            B2B BULK QUOTE REQUEST MODAL
            ======================================================== */}
        {selectedBulkCrop && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-primary/10 animate-fade-in relative">
              <button 
                onClick={() => setSelectedBulkCrop(null)}
                className="absolute top-4 right-4 p-2 hover:bg-sage/10 rounded-full text-foreground/40"
              >
                <X size={18} />
              </button>

              {quoteSuccess ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4 border-2 border-green-500">
                    <Check size={24} className="stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-dark">Quote Request Sent!</h3>
                  <p className="text-xs text-foreground/60 mt-1">{selectedBulkCrop.farmer} will review and respond via Chat shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleRequestQuote} className="space-y-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">B2B Bulk Quote</span>
                    <h3 className="text-lg font-heading font-black text-primary-dark mt-2">Request Quote for {selectedBulkCrop.name}</h3>
                    <p className="text-xs text-foreground/60 mt-0.5">Farmer Gate Rate: Rs. {selectedBulkCrop.price}/kg. Min order quantity: 100kg.</p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      1. Required Quantity (kg)
                    </label>
                    <input 
                      type="number"
                      value={bulkQty}
                      onChange={(e) => setBulkQty(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                      min="100"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      2. Offered Price per kg (Optional)
                    </label>
                    <input 
                      type="number"
                      placeholder={`Target e.g. ${selectedBulkCrop.price - 20}`}
                      value={bulkPriceOffer}
                      onChange={(e) => setBulkPriceOffer(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                    />
                    <span className="text-[10px] text-foreground/40 mt-1 block">Leave empty to request farmer&apos;s best commercial rate.</span>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary-dark text-foreground font-sans font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-secondary/15 min-h-[48px]"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Submit Bulk Request</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            IN-APP CHAT OVERLAY SANDBOX
            ======================================================== */}
        {activeChatFarmer && (
          <div className="fixed bottom-4 right-4 z-40 w-full max-w-sm glass-panel p-4 shadow-modal border-white/80 animate-slide-up flex flex-col h-[400px]">
            
            {/* Chat header */}
            <div className="flex justify-between items-center pb-2 border-b border-sage/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                  {activeChatFarmer[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{activeChatFarmer}</h4>
                  <span className="text-[9px] text-green-500 font-bold flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Online
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setActiveChatFarmer(null)}
                className="p-1 hover:bg-sage/10 rounded-full text-foreground/40 min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            {/* Chat body messages list */}
            <div className="flex-grow overflow-y-auto py-3 space-y-2.5">
              {(chatHistory[activeChatFarmer] || []).map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.sender === "buyer" ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${msg.sender === "buyer" ? 'bg-primary text-white rounded-tr-none' : 'bg-sage-light text-primary-dark rounded-tl-none border border-primary/5'}`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-foreground/40 mt-1 px-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat footer input form */}
            <form onSubmit={handleSendMessage} className="pt-2 border-t border-sage/20 flex gap-2">
              <input 
                type="text" 
                placeholder="Negotiate price or ask questions..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-grow px-3 py-2 rounded-xl border border-primary/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white min-h-[48px]"
                required
              />
              <button 
                type="submit"
                className="p-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors flex items-center justify-center min-h-[48px] min-w-[48px]"
                aria-label="Send Message"
              >
                <Send size={14} />
              </button>
            </form>

          </div>
        )}

        {/* ========================================================
            SHOPPING BASKET DRAWER / CHECKOUT MODAL
            ======================================================== */}
        {showCartDrawer && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-in-right relative">
              
              {/* Close Button */}
              <button 
                onClick={() => {
                  setShowCartDrawer(false);
                  setCheckoutStep(0);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-sage/10 rounded-full text-foreground/40 min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <X size={20} />
              </button>

              {/* Basket list */}
              {checkoutStep === 0 && (
                <>
                  <div className="flex-grow flex flex-col">
                    <h2 className="text-xl font-heading font-black text-primary-dark mb-6">Your Fresh Basket</h2>
                    
                    {cart.length === 0 ? (
                      <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <ShoppingBag size={48} className="text-primary/20 mb-3" />
                        <h4 className="text-sm font-bold text-foreground/80">Your basket is empty</h4>
                        <p className="text-xs text-foreground/50 mt-1">Browse our direct farmer catalog to add items.</p>
                      </div>
                    ) : (
                      <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                        {cart.map((item) => (
                          <div key={item.crop.id} className="flex justify-between items-center p-3 bg-sage/15 rounded-2xl border border-primary/5">
                            <div>
                              <h4 className="text-sm font-bold text-foreground">{item.crop.name}</h4>
                              <span className="text-xs text-primary-dark font-extrabold block mt-0.5">Rs. {item.crop.price}/kg</span>
                              <span className="text-[10px] text-foreground/50">Sold by: {item.crop.farmer}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {/* Quantity adjustment buttons */}
                              <button 
                                onClick={() => updateCartQty(item.crop.id, -1)}
                                className="w-7 h-7 rounded-full bg-white hover:bg-sage/10 text-primary border border-primary/10 flex items-center justify-center text-sm font-bold min-h-[48px]"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-foreground">{item.quantity} kg</span>
                              <button 
                                onClick={() => updateCartQty(item.crop.id, 1)}
                                className="w-7 h-7 rounded-full bg-white hover:bg-sage/10 text-primary border border-primary/10 flex items-center justify-center text-sm font-bold min-h-[48px]"
                              >
                                +
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing footer summary */}
                  {cart.length > 0 && (
                    <div className="pt-4 border-t border-sage/20 space-y-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-foreground/75">Subtotal</span>
                        <span className="text-primary">Rs. {cart.reduce((tot, i) => tot + (i.crop.price * i.quantity), 0)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-foreground/50">
                        <span>Middleman Commission</span>
                        <span className="line-through text-red-500">Rs. {Math.round(cart.reduce((tot, i) => tot + (i.crop.price * i.quantity), 0) * 0.15)} (0%)</span>
                      </div>

                      <button 
                        onClick={() => setCheckoutStep(1)}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-sans font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 min-h-[48px]"
                      >
                        <span>Proceed to Checkout</span>
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Checkout details step */}
              {checkoutStep === 1 && (
                <form onSubmit={handleCheckoutSubmit} className="flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="text-xl font-heading font-black text-primary-dark">Delivery Details</h2>
                    
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                        Your Full Name
                      </label>
                      <input 
                        type="text" 
                        placeholder="e.g. Asif Munir"
                        value={shippingDetails.name}
                        onChange={(e) => setShippingDetails({...shippingDetails, name: e.target.value})}
                        className="w-full px-4 py-2.5 rounded-xl border border-primary/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white min-h-[48px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                        Mobile Phone
                      </label>
                      <input 
                        type="tel" 
                        placeholder="03001234567"
                        value={shippingDetails.phone}
                        onChange={(e) => setShippingDetails({...shippingDetails, phone: e.target.value.replace(/[^0-9]/g, "")})}
                        className="w-full px-4 py-2.5 rounded-xl border border-primary/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white min-h-[48px]"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                        Delivery Address
                      </label>
                      <textarea 
                        placeholder="House / Shop Number, Street Name, City"
                        value={shippingDetails.address}
                        onChange={(e) => setShippingDetails({...shippingDetails, address: e.target.value})}
                        className="w-full px-4 py-2 rounded-xl border border-primary/10 text-xs focus:outline-none focus:ring-2 focus:ring-primary bg-white min-h-[48px]"
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-2">
                        Payment Method
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setShippingDetails({...shippingDetails, paymentMethod: "cod"})}
                          className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all min-h-[48px] ${shippingDetails.paymentMethod === "cod" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                        >
                          Cash on Delivery (COD)
                        </button>
                        <button
                          type="button"
                          onClick={() => setShippingDetails({...shippingDetails, paymentMethod: "advance"})}
                          className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all min-h-[48px] ${shippingDetails.paymentMethod === "advance" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                        >
                          Easypaisa / Bank
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-sage/20">
                    <button 
                      type="submit"
                      className="w-full bg-secondary hover:bg-secondary-dark text-foreground font-sans font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-secondary/15 min-h-[48px]"
                    >
                      <Wallet size={16} />
                      <span>Place Direct Order</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Checkout success step */}
              {checkoutStep === 2 && (
                <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-4 border-green-500 flex items-center justify-center text-green-600 mb-4 shadow animate-bounce">
                    <Check size={32} className="stroke-[3]" />
                  </div>
                  <h3 className="text-xl font-heading font-black text-primary-dark">Direct Order Placed!</h3>
                  <p className="text-xs text-foreground/75 mt-2 max-w-xs leading-relaxed">
                    Your order details have been sent directly to the farmer. Track the delivery status in the live order tracking dashboard.
                  </p>
                  
                  <button 
                    onClick={() => {
                      setShowCartDrawer(false);
                      setCheckoutStep(0);
                    }}
                    className="mt-8 bg-primary hover:bg-primary-dark text-white font-sans text-xs font-bold py-3 px-6 rounded-full transition-all shadow-md min-h-[48px]"
                  >
                    Continue Browsing
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
