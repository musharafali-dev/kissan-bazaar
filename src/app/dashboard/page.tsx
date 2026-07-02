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
  Calendar, 
  Layers, 
  DollarSign, 
  Sparkles,
  Trash2,
  Edit3
} from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("inventory");
  const [crops, setCrops] = useState([
    { id: 1, name: "Gilgit Apricots", qty: 350, price: 180, grade: "A", harvest: "2026-07-01", status: "Active" },
    { id: 2, name: "Swat Tomatoes", qty: 45, price: 120, grade: "A", harvest: "2026-07-02", status: "Low Stock" },
    { id: 3, name: "Red Potatoes", qty: 1200, price: 80, grade: "B", harvest: "2026-06-29", status: "Active" }
  ]);

  // Form states
  const [cropName, setCropName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [grade, setGrade] = useState("A");
  const [harvestDate, setHarvestDate] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  // File Upload states
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [csvUploadSuccess, setCsvUploadSuccess] = useState(false);

  // Add Crop Listing Handler (3-tap setup)
  const handleAddCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropName || !quantity || !price || !harvestDate) return;

    const newCrop = {
      id: crops.length + 1,
      name: cropName,
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
    // Simulate parsing
    setCsvUploadSuccess(true);
    setTimeout(() => {
      const mockCsvCrops = [
        { id: Date.now() + 1, name: "Karakoram Cherries", qty: 250, price: 300, grade: "A", harvest: "2026-07-03", status: "Active" },
        { id: Date.now() + 2, name: "Hunza Apples", qty: 800, price: 150, grade: "A", harvest: "2026-07-02", status: "Active" }
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
    <div className="min-h-screen bg-gradient-to-br from-offwhite to-sage/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <span className="text-xs font-bold text-accent uppercase tracking-wider">Farmer Central</span>
            <h1 className="text-3xl font-heading font-black text-primary-dark mt-1 flex items-center gap-2">
              <Sprout size={32} className="text-primary animate-bounce" />
              Sajid Ali&apos;s Farm Dashboard
            </h1>
          </div>
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
            <div className="glass-panel py-2 px-4 shadow-glass-soft text-center border-white/50">
              <span className="text-[10px] uppercase font-bold text-foreground/50 block">Monthly Sales</span>
              <span className="text-base font-extrabold text-primary">Rs. 92.4k</span>
            </div>
            <div className="glass-panel py-2 px-4 shadow-glass-soft text-center border-white/50">
              <span className="text-[10px] uppercase font-bold text-foreground/50 block">Active Crops</span>
              <span className="text-base font-extrabold text-primary">{crops.length}</span>
            </div>
            <div className="glass-panel py-2 px-4 shadow-glass-soft text-center border-white/50">
              <span className="text-[10px] uppercase font-bold text-foreground/50 block">Commission %</span>
              <span className="text-base font-extrabold text-secondary-dark">0% <span className="text-[10px] text-foreground/50">(Direct)</span></span>
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
            <span>Active Inventory ({crops.length})</span>
          </button>
          <button 
            onClick={() => setActiveTab("add")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap min-h-[48px] ${activeTab === "add" ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-sage/20'}`}
          >
            <PlusCircle size={18} />
            <span>Quick List Crop</span>
          </button>
          <button 
            onClick={() => setActiveTab("bulk")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap min-h-[48px] ${activeTab === "bulk" ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-sage/20'}`}
          >
            <Upload size={18} />
            <span>Bulk CSV Upload</span>
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-bold rounded-t-xl transition-all whitespace-nowrap min-h-[48px] ${activeTab === "analytics" ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-sage/20'}`}
          >
            <BarChart3 size={18} />
            <span>Sales & Trends</span>
          </button>
        </div>

        {/* ==========================================
            TAB CONTENT 1: ACTIVE INVENTORY
            ========================================== */}
        {activeTab === "inventory" && (
          <div className="space-y-6">
            {/* Low stock alerts */}
            {crops.some(c => c.qty < 50) && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3.5 rounded-2xl flex items-center gap-3 shadow-sm animate-pulse">
                <AlertTriangle className="text-amber-600 shrink-0" />
                <div className="text-xs md:text-sm">
                  <span className="font-bold">Stock Alert:</span> Some of your crop quantities are low. Buyers cannot see listings below 10kg.
                </div>
              </div>
            )}

            <div className="glass-panel overflow-hidden border-white/50 shadow-glass-soft">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-primary/5 text-primary-dark font-sans border-b border-sage/35">
                      <th className="py-4 px-6 font-bold">Crop / فصل</th>
                      <th className="py-4 px-6 font-bold">Grade</th>
                      <th className="py-4 px-6 font-bold">Qty (kg)</th>
                      <th className="py-4 px-6 font-bold">Price / kg</th>
                      <th className="py-4 px-6 font-bold">Harvest Date</th>
                      <th className="py-4 px-6 font-bold">Status</th>
                      <th className="py-4 px-6 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sage/20 font-sans">
                    {crops.map((crop) => (
                      <tr key={crop.id} className="hover:bg-sage/10 transition-colors">
                        <td className="py-4 px-6 font-extrabold text-foreground">{crop.name}</td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                            {crop.grade}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold">{crop.qty} kg</td>
                        <td className="py-4 px-6 font-extrabold text-primary-dark">Rs. {crop.price}</td>
                        <td className="py-4 px-6 text-foreground/70">{crop.harvest}</td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${crop.qty < 50 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                            {crop.qty < 50 ? 'Low Stock' : 'Active'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button className="p-2 hover:bg-primary/10 rounded-full text-primary transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center" aria-label="Edit">
                              <Edit3 size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteCrop(crop.id)}
                              className="p-2 hover:bg-red-50 rounded-full text-red-600 transition-colors min-h-[48px] min-w-[48px] flex items-center justify-center" 
                              aria-label="Delete"
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

        {/* ==========================================
            TAB CONTENT 2: QUICK ADD LISTING (3-TAPS)
            ========================================== */}
        {activeTab === "add" && (
          <div className="max-w-2xl mx-auto">
            {showSuccess ? (
              <div className="glass-panel p-8 text-center border-white/60 shadow-glass animate-fade-in py-16">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mx-auto mb-4 border-2 border-green-500 shadow-md">
                  <Sprout size={32} className="stroke-[2.5]" />
                </div>
                <span className="inline-block px-3 py-1 rounded-full bg-secondary/15 text-secondary-dark text-xs font-bold mb-2">
                  1-Tap Listed
                </span>
                <h3 className="text-xl font-heading font-black text-primary-dark">Crop Added Successfully!</h3>
                <p className="text-xs text-foreground/60 mt-1">Updating inventory catalog...</p>
              </div>
            ) : (
              <form onSubmit={handleAddCrop} className="glass-panel p-6 md:p-8 border-white/60 shadow-glass space-y-4">
                <h2 className="text-xl font-heading font-black text-primary-dark mb-4">
                  Quick Crop Listing Form
                </h2>
                
                {/* 1. Crop Select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    1. Select Crop / فصل کا انتخاب کریں
                  </label>
                  <select 
                    value={cropName} 
                    onChange={(e) => setCropName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-base font-sans min-h-[48px]"
                    required
                  >
                    <option value="">-- Choose Crop --</option>
                    <option value="Gilgit Apricots">Gilgit Apricots / خوبانی</option>
                    <option value="Red Tomatoes">Red Tomatoes / ٹماٹر</option>
                    <option value="Red Potatoes">Red Potatoes / آلو</option>
                    <option value="Sindhri Mangoes">Sindhri Mangoes / عام</option>
                    <option value="Basmati Rice">Basmati Rice / چاول</option>
                  </select>
                </div>

                {/* 2. Quantity & Price Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      2. Total Weight (kg)
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
                      Price per kg (Rs.)
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
                      3. Harvest Date / کٹائی کی تاریخ
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
                      Quality Grade
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["A", "B", "C"].map((g) => (
                        <button
                          type="button"
                          key={g}
                          onClick={() => setGrade(g)}
                          className={`py-2 rounded-xl border text-sm font-bold transition-all min-h-[48px] ${grade === g ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                        >
                          Grade {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Drag and Drop Media Placeholder */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    Crop Media (Optional)
                  </label>
                  <div className="border-2 border-dashed border-primary/20 rounded-2xl p-4 text-center hover:bg-primary/5 transition-colors">
                    <Upload size={24} className="text-primary mx-auto mb-2" />
                    <span className="text-xs text-foreground/70 font-semibold block">Drag crop photos or short videos here</span>
                    <span className="text-[10px] text-foreground/40 mt-1 block">Maximum size 10MB</span>
                  </div>
                </div>

                {/* 3-Tap Direct Listing CTA */}
                <button 
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary-dark text-foreground font-sans font-bold py-4 px-6 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md shadow-secondary/15 min-h-[48px]"
                >
                  <Sparkles size={18} />
                  <span>3-Tap List Now</span>
                </button>
              </form>
            )}
          </div>
        )}

        {/* ==========================================
            TAB CONTENT 3: BULK CSV UPLOAD
            ========================================== */}
        {activeTab === "bulk" && (
          <div className="max-w-2xl mx-auto">
            <div className="glass-panel p-6 md:p-10 border-white/60 shadow-glass text-center space-y-6">
              
              <div>
                <h2 className="text-2xl font-heading font-black text-primary-dark">Bulk Crop CSV Upload</h2>
                <p className="text-sm text-foreground/70 mt-2 leading-relaxed">
                  Export your crops from Excel and drop the CSV file here to upload hundreds of listings simultaneously.
                </p>
              </div>

              {/* DRAG BOX */}
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
                    <h4 className="text-base font-bold">CSV Uploaded and Processed!</h4>
                    <p className="text-xs text-foreground/60 mt-1">2 new crops added to your active inventory.</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-bold text-foreground">
                      Drag & Drop crop_inventory.csv here
                    </p>
                    <p className="text-xs text-foreground/50 mt-1">
                      or click to browse local files
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
                      <span>Browse Files</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Sample Template Link */}
              <div className="bg-sage/20 border border-primary/5 p-4 rounded-2xl text-left">
                <span className="text-xs font-bold text-primary-dark block mb-1">CSV Template Format</span>
                <p className="text-xs text-foreground/60 leading-relaxed mb-3">
                  To ensure perfect uploading, your CSV must include these columns: <span className="font-bold">crop_name, quantity_kg, price_per_kg, grade, harvest_date</span>.
                </p>
                <a href="#" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                  Download Sample CSV Template &rarr;
                </a>
              </div>

            </div>
          </div>
        )}

        {/* ==========================================
            TAB CONTENT 4: SALES ANALYTICS & TRENDS
            ========================================== */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Sales Chart Glass Panel */}
            <div className="lg:col-span-8 glass-panel p-6 shadow-glass-soft border-white/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Earnings Tracker</span>
                <h3 className="text-xl font-heading font-black text-primary-dark mt-1">Monthly Direct Profit</h3>
                <p className="text-xs text-foreground/60">Skipping the middleman saved Rs. 14,200 in commissions this month!</p>
              </div>

              {/* Pure SVG Custom Responsive Chart */}
              <div className="w-full h-64 mt-6 relative">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#DDE5D4" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="70" x2="480" y2="70" stroke="#DDE5D4" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="120" x2="480" y2="120" stroke="#DDE5D4" strokeDasharray="4 4" strokeWidth="1" />
                  <line x1="40" y1="170" x2="480" y2="170" stroke="#DDE5D4" strokeWidth="1.5" />

                  {/* Profit Line (Smooth Gradient Filled Area) */}
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D6A4F" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2D6A4F" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  
                  {/* Area Under Curve */}
                  <path 
                    d="M 40 170 L 100 130 L 180 150 L 260 80 L 340 100 L 420 50 L 480 30 L 480 170 Z" 
                    fill="url(#chartGrad)" 
                  />

                  {/* Stroke Line */}
                  <path 
                    d="M 40 170 L 100 130 L 180 150 L 260 80 L 340 100 L 420 50 L 480 30" 
                    fill="none" 
                    stroke="#2D6A4F" 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                  />

                  {/* Data Points */}
                  <circle cx="100" cy="130" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="180" cy="150" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="260" cy="80" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="340" cy="100" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="420" cy="50" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />
                  <circle cx="480" cy="30" r="5" fill="#E9B44C" stroke="#2D6A4F" strokeWidth="2" />

                  {/* Y-Axis Labels */}
                  <text x="5" y="25" fill="#A47551" className="text-[10px] font-bold font-sans">Rs. 100k</text>
                  <text x="5" y="75" fill="#A47551" className="text-[10px] font-bold font-sans">Rs. 50k</text>
                  <text x="5" y="125" fill="#A47551" className="text-[10px] font-bold font-sans">Rs. 25k</text>
                  <text x="5" y="175" fill="#A47551" className="text-[10px] font-bold font-sans">Rs. 0</text>

                  {/* X-Axis Labels */}
                  <text x="90" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">Week 1</text>
                  <text x="170" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">Week 2</text>
                  <text x="250" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">Week 3</text>
                  <text x="330" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">Week 4</text>
                  <text x="410" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">Week 5</text>
                  <text x="470" y="192" fill="#1A1A1A" className="text-[10px] font-bold font-sans">Now</text>
                </svg>
              </div>
            </div>

            {/* Regional Mandi Comparison */}
            <div className="lg:col-span-4 glass-panel p-6 shadow-glass-soft border-white/50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-accent uppercase tracking-wider">Mandi Price Trends</span>
                <h3 className="text-lg font-heading font-bold text-primary-dark mt-1">Apricot Rates / خوبانی</h3>
                <p className="text-xs text-foreground/60 mt-1">Compare local mountain rates with city consumer markets.</p>
              </div>

              <div className="space-y-4 my-6">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-foreground mb-1.5">
                    <span>Gilgit-Hunza (Local Farm Gate)</span>
                    <span className="text-primary font-black">Rs. 180 / kg</span>
                  </div>
                  <div className="w-full bg-sage-light h-3.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: "45%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-foreground mb-1.5">
                    <span>Islamabad Sabzi Mandi</span>
                    <span className="text-foreground/75 font-black">Rs. 320 / kg</span>
                  </div>
                  <div className="w-full bg-sage-light h-3.5 rounded-full overflow-hidden">
                    <div className="bg-accent h-full rounded-full transition-all" style={{ width: "70%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold text-foreground mb-1.5">
                    <span>Karachi Super Market</span>
                    <span className="text-foreground/75 font-black">Rs. 420 / kg</span>
                  </div>
                  <div className="w-full bg-sage-light h-3.5 rounded-full overflow-hidden">
                    <div className="bg-secondary-dark h-full rounded-full transition-all" style={{ width: "95%" }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-primary/5 p-3 rounded-2xl border border-primary/5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary-dark flex items-center gap-1">
                  <TrendingUp size={12} /> Direct Margin Advantage
                </span>
                <p className="text-xs text-foreground/80 mt-1">
                  Selling through Kissan Bazaar directly earns you <span className="font-bold text-primary">Rs. 60-80 more per kg</span> than traditional commission agents.
                </p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
