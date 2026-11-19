import { Category, Product, ProductReview } from "@/types/product";
import { Customer } from "@/types/customer";
import { Order } from "@/types/order";
import { InventoryItem } from "@/types/inventory";
import { Coupon } from "@/types/coupon";
import { SystemNotification } from "@/types/notification";
import { AnalyticsSummary } from "@/types/analytics";

// ==========================================
// 1. CATEGORIES MOCK DATA
// ==========================================
export const MOCK_CATEGORIES: Category[] = [
  {
    id: "cat-hoodies",
    slug: "hoodies-sweats",
    name: {
      ar: "هوديز وسويت شيرتات ثقيلة",
      en: "Heavyweight Hoodies & Sweats",
    },
    description: {
      ar: "هوديز قطن مصري 100% هيفي ويت 380 GSM بقصات دروب شولدر وألوان حصرية",
      en: "380 GSM Heavy French Terry drop-shoulder hoodies with minimal monogram details",
    },
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
    itemCount: 8,
  },
  {
    id: "cat-tees",
    slug: "oversized-tshirts",
    name: {
      ar: "تيشرتات أوفرسايز هيفي ويت",
      en: "Oversized & Boxy Tees",
    },
    description: {
      ar: "تيشرتات قطنية بوزن 240-260 GSM وياقة متماسكة لا تنكمش مع طباعة عالية الكثافة",
      en: "240-260 GSM structured heavyweight combed cotton tees with thick ribbed collars",
    },
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    itemCount: 12,
  },
  {
    id: "cat-pants",
    slug: "cargo-sweatpants",
    name: {
      ar: "بناطيل كارجو وميلتون مريح",
      en: "Cargo Pants & Relaxed Sweats",
    },
    description: {
      ar: "بناطيل كارجو تكتيكية متعددة الجيوب وبناطيل سويت بانتس مريحة بتطريز FG",
      en: "Multi-pocket tactical ripstop cargo and relaxed wide-leg French Terry sweatpants",
    },
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
    itemCount: 6,
  },
  {
    id: "cat-outerwear",
    slug: "jackets-outerwear",
    name: {
      ar: "جاكيتات ومعاطف وسترات",
      en: "Jackets & Technical Outerwear",
    },
    description: {
      ar: "جاكيتات بومبر مزدوجة الوجهين ومقاومة للطقس مع سحابات معدنية فخمة",
      en: "Reversible flight bombers and weather-resistant technical jackets with FG metal hardware",
    },
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
    itemCount: 5,
  },
  {
    id: "cat-accessories",
    slug: "caps-accessories",
    name: {
      ar: "إكسسوارات وكابات فاخرة",
      en: "Caps, Bags & Accessories",
    },
    description: {
      ar: "كابات قطن مغسول، حقائب تكتيكية، وسلاسل مفاتيح بشعار FG المعدني",
      en: "Enzyme washed dad caps, Cordura crossbody bags, and matte metal monogram accessories",
    },
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
    itemCount: 7,
  },
];

