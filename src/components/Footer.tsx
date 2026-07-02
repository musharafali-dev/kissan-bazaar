"use client";

import React from "react";
import Link from "next/link";
import { useLanguageStore } from "@/stores/useLanguageStore";

export default function Footer() {
  const { isUrdu } = useLanguageStore();

  return (
    <footer className={`bg-primary-dark text-sage-light py-12 mt-16 border-t border-primary/20 ${isUrdu ? "rtl-grid text-right" : ""}`} dir={isUrdu ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <h2 className="text-2xl font-heading font-bold text-secondary mb-3">Kissan Bazaar</h2>
          <p className="text-sage max-w-sm font-sans text-sm md:text-base leading-relaxed">
            {isUrdu 
              ? "پورے پاکستان کے کسانوں کو پھل، سبزیاں اور اناج براہ راست خریداروں کو فروخت کرنے کے قابل بنانا۔ مڈل مین کے بغیر زیادہ منافع کمائیں اور خریداروں کو تازہ خوراک فراہم کریں۔"
              : "Empowering farmers across Pakistan to sell fresh fruits, vegetables, and crops directly to buyers. Skip the middleman, earn more profits, and get fresher produce."}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold text-offwhite mb-4">
            {isUrdu ? "اہم لنکس" : "Quick Links"}
          </h3>
          <ul className="space-y-2 text-sm font-sans text-sage/80">
            <li>
              <Link href="/marketplace" className="hover:text-secondary transition-colors">
                {isUrdu ? "مارکیٹ پلیس" : "Marketplace"}
              </Link>
            </li>
            <li>
              <Link href="/onboarding" className="hover:text-secondary transition-colors">
                {isUrdu ? "کسان بنیں" : "Join as Farmer"}
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-secondary transition-colors">
                {isUrdu ? "کسان ڈیش بورڈ" : "Farmer Dashboard"}
              </Link>
            </li>
            <li>
              <Link href="/mandi-rates" className="hover:text-secondary transition-colors">
                {isUrdu ? "منڈی ریٹس" : "Mandi Rates"}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-bold text-offwhite mb-4">
            {isUrdu ? "رابطہ اور مدد" : "Contact & Support"}
          </h3>
          <ul className="space-y-2 text-sm font-sans text-sage/80">
            <li>{isUrdu ? "ای میل: info@kissanbazaar.pk" : "Email: info@kissanbazaar.pk"}</li>
            <li>{isUrdu ? "ہیلپ لائن: 0800-54772" : "Helpline: 0800-KISSAN (54772)"}</li>
            <li>
              {isUrdu ? "گلگت ریجنل آفس، ائیرپورٹ روڈ" : "Gilgit Regional Office, Airport Road"}
            </li>
            <li>
              {isUrdu ? "سرکاری زرعی پورٹل پارٹنر" : "Govt Agri-Portal Partner"}
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-white/10 text-center text-xs md:text-sm text-sage/50">
        {isUrdu 
          ? `© ${new Date().getFullYear()} کسان بازار۔ مشرف علی کی طرف سے کسانوں کے لیے گلگت بلتستان میں محبت کے ساتھ بنایا گیا۔ جملہ حقوق محفوظ ہیں۔`
          : `© ${new Date().getFullYear()} Kissan Bazaar. Developed by Musharaf Ali. All Rights Reserved.`}
      </div>
    </footer>
  );
}
