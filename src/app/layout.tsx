import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <Footer />
      </body>
    </html>
  );
}