// ==========================================
// 2. PRODUCTS MOCK DATA
// ==========================================
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-fg-hoodie-01",
    slug: "fg-core-heavyweight-hoodie-obsidian",
    name: {
      ar: "هودي إف جي الثقيل 380 GSM — أسود أوبسيديان",
      en: "FG Core Heavyweight Hoodie 380 GSM - Obsidian Black",
    },
    shortDescription: {
      ar: "الأيقونة الأساسية للبراند: قطن مصري 100% ثقيل مع ياقة مزدوجة وقصة دروب شولدر",
      en: "The brand signature: 100% heavyweight Egyptian cotton with double-layered hood",
    },
    fullDescription: {
      ar: "تمت صياغة هذا الهودي من خامة الفرنش تيري المصرية فائقة النعومة بوزن 380 جرام للمتر المربع. يتميز بياقة مزدوجة تقف بانتظام دون الحاجة لأربطة، مع جيب كنغر خفي وتطريز مونوغرام FG خفيف باللون الأسود على الصدر.",
      en: "Engineered from ultra-dense 380 GSM 100% Egyptian cotton French Terry. Featuring a double-layered structured hood with no drawstrings for a minimal aesthetic, hidden kangaroo pocket, and tonal micro-embroidery.",
    },
    categoryId: "cat-hoodies",
    categoryName: {
      ar: "هوديز وسويت شيرتات ثقيلة",
      en: "Heavyweight Hoodies & Sweats",
    },
    price: 1350,
    originalPrice: 1650,
    discountPercentage: 18,
    stock: 45,
    sku: "FG-HD-380-BLK",
    images: [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.95,
    reviewCount: 38,
    specifications: {
      gsm: { ar: "380 GSM فرنش تيري ثقيل", en: "380 GSM Heavy French Terry" },
      fabric: { ar: "100% قطن مصري ممشط طويل التيلة", en: "100% Long-Staple Combed Egyptian Cotton" },
      fit: { ar: "أوفرسايز دروب شولدر واسع", en: "Oversized Relaxed Drop Shoulder" },
      care: { ar: "غسيل مقلوباً بماء بارد (30°C) • تجفيف طبيعي", en: "Machine wash cold inside out • Line dry" },
      origin: { ar: "صنع في مصر", en: "Crafted in Egypt" },
    },
    variants: [
      { id: "v1-1", name: { ar: "أسود / S", en: "Black / S" }, sku: "FG-HD-BLK-S", price: 1350, stock: 8 },
      { id: "v1-2", name: { ar: "أسود / M", en: "Black / M" }, sku: "FG-HD-BLK-M", price: 1350, stock: 12 },
      { id: "v1-3", name: { ar: "أسود / L", en: "Black / L" }, sku: "FG-HD-BLK-L", price: 1350, stock: 15 },
      { id: "v1-4", name: { ar: "أسود / XL", en: "Black / XL" }, sku: "FG-HD-BLK-XL", price: 1350, stock: 7 },
      { id: "v1-5", name: { ar: "أسود / XXL", en: "Black / XXL" }, sku: "FG-HD-BLK-XXL", price: 1350, stock: 3 },
    ],
    createdAt: "2026-10-01T10:00:00Z",
  },
  {
    id: "prod-fg-tee-02",
    slug: "fg-monogram-acid-wash-tee-charcoal",
    name: {
      ar: "تيشرت إف جي مونوغرام معتق (Acid-Wash) — شاركول",
      en: "FG Monogram Acid-Wash Oversized Tee - Vintage Charcoal",
    },
    shortDescription: {
      ar: "غسيل معتق فنتج مع لوجو FG كبير عالي الكثافة على الظهر وقصة بوكسي",
      en: "Vintage mineral wash with high-density FG back monogram print and boxy cut",
    },
    fullDescription: {
      ar: "تيشرت قطن ثقيل بوزن 240 جرام خضع لعملية غسيل حمضي يدوية خاصة تعطي كل قطعة شخصية فريدة. ياقة سميكة ومحبوكة 3.5 سم تدوم طويلاً دون أن تتسع.",
      en: "Heavyweight 240 GSM tee treated with custom mineral acid wash. Reinforced 3.5cm thick ribbed collar that holds shape permanently, and boxy drop shoulders.",
    },
    categoryId: "cat-tees",
    categoryName: {
      ar: "تيشرتات أوفرسايز هيفي ويت",
      en: "Oversized & Boxy Tees",
    },
    price: 680,
    originalPrice: 850,
    discountPercentage: 20,
    stock: 60,
    sku: "FG-TS-240-ACD",
    images: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.88,
    reviewCount: 42,
    specifications: {
      gsm: { ar: "240 GSM سنجل جيرسي ثقيل", en: "240 GSM Heavy Single Jersey" },
      fabric: { ar: "100% قطن ممشط عالي النعومة", en: "100% Combed Cotton" },
      fit: { ar: "بوكسي ستريت وير مع ياقة سميكة", en: "Boxy Streetwear with Bound Collar" },
      care: { ar: "غسيل مقلوباً بماء بارد • لا تكوي فوق الطباعة", en: "Wash cold inside out • Do not iron on print" },
      origin: { ar: "صنع في مصر", en: "Crafted in Egypt" },
    },
    variants: [
      { id: "v2-1", name: { ar: "شاركول / S", en: "Charcoal / S" }, sku: "FG-TS-ACD-S", price: 680, stock: 10 },
      { id: "v2-2", name: { ar: "شاركول / M", en: "Charcoal / M" }, sku: "FG-TS-ACD-M", price: 680, stock: 15 },
      { id: "v2-3", name: { ar: "شاركول / L", en: "Charcoal / L" }, sku: "FG-TS-ACD-L", price: 680, stock: 20 },
      { id: "v2-4", name: { ar: "شاركول / XL", en: "Charcoal / XL" }, sku: "FG-TS-ACD-XL", price: 680, stock: 10 },
      { id: "v2-5", name: { ar: "شاركول / XXL", en: "Charcoal / XXL" }, sku: "FG-TS-ACD-XXL", price: 680, stock: 5 },
    ],
    createdAt: "2026-10-05T12:00:00Z",
  },
  {
    id: "prod-fg-cargo-03",
    slug: "fg-tactical-multi-pocket-cargo-black",
    name: {
      ar: "بنطلون كارجو تكتيكي متعدد الجيوب — أسود مطفي",
      en: "FG Tactical Multi-Pocket Cargo Pants - Matte Black",
    },
    shortDescription: {
      ar: "قماش ريبستوب متين مضاد للتمزق مع 6 جيوب وظيفية وأربطة كاحل قابلة للتعديل",
      en: "Heavyweight ripstop cotton with 6 utility pockets and adjustable ankle bungee cords",
    },
    fullDescription: {
      ar: "بنطلون كارجو يجمع بين الطابع العسكري التكتيكي والراحة العصرية. مزود بجيوب ثلاثية الأبعاد بسحابات مخفية وأربطة مطاطية لتعديل الاتساع عند الحذاء.",
      en: "Combining tactical techwear with modern streetwear silhouette. Built from durable ripstop cotton with 3D gusseted pockets and ankle toggles.",
    },
    categoryId: "cat-pants",
    categoryName: {
      ar: "بناطيل كارجو وميلتون مريح",
      en: "Cargo Pants & Relaxed Sweats",
    },
    price: 1150,
    originalPrice: 1400,
    discountPercentage: 17,
    stock: 28,
    sku: "FG-CG-500-BLK",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.9,
    reviewCount: 26,
    specifications: {
      gsm: { ar: "320 GSM ريبستوب تكتيكي", en: "320 GSM Tactical Ripstop" },
      fabric: { ar: "97% قطن / 3% سباندكس لمرونة الحركة", en: "97% Cotton / 3% Spandex Comfort Stretch" },
      fit: { ar: "قصة مريحة مع تضييق تدريجي للكاحل", en: "Relaxed Tapered Silhouette" },
      care: { ar: "غسيل آلي بارد • تجفيف بدرجة حرارة منخفضة", en: "Machine wash cold • Tumble dry low" },
      origin: { ar: "صنع في مصر", en: "Crafted in Egypt" },
    },
    variants: [
      { id: "v3-1", name: { ar: "أسود / S", en: "Black / S" }, sku: "FG-CG-BLK-S", price: 1150, stock: 5 },
      { id: "v3-2", name: { ar: "أسود / M", en: "Black / M" }, sku: "FG-CG-BLK-M", price: 1150, stock: 8 },
      { id: "v3-3", name: { ar: "أسود / L", en: "Black / L" }, sku: "FG-CG-BLK-L", price: 1150, stock: 9 },
      { id: "v3-4", name: { ar: "أسود / XL", en: "Black / XL" }, sku: "FG-CG-BLK-XL", price: 1150, stock: 4 },
      { id: "v3-5", name: { ar: "أسود / XXL", en: "Black / XXL" }, sku: "FG-CG-BLK-XXL", price: 1150, stock: 2 },
    ],
    createdAt: "2026-10-10T14:00:00Z",
  },
  {
    id: "prod-fg-jacket-04",
    slug: "fg-reversible-bomber-jacket-onyx",
    name: {
      ar: "جاكيت بومبر مزدوج الوجهين — أونيكس / برتقالي ستريت",
      en: "FG Reversible Bomber Jacket - Onyx Black / Safety Orange",
    },
    shortDescription: {
      ar: "تصميم طيارين كلاسيكي مع وجه أسود فاخر مطرز ووجه داخلي برتقالي جريء",
      en: "Classic MA-1 flight silhouette with luxury embroidered matte black face and bold safety orange reverse",
    },
    fullDescription: {
      ar: "جاكيت بومبر بوجهين يمنحك خيارين في قطعة واحدة. نايلون طيارين كثيف مقاوم للرياح ورذاذ الماء، مع حشوة عزل حراري خفيفة وسحاب معدني FG فخم يدور للجهتين.",
      en: "Two statement jackets in one. Weather-resistant flight nylon with lightweight thermal insulation and a heavy-gauge dual-rotation metal zipper pull.",
    },
    categoryId: "cat-outerwear",
    categoryName: {
      ar: "جاكيتات ومعاطف وسترات",
      en: "Jackets & Technical Outerwear",
    },
    price: 1850,
    originalPrice: 2200,
    discountPercentage: 15,
    stock: 20,
    sku: "FG-JK-600-ONX",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: true,
    rating: 5.0,
    reviewCount: 19,
    specifications: {
      gsm: { ar: "نايلون عالي الكثافة مقاوم للرياح", en: "High-Density Windproof Flight Nylon" },
      fabric: { ar: "100% بولياميد مع حشوة عزل خفيفة", en: "100% Polyamide Shell with Poly Fill" },
      fit: { ar: "قصة بومبر طيارين واسعة قليلاً", en: "Relaxed Flight Bomber Cut" },
      care: { ar: "تنظيف جاف يفضل • أو غسيل بارد يدوي", en: "Dry clean recommended or hand wash cold" },
      origin: { ar: "صنع في مصر", en: "Crafted in Egypt" },
    },
    variants: [
      { id: "v4-1", name: { ar: "أسود / M", en: "Black / M" }, sku: "FG-JK-ONX-M", price: 1850, stock: 5 },
      { id: "v4-2", name: { ar: "أسود / L", en: "Black / L" }, sku: "FG-JK-ONX-L", price: 1850, stock: 8 },
      { id: "v4-3", name: { ar: "أسود / XL", en: "Black / XL" }, sku: "FG-JK-ONX-XL", price: 1850, stock: 5 },
      { id: "v4-4", name: { ar: "أسود / XXL", en: "Black / XXL" }, sku: "FG-JK-ONX-XXL", price: 1850, stock: 2 },
    ],
    createdAt: "2026-10-15T09:00:00Z",
  },
  {
    id: "prod-fg-tee-06",
    slug: "fg-boxy-fit-heavyweight-tee-optic-white",
    name: {
      ar: "تيشرت إف جي بوكسي ثقيل 260 GSM — أبيض ناصع",
      en: "FG Boxy Fit Heavyweight Tee 260 GSM - Optic White",
    },
    shortDescription: {
      ar: "التيشرت الأبيض المثالي: نسيج قطني كثيف لا يشف إطلاقاً مع ياقة مضلعة متماسكة",
      en: "The definitive white tee: high-density zero-sheerness cotton with durable bound rib",
    },
    fullDescription: {
      ar: "بحثك عن التيشرت الأبيض الفاخر ينتهي هنا. تم حياكته بوزن 260 جرام من أجود أقطان مصر المعالجة ضد التوبير والانكماش، بقصة بوكسي نظيفة تليق بكل الإطلالات.",
      en: "Your search for the ultimate white tee ends here. 260 GSM anti-pilling, pre-shrunk combed jersey with a structured drape and dropped shoulders.",
    },
    categoryId: "cat-tees",
    categoryName: {
      ar: "تيشرتات أوفرسايز هيفي ويت",
      en: "Oversized & Boxy Tees",
    },
    price: 650,
    originalPrice: 750,
    discountPercentage: 13,
    stock: 75,
    sku: "FG-TS-260-WHT",
    images: [
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    rating: 4.96,
    reviewCount: 54,
    specifications: {
      gsm: { ar: "260 GSM سنجل جيرسي فائق الكثافة", en: "260 GSM Ultra-Dense Single Jersey" },
      fabric: { ar: "100% قطن مصري ممشط (غير شفاف)", en: "100% Combed Egyptian Cotton (Zero Sheer)" },
      fit: { ar: "بوكسي ستريت وير نظيف", en: "Boxy Clean Street Fit" },
      care: { ar: "غسيل مع الألوان الفاتحة • ماء بارد", en: "Wash with light colors • Cold water" },
      origin: { ar: "صنع في مصر", en: "Crafted in Egypt" },
    },
    variants: [
      { id: "v6-1", name: { ar: "أبيض / S", en: "White / S" }, sku: "FG-TS-WHT-S", price: 650, stock: 15 },
      { id: "v6-2", name: { ar: "أبيض / M", en: "White / M" }, sku: "FG-TS-WHT-M", price: 650, stock: 20 },
      { id: "v6-3", name: { ar: "أبيض / L", en: "White / L" }, sku: "FG-TS-WHT-L", price: 650, stock: 22 },
      { id: "v6-4", name: { ar: "أبيض / XL", en: "White / XL" }, sku: "FG-TS-WHT-XL", price: 650, stock: 12 },
      { id: "v6-5", name: { ar: "أبيض / XXL", en: "White / XXL" }, sku: "FG-TS-WHT-XXL", price: 650, stock: 6 },
    ],
    createdAt: "2026-10-18T11:00:00Z",
  },
  {
    id: "prod-fg-cap-07",
    slug: "fg-embroidered-monogram-dad-cap",
    name: {
      ar: "كاب إف جي مونوغرام مطرز 3D — زيتي مغسول",
      en: "FG Embroidered Monogram Dad Cap - Washed Olive",
    },
    shortDescription: {
      ar: "قطن تويل ثقيل مغسول بالإنزيمات مع إبزيم معدني مونوغرام وتطريز ثلاثي الأبعاد",
      en: "Enzyme washed heavy cotton twill with custom embossed metal buckle and 3D embroidery",
    },
    fullDescription: {
      ar: "كاب كلاسيكي بـ 6 ألواح يتميز بمرونة تامة وملمس عتيق فاخر. تطريز شعار FG بحجم مدروس في المقدمة مع توقيع العلامة مطرزاً في الخلف.",
      en: "Low-profile 6-panel unstructured silhouette made from heavy enzyme-washed twill. Features high-density 3D front embroidery and adjustable custom metal strap.",
    },
    categoryId: "cat-accessories",
    categoryName: {
      ar: "إكسسوارات وكابات فاخرة",
      en: "Caps, Bags & Accessories",
    },
    price: 380,
    originalPrice: 480,
    discountPercentage: 20,
    stock: 50,
    sku: "FG-CP-100-WSH",
    images: [
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=800&auto=format&fit=crop",
    ],
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    rating: 4.85,
    reviewCount: 22,
    specifications: {
      gsm: { ar: "قماش تشينو تويل ثقيل مغسول", en: "Heavy Enzyme-Washed Chino Twill" },
      fabric: { ar: "100% قطن تويل طبيعي", en: "100% Cotton Twill" },
      fit: { ar: "حجم موحد مع حزام معدني للتعديل", en: "One Size Fits All (Adjustable Metal Strap)" },
      care: { ar: "تنظيف سطحي بقطعة قماش رطبة", en: "Spot clean only" },
      origin: { ar: "صنع في مصر", en: "Crafted in Egypt" },
    },
    variants: [
      { id: "v7-1", name: { ar: "زيتي / One Size", en: "Olive / One Size" }, sku: "FG-CP-OLV-OS", price: 380, stock: 20 },
      { id: "v7-2", name: { ar: "أسود / One Size", en: "Black / One Size" }, sku: "FG-CP-BLK-OS", price: 380, stock: 20 },
      { id: "v7-3", name: { ar: "بيج / One Size", en: "Khaki / One Size" }, sku: "FG-CP-KHK-OS", price: 380, stock: 10 },
    ],
    createdAt: "2026-10-20T16:00:00Z",
  },
];

