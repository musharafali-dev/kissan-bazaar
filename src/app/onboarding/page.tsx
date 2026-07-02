"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Phone, 
  ShieldCheck, 
  MapPin, 
  CreditCard, 
  Smartphone, 
  Sparkles, 
  Check, 
  ArrowLeft,
  ArrowRight,
  Upload,
  Coins
} from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

export default function OnboardingPage() {
  const { isUrdu } = useLanguageStore();
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [kycData, setKycData] = useState({
    fullName: "",
    farmName: "",
    cnic: "",
    gpsLat: "35.9208", // Mock Gilgit Lat
    gpsLng: "74.3089", // Mock Gilgit Lng
    payoutType: "easypaisa",
    payoutNumber: "",
    bankName: "",
    bankIban: ""
  });
  const [otpError, setOtpError] = useState("");
  const [formError, setFormError] = useState("");

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setOtpError(isUrdu ? "براہ کرم درست فون نمبر درج کریں۔" : "Please enter a valid phone number.");
      return;
    }
    setOtpError("");
    setOtpSent(true);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234" || otp.length === 4) {
      setStep(2);
    } else {
      setOtpError(isUrdu ? "غلط کوڈ۔ ٹیسٹ کے لیے '1234' درج کریں۔" : "Incorrect code. Try '1234' for testing.");
    }
  };

  const handleKYCSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kycData.fullName || !kycData.farmName || !kycData.cnic || !kycData.payoutNumber) {
      setFormError(isUrdu ? "براہ کرم تمام مطلوبہ فیلڈز پُر کریں۔" : "Please fill out all required fields.");
      return;
    }
    
    // Validate CNIC format 12345-1234567-1
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
    if (!cnicRegex.test(kycData.cnic)) {
      setFormError(isUrdu ? "شناختی کارڈ فارمیٹ 12345-1234567-1 ہونا لازمی ہے۔" : "CNIC format must be 12345-1234567-1");
      return;
    }

    setFormError("");
    setStep(3);
  };

  const formatCNIC = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{1,13}/g);
    const match = (matches && matches[0]) || "";
    const chars = Array.from(match);

    let formatted = "";
    for (let i = 0; i < chars.length; i++) {
      if (i === 5 || i === 12) {
        formatted += "-";
      }
      formatted += chars[i];
    }
    return formatted.slice(0, 15);
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] py-10 px-4 flex items-center justify-center bg-gradient-to-br from-offwhite to-sage/40 ${isUrdu ? "rtl-grid text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      <div className="w-full max-w-lg glass-panel p-6 md:p-10 shadow-glass border-white/60">
        
        {/* STEP HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`w-10 h-2 rounded-full transition-all duration-300 ${step >= s ? 'bg-primary' : 'bg-sage-dark/40'}`} 
              />
            ))}
          </div>
          <span className="text-xs font-bold text-accent uppercase tracking-wider">
            {isUrdu ? `مرحلہ ${step} از 3` : `Step ${step} of 3`}
          </span>
        </div>

        {/* STEP 1: PHONE VERIFICATION (OTP) */}
        {step === 1 && (
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-extrabold text-primary-dark mb-2">
              {isUrdu ? "کسان لاگ ان اور رجسٹریشن" : "Farmer Login & Auth"}
            </h1>
            <p className="text-sm text-foreground/70 mb-6 leading-relaxed">
              {isUrdu ? "اپنا موبائل نمبر درج کریں تاکہ کسان بازار میں آپ کی فصلوں کی لسٹنگ شروع کی جا سکے۔" : "Verify your mobile number to set up your Kissan Bazaar farm listing profile."}
            </p>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-foreground/75 mb-2">
                    {isUrdu ? "موبائل فون نمبر" : "Mobile Phone Number"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 text-base font-semibold font-sans">
                      +92
                    </span>
                    <input 
                      type="tel"
                      id="phone"
                      placeholder="3001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full pl-16 pr-4 py-3.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-base font-sans min-h-[48px]"
                      required
                    />
                  </div>
                  {otpError && <p className="text-red-500 text-xs mt-1 font-semibold">{otpError}</p>}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-sans font-bold py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md shadow-primary/10 min-h-[48px]"
                >
                  <span>{isUrdu ? "او ٹی پی کوڈ بھیجیں" : "Send OTP Code"}</span>
                  <ArrowRight size={18} className={isUrdu ? "rotate-180" : ""} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="otp" className="block text-xs font-bold uppercase tracking-wider text-foreground/75">
                      {isUrdu ? "4 ہندسوں کا ویری فکیشن کوڈ درج کریں" : "Enter 4-Digit Verification Code"}
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setOtpSent(false)}
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-0.5"
                    >
                      <ArrowLeft size={12} className={isUrdu ? "rotate-180" : ""} /> {isUrdu ? "نمبر تبدیل کریں" : "Change Phone"}
                    </button>
                  </div>
                  <input 
                    type="text"
                    id="otp"
                    placeholder="1234"
                    maxLength={4}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                    className="w-full text-center tracking-[1rem] font-black text-2xl py-3.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white font-sans min-h-[48px]"
                    required
                  />
                  {otpError && <p className="text-red-500 text-xs mt-1 font-semibold">{otpError}</p>}
                  <p className="text-[10px] text-foreground/50 mt-2">
                    Tip: Enter any 4-digit code (e.g. 1234) to bypass verification in this demonstration.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary-dark text-foreground font-sans font-bold py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md shadow-secondary/10 min-h-[48px]"
                >
                  <span>{isUrdu ? "تصدیق کریں اور آگے بڑھیں" : "Verify & Proceed"}</span>
                  <ShieldCheck size={18} />
                </button>
              </form>
            )}
          </div>
        )}

        {/* STEP 2: KYC AND PAYOUT SETUP */}
        {step === 2 && (
          <div>
            <h1 className="text-2xl font-heading font-extrabold text-primary-dark mb-1">
              {isUrdu ? "کسان کی کے وائی سی تصدیق" : "Farmer KYC Verification"}
            </h1>
            <p className="text-xs text-foreground/70 mb-6 leading-relaxed">
              {isUrdu ? "سرکاری تعمیل، تصدیق شدہ بیج اور ادائیگی کے حصول کے لیے لازمی معلومات۔" : "Required for government compliance, verified farmer badge, and payout processing."}
            </p>

            <form onSubmit={handleKYCSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    {isUrdu ? "کسان کا پورا نام" : "Farmer Full Name"}
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Muhammad Sajid"
                    value={kycData.fullName}
                    onChange={(e) => setKycData({...kycData, fullName: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    {isUrdu ? "فارم کا نام" : "Farm Name / فارم کا نام"}
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. Karakoram Valley Fruits"
                    value={kycData.farmName}
                    onChange={(e) => setKycData({...kycData, farmName: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                  {isUrdu ? "شناختی کارڈ نمبر" : "CNIC Number (شناختی کارڈ نمبر)"}
                </label>
                <input 
                  type="text"
                  placeholder="34101-1234567-1"
                  value={kycData.cnic}
                  onChange={(e) => setKycData({...kycData, cnic: formatCNIC(e.target.value)})}
                  className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                  {isUrdu ? "فارم کی جی پی ایس لوکیشن" : "Farm GPS Location Pin"}
                </label>
                <div className="flex gap-2 p-3 bg-sage/30 rounded-2xl border border-primary/5 items-center">
                  <MapPin size={22} className="text-primary shrink-0" />
                  <div className="flex-grow">
                    <span className="text-xs font-bold text-foreground/80 block">{isUrdu ? "موجودہ لوکیشن محفوظ ہو گئی" : "Current Location Saved"}</span>
                    <span className="text-[10px] text-foreground/50">Lat: {kycData.gpsLat}, Lng: {kycData.gpsLng} (Gilgit, Pakistan)</span>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setKycData({...kycData, gpsLat: "35.9208", gpsLng: "74.3089"})}
                    className="text-xs text-primary font-bold hover:underline min-h-[48px] px-2"
                  >
                    {isUrdu ? "لوکیشن دوبارہ حاصل کریں" : "Refresh GPS"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-2">
                  {isUrdu ? "ادائیگی کا ترجیحی طریقہ" : "Preferred Payout Method"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["easypaisa", "jazzcash", "bank"].map((method) => (
                    <button
                      type="button"
                      key={method}
                      onClick={() => setKycData({...kycData, payoutType: method})}
                      className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all min-h-[48px] ${kycData.payoutType === method ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                    >
                      {method === "bank" ? (isUrdu ? "بینک اکاؤنٹ" : "Bank") : method}
                    </button>
                  ))}
                </div>
              </div>

              {kycData.payoutType === "bank" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "بینک کا نام" : "Bank Name"}
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. HBL"
                      value={kycData.bankName}
                      onChange={(e) => setKycData({...kycData, bankName: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "آئی بی اے این نمبر" : "IBAN Number"}
                    </label>
                    <input 
                      type="text"
                      placeholder="PK00 BANK 0000 0000..."
                      value={kycData.bankIban}
                      onChange={(e) => setKycData({...kycData, bankIban: e.target.value})}
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                      required
                    />
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    {kycData.payoutType === "easypaisa" 
                      ? (isUrdu ? "ایزی پیسہ اکاؤنٹ نمبر" : "Easypaisa Account Number")
                      : (isUrdu ? "جیز کیش اکاؤنٹ نمبر" : "JazzCash Account Number")}
                  </label>
                  <input 
                    type="tel"
                    placeholder="03001234567"
                    value={kycData.payoutNumber}
                    onChange={(e) => setKycData({...kycData, payoutNumber: e.target.value.replace(/[^0-9]/g, "")})}
                    className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                    required
                  />
                </div>
              )}

              {formError && <p className="text-red-500 text-xs mt-1 font-semibold">{formError}</p>}

              <button 
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-sans font-bold py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md shadow-primary/10 min-h-[48px]"
              >
                <span>{isUrdu ? "کے وائی سی معلومات جمع کروائیں" : "Submit KYC Data"}</span>
                <Check size={18} />
              </button>
            </form>
          </div>
        )}

        {/* STEP 3: SUCCESS & VERIFICATION STATUS */}
        {step === 3 && (
          <div className="text-center py-6">
            <div className="w-20 h-20 rounded-full bg-green-500/10 border-4 border-green-500 flex items-center justify-center mx-auto text-green-600 mb-6 shadow-lg shadow-green-500/15 animate-bounce">
              <Check size={40} className="stroke-[3]" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/15 text-secondary-dark text-xs font-bold mb-4">
              <Sparkles size={12} className="animate-spin-slow" />
              {isUrdu ? "تصدیق شدہ کسان کا درجہ مل گیا" : "Verified Farmer Status Granted"}
            </span>

            <h1 className="text-3xl font-heading font-black text-primary-dark mb-3">
              {isUrdu ? "مبارک ہو!" : "Congratulations!"}
            </h1>
            <p className="text-sm text-foreground/70 max-w-sm mx-auto mb-8 leading-relaxed">
              {isUrdu 
                ? `آپ کا فارم، ${kycData.farmName}، کامیابی سے تصدیق کر دیا گیا ہے۔ اب آپ براہ راست فصلیں فروخت کر سکتے ہیں۔`
                : `Your farm, ${kycData.farmName}, has been verified. You can now post crops, track sales analytics, and skip the middleman!`}
            </p>

            <div className="space-y-3">
              <Link 
                href="/dashboard"
                className="w-full bg-primary hover:bg-primary-dark text-white font-sans font-bold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2 shadow-md shadow-primary/10 min-h-[48px]"
              >
                <span>{isUrdu ? "کسان ڈیش بورڈ پر جائیں" : "Go to Farmer Dashboard"}</span>
                <ArrowRight size={18} className={isUrdu ? "rotate-180" : ""} />
              </Link>
              <Link 
                href="/"
                className="w-full border-2 border-primary/20 hover:bg-primary/5 text-primary font-sans font-bold py-3 px-6 rounded-full transition-all flex items-center justify-center min-h-[48px]"
              >
                {isUrdu ? "ہوم پیج پر واپس جائیں" : "Return Home"}
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
