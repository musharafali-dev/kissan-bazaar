"use client";

import React, { useState } from "react";
import { 
  Sprout, 
  PlusCircle, 
  FileText, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  Upload, 
  Layers, 
  Sparkles,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  User,
  Phone,
  MapPin,
  ShieldCheck
} from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

interface Crop {
  id: number;
  nameEn: string;
  nameUr: string;
  qty: number;
  price: number;
  grade: string;
  harvest: string;
  status: string;
}

export default function DashboardPage() {
  const { isUrdu } = useLanguageStore();
  const [activeTab, setActiveTab] = useState("inventory");
  const [crops, setCrops] = useState<Crop[]>([
    { id: 1, nameEn: "Gilgit Apricots", nameUr: "گلگت خوبانی", qty: 350, price: 180, grade: "A", harvest: "2026-07-01", status: "Active" },
    { id: 2, nameEn: "Swat Tomatoes", nameUr: "سوات ٹماٹر", qty: 45, price: 120, grade: "A", harvest: "2026-07-02", status: "Low Stock" },
    { id: 3, nameEn: "Red Potatoes", nameUr: "سرخ آلو", qty: 1200, price: 80, grade: "B", harvest: "2026-06-29", status: "Active" }
  ]);

  // ── Edit Modal state ─────────────────────────────────────────────────────
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [editSaved, setEditSaved]     = useState(false);
  const [editForm, setEditForm]       = useState({ nameEn: "", nameUr: "", qty: "", price: "", grade: "A", harvest: "" });

  const openEditModal = (crop: Crop) => {
    setEditingCrop(crop);
    setEditSaved(false);
    setEditForm({
      nameEn:  crop.nameEn,
      nameUr:  crop.nameUr,
      qty:     String(crop.qty),
      price:   String(crop.price),
      grade:   crop.grade,
      harvest: crop.harvest,
    });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop) return;
    const updatedQty = parseFloat(editForm.qty);
    setCrops(prev =>
      prev.map(c =>
        c.id === editingCrop.id
          ? { ...c, nameEn: editForm.nameEn, nameUr: editForm.nameUr, qty: updatedQty, price: parseFloat(editForm.price), grade: editForm.grade, harvest: editForm.harvest, status: updatedQty < 50 ? "Low Stock" : "Active" }
          : c
      )
    );
    setEditSaved(true);
    setTimeout(() => {
      setEditingCrop(null);
      setEditSaved(false);
    }, 1200);
  };

  // ── Farmer Profile state ─────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    nameEn:  "Sajid Ali",
    nameUr:  "ساجد علی",
    phone:   "0333-1234567",
    cnic:    "42201-1234567-8",
    village: "Karimabad, Hunza",
    district:"Hunza-Nagar, GB",
    bankAccount: "HBL – 1234567890",
    bio:     "Mountain farmer growing organic apricots, cherries and walnuts since 2005.",
  });
  const [profileSaved, setProfileSaved] = useState(false);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  // Form states (Add crop)
  const [cropName, setCropName]       = useState("");
  const [quantity, setQuantity]       = useState("");
  const [price, setPrice]             = useState("");
  const [grade, setGrade]             = useState("A");
  const [harvestDate, setHarvestDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // File Upload states
  const [csvFile, setCsvFile]                 = useState<File | null>(null);
  const [isDragging, setIsDragging]           = useState(false);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState(false);

  // Add Crop Listing Handler (3-tap setup)
  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !price || !harvestDate) return;

    const newCrop = {
      id: crops.length + 1,
      nameEn: cropName,
      nameUr: isUrdu ? cropName : cropName + " (Urdu)",
      qty: parseFloat(quantity),
      price: parseFloat(price),
      grade: grade,
      harvest: harvestDate,
      status: parseFloat(quantity) < 50 ? "Low Stock" : "Active"
    };

    setCrops([newCrop, ...crops]);
    setCropName("");
    setQuantity("");
    setPrice("");
    setHarvestDate("");
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setActiveTab("inventory");
    }, 1500);
  };

  // CSV Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv")) {
        setCsvFile(file);
        parseCSV();
      }
    }
  };

  const parseCSV = () => {
    setCsvUploadSuccess(true);
    setTimeout(() => {
      const mockCsvCrops = [
        { id: Date.now() + 1, nameEn: "Karakoram Cherries", nameUr: "قراقرم چیری", qty: 250, price: 300, grade: "A", harvest: "2026-07-03", status: "Active" },
        { id: Date.now() + 2, nameEn: "Hunza Apples", nameUr: "ہنزہ سیب", qty: 800, price: 150, grade: "A", harvest: "2026-07-02", status: "Active" }
      ];
      setCrops((prev) => [...mockCsvCrops, ...prev]);
      setCsvUploadSuccess(false);
      setCsvFile(null);
      setActiveTab("inventory");
    }, 2000);
  };

  const handleDeleteCrop = (id: number) => {
    setCrops(crops.filter(c => c.id !== id));
  };

  return (
    <>
    <div className={`min-h-screen bg-gradient-to-br from-offwhite to-sage/20 p-4 md:p-8 ${isUrdu ? "rtl-grid text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">
              {isUrdu ? "مرکزی کسان ڈیش بورڈ" : "Farmer Central"}
            </span>
            <h1 className="text-3xl font-heading font-black text-primary-dark mt-1 flex items-center gap-2">
              <Sprout size={32} className="text-primary animate-bounce" />
              {isUrdu ? "ساجد علی کا زرعی ڈیش بورڈ" : "Sajid Ali's Farm Dashboard"}
            </h1>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="glass-panel py-2 px-4 shadow-glass-soft text-center border-white/50">
              <span className="text-[10px] uppercase font-bold text-foreground/50 block">{isUrdu ? "ماہانہ فروخت" : "Monthly Sales"}</span>
              <span className="text-base font-extrabold text-primary">Rs. 92.4k</span>
            </div>
            <div className="glass-panel py-2 px-4 shadow-glass-soft text-center border-white/50">
              <span className="text-[10px] uppercase font-bold text-foreground/50 block">{isUrdu ? "فعال فصلیں" : "Active Crops"}</span>
              <span className="text-base font-extrabold text-primary">{crops.length}</span>
            </div>
            <div className="glass-panel py-2 px-4 shadow-glass-soft text-center border-white/50">
              <span className="text-[10px] uppercase font-bold text-foreground/50 block">{isUrdu ? "کمیشن شرح" : "Commission %"}</span>
              <span className="text-base font-extrabold text-secondary-dark">0% <span className="text-[10px] text-foreground/50">({isUrdu ? "براہ راست" : "Direct"})</span></span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-sage-dark/30 mb-8 overflow-x-auto gap-2 md:gap-4 py-1">
          <button 
            onClick={() => setActiveTab("inventory")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap min-h-[48px] ${activeTab === "inventory" ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-sage/20'}`}
          >
            <Layers size={18} />
            <span>{isUrdu ? `فعال سٹاک (${crops.length})` : `Active Inventory (${crops.length})`}</span>
          </button>
          <button 
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap min-h-[48px] ${activeTab === "add" ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-sage/20'}`}
          >
            <PlusCircle size={18} />
            <span>{isUrdu ? "فصل شامل کریں" : "Quick List Crop"}</span>
          </button>
          <button 
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap min-h-[48px] ${activeTab === "bulk" ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-sage/20'}`}
          >
            <Upload size={18} />
            <span>{isUrdu ? "بلک اپ لوڈ (CSV)" : "Bulk CSV Upload"}</span>
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap min-h-[48px] ${activeTab === "analytics" ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-sage/20'}`}
          >
            <BarChart3 size={18} />
            <span>{isUrdu ? "فروخت اور تجزیہ" : "Sales & Trends"}</span>
          </button>
          <button 
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap min-h-[48px] ${activeTab === "profile" ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-sage/20'}`}
          >
            <User size={18} />
            <span>{isUrdu ? "میری پروفائل" : "My Profile"}</span>
          </button>
        </div>

        {/* TAB CONTENT 1: ACTIVE INVENTORY */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            {crops.some(c => c.qty < 50) && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm animate-pulse">
                <AlertTriangle className="text-amber-600 shrink-0" />
                <div className="text-xs md:text-sm">
                  <span className="font-bold">{isUrdu ? "سٹاک الرٹ:" : "Stock Alert:"}</span>{" "}
                  {isUrdu 
                    ? "آپ کی کچھ فصلوں کا سٹاک کم ہو گیا ہے۔ خریدار 10 کلو سے کم والی لسٹنگ نہیں دیکھ سکتے۔" 
                    : "Some of your crop quantities are low. Buyers cannot see listings below 10kg."}
                </div>
              </div>
            )}

            <div className="glass-panel overflow-hidden border-white/50 shadow-glass-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary/5 text-primary-dark font-sans border-b border-sage/35">
                      <th className="py-4 px-6 font-bold">{isUrdu ? "فصل" : "Crop / فصل"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "گریڈ" : "Grade"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "مقدار" : "Qty (kg)"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "قیمت فی کلو" : "Price / kg"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "کٹائی کی تاریخ" : "Harvest Date"}</th>
                      <th className="py-4 px-6 font-bold">{isUrdu ? "حیثیت" : "Status"}</th>
                      <th className="py-4 px-6 font-bold text-center">{isUrdu ? "اقدامات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage/20 font-sans">
                    {crops.map((crop) => (
                      <tr key={crop.id} className="hover:bg-sage/10 transition-colors">
                        <td className="py-4 px-6 font-extrabold text-foreground">{isUrdu ? crop.nameUr : crop.nameEn}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                            {crop.grade}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold">{crop.qty} {isUrdu ? "کلو" : "kg"}</td>
                        <td className="py-4 px-6 font-extrabold text-primary-dark">Rs. {crop.price}</td>
                        <td className="py-4 px-6 text-foreground/70">{crop.harvest}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${crop.qty < 50 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {crop.qty < 50 ? (isUrdu ? "کم سٹاک" : "Low Stock") : (isUrdu ? "فعال" : "Active")}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button 
                              onClick={() => openEditModal(crop)}
                              className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center" 
                              aria-label="Edit crop"
                              title={isUrdu ? "تدوین کریں" : "Edit crop"}
                            >
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCrop(crop.id)}
                              className="p-2 hover:bg-red-50 rounded-full text-red-600 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center" 
                              aria-label="Delete crop"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB CONTENT 2: QUICK ADD LISTING */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto">
            {showSuccess ? (
              <div className="glass-panel p-8 text-center border-white/60 shadow-glass animate-fade-in py-16">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4 border-2 border-green-500 shadow-md">
                  <Sprout size={32} className="stroke-[2.5]" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/15 text-secondary-dark text-xs font-bold mb-2">
                  {isUrdu ? "1-کلک لسٹڈ" : "1-Tap Listed"}
                </span>
                <h3 className="text-xl font-heading font-black text-primary-dark">{isUrdu ? "فصل کامیابی سے شامل ہو گئی!" : "Crop Added Successfully!"}</h3>
                <p className="text-xs text-foreground/60 mt-1">{isUrdu ? "انوینٹری اپ ڈیٹ ہو رہی ہے..." : "Updating inventory catalog..."}</p>
              </div>
            ) : (
              <form onSubmit={handleAddCrop} className="glass-panel p-6 md:p-8 border-white/60 shadow-glass space-y-4">
                <h2 className="text-xl font-heading font-black text-primary-dark mb-4">
                  {isUrdu ? "فصل شامل کرنے کا فارم" : "Quick Crop Listing Form"}
                </h2>
                
                {/* 1. Crop Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    {isUrdu ? "1. فصل کا انتخاب کریں" : "1. Select Crop / فصل کا انتخاب کریں"}
                  </label>
                  <select 
                    value={cropName} 
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-base font-sans min-h-[48px]"
                    required
                  >
                    <option value="">{isUrdu ? "-- فصل منتخب کریں --" : "-- Choose Crop --"}</option>
                    <option value="Gilgit Apricots">{isUrdu ? "خوبانی" : "Gilgit Apricots"}</option>
                    <option value="Red Tomatoes">{isUrdu ? "टماٹر / ٹماٹر" : "Red Tomatoes"}</option>
                    <option value="Red Potatoes">{isUrdu ? "آلو" : "Red Potatoes"}</option>
                    <option value="Sindhri Mangoes">{isUrdu ? "سندھڑی آم" : "Sindhri Mangoes"}</option>
                    <option value="Basmati Rice">{isUrdu ? "باسمتی چاول" : "Basmati Rice"}</option>
                  </select>
                </div>

                {/* 2. Quantity & Price Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "2. کل وزن (کلو گرام)" : "2. Total Weight (kg)"}
                    </label>
                    <input 
                      type="number"
                      placeholder="e.g. 500"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-base font-sans min-h-[48px]"
                      min="1"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "قیمت فی کلو (روپے)" : "Price per kg (Rs.)"}
                    </label>
                    <input 
                      type="number"
                      placeholder="e.g. 150"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-base font-sans min-h-[48px]"
                      min="1"
                      required
                    />
                  </div>
                </div>

                {/* 3. Harvest Date & Grade Select */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "3. کٹائی کی تاریخ" : "3. Harvest Date / کٹائی کی تاریخ"}
                    </label>
                    <input 
                      type="date"
                      value={harvestDate}
                      onChange={(e) => setHarvestDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-base font-sans min-h-[48px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "معیار کا گریڈ" : "Quality Grade"}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["A", "B", "C"].map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setGrade(g)}
                          className={`py-2 rounded-xl border text-sm font-bold transition-all min-h-[48px] ${grade === g ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                        >
                          {isUrdu ? `گریڈ ${g}` : `Grade ${g}`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    {isUrdu ? "فصل کی تصاویر یا ویڈیو (اختیاری)" : "Crop Media (Optional)"}
                  </label>
                  <div className="border-2 border-dashed border-primary/20 rounded-2xl p-4 text-center hover:bg-primary/5 transition-colors">
                    <Upload size={24} className="text-primary mx-auto mb-2" />
                    <span className="text-xs text-foreground/70 font-semibold block">{isUrdu ? "فصل کی تصاویر یا ویڈیوز یہاں ڈراپ کریں" : "Drag crop photos or short videos here"}</span>
                    <span className="text-[10px] text-foreground/40 mt-1 block">{isUrdu ? "زیادہ سے زیادہ سائز 10 ایم بی" : "Maximum size 10MB"}</span>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary-dark text-foreground font-sans font-bold py-4 px-6 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md shadow-secondary/15 min-h-[48px]"
                >
                  <Sparkles size={18} />
                  <span>{isUrdu ? "صرف 3 کلک میں لسٹ کریں" : "3-Tap List Now"}</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB CONTENT 3: BULK CSV UPLOAD */}
        {activeTab === "bulk" && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-6 md:p-10 border-white/60 shadow-glass text-center space-y-6">
              
              <div>
                <h2 className="text-2xl font-heading font-black text-primary-dark">{isUrdu ? "اکٹھی لسٹنگ کی فائل اپ لوڈ کریں" : "Bulk Crop CSV Upload"}</h2>
                <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
                  {isUrdu ? "ایکسل سے اپنی فصلوں کی معلومات نکالیں اور ایک ساتھ لسٹ کرنے کے لیے یہاں فائل ڈراپ کریں۔" : "Export your crops from Excel and drop the CSV file here to upload hundreds of listings simultaneously."}
                </p>
              </div>

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${isDragging ? 'border-primary bg-primary/5 scale-102' : 'border-primary/20 hover:border-primary/45 bg-white/40'}`}
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Upload size={32} className={isDragging ? 'animate-bounce' : ''} />
                </div>
                
                {csvUploadSuccess ? (
                  <div className="animate-fade-in text-green-600">
                    <span className="inline-block text-xs font-bold bg-green-50 px-2 py-1 rounded mb-2">Success</span>
                    <h4 className="text-base font-bold">{isUrdu ? "سی ایس وی اپ لوڈ مکمل ہو گئی!" : "CSV Uploaded and Processed!"}</h4>
                    <p className="text-xs text-foreground/60 mt-1">{isUrdu ? "2 نئی فصلیں انوینٹری میں شامل کر دی گئی ہیں۔" : "2 new crops added to your active inventory."}</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      {isUrdu ? "فائل یہاں ڈریگ اینڈ ڈراپ کریں" : "Drag & Drop crop_inventory.csv here"}
                    </p>
                    <p className="text-xs text-foreground/50 mt-1">
                      {isUrdu ? "یا فائل منتخب کرنے کے لیے یہاں کلک کریں" : "or click to browse local files"}
                    </p>
                    <input 
                      type="file" 
                      accept=".csv"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setCsvFile(e.target.files[0]);
                          parseCSV();
                        }
                      }}
                      className="hidden" 
                      id="csv-file-picker"
                    />
                    <label 
                      htmlFor="csv-file-picker" 
                      className="inline-flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs px-4 py-2 rounded-full cursor-pointer mt-4 transition-colors min-h-[48px]"
                    >
                      <FileText size={14} />
                      <span>{isUrdu ? "فائلیں تلاش کریں" : "Browse Files"}</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="bg-sage/20 border border-primary/5 p-4 rounded-2xl text-left">
                <span className="text-xs font-bold text-primary-dark block mb-1">{isUrdu ? "فائل کا فارمیٹ" : "CSV Template Format"}</span>
                <p className="text-xs text-foreground/60 leading-relaxed mb-3">
                  {isUrdu ? "درست اپ لوڈنگ کے لیے آپ کی فائل میں یہ کالم ہونا لازمی ہیں: crop_name, quantity_kg, price_per_kg, grade, harvest_date" : "To ensure perfect uploading, your CSV must include these columns: crop_name, quantity_kg, price_per_kg, grade, harvest_date."}
                </p>
                <a href="#" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  {isUrdu ? "سیمپل فائل ڈاؤن لوڈ کریں" : "Download Sample CSV Template &rarr;"}
                </a>
              </div>

            </div>
          </div>
        )}

        {/* TAB CONTENT 4: SALES ANALYTICS */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            <div className="lg:col-span-8 glass-panel p-6 shadow-glass-soft border-white/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">{isUrdu ? "آمدنی کا ریکارڈ" : "Earnings Tracker"}</span>
                <h3 className="text-xl font-heading font-black text-primary-dark mt-1">{isUrdu ? "ماہانہ براہ راست منافع" : "Monthly Direct Profit"}</h3>
                <p className="text-xs text-foreground/60">{isUrdu ? "مڈل مین کے بغیر فروخت سے اس مہینے آپ کو 14,200 روپے کی اضافی بچت ہوئی!" : "Skipping the middleman saved Rs. 14,200 in commissions this month!"}</p>
              </div>

              <div className="w-full h-64 mt-6 relative">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#DDE5D4" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#DDE5D4" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#DDE5D4" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#DDE5D4" strokeWidth="1.5" />

                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  <path 
                    d="M 40 170 L 100 130 L 180 150 L 260 80 L 340 100 L 420 50 L 480 30 L 480 170 Z" 
                    fill="url(#chartGrad)" 
                  />

                  <path 
                    d="M 40 170 L 100 130 L 180 150 L 260 80 L 340 100 L 420 50 L 480 30" 
                    fill="none" 
                    stroke="#2D6A4F" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />

                  <circle cx="100" cy="130" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="180" cy="150" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="260" cy="80" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="340" cy="100" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="420" cy="50" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="480" cy="30" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />

                  <text x="5" y="25" fill="#A47551" className="text-[10px] font-bold font-sans">Rs. 100k</text>
                  <text x="5" y="75" fill="#A47551" className="text-[10px] font-bold font-sans">Rs. 50k</text>
                  <text x="5" y="125" fill="#A47551" className="text-[10px] font-bold font-sans">Rs. 25k</text>
                  <text x="5" y="175" fill="#A47551" className="text-[10px] font-bold font-sans">Rs. 0</text>

                  <text x="90" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">{isUrdu ? "ہفتہ 1" : "Week 1"}</text>
                  <text x="170" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">{isUrdu ? "ہفتہ 2" : "Week 2"}</text>
                  <text x="250" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">{isUrdu ? "ہفتہ 3" : "Week 3"}</text>
                  <text x="330" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">{isUrdu ? "ہفتہ 4" : "Week 4"}</text>
                  <text x="410" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">{isUrdu ? "ہفتہ 5" : "Week 5"}</text>
                  <text x="470" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">{isUrdu ? "ابھی" : "Now"}</text>
                </svg>
              </div>
            </div>

            {/* Regional Mandi Comparison */}
            <div className="lg:col-span-4 glass-panel p-6 shadow-glass-soft border-white/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">{isUrdu ? "منڈی کے ریٹس کا رجحان" : "Mandi Price Trends"}</span>
                <h3 className="text-lg font-heading font-bold text-primary-dark mt-1">{isUrdu ? "خوبانی کے ریٹس" : "Apricot Rates / خوبانی"}</h3>
                <p className="text-xs text-foreground/60 mt-1">{isUrdu ? "شہری منڈیوں اور فارم کے ریٹس کا موازنہ۔" : "Compare local mountain rates with city consumer markets."}</p>
              </div>

              <div className="space-y-4 my-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-foreground mb-1.5">
                    <span>{isUrdu ? "گلگت بلتستان (براہ راست فارم ریٹ)" : "Gilgit-Hunza (Local Farm Gate)"}</span>
                    <span className="text-primary font-black">Rs. 180 / kg</span>
                  </div>
                  <div className="w-full bg-sage-light h-3.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: "45%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-foreground mb-1.5">
                    <span>{isUrdu ? "اسلام آباد سبزی منڈی" : "Islamabad Sabzi Mandi"}</span>
                    <span className="text-foreground/75 font-black">Rs. 320 / kg</span>
                  </div>
                  <div className="w-full bg-sage-light h-3.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full transition-all" style={{ width: "70%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-foreground mb-1.5">
                    <span>{isUrdu ? "کراچی سپر مارکیٹ" : "Karachi Super Market"}</span>
                    <span className="text-foreground/75 font-black">Rs. 420 / kg</span>
                  </div>
                  <div className="w-full bg-sage-light h-3.5 rounded-full overflow-hidden">
                    <div className="bg-secondary-dark h-full rounded-full transition-all" style={{ width: "95%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-3 rounded-2xl border border-primary/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-dark flex items-center gap-1">
                  <TrendingUp size={12} /> {isUrdu ? "براہ راست فروخت کا فائدہ" : "Direct Margin Advantage"}
                </span>
                <p className="text-xs text-foreground/80 mt-1">
                  {isUrdu 
                    ? "کسان بازار پر براہ راست بیچنے سے مڈل مین کے مقابلے میں آپ کو فی کلو 60 سے 80 روپے کا اضافی منافع حاصل ہوتا ہے۔"
                    : "Selling through Kissan Bazaar directly earns you Rs. 60-80 more per kg than traditional commission agents."}
                </p>
              </div>
            </div>

          </div>
        )}

        {/* ─── TAB: FARMER PROFILE EDIT ───────────────────────────────────────── */}
        {activeTab === "profile" && (
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleProfileSave} className="glass-panel p-6 md:p-8 border-white/60 shadow-glass space-y-5">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-heading font-black text-primary-dark">
                    {isUrdu ? "پروفائل تدوین" : "Edit Farmer Profile"}
                  </h2>
                  <p className="text-xs text-foreground/50">{isUrdu ? "آپ کی معلومات خریداروں کو دکھائی جاتی ہے۔" : "Your info is shown to buyers on listings."}</p>
                </div>
              </div>

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1">
                    {isUrdu ? "نام (انگریزی)" : "Full Name (English)"}
                  </label>
                  <input
                    value={profile.nameEn}
                    onChange={e => setProfile(p => ({ ...p, nameEn: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1">
                    {isUrdu ? "نام (اردو)" : "Full Name (Urdu)"}
                  </label>
                  <input
                    dir="rtl"
                    value={profile.nameUr}
                    onChange={e => setProfile(p => ({ ...p, nameUr: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                  />
                </div>
              </div>

              {/* Phone & CNIC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1 flex items-center gap-1">
                    <Phone size={11} /> {isUrdu ? "موبائل نمبر" : "Mobile Number"}
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1 flex items-center gap-1">
                    <ShieldCheck size={11} /> {isUrdu ? "شناختی کارڈ نمبر" : "CNIC Number"}
                  </label>
                  <input
                    value={profile.cnic}
                    onChange={e => setProfile(p => ({ ...p, cnic: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                    placeholder="#####-#######-#"
                  />
                </div>
              </div>

              {/* Village & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1 flex items-center gap-1">
                    <MapPin size={11} /> {isUrdu ? "گاؤں / محلہ" : "Village / Area"}
                  </label>
                  <input
                    value={profile.village}
                    onChange={e => setProfile(p => ({ ...p, village: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1">
                    {isUrdu ? "ضلع" : "District / Province"}
                  </label>
                  <input
                    value={profile.district}
                    onChange={e => setProfile(p => ({ ...p, district: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                  />
                </div>
              </div>

              {/* Bank Account */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1">
                  {isUrdu ? "بینک اکاؤنٹ / جاز کیش / ایزی پیسہ" : "Bank Account / JazzCash / EasyPaisa"}
                </label>
                <input
                  value={profile.bankAccount}
                  onChange={e => setProfile(p => ({ ...p, bankAccount: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                  placeholder={isUrdu ? "بینک نام – اکاؤنٹ نمبر" : "Bank Name – Account Number"}
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1">
                  {isUrdu ? "مختصر تعارف" : "Short Bio (shown to buyers)"}
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans resize-none"
                  placeholder={isUrdu ? "اپنے فارم کے بارے میں لکھیں..." : "Tell buyers about your farm..."}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-full transition-colors flex items-center justify-center gap-2 shadow-md min-h-[48px]"
              >
                {profileSaved
                  ? <><CheckCircle2 size={18} /><span>{isUrdu ? "پروفائل محفوظ ہو گئی!" : "Profile Saved!"}</span></>
                  : <><ShieldCheck size={18} /><span>{isUrdu ? "پروفائل محفوظ کریں" : "Save Profile"}</span></>}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>

    {/* ─────────────────────────────────────────────────────────────────── */}
    {/* EDIT CROP MODAL                                                    */}
    {/* ─────────────────────────────────────────────────────────────────── */}
    {editingCrop && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(6px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) setEditingCrop(null); }}
      >
        <div className="w-full max-w-lg bg-white/95 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Modal header */}
          <div className="bg-primary px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Edit3 size={20} className="text-white" />
              <h3 className="text-white font-heading font-black text-lg">
                {isUrdu ? "فصل کی تدوین" : "Edit Crop Listing"}
              </h3>
            </div>
            <button
              onClick={() => setEditingCrop(null)}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {editSaved ? (
            <div className="p-10 text-center">
              <CheckCircle2 size={48} className="text-green-500 mx-auto mb-3" />
              <h4 className="text-lg font-heading font-black text-primary-dark">
                {isUrdu ? "تبدیلیاں محفوظ ہو گئیں!" : "Changes Saved!"}
              </h4>
              <p className="text-xs text-foreground/50 mt-1">{isUrdu ? "انوینٹری اپ ڈیٹ ہو گئی۔" : "Your inventory has been updated."}</p>
            </div>
          ) : (
            <form onSubmit={handleEditSave} className="p-6 space-y-4">

              {/* Crop Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1">
                    {isUrdu ? "فصل کا نام (انگریزی)" : "Crop Name (English)"}
                  </label>
                  <input
                    value={editForm.nameEn}
                    onChange={e => setEditForm(f => ({ ...f, nameEn: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[44px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1">
                    {isUrdu ? "فصل کا نام (اردو)" : "Crop Name (Urdu)"}
                  </label>
                  <input
                    dir="rtl"
                    value={editForm.nameUr}
                    onChange={e => setEditForm(f => ({ ...f, nameUr: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {/* Qty & Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1">
                    {isUrdu ? "مقدار (کلو)" : "Quantity (kg)"}
                  </label>
                  <input
                    type="number" min="1"
                    value={editForm.qty}
                    onChange={e => setEditForm(f => ({ ...f, qty: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[44px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1">
                    {isUrdu ? "قیمت فی کلو (روپے)" : "Price / kg (Rs.)"}
                  </label>
                  <input
                    type="number" min="1"
                    value={editForm.price}
                    onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {/* Grade & Harvest */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1">
                    {isUrdu ? "معیار کا گریڈ" : "Quality Grade"}
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {["A", "B", "Premium"].map(g => (
                      <button
                        type="button" key={g}
                        onClick={() => setEditForm(f => ({ ...f, grade: g }))}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all min-h-[40px] ${
                          editForm.grade === g
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white hover:bg-sage/10 border-primary/15 text-primary-dark'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/60 mb-1">
                    {isUrdu ? "کٹائی کی تاریخ" : "Harvest Date"}
                  </label>
                  <input
                    type="date"
                    value={editForm.harvest}
                    onChange={e => setEditForm(f => ({ ...f, harvest: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/15 bg-white focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[44px]"
                    required
                  />
                </div>
              </div>

              {/* Preview pill */}
              <div className="bg-sage/20 rounded-2xl p-3 flex items-center gap-3">
                <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider shrink-0">{isUrdu ? "پیش نظارہ" : "Preview"}:</span>
                <span className="text-sm font-extrabold text-primary-dark">{editForm.nameEn}</span>
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full">{editForm.grade}</span>
                <span className="text-xs font-bold text-foreground/70 ml-auto">Rs. {editForm.price} / kg</span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCrop(null)}
                  className="flex-1 py-3 rounded-full border border-primary/20 text-primary-dark font-bold text-sm hover:bg-sage/20 transition-colors min-h-[48px]"
                >
                  {isUrdu ? "منسوخ کریں" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-full bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-md min-h-[48px]"
                >
                  <CheckCircle2 size={16} />
                  {isUrdu ? "تبدیلیاں محفوظ کریں" : "Save Changes"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )}
    </>
  );
}