// ==========================================
// 3. REVIEWS MOCK DATA
// ==========================================
export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    userId: "usr-demo-cust-01",
    userName: "عمر الشريف",
    rating: 5,
    comment: "خامة الهودي تفوق الوصف بجد! الـ 380 GSM ثقيل ومتقن جداً، والياقة واقفة مظبوطة بدون أربطة. فخور إن ده براند مصري بالجودة دي.",
    createdAt: "2026-10-24T14:30:00Z",
  },
  {
    id: "rev-2",
    userId: "usr-cust-02",
    userName: "كريم حسام",
    rating: 5,
    comment: "التيشرت الأسيد ووش خيالي، الغسيل واللون الفنتج متقن جداً والياقة سميكة محترمة مش هتوسع بعد أول غسلة.",
    createdAt: "2026-10-22T09:15:00Z",
  },
  {
    id: "rev-3",
    userId: "usr-cust-03",
    userName: "ياسين المنشاوي",
    rating: 5,
    comment: "الكارجو بجد تفاصيله تحفة، الجيوب وسحاباتها ممتازة واستلمت في خلال 24 ساعة في المنصورة.",
    createdAt: "2026-10-20T18:00:00Z",
  },
];

// ==========================================
// 4. CUSTOMERS MOCK DATA
// ==========================================
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "usr-demo-cust-01",
    fullName: "عمر الشريف",
    email: "demo.user@example.com",
    phone: "01012345678",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    role: "USER",
    addresses: [
      {
        id: "addr-1",
        title: "المنزل",
        fullName: "عمر الشريف",
        phone: "01012345678",
        governorate: "الدقهلية",
        city: "المنصورة",
        streetAddress: "شارع الجمهورية، حي الجامعة، المنصورة",
        isDefault: true,
      },
    ],
    totalOrdersCount: 4,
    totalSpent: 4850,
    isVerified: true,
    createdAt: "2026-09-15T12:00:00Z",
  },
  {
    id: "usr-cust-02",
    fullName: "كريم حسام",
    email: "kareem.hossam@example.com",
    phone: "01123456789",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    role: "USER",
    addresses: [
      {
        id: "addr-2",
        title: "المكتب",
        fullName: "كريم حسام",
        phone: "01123456789",
        governorate: "الجيزة",
        city: "الشيخ زايد",
        streetAddress: "مجمع أركان بلازا، مبنى 4",
        isDefault: true,
      },
    ],
    totalOrdersCount: 2,
    totalSpent: 2500,
    isVerified: true,
    createdAt: "2026-10-02T10:00:00Z",
  },
  {
    id: "usr-cust-03",
    fullName: "ياسين المنشاوي",
    email: "yassin.menshawy@example.com",
    phone: "01234567890",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    role: "USER",
    addresses: [
      {
        id: "addr-3",
        title: "المنزل",
        fullName: "ياسين المنشاوي",
        phone: "01234567890",
        governorate: "الإسكندرية",
        city: "سموحة",
        streetAddress: "شارع فوزي معاذ، برج الأطباء",
        isDefault: true,
      },
    ],
    totalOrdersCount: 3,
    totalSpent: 3880,
    isVerified: true,
    createdAt: "2026-09-20T16:00:00Z",
  },
];

