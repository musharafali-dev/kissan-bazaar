"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sprout, Languages, Menu, X, User, ShoppingBag, LayoutDashboard } from "lucide-react";
import { useLanguageStore } from "@/stores/useLanguageStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const { isUrdu, toggleLanguage } = useLanguageStore();

  useEffect(() => {
    // Check connection status for PWA support
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      const handleOnline = () => setIsOffline(false);
      const handleOffline = () => setIsOffline(true);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  return (
    <>
      {/* Offline banner for PWA support */}
      {isOffline && (
        <div className="offline-banner bg-accent text-white py-1 px-4 text-center text-xs md:text-sm font-sans fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 shadow-md">
          <div className="w-2 h-2 rounded-full bg-red-400 animate-ping"></div>
          <span>{isUrdu ? "آپ آف لائن ہیں۔ محفوظ شدہ پروڈکٹس دکھائے جا رہے ہیں۔" : "You are currently offline. Browsing offline cache products."}</span>
        </div>
      )}

      <header className={`fixed ${isOffline ? 'top-6' : 'top-0'} left-0 right-0 z-40 transition-all duration-300 px-4 py-3`}>
        <div className="max-w-7xl mx-auto glass-panel px-6 py-3 flex items-center justify-between transition-all duration-300">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 text-primary font-heading font-bold text-xl md:text-2xl hover:scale-105 transition-transform">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 text-white">
              <Sprout size={20} className="stroke-[2.5]" />
            </div>
            <span className="tracking-tight text-primary-dark">
              Kissan<span className="text-secondary font-bold">Bazaar</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 font-sans font-medium text-sm md:text-base text-foreground/80">
            <Link href="/" className="hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-primary">
              {isUrdu ? "ہوم" : "Home"}
            </Link>
            <Link href="/marketplace" className="hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-primary">
              {isUrdu ? "مارکیٹ پلیس" : "Marketplace"}
            </Link>
            <Link href="/dashboard" className="hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-primary flex items-center gap-1.5">
              <LayoutDashboard size={16} />
              {isUrdu ? "ڈیش بورڈ" : "Dashboard"}
            </Link>
            <Link href="/mandi-rates" className="hover:text-primary transition-colors py-1 border-b-2 border-transparent hover:border-primary">
              {isUrdu ? "منڈی ریٹس" : "Mandi Rates"}
            </Link>
          </nav>

          {/* Desktop CTA / Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Switcher */}
            <button 
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-sage/40 text-sm font-semibold transition-all text-primary border border-primary/20"
              aria-label="Toggle language"
            >
              <Languages size={16} />
              <span>{isUrdu ? "English" : "اردو"}</span>
            </button>

            {/* Seller Quick Link */}
            <Link 
              href="/onboarding"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white font-sans text-sm font-semibold py-2 px-5 rounded-full transition-all duration-300 shadow-sm"
            >
              {isUrdu ? "کسان لاگ ان" : "Join as Farmer"}
            </Link>

            {/* Buyer Profile / Cart */}
            <button className="p-2 hover:bg-sage/40 rounded-full transition-colors relative" aria-label="Cart">
              <ShoppingBag size={20} className="text-primary" />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-offwhite"></span>
            </button>
          </div>

          {/* Mobile menu toggle & controls */}
          <div className="flex md:hidden items-center gap-3">
            <button 
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-sage/40 text-primary border border-primary/10 transition-colors"
              aria-label="Toggle Language"
            >
              <Languages size={18} />
            </button>

            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="p-2 hover:bg-sage/40 rounded-full transition-colors text-primary"
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isOpen && (
          <div className="md:hidden mt-2 mx-4 py-4 px-6 glass-panel flex flex-col gap-4 animate-slideDown shadow-xl border border-white/50">
            <nav className="flex flex-col gap-3 font-sans text-base font-medium">
              <Link 
                href="/" 
                onClick={() => setIsOpen(false)}
                className="hover:text-primary transition-colors py-2 border-b border-sage/30"
              >
                {isUrdu ? "ہوم" : "Home"}
              </Link>
              <Link 
                href="/marketplace" 
                onClick={() => setIsOpen(false)}
                className="hover:text-primary transition-colors py-2 border-b border-sage/30"
              >
                {isUrdu ? "مارکیٹ پلیس" : "Marketplace"}
              </Link>
              <Link 
                href="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="hover:text-primary transition-colors py-2 border-b border-sage/30 flex items-center gap-2"
              >
                <LayoutDashboard size={18} />
                {isUrdu ? "ڈیش بورڈ" : "Dashboard"}
              </Link>
              <Link 
                href="/mandi-rates" 
                onClick={() => setIsOpen(false)}
                className="hover:text-primary transition-colors py-2 border-b border-sage/30"
              >
                {isUrdu ? "منڈی ریٹس" : "Mandi Rates"}
              </Link>
            </nav>
            
            <div className="flex flex-col gap-3 pt-2">
              <Link 
                href="/onboarding"
                onClick={() => setIsOpen(false)}
                className="w-full text-center border-2 border-primary text-primary hover:bg-primary hover:text-white font-sans text-base font-semibold py-2.5 rounded-full transition-all shadow-sm"
              >
                {isUrdu ? "کسان لاگ ان / رجسٹریشن" : "Join as Farmer"}
              </Link>
              <div className="flex justify-between items-center px-2 text-sm text-foreground/60">
                <span>{isUrdu ? "سپورٹ ہیلپ لائن" : "Support Helpline"}:</span>
                <span className="font-bold text-primary">0800-54772</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
