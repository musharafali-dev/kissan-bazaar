"use client";

import React, { useState } from "react";
import { 
  Search, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  Sun, 
  CloudRain, 
  Wind, 
  Sprout, 
  Lightbulb, 
  FileText, 
  ArrowRight, 
  AlertTriangle, 
  Check, 
  Info,
  X,
  Layers,
  ChevronRight,
  Database
} from "lucide-react";

interface MandiRate {
  id: number;
  cropEn: string;
  cropUr: string;
  category: "vegetable" | "fruit" | "grain";
  cityEn: string;
  cityUr: string;
  priceMin: number;
  priceMax: number;
  unit: string;
  change: number; // percentage change
  trend: "up" | "down" | "stable";
}

export default function MandiRatesPage() {
  const [isUrdu, setIsUrdu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Selected crop for trend chart
  const [selectedTrendCrop, setSelectedTrendCrop] = useState("Tomato");

  // Subsidies Modal state
  const [activeSubsidyId, setActiveSubsidyId] = useState<number | null>(null);
  const [subsidyApplied, setSubsidyApplied] = useState(false);

  // Mock Database
  const mandiRates: MandiRate[] = [
    { id: 1, cropEn: "Potato", cropUr: "آلو", category: "vegetable", cityEn: "Gilgit", cityUr: "گلگت", priceMin: 75, priceMax: 85, unit: "kg", change: 5.2, trend: "up" },
    { id: 2, cropEn: "Tomato", cropUr: "ٹماٹر", category: "vegetable", cityEn: "Lahore", cityUr: "لاہور", priceMin: 110, priceMax: 130, unit: "kg", change: -3.5, trend: "down" },
    { id: 3, cropEn: "Apricot", cropUr: "خوبانی", category: "fruit", cityEn: "Hunza", cityUr: "ہنزہ", priceMin: 170, priceMax: 190, unit: "kg", change: 0, trend: "stable" },
    { id: 4, cropEn: "Onion", cropUr: "پیاز", category: "vegetable", cityEn: "Multan", cityUr: "ملتان", priceMin: 90, priceMax: 105, unit: "kg", change: 12.4, trend: "up" },
    { id: 5, cropEn: "Basmati Rice", cropUr: "باسمتی چاول", category: "grain", cityEn: "Gujranwala", cityUr: "گوجرانوالہ", priceMin: 320, priceMax: 350, unit: "kg", change: 1.8, trend: "up" },
    { id: 6, cropEn: "Red Apples", cropUr: "سیب", category: "fruit", cityEn: "Quetta", cityUr: "کوئٹہ", priceMin: 220, priceMax: 260, unit: "kg", change: -2.0, trend: "down" },
    { id: 7, cropEn: "Green Chilies", cropUr: "سبز مرچ", category: "vegetable", cityEn: "Karachi", cityUr: "کراچی", priceMin: 140, priceMax: 160, unit: "kg", change: 8.5, trend: "up" },
    { id: 8, cropEn: "Wheat", cropUr: "گندم", category: "grain", cityEn: "Sargodha", cityUr: "سرگودھا", priceMin: 95, priceMax: 105, unit: "kg", change: 0.5, trend: "stable" }
  ];

  // Weather Hub mock data
  const weatherStations = [
    { city: "Hunza", temp: "22°C", cond: "Clear", icon: <Sun className="text-secondary" />, advice: "Excellent for solar drying apricots." },
    { city: "Sargodha", temp: "38°C", cond: "Very Hot", icon: <Sun className="text-secondary" />, advice: "Irrigate citrus trees in evening." },
    { city: "Swat", temp: "26°C", cond: "Rainy", icon: <CloudRain className="text-primary" />, advice: "Postpone tomato harvesting today." },
    { city: "Multan", temp: "41°C", cond: "Windy", icon: <Wind className="text-accent" />, advice: "Watch for dust storms on mango farms." }
  ];

  // Agri-Tips mock data
  const agriTips = [
    {
      titleEn: "Drip Irrigation Benefits",
      titleUr: "ڈرپ اریگیشن کے فائدے",
      descEn: "Drip irrigation saves up to 50% water and increases crop yields by delivering water directly to roots.",
      descUr: "ڈرپ آبپاشی سے پانی کی 50 فیصد تک بچت ہوتی ہے اور پانی براہ راست جڑوں کو ملنے سے پیداوار بڑھتی ہے۔"
    },
    {
      titleEn: "Organic Pest Control",
      titleUr: "نامیاتی کیڑے مار تدابیر",
      descEn: "Mix neem oil with mild soap and water to spray on crops. This repels aphids and whiteflies naturally.",
      descUr: "نیم کے تیل کو ہلکے صابن اور پانی میں ملا کر سپرے کریں۔ یہ قدرتی طور پر شیتلوں اور مکھیوں کو بھگاتا ہے۔"
    }
  ];

  // Government Subsidies Portal
  const subsidySchemes = [
    {
      id: 1,
      titleEn: "Green Tractor Scheme 2026",
      titleUr: "گرین ٹریکٹر سکیم 2026",
      subsidy: "50% Off Tractors",
      detail: "Apply for 50% matching grant subsidies on local high-performance tractors.",
      deadline: "July 25, 2026"
    },
    {
      id: 2,
      titleEn: "Solar Tube-well Subsidy Program",
      titleUr: "سولر ٹیوب ویل پروگرام",
      subsidy: "Rs. 200,000 Flat Subsidy",
      detail: "Conversion grants to migrate fossil-fuel tube-wells to solar irrigation pumps.",
      deadline: "August 10, 2026"
    }
  ];

  // Filter Rate list
  const filteredRates = mandiRates.filter(rate => {
    const cropName = isUrdu ? rate.cropUr : rate.cropEn;
    const city = isUrdu ? rate.cityUr : rate.cityEn;
    
    const matchesSearch = cropName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          city.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCity = selectedCity === "all" || rate.cityEn === selectedCity;
    const matchesCategory = selectedCategory === "all" || rate.category === selectedCategory;

    return matchesSearch && matchesCity && matchesCategory;
  });

  const handleApplySubsidy = (e: React.FormEvent) => {
    e.preventDefault();
    setSubsidyApplied(true);
    setTimeout(() => {
      setSubsidyApplied(false);
      setActiveSubsidyId(null);
    }, 2000);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-offwhite to-sage/30 p-4 md:p-8 ${isUrdu ? "rtl-grid" : ""}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* ========================================================
            PAGE HEADER & LANG TOGGLE
            ======================================================== */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              {isUrdu ? "روزانہ مارکیٹ کا احوال" : "Daily Market Intelligence"}
            </span>
            <h1 className="text-3xl md:text-4xl font-heading font-black text-primary-dark mt-1">
              {isUrdu ? "منڈی ریٹس اور رہنمائی" : "Mandi Rates & Agri Hub"}
            </h1>
          </div>
          
          <button 
            onClick={() => setIsUrdu(!isUrdu)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-all border border-primary/10 min-h-[48px]"
          >
            <span>{isUrdu ? "Read in English" : "اردو میں پڑھیں"}</span>
          </button>
        </div>

        {/* ========================================================
            GRID MODULE: WEATHER & AGRI-TIPS
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          
          {/* Weather Station Hub */}
          <div className="lg:col-span-8 glass-panel p-6 border-white/50 shadow-glass-soft flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">
                {isUrdu ? "موسمیاتی احوال" : "Agri-Weather Stations"}
              </span>
              <h3 className="text-lg font-bold text-primary-dark mt-1">
                {isUrdu ? "زرعی علاقوں کا موسم اور مشورہ" : "Regional Weather & Sowing Advisory"}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-6">
              {weatherStations.map((station, i) => (
                <div key={i} className="bg-white/60 p-4 rounded-2xl border border-primary/5 shadow-sm hover:scale-[1.02] transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-foreground/80">{station.city}</span>
                    <span className="text-lg font-black text-primary flex items-center gap-1">
                      {station.temp} {station.icon}
                    </span>
                  </div>
                  <p className="text-[11px] text-foreground/50 font-bold uppercase">{station.cond}</p>
                  <p className="text-xs text-foreground/75 mt-2 leading-relaxed font-sans">{station.advice}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Agri Tip Card */}
          <div className="lg:col-span-4 glass-panel p-6 border-white/50 shadow-glass-soft flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-secondary-dark uppercase tracking-wider flex items-center gap-1">
                <Lightbulb size={14} className="animate-pulse" />
                {isUrdu ? "آج کی زرعی ٹپ" : "Daily Sowing Tip"}
              </span>
              <h3 className="text-lg font-bold text-primary-dark mt-2">
                {isUrdu ? agriTips[0].titleUr : agriTips[0].titleEn}
              </h3>
              <p className="text-xs md:text-sm text-foreground/70 mt-3 leading-relaxed font-sans">
                {isUrdu ? agriTips[0].descUr : agriTips[0].descEn}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-sage/20 flex justify-between items-center text-xs font-bold">
              <span className="text-foreground/50">{isUrdu ? "شائع کردہ: محکمہ زراعت" : "Source: Agri Dept Pakistan"}</span>
              <button 
                onClick={() => alert("Loading older tips...")}
                className="text-primary hover:underline flex items-center gap-0.5 min-h-[48px]"
              >
                {isUrdu ? "مزید ٹپس دیکھیں" : "Browse Tips"} <ChevronRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================
            MAIN SECTION: MANDI RATES GRID & GRAPH
            ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: Live Mandi Rates Table */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Filter Toolbar */}
            <div className="glass-panel p-5 shadow-glass-soft border-white/50 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
              
              {/* Search input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" size={16} />
                <input 
                  type="text" 
                  placeholder={isUrdu ? "فصل یا شہر تلاش کریں..." : "Search crop or city..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/70 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary text-xs min-h-[38px]"
                />
              </div>

              {/* City selector */}
              <div>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-xs min-h-[38px]"
                >
                  <option value="all">{isUrdu ? "تمام شہر" : "All Cities"}</option>
                  <option value="Gilgit">Gilgit / گلگت</option>
                  <option value="Lahore">Lahore / لاہور</option>
                  <option value="Multan">Multan / ملتان</option>
                  <option value="Gujranwala">Gujranwala / گوجرانوالہ</option>
                  <option value="Quetta">Quetta / کوئٹہ</option>
                </select>
              </div>

              {/* Category selector */}
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-xs min-h-[38px]"
                >
                  <option value="all">{isUrdu ? "تمام اقسام" : "All Categories"}</option>
                  <option value="vegetable">{isUrdu ? "سبزیاں" : "Vegetables"}</option>
                  <option value="fruit">{isUrdu ? "پھل" : "Fruits"}</option>
                  <option value="grain">{isUrdu ? "اناج" : "Grains"}</option>
                </select>
              </div>

            </div>

            {/* Rates Table Card */}
            <div className="glass-panel overflow-hidden border-white/50 shadow-glass-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs md:text-sm">
                  <thead>
                    <tr className="bg-primary/5 text-primary-dark font-sans border-b border-sage/35">
                      <th className="py-4 px-6 font-bold">{isUrdu ? "فصل" : "Crop"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "شہر" : "City"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "کم سے کم ریٹ" : "Min Rate"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "زیادہ سے زیادہ ریٹ" : "Max Rate"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "یونٹ" : "Unit"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "تبدیلی" : "Daily Change"}</th>
                      <th className="py-4 px-6 font-bold text-center">{isUrdu ? "رجحان" : "Trend"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage/20 font-sans">
                    {filteredRates.map((rate) => (
                      <tr 
                        key={rate.id} 
                        onClick={() => setSelectedTrendCrop(rate.cropEn)}
                        className={`hover:bg-sage/10 transition-colors cursor-pointer ${selectedTrendCrop === rate.cropEn ? 'bg-primary/5 font-semibold' : ''}`}
                      >
                        <td className="py-4 px-6 font-extrabold text-foreground">{isUrdu ? rate.cropUr : rate.cropEn}</td>
                        <td className="py-4 px-6 text-foreground/75">{isUrdu ? rate.cityUr : rate.cityEn}</td>
                        <td className="py-4 px-6 font-bold">Rs. {rate.priceMin}</td>
                        <td className="py-4 px-6 font-extrabold text-primary-dark">Rs. {rate.priceMax}</td>
                        <td className="py-4 px-6 text-foreground/50">{rate.unit}</td>
                        <td className="py-4 px-6">
                          <span className={`font-bold ${rate.change > 0 ? 'text-green-600' : rate.change < 0 ? 'text-red-500' : 'text-foreground/50'}`}>
                            {rate.change > 0 ? `+${rate.change}%` : `${rate.change}%`}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center">
                            {rate.trend === "up" && (
                              <span className="p-1 bg-green-50 text-green-600 rounded-full" title="Rising prices">
                                <TrendingUp size={16} />
                              </span>
                            )}
                            {rate.trend === "down" && (
                              <span className="p-1 bg-red-50 text-red-500 rounded-full" title="Falling prices">
                                <TrendingDown size={16} />
                              </span>
                            )}
                            {rate.trend === "stable" && (
                              <span className="px-2 py-0.5 bg-foreground/5 text-foreground/50 text-[10px] font-bold rounded" title="Stable prices">
                                Stable
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT: Selected Crop Trend Chart & Subsidies */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* SVG Trend Graph */}
            <div className="glass-panel p-6 border-white/50 shadow-glass-soft flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  {isUrdu ? "قیمت کا اتار چڑھاؤ" : "Market Volatility"}
                </span>
                <h3 className="text-lg font-heading font-black text-primary-dark mt-1">
                  {selectedTrendCrop} {isUrdu ? "کا 30 دن کا رجحان" : "30-Day Trend"}
                </h3>
              </div>

              {/* Responsive SVG price chart */}
              <div className="w-full h-44 mt-6">
                <svg viewBox="0 0 300 150" className="w-full h-full">
                  {/* Grid background lines */}
                  <line x1="30" y1="20" x2="280" y2="20" stroke="#EAEAEA" strokeDasharray="3 3" />
                  <line x1="30" y1="60" x2="280" y2="60" stroke="#EAEAEA" strokeDasharray="3 3" />
                  <line x1="30" y1="100" x2="280" y2="100" stroke="#EAEAEA" strokeDasharray="3 3" />
                  <line x1="30" y1="130" x2="280" y2="130" stroke="#B8C5AE" strokeWidth="1.5" />

                  {/* Profit Line (Smooth Curve) */}
                  <path 
                    d="M 30 110 Q 90 60 150 90 T 280 40" 
                    fill="none" 
                    stroke="#E9B44C" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                  />

                  {/* Dot anchors */}
                  <circle cx="30" cy="110" r="4" fill="#2D6A4F" />
                  <circle cx="110" cy="75" r="4" fill="#2D6A4F" />
                  <circle cx="200" cy="85" r="4" fill="#2D6A4F" />
                  <circle cx="280" cy="40" r="4" fill="#2D6A4F" />

                  {/* Graph Axis labels */}
                  <text x="30" y="145" fill="#1A1A1A" className="text-[8px] font-bold font-sans">June 1</text>
                  <text x="140" y="145" fill="#1A1A1A" className="text-[8px] font-bold font-sans">June 15</text>
                  <text x="250" y="145" fill="#1A1A1A" className="text-[8px] font-bold font-sans">Today</text>
                </svg>
              </div>

              <div className="bg-sage/20 p-3 rounded-2xl border border-primary/5 mt-4">
                <span className="text-[9px] font-bold uppercase tracking-wider text-primary-dark block">
                  {isUrdu ? "توقع" : "Market Analyst Outlook"}
                </span>
                <p className="text-[11px] text-foreground/80 mt-1 leading-relaxed">
                  {isUrdu ? "مانگ میں اضافے کی وجہ سے آنے والے ہفتے میں قیمتیں بڑھنے کا امکان ہے۔" : "Strong domestic demand indicates prices will likely stabilize with a minor upward tilt over the coming week."}
                </p>
              </div>
            </div>

            {/* Govt Subsidies Portal */}
            <div className="glass-panel p-6 border-white/50 shadow-glass-soft space-y-4">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">
                  {isUrdu ? "سرکاری اسکیمیں" : "Retainer Hub"}
                </span>
                <h3 className="text-lg font-heading font-black text-primary-dark mt-1">
                  {isUrdu ? "حکومتی سبسڈیز پورٹل" : "Govt Subsidies & Grants"}
                </h3>
              </div>

              <div className="space-y-3">
                {subsidySchemes.map((scheme) => (
                  <div key={scheme.id} className="p-3 bg-white border border-primary/10 rounded-2xl flex flex-col justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-xs text-primary-dark leading-tight">
                          {isUrdu ? scheme.titleUr : scheme.titleEn}
                        </span>
                        <span className="bg-secondary text-foreground text-[9px] font-black uppercase px-2 py-0.5 rounded shrink-0">
                          {scheme.subsidy}
                        </span>
                      </div>
                      <p className="text-[11px] text-foreground/60 mt-1">{scheme.detail}</p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2 border-t border-sage/10 text-[10px]">
                      <span className="text-red-500 font-bold">{isUrdu ? `آخری تاریخ: ${scheme.deadline}` : `Deadline: ${scheme.deadline}`}</span>
                      <button 
                        onClick={() => setActiveSubsidyId(scheme.id)}
                        className="bg-primary hover:bg-primary-dark text-white font-bold py-1 px-3 rounded-full min-h-[38px] flex items-center justify-center shadow-sm"
                      >
                        {isUrdu ? "درخواست دیں" : "Apply Now"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* ========================================================
            GOVT SUBSIDY APPLICATION MODAL
            ======================================================== */}
        {activeSubsidyId !== null && (
          <div className="fixed inset-0 bg-black/45 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-primary/10 animate-fade-in relative">
              <button 
                onClick={() => setActiveSubsidyId(null)}
                className="absolute top-4 right-4 p-2 hover:bg-sage/10 rounded-full text-foreground/40"
              >
                <X size={18} />
              </button>

              {subsidyApplied ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4 border-2 border-green-500">
                    <Check size={24} className="stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-bold text-primary-dark">
                    {isUrdu ? "درخواست کامیابی سے جمع ہو گئی!" : "Application Submitted Successfully!"}
                  </h3>
                  <p className="text-xs text-foreground/60 mt-1">
                    {isUrdu ? "محکمہ زراعت کی طرف سے تصدیق کا پیغام جلد موصول ہوگا۔" : "Your reference ID has been logged. Agriculture Dept will contact you."}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleApplySubsidy} className="space-y-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                      {isUrdu ? "سرکاری پورٹل" : "Official Govt Form"}
                    </span>
                    <h3 className="text-lg font-heading font-black text-primary-dark mt-2">
                      {isUrdu ? "سبسڈی کے لیے درخواست فارم" : "Apply for Subsidy Scheme"}
                    </h3>
                    <p className="text-xs text-foreground/60 mt-0.5">
                      {isUrdu ? "درج ذیل تفصیلات پُر کر کے جمع کروائیں۔" : "Submit your verified credentials to match government grants criteria."}
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "اپنا نام" : "Farmer Name"}
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Sajid Ali"
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[48px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "شناختی کارڈ نمبر" : "CNIC Number"}
                    </label>
                    <input 
                      type="text"
                      placeholder="34101-1234567-1"
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[48px]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "زمین کا رقبہ (ایکڑ)" : "Farm Size (Acres)"}
                    </label>
                    <input 
                      type="number"
                      placeholder="e.g. 5"
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm min-h-[48px]"
                      min="1"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-secondary hover:bg-secondary-dark text-foreground font-sans font-bold py-3 rounded-full transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-secondary/15 min-h-[48px]"
                  >
                    <span>{isUrdu ? "درخواست جمع کروائیں" : "Submit Subsidy Application"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
