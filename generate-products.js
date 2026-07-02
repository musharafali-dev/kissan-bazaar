const fs = require("fs");
const path = require("path");

const categories = ["fruits", "vegetables", "dairy", "grains", "nuts"];

const cropTemplates = {
  fruits: [
    { en: "Apricots", ur: "خوبانی", priceMin: 120, priceMax: 220, unitEn: "kg", unitUr: "کلو" },
    { en: "Apples", ur: "سیب", priceMin: 100, priceMax: 200, unitEn: "kg", unitUr: "کلو" },
    { en: "Cherries", ur: "چیری", priceMin: 250, priceMax: 450, unitEn: "kg", unitUr: "کلو" },
    { en: "Mangoes", ur: "آم", priceMin: 150, priceMax: 300, unitEn: "kg", unitUr: "کلو" },
    { en: "Peaches", ur: "آڑو", priceMin: 130, priceMax: 240, unitEn: "kg", unitUr: "کلو" },
    { en: "Plums", ur: "آلوچہ", priceMin: 110, priceMax: 180, unitEn: "kg", unitUr: "کلو" },
    { en: "Pears", ur: "ناشپاتی", priceMin: 120, priceMax: 210, unitEn: "kg", unitUr: "کلو" },
    { en: "Grapes", ur: "انگور", priceMin: 180, priceMax: 350, unitEn: "kg", unitUr: "کلو" },
    { en: "Pomegranates", ur: "انار", priceMin: 200, priceMax: 400, unitEn: "kg", unitUr: "کلو" },
    { en: "Oranges", ur: "مالٹا", priceMin: 80, priceMax: 160, unitEn: "dozen", unitUr: "درجن" }
  ],
  vegetables: [
    { en: "Tomatoes", ur: "ٹماٹر", priceMin: 60, priceMax: 150, unitEn: "kg", unitUr: "کلو" },
    { en: "Potatoes", ur: "آلو", priceMin: 40, priceMax: 90, unitEn: "kg", unitUr: "کلو" },
    { en: "Onions", ur: "پیاز", priceMin: 50, priceMax: 110, unitEn: "kg", unitUr: "کلو" },
    { en: "Garlic", ur: "لہسن", priceMin: 220, priceMax: 380, unitEn: "kg", unitUr: "کلو" },
    { en: "Ginger", ur: "ادرک", priceMin: 300, priceMax: 500, unitEn: "kg", unitUr: "کلو" },
    { en: "Spinach", ur: "پالک", priceMin: 30, priceMax: 60, unitEn: "bundle", unitUr: "گٹھی" },
    { en: "Cauliflower", ur: "پھول گوبھی", priceMin: 60, priceMax: 120, unitEn: "kg", unitUr: "کلو" },
    { en: "Cabbage", ur: "بند گوبھی", priceMin: 50, priceMax: 100, unitEn: "kg", unitUr: "کلو" },
    { en: "Peas", ur: "مٹر", priceMin: 100, priceMax: 200, unitEn: "kg", unitUr: "کلو" },
    { en: "Carrots", ur: "گاجر", priceMin: 40, priceMax: 90, unitEn: "kg", unitUr: "کلو" }
  ],
  dairy: [
    { en: "Desi Ghee", ur: "دیسی گھی", priceMin: 1600, priceMax: 2200, unitEn: "kg", unitUr: "کلو" },
    { en: "Fresh Butter", ur: "مکھن", priceMin: 1000, priceMax: 1400, unitEn: "kg", unitUr: "کلو" },
    { en: "Organic Honey", ur: "خالص شہد", priceMin: 1500, priceMax: 3000, unitEn: "kg", unitUr: "کلو" },
    { en: "Fresh Milk", ur: "تازہ دودھ", priceMin: 180, priceMax: 240, unitEn: "litre", unitUr: "لیٹر" },
    { en: "Paneer / Cheese", ur: "پنیر", priceMin: 800, priceMax: 1400, unitEn: "kg", unitUr: "کلو" }
  ],
  grains: [
    { en: "Basmati Rice", ur: "باسمتی چاول", priceMin: 220, priceMax: 380, unitEn: "kg", unitUr: "کلو" },
    { en: "Organic Wheat", ur: "گندم", priceMin: 100, priceMax: 150, unitEn: "kg", unitUr: "کلو" },
    { en: "White Chickpeas", ur: "سفید چنے", priceMin: 240, priceMax: 340, unitEn: "kg", unitUr: "کلو" },
    { en: "Red Lentils", ur: "مسور کی دال", priceMin: 200, priceMax: 280, unitEn: "kg", unitUr: "کلو" },
    { en: "Maize Grain", ur: "مکئی", priceMin: 80, priceMax: 130, unitEn: "kg", unitUr: "کلو" }
  ],
  nuts: [
    { en: "Organic Almonds", ur: "بادام", priceMin: 800, priceMax: 1500, unitEn: "kg", unitUr: "کلو" },
    { en: "Soft-shell Walnuts", ur: "اخروٹ", priceMin: 600, priceMax: 1100, unitEn: "kg", unitUr: "کلو" },
    { en: "Pine Nuts (Chilgoza)", ur: "چلغوزہ", priceMin: 5000, priceMax: 8000, unitEn: "kg", unitUr: "کلو" },
    { en: "Dried Figs", ur: "انجیر", priceMin: 1200, priceMax: 2200, unitEn: "kg", unitUr: "کلو" },
    { en: "Dried Apricots", ur: "خشک خوبانی", priceMin: 500, priceMax: 900, unitEn: "kg", unitUr: "کلو" }
  ]
};

