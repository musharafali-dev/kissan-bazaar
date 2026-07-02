"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Phone, 
  ShieldCheck, 
  Smartphone, 
  ArrowLeft,
  ArrowRight,
  User,
  Sprout,
  Check
} from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

export default function AuthPage() {
  const { isUrdu } = useLanguageStore();
  const router = useRouter();
  
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1); // 1 = Phone Input, 2 = OTP Input
  const [role, setRole] = useState<"farmer" | "buyer">("buyer");
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError(isUrdu ? "براہ کرم درست فون نمبر درج کریں۔" : "Please enter a valid phone number.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === "1234" || otp.length === 4) {
      setSuccess(true);
      setError("");
      setTimeout(() => {
        if (role === "farmer") {
          // If register, send to onboarding first, otherwise dashboard
          router.push(isLogin ? "/dashboard" : "/onboarding");
        } else {
          router.push("/marketplace");
        }
      }, 1500);
    } else {
      setError(isUrdu ? "غلط او ٹی پی کوڈ۔ ٹیسٹ کے لیے '1234' درج کریں۔" : "Incorrect OTP. Try '1234' for testing.");
    }
  };

  return (
    <div className={`min-h-[calc(100vh-80px)] py-10 px-4 flex items-center justify-center bg-gradient-to-br from-offwhite to-sage/40 ${isUrdu ? "rtl-grid text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      <div className="w-full max-w-md glass-panel p-6 md:p-10 shadow-glass border-white/60">
        
        {/* LOGO */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-white mx-auto mb-2">
            <Sprout size={24} className="stroke-[2.5]" />
          </div>
          <h2 className="text-2xl font-heading font-black text-primary-dark">
            Kissan<span className="text-secondary">Bazaar</span>
          </h2>
        </div>

        {/* TAB SWITCHER (LOGIN / SIGNUP) */}
        {step === 1 && (
          <div className="bg-sage/40 p-1 rounded-full flex gap-1 shadow-inner border border-primary/5 mb-6">
            <button 
              onClick={() => {
                setIsLogin(true);
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all min-h-[44px] ${isLogin ? 'bg-primary text-white shadow-sm' : 'text-primary-dark hover:bg-sage/10'}`}
            >
              {isUrdu ? "لاگ ان" : "Sign In"}
            </button>
            <button 
              onClick={() => {
                setIsLogin(false);
                setError("");
              }}
              className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all min-h-[44px] ${!isLogin ? 'bg-primary text-white shadow-sm' : 'text-primary-dark hover:bg-sage/10'}`}
            >
              {isUrdu ? "رجسٹریشن" : "Sign Up"}
            </button>
          </div>
        )}

        {/* SUCCESS CARD */}
        {success ? (
          <div className="text-center py-6 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-green-500/10 border-4 border-green-500 flex items-center justify-center mx-auto text-green-600 mb-4 shadow">
              <Check size={32} className="stroke-[3]" />
            </div>
            <h3 className="text-xl font-heading font-black text-primary-dark">
              {isUrdu ? "لاگ ان کامیاب!" : "Success!"}
            </h3>
            <p className="text-xs text-foreground/60 mt-1">
              {isUrdu ? "آپ کو مطلوبہ پیج پر بھیجا جا رہا ہے..." : "Redirecting you to the portal..."}
            </p>
          </div>
        ) : (
          <div>
            {/* STEP 1: PHONE & REGISTER INFO */}
            {step === 1 && (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <h3 className="text-lg font-heading font-black text-primary-dark mb-1">
                    {isLogin 
                      ? (isUrdu ? "اپنے اکاؤنٹ میں لاگ ان کریں" : "Access your account") 
                      : (isUrdu ? "نیا اکاؤنٹ بنائیں" : "Create your account")}
                  </h3>
                  <p className="text-xs text-foreground/60 leading-relaxed mb-4">
                    {isUrdu 
                      ? "ہم آپ کے نمبر پر تصدیق کے لیے 4 ہندسوں کا کوڈ بھیجیں گے۔" 
                      : "We'll send a 4-digit verification code to confirm your phone number."}
                  </p>
                </div>

                {/* Full Name (Sign Up only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                      {isUrdu ? "پورا نام" : "Full Name"}
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Muhammad Asif"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary text-sm font-sans min-h-[48px]"
                      required
                    />
                  </div>
                )}

                {/* Role Selector (Sign Up only) */}
                {!isLogin && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-2">
                      {isUrdu ? "آپ کا رول / کردار" : "Select Your Role"}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("buyer")}
                        className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all min-h-[48px] ${role === "buyer" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                      >
                        {isUrdu ? "خریدار / آڑھتی" : "Buyer / Shopkeeper"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("farmer")}
                        className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all min-h-[48px] ${role === "farmer" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                      >
                        {isUrdu ? "کسان / کاشتکار" : "Farmer / Producer"}
                      </button>
                    </div>
                  </div>
                )}

                {/* Phone Input */}
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-1.5">
                    {isUrdu ? "موبائل فون نمبر" : "Mobile Phone Number"}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50 text-base font-semibold font-sans">
                      +92
                    </span>
                    <input 
                      type="tel"
                      placeholder="3001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ""))}
                      className="w-full pl-16 pr-4 py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white text-base font-sans min-h-[48px]"
                      required
                    />
                  </div>
                </div>

                {/* Login Role Selector (since login is simpler with just phone check) */}
                {isLogin && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75 mb-2">
                      {isUrdu ? "اس کے طور پر لاگ ان کریں:" : "Log In As:"}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole("buyer")}
                        className={`py-2.5 rounded-xl border text-xs font-bold capitalize transition-all min-h-[44px] ${role === "buyer" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                      >
                        {isUrdu ? "خریدار" : "Buyer"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole("farmer")}
                        className={`py-2.5 rounded-xl border text-xs font-bold capitalize transition-all min-h-[44px] ${role === "farmer" ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white hover:bg-sage/10 border-primary/10 text-primary-dark'}`}
                      >
                        {isUrdu ? "کسان" : "Farmer"}
                      </button>
                    </div>
                  </div>
                )}

                {error && <p className="text-red-500 text-xs mt-1 font-semibold">{error}</p>}

                <button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-sans font-bold py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md shadow-primary/10 min-h-[48px]"
                >
                  <span>{isUrdu ? "او ٹی پی حاصل کریں" : "Send OTP Code"}</span>
                  <ArrowRight size={18} className={isUrdu ? "rotate-180" : ""} />
                </button>
              </form>
            )}

            {/* STEP 2: ENTER OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="otp" className="block text-[10px] font-bold uppercase tracking-wider text-foreground/75">
                      {isUrdu ? "4 ہندسوں کا تصدیقی کوڈ درج کریں" : "Enter Verification Code"}
                    </label>
                    <button 
                      type="button" 
                      onClick={() => setStep(1)}
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
                    className="w-full text-center tracking-[1rem] font-black text-2xl py-3 rounded-xl border border-primary/10 bg-white/70 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white font-sans min-h-[48px]"
                    required
                  />
                  {error && <p className="text-red-500 text-xs mt-1 font-semibold">{error}</p>}
                  <p className="text-[10px] text-foreground/50 mt-2">
                    Tip: Enter any 4-digit code (e.g. 1234) to bypass verification in this demonstration.
                  </p>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary-dark text-foreground font-sans font-bold py-3.5 px-6 rounded-full transition-colors flex items-center justify-center gap-2 mt-6 shadow-md shadow-secondary/10 min-h-[48px]"
                >
                  <span>{isUrdu ? "لاگ ان کی تصدیق کریں" : "Verify & Sign In"}</span>
                  <ShieldCheck size={18} />
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