// ==========================================
// 5. ORDERS MOCK DATA
// ==========================================
export const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "FG-849201",
    customerName: "عمر الشريف",
    customerEmail: "demo.user@example.com",
    customerPhone: "01012345678",
    shippingAddress: {
      fullName: "عمر الشريف",
      phone: "01012345678",
      governorate: "الدقهلية",
      city: "المنصورة",
      streetAddress: "شارع الجمهورية، حي الجامعة، المنصورة",
    },
    items: [
      {
        productId: "prod-fg-hoodie-01",
        productName: {
          ar: "هودي إف جي الثقيل 380 GSM — أسود أوبسيديان",
          en: "FG Core Heavyweight Hoodie 380 GSM - Obsidian Black",
        },
        productImage: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600",
        price: 1350,
        quantity: 1,
        variantName: "Black / L",
      },
      {
        productId: "prod-fg-tee-02",
        productName: {
          ar: "تيشرت إف جي مونوغرام معتق (Acid-Wash) — شاركول",
          en: "FG Monogram Acid-Wash Oversized Tee - Vintage Charcoal",
        },
        productImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600",
        price: 680,
        quantity: 1,
        variantName: "Charcoal / L",
      },
    ],
    subtotal: 2030,
    shippingFee: 0,
    discountAmount: 203,
    total: 1827,
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    orderStatus: "processing",
    shippingProvider: "FG Express Courier",
    createdAt: "2026-11-18T10:15:00Z",
    updatedAt: "2026-11-18T11:00:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "FG-739182",
    customerName: "كريم حسام",
    customerEmail: "kareem.hossam@example.com",
    customerPhone: "01123456789",
    shippingAddress: {
      fullName: "كريم حسام",
      phone: "01123456789",
      governorate: "الجيزة",
      city: "الشيخ زايد",
      streetAddress: "مجمع أركان بلازا، مبنى 4",
    },
    items: [
      {
        productId: "prod-fg-jacket-04",
        productName: {
          ar: "جاكيت بومبر مزدوج الوجهين — أونيكس / برتقالي ستريت",
          en: "FG Reversible Bomber Jacket - Onyx Black / Safety Orange",
        },
        productImage: "https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=600",
        price: 1850,
        quantity: 1,
        variantName: "Black / XL",
      },
    ],
    subtotal: 1850,
    shippingFee: 65,
    discountAmount: 0,
    total: 1915,
    paymentMethod: "cash_on_delivery",
    paymentStatus: "pending",
    orderStatus: "confirmed",
    shippingProvider: "Bosta Egypt",
    createdAt: "2026-11-17T15:30:00Z",
    updatedAt: "2026-11-17T16:00:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "FG-618294",
    customerName: "ياسين المنشاوي",
    customerEmail: "yassin.menshawy@example.com",
    customerPhone: "01234567890",
    shippingAddress: {
      fullName: "ياسين المنشاوي",
      phone: "01234567890",
      governorate: "الإسكندرية",
      city: "سموحة",
      streetAddress: "شارع فوزي معاذ، برج الأطباء",
    },
    items: [
      {
        productId: "prod-fg-cargo-03",
        productName: {
          ar: "بنطلون كارجو تكتيكي متعدد الجيوب — أسود مطفي",
          en: "FG Tactical Multi-Pocket Cargo Pants - Matte Black",
        },
        productImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?q=80&w=600",
        price: 1150,
        quantity: 1,
        variantName: "Black / M",
      },
      {
        productId: "prod-fg-cap-07",
        productName: {
          ar: "كاب إف جي مونوغرام مطرز 3D — زيتي مغسول",
          en: "FG Embroidered Monogram Dad Cap - Washed Olive",
        },
        productImage: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600",
        price: 380,
        quantity: 1,
        variantName: "Olive / One Size",
      },
    ],
    subtotal: 1530,
    shippingFee: 0,
    discountAmount: 0,
    total: 1530,
    paymentMethod: "vodafone_cash",
    paymentStatus: "paid",
    orderStatus: "delivered",
    shippingProvider: "Aramex Egypt",
    createdAt: "2026-11-15T12:00:00Z",
    updatedAt: "2026-11-17T14:00:00Z",
  },
];