const farmers = [
  { en: "Sajid Ali", ur: "ساجد علی" },
  { en: "Ghulam Rasool", ur: "غلام رسول" },
  { en: "Muhammad Irfan", ur: "محمد عرفان" },
  { en: "Bashir Khan", ur: "بشیر خان" },
  { en: "Amjad Ali", ur: "امجد علی" },
  { en: "Nawaz Sharif", ur: "نواز شریف" },
  { en: "Abid Hussain", ur: "عابد حسین" },
  { en: "Sardar Mohammad", ur: "سردار محمد" },
  { en: "Zulfiqar Ali", ur: "ذوالفقار علی" },
  { en: "Tariq Mahmood", ur: "طارق محمود" },
  { en: "Liaqat Ali", ur: "لیاقت علی" },
  { en: "Farhan Malik", ur: "فرحان ملک" }
];

const locations = [
  { en: "Hunza Valley, GB", ur: "ہنزہ، گلگت بلتستان" },
  { en: "Gilgit City, GB", ur: "گلگت سٹی، گلگت بلتستان" },
  { en: "Skardu, Baltistan", ur: "سکردو، بلتستان" },
  { en: "Swat Valley, KP", ur: "سوات، خیبر پختونخوا" },
  { en: "Okara, Punjab", ur: "اوکاڑہ، پنجاب" },
  { en: "Sargodha, Punjab", ur: "سرگودھا، پنجاب" },
  { en: "Multan, Punjab", ur: "ملتان، پنجاب" },
  { en: "Mirpur Khas, Sindh", ur: "میرپور خاص، سندھ" },
  { en: "Matiari, Sindh", ur: "مٹیاری، سندھ" },
  { en: "Quetta, Balochistan", ur: "کوئٹہ، بلوچستان" },
  { en: "Ziarat, Balochistan", ur: "زیارت، بلوچستان" }
];

const svgGradients = [
  { start: "%23FFF8E7", stop: "%23E9B44C" },
  { start: "%23FFEEEE", stop: "%23E63946" },
  { start: "%23F5EDD0", stop: "%23A47551" },
  { start: "%23FFFDE6", stop: "%23FFC300" },
  { start: "%23FFFDF0", stop: "%23E9B44C" },
  { start: "%23FFF0F5", stop: "%23C70039" }
];

const products = [];

// Generate exactly 150 products
for (let i = 1; i <= 150; i++) {
  const category = categories[i % categories.length];
  const templates = cropTemplates[category];
  const template = templates[i % templates.length];
  
  const farmer = farmers[i % farmers.length];
  const loc = locations[i % locations.length];
  
  const price = Math.round(template.priceMin + (Math.random() * (template.priceMax - template.priceMin)));
  const rating = parseFloat((4.5 + Math.random() * 0.5).toFixed(1));
  const reviewsCount = Math.floor(10 + Math.random() * 90);
  const isOrganic = Math.random() > 0.3;
  const grade = ["A", "B", "Premium"][i % 3];
  const stock = Math.floor(100 + Math.random() * 2000);
  const harvestedDays = i % 4;
  const harvestedEn = harvestedDays === 0 ? "Today" : harvestedDays === 1 ? "Yesterday" : `${harvestedDays} days ago`;
  const harvestedUr = harvestedDays === 0 ? "آج" : harvestedDays === 1 ? "کل" : `${harvestedDays} دن پہلے`;

  // Draw colorful SVG backgrounds dynamically
  const gradient = svgGradients[i % svgGradients.length];
  const svgImage = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'><rect width='400' height='300' fill='${gradient.start}'/><circle cx='200' cy='160' r='75' fill='${gradient.stop}'/><circle cx='180' cy='140' r='35' fill='%23fff' opacity='0.25'/><path d='M200 85 Q220 50 250 50 Q230 75 200 85' fill='%232D6A4F'/></svg>`;

  products.push({
    id: i,
    nameEn: `Fresh ${loc.en.split(",")[0]} ${template.en}`,
    nameUr: `${template.ur} (${loc.ur.split("،")[0]})`,
    farmerEn: farmer.en,
    farmerUr: farmer.ur,
    locationEn: loc.en,
    locationUr: loc.ur,
    price: price,
    unitEn: template.unitEn,
    unitUr: template.unitUr,
    rating: rating,
    reviewsCount: reviewsCount,
    isOrganic: isOrganic,
    grade: grade,
    image: svgImage,
    harvestedEn: harvestedEn,
    harvestedUr: harvestedUr,
    stock: stock,
    category: category
  });
}

const fileContent = `"use client";

export interface Crop {
  id: number;
  nameEn: string;
  nameUr: string;
  farmerEn: string;
  farmerUr: string;
  locationEn: string;
  locationUr: string;
  price: number;
  unitEn: string;
  unitUr: string;
  rating: number;
  reviewsCount: number;
  isOrganic: boolean;
  grade: string;
  image: string;
  harvestedEn: string;
  harvestedUr: string;
  stock: number;
  category: string;
}

export const staticCrops: Crop[] = ${JSON.stringify(products, null, 2)};
`;

const dir = path.join(__dirname, "src", "data");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}
fs.writeFileSync(path.join(dir, "products.ts"), fileContent, "utf8");
console.log("Generated 150 products in src/data/products.ts");
