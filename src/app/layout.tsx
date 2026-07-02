import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Kissan Bazaar — Sell Fresh, Buy Direct.",
  description: "From Farm in Gilgit to Your Doorstep. Kissan Bazaar connects verified farmers directly with buyers to sell fresh produce without middlemen.",
  keywords: ["farmer marketplace", "buy organic fruits", "direct agricultural trading", "pakistan mandi rates", "gilgit apricots"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased text-foreground bg-offwhite min-h-screen flex flex-col">
        {/* Sticky frosted glass navigation */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow pt-20">
          {children}
        </main>
        
        {/* Organic themed Footer */}
        <footer className="bg-primary-dark text-sage-light py-12 mt-16 border-t border-primary/20">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-2xl font-heading font-bold text-secondary mb-3">Kissan Bazaar</h2>
              <p className="text-sage max-w-sm font-sans text-sm md:text-base leading-relaxed">
                Empowering farmers across Pakistan to sell fresh fruits, vegetables, and crops directly to buyers. Skip the middleman, earn more profits, and get fresher produce.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-offwhite mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm font-sans text-sage/80">
                <li><a href="#" className="hover:text-secondary transition-colors">Marketplace</a></li>
                <li><a href="/onboarding" className="hover:text-secondary transition-colors">Join as Farmer</a></li>
                <li><a href="/dashboard" className="hover:text-secondary transition-colors">Farmer Dashboard</a></li>
                <li><a href="#" className="hover:text-secondary transition-colors">Mandi Rates</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-offwhite mb-4">Contact & Support</h3>
              <ul className="space-y-2 text-sm font-sans text-sage/80">
                <li>Email: info@kissanbazaar.pk</li>
                <li>Helpline: 0800-KISSAN (54772)</li>
                <li>Gilgit Regional Office, Airport Road</li>
                <li>Govt Agri-Portal Partner</li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 mt-8 pt-6 border-t border-white/10 text-center text-xs md:text-sm text-sage/50">
            &copy; {new Date().getFullYear()} Kissan Bazaar. Built for farmers with ❤️ in Gilgit-Baltistan. All Rights Reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
