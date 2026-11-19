export interface MockProductVariant {
  id: string;
  name: { ar: string; en: string };
  sku: string;
  price: number;
  stock: number;
  size: string;
  color: string;
  colorHex: string;
}

export interface MockProduct {
  id: string;
  slug: string;
  sku: string;
  name: { ar: string; en: string };
  category: { id: string; slug: string; nameAr: string; nameEn: string };
  tagline: { ar: string; en: string };
  description: { ar: string; en: string };
  fashionDetails: {
    gsm: string;
    fabric: string;
    fit: string;
    care: string;
    origin: string;
  };
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: { ar: string; en: string; type: "gold" | "crimson" | "black" | "olive" };
  images: string[];
  sizes: string[];
  colors: { name: { ar: string; en: string }; hex: string }[];
  collectionSlug: string;
  dropStatus: "available" | "upcoming" | "limited" | "sold_out";
  isFeatured?: boolean;
  isNewDrop?: boolean;
  isBestSeller?: boolean;
  variants: MockProductVariant[];
}

export interface MockCategory {
  id: string;
  slug: string;
  name: { ar: string; en: string };
  tagline: { ar: string; en: string };
  description: { ar: string; en: string };
  itemCount: number;
  heroImage: string;
  iconSvg: string;
}

export const MOCK_CATEGORIES: MockCategory[] = [
  {
    id: "cat-hoodies",
    slug: "hoodies-sweats",
    name: { ar: "هوديز وسويت شيرتات ثقيلة", en: "Heavyweight Hoodies & Sweats" },
    tagline: { ar: "قطن مصري 100% هيفي ويت 380 GSM بقصة أوفرسايز معاصرة", en: "380 GSM Heavy French Terry with dropped shoulder cuts" },
    description: { ar: "هوديز فاخرة مصنعة من أجود خيوط القطن المصري طويل التيلة مع بطانة ناعمة وتطريز مونوغرام متقن.", en: "Premium hoodies crafted from long-staple Egyptian cotton with ultra-soft loopback interior." },
    itemCount: 8,
    heroImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "flame",
  },
  {
    id: "cat-tees",
    slug: "oversized-tshirts",
    name: { ar: "تيشرتات أوفرسايز هيفي ويت", en: "Oversized & Boxy Tees" },
    tagline: { ar: "خامة 240 GSM متماسكة لا تنكمش مع ياقة سميكة ودروب شولدر", en: "240 GSM structured heavyweight combed cotton with thick ribbed collar" },
    description: { ar: "تيشرتات بقصات بوكسي عصرية وطباعات حريرية عالية الكثافة مستوحاة من ثقافة أزياء الشارع العالمية.", en: "Boxy fit tees with high-density silicone prints and acid-wash vintage treatments." },
    itemCount: 12,
    heroImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "sparkles",
  },
  {
    id: "cat-pants",
    slug: "cargo-sweatpants",
    name: { ar: "بناطيل كارجو وميلتون مريح", en: "Cargo Pants & Relaxed Sweats" },
    tagline: { ar: "جيوب وظيفية متعددة مع خامات ضد التمزق وأربطة قابلة للتعديل", en: "Functional multi-pocket styling with reinforced ripstop and custom drawstrings" },
    description: { ar: "تشكيلة البناطيل التكتيكية والكارجو الفضفاضة المصممة لمنحك الراحة الكاملة والمظهر المتناسق.", en: "Relaxed cargo trousers and heavyweight sweatpants engineered for everyday street comfort." },
    itemCount: 6,
    heroImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "crown",
  },
  {
    id: "cat-outerwear",
    slug: "jackets-outerwear",
    name: { ar: "جاكيتات ومعاطف وسترات", en: "Jackets & Technical Outerwear" },
    tagline: { ar: "عزل حراري خفيف وقماش مقاوم للمطر مع سحابات معدنية مخصصة", en: "Weather-resistant technical outerwear with custom branded matte hardware" },
    description: { ar: "جاكيتات بومبر وفلايت جاكيت بلمسات فاخرة وسحابات FG المعدنية لتكتمل إطلالتك في الأجواء الباردة.", en: "Bombers, coaches jackets, and tactical vests featuring custom FG branded metal pullers." },
    itemCount: 5,
    heroImage: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "sun",
  },
  {
    id: "cat-accessories",
    slug: "caps-accessories",
    name: { ar: "إكسسوارات وكابات فاخرة", en: "Caps, Bags & Accessories" },
    tagline: { ar: "كابات قطنية مغسولة، حقائب كروس بودي، وجوارب قطنية محاكة", en: "Enzyme washed dad caps, Cordura crossbody bags, and ribbed socks" },
    description: { ar: "إكسسوارات حصرية تكمل مظهرك مع لوجو FG المعدني والتطريز ثلاثي الأبعاد المتقن.", en: "Exclusive everyday accessories crafted with 3D embroidery and branded matte metal badges." },
    itemCount: 7,
    heroImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "cross",
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "prod-fg-hoodie-01",
    slug: "fg-core-heavyweight-hoodie-obsidian",
    sku: "FG-HD-380-BLK",
    name: {
      ar: "هودي إف جي الثقيل 380 GSM — أسود أوبسيديان",
      en: "FG Core Heavyweight Hoodie 380 GSM - Obsidian Black",
    },
    category: {
      id: "cat-hoodies",
      slug: "hoodies-sweats",
      nameAr: "هوديز وسويت شيرتات",
      nameEn: "Heavyweight Hoodies",
    },
    tagline: {
      ar: "الأيقونة الأساسية للبراند: قطن مصري 100% ثقيل مع ياقة مزدوجة وقصة دروب شولدر",
      en: "The brand signature: 100% heavyweight Egyptian cotton with double-layered hood",
    },
    description: {
      ar: "تمت صياغة هذا الهودي من خامة الفرنش تيري المصرية فائقة النعومة بوزن 380 جرام للمتر المربع. يتميز بياقة مزدوجة تقف بانتظام دون الحاجة لأربطة، مع جيب كنغر خفي وتطريز مونوغرام FG خفيف باللون الأسود على الصدر.",
      en: "Engineered from ultra-dense 380 GSM 100% Egyptian cotton French Terry. Featuring a double-layered structured hood with no drawstrings for a minimal aesthetic, hidden kangaroo pocket, and tonal micro-embroidery.",
    },
    fashionDetails: {
      gsm: "380 GSM Heavyweight Terry",
      fabric: "100% Egyptian Long-Staple Combed Cotton",
      fit: "Oversized Relaxed Drop-Shoulder Fit",
      care: "غسيل مقلوباً بماء بارد (30°C) • تجفيف طبيعي • لا تستخدم المبيضات",
      origin: "صنع في مصر بأعلى معايير الإتقان",
    },
    price: 1350,
    originalPrice: 1650,
    discountPercentage: 18,
    stock: 45,
    rating: 4.95,
    reviewCount: 38,
    badge: { ar: "الأكثر طلباً 🔥", en: "BESTSELLER 🔥", type: "black" },
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أسود أوبسيديان", en: "Obsidian Black" }, hex: "#0A0A0A" },
      { name: { ar: "رمادي شاركول", en: "Charcoal Grey" }, hex: "#2A2A2A" },
      { name: { ar: "أبيض عاجي", en: "Raw Ivory" }, hex: "#F3F1EC" },
    ],
    collectionSlug: "core-essentials",
    dropStatus: "available",
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { id: "v1-1", name: { ar: "أسود / S", en: "Black / S" }, sku: "FG-HD-BLK-S", price: 1350, stock: 8, size: "S", color: "Black", colorHex: "#0A0A0A" },
      { id: "v1-2", name: { ar: "أسود / M", en: "Black / M" }, sku: "FG-HD-BLK-M", price: 1350, stock: 12, size: "M", color: "Black", colorHex: "#0A0A0A" },
      { id: "v1-3", name: { ar: "أسود / L", en: "Black / L" }, sku: "FG-HD-BLK-L", price: 1350, stock: 15, size: "L", color: "Black", colorHex: "#0A0A0A" },
      { id: "v1-4", name: { ar: "أسود / XL", en: "Black / XL" }, sku: "FG-HD-BLK-XL", price: 1350, stock: 7, size: "XL", color: "Black", colorHex: "#0A0A0A" },
      { id: "v1-5", name: { ar: "أسود / XXL", en: "Black / XXL" }, sku: "FG-HD-BLK-XXL", price: 1350, stock: 3, size: "XXL", color: "Black", colorHex: "#0A0A0A" },
    ],
  },
  {
    id: "prod-fg-tee-02",
    slug: "fg-monogram-acid-wash-tee-charcoal",
    sku: "FG-TS-240-ACD",
    name: {
      ar: "تيشرت إف جي مونوغرام معتق (Acid-Wash) — شاركول",
      en: "FG Monogram Acid-Wash Oversized Tee - Vintage Charcoal",
    },
    category: {
      id: "cat-tees",
      slug: "oversized-tshirts",
      nameAr: "تيشرتات أوفرسايز",
      nameEn: "Oversized Tees",
    },
    tagline: {
      ar: "غسيل معتق فنتج مع لوجو FG كبير عالي الكثافة على الظهر وقصة بوكسي",
      en: "Vintage mineral wash with high-density FG back monogram print and boxy cut",
    },
    description: {
      ar: "تيشرت قطن ثقيل بوزن 240 جرام خضع لعملية غسيل حمضي يدوية خاصة تعطي كل قطعة شخصية فريدة. ياقة سميكة ومحبوكة 3.5 سم تدوم طويلاً دون أن تتسع.",
      en: "Heavyweight 240 GSM tee treated with custom mineral acid wash. Reinforced 3.5cm thick ribbed collar that holds shape permanently, and boxy drop shoulders.",
    },
    fashionDetails: {
      gsm: "240 GSM Structured Cotton",
      fabric: "100% Combed Cotton Single Jersey",
      fit: "Boxy Modern Street Fit",
      care: "غسيل مقلوباً بماء بارد • تجنب الكي فوق الطباعة مباشرة",
      origin: "صنع في مصر",
    },
    price: 680,
    originalPrice: 850,
    discountPercentage: 20,
    stock: 60,
    rating: 4.88,
    reviewCount: 42,
    badge: { ar: "دروب جديد 🔥", en: "NEW DROP 🔥", type: "crimson" },
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "رمادي شاركول معتق", en: "Vintage Charcoal" }, hex: "#3A3A3C" },
      { name: { ar: "أسود باهت", en: "Washed Black" }, hex: "#1C1C1E" },
      { name: { ar: "زيتي مغسول", en: "Washed Olive" }, hex: "#3D483A" },
    ],
    collectionSlug: "street-graphic-series",
    dropStatus: "available",
    isFeatured: true,
    isNewDrop: true,
    variants: [
      { id: "v2-1", name: { ar: "شاركول / S", en: "Charcoal / S" }, sku: "FG-TS-ACD-S", price: 680, stock: 10, size: "S", color: "Charcoal", colorHex: "#3A3A3C" },
      { id: "v2-2", name: { ar: "شاركول / M", en: "Charcoal / M" }, sku: "FG-TS-ACD-M", price: 680, stock: 15, size: "M", color: "Charcoal", colorHex: "#3A3A3C" },
      { id: "v2-3", name: { ar: "شاركول / L", en: "Charcoal / L" }, sku: "FG-TS-ACD-L", price: 680, stock: 20, size: "L", color: "Charcoal", colorHex: "#3A3A3C" },
      { id: "v2-4", name: { ar: "شاركول / XL", en: "Charcoal / XL" }, sku: "FG-TS-ACD-XL", price: 680, stock: 10, size: "XL", color: "Charcoal", colorHex: "#3A3A3C" },
      { id: "v2-5", name: { ar: "شاركول / XXL", en: "Charcoal / XXL" }, sku: "FG-TS-ACD-XXL", price: 680, stock: 5, size: "XXL", color: "Charcoal", colorHex: "#3A3A3C" },
    ],
  },
  {
    id: "prod-fg-cargo-03",
    slug: "fg-tactical-multi-pocket-cargo-black",
    sku: "FG-CG-500-BLK",
    name: {
      ar: "بنطلون كارجو تكتيكي متعدد الجيوب — أسود مطفي",
      en: "FG Tactical Multi-Pocket Cargo Pants - Matte Black",
    },
    category: {
      id: "cat-pants",
      slug: "cargo-sweatpants",
      nameAr: "بناطيل وكارجو",
      nameEn: "Pants & Cargo",
    },
    tagline: {
      ar: "قماش ريبستوب متين مضاد للتمزق مع 6 جيوب وظيفية وأربطة كاحل قابلة للتعديل",
      en: "Heavyweight ripstop cotton with 6 utility pockets and adjustable ankle bungee cords",
    },
    description: {
      ar: "بنطلون كارجو يجمع بين الطابع العسكري التكتيكي والراحة العصرية. مزود بجيوب ثلاثية الأبعاد بسحابات مخفية وأربطة مطاطية لتعديل الاتساع عند الحذاء.",
      en: "Combining tactical techwear with modern streetwear silhouette. Built from durable ripstop cotton with 3D gusseted pockets and ankle toggles.",
    },
    fashionDetails: {
      gsm: "320 GSM Tactical Ripstop",
      fabric: "97% Cotton / 3% Spandex for Comfort Stretch",
      fit: "Relaxed Tapered Silhouette",
      care: "غسيل بارد في الغسالة • تجنب استخدام منعم الأقمشة بكثرة",
      origin: "صنع في مصر",
    },
    price: 1150,
    originalPrice: 1400,
    discountPercentage: 17,
    stock: 28,
    rating: 4.9,
    reviewCount: 26,
    badge: { ar: "إصدار حصري", en: "EXCLUSIVE", type: "gold" },
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أسود تكتيكي", en: "Matte Black" }, hex: "#0F0F10" },
      { name: { ar: "بيج صحراوي", en: "Desert Khaki" }, hex: "#C3B091" },
      { name: { ar: "رمادي خرساني", en: "Concrete Grey" }, hex: "#6E7175" },
    ],
    collectionSlug: "core-essentials",
    dropStatus: "available",
    isFeatured: true,
    variants: [
      { id: "v3-1", name: { ar: "أسود / S", en: "Black / S" }, sku: "FG-CG-BLK-S", price: 1150, stock: 5, size: "S", color: "Black", colorHex: "#0F0F10" },
      { id: "v3-2", name: { ar: "أسود / M", en: "Black / M" }, sku: "FG-CG-BLK-M", price: 1150, stock: 8, size: "M", color: "Black", colorHex: "#0F0F10" },
      { id: "v3-3", name: { ar: "أسود / L", en: "Black / L" }, sku: "FG-CG-BLK-L", price: 1150, stock: 9, size: "L", color: "Black", colorHex: "#0F0F10" },
      { id: "v3-4", name: { ar: "أسود / XL", en: "Black / XL" }, sku: "FG-CG-BLK-XL", price: 1150, stock: 4, size: "XL", color: "Black", colorHex: "#0F0F10" },
      { id: "v3-5", name: { ar: "أسود / XXL", en: "Black / XXL" }, sku: "FG-CG-BLK-XXL", price: 1150, stock: 2, size: "XXL", color: "Black", colorHex: "#0F0F10" },
    ],
  },
  {
    id: "prod-fg-jacket-04",
    slug: "fg-reversible-bomber-jacket-onyx",
    sku: "FG-JK-600-ONX",
    name: {
      ar: "جاكيت بومبر مزدوج الوجهين — أونيكس / برتقالي ستريت",
      en: "FG Reversible Bomber Jacket - Onyx Black / Safety Orange",
    },
    category: {
      id: "cat-outerwear",
      slug: "jackets-outerwear",
      nameAr: "جاكيتات ومعاطف",
      nameEn: "Jackets & Outerwear",
    },
    tagline: {
      ar: "تصميم طيارين كلاسيكي مع وجه أسود فاخر مطرز ووجه داخلي برتقالي جريء",
      en: "Classic MA-1 flight silhouette with luxury embroidered matte black face and bold safety orange reverse",
    },
    description: {
      ar: "جاكيت بومبر بوجهين يمنحك خيارين في قطعة واحدة. نايلون طيارين كثيف مقاوم للرياح ورذاذ الماء، مع حشوة عزل حراري خفيفة وسحاب معدني FG فخم يدور للجهتين.",
      en: "Two statement jackets in one. Weather-resistant flight nylon with lightweight thermal insulation and a heavy-gauge dual-rotation metal zipper pull.",
    },
    fashionDetails: {
      gsm: "Water-Repellent Flight Nylon Outer",
      fabric: "100% High-Density Polyamide Shell with Poly Fill",
      fit: "Relaxed Bomber Silhouette with Dropped Arms",
      care: "تنظيف جاف يفضل • أو غسيل بارد يدوي",
      origin: "صنع في مصر",
    },
    price: 1850,
    originalPrice: 2200,
    discountPercentage: 15,
    stock: 20,
    rating: 5.0,
    reviewCount: 19,
    badge: { ar: "قطعة الموسم 👑", en: "ICONIC PIECE", type: "gold" },
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أسود أونيكس / برتقالي", en: "Onyx Black / Orange" }, hex: "#0D0D0E" },
      { name: { ar: "زيتي سلاح الجو", en: "Airforce Olive" }, hex: "#353D32" },
    ],
    collectionSlug: "winter-2026",
    dropStatus: "available",
    isFeatured: true,
    variants: [
      { id: "v4-1", name: { ar: "أسود / M", en: "Black / M" }, sku: "FG-JK-ONX-M", price: 1850, stock: 5, size: "M", color: "Black", colorHex: "#0D0D0E" },
      { id: "v4-2", name: { ar: "أسود / L", en: "Black / L" }, sku: "FG-JK-ONX-L", price: 1850, stock: 8, size: "L", color: "Black", colorHex: "#0D0D0E" },
      { id: "v4-3", name: { ar: "أسود / XL", en: "Black / XL" }, sku: "FG-JK-ONX-XL", price: 1850, stock: 5, size: "XL", color: "Black", colorHex: "#0D0D0E" },
      { id: "v4-4", name: { ar: "أسود / XXL", en: "Black / XXL" }, sku: "FG-JK-ONX-XXL", price: 1850, stock: 2, size: "XXL", color: "Black", colorHex: "#0D0D0E" },
    ],
  },
  {
    id: "prod-fg-hoodie-05",
    slug: "fg-minimalist-hoodie-raw-oatmeal",
    sku: "FG-HD-380-OAT",
    name: {
      ar: "هودي إف جي مينيمال — بيج شوفان (Raw Oatmeal)",
      en: "FG Minimalist Heavyweight Hoodie - Raw Oatmeal",
    },
    category: {
      id: "cat-hoodies",
      slug: "hoodies-sweats",
      nameAr: "هوديز وسويت شيرتات",
      nameEn: "Heavyweight Hoodies",
    },
    tagline: {
      ar: "لون طبيعي خام غير مصبوغ مع شعار FG مونوغرام دائري منقوش بنعومة",
      en: "Un-dyed organic aesthetic with tonal debossed circular monogram badge",
    },
    description: {
      ar: "لمن يفضلون البساطة الصامتة والفخامة الهادئة. هودي بلون الشوفان الطبيعي المحبوك من خيوط قطن خام غير معالجة كيميائياً.",
      en: "Quiet luxury for everyday living. Natural raw oatmeal colorway knitted from low-impact combed cotton fibers with zero harsh chemicals.",
    },
    fashionDetails: {
      gsm: "380 GSM Heavy French Terry",
      fabric: "100% Un-dyed Egyptian Cotton",
      fit: "Oversized Boxy Silhouette",
      care: "غسيل مقلوباً بماء بارد • تجفيف مسطح",
      origin: "صنع في مصر",
    },
    price: 1390,
    originalPrice: 1650,
    discountPercentage: 15,
    stock: 35,
    rating: 4.92,
    reviewCount: 31,
    badge: { ar: "جديد 2026", en: "NEW 2026", type: "black" },
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "بيج شوفان خام", en: "Raw Oatmeal" }, hex: "#E7DFD5" },
      { name: { ar: "أبيض حليبي", en: "Off-White Cream" }, hex: "#F7F5F0" },
    ],
    collectionSlug: "core-essentials",
    dropStatus: "available",
    isFeatured: true,
    variants: [
      { id: "v5-1", name: { ar: "شوفان / S", en: "Oatmeal / S" }, sku: "FG-HD-OAT-S", price: 1390, stock: 6, size: "S", color: "Oatmeal", colorHex: "#E7DFD5" },
      { id: "v5-2", name: { ar: "شوفان / M", en: "Oatmeal / M" }, sku: "FG-HD-OAT-M", price: 1390, stock: 10, size: "M", color: "Oatmeal", colorHex: "#E7DFD5" },
      { id: "v5-3", name: { ar: "شوفان / L", en: "Oatmeal / L" }, sku: "FG-HD-OAT-L", price: 1390, stock: 12, size: "L", color: "Oatmeal", colorHex: "#E7DFD5" },
      { id: "v5-4", name: { ar: "شوفان / XL", en: "Oatmeal / XL" }, sku: "FG-HD-OAT-XL", price: 1390, stock: 5, size: "XL", color: "Oatmeal", colorHex: "#E7DFD5" },
      { id: "v5-5", name: { ar: "شوفان / XXL", en: "Oatmeal / XXL" }, sku: "FG-HD-OAT-XXL", price: 1390, stock: 2, size: "XXL", color: "Oatmeal", colorHex: "#E7DFD5" },
    ],
  },
  {
    id: "prod-fg-tee-06",
    slug: "fg-boxy-fit-heavyweight-tee-optic-white",
    sku: "FG-TS-260-WHT",
    name: {
      ar: "تيشرت إف جي بوكسي ثقيل 260 GSM — أبيض ناصع",
      en: "FG Boxy Fit Heavyweight Tee 260 GSM - Optic White",
    },
    category: {
      id: "cat-tees",
      slug: "oversized-tshirts",
      nameAr: "تيشرتات أوفرسايز",
      nameEn: "Oversized Tees",
    },
    tagline: {
      ar: "التيشرت الأبيض المثالي: نسيج قطني كثيف لا يشف إطلاقاً مع ياقة مضلعة متماسكة",
      en: "The definitive white tee: high-density zero-sheerness cotton with durable bound rib",
    },
    description: {
      ar: "بحثك عن التيشرت الأبيض الفاخر ينتهي هنا. تم حياكته بوزن 260 جرام من أجود أقطان مصر المعالجة ضد التوبير والانكماش، بقصة بوكسي نظيفة تليق بكل الإطلالات.",
      en: "Your search for the ultimate white tee ends here. 260 GSM anti-pilling, pre-shrunk combed jersey with a structured drape and dropped shoulders.",
    },
    fashionDetails: {
      gsm: "260 GSM Ultra-Heavy Combed Cotton",
      fabric: "100% Egyptian Combed Cotton (Zero Transparency)",
      fit: "Boxy Clean Street Fit",
      care: "غسيل مع الألوان الفاتحة فقط • ماء بارد",
      origin: "صنع في مصر",
    },
    price: 650,
    originalPrice: 750,
    discountPercentage: 13,
    stock: 75,
    rating: 4.96,
    reviewCount: 54,
    badge: { ar: "أساسيات FG", en: "ESSENTIAL", type: "black" },
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أبيض ناصع", en: "Optic White" }, hex: "#FFFFFF" },
      { name: { ar: "أسود فحمي", en: "Jet Black" }, hex: "#0A0A0A" },
    ],
    collectionSlug: "core-essentials",
    dropStatus: "available",
    isFeatured: true,
    isBestSeller: true,
    variants: [
      { id: "v6-1", name: { ar: "أبيض / S", en: "White / S" }, sku: "FG-TS-WHT-S", price: 650, stock: 15, size: "S", color: "White", colorHex: "#FFFFFF" },
      { id: "v6-2", name: { ar: "أبيض / M", en: "White / M" }, sku: "FG-TS-WHT-M", price: 650, stock: 20, size: "M", color: "White", colorHex: "#FFFFFF" },
      { id: "v6-3", name: { ar: "أبيض / L", en: "White / L" }, sku: "FG-TS-WHT-L", price: 650, stock: 22, size: "L", color: "White", colorHex: "#FFFFFF" },
      { id: "v6-4", name: { ar: "أبيض / XL", en: "White / XL" }, sku: "FG-TS-WHT-XL", price: 650, stock: 12, size: "XL", color: "White", colorHex: "#FFFFFF" },
      { id: "v6-5", name: { ar: "أبيض / XXL", en: "White / XXL" }, sku: "FG-TS-WHT-XXL", price: 650, stock: 6, size: "XXL", color: "White", colorHex: "#FFFFFF" },
    ],
  },
  {
    id: "prod-fg-cap-07",
    slug: "fg-embroidered-monogram-dad-cap",
    sku: "FG-CP-100-WSH",
    name: {
      ar: "كاب إف جي مونوغرام مطرز 3D — زيتي مغسول",
      en: "FG Embroidered Monogram Dad Cap - Washed Olive",
    },
    category: {
      id: "cat-accessories",
      slug: "caps-accessories",
      nameAr: "إكسسوارات وكابات",
      nameEn: "Caps & Accessories",
    },
    tagline: {
      ar: "قطن تويل ثقيل مغسول بالإنزيمات مع إبزيم معدني مونوغرام وتطريز ثلاثي الأبعاد",
      en: "Enzyme washed heavy cotton twill with custom embossed metal buckle and 3D embroidery",
    },
    description: {
      ar: "كاب كلاسيكي بـ 6 ألواح يتميز بمرونة تامة وملمس عتيق فاخر. تطريز شعار FG بحجم مدروس في المقدمة مع توقيع العلامة مطرزاً في الخلف.",
      en: "Low-profile 6-panel unstructured silhouette made from heavy enzyme-washed twill. Features high-density 3D front embroidery and adjustable custom metal strap.",
    },
    fashionDetails: {
      gsm: "Heavy Chino Cotton Twill",
      fabric: "100% Washed Cotton Twill",
      fit: "Adjustable Strapback (One Size Fits All)",
      care: "تنظيف موضعي بإسفنجة رطبة فقط",
      origin: "صنع في مصر",
    },
    price: 380,
    originalPrice: 480,
    discountPercentage: 20,
    stock: 50,
    rating: 4.85,
    reviewCount: 22,
    badge: { ar: "إكسسوار يومي", en: "DAILY GEAR", type: "olive" },
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["One Size"],
    colors: [
      { name: { ar: "زيتي مغسول", en: "Washed Olive" }, hex: "#4A5243" },
      { name: { ar: "أسود كربوني", en: "Carbon Black" }, hex: "#1A1A1A" },
      { name: { ar: "بيج صحراوي", en: "Desert Khaki" }, hex: "#C7B299" },
    ],
    collectionSlug: "core-essentials",
    dropStatus: "available",
    isFeatured: false,
    variants: [
      { id: "v7-1", name: { ar: "زيتي / One Size", en: "Olive / One Size" }, sku: "FG-CP-OLV-OS", price: 380, stock: 20, size: "One Size", color: "Olive", colorHex: "#4A5243" },
      { id: "v7-2", name: { ar: "أسود / One Size", en: "Black / One Size" }, sku: "FG-CP-BLK-OS", price: 380, stock: 20, size: "One Size", color: "Black", colorHex: "#1A1A1A" },
      { id: "v7-3", name: { ar: "بيج / One Size", en: "Khaki / One Size" }, sku: "FG-CP-KHK-OS", price: 380, stock: 10, size: "One Size", color: "Khaki", colorHex: "#C7B299" },
    ],
  },
  {
    id: "prod-fg-pants-08",
    slug: "fg-relaxed-french-terry-sweatpants-grey",
    sku: "FG-SW-380-GRY",
    name: {
      ar: "بنطلون ميلتون مريح 380 GSM — رمادي ميلانج",
      en: "FG Relaxed French Terry Sweatpants - Heather Melange",
    },
    category: {
      id: "cat-pants",
      slug: "cargo-sweatpants",
      nameAr: "بناطيل وكارجو",
      nameEn: "Pants & Cargo",
    },
    tagline: {
      ar: "قصة واسعة مريحة مع جيوب عميقة وسحابات مخفية وأربطة سميكة مخصصة",
      en: "Straight relaxed wide-leg cut with hidden zip side pockets and heavy custom drawcords",
    },
    description: {
      ar: "بنطلون سويت بانتس بوزن 380 جرام يمنحك التوازن المثالي بين إطلالة الشارع الفخمة وأقصى درجات الراحة المنزلية.",
      en: "Substantial 380 GSM loopback French Terry pants crafted with an open wide hem, concealed security zippers, and rubber-dipped drawstrings.",
    },
    fashionDetails: {
      gsm: "380 GSM French Terry",
      fabric: "85% Egyptian Cotton / 15% Poly for Shape Retention",
      fit: "Relaxed Straight-Leg Cut",
      care: "غسيل مقلوباً بماء بارد • تجفيف طبيعي",
      origin: "صنع في مصر",
    },
    price: 980,
    originalPrice: 1200,
    discountPercentage: 18,
    stock: 30,
    rating: 4.89,
    reviewCount: 29,
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "رمادي ميلانج", en: "Heather Melange" }, hex: "#9E9E9E" },
      { name: { ar: "أسود فحمي", en: "Jet Black" }, hex: "#0A0A0A" },
    ],
    collectionSlug: "core-essentials",
    dropStatus: "available",
    isFeatured: false,
    variants: [
      { id: "v8-1", name: { ar: "رمادي / S", en: "Grey / S" }, sku: "FG-SW-GRY-S", price: 980, stock: 5, size: "S", color: "Grey", colorHex: "#9E9E9E" },
      { id: "v8-2", name: { ar: "رمادي / M", en: "Grey / M" }, sku: "FG-SW-GRY-M", price: 980, stock: 8, size: "M", color: "Grey", colorHex: "#9E9E9E" },
      { id: "v8-3", name: { ar: "رمادي / L", en: "Grey / L" }, sku: "FG-SW-GRY-L", price: 980, stock: 10, size: "L", color: "Grey", colorHex: "#9E9E9E" },
      { id: "v8-4", name: { ar: "رمادي / XL", en: "Grey / XL" }, sku: "FG-SW-GRY-XL", price: 980, stock: 5, size: "XL", color: "Grey", colorHex: "#9E9E9E" },
      { id: "v8-5", name: { ar: "رمادي / XXL", en: "Grey / XXL" }, sku: "FG-SW-GRY-XXL", price: 980, stock: 2, size: "XXL", color: "Grey", colorHex: "#9E9E9E" },
    ],
  },
];