// ==========================================
// 6. INVENTORY MOCK DATA
// ==========================================
export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    productId: "prod-fg-hoodie-01",
    sku: "FG-HD-380-BLK",
    productName: {
      ar: "هودي إف جي الثقيل 380 GSM — أسود أوبسيديان",
      en: "FG Core Heavyweight Hoodie 380 GSM - Obsidian Black",
    },
    categoryName: {
      ar: "هوديز وسويت شيرتات ثقيلة",
      en: "Heavyweight Hoodies & Sweats",
    },
    currentStock: 45,
    lowStockThreshold: 10,
    safetyStock: 5,
    unitCost: 650,
    sellingPrice: 1350,
    status: "in_stock",
    lastRestockedAt: "2026-11-01T08:00:00Z",
    lastUpdatedSource: "admin_dashboard",
  },
  {
    id: "inv-2",
    productId: "prod-fg-tee-02",
    sku: "FG-TS-240-ACD",
    productName: {
      ar: "تيشرت إف جي مونوغرام معتق (Acid-Wash) — شاركول",
      en: "FG Monogram Acid-Wash Oversized Tee - Vintage Charcoal",
    },
    categoryName: {
      ar: "تيشرتات أوفرسايز هيفي ويت",
      en: "Oversized & Boxy Tees",
    },
    currentStock: 60,
    lowStockThreshold: 15,
    safetyStock: 10,
    unitCost: 320,
    sellingPrice: 680,
    status: "in_stock",
    lastRestockedAt: "2026-11-05T09:00:00Z",
    lastUpdatedSource: "admin_dashboard",
  },
  {
    id: "inv-3",
    productId: "prod-fg-cargo-03",
    sku: "FG-CG-500-BLK",
    productName: {
      ar: "بنطلون كارجو تكتيكي متعدد الجيوب — أسود مطفي",
      en: "FG Tactical Multi-Pocket Cargo Pants - Matte Black",
    },
    categoryName: {
      ar: "بناطيل كارجو وميلتون مريح",
      en: "Cargo Pants & Relaxed Sweats",
    },
    currentStock: 28,
    lowStockThreshold: 8,
    safetyStock: 5,
    unitCost: 550,
    sellingPrice: 1150,
    status: "in_stock",
    lastRestockedAt: "2026-11-08T10:00:00Z",
    lastUpdatedSource: "admin_dashboard",
  },
  {
    id: "inv-4",
    productId: "prod-fg-jacket-04",
    sku: "FG-JK-600-ONX",
    productName: {
      ar: "جاكيت بومبر مزدوج الوجهين — أونيكس / برتقالي ستريت",
      en: "FG Reversible Bomber Jacket - Onyx Black / Safety Orange",
    },
    categoryName: {
      ar: "جاكيتات ومعاطف وسترات",
      en: "Jackets & Technical Outerwear",
    },
    currentStock: 20,
    lowStockThreshold: 5,
    safetyStock: 3,
    unitCost: 950,
    sellingPrice: 1950,
    status: "low_stock",
    lastRestockedAt: "2026-10-25T14:00:00Z",
    lastUpdatedSource: "admin_dashboard",
  },
  {
    id: "inv-5",
    productId: "prod-fg-cap-07",
    sku: "FG-CP-100-WSH",
    productName: {
      ar: "كاب إف جي مونوغرام مطرز 3D — زيتي مغسول",
      en: "FG Embroidered Monogram Dad Cap - Washed Olive",
    },
    categoryName: {
      ar: "إكسسوارات وكابات فاخرة",
      en: "Caps, Bags & Accessories",
    },
    currentStock: 50,
    lowStockThreshold: 10,
    safetyStock: 5,
    unitCost: 180,
    sellingPrice: 420,
    status: "in_stock",
    lastRestockedAt: "2026-11-02T11:00:00Z",
    lastUpdatedSource: "admin_dashboard",
  },
];

