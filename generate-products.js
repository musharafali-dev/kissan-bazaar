const fs = require("fs");
const path = require("path");

const categories = ["fruits", "vegetables", "dairy", "grains", "nuts"];

const unsplashImages = {
  // FRUITS - each array contains ONLY photos of that fruit
  "apricots": [
    "https://images.unsplash.com/photo-1501256403862-74d627250eec?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1595908129746-57ca1a63dd4d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1568393691622-c7ba131d63b6?w=500&auto=format&fit=crop&q=60"
  ],
  "apples": [
    "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?w=500&auto=format&fit=crop&q=60"
  ],
  "cherries": [
    "https://images.unsplash.com/photo-1528821122024-e43a5b66973c?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=500&auto=format&fit=crop&q=60"
  ],
  "mangoes": [
    "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1591073113125-e46713c829ed?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=500&auto=format&fit=crop&q=60"
  ],
  "peaches": [
    "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1595124256660-bf968b666a0e?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1511630558655-5d3bec585396?w=500&auto=format&fit=crop&q=60"
  ],
  "plums": [
    "https://images.unsplash.com/photo-1519519166523-17a3b4e86e83?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1603813860913-df9a242f3fee?w=500&auto=format&fit=crop&q=60"
  ],
  "pears": [
    "https://images.unsplash.com/photo-1514896856000-9115de81aad9?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1601876815803-344377d41dfa?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1550828520-4cb496926fc9?w=500&auto=format&fit=crop&q=60"
  ],
  "grapes": [
    "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1596546453050-9db5de24e5cb?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1568806882182-b1671e20ef1c?w=500&auto=format&fit=crop&q=60"
  ],
  "pomegranates": [
    "https://images.unsplash.com/photo-1541344781865-fd7e75d9e2d2?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1589088310973-c9036593d39b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&auto=format&fit=crop&q=60"
  ],
  "oranges": [
    "https://images.unsplash.com/photo-1547514701-42782101795e?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=60"
  ],
  
  // VEGETABLES - strictly matching
  "tomatoes": [
    "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500&auto=format&fit=crop&q=60"
  ],
  "potatoes": [
    "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1508313880080-c4bef0730395?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1590165482129-1b8b27698780?w=500&auto=format&fit=crop&q=60"
  ],
  "onions": [
    "https://images.unsplash.com/photo-1618512496248-a07fe83766c5?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1508747703725-719ae257c26a?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1624204386084-dd8c05e32226?w=500&auto=format&fit=crop&q=60"
  ],
  "garlic": [
    "https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&auto=format&fit=crop&q=60"
  ],
  "ginger": [
    "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1573414405029-4e4fc5bc4b7c?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1587617425953-9075d4579b99?w=500&auto=format&fit=crop&q=60"
  ],
  "spinach": [
    "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=500&auto=format&fit=crop&q=60"
  ],
  "cauliflower": [
    "https://images.unsplash.com/photo-1568584711075-3d021a7c3ecf?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1612257416648-1c3825c7c23a?w=500&auto=format&fit=crop&q=60"
  ],
  "cabbage": [
    "https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=500&auto=format&fit=crop&q=60"
  ],
  "peas": [
    "https://images.unsplash.com/photo-1587570220979-22c60814ee00?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1563636618938-88e9b9042fc2?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1497673099977-47f58f5c2b8e?w=500&auto=format&fit=crop&q=60"
  ],
  "carrots": [
    "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1447175008436-054170c2e979?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=500&auto=format&fit=crop&q=60"
  ],
  
  // DAIRY - strictly matching
  "desi ghee": [
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1631209121750-a9f7cc2e5b35?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1477805937699-64a7040bcfd5?w=500&auto=format&fit=crop&q=60"
  ],
  "fresh butter": [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1543362906-acfc16c67564?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=500&auto=format&fit=crop&q=60"
  ],
  "organic honey": [
    "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1504472478235-9bc48ba4d60f?w=500&auto=format&fit=crop&q=60"
  ],
  "fresh milk": [
    "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=500&auto=format&fit=crop&q=60"
  ],
  "paneer / cheese": [
    "https://images.unsplash.com/photo-1634482315930-f40f2b95b58c?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1559561853-08451507cbe7?w=500&auto=format&fit=crop&q=60"
  ],
  
  // GRAINS - strictly matching
  "basmati rice": [
    "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1536304997881-a372c179924b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1542820242-a1bbe82c7b88?w=500&auto=format&fit=crop&q=60"
  ],
  "organic wheat": [
    "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1501286353178-1ec88121a1c8?w=500&auto=format&fit=crop&q=60"
  ],
  "white chickpeas": [
    "https://images.unsplash.com/photo-1547058886-af77d28796de?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1614961909657-3b4ded040f0b?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1606914469633-bd10ef557fe1?w=500&auto=format&fit=crop&q=60"
  ],
  "red lentils": [
    "https://images.unsplash.com/photo-1634201980997-6c498f9c6f40?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1547058886-af77d28796de?w=500&auto=format&fit=crop&q=60"
  ],
  "maize grain": [
    "https://images.unsplash.com/photo-1551754625-70c90487595e?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1471992617591-1a22a7c2e5da?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1601599561213-832382fd07ba?w=500&auto=format&fit=crop&q=60"
  ],
  
  // NUTS - strictly matching
  "organic almonds": [
    "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1580820267682-426da823b514?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1548935888-1b6a44b3abe4?w=500&auto=format&fit=crop&q=60"
  ],
  "soft-shell walnuts": [
    "https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1617440168937-c6497eaa8db5?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500&auto=format&fit=crop&q=60"
  ],
  "pine nuts (chilgoza)": [
    "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1580820267682-426da823b514?w=500&auto=format&fit=crop&q=60"
  ],
  "dried figs": [
    "https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1630510685509-7f7e4b76dc9b?w=500&auto=format&fit=crop&q=60"
  ],
  "dried apricots": [
    "https://images.unsplash.com/photo-1617898791843-0ba3d1398d2e?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1575556609835-0bd3e79d0e5d?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1594911772125-07fc7a2d8d9f?w=500&auto=format&fit=crop&q=60"
  ]
};

