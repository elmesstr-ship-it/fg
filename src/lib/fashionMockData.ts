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
    tagline: { ar: "قطن مصري 100% هيفي ويت 380-450 GSM بقصة دروب شولدر واسعة", en: "380-450 GSM Heavy French Terry with structured drop-shoulder cuts" },
    description: { ar: "هوديز وسويت شيرتات فاخرة مصنعة من أجود خيوط القطن المصري طويل التيلة مع بطانة ناعمة وتطريز مونوغرام متقن.", en: "Premium hoodies crafted from long-staple Egyptian cotton with ultra-soft loopback interior." },
    itemCount: 6,
    heroImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "flame",
  },
  {
    id: "cat-tees",
    slug: "oversized-tshirts",
    name: { ar: "تيشرتات أوفرسايز هيفي ويت", en: "Oversized & Boxy Tees" },
    tagline: { ar: "خامة 240 GSM متماسكة لا تنكمش مع ياقة سميكة ودروب شولدر عصري", en: "240 GSM structured heavyweight combed cotton with thick ribbed collar" },
    description: { ar: "تيشرتات بقصات بوكسي عصرية وطباعات حريرية عالية الكثافة مستوحاة من ثقافة أزياء الشارع العالمية.", en: "Boxy fit tees with high-density silicone prints and acid-wash vintage treatments." },
    itemCount: 5,
    heroImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "sparkles",
  },
  {
    id: "cat-pants",
    slug: "cargo-sweatpants",
    name: { ar: "بناطيل كارجو وتراكس", en: "Cargo Pants & Relaxed Sweats" },
    tagline: { ar: "جيوب وظيفية متعددة مع خامات ضد التمزق وأربطة قابلة للتعديل", en: "Functional multi-pocket styling with reinforced ripstop and custom drawstrings" },
    description: { ar: "تشكيلة البناطيل التكتيكية والكارجو الفضفاضة المصممة لمنحك الراحة الكاملة والمظهر المتناسق.", en: "Relaxed cargo trousers and heavyweight sweatpants engineered for everyday street comfort." },
    itemCount: 5,
    heroImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "crown",
  },
  {
    id: "cat-outerwear",
    slug: "jackets-outerwear",
    name: { ar: "جاكيتات ومعاطف وسترات", en: "Jackets & Technical Outerwear" },
    tagline: { ar: "عزل حراري خفيف وقماش مقاوم للمطر مع سحابات معدنية مخصصة لـ FG", en: "Weather-resistant technical outerwear with custom branded matte hardware" },
    description: { ar: "جاكيتات بومبر وفلايت جاكيت بلمسات فاخرة وسحابات FG المعدنية لتكتمل إطلالتك في الأجواء الباردة.", en: "Bombers, coaches jackets, and tactical vests featuring custom FG branded metal pullers." },
    itemCount: 4,
    heroImage: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "sun",
  },
  {
    id: "cat-accessories",
    slug: "caps-accessories",
    name: { ar: "إكسسوارات وكابات وحقائب", en: "Caps, Bags & Accessories" },
    tagline: { ar: "كابات قطنية مغسولة، حقائب كروس بودي تكتيكية، وسلاسل ستانلس ستيل", en: "Enzyme washed dad caps, Cordura crossbody bags, and stainless steel hardware" },
    description: { ar: "إكسسوارات حصرية تكمل مظهرك مع لوجو FG المعدني والتطريز ثلاثي الأبعاد المتقن.", en: "Exclusive everyday accessories crafted with 3D embroidery and branded matte metal badges." },
    itemCount: 4,
    heroImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop",
    iconSvg: "cross",
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  // ==========================================
  // 1. HOODIES & SWEATSHIRTS (cat-hoodies)
  // ==========================================
  {
    id: "prod-fg-hoodie-01",
    slug: "fg-core-heavyweight-hoodie-obsidian",
    sku: "FG-HD-380-BLK",
    name: {
      ar: "هودي إف جي الأيقوني 380 GSM — أسود أوبسيديان",
      en: "FG Core Heavyweight Hoodie 380 GSM - Obsidian Black",
    },
    category: {
      id: "cat-hoodies",
      slug: "hoodies-sweats",
      nameAr: "هوديز وسويت شيرتات ثقيلة",
      nameEn: "Heavyweight Hoodies",
    },
    tagline: {
      ar: "الأيقونة الأساسية للبراند: قطن مصري 100% ثقيل مع ياقة مزدوجة وقصة دروب شولدر",
      en: "The brand signature: 100% heavyweight Egyptian cotton with double-layered structured hood",
    },
    description: {
      ar: "تمت صياغة هذا الهودي من خامة الفرنش تيري المصرية فائقة النعومة بوزن 380 جرام للمتر المربع. يتميز بياقة مزدوجة تقف بانتظام دون الحاجة لأربطة، مع جيب كنغر مخفي وتطريز مونوغرام FG خفيف باللون الأسود على الصدر.",
      en: "Engineered from ultra-dense 380 GSM 100% Egyptian cotton French Terry. Featuring a double-layered structured hood with no drawstrings for a minimal aesthetic, hidden kangaroo pocket, and tonal micro-embroidery.",
    },
    fashionDetails: {
      gsm: "380 GSM Heavy French Terry",
      fabric: "100% Egyptian Long-Staple Combed Cotton",
      fit: "Oversized Relaxed Drop-Shoulder Fit",
      care: "غسيل مقلوباً بماء بارد (30°C) • تجفيف طبيعي • لا تستخدم المبيضات",
      origin: "صنع في المنصورة، مصر بأعلى معايير الإتقان",
    },
    price: 1350,
    originalPrice: 1650,
    discountPercentage: 18,
    stock: 42,
    rating: 4.95,
    reviewCount: 48,
    badge: { ar: "الأكثر طلباً 🔥", en: "BESTSELLER 🔥", type: "black" },
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أسود أوبسيديان", en: "Obsidian Black" }, hex: "#0A0A0A" },
      { name: { ar: "فحم مغسول", en: "Washed Charcoal" }, hex: "#262626" },
      { name: { ar: "رمادي ميلانج", en: "Melange Grey" }, hex: "#525252" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    isNewDrop: true,
    isBestSeller: true,
    variants: [],
  },
  {
    id: "prod-fg-hoodie-02",
    slug: "fg-vintage-acid-wash-hoodie-charcoal",
    sku: "FG-HD-420-WSH",
    name: {
      ar: "هودي فينتاج مغسول 420 GSM — رمادي معتق",
      en: "FG Vintage Acid Wash Heavy Hoodie 420 GSM - Washed Grey",
    },
    category: {
      id: "cat-hoodies",
      slug: "hoodies-sweats",
      nameAr: "هوديز وسويت شيرتات ثقيلة",
      nameEn: "Heavyweight Hoodies",
    },
    tagline: {
      ar: "غسيل حمضي يدوي مخصص لكل قطعة بوزن فائق 420 GSM لإطلالة ستريت وير أصيلة",
      en: "Bespoke acid-washed finish with ultra-heavy 420 GSM fabric weight",
    },
    description: {
      ar: "قطعة فنية فردية تخضع لعملية غسيل وتعتيق أنزيمي خاصة تجعل كل قطعة فريدة بنمط تدرجات ألوانها. خامة 420 GSM دافئة جداً مع حواف مضلعة مرنة ومقاومة للاهتراء.",
      en: "Individually enzyme-washed to create a unique vintage patina. The dense 420 GSM construction provides exceptional warmth and a structured drape.",
    },
    fashionDetails: {
      gsm: "420 GSM Super-Heavyweight Cotton",
      fabric: "100% Egyptian Ringspun Combed Cotton",
      fit: "Boxy Vintage Silhouette",
      care: "غسيل مقلوباً منفصلاً لمنع انتقال الصبغة • تجفيف هوائي",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1480,
    originalPrice: 1850,
    discountPercentage: 20,
    stock: 28,
    rating: 4.88,
    reviewCount: 31,
    badge: { ar: "إصدار حصري 👑", en: "EXCLUSIVE 👑", type: "gold" },
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "رمادي معتق", en: "Washed Slate" }, hex: "#3f3f46" },
      { name: { ar: "بني ترابي مغسول", en: "Washed Mud" }, hex: "#451a03" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    isNewDrop: true,
    variants: [],
  },
  {
    id: "prod-fg-hoodie-03",
    slug: "fg-minimalist-half-zip-sweatshirt-bone",
    sku: "FG-HZ-400-BNE",
    name: {
      ar: "سويت شيرت نصف سحاب 400 GSM — أوف وايت خام",
      en: "FG Minimalist Half-Zip Sweatshirt 400 GSM - Bone Off-White",
    },
    category: {
      id: "cat-hoodies",
      slug: "hoodies-sweats",
      nameAr: "هوديز وسويت شيرتات ثقيلة",
      nameEn: "Heavyweight Hoodies",
    },
    tagline: {
      ar: "سحاب معدني مخصص باللون الفضي المطفي مع ياقة عالية وياقة مضلعة سميكة",
      en: "Matte silver branded hardware with high structured funnel collar",
    },
    description: {
      ar: "تجسيد للفخامة البسيطة (Luxury Minimalism). ياقة عالية قابلة للطي أو الرفع مع سحاب مخصص يحمل شفرة FG المحفورة بالليزر، وقماش قطني خام غير مبيض بدرجة لون Bone الطبيعية.",
      en: "The epitome of understated luxury. Features an unbleached natural cotton shade, custom laser-etched FG zipper pull, and double-knit cuffs.",
    },
    fashionDetails: {
      gsm: "400 GSM Heavyweight Terry",
      fabric: "100% Unbleached Egyptian Cotton",
      fit: "Clean Relaxed Fit",
      care: "غسيل يدوي أو دورة غسيل لطيفة • لا تستخدم المجفف الآلي",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1390,
    originalPrice: 1600,
    discountPercentage: 13,
    stock: 22,
    rating: 4.92,
    reviewCount: 19,
    badge: { ar: "دروب جديد 🔥", en: "NEW DROP 🔥", type: "crimson" },
    images: [
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أوف وايت عاجي", en: "Bone White" }, hex: "#E7E5E4" },
      { name: { ar: "أسود مطفي", en: "Matte Black" }, hex: "#18181B" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    variants: [],
  },
  {
    id: "prod-fg-hoodie-04",
    slug: "fg-arch-monogram-hoodie-forest-green",
    sku: "FG-HD-380-GRN",
    name: {
      ar: "هودي مونوجرام قوسي 380 GSM — أخضر زمردي داكن",
      en: "FG Arch Monogram Hoodie 380 GSM - Forest Green",
    },
    category: {
      id: "cat-hoodies",
      slug: "hoodies-sweats",
      nameAr: "هوديز وسويت شيرتات ثقيلة",
      nameEn: "Heavyweight Hoodies",
    },
    tagline: {
      ar: "تطريز بارز ثلاثي الأبعاد لشعار FG على الصدر مع بطانة حرارية فائقة الدفء",
      en: "3D high-density puff embroidery with ultra-soft fleece backing",
    },
    description: {
      ar: "لون أخضر غابي داكن مستوحى من درجات الألوان الملكية. خياطة مزدوجة معززة عند الكتفين وشريط متماسك حول المعصمين لمنع التمدد مع الاستخدام اليومي.",
      en: "Deep royal forest green palette with contrast 3D puff embroidery, reinforced flatlock seams, and ribbed side panels for maximum mobility.",
    },
    fashionDetails: {
      gsm: "380 GSM Brushed Fleece",
      fabric: "100% Egyptian Cotton",
      fit: "Structured Drop Shoulder",
      care: "غسيل بماء بارد • كي مقلوباً",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1390,
    originalPrice: 1650,
    discountPercentage: 15,
    stock: 35,
    rating: 4.85,
    reviewCount: 24,
    images: [
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "أخضر زمردي داكن", en: "Forest Green" }, hex: "#064E3B" },
      { name: { ar: "كحلي منتصف الليل", en: "Midnight Navy" }, hex: "#0F172A" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },
  {
    id: "prod-fg-hoodie-05",
    slug: "fg-raw-cut-heavy-crewneck-earth-brown",
    sku: "FG-CRW-380-BRN",
    name: {
      ar: "سويت شيرت كروونك ثقيل 380 GSM — بني ترابي",
      en: "FG Raw Cut Heavy Crewneck 380 GSM - Earth Brown",
    },
    category: {
      id: "cat-hoodies",
      slug: "hoodies-sweats",
      nameAr: "هوديز وسويت شيرتات ثقيلة",
      nameEn: "Heavyweight Hoodies",
    },
    tagline: {
      ar: "رقبة دائرية كلاسيكية مع ياقة سميكة 3 سم وقماش فرنش تيري متماسك",
      en: "Classic boxy crewneck with 3cm thick ribbed neckband",
    },
    description: {
      ar: "قطعة أساسية لكل خزانة ملابس عصرية. مظهر بسيط وفاخر بدون أي شعارات مبالغ فيها، يعتمد على قوة القماش ودقة القصة وجودة التصنيع المصري الخالص.",
      en: "A refined everyday staple. Engineered with a wide boxy body and tight neck opening for that unmistakable modern street aesthetic.",
    },
    fashionDetails: {
      gsm: "380 GSM French Terry",
      fabric: "100% Egyptian Combed Cotton",
      fit: "Boxy Wide Cut",
      care: "غسيل عادي 30°C",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1190,
    originalPrice: 1450,
    discountPercentage: 17,
    stock: 50,
    rating: 4.89,
    reviewCount: 22,
    images: [
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "بني ترابي", en: "Earth Brown" }, hex: "#78350F" },
      { name: { ar: "أسود كربوني", en: "Carbon Black" }, hex: "#1C1917" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },
  {
    id: "prod-fg-hoodie-06",
    slug: "fg-thermal-lined-zip-hoodie-black",
    sku: "FG-ZIP-450-BLK",
    name: {
      ar: "هودي كامل السحاب مبطن حرارياً 450 GSM — أسود فاحم",
      en: "FG Thermal Lined Full-Zip Heavy Hoodie 450 GSM - Jet Black",
    },
    category: {
      id: "cat-hoodies",
      slug: "hoodies-sweats",
      nameAr: "هوديز وسويت شيرتات ثقيلة",
      nameEn: "Heavyweight Hoodies",
    },
    tagline: {
      ar: "أثقل هودي في التشكيلة: وزن 450 GSM مع سحاب ثنائي الاتجاه YKK مخصص",
      en: "Heaviest weight piece in the lineup with dual-direction custom YKK zipper",
    },
    description: {
      ar: "تم تصميم هذا الهودي ليعمل كبديل متكامل للجاكيت الخفيف في الشتاء بفضل بطانته الكثيفة ووزنه الاستثنائي 450 GSM وسحابه المزدوج الذي يتيح فتح الهودي من الأسفل أيضاً.",
      en: "Functions as a light winter coat thanks to its monumental 450 GSM density, waffle thermal lining, and two-way bespoke FG hardware.",
    },
    fashionDetails: {
      gsm: "450 GSM Super Dense Terry",
      fabric: "100% Egyptian Long-Staple Cotton",
      fit: "Relaxed Heavy Silhouette",
      care: "تنظيف جاف أو غسيل يدوي مقلوباً",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1650,
    originalPrice: 1950,
    discountPercentage: 15,
    stock: 18,
    rating: 4.98,
    reviewCount: 39,
    badge: { ar: "قطعة الموسم 👑", en: "GRAIL PIECE 👑", type: "gold" },
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1548883354-7622d03aca27?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أسود نفاث", en: "Jet Black" }, hex: "#000000" },
      { name: { ar: "رمادي معدني", en: "Gunmetal Grey" }, hex: "#374151" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    variants: [],
  },

  // ==========================================
  // 2. OVERSIZED T-SHIRTS (cat-tees)
  // ==========================================
  {
    id: "prod-fg-tee-01",
    slug: "fg-boxy-heavyweight-tee-black",
    sku: "FG-TEE-240-BLK",
    name: {
      ar: "تيشرت بوكسي ثقيل 240 GSM — أسود نفاث",
      en: "FG Boxy Heavyweight Tee 240 GSM - Jet Black",
    },
    category: {
      id: "cat-tees",
      slug: "oversized-tshirts",
      nameAr: "تيشرتات أوفرسايز هيفي ويت",
      nameEn: "Oversized Tees",
    },
    tagline: {
      ar: "خامة 240 GSM لا تنكمش مع ياقة سميكة 3 سم مضلعة وقصة بوكسي مستقيمة",
      en: "Zero shrinkage 240 GSM combed cotton with 1.2 inch thick ribbed collar",
    },
    description: {
      ar: "التيشرت الذي يغير مفاهيم التيشرتات اليومية. قماش قطني مصري ثقيل ومتماسك لا يلتصق بالجسم ولا يفقد شكله بعد الغسيل المتكرر. تطريز مصغر لشعار FG عند أطراف الأكمام.",
      en: "The definitive luxury streetwear tee. Made from heavyweight Egyptian cotton that holds its crisp boxy structure without draping or losing shape after washes.",
    },
    fashionDetails: {
      gsm: "240 GSM Heavy Combed Cotton",
      fabric: "100% Egyptian Long-Staple Cotton",
      fit: "Boxy Wide Drop-Shoulder Fit",
      care: "غسيل مقلوباً بماء بارد • لا تستخدم المبيضات",
      origin: "صنع في المنصورة، مصر",
    },
    price: 650,
    originalPrice: 850,
    discountPercentage: 23,
    stock: 75,
    rating: 4.96,
    reviewCount: 64,
    badge: { ar: "الأكثر طلباً 🔥", en: "BESTSELLER 🔥", type: "black" },
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أسود نفاث", en: "Jet Black" }, hex: "#0A0A0A" },
      { name: { ar: "أبيض طباشيري", en: "Chalk White" }, hex: "#F5F5F4" },
      { name: { ar: "بيج رملي", en: "Dune Beige" }, hex: "#D6D3D1" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    isNewDrop: true,
    isBestSeller: true,
    variants: [],
  },
  {
    id: "prod-fg-tee-02",
    slug: "fg-acid-wash-vintage-graphic-tee",
    sku: "FG-TEE-240-ACD",
    name: {
      ar: "تيشرت جرافيك مغسول أسيد 240 GSM — رمادي معتق",
      en: "FG Acid Wash Vintage Graphic Tee 240 GSM - Distressed Slate",
    },
    category: {
      id: "cat-tees",
      slug: "oversized-tshirts",
      nameAr: "تيشرتات أوفرسايز هيفي ويت",
      nameEn: "Oversized Tees",
    },
    tagline: {
      ar: "طباعة سلك سكرين حريرية معتقة لشعار FG الخلفي مع معالجة غسيل يدوي مميزة",
      en: "Cracked vintage silkscreen back print with artisan stone-wash effect",
    },
    description: {
      ar: "مستوحى من ملابس الشارع في تسعينيات القرن الماضي. طباعة خلفية ضخمة بأسلوب مونوكروم معتق تم دمجها في أنسجة القماش لتمنحك ملمساً طبيعياً ناعماً دون أي تيبس.",
      en: "90s streetwear nostalgia brought to modern luxury standards. Large cracked back typography print soft to the touch, paired with heavy stone-washing.",
    },
    fashionDetails: {
      gsm: "240 GSM Stone-Washed Cotton",
      fabric: "100% Egyptian Cotton",
      fit: "Relaxed Vintage Boxy",
      care: "غسيل مقلوباً في ماء بارد لحماية الطباعة",
      origin: "صنع في المنصورة، مصر",
    },
    price: 720,
    originalPrice: 900,
    discountPercentage: 20,
    stock: 44,
    rating: 4.87,
    reviewCount: 37,
    badge: { ar: "دروب جديد 🔥", en: "NEW DROP 🔥", type: "crimson" },
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "رمادي حجري معتق", en: "Stone Wash Grey" }, hex: "#52525B" },
      { name: { ar: "زيتوني مغسول", en: "Washed Olive" }, hex: "#3F4F3F" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    variants: [],
  },
  {
    id: "prod-fg-tee-03",
    slug: "fg-micro-metal-badge-tee-bone",
    sku: "FG-TEE-240-BNE",
    name: {
      ar: "تيشرت مونوكروم بشارة معدنية 240 GSM — أوف وايت",
      en: "FG Micro Metal Badge Tee 240 GSM - Bone Off-White",
    },
    category: {
      id: "cat-tees",
      slug: "oversized-tshirts",
      nameAr: "تيشرتات أوفرسايز هيفي ويت",
      nameEn: "Oversized Tees",
    },
    tagline: {
      ar: "شارة معدنية صلبة لشعار FG مثبتة يدوياً على الصدر لمظهر مينيملي فائق الفخامة",
      en: "Hand-riveted custom matte metal FG chest badge with minimalist styling",
    },
    description: {
      ar: "قمة الأناقة الهادئة. تم الاستغناء عن الطباعة واستبدالها بشارة معدنية غير لامعة مقاومة للصدأ مثبتة بإحكام، لتعطي التيشرت حضوراً راقياً يلائم السهرات والستريت وير المعاصر.",
      en: "Quiet luxury executed through streetwear silhouettes. Replaces graphic prints with an understated matte metal emblem riveted onto the left chest.",
    },
    fashionDetails: {
      gsm: "240 GSM Compact Cotton",
      fabric: "100% Egyptian Giza Cotton",
      fit: "Drop-Shoulder Boxy",
      care: "غسيل داخل كيس ملابس لحماية الشارة المعدنية",
      origin: "صنع في المنصورة، مصر",
    },
    price: 690,
    originalPrice: 850,
    discountPercentage: 18,
    stock: 36,
    rating: 4.93,
    reviewCount: 29,
    badge: { ar: "إصدار حصري 👑", en: "EXCLUSIVE 👑", type: "gold" },
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "أوف وايت عاجي", en: "Bone White" }, hex: "#E5E5E5" },
      { name: { ar: "فحم داكن", en: "Charcoal" }, hex: "#1F2937" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    variants: [],
  },
  {
    id: "prod-fg-tee-04",
    slug: "fg-oversized-raw-hem-heavy-tee-sage",
    sku: "FG-TEE-260-SGE",
    name: {
      ar: "تيشرت أوفرسايز بحواف خام 260 GSM — أخضر سيج",
      en: "FG Oversized Raw Hem Heavy Tee 260 GSM - Washed Sage",
    },
    category: {
      id: "cat-tees",
      slug: "oversized-tshirts",
      nameAr: "تيشرتات أوفرسايز هيفي ويت",
      nameEn: "Oversized Tees",
    },
    tagline: {
      ar: "وزن استثنائي 260 GSM مع أطراف خام غير مخيطة محكمة الغلق لمنع التفكك",
      en: "Extra-heavy 260 GSM weight with reinforced raw-cut hem finish",
    },
    description: {
      ar: "خامة فائقة الثقل بوزن 260 GSM تعطي قواماً هندسياً فريداً عند الارتداء. تفاصيل الأطراف الخام تمنح التيشرت طابعاً ديستركتد عصرياً مع ثبات كامل في الغسيل.",
      en: "Substantial 260 GSM combed cotton featuring intentional raw cut lower hems that curl naturally after the first wash while remaining structurally reinforced.",
    },
    fashionDetails: {
      gsm: "260 GSM Ultra Heavy Cotton",
      fabric: "100% Egyptian Combed Cotton",
      fit: "Wide Silhouette",
      care: "غسيل مقلوباً في ماء بارد",
      origin: "صنع في المنصورة، مصر",
    },
    price: 680,
    originalPrice: 850,
    discountPercentage: 20,
    stock: 30,
    rating: 4.82,
    reviewCount: 16,
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أخضر سيج مغسول", en: "Washed Sage" }, hex: "#6B7280" },
      { name: { ar: "أسود فحمي", en: "Obsidian" }, hex: "#111827" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },
  {
    id: "prod-fg-tee-05",
    slug: "fg-monochrome-typography-heavy-tee",
    sku: "FG-TEE-240-TYP",
    name: {
      ar: "تيشرت مونوكروم مطبوع إيديتوريال 240 GSM — أسود وأبيض",
      en: "FG Monochrome Editorial Typography Tee 240 GSM",
    },
    category: {
      id: "cat-tees",
      slug: "oversized-tshirts",
      nameAr: "تيشرتات أوفرسايز هيفي ويت",
      nameEn: "Oversized Tees",
    },
    tagline: {
      ar: "طباعة أمامية وخلفية لكلمات المانيفستو الخاصة بـ FG بخطوط مونوكروم حادة",
      en: "Front & back editorial typography detailing FG Collective Mansoura heritage",
    },
    description: {
      ar: "تصميم يعبر عن هوية البراند وتأسيسه في المنصورة، مصر عام 2026. طباعة سيليكون عالية الكثافة ذات ملمس ثلاثي الأبعاد بارز على ظهر التيشرت.",
      en: "Celebrates FG Collective's origin and design manifesto. Crafted with high-density tactile silicone printing across the shoulders and minimal chest branding.",
    },
    fashionDetails: {
      gsm: "240 GSM Combed Cotton",
      fabric: "100% Egyptian Cotton",
      fit: "Oversized Boxy",
      care: "غسيل مقلوباً • لا تقم بكي الطباعة مباشرة",
      origin: "صنع في المنصورة، مصر",
    },
    price: 660,
    originalPrice: 800,
    discountPercentage: 17,
    stock: 50,
    rating: 4.9,
    reviewCount: 42,
    images: [
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أسود مونوكروم", en: "Monochrome Black" }, hex: "#0F172A" },
      { name: { ar: "أبيض ناصع", en: "Optic White" }, hex: "#FFFFFF" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },

  // ==========================================
  // 3. CARGO & SWEATPANTS (cat-pants)
  // ==========================================
  {
    id: "prod-fg-pants-01",
    slug: "fg-tactical-modular-cargo-pants-black",
    sku: "FG-PNT-CRG-BLK",
    name: {
      ar: "بنطلون كارجو تكتيكي بأشرطة قابلة للتعديل — أسود مطفي",
      en: "FG Tactical Modular Cargo Pants - Matte Black",
    },
    category: {
      id: "cat-pants",
      slug: "cargo-sweatpants",
      nameAr: "بناطيل كارجو وتراكس",
      nameEn: "Cargo Pants",
    },
    tagline: {
      ar: "قماش ريب ستوب تكتيكي مقاوم للتمزق مع 6 جيوب وظيفية وأحزمة جانبية",
      en: "Reinforced tactical ripstop with 6 functional pockets and modular straps",
    },
    description: {
      ar: "التوازن المثالي بين الطابع التكتيكي والراحة اليومية. قماش خفيف وقوي معزز بحلقات معدنية D-Ring وأربطة قابلة للتضييق عند الكاحل للتحكم في وسع البنطلون حسب نوع الحذاء الرياضي.",
      en: "Engineered from ultra-durable cotton-nylon ripstop. Features 6 deep cargo utility compartments, black oxide D-rings, and ankle bungee adjusters for stacking over sneakers.",
    },
    fashionDetails: {
      gsm: "280 GSM Tactical Ripstop",
      fabric: "70% Cotton / 30% Cordura Nylon",
      fit: "Relaxed Tapered with Ankle Bungee",
      care: "غسيل مقلوباً في ماء بارد • لا تستخدم منعم الأقمشة",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1250,
    originalPrice: 1550,
    discountPercentage: 19,
    stock: 35,
    rating: 4.91,
    reviewCount: 33,
    badge: { ar: "الأكثر طلباً 🔥", en: "BESTSELLER 🔥", type: "black" },
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S (30)", "M (32)", "L (34)", "XL (36)"],
    colors: [
      { name: { ar: "أسود مطفي", en: "Matte Black" }, hex: "#18181B" },
      { name: { ar: "زيتوني عسكري", en: "Military Olive" }, hex: "#365314" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    isNewDrop: true,
    isBestSeller: true,
    variants: [],
  },
  {
    id: "prod-fg-pants-02",
    slug: "fg-heavyweight-french-terry-sweatpants-charcoal",
    sku: "FG-PNT-SWT-CHR",
    name: {
      ar: "سويت بانتس قطن مصري ثقيل 380 GSM — فحم داكن",
      en: "FG Heavyweight French Terry Sweatpants 380 GSM - Charcoal",
    },
    category: {
      id: "cat-pants",
      slug: "cargo-sweatpants",
      nameAr: "بناطيل كارجو وتراكس",
      nameEn: "Cargo Pants",
    },
    tagline: {
      ar: "يتناسق بشكل مثالي مع هودي إف جي: قطن مصري 100% مع أربطة خصر سميكة",
      en: "Pairs with the FG Core Hoodie: 100% heavy Egyptian cotton with thick drawcords",
    },
    description: {
      ar: "سويت بانتس مريح وفخم في آن واحد. مصنع من نفس خامة الهودي 380 GSM مع جيوب عميقة مزودة بسحابات مخفية لحماية الهاتف والمحفظة، وقصة مستقيمة منسدلة بأناقة.",
      en: "Crafted to match our heavy hoodies seamlessly. Features concealed zipped side pockets, thick cotton braided drawcords with matte tips, and an open straight leg hem.",
    },
    fashionDetails: {
      gsm: "380 GSM Heavy French Terry",
      fabric: "100% Egyptian Long-Staple Cotton",
      fit: "Straight Relaxed Baggy Fit",
      care: "غسيل مقلوباً في ماء بارد",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1090,
    originalPrice: 1350,
    discountPercentage: 19,
    stock: 40,
    rating: 4.88,
    reviewCount: 28,
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "فحم حجري", en: "Charcoal" }, hex: "#27272A" },
      { name: { ar: "أسود كربوني", en: "Carbon Black" }, hex: "#09090B" },
      { name: { ar: "رمادي ميلانج", en: "Heather Grey" }, hex: "#71717A" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    variants: [],
  },
  {
    id: "prod-fg-pants-03",
    slug: "fg-wide-leg-pleated-street-trouser-taupe",
    sku: "FG-PNT-TR-TPE",
    name: {
      ar: "بنطلون ستريت وير واسع بكسرات أمامية — رمادي بيج داكن",
      en: "FG Wide-Leg Pleated Streetwear Trouser - Deep Taupe",
    },
    category: {
      id: "cat-pants",
      slug: "cargo-sweatpants",
      nameAr: "بناطيل كارجو وتراكس",
      nameEn: "Cargo Pants",
    },
    tagline: {
      ar: "تصميم هجين يجمع بين الفخامة الكلاسيكية وقصات الشارع الواسعة",
      en: "Sartorial tailoring merged with contemporary streetwear wide silhouettes",
    },
    description: {
      ar: "بنطلون ذو كسرات أمامية مزدوجة يمنحك انسيابية فائقة أثناء الحركة. قماش تويل ناعم ومقاوم للتجعد مع حزام خصر داخلي مطاطي خفي لمزيد من الراحة.",
      en: "Double front pleats that drape cleanly over chunky sneakers or loafers. Heavy crease-resistant twill construction with a partially hidden elastic waistband.",
    },
    fashionDetails: {
      gsm: "300 GSM Heavy Poly-Viscose Twill",
      fabric: "Tailored Premium Blend",
      fit: "Wide-Leg Flowing Drape",
      care: "تنظيف جاف أو غسيل بارد لطيف",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1350,
    originalPrice: 1650,
    discountPercentage: 18,
    stock: 20,
    rating: 4.94,
    reviewCount: 22,
    badge: { ar: "إصدار حصري 👑", en: "EXCLUSIVE 👑", type: "gold" },
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: { ar: "بيج توب داكن", en: "Deep Taupe" }, hex: "#57534E" },
      { name: { ar: "أسود فاخر", en: "Luxe Black" }, hex: "#1C1917" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },
  {
    id: "prod-fg-pants-04",
    slug: "fg-parachute-nylon-trackpants-reflective",
    sku: "FG-PNT-NYL-RFL",
    name: {
      ar: "بنطلون باراشوت نايلون عاكس للضوء — أسود عاكس",
      en: "FG Parachute Nylon Trackpants - Reflective Obsidian",
    },
    category: {
      id: "cat-pants",
      slug: "cargo-sweatpants",
      nameAr: "بناطيل كارجو وتراكس",
      nameEn: "Cargo Pants",
    },
    tagline: {
      ar: "نايلون مجعد فائق الخفة ومقاوم للمياه مع خطوط عاكسة 3M عند الركبة",
      en: "Ultra-light crinkle nylon with waterproof finish and 3M reflective accents",
    },
    description: {
      ar: "مستوحى من أزياء الشارع التكنولوجية (Techwear). قماش نايلون خفيف بصوت هادئ ومقاومة كاملة لرذاذ الماء، مع أربطة مطاطية مزدوجة عند الخصر والرجلين للتحكم في الشكل.",
      en: "Inspired by modern technical utility. Lightweight crinkle nylon shell with breathable mesh lining and 3M reflective micro piping that illuminates under flash.",
    },
    fashionDetails: {
      gsm: "180 GSM Crinkle Nylon Shell",
      fabric: "100% Water-Repellent Nylon",
      fit: "Voluminous Parachute Fit",
      care: "غسيل بارد سريع • لا تقم بالكي",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1150,
    originalPrice: 1400,
    discountPercentage: 18,
    stock: 25,
    rating: 4.81,
    reviewCount: 17,
    images: [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "أسود عاكس", en: "Reflective Black" }, hex: "#18181B" },
      { name: { ar: "فضي جليدي", en: "Ice Silver" }, hex: "#94A3B8" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },
  {
    id: "prod-fg-pants-05",
    slug: "fg-denim-loose-fit-jeans-washed-black",
    sku: "FG-PNT-DNM-WSH",
    name: {
      ar: "بنطلون جينز واسع مغسول يدوي 14.5 أونصة — أسود باهت",
      en: "FG Heavy Loose-Fit Denim 14.5oz - Washed Black",
    },
    category: {
      id: "cat-pants",
      slug: "cargo-sweatpants",
      nameAr: "بناطيل كارجو وتراكس",
      nameEn: "Cargo Pants",
    },
    tagline: {
      ar: "جينز قطني ثقيل 14.5 أونصة بدون ليكرا بقصة مستقيمة فضفاضة",
      en: "Rigid 14.5oz raw-feel denim with zero stretch and authentic baggy drape",
    },
    description: {
      ar: "جينز أصيل مصنوع من قماش الدنيم المصري المتين غير المطاط. تمت معالجته بحجر الخفاف ليعطي تأثيراً كلاسيكياً يزداد جمالاً مع كل ارتداء وغسيل.",
      en: "Constructed from 100% rigid Egyptian denim cotton. Heavy 14.5oz fabric weight ensures the wide leg stacks naturally over your footwear.",
    },
    fashionDetails: {
      gsm: "14.5 oz Heavy Denim",
      fabric: "100% Rigid Egyptian Cotton Denim",
      fit: "Loose Baggy Skate Fit",
      care: "غسيل مقلوباً في ماء بارد كل 4-6 أسابيع للحفاظ على اللون",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1390,
    originalPrice: 1700,
    discountPercentage: 18,
    stock: 22,
    rating: 4.89,
    reviewCount: 25,
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["30", "32", "34", "36"],
    colors: [
      { name: { ar: "أسود مغسول", en: "Washed Black" }, hex: "#3F3F46" },
      { name: { ar: "أزرق ثلجي معتق", en: "Vintage Ice Blue" }, hex: "#60A5FA" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },

  // ==========================================
  // 4. JACKETS & OUTERWEAR (cat-outerwear)
  // ==========================================
  {
    id: "prod-fg-outer-01",
    slug: "fg-heavyweight-wool-varsity-jacket-black-cream",
    sku: "FG-OUT-VAR-BLK",
    name: {
      ar: "جاكيت فارسيتي صوف وجلد ثقيل — أسود وكريمي",
      en: "FG Heavyweight Wool Varsity Jacket - Black & Cream",
    },
    category: {
      id: "cat-outerwear",
      slug: "jackets-outerwear",
      nameAr: "جاكيتات ومعاطف وسترات",
      nameEn: "Jackets & Outerwear",
    },
    tagline: {
      ar: "جسم من الصوف الطبيعي الثقيل مع أكمام جلدية ناعمة وتطريز شينيل لشعار FG",
      en: "Heavy Melton wool body with vegan grain leather sleeves and chenille FG patch",
    },
    description: {
      ar: "القطعة الاستعراضية الأهم في تشكيلة الشتاء. يجمع بين التراث الرياضي والفخامة الحضرية. مبطن بالساتان الحريري مع شارة شينيل بارزة على الصدر وأزرار معدنية سوداء غير لامعة.",
      en: "The centerpiece of our winter drop. High-density Melton wool paired with supple grained leather sleeves, diamond-quilted satin lining, and custom-embossed snap buttons.",
    },
    fashionDetails: {
      gsm: "550 GSM Melton Wool & Leather",
      fabric: "Natural Wool Blend / Vegan Leather",
      fit: "Boxy Relaxed Bomber Cut",
      care: "تنظيف جاف حصرياً (Dry Clean Only)",
      origin: "صنع في المنصورة، مصر",
    },
    price: 2450,
    originalPrice: 2950,
    discountPercentage: 17,
    stock: 14,
    rating: 4.99,
    reviewCount: 36,
    badge: { ar: "قطعة الموسم 👑", en: "GRAIL PIECE 👑", type: "gold" },
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["M", "L", "XL"],
    colors: [
      { name: { ar: "أسود وكريمي", en: "Black / Cream" }, hex: "#18181B" },
      { name: { ar: "أخضر داكن وعاجي", en: "Dark Green / Bone" }, hex: "#064E3B" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    isNewDrop: true,
    isBestSeller: true,
    variants: [],
  },
  {
    id: "prod-fg-outer-02",
    slug: "fg-sherpa-collar-heavy-denim-jacket",
    sku: "FG-OUT-SHR-BLK",
    name: {
      ar: "جاكيت جينز شيربا مبطن صوف — أسود معتق",
      en: "FG Sherpa Collar Heavy Denim Jacket - Washed Black",
    },
    category: {
      id: "cat-outerwear",
      slug: "jackets-outerwear",
      nameAr: "جاكيتات ومعاطف وسترات",
      nameEn: "Jackets & Outerwear",
    },
    tagline: {
      ar: "جينز مصري متين 14 أونصة مبطن بياقة صوف شيربا عاجي لمقاومة أبرد الليالي",
      en: "Heavyweight 14oz denim fully insulated with warm cream sherpa fleece",
    },
    description: {
      ar: "جاكيت شتوي أيقوني يجمع بين المظهر القوي والدفء الفائق. أزرار برونزية معتقة محفورة، وجيبين أماميين واسعين مع بطانة ناعمة ومريحة في الأكمام.",
      en: "Rugged exterior meets sumptuous comfort. Built with thick washed denim and a dense sherpa body lining, completed with custom antique brass button hardware.",
    },
    fashionDetails: {
      gsm: "14oz Egyptian Denim + Sherpa",
      fabric: "100% Cotton Outer / Wool-Poly Sherpa Lining",
      fit: "Classic Regular Boxy Fit",
      care: "غسيل بارد لطيف • تجفيف هوائي",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1980,
    originalPrice: 2350,
    discountPercentage: 16,
    stock: 18,
    rating: 4.92,
    reviewCount: 27,
    badge: { ar: "الأكثر طلباً 🔥", en: "BESTSELLER 🔥", type: "black" },
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "أسود مغسول", en: "Washed Black" }, hex: "#27272A" },
      { name: { ar: "أزرق داكن كلاسيكي", en: "Indigo Raw" }, hex: "#1E3A8A" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    variants: [],
  },
  {
    id: "prod-fg-outer-03",
    slug: "fg-tactical-ripstop-bomber-jacket-olive",
    sku: "FG-OUT-BMB-OLV",
    name: {
      ar: "جاكيت بومبر تكتيكي ريب ستوب — أخضر زيتوني",
      en: "FG Tactical Ripstop Bomber Jacket - Olive Drab",
    },
    category: {
      id: "cat-outerwear",
      slug: "jackets-outerwear",
      nameAr: "جاكيتات ومعاطف وسترات",
      nameEn: "Jackets & Outerwear",
    },
    tagline: {
      ar: "سحاب مزدوج مع جيب طيران كلاسيكي على الذراع وشارة FG المطاطية",
      en: "Two-way heavy front zipper with signature arm flight utility pocket",
    },
    description: {
      ar: "تعديل معاصر لجاكيتات الطيران الكلاسيكية MA-1. مادة عازلة خفيفة الوزن ومقاومة للرياح، مع ياقة مضلعة منسوجة بإحكام وشارة FG المصنوعة من السيليكون عالي الكثافة على الذراع الأيسر.",
      en: "A sleek modern rethink of the classic MA-1 silhouette. Wind-blocking nylon construction with lightweight quilted insulation and signature FG sleeve badge.",
    },
    fashionDetails: {
      gsm: "220 GSM Flight Nylon",
      fabric: "Water-Resistant Technical Nylon",
      fit: "Slightly Cropped Boxy Cut",
      care: "غسيل بارد لطيف",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1850,
    originalPrice: 2200,
    discountPercentage: 16,
    stock: 24,
    rating: 4.86,
    reviewCount: 20,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["M", "L", "XL", "XXL"],
    colors: [
      { name: { ar: "أخضر زيتوني", en: "Olive Drab" }, hex: "#3F4F3F" },
      { name: { ar: "أسود أوبسيديان", en: "Obsidian" }, hex: "#0F172A" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },
  {
    id: "prod-fg-outer-04",
    slug: "fg-quilted-puffer-vest-metallic-black",
    sku: "FG-OUT-VST-BLK",
    name: {
      ar: "جيليه بافر منفوخ عازل للحرارة — أسود لامع مطفي",
      en: "FG Quilted Puffer Vest - Matte Black",
    },
    category: {
      id: "cat-outerwear",
      slug: "jackets-outerwear",
      nameAr: "جاكيتات ومعاطف وسترات",
      nameEn: "Jackets & Outerwear",
    },
    tagline: {
      ar: "عزل حراري خفيف الوزن مثالي للارتداء فوق هوديز وتيشرتات FG الثقيلة",
      en: "Thermal featherlight insulation designed to layer over heavy hoodies",
    },
    description: {
      ar: "الجيليه الأنسب لتنسيقات الـ Layering في الخريف والشتاء. ياقة قائمة مبطنة لحماية الرقبة من الهواء البارد مع جيوب مبطنة بالصوف لتدفئة اليدين وسحاب سميك غير لامع.",
      en: "The ultimate layering essential. Sits comfortably over our 380 GSM hoodies, featuring fleece-lined handwarmer pockets and an internal zipped phone stash.",
    },
    fashionDetails: {
      gsm: "350g Eco-Down Fill",
      fabric: "Water-Repellent Matte Micro-Polyester",
      fit: "Relaxed Layering Fit",
      care: "غسيل آلي لطيف بماء بارد",
      origin: "صنع في المنصورة، مصر",
    },
    price: 1450,
    originalPrice: 1750,
    discountPercentage: 17,
    stock: 30,
    rating: 4.84,
    reviewCount: 15,
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: { ar: "أسود مطفي", en: "Matte Black" }, hex: "#18181B" },
      { name: { ar: "بيج رملي", en: "Sand Tan" }, hex: "#D6D3D1" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },

  // ==========================================
  // 5. CAPS & ACCESSORIES (cat-accessories)
  // ==========================================
  {
    id: "prod-fg-acc-01",
    slug: "fg-3d-embroidered-cotton-dad-cap-obsidian",
    sku: "FG-ACC-CAP-BLK",
    name: {
      ar: "كاب قطني مغسول بتطريز بارز 3D — أسود أوبسيديان",
      en: "FG 3D Embroidered Heavy Cotton Dad Cap - Obsidian Black",
    },
    category: {
      id: "cat-accessories",
      slug: "caps-accessories",
      nameAr: "إكسسوارات وكابات وحقائب",
      nameEn: "Caps & Accessories",
    },
    tagline: {
      ar: "قماش قطن مصري 100% مغسول بأنزيمات التعتيق مع مشبك معدني منقوش",
      en: "100% enzyme-washed cotton with custom engraved metal buckle strapback",
    },
    description: {
      ar: "كاب كلاسيكي بـ 6 ألواح وقناع منحني يمنحك الشكل المثالي من أول ارتداء. تطريز بارز ثلاثي الأبعاد لشعار FG على المقدمة، مع شريط خلفي من القماش ومشبك معدني محفور.",
      en: "The essential 6-panel unstructured strapback cap. Treated with an enzyme wash for that lived-in feel, finished with high-density 3D tonal embroidery and engraved brass hardware.",
    },
    fashionDetails: {
      gsm: "320 GSM Chino Cotton",
      fabric: "100% Egyptian Chino Twill",
      fit: "Adjustable Strapback (One Size)",
      care: "تنظيف موضعي بقطعة قماش مبللة",
      origin: "صنع في المنصورة، مصر",
    },
    price: 450,
    originalPrice: 550,
    discountPercentage: 18,
    stock: 65,
    rating: 4.95,
    reviewCount: 52,
    badge: { ar: "الأكثر طلباً 🔥", en: "BESTSELLER 🔥", type: "black" },
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1572495532056-85e3a4965520?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["One Size"],
    colors: [
      { name: { ar: "أسود أوبسيديان", en: "Obsidian Black" }, hex: "#0A0A0A" },
      { name: { ar: "رمادي حجري", en: "Washed Slate" }, hex: "#52525B" },
      { name: { ar: "أوف وايت كريمي", en: "Cream Bone" }, hex: "#F5F5F4" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    isNewDrop: true,
    isBestSeller: true,
    variants: [],
  },
  {
    id: "prod-fg-acc-02",
    slug: "fg-cordura-tactical-crossbody-chest-bag",
    sku: "FG-ACC-BAG-BLK",
    name: {
      ar: "حقيبة كروس بودي تكتيكية كوردورا — أسود مضاد للماء",
      en: "FG Cordura Tactical Crossbody Bag - Waterproof Black",
    },
    category: {
      id: "cat-accessories",
      slug: "caps-accessories",
      nameAr: "إكسسوارات وكابات وحقائب",
      nameEn: "Caps & Accessories",
    },
    tagline: {
      ar: "قماش كوردورا 500D عسكري مقاوم للتمزق والماء مع سحابات YKK محكمة",
      en: "Ballistic 500D Cordura nylon with weather-sealed YKK zips and Cobra buckle",
    },
    description: {
      ar: "حقيبة يومية متعددة الجيوب مصممة لحمل هاتفك ومحفظتك ونظاراتك ومقتنياتك اليومية بأمان كامل وأناقة ستريت متناهية. حزام كتف نايلون سميك مع مشبك كوبر تكتيكي سريع الفتح.",
      en: "Engineered for urban utility. Built from ballistic 500D Cordura with water-repellent coating, heavy nylon seatbelt webbing strap, and an engraved quick-release tactical buckle.",
    },
    fashionDetails: {
      gsm: "500D Ballistic Cordura",
      fabric: "100% Military-Grade Nylon",
      fit: "Adjustable Crossbody / Chest Rig",
      care: "مسح بقطعة قماش مبللة",
      origin: "صنع في المنصورة، مصر",
    },
    price: 780,
    originalPrice: 950,
    discountPercentage: 18,
    stock: 35,
    rating: 4.91,
    reviewCount: 38,
    badge: { ar: "دروب جديد 🔥", en: "NEW DROP 🔥", type: "crimson" },
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["One Size (22 x 16 x 6 cm)"],
    colors: [
      { name: { ar: "أسود تكتيكي", en: "Tactical Black" }, hex: "#18181B" },
      { name: { ar: "رمادي معدني", en: "Gunmetal" }, hex: "#4B5563" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    variants: [],
  },
  {
    id: "prod-fg-acc-03",
    slug: "fg-heavy-ribbed-beanie-metal-monogram-crest",
    sku: "FG-ACC-BNE-BLK",
    name: {
      ar: "طاقية بيني مضلعة بشعار FG المعدني — أسود فاحم",
      en: "FG Heavy Ribbed Beanie with Metal Monogram Crest - Jet Black",
    },
    category: {
      id: "cat-accessories",
      slug: "caps-accessories",
      nameAr: "إكسسوارات وكابات وحقائب",
      nameEn: "Caps & Accessories",
    },
    tagline: {
      ar: "صوف أكريليك دافئ فائق المرونة مع لوجو FG المعدني المصمت باللون الفضي",
      en: "Heavy-ribbed knit construction with custom solid metal FG crest",
    },
    description: {
      ar: "بيني كلاسيكي مضلع بحافة مطوية عريضة. شارة مونوغرام FG المعدنية مثبتة في المنتصف لتمنحه مظهراً راقياً ومميزاً في الأيام الباردة.",
      en: "A heavyweight cold-weather essential. Deep rib knit ensures comfortable elasticity without pressure, crowned with our solid metal monogram emblem.",
    },
    fashionDetails: {
      gsm: "Double-Layer Rib Knit",
      fabric: "Cashmere-Feel Heavy Knit",
      fit: "Folded Cuff Stretch Fit (One Size)",
      care: "غسيل يدوي بماء بارد",
      origin: "صنع في المنصورة، مصر",
    },
    price: 390,
    originalPrice: 480,
    discountPercentage: 19,
    stock: 50,
    rating: 4.88,
    reviewCount: 30,
    images: [
      "https://images.unsplash.com/photo-1572495532056-85e3a4965520?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["One Size"],
    colors: [
      { name: { ar: "أسود فاحم", en: "Jet Black" }, hex: "#0A0A0A" },
      { name: { ar: "رمادي ميلانج", en: "Melange Grey" }, hex: "#6B7280" },
      { name: { ar: "بيج شوفان", en: "Oatmeal" }, hex: "#E5E5E5" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    variants: [],
  },
  {
    id: "prod-fg-acc-04",
    slug: "fg-stainless-steel-monogram-cuban-chain",
    sku: "FG-ACC-CHN-SLV",
    name: {
      ar: "سلسلة كوبان ستانلس ستيل مع دلاية FG — فضي مطفي",
      en: "FG Stainless Steel Cuban Chain with Monogram - Matte Silver",
    },
    category: {
      id: "cat-accessories",
      slug: "caps-accessories",
      nameAr: "إكسسوارات وكابات وحقائب",
      nameEn: "Caps & Accessories",
    },
    tagline: {
      ar: "ستانلس ستيل طبي 316L لا يصدأ ولا يتغير لونه مع الماء والعطور",
      en: "Surgical-grade 316L stainless steel chain with custom interlocking FG pendant",
    },
    description: {
      ar: "سلسلة كوبان بعرض 6 مم مصنوعة من الستانلس ستيل 316L فائق المتانة المقاوم للماء والتآكل وتغير الألوان. دلاية مونوغرام FG محفورة بدقة بالليزر مع قفل لوبستر متين.",
      en: "Crafted from solid 316L marine-grade stainless steel that will never tarnish, rust, or turn green. Features a 6mm bevelled Cuban link chain with custom interlocking FG pendant.",
    },
    fashionDetails: {
      gsm: "6mm Heavy Cuban Links (55 cm)",
      fabric: "316L Surgical Stainless Steel",
      fit: "55 cm Length / 6mm Width",
      care: "مقاوم للماء والعطور تماماً",
      origin: "تصميم FG في مصر",
    },
    price: 590,
    originalPrice: 750,
    discountPercentage: 21,
    stock: 40,
    rating: 4.97,
    reviewCount: 45,
    badge: { ar: "إصدار حصري 👑", en: "EXCLUSIVE 👑", type: "gold" },
    images: [
      "https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1200&auto=format&fit=crop",
    ],
    sizes: ["55 cm"],
    colors: [
      { name: { ar: "فضي مطفي", en: "Matte Silver" }, hex: "#D4D4D8" },
      { name: { ar: "أسود كربوني", en: "PVD Black" }, hex: "#18181B" },
    ],
    collectionSlug: "drop-01-monochrome",
    dropStatus: "available",
    isFeatured: true,
    variants: [],
  },
];