// ==========================================
// 7. COUPONS MOCK DATA
// ==========================================
export const MOCK_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "FG10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 1000,
    usageLimit: 500,
    usageCount: 142,
    isActive: true,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    description: {
      ar: "خصم 10% ترحيبي لجميع العملاء",
      en: "10% Welcome discount for all customers",
    },
  },
  {
    id: "coup-2",
    code: "VIP20",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 2500,
    usageLimit: 100,
    usageCount: 38,
    isActive: true,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    description: {
      ar: "خصم VIP 20% للطلبات فوق 2,500 ج.م",
      en: "20% VIP discount for orders over 2,500 EGP",
    },
  },
  {
    id: "coup-3",
    code: "FREESHIP",
    discountType: "fixed_amount",
    discountValue: 75,
    minOrderAmount: 1500,
    usageLimit: 1000,
    usageCount: 285,
    isActive: true,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    description: {
      ar: "خصم مصاريف الشحن للطلبات المؤهلة",
      en: "Free shipping discount for qualified orders",
    },
  },
];

// ==========================================
// 8. NOTIFICATIONS MOCK DATA
// ==========================================
export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    title: {
      ar: "طلب جديد وارد #FG-849201",
      en: "New Order Placed #FG-849201",
    },
    message: {
      ar: "تم استلام طلب جديد من العميل عمر الشريف بقيمة 1,827 ج.م بواسطة بطاقة بنكية.",
      en: "Customer Omar El-Sherif placed an order of 1,827 EGP paid via credit card.",
    },
    type: "new_order",
    priority: "high",
    isRead: false,
    createdAt: "2026-11-18T10:15:00Z",
  },
  {
    id: "notif-2",
    title: {
      ar: "تنبيه اقتراب نفاد المخزون (جاكيت بومبر أونيكس)",
      en: "Low Stock Alert (Reversible Bomber Onyx)",
    },
    message: {
      ar: "تبقي 5 قطع فقط من جاكيت بومبر أونيكس بمقاس L.",
      en: "Only 5 units remaining for Reversible Bomber Onyx in Size L.",
    },
    type: "low_stock",
    priority: "medium",
    isRead: true,
    createdAt: "2026-11-17T14:00:00Z",
  },
];

