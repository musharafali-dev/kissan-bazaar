# Kissan Bazaar (کسان بازار) 🌾

> **Connecting verified farmers directly with buyers.** No middlemen. More profit for farmers, fresher produce for buyers.

Kissan Bazaar is a modern, mobile-first B2C + B2B web marketplace designed to empower local farmers (with a focus on Gilgit-Baltistan and agricultural regions in Pakistan) to sell their fresh crops directly to consumers, shopkeepers, and bulk commercial buyers. 

---

## 🌟 Key Features

### 1. Unified Real-time Localization (Urdu & English)
- **Instant Language Swapping**: A global bilingual toggle powered by **Zustand** switches the entire marketplace layout from English (`ltr`) to Urdu (`rtl`) instantly.
- **Translatable Components**: Everything from navigation links, farm KYC wizards, inventory items, interactive maps, B2B price quote sheets, and the main footer dynamically translate without page refreshes.

### 2. Multi-Role Portals
- **Farmer Dashboard**: 
  - **3-Tap Listing Wizard**: List crops quickly by inputting crop type, weight, price, grade, and harvest date.
  - **Bulk CSV Upload**: Drag and drop crop inventories exported from Excel.
  - **Regional Price Comparisons**: Real-time comparison with regional Mandi rates.
- **Buyer Marketplace**:
  - **Dynamic Crop Catalog**: Search, filter by grade (A/B/Premium), and sort by distance.
  - **Negotiation Chat Sandbox**: In-app live chat widget to discuss pricing directly with farmers.
  - **B2B Bulk Quote Requests**: Instantly request special bulk pricing sheets.
  - **Live Order Tracking**: Sandbox order tracker with dynamic status updates (Pending → Packed → Shipped → Delivered).
- **KYC Onboarding Verification**: A 3-step compliance flow checking government credentials (CNIC verification) and capturing GPS latitude/longitude coordinates to verify farm locations.

---

## 🎨 Modern Morph + Organic Design System

Kissan Bazaar utilizes a custom, organic glassmorphic design system carefully crafted for fast loading over 3G networks:
- **Primary Color**: `#2D6A4F` Deep Leaf Green (representing trust & growth)
- **Secondary Color**: `#E9B44C` Harvest Gold (representing CTA highlights & abundance)
- **Accent Color**: `#A47551` Soil Brown (representing authenticity)
- **Backgrounds**: `#F8F9FA` Off-White & `#DDE5D4` Soft Sage
- **Typography**: Poppins Bold for headings, Inter Regular for body text.
- **Glassmorphism**: Soft `24px` card corners, frosted glass headers, and `backdrop-blur` overlays.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Tailwind CSS, TypeScript)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Global reactive language store)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Tailwind CSS with custom thematic glass/color tokens

---

## 📁 Repository Structure

```text
kissan/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Main layout wrapper
│   │   ├── page.tsx           # Home landing page with weather station & search
│   │   ├── auth/              # Sign In / Sign Up mock pages
│   │   ├── onboarding/        # Farmer KYC Onboarding flow
│   │   ├── dashboard/         # Farmer Sales Analytics & Stock control panel
│   │   ├── marketplace/       # Direct Buyer marketplace with chat and map lookup
│   │   └── mandi-rates/       # Local city mandi rates & government subsidies
│   ├── components/
│   │   ├── Navbar.tsx         # Sticky navigation with global language switcher
│   │   └── Footer.tsx         # Client-side translatable footer component
│   └── stores/
│       └── useLanguageStore.ts# Global Zustand store for i18n
├── public/                    # Static assets & farm photography
├── package.json
└── tailwind.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/musharafali-dev/kissan-bazaar.git
   cd kissan-bazaar
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request if you want to enhance features or styling.

Developed with ❤️ for farmers.
