"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ShieldCheck, 
  Leaf, 
  Coins, 
  MapPin, 
  Search, 
  ArrowRight, 
  Sun, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle 
} from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

export default function HomePage() {
  const { isUrdu } = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(25);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);

  // Mock data for crops
  const featuredCrops = [
    {
      id: 1,
      nameEn: "Fresh Gilgit Apricots",
      nameUr: "تازہ خوبانی گلگت",
      farmerEn: "Sajid Ali",
      farmerUr: "ساجد علی",
      locationEn: "Hunza Valley, GB",
      locationUr: "ہنزہ، گلگت بلتستان",
      price: 180,
      unitEn: "kg",
      unitUr: "کلو",
      rating: 4.9,
      reviewsCount: 28,
      isOrganic: true,
      grade: "A",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFF8E7'/><circle cx='200' cy='160' r='80' fill='%23E9B44C'/><circle cx='180' cy='140' r='40' fill='%23F4A460' opacity='0.3'/><path d='M200 80 Q220 40 260 40 Q240 70 200 80' fill='%232D6A4F'/><circle cx='195' cy='155' r='5' fill='%23fff' opacity='0.6'/></svg>",
      harvestedEn: "Today",
      harvestedUr: "آج"
    },
    {
      id: 2,
      nameEn: "Red Tomatoes",
      nameUr: "سرخ ٹماٹر",
      farmerEn: "Ghulam Rasool",
      farmerUr: "غلام رسول",
      locationEn: "Swat, KP",
      locationUr: "سوات، خیبر پختونخوا",
      price: 120,
      unitEn: "kg",
      unitUr: "کلو",
      rating: 4.8,
      reviewsCount: 42,
      isOrganic: true,
      grade: "A",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFEEEE'/><circle cx='200' cy='160' r='80' fill='%23E63946'/><circle cx='170' cy='130' r='30' fill='%23FF5A5F' opacity='0.3'/><path d='M200 80 L190 60 L210 60 Z' fill='%232D6A4F'/><path d='M180 75 Q200 65 220 75' fill='none' stroke='%232D6A4F' stroke-width='8' stroke-linecap='round'/><circle cx='190' cy='145' r='5' fill='%23fff' opacity='0.6'/></svg>",
      harvestedEn: "Yesterday",
      harvestedUr: "کل"
    },
    {
      id: 3,
      nameEn: "Organic Red Potatoes",
      nameUr: "نامیاتی آلو",
      farmerEn: "M. Irfan",
      farmerUr: "محمد عرفان",
      locationEn: "Okara, Punjab",
      locationUr: "اوکاڑہ، پنجاب",
      price: 80,
      unitEn: "kg",
      unitUr: "کلو",
      rating: 4.7,
      reviewsCount: 19,
      isOrganic: true,
      grade: "B",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23F5EDD0'/><ellipse cx='200' cy='160' rx='95' ry='70' fill='%23A47551'/><circle cx='160' cy='140' r='4' fill='%237B5537'/><circle cx='240' cy='170' r='3' fill='%237B5537'/><circle cx='200' cy='130' r='3' fill='%237B5537'/><circle cx='170' cy='140' r='20' fill='%23BC987E' opacity='0.2'/></svg>",
      harvestedEn: "2 days ago",
      harvestedUr: "2 دن پہلے"
    },
    {
      id: 4,
      nameEn: "Sindhri Mangoes",
      nameUr: "سندھڑی آم",
      farmerEn: "Bashir Khan",
      farmerUr: "بشیر خان",
      locationEn: "Mirpur Khas, Sindh",
      locationUr: "میرپور خاص، سندھ",
      price: 250,
      unitEn: "kg",
      unitUr: "کلو",
      rating: 5.0,
      reviewsCount: 88,
      isOrganic: false,
      grade: "A+",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23FFFDE6'/><path d='M200 90 C150 90 120 140 120 180 C120 220 170 230 200 230 C240 230 280 190 280 150 C280 110 240 90 200 90 Z' fill='%23FFC300'/><path d='M190 90 Q170 50 150 60 Q180 75 190 90' fill='%232D6A4F'/><circle cx='180' cy='130' r='10' fill='%23FFD700' opacity='0.5'/></svg>",
      harvestedEn: "Today",
      harvestedUr: "آج"
    }
  ];

  // Mandi rates mock
  const mandiRates = [
    { cropEn: "Potato", cropUr: "آلو", cityEn: "Gilgit", cityUr: "گلگت", price: "Rs. 80/kg", change: "+5%" },
    { cropEn: "Tomato", cropUr: "ٹماٹر", cityEn: "Lahore", cityUr: "لاہور", price: "Rs. 120/kg", change: "-2%" },
    { cropEn: "Apricot", cropUr: "خوبانی", cityEn: "Hunza", cityUr: "ہنزہ", price: "Rs. 180/kg", change: "0%" },
    { cropEn: "Onion", cropUr: "پیاز", cityEn: "Multan", cityUr: "ملتان", price: "Rs. 95/kg", change: "+12%" }
  ];

  return (
    <div className={`relative min-h-screen overflow-x-hidden font-sans ${isUrdu ? "rtl-grid text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      
      {/* BACKGROUND GRAPHICS */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-offwhite to-sage/30 pointer-events-none" />
      
      {/* HERO SECTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 pt-6 md:pt-16 pb-12 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[calc(100vh-80px)]">
        
        {/* LEFT SIDE - GLASS CARD */}
        <div className="lg:col-span-6 flex flex-col justify-center order-2 lg:order-1 mt-4 lg:mt-0">
          <div className="glass-panel p-8 md:p-12 relative overflow-hidden transition-all duration-300 shadow-glass border-white/60">
            <div className="absolute -top-12 -right-12 w-28 h-28 rounded-full bg-secondary/10 filter blur-xl" />
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <Leaf size={14} className="animate-spin-slow" />
              {isUrdu ? "100% کسانوں کی براہ راست مارکیٹ" : "100% Direct Farmer Marketplace"}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-[56px] leading-[1.1] font-heading font-extrabold text-primary-dark tracking-tight mb-6">
              {isUrdu ? (
                <>تازہ بیچیں۔<br /><span className="text-secondary-dark font-black">براہ راست خریدیں۔</span></>
              ) : (
                <>Sell Fresh.<br /><span className="text-secondary-dark font-black">Buy Direct.</span></>
              )}
            </h1>

            <p className="text-base md:text-lg text-foreground/80 leading-relaxed font-sans mb-8">
              {isUrdu 
                ? "گلگت کے فارم سے آپ کی دہلیز تک۔ مڈل مین کے بغیر۔ کسان بازار آپ کو پھلوں، سبزیوں اور ڈیری مصنوعات کے لیے تصدیق شدہ کسانوں سے براہ راست جوڑتا ہے۔ تازہ کٹائی، مناسب قیمت۔"
                : "From Farm in Gilgit to Your Doorstep. Skip the middleman. Kissan Bazaar connects you directly with verified local farmers for fruits, vegetables, dairy, and more. Fresh harvest, fair price."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link 
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 bg-secondary hover:bg-secondary-dark text-foreground font-semibold py-4 px-8 rounded-full shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all duration-300 text-center"
              >
                <span>{isUrdu ? "تازہ پیداوار دیکھیں" : "Browse Fresh Produce"}</span>
                <ArrowRight size={18} className={isUrdu ? "rotate-180" : ""} />
              </Link>
              <Link 
                href="/onboarding"
                className="inline-flex items-center justify-center border-2 border-primary hover:bg-primary/5 text-primary font-semibold py-4 px-8 rounded-full hover:scale-105 active:scale-95 transition-all duration-300 text-center"
              >
                {isUrdu ? "کسان کے طور پر فروخت شروع کریں" : "Start Selling as a Farmer"}
              </Link>
            </div>

            {/* TRUST BAR */}
            <div className="pt-6 border-t border-primary/10 grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center sm:flex-row gap-2 text-center sm:text-left">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-foreground/80">{isUrdu ? "تصدیق شدہ کسان" : "Verified Farmers"}</span>
              </div>
              <div className="flex flex-col items-center sm:flex-row gap-2 text-center sm:text-left">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Leaf size={18} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-foreground/80">{isUrdu ? "تازہ کٹائی" : "Same-Day Harvest"}</span>
              </div>
              <div className="flex flex-col items-center sm:flex-row gap-2 text-center sm:text-left">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Coins size={18} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-foreground/80">{isUrdu ? "کیش آن ڈیلیوری" : "COD + JazzCash"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - VISUALS & FLOATING CARDS */}
        <div className="lg:col-span-6 relative order-1 lg:order-2 w-full aspect-[4/3] lg:aspect-square flex items-center justify-center min-h-[300px]">
          <div className="w-[85%] h-[85%] rounded-[32px] overflow-hidden shadow-2xl relative border-4 border-white/80 group">
            <Image 
              src="/images/hero-farmer-hands.png"
              alt="Farmer holding fresh produce" 
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

          {/* FLOATING CARD 1: Potato Price */}
          <div className="absolute top-[8%] left-[2%] w-48 md:w-56 glass-panel p-4 shadow-glass border-white/60 animate-float">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/15 flex items-center justify-center text-secondary-dark font-heading font-bold text-sm">
                🥔
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">{isUrdu ? "آلو" : "Potato / آلو"}</h4>
                <p className="text-base font-extrabold text-primary-dark">{isUrdu ? "Rs. 80 / کلو" : "Rs. 80 / kg"}</p>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 2: Farmers Near You */}
          <div className="absolute bottom-[6%] right-[2%] w-56 md:w-64 glass-panel p-4 shadow-glass border-white/60 animate-float-delayed">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <MapPin size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-bold text-foreground">{isUrdu ? "آپ کے قریب 12 کسان" : "12 Farmers Near You"}</h4>
                <p className="text-xs text-accent font-semibold flex items-center gap-1 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  {isUrdu ? "گلگت کا علاقہ" : "Gilgit Region"}
                </p>
              </div>
            </div>
          </div>

          {/* FLOATING CARD 3: Seasonal badge */}
          <div className="absolute top-[35%] right-[-2%] w-44 md:w-48 glass-panel py-3 px-4 shadow-glass border-white/60 animate-float-slow">
            <div className="text-center">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-secondary-dark bg-secondary/10 px-2 py-0.5 rounded-full mb-1">
                {isUrdu ? "ابھی سیزن میں" : "In Season Now"}
              </span>
              <h4 className="text-base font-black text-primary-dark flex items-center justify-center gap-1.5">
                🍑 {isUrdu ? "خوبانی" : "Apricots"}
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CONTENT HUB */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Box 1: Weather Widget */}
          <div className="glass-panel p-6 shadow-glass-soft flex items-center justify-between border-white/50">
            <div>
              <span className="text-xs font-bold text-accent uppercase tracking-wider">{isUrdu ? "علاقائی موسم" : "Region Weather"}</span>
              <h3 className="text-lg font-bold text-primary-dark mt-1">{isUrdu ? "گلگت بلتستان" : "Gilgit-Baltistan"}</h3>
              <p className="text-2xl font-black text-foreground mt-2">24°C / {isUrdu ? "صاف دھوپ" : "Sunny"}</p>
              <p className="text-xs text-foreground/60 mt-1">{isUrdu ? "فصل کی کٹائی کے لیے بہترین موسم" : "Perfect conditions for harvest"}</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-secondary/15 flex items-center justify-center text-secondary-dark">
              <Sun size={32} className="animate-spin-slow" />
            </div>
          </div>

          {/* Box 2: Daily Mandi Rates */}
          <div className="glass-panel p-6 shadow-glass-soft border-white/50 col-span-1">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-accent uppercase tracking-wider">{isUrdu ? "روزانہ منڈی ریٹس" : "Daily Mandi Rates"}</span>
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                <TrendingUp size={12} /> {isUrdu ? "لائیو" : "Live"}
              </span>
            </div>
            <div className="space-y-2">
              {mandiRates.map((rate, index) => (
                <div key={index} className="flex justify-between items-center text-xs md:text-sm py-1 border-b border-sage/20 last:border-0">
                  <span className="font-semibold text-foreground/80">{isUrdu ? rate.cropUr : rate.cropEn} ({isUrdu ? rate.cityUr : rate.cityEn})</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary-dark">{rate.price}</span>
                    <span className={`text-[10px] px-1 rounded font-bold ${rate.change.startsWith('+') ? 'text-green-600 bg-green-50' : rate.change.startsWith('-') ? 'text-red-500 bg-red-50' : 'text-foreground/40 bg-foreground/5'}`}>
                      {rate.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Box 3: Daily Agri-Tip */}
          <div className="glass-panel p-6 shadow-glass-soft flex flex-col justify-between border-white/50">
            <div>
              <div className="flex items-center gap-1.5 text-accent">
                <Lightbulb size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">{isUrdu ? "آج کی زرعی ٹپ" : "Daily Agri Tip"}</span>
              </div>
              <h3 className="text-sm md:text-base font-bold text-primary-dark mt-2 leading-snug">
                {isUrdu ? "خوبانی کو دیر تک محفوظ رکھنا" : "Optimizing Apricot Storage"}
              </h3>
              <p className="text-xs md:text-sm text-foreground/70 mt-1 leading-relaxed">
                {isUrdu 
                  ? "خوبانی کو کیمیائی ادویات کے بغیر 14 دن تک تازہ رکھنے کے لیے 0 ڈگری اور 90 فیصد نمی پر سٹور کریں۔" 
                  : "Store apricots at 0°C with 90% humidity to keep them fresh for up to 14 days without using chemical preservatives."}
              </p>
            </div>
            <Link href="/mandi-rates" className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 mt-4">
              <span>{isUrdu ? "مزید ٹپس دیکھیں" : "Read more tips"}</span>
              <ArrowRight size={12} className={isUrdu ? "rotate-180" : ""} />
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 3: CROP SEARCH GRID */}
      <section id="marketplace" className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-sm font-bold text-accent uppercase tracking-wider">{isUrdu ? "آپ کے قریب سیزن میں" : "In Season Near You"}</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-dark mt-1">
              {isUrdu ? "تازہ پیداوار کی مارکیٹ" : "Fresh Produce Marketplace"}
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "fruits", "vegetables", "grains"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold capitalize transition-all ${selectedCategory === cat ? 'bg-primary text-white shadow-md' : 'bg-white hover:bg-sage/20 border border-primary/10 text-primary-dark'}`}
              >
                {cat === "all" ? (isUrdu ? "سب" : "All") : (cat === "fruits" ? (isUrdu ? "پھل" : "Fruits") : (cat === "vegetables" ? (isUrdu ? "سبزیاں" : "Vegetables") : (isUrdu ? "اناج" : "Grains")))}
              </button>
            ))}
          </div>
        </div>

        {/* Filters bar */}
        <div className="glass-panel p-6 mb-8 shadow-glass-soft border-white/50 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" size={18} />
            <input 
              type="text" 
              placeholder={isUrdu ? "فصلیں، علاقے یا کسان تلاش کریں..." : "Search crops, regions or farmers..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/70 border border-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all text-sm font-sans"
            />
          </div>

          <div className="lg:col-span-4 flex items-center gap-4">
            <span className="text-xs font-bold text-foreground/75 shrink-0">
              {isUrdu ? "فاصلہ:" : "Radius:"} <span className="text-primary font-bold">{radius} km</span>
            </span>
            <input 
              type="range" 
              min="5" 
              max="150" 
              value={radius}
              onChange={(e) => setRadius(parseInt(e.target.value))}
              className="w-full accent-primary h-2 bg-sage/60 rounded-lg cursor-pointer"
            />
          </div>

          <div className="lg:col-span-3 flex justify-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-xs font-bold text-foreground/75">{isUrdu ? "نامیاتی تصدیق شدہ" : "Organic Certified Only"}</span>
              <div className="relative">
                <input 
                  type="checkbox" 
                  checked={isOrganicOnly} 
                  onChange={() => setIsOrganicOnly(!isOrganicOnly)}
                  className="sr-only" 
                />
                <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${isOrganicOnly ? 'bg-primary' : 'bg-sage-dark'}`}></div>
                <div className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform duration-300 shadow ${isOrganicOnly ? 'translate-x-5' : 'translate-x-0'}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* Crop grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredCrops.map((crop) => (
            <div key={crop.id} className="glass-panel overflow-hidden flex flex-col justify-between group shadow-glass-soft border-white/60 hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
              <div className="aspect-[4/3] relative w-full overflow-hidden bg-sage-light">
                <Image 
                  src={crop.image} 
                  alt={isUrdu ? crop.nameUr : crop.nameEn} 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-xs font-bold text-primary px-2.5 py-1 rounded-full shadow-sm">
                  {isUrdu ? `گریڈ ${crop.grade}` : `Grade ${crop.grade}`}
                </span>
                {crop.isOrganic && (
                  <span className="absolute top-3 right-3 bg-secondary text-foreground text-[10px] font-black tracking-wider uppercase px-2.5 py-1 rounded-full shadow-sm">
                    {isUrdu ? "آرگینک" : "Organic"}
                  </span>
                )}
                <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-xs font-bold text-white px-2 py-0.5 rounded">
                  {isUrdu ? `کٹائی: ${crop.harvestedUr}` : `Harvested ${crop.harvestedEn}`}
                </span>
              </div>

              <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-foreground/50 mb-1">
                    <MapPin size={12} />
                    <span>{isUrdu ? crop.locationUr : crop.locationEn}</span>
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-2">
                    {isUrdu ? crop.nameUr : crop.nameEn}
                  </h3>
                  
                  <div className="flex items-center gap-2 mb-3 bg-primary/5 py-1.5 px-3 rounded-xl border border-primary/5">
                    <span className="text-xs font-semibold text-primary-dark flex items-center gap-1">
                      👨‍🌾 {isUrdu ? crop.farmerUr : crop.farmerEn}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-sage/20">
                  <div>
                    <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider block">{isUrdu ? "براہ راست قیمت" : "Direct Price"}</span>
                    <span className="text-lg font-black text-primary">Rs. {crop.price}<span className="text-xs text-foreground/60 font-medium">/{isUrdu ? crop.unitUr : crop.unitEn}</span></span>
                  </div>
                  <Link href="/marketplace" className="bg-primary hover:bg-primary-dark text-white font-sans text-xs font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 shadow-md">
                    {isUrdu ? "خریدیں" : "Buy Direct"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