// ==========================================
// 9. ANALYTICS SUMMARY MOCK DATA
// ==========================================
export const MOCK_ANALYTICS: AnalyticsSummary = {
  totalRevenue: 285400,
  revenueGrowthPercentage: 18.5,
  totalOrders: 218,
  ordersGrowthPercentage: 12.2,
  averageOrderValue: 1309,
  activeCustomersCount: 176,
  lowStockItemsCount: 3,
  salesByPeriod: [
    { date: "2026-06", revenue: 24000, ordersCount: 20 },
    { date: "2026-07", revenue: 38500, ordersCount: 32 },
    { date: "2026-08", revenue: 42100, ordersCount: 35 },
    { date: "2026-09", revenue: 51200, ordersCount: 41 },
    { date: "2026-10", revenue: 68400, ordersCount: 52 },
    { date: "2026-11", revenue: 98650, ordersCount: 74 },
  ],
  categoryDistribution: [
    {
      categoryId: "cat-hoodies",
      categoryName: { ar: "هوديز وسويت شيرتات", en: "Hoodies & Sweats" },
      revenue: 125000,
      percentage: 43.8,
      itemsSold: 92,
    },
    {
      categoryId: "cat-tees",
      categoryName: { ar: "تيشرتات أوفرسايز", en: "Oversized Tees" },
      revenue: 78000,
      percentage: 27.3,
      itemsSold: 115,
    },
    {
      categoryId: "cat-pants",
      categoryName: { ar: "بناطيل كارجو", en: "Cargo Pants" },
      revenue: 54000,
      percentage: 18.9,
      itemsSold: 47,
    },
    {
      categoryId: "cat-outerwear",
      categoryName: { ar: "جاكيتات ومعاطف", en: "Outerwear" },
      revenue: 28400,
      percentage: 10.0,
      itemsSold: 15,
    },
  ],
  topProducts: [
    {
      productId: "prod-fg-hoodie-01",
      name: {
        ar: "هودي إف جي الثقيل 380 GSM — أسود أوبسيديان",
        en: "FG Core Heavyweight Hoodie 380 GSM - Obsidian Black",
      },
      sku: "FG-HD-380-BLK",
      categoryName: { ar: "هوديز", en: "Hoodies" },
      unitsSold: 84,
      totalRevenue: 113400,
      stockLeft: 45,
    },
    {
      productId: "prod-fg-tee-02",
      name: {
        ar: "تيشرت إف جي مونوغرام معتق (Acid-Wash) — شاركول",
        en: "FG Monogram Acid-Wash Oversized Tee - Vintage Charcoal",
      },
      sku: "FG-TS-240-ACD",
      categoryName: { ar: "تيشرتات", en: "Tees" },
      unitsSold: 112,
      totalRevenue: 76160,
      stockLeft: 60,
    },
    {
      productId: "prod-fg-cargo-03",
      name: {
        ar: "بنطلون كارجو تكتيكي متعدد الجيوب — أسود مطفي",
        en: "FG Tactical Multi-Pocket Cargo Pants - Matte Black",
      },
      sku: "FG-CG-500-BLK",
      categoryName: { ar: "بناطيل", en: "Pants" },
      unitsSold: 46,
      totalRevenue: 52900,
      stockLeft: 28,
    },
  ],
  ordersByGovernorate: {
    "القاهرة": 115,
    "الجيزة": 48,
    "الإسكندرية": 32,
    "الدقهلية": 12,
    "أخرى": 11,
  },
};

export const MOCK_ANALYTICS_SUMMARY = MOCK_ANALYTICS;
