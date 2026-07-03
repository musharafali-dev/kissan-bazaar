"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  ShoppingBag, 
  Heart, 
  MessageSquare, 
  FileSpreadsheet, 
  Check, 
  X, 
  Info, 
  ChevronRight, 
  Send,
  Truck,
  Wallet,
  Phone,
  MessageCircle,
  Star,
  Sparkles,
  Volume2
} from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { staticCrops, Crop } from "@/data/products";

export default function MarketplacePage() {
  const { isUrdu } = useLanguageStore();
  const [crops, setCrops] = useState<Crop[]>(staticCrops);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(30);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  
  // Views: 'grid' or 'map'
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  
  // Modals / Overlays
  const [activeChatFarmer, setActiveChatFarmer] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{[key: string]: {sender: "buyer" | "farmer", text: string, time: string}[]}>({
    "Sajid Ali": [
      { sender: "farmer", text: "Assalam-o-Alaikum! Fresh apricots are ready. How much do you need?", time: "10:30 AM" }
    ],
    "ساجد علی": [
      { sender: "farmer", text: "السلام علیکم! خوبانی تیار ہے۔ آپ کو کتنی مقدار چاہیے؟", time: "10:30 AM" }
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

  // EXTRA MODULE 1: Call/WhatsApp Direct Contact Modal
  const [contactFarmer, setContactFarmer] = useState<Crop | null>(null);
  const [callingState, setCallingState] = useState<"idle" | "ringing" | "connected">("idle");

  // EXTRA MODULE 2: Review & Feedback Modal
  const [reviewCrop, setReviewCrop] = useState<Crop | null>(null);
  const [userStars, setUserStars] = useState(5);
  const [userComment, setUserComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // EXTRA MODULE 3: Kissan Dost AI Advisor Widget
  const [showAiAdvisor, setShowAiAdvisor] = useState(false);
  const [aiHistory, setAiHistory] = useState<{ sender: "user" | "ai", text: string }[]>([
    { sender: "ai", text: "Assalam-o-Alaikum! I am Kissan Dost AI. How can I help you today? / السلام علیکم! میں کسان دوست اے آئی ہوں۔ میں آج آپ کی کیا مدد کر سکتا ہوں؟" }
  ]);
  const [aiInput, setAiInput] = useState("");

  // Ticker rates derived from crops for variety
  const tickerRates = crops.slice(0, 10).map(c => ({
    name: isUrdu ? c.nameUr.split(" (")[0] : c.nameEn.replace("Fresh ", ""),
    price: c.price,
    unit: isUrdu ? c.unitUr : c.unitEn,
    change: Math.random() > 0.4 ? `+${Math.floor(2 + Math.random() * 8)}%` : `-${Math.floor(1 + Math.random() * 4)}%`
  }));

  // Filter Logic
  const filteredCrops = crops.filter((crop) => {
    const cropName = isUrdu ? crop.nameUr : crop.nameEn;
    const farmerName = isUrdu ? crop.farmerUr : crop.farmerEn;
    const location = isUrdu ? crop.locationUr : crop.locationEn;

    const matchesSearch = cropName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || crop.category === selectedCategory;
    const matchesOrganic = !isOrganicOnly || crop.isOrganic;
    const matchesGrade = selectedGrade === "all" || crop.grade === selectedGrade;

    // Price range filters
    const matchesMinPrice = minPrice === "" || crop.price >= parseFloat(minPrice);
    const matchesMaxPrice = maxPrice === "" || crop.price <= parseFloat(maxPrice);
    
    return matchesSearch && matchesCategory && matchesOrganic && matchesGrade && matchesMinPrice && matchesMaxPrice;
  }).sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "stock") return b.stock - a.stock;
    return 0; // default
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
    
    const newMessage = { sender: "buyer" as const, text: chatMessage, time: isUrdu ? "ابھی" : "Just Now" };
    setChatHistory({
      ...chatHistory,
      [activeChatFarmer]: [...(chatHistory[activeChatFarmer] || []), newMessage]
    });
    setChatMessage("");

    setTimeout(() => {
      const responseText = isUrdu 
        ? "جی بالکل، اس ریٹ پر سودا پکا۔ آرڈر بک کر دیں۔"
        : "Yes, this rate is fine. Please place your order.";
      const response = { 
        sender: "farmer" as const, 
        text: responseText, 
        time: isUrdu ? "ابھی" : "Just Now" 
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
    
    const totalAmount = cart.reduce((total, item) => total + (item.crop.price * item.quantity), 0);
    setTrackedOrder({
      id: "KB-" + Math.floor(100000 + Math.random() * 900000),
      farmer: isUrdu ? cart[0].crop.farmerUr : cart[0].crop.farmerEn,
      crop: isUrdu ? cart[0].crop.nameUr : cart[0].crop.nameEn,
      qty: cart[0].quantity,
      total: totalAmount,
      status: "pending"
    });
    
    setCart([]);
    setCheckoutStep(2);
  };

  // Call simulation handler
  const handleCallFarmer = () => {
    setCallingState("ringing");
    setTimeout(() => {
      setCallingState("connected");
    }, 2000);
  };

  // Review submission handler
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewCrop) return;

    // Update locally
    setCrops(crops.map(c => {
      if (c.id === reviewCrop.id) {
        const newReviewsCount = c.reviewsCount + 1;
        const newRating = parseFloat(((c.rating * c.reviewsCount + userStars) / newReviewsCount).toFixed(1));
        return {
          ...c,
          rating: newRating,
          reviewsCount: newReviewsCount
        };
      }
      return c;
    }));

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewCrop(null);
      setUserComment("");
    }, 2000);
  };

  // AI Advisor question response generator
  const askAiAdvisor = (questionText: string) => {
    const userMsg = { sender: "user" as const, text: questionText };
    setAiHistory(prev => [...prev, userMsg]);
    setAiInput("");

    setTimeout(() => {
      let aiResponse = "";
      const q = questionText.toLowerCase();

      if (q.includes("sell") || q.includes("بیچ")) {
        aiResponse = isUrdu 
          ? "کسان بازار پر اپنی فصلیں بیچنا بہت آسان ہے۔ ڈیش بورڈ پر جائیں، 'فصل شامل کریں' پر کلک کریں اور 3 کلک میں اپنی فصل کی معلومات درج کریں۔"
          : "Selling on Kissan Bazaar is simple! Go to your Farmer Dashboard, click 'Quick List Crop', enter weight & price, and submit in 3 clicks.";
      } else if (q.includes("price") || q.includes("ریٹ") || q.includes("قیمت")) {
        aiResponse = isUrdu 
          ? "آج کے تازہ ترین منڈی ریٹس جاننے کے لیے اوپر مینو میں 'منڈی ریٹس' پر کلک کریں۔ خوبانی اور ٹماٹر کی قیمتوں میں آج اضافہ دیکھا گیا ہے۔"
          : "To view live regional rates, click 'Mandi Rates' in the main menu. Today, apricot and Swat tomato prices are trending upwards.";
      } else if (q.includes("subsidy") || q.includes("سبسڈی")) {
        aiResponse = isUrdu 
          ? "حکومت کی جانب سے گرین ٹریکٹر اسکیم اور سولر ٹیوب ویل سبسڈی کی درخواستیں شروع ہیں۔ آپ 'منڈی ریٹس' پیج پر جا کر اسکیم کی تفصیلات دیکھ سکتے ہیں۔"
          : "Applications for the Green Tractor Scheme (50% subsidy) and Solar Tube-well grants are open. See full details on the 'Mandi Rates' page.";
      } else {
        aiResponse = isUrdu 
          ? "میں آپ کی بات سمجھ گیا ہوں۔ براہ کرم کھیتی باڑی، منڈی کے ریٹس، یا کسان بازار کے استعمال سے متعلق سوال پوچھیں۔"
          : "I understand! Please ask me questions about organic farming, mandi market rates, buyer negotiation, or Kissan Bazaar settings.";
      }

      setAiHistory(prev => [...prev, { sender: "ai" as const, text: aiResponse }]);
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-offwhite to-sage/30 p-4 md:p-8 ${isUrdu ? "rtl-grid text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        
        {/* Mandi Rate Alerts Ticker */}
        <div className="relative overflow-hidden w-full bg-primary-dark text-sage-light py-2 px-4 rounded-2xl mb-8 flex items-center gap-3 border border-white/10 shadow-lg">
          <div className="flex items-center gap-1 text-secondary font-sans font-bold shrink-0 bg-primary/40 px-2 py-0.5 rounded-lg text-xs md:text-sm">
            <Volume2 size={14} className="animate-pulse" />
            <span>{isUrdu ? "منڈی ریٹس الرٹ:" : "Mandi Live Ticker:"}</span>
          </div>
          <div className="flex-grow overflow-x-hidden font-sans text-xs md:text-sm">
            <div className="flex gap-8 whitespace-nowrap animate-marquee">
              {tickerRates.map((rate, idx) => (
                <span key={idx} className="inline-block">
                  <span className="font-bold text-white">{rate.name}:</span>{" "}
                  <span className="text-secondary font-black">Rs. {rate.price}/{rate.unit}</span>{" "}
                  <span className={`text-[10px] font-bold px-1 rounded ${rate.change.startsWith("+") ? 'text-green-400' : 'text-red-400'}`}>{rate.change}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* HEADER ROW */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              {isUrdu ? "تصدیق شدہ زرعی مرکز" : "Verified Agricultural Hub"}
            </span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-primary-dark mt-1">
              {isUrdu ? "براہ راست کسان مارکیٹ" : "Direct Marketplace"}
            </h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-sage/40 p-1.5 rounded-full flex gap-1 shadow-inner border border-primary/5">
              <button 
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[38px] ${viewMode === "grid" ? 'bg-primary text-white shadow-sm' : 'text-primary-dark hover:bg-sage/20'}`}
              >
                {isUrdu ? "گریڈ کیٹلاگ" : "Grid Catalog"}
              </button>
              <button 
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all min-h-[38px] ${viewMode === "map" ? 'bg-primary text-white shadow-sm' : 'text-primary-dark hover:bg-sage/20'}`}
              >
                {isUrdu ? "قریبی کسان نقشہ" : "Nearby Farmers Map"}
              </button>
            </div>

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

        {/* SANDBOX ORDER TRACKER BANNER */}
        {trackedOrder && (
          <div className="glass-panel p-5 mb-8 border-white/60 shadow-glass animate-fade-in text-left" dir="ltr">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
                  <Truck size={12} /> Live Order Tracking / آرڈر ٹریکر
                </span>
                <h3 className="text-base font-bold text-foreground">Order ID: <span className="text-primary-dark">{trackedOrder.id}</span></h3>
                <p className="text-xs text-foreground/60 mt-0.5">Purchasing {trackedOrder.qty}kg of {trackedOrder.crop} from {trackedOrder.farmer}</p>
              </div>

              <div className="flex items-center gap-2 flex-grow max-w-md w-full justify-between">
                {[
                  { key: "pending", label: isUrdu ? "پینڈنگ" : "Pending" },
                  { key: "packed", label: isUrdu ? "پیکڈ" : "Packed" },
                  { key: "shipped", label: isUrdu ? "روانہ" : "Shipped" },
                  { key: "delivered", label: isUrdu ? "پہنچ گیا" : "Delivered" }
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

        {/* VIEW MODE: MAP OF NEARBY FARMERS */}
        {viewMode === "map" ? (
          <div className="glass-panel p-6 border-white/60 shadow-glass mb-8 aspect-[16/9] min-h-[400px] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-sage-light/20 z-0">
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-30 pointer-events-none">
                {Array.from({length:36}).map((_, i) => (
                  <div key={i} className="border border-primary/10" />
                ))}
              </div>
              <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none">
                <path d="M 50 150 Q 200 50 400 200 T 800 100" fill="none" stroke="#2D6A4F" strokeWidth="8" />
                <path d="M 100 250 Q 300 120 600 280" fill="none" stroke="#A47551" strokeWidth="4" />
              </svg>
            </div>

            <div className="relative z-10 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-primary/5 shadow max-w-sm">
              <h3 className="text-sm font-bold text-primary-dark">{isUrdu ? "قریبی کسان لوکیٹر" : "Interactive Farmer Locator"}</h3>
              <p className="text-xs text-foreground/60 mt-1">{isUrdu ? `گلگت / ہنزہ کے ارد گرد ${radius} کلومیٹر کے دائرے میں کسان۔` : `Viewing verified farms within a ${radius} km radius around Hunza/Gilgit.`}</p>
            </div>

            {/* Pins */}
            <div className="absolute top-[25%] left-[20%] z-10 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg animate-bounce border-2 border-white">
                👨‍🌾
              </div>
              <div className="absolute top-12 left-0 bg-white p-3 rounded-2xl shadow border border-primary/15 hidden group-hover:block w-48 text-xs">
                <p className="font-bold text-primary-dark">{isUrdu ? "خوبانی کے باغات ہنزہ" : "Hunza Apricot Orchards"}</p>
                <p className="text-[10px] text-foreground/60">{isUrdu ? "کسان: ساجد علی" : "Farmer: Sajid Ali"}</p>
                <button 
                  onClick={() => setActiveChatFarmer(isUrdu ? "ساجد علی" : "Sajid Ali")}
                  className="mt-2 w-full bg-primary text-white py-1 rounded-full font-bold text-[10px]"
                >
                  {isUrdu ? "ساجد سے بات کریں" : "Chat with Sajid"}
                </button>
              </div>
            </div>

            <div className="absolute bottom-[35%] right-[25%] z-10 group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow-lg animate-bounce border-2 border-white">
                👩‍🌾
              </div>
              <div className="absolute top-12 left-0 bg-white p-3 rounded-2xl shadow border border-primary/15 hidden group-hover:block w-48 text-xs">
                <p className="font-bold text-primary-dark">{isUrdu ? "سوات ٹماٹر کے کھیت" : "Swat Tomato Fields"}</p>
                <p className="text-[10px] text-foreground/60">{isUrdu ? "کسان: غلام رسول" : "Farmer: Ghulam Rasool"}</p>
                <button 
                  onClick={() => setActiveChatFarmer(isUrdu ? "غلام رسول" : "Ghulam Rasool")}
                  className="mt-2 w-full bg-primary text-white py-1 rounded-full font-bold text-[10px]"
                >
                  {isUrdu ? "غلام رسول سے بات کریں" : "Chat with Ghulam"}
                </button>
              </div>
            </div>

            <div className="relative z-10 self-end flex flex-col gap-1 shadow bg-white p-1 rounded-full border border-primary/10">
              <button className="w-8 h-8 rounded-full hover:bg-sage/10 text-primary font-bold">+</button>
              <button className="w-8 h-8 rounded-full hover:bg-sage/10 text-primary font-bold">-</button>
            </div>
          </div>
        ) : (
          /* VIEW MODE: GRID CATALOG & FILTERS */
          <>
            {/* Filter Toolbar */}
            <div className="glass-panel p-6 mb-8 shadow-glass-soft border-white/50 space-y-4">
              
              {/* Row 1: Category, Search, Distance, Grade */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                {/* Category Filter */}
                <div className="lg:col-span-4">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    {isUrdu ? "اقسام" : "Category"}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { id: "all", labelEn: "All", labelUr: "سب" },
                      { id: "fruits", labelEn: "Fruits", labelUr: "پھل" },
                      { id: "vegetables", labelEn: "Vegetables", labelUr: "سبزیاں" },
                      { id: "dairy", labelEn: "Dairy", labelUr: "دودھ/گھی" },
                      { id: "grains", labelEn: "Grains", labelUr: "اناج" },
                      { id: "nuts", labelEn: "Nuts", labelUr: "خشک میوہ" }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[38px] ${selectedCategory === cat.id ? 'bg-primary text-white shadow-sm' : 'bg-white hover:bg-sage/10 border border-primary/10 text-primary'}`}
                      >
                        {isUrdu ? cat.labelUr : cat.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Search input */}
                <div className="lg:col-span-3">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    {isUrdu ? "فصلیں تلاش کریں" : "Search Crops"}
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                    <input 
                      type="text" 
                      placeholder={isUrdu ? "فصل، علاقہ یا کسان تلاش کریں..." : "Search name, region..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/70 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary text-xs font-sans min-h-[38px]"
                    />
                  </div>
                </div>

                {/* Radius filter */}
                <div className="lg:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5 flex justify-between">
                    <span>{isUrdu ? "کسان کا فاصلہ" : "Farmer Distance"}</span>
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
                      {isUrdu ? "معیار کا گریڈ" : "Quality Grade"}
                    </label>
                    <select
                      value={selectedGrade}
                      onChange={(e) => setSelectedGrade(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-xs font-sans min-h-[38px]"
                    >
                      <option value="all">{isUrdu ? "تمام گریڈز" : "All Grades"}</option>
                      <option value="A">{isUrdu ? "گریڈ A" : "Grade A"}</option>
                      <option value="B">{isUrdu ? "گریڈ B" : "Grade B"}</option>
                      <option value="Premium">{isUrdu ? "پریمیئم" : "Premium"}</option>
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
                      <span className="text-xs font-bold text-foreground/75">{isUrdu ? "نامیاتی تصدیق" : "Organic Certified"}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Row 2: Sort, Price Range, and Reset */}
              <div className="border-t border-sage/20 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {/* Price Range */}
                <div className="flex gap-2 items-center">
                  <div className="flex-grow">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1">
                      {isUrdu ? "کم سے کم قیمت (روپے)" : "Min Price (Rs.)"}
                    </label>
                    <input 
                      type="number" 
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-primary/10 bg-white/70 text-xs font-sans min-h-[38px] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-grow">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1">
                      {isUrdu ? "زیادہ سے زیادہ قیمت (روپے)" : "Max Price (Rs.)"}
                    </label>
                    <input 
                      type="number" 
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl border border-primary/10 bg-white/70 text-xs font-sans min-h-[38px] focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1">
                    {isUrdu ? "ترتیب دیں" : "Sort By"}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-xs font-sans min-h-[38px]"
                  >
                    <option value="default">{isUrdu ? "ڈیفالٹ (ترتیب)" : "Default Order"}</option>
                    <option value="price-low">{isUrdu ? "قیمت: کم سے زیادہ" : "Price: Low to High"}</option>
                    <option value="price-high">{isUrdu ? "قیمت: زیادہ سے کم" : "Price: High to Low"}</option>
                    <option value="rating">{isUrdu ? "درجہ بندی (ریٹنگ)" : "Customer Rating"}</option>
                    <option value="stock">{isUrdu ? "سٹاک کی مقدار" : "Available Stock"}</option>
                  </select>
                </div>

                {/* Reset filters button */}
                <div className="flex md:justify-end items-end h-full">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setRadius(30);
                      setSelectedCategory("all");
                      setIsOrganicOnly(false);
                      setSelectedGrade("all");
                      setSortBy("default");
                      setMinPrice("");
                      setMaxPrice("");
                    }}
                    className="px-6 py-2 bg-sage/40 hover:bg-sage/70 text-primary-dark rounded-xl text-xs font-bold transition-all min-h-[38px]"
                  >
                    {isUrdu ? "تمام فلٹرز ختم کریں" : "Reset All Filters"}
                  </button>
                </div>
              </div>

            </div>

            {/* Crops Catalog Grid */}
            {filteredCrops.length === 0 ? (
              <div className="glass-panel p-16 text-center border-white/60 shadow-glass-soft py-24">
                <Info size={48} className="text-primary/30 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-black text-primary-dark">{isUrdu ? "کوئی فصل نہیں ملی" : "No crops match your filter criteria"}</h3>
                <p className="text-sm text-foreground/50 mt-1 max-w-sm mx-auto">{isUrdu ? "اپنا فلٹر فاصلہ بڑھائیں یا عمومی نام تلاش کریں۔" : "Try widening your radius or searching for general crops like potato or apricot."}</p>
              </div>
            ) : (
              <div>
                <span className="block text-xs text-foreground/50 mb-4 font-bold">
                  {isUrdu ? `کل ${filteredCrops.length} نتائج ملے۔` : `Showing ${filteredCrops.length} agricultural listings.`}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCrops.map((crop) => (
                    <div key={crop.id} className="glass-panel overflow-hidden flex flex-col justify-between group shadow-glass-soft border-white/60 hover:-translate-y-1.5 hover:shadow-lg transition-all duration-300">
                      
                      <div className="aspect-[4/3] relative w-full overflow-hidden bg-sage-light">
                        <Image 
                          src={crop.image} 
                          alt={isUrdu ? crop.nameUr : crop.nameEn} 
                          fill
                          className="object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        
                        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-primary px-2.5 py-1 rounded-full shadow-sm border border-primary/10">
                          {isUrdu ? `گریڈ ${crop.grade}` : `Grade ${crop.grade}`}
                        </span>
                        
                        {crop.isOrganic && (
                          <span className="absolute top-3 right-3 bg-secondary text-foreground text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                            {isUrdu ? "نامیاتی" : "Organic"}
                          </span>
                        )}

                        <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-xs text-xs font-bold text-white px-2 py-0.5 rounded">
                          {isUrdu ? `دستیاب: ${crop.stock} ${crop.unitUr}` : `Available: ${crop.stock}${crop.unitEn}`}
                        </span>
                      </div>

                      <div className="p-5 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center text-xs text-foreground/50 mb-1">
                            <span className="flex items-center gap-1"><MapPin size={12} /> {isUrdu ? crop.locationUr : crop.locationEn}</span>
                            <span>{isUrdu ? `کٹائی: ${crop.harvestedUr}` : `Harvested ${crop.harvestedEn}`}</span>
                          </div>
                          
                          <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                            {isUrdu ? crop.nameUr : crop.nameEn}
                          </h3>

                          {/* Rating & Write Review button */}
                          <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex text-amber-500">
                              <Star size={14} className="fill-current" />
                            </div>
                            <span className="text-xs font-bold text-foreground/80">{crop.rating}</span>
                            <span className="text-[10px] text-foreground/50">({crop.reviewsCount} {isUrdu ? "ریویوز" : "reviews"})</span>
                            <button 
                              onClick={() => setReviewCrop(crop)}
                              className="text-[10px] text-primary font-bold hover:underline ml-2"
                            >
                              {isUrdu ? "ریویو لکھیں" : "Write Review"}
                            </button>
                          </div>

                          <div className="flex items-center justify-between bg-primary/5 py-1.5 px-3 rounded-xl border border-primary/5 mb-4">
                            <span className="text-xs font-semibold text-primary-dark flex items-center gap-1">
                              👨‍🌾 {isUrdu ? crop.farmerUr : crop.farmerEn}
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                            </span>
                            
                            <div className="flex gap-2">
                              <button 
                                onClick={() => setActiveChatFarmer(isUrdu ? crop.farmerUr : crop.farmerEn)}
                                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                              >
                                <MessageSquare size={10} /> {isUrdu ? "چیٹ" : "Chat"}
                              </button>
                              <button 
                                onClick={() => setContactFarmer(crop)}
                                className="text-[10px] font-bold text-primary hover:underline flex items-center gap-0.5"
                              >
                                <Phone size={10} /> {isUrdu ? "کال کریں" : "Call"}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-sage/20 flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">{isUrdu ? "براہ راست ریٹ" : "Direct Price"}</span>
                              <span className="text-lg font-black text-primary">Rs. {crop.price}<span className="text-xs text-foreground/60 font-medium">/{isUrdu ? crop.unitUr : crop.unitEn}</span></span>
                            </div>
                            
                            <div className="flex gap-1">
                              <button 
                                onClick={() => setSelectedBulkCrop(crop)}
                                className="p-2 border border-primary/20 hover:bg-primary/5 rounded-full text-primary min-h-[48px] min-w-[48px] flex items-center justify-center"
                                title={isUrdu ? "ہول سیل ریٹ درخواست" : "Request Bulk Quote"}
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

                          <button 
                            onClick={() => addToCart(crop)}
                            className="w-full bg-primary hover:bg-primary-dark text-white font-sans text-xs font-bold py-2.5 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 min-h-[48px]"
                          >
                            <ShoppingBag size={14} />
                            <span>{isUrdu ? "ٹوکری میں ڈالیں" : "Add to Basket"}</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* EXTRA MODULE: CALL / WHATSAPP SANDBOX MODAL */}
        {contactFarmer && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-primary/10 animate-fade-in relative text-center">
              <button 
                onClick={() => {
                  setContactFarmer(null);
                  setCallingState("idle");
                }}
                className="absolute top-4 right-4 p-2 hover:bg-sage/10 rounded-full text-foreground/40"
              >
                <X size={18} />
              </button>

              {callingState === "idle" ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto mb-2 text-2xl">
                    📞
                  </div>
                  <h3 className="text-lg font-heading font-black text-primary-dark">
                    {isUrdu ? `کسان سے رابطہ: ${contactFarmer.farmerUr}` : `Contact ${contactFarmer.farmerEn}`}
                  </h3>
                  <p className="text-xs text-foreground/60">
                    {isUrdu ? "موبائل نمبر: +92 300 1234567" : "Phone: +92 300 1234567"}
                  </p>

                  <div className="space-y-2 pt-4">
                    <button 
                      onClick={handleCallFarmer}
                      className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <Phone size={16} />
                      <span>{isUrdu ? "براہ راست کال ملائیں" : "Call Direct Line"}</span>
                    </button>
                    <a 
                      href="https://wa.me/923001234567"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full border-2 border-green-500 hover:bg-green-50 text-green-600 font-bold py-2.5 rounded-full flex items-center justify-center gap-2 min-h-[48px]"
                    >
                      <MessageCircle size={16} />
                      <span>{isUrdu ? "واٹس ایپ چیٹ کھولیں" : "Chat on WhatsApp"}</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 py-6 animate-pulse">
                  <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto text-3xl shadow-lg shadow-green-500/25">
                    📞
                  </div>
                  
                  {callingState === "ringing" ? (
                    <div>
                      <h4 className="text-base font-bold text-foreground">{isUrdu ? "رابطہ ملایا جا رہا ہے..." : "Calling..."}</h4>
                      <p className="text-xs text-foreground/50 mt-1">{isUrdu ? `کسان ${contactFarmer.farmerUr} کو گھنٹی جا رہی ہے...` : `Ringing ${contactFarmer.farmerEn}...`}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-base font-bold text-green-600">{isUrdu ? "کال منسلک ہو گئی" : "Call Connected"}</h4>
                        <p className="text-xs text-foreground/60 mt-1">{isUrdu ? "لائیو آڈیو سگنل فعال ہے" : "Audio link simulated successfully!"}</p>
                      </div>
                      <button 
                        onClick={() => setCallingState("idle")}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 px-6 rounded-full"
                      >
                        {isUrdu ? "کال بند کریں" : "End Call"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* EXTRA MODULE: REVIEW & FEEDBACK MODAL */}
        {reviewCrop && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-primary/10 animate-fade-in relative">
              <button 
                onClick={() => setReviewCrop(null)}
                className="absolute top-4 right-4 p-2 hover:bg-sage/10 rounded-full text-foreground/40"
              >
                <X size={18} />
              </button>

              {reviewSuccess ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4 border-2 border-green-500">
                    <Check size={24} className="stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-dark">{isUrdu ? "ریویو جمع ہو گیا!" : "Feedback Submitted!"}</h3>
                  <p className="text-xs text-foreground/60 mt-1">{isUrdu ? "آپ کا فیڈ بیک کسان کی پروفائل ریٹنگ کو بہتر بنائے گا۔" : "Thank you for supporting verified local farmers."}</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {isUrdu ? "کوالٹی فیڈ بیک" : "Quality Review"}
                    </span>
                    <h3 className="text-lg font-heading font-black text-primary-dark mt-2">
                      {isUrdu ? `ریویو لکھیں: ${reviewCrop.nameUr}` : `Write Review for ${reviewCrop.nameEn}`}
                    </h3>
                  </div>

                  {/* Stars select */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-2">
                      {isUrdu ? "اپنے اسٹارز منتخب کریں:" : "Choose Star Rating:"}
                    </label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setUserStars(star)}
                          className="p-1 hover:scale-110 transition-transform"
                        >
                          <Star 
                            size={28} 
                            className={star <= userStars ? "fill-amber-500 text-amber-500" : "text-foreground/30"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "تبصرہ / رائے" : "Your Comment"}
                    </label>
                    <textarea 
                      placeholder={isUrdu ? "معیار اور قیمت سے متعلق اپنی رائے لکھیں..." : "Write about produce freshness, size, or overall shipping experience..."}
                      value={userComment}
                      onChange={(e) => setUserComment(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-xs font-sans min-h-[48px]"
                      rows={3}
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-dark text-white font-sans font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md min-h-[48px]"
                  >
                    <Check size={16} />
                    <span>{isUrdu ? "ریویو جمع کریں" : "Submit Feedback"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* EXTRA MODULE: B2B BULK QUOTE REQUEST MODAL */}
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
                  <h3 className="text-lg font-bold text-primary-dark">{isUrdu ? "درخواست موصول ہو گئی!" : "Quote Request Sent!"}</h3>
                  <p className="text-xs text-foreground/60 mt-1">{isUrdu ? "کسان آپ کو لائیو چیٹ پر ریٹ کی تصدیق کرے گا۔" : `${selectedBulkCrop.farmerEn} will review and respond via Chat shortly.`}</p>
                </div>
              ) : (
                <form onSubmit={handleRequestQuote} className="space-y-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {isUrdu ? "تجارتی بلک ریٹ" : "B2B Bulk Quote"}
                    </span>
                    <h3 className="text-lg font-heading font-black text-primary-dark mt-2">
                      {isUrdu ? `ہول سیل ریٹ درخواست: ${selectedBulkCrop.nameUr}` : `Request Quote for ${selectedBulkCrop.nameEn}`}
                    </h3>
                    <p className="text-xs text-foreground/60 mt-0.5">
                      {isUrdu 
                        ? `کسان کا ریٹ: Rs. ${selectedBulkCrop.price}/کلو۔ کم سے کم مقدار: 100 کلو۔` 
                        : `Farmer Gate Rate: Rs. ${selectedBulkCrop.price}/kg. Min order quantity: 100kg.`}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "1. مطلوبہ مقدار (کلو گرام)" : "1. Required Quantity (kg)"}
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
                      {isUrdu ? "2. اپنی طرف سے پیشکش قیمت فی کلو" : "2. Offered Price per kg (Optional)"}
                    </label>
                    <input 
                      type="number"
                      placeholder={`Target e.g. ${selectedBulkCrop.price - 20}`}
                      value={bulkPriceOffer}
                      onChange={(e) => setBulkPriceOffer(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                    />
                    <span className="text-[10px] text-foreground/40 mt-1 block">
                      {isUrdu ? "کسان کی بہترین ہول سیل قیمت جاننے کے لیے خالی چھوڑ دیں۔" : "Leave empty to request farmer's best commercial rate."}
                    </span>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary-dark text-foreground font-sans font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-secondary/15 min-h-[48px]"
                  >
                    <FileSpreadsheet size={16} />
                    <span>{isUrdu ? "ہول سیل ریٹ درخواست جمع کریں" : "Submit Bulk Request"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* IN-APP CHAT OVERLAY SANDBOX */}
        {activeChatFarmer && (
          <div className="fixed bottom-4 right-4 z-40 w-full max-w-sm glass-panel p-4 shadow-modal border-white/80 animate-slide-up flex flex-col h-[400px]">
            <div className="flex justify-between items-center pb-2 border-b border-sage/20">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                  {activeChatFarmer[0]}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{activeChatFarmer}</h4>
                  <span className="text-[9px] text-green-500 font-bold flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> {isUrdu ? "آن لائن" : "Online"}
                  </span>
                </div>
              </div>
              <button onClick={() => setActiveChatFarmer(null)} className="p-1 hover:bg-sage/10 rounded-full text-foreground/40 min-h-[48px] min-w-[48px] flex items-center justify-center animate-pulse">
                <X size={16} />
              </button>
            </div>

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

            <form onSubmit={handleSendMessage} className="pt-2 border-t border-sage/20 flex gap-2">
              <input 
                type="text" 
                placeholder={isUrdu ? "بات چیت کریں یا سوال پوچھیں..." : "Negotiate price or ask questions..."}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="flex-grow px-3 py-2 rounded-xl border border-primary/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white min-h-[48px]"
                required
              />
              <button type="submit" className="p-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors flex items-center justify-center min-h-[48px] min-w-[48px]">
                <Send size={14} />
              </button>
            </form>
          </div>
        )}

        {/* SHOPPING BASKET DRAWER / CHECKOUT MODAL */}
        {showCartDrawer && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs z-50 flex justify-end">
            <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 flex flex-col justify-between animate-slide-in-right relative">
              <button 
                onClick={() => {
                  setShowCartDrawer(false);
                  setCheckoutStep(0);
                }}
                className="absolute top-4 right-4 p-2 hover:bg-sage/10 rounded-full text-foreground/40 min-h-[48px] min-w-[48px] flex items-center justify-center"
              >
                <X size={20} />
              </button>

              {checkoutStep === 0 && (
                <>
                  <div className="flex-grow flex flex-col">
                    <h2 className="text-xl font-heading font-black text-primary-dark mb-6">{isUrdu ? "آپ کی تازہ ٹوکری" : "Your Fresh Basket"}</h2>
                    
                    {cart.length === 0 ? (
                      <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <ShoppingBag size={48} className="text-primary/20 mb-3" />
                        <h4 className="text-sm font-bold text-foreground/80">{isUrdu ? "آپ کی ٹوکری خالی ہے" : "Your basket is empty"}</h4>
                        <p className="text-xs text-foreground/50 mt-1">{isUrdu ? "سودا ٹوکری میں شامل کرنے کے لیے لسٹنگ دیکھیں" : "Browse our direct farmer catalog to add items."}</p>
                      </div>
                    ) : (
                      <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
                        {cart.map((item) => (
                          <div key={item.crop.id} className="flex justify-between items-center p-3 bg-sage/15 rounded-2xl border border-primary/5">
                            <div>
                              <h4 className="text-sm font-bold text-foreground">{isUrdu ? item.crop.nameUr : item.crop.nameEn}</h4>
                              <span className="text-xs text-primary-dark font-extrabold block mt-0.5">Rs. {item.crop.price}/{isUrdu ? item.crop.unitUr : item.crop.unitEn}</span>
                              <span className="text-[10px] text-foreground/50">{isUrdu ? `کسان: ${item.crop.farmerUr}` : `Sold by: ${item.crop.farmerEn}`}</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => updateCartQty(item.crop.id, -1)}
                                className="w-7 h-7 rounded-full bg-white hover:bg-sage/10 text-primary border border-primary/10 flex items-center justify-center text-sm font-bold min-h-[48px]"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-foreground">{item.quantity} {isUrdu ? "کلو" : "kg"}</span>
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

                  {cart.length > 0 && (
                    <div className="pt-4 border-t border-sage/20 space-y-3">
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-foreground/75">{isUrdu ? "کل رقم" : "Subtotal"}</span>
                        <span className="text-primary">Rs. {cart.reduce((tot, i) => tot + (i.crop.price * i.quantity), 0)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-foreground/50">
                        <span>{isUrdu ? "مڈل مین کا کمیشن" : "Middleman Commission"}</span>
                        <span className="line-through text-red-500">Rs. {Math.round(cart.reduce((tot, i) => tot + (i.crop.price * i.quantity), 0) * 0.15)} (0%)</span>
                      </div>

                      <button 
                        onClick={() => setCheckoutStep(1)}
                        className="w-full bg-primary hover:bg-primary-dark text-white font-sans font-bold py-3.5 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-primary/10 min-h-[48px]"
                      >
                        <span>{isUrdu ? "آرڈر فارم پر جائیں" : "Proceed to Checkout"}</span>
                        <ChevronRight size={16} className={isUrdu ? "rotate-180" : ""} />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Checkout details step */}
              {checkoutStep === 1 && (
                <form onSubmit={handleCheckoutSubmit} className="flex-grow flex flex-col justify-between">
                  <div className="space-y-4">
                    <h2 className="text-xl font-heading font-black text-primary-dark">{isUrdu ? "ڈیلیوری کی تفصیلات" : "Delivery Details"}</h2>
                    
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                        {isUrdu ? "آپ کا پورا نام" : "Your Full Name"}
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
                        {isUrdu ? "موبائل فون نمبر" : "Mobile Phone"}
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
                        {isUrdu ? "ڈیلیوری کا پتہ" : "Delivery Address"}
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
                        {isUrdu ? "ادائیگی کا طریقہ" : "Payment Method"}
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setShippingDetails({...shippingDetails, paymentMethod: "cod"})}
                          className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all min-h-[48px] ${shippingDetails.paymentMethod === "cod" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                        >
                          {isUrdu ? "کیش آن ڈیلیوری (COD)" : "Cash on Delivery (COD)"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShippingDetails({...shippingDetails, paymentMethod: "advance"})}
                          className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all min-h-[48px] ${shippingDetails.paymentMethod === "advance" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                        >
                          {isUrdu ? "ایزی پیسہ یا بینک" : "Easypaisa / Bank"}
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
                      <span>{isUrdu ? "آرڈر کریں (مڈل مین کے بغیر)" : "Place Direct Order"}</span>
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
                  <h3 className="text-xl font-heading font-black text-primary-dark">{isUrdu ? "آرڈر بک ہو گیا ہے!" : "Direct Order Placed!"}</h3>
                  <p className="text-xs text-foreground/75 mt-2 max-w-xs leading-relaxed">
                    {isUrdu 
                      ? "آپ کا آرڈر براہ راست کسان کو بھیج دیا گیا ہے۔ آرڈر ٹریکر پر ریٹ اور اسٹیٹس دیکھیں۔"
                      : "Your order details have been sent directly to the farmer. Track the delivery status in the live order tracking dashboard."}
                  </p>
                  
                  <button 
                    onClick={() => {
                      setShowCartDrawer(false);
                      setCheckoutStep(0);
                    }}
                    className="mt-8 bg-primary hover:bg-primary-dark text-white font-sans text-xs font-bold py-3 px-6 rounded-full transition-all shadow-md min-h-[48px]"
                  >
                    {isUrdu ? "مزید خریداری کریں" : "Continue Browsing"}
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

        {/* EXTRA MODULE: KISSAN DOST AI FLOATING ADVISOR CHATBOT */}
        <div className="fixed bottom-6 left-6 z-50">
          <button 
            onClick={() => setShowAiAdvisor(!showAiAdvisor)}
            className="w-14 h-14 bg-secondary hover:bg-secondary-dark text-foreground rounded-full flex items-center justify-center shadow-2xl border-2 border-primary/20 hover:scale-105 transition-all relative group"
            title="Kissan Dost AI Advisor"
          >
            <Sparkles size={24} className="animate-spin-slow text-primary" />
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary-dark text-white text-[10px] font-bold py-1 px-3 rounded-xl whitespace-nowrap shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
              {isUrdu ? "کسان دوست AI" : "Kissan Dost AI"}
            </span>
          </button>

          {showAiAdvisor && (
            <div className="absolute bottom-16 left-0 w-80 md:w-96 bg-white rounded-3xl p-4 shadow-2xl border border-primary/10 animate-slide-up flex flex-col h-[420px]">
              <div className="flex justify-between items-center pb-2 border-b border-sage/20">
                <div className="flex items-center gap-1.5">
                  <Sparkles size={16} className="text-secondary-dark animate-bounce" />
                  <h4 className="text-xs font-black text-primary-dark">{isUrdu ? "کسان دوست اے آئی ایڈوائزر" : "Kissan Dost AI Advisor"}</h4>
                </div>
                <button onClick={() => setShowAiAdvisor(false)} className="p-1 hover:bg-sage/10 rounded-full text-foreground/40">
                  <X size={16} />
                </button>
              </div>

              {/* Chat history */}
              <div className="flex-grow overflow-y-auto py-3 space-y-2.5">
                {aiHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === "user" ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-3 rounded-2xl text-xs max-w-[85%] ${msg.sender === "user" ? 'bg-primary text-white rounded-tr-none' : 'bg-sage/20 text-primary-dark rounded-tl-none border border-primary/5'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Preset questions for quick interaction */}
              <div className="flex flex-wrap gap-1 mb-2">
                {[
                  { en: "How to sell produce?", ur: "فصل کیسے بیچیں؟" },
                  { en: "Get today's rates", ur: "آج کے ریٹس کیا ہیں؟" },
                  { en: "Agri subsidies details", ur: "سرکاری سبسڈی کیا ہے؟" }
                ].map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => askAiAdvisor(isUrdu ? preset.ur : preset.en)}
                    className="text-[9px] bg-sage/10 hover:bg-sage/20 text-primary-dark font-bold px-2 py-1 rounded-lg border border-primary/5 transition-colors"
                  >
                    {isUrdu ? preset.ur : preset.en}
                  </button>
                ))}
              </div>

              {/* AI Message Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!aiInput.trim()) return;
                  askAiAdvisor(aiInput);
                }} 
                className="flex gap-2"
              >
                <input 
                  type="text"
                  placeholder={isUrdu ? "سوال پوچھیں (اردو یا English)..." : "Ask Kissan Dost AI advisory questions..."}
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  className="flex-grow px-3 py-2 rounded-xl border border-primary/10 text-xs focus:outline-none focus:ring-1 focus:ring-primary bg-white min-h-[48px]"
                />
                <button type="submit" className="p-3 bg-primary hover:bg-primary-dark text-white rounded-xl transition-colors flex items-center justify-center min-h-[48px] min-w-[48px]">
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