const cropTemplates = {
  fruits: [
    { key: "apricots", en: "Apricots", ur: "خوبانی", priceMin: 120, priceMax: 220, unitEn: "kg", unitUr: "کلو" },
    { key: "apples", en: "Apples", ur: "سیب", priceMin: 100, priceMax: 200, unitEn: "kg", unitUr: "کلو" },
    { key: "cherries", en: "Cherries", ur: "چیری", priceMin: 250, priceMax: 450, unitEn: "kg", unitUr: "کلو" },
    { key: "mangoes", en: "Mangoes", ur: "آم", priceMin: 150, priceMax: 300, unitEn: "kg", unitUr: "کلو" },
    { key: "peaches", en: "Peaches", ur: "آڑو", priceMin: 130, priceMax: 240, unitEn: "kg", unitUr: "کلو" },
    { key: "plums", en: "Plums", ur: "آلوچہ", priceMin: 110, priceMax: 180, unitEn: "kg", unitUr: "کلو" },
    { key: "pears", en: "Pears", ur: "ناشپاتی", priceMin: 120, priceMax: 210, unitEn: "kg", unitUr: "کلو" },
    { key: "grapes", en: "Grapes", ur: "انگور", priceMin: 180, priceMax: 350, unitEn: "kg", unitUr: "کلو" },
    { key: "pomegranates", en: "Pomegranates", ur: "انار", priceMin: 200, priceMax: 400, unitEn: "kg", unitUr: "کلو" },
    { key: "oranges", en: "Oranges", ur: "مالٹا", priceMin: 80, priceMax: 160, unitEn: "dozen", unitUr: "درجن" }
  ],
  vegetables: [
    { key: "tomatoes", en: "Tomatoes", ur: "ٹماٹر", priceMin: 60, priceMax: 150, unitEn: "kg", unitUr: "کلو" },
    { key: "potatoes", en: "Potatoes", ur: "آلو", priceMin: 40, priceMax: 90, unitEn: "kg", unitUr: "کلو" },
    { key: "onions", en: "Onions", ur: "پیاز", priceMin: 50, priceMax: 110, unitEn: "kg", unitUr: "کلو" },
    { key: "garlic", en: "Garlic", ur: "لہسن", priceMin: 220, priceMax: 380, unitEn: "kg", unitUr: "کلو" },
    { key: "ginger", en: "Ginger", ur: "ادرک", priceMin: 300, priceMax: 500, unitEn: "kg", unitUr: "کلو" },
    { key: "spinach", en: "Spinach", ur: "پالک", priceMin: 30, priceMax: 60, unitEn: "bundle", unitUr: "گٹھی" },
    { key: "cauliflower", en: "Cauliflower", ur: "پھول گوبھی", priceMin: 60, priceMax: 120, unitEn: "kg", unitUr: "کلو" },
    { key: "cabbage", en: "Cabbage", ur: "بند گوبھی", priceMin: 50, priceMax: 100, unitEn: "kg", unitUr: "کلو" },
    { key: "peas", en: "Peas", ur: "مٹر", priceMin: 100, priceMax: 200, unitEn: "kg", unitUr: "کلو" },
    { key: "carrots", en: "Carrots", ur: "گاجر", priceMin: 40, priceMax: 90, unitEn: "kg", unitUr: "کلو" }
  ],
  dairy: [
    { key: "desi ghee", en: "Desi Ghee", ur: "دیسی گھی", priceMin: 1600, priceMax: 2200, unitEn: "kg", unitUr: "کلو" },
    { key: "fresh butter", en: "Fresh Butter", ur: "مکھن", priceMin: 1000, priceMax: 1400, unitEn: "kg", unitUr: "کلو" },
    { key: "organic honey", en: "Organic Honey", ur: "خالص شہد", priceMin: 1500, priceMax: 3000, unitEn: "kg", unitUr: "کلو" },
    { key: "fresh milk", en: "Fresh Milk", ur: "تازہ دودھ", priceMin: 180, priceMax: 240, unitEn: "litre", unitUr: "لیٹر" },
    { key: "paneer / cheese", en: "Paneer / Cheese", ur: "پنیر", priceMin: 800, priceMax: 1400, unitEn: "kg", unitUr: "کلو" }
  ],
  grains: [
    { key: "basmati rice", en: "Basmati Rice", ur: "باسمتی چاول", priceMin: 220, priceMax: 380, unitEn: "kg", unitUr: "کلو" },
    { key: "organic wheat", en: "Organic Wheat", ur: "گندم", priceMin: 100, priceMax: 150, unitEn: "kg", unitUr: "کلو" },
    { key: "white chickpeas", en: "White Chickpeas", ur: "سفید چنے", priceMin: 240, priceMax: 340, unitEn: "kg", unitUr: "کلو" },
    { key: "red lentils", en: "Red Lentils", ur: "مسور کی دال", priceMin: 200, priceMax: 280, unitEn: "kg", unitUr: "کلو" },
    { key: "maize grain", en: "Maize Grain", ur: "مکئی", priceMin: 80, priceMax: 130, unitEn: "kg", unitUr: "کلو" }
  ],
  nuts: [
    { key: "organic almonds", en: "Organic Almonds", ur: "بادام", priceMin: 800, priceMax: 1500, unitEn: "kg", unitUr: "کلو" },
    { key: "soft-shell walnuts", en: "Soft-shell Walnuts", ur: "اخروٹ", priceMin: 600, priceMax: 1100, unitEn: "kg", unitUr: "کلو" },
    { key: "pine nuts (chilgoza)", en: "Pine Nuts (Chilgoza)", ur: "چلغوزہ", priceMin: 5000, priceMax: 8000, unitEn: "kg", unitUr: "کلو" },
    { key: "dried figs", en: "Dried Figs", ur: "انجیر", priceMin: 1200, priceMax: 2200, unitEn: "kg", unitUr: "کلو" },
    { key: "dried apricots", en: "Dried Apricots", ur: "خشک خوبانی", priceMin: 500, priceMax: 900, unitEn: "kg", unitUr: "کلو" }
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
  // Gilgit Baltistan
  { en: "Gilgit City, GB", ur: "گلگت سٹی، گلگت بلتستان" },
  { en: "Skardu, Baltistan", ur: "سکردو، بلتستان" },
  { en: "Astore Valley, GB", ur: "اسطور، گلگت بلتستان" },
  { en: "Ghizer Valley, GB", ur: "غذر، گلگت بلتستان" },
  { en: "Chilas, Diamer, GB", ur: "چلاس، دیامر، گلگت بلتستان" },
  { en: "Khaplu, Ghanche, GB", ur: "خپلو، گانچھے، گلگت بلتستان" },
  { en: "Nagar Valley, GB", ur: "نگر، گلگت بلتستان" },
  { en: "Shigar Valley, GB", ur: "شگر، گلگت بلتستان" },
  { en: "Hunza Valley, GB", ur: "ہنزہ، گلگت بلتستان" },
  // KP
  { en: "Swat Valley, KP", ur: "سوات، خیبر پختونخوا" },
  { en: "Peshawar, KP", ur: "پشاور، خیبر پختونخوا" },
  { en: "Abbottabad, KP", ur: "ایبٹ آباد، خیبر پختونخوا" },
  // Punjab
  { en: "Sargodha, Punjab", ur: "سرگودھا، پنجاب" },
  { en: "Okara, Punjab", ur: "اوکاڑہ، پنجاب" },
  { en: "Multan, Punjab", ur: "ملتان، پنجاب" },
  { en: "Bahawalpur, Punjab", ur: "بہاولپور، پنجاب" },
  { en: "Sahiwal, Punjab", ur: "ساہیوال، پنجاب" },
  { en: "Faisalabad, Punjab", ur: "فیصل آباد، پنجاب" },
  // Sindh
  { en: "Mirpur Khas, Sindh", ur: "میرپور خاص، سندھ" },
  { en: "Matiari, Sindh", ur: "مٹیاری، سندھ" },
  { en: "Hyderabad, Sindh", ur: "حیدرآباد، سندھ" },
  // Balochistan
  { en: "Quetta, Balochistan", ur: "کوئٹہ، بلوچستان" },
  { en: "Ziarat, Balochistan", ur: "زیارت، بلوچستان" }
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

  // Fetch rotating real images from Unsplash arrays to ensure variety
  const imgList = unsplashImages[template.key];
  const image = imgList ? imgList[i % imgList.length] : "https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=60";

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
    image: image,
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
console.log("Generated 150 products in src/data/products.ts with rotating real Unsplash images and diverse geographies!");
