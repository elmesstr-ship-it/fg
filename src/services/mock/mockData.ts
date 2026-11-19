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
    id: "cat-1",
    slug: "sacred-icons",
    name: {
      ar: "أيقونات قبطية وبيزنطية مقدسة",
      en: "Sacred Coptic & Byzantine Icons",
    },
    description: {
      ar: "أيقونات أثرية مرسومة يدوياً ومطلية بماء الذهب عيار 24 طبقاً للطقس الكنسي الأصيل",
      en: "Hand-painted 24k gold leaf Byzantine and Coptic icons created with traditional monastic techniques",
    },
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    itemCount: 24,
  },
  {
    id: "cat-2",
    slug: "altar-vessels-censers",
    name: {
      ar: "أواني المذبح والمجامر الطقسية",
      en: "Altar Vessels & Handcrafted Censers",
    },
    description: {
      ar: "كؤوس وصواني طقسية ومجامر نحاسية مذهبة وفضية محفورة بصلبان ورموز الآباء",
      en: "Chalice and paten sets, silver and gold plated brass censers with liturgical harmonic bells",
    },
    image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop",
    itemCount: 18,
  },
  {
    id: "cat-3",
    slug: "liturgical-vestments",
    name: {
      ar: "ملابس كهنوتية وستور المذبح",
      en: "Priestly Vestments & Altar Linens",
    },
    description: {
      ar: "تونيات وبرانس مطرزة بخيوط الحرير والذهب مع أغطية المذبح والستر الطقسي المخملي",
      en: "Hand-embroidered liturgical vestments, stoles, and velvet embroidered altar covers",
    },
    image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
    itemCount: 15,
  },
  {
    id: "cat-4",
    slug: "pure-incense-candles",
    name: {
      ar: "بخور ديري أصيل وشموع نقية",
      en: "Monastery Incense & Pure Candles",
    },
    description: {
      ar: "أفخر أنواع بخور جبل آثوس والأديرة المصرية وشموع شمع عسل النحل الطبيعي 100% غير المدخنة",
      en: "Mount Athos aromatic incense, Egyptian monastic blends, and pure beeswax taper candles",
    },
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop",
    itemCount: 32,
  },
  {
    id: "cat-5",
    slug: "sacred-books-gifts",
    name: {
      ar: "كتب طقسية، أجبية وهدايا مباركة",
      en: "Liturgical Books, Agpeya & Sacred Gifts",
    },
    description: {
      ar: "كتب صلوات الطقس الكنسي، الأجبية بجلود طبيعية منقوشة، وصلبان خشب الزيتون المقدسة",
      en: "Leather-bound prayer books, Agpeya, Olive wood hand crosses, and sacramental baptismal gifts",
    },
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
    itemCount: 20,
  },
];

// ==========================================
// 2. PRODUCTS MOCK DATA
// ==========================================
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "byzantine-christ-pantocrator-icon",
    name: {
      ar: "أيقونة السيد المسيح ضابط الكل (بانطوقراطور)",
      en: "Christ Pantocrator Gold Leaf Icon",
    },
    shortDescription: {
      ar: "أيقونة خشبية أثرية مذهبة عيار 24 يدوية الصنع بألوان طبيعية ثابتة",
      en: "Handcrafted 24k gold leaf egg tempera wood icon on solid aged linden wood",
    },
    fullDescription: {
      ar: "أيقونة طقسية مقدسة تجسد السيد المسيح ضابط الكل وفقاً للفن البيزنطي والقبطي العريق. تم تجهيز الخشب بطبقات الجسو التقليدية مع تذهيب يدوي بأوراق الذهب عيار 24 قيراط، ومطلية بألوان التمبرا الطبيعية مع طبقة حماية عازلة تدوم لقرون.",
      en: "A solemn, sacred depiction of Christ Pantocrator adhering to venerable Coptic and Byzantine iconography. Prepared on traditional natural gesso with 24k genuine gold leaf and mineral egg tempera pigments.",
    },
    categoryId: "cat-1",
    categoryName: {
      ar: "أيقونات قبطية وبيزنطية مقدسة",
      en: "Sacred Coptic & Byzantine Icons",
    },
    price: 3200,
    originalPrice: 3800,
    discountPercentage: 15,
    stock: 7, // Low stock trigger
    sku: "ICON-PANT-01",
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 38,
    specifications: {
      dimensions: { ar: "30 × 40 سم", en: "30 x 40 cm" },
      material: { ar: "خشب زان طبيعي مذهب", en: "Aged solid wood with 24k gold leaf" },
      origin: { ar: "ورشة دير القديسين - مصر", en: "Monastic Guild Workshop, Egypt" },
    },
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "prod-2",
    slug: "ornate-byzantine-liturgical-censer",
    name: {
      ar: "شورية (مجمرة) طقسية نحاسية مذهبة بأجراس نغمية",
      en: "Imperial Ornate Liturgical Brass Censer",
    },
    shortDescription: {
      ar: "مجمرة مذبح كنسية نحاسية ثقيلة مع 12 جرس منغم وسلاسل فولاذية صلبة",
      en: "Heavy gold-plated brass thurible adorned with 12 harmonic bells and cross finial",
    },
    fullDescription: {
      ar: "مجمرة كنسية (شورية) فاخرة مصنوعة من النحاس الخالص المطلي بالذهب غير القابل للتغير. تتميز بـ 12 جرساً ترمز للتلاميذ الاثني عشر مع تناغم صوتي بديع وسلاسل متينة محكمة تتحمل حرارة الفحم العالية.",
      en: "An exquisite liturgical thurible forged from high-purity brass and electroplated with enduring gold luster. Features twelve precision-tuned bells symbolizing the Apostles.",
    },
    categoryId: "cat-2",
    categoryName: {
      ar: "أواني المذبح والمجامر الطقسية",
      en: "Altar Vessels & Handcrafted Censers",
    },
    price: 2450,
    originalPrice: 2800,
    discountPercentage: 12,
    stock: 14,
    sku: "ALTR-CENS-02",
    images: [
      "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: false,
    rating: 4.8,
    reviewCount: 22,
    specifications: {
      dimensions: { ar: "ارتفاع 26 سم - سلاسل 70 سم", en: "Height 26 cm - Chains 70 cm" },
      material: { ar: "نحاس صلب مذهب عالي النقاوة", en: "Pure Gold-Plated Solid Brass" },
      origin: { ar: "صناعة يونانية كنسية يدوية", en: "Handcrafted Ecclesiastical Brass, Greece" },
    },
    createdAt: "2026-01-20T12:00:00Z",
  },
  {
    id: "prod-3",
    slug: "athos-monastic-frankincense-blend",
    name: {
      ar: "بخور جبل آثوس الديري الفاخر (رائحة الناردين والورد)",
      en: "Mount Athos Monastic Incense (Rose & Nard)",
    },
    shortDescription: {
      ar: "بخور ديري أصلي معتق بزيوت عطرية نقية طبيعية 100% يدوم لساعات",
      en: "Authentic resin incense hand-kneaded with aromatic essential oils in Mount Athos",
    },
    fullDescription: {
      ar: "بخور رهباني أرثوذكسي أصيل مصنوع في قلالي جبل آثوس. يُعجن يدوياً من صمغ اللبان النقي مع أجود الزيوت العطرية الطبيعية بدون أي مواد كيميائية أو روائح صناعية، ويمنح المذبح والبيت سكينة وعبقاً روحانياً فريداً.",
      en: "Traditional Athonite monastic incense. Handcrafted by monks using premium frankincense tears blended with pure essential scents of mystical Rose and Biblical Nard.",
    },
    categoryId: "cat-4",
    categoryName: {
      ar: "بخور ديري أصيل وشموع نقية",
      en: "Monastery Incense & Pure Candles",
    },
    price: 450,
    stock: 45,
    sku: "INCS-ATHOS-03",
    images: [
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1000&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 64,
    specifications: {
      weight: { ar: "عبوة 250 جرام", en: "250g Tin" },
      ingredients: { ar: "لبان حوجري نقي، زيت ناردين، ماء ورد طبيعي", en: "Pure Boswellia Resin, Nard Oil, Rose Essence" },
      origin: { ar: "شبه جزيرة آثوس المقدسة", en: "Holy Mount Athos" },
    },
    createdAt: "2026-02-01T09:00:00Z",
  },
  {
    id: "prod-4",
    slug: "pure-beeswax-liturgical-tapers",
    name: {
      ar: "شموع شمع عسل نحل طبيعي 100% نقية وغير مدخنة",
      en: "100% Pure Monastic Beeswax Taper Candles",
    },
    shortDescription: {
      ar: "حزمة 50 شمعة نقية برائحة العسل الطبيعية مع فتيل قطني بدون دخان",
      en: "Bundle of 50 hand-dipped beeswax candles with smokeless cotton wicks",
    },
    fullDescription: {
      ar: "شموع طقسية مكرسة مصنوعة من شمع عسل النحل الطبيعي النقي 100% بدون أي إضافات بارافين. تتميز باحتراق نظيف هادئ بدون دخان أسود، وتفوح منها رائحة العسل العطرة الطبيعية.",
      en: "Hand-dipped natural church taper candles crafted purely from raw unbleached monastic beeswax. Clean, dripless, and smokeless burn emitting gentle natural honey fragrance.",
    },
    categoryId: "cat-4",
    categoryName: {
      ar: "بخور ديري أصيل وشموع نقية",
      en: "Monastery Incense & Pure Candles",
    },
    price: 380,
    stock: 80,
    sku: "CNDL-BEE-04",
    images: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop",
    ],
    isFeatured: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 51,
    specifications: {
      quantity: { ar: "50 شمعة بالعلبة", en: "Box of 50 candles" },
      length: { ar: "طول 25 سم - قطر 8 مم", en: "Length 25 cm - Diameter 8 mm" },
      burnTime: { ar: "حوالي 90 دقيقة للشمعة", en: "Approx. 90 mins per candle" },
    },
    createdAt: "2026-02-05T08:00:00Z",
  },
  {
    id: "prod-5",
    slug: "embroidered-priestly-stole-gold-silk",
    name: {
      ar: "بطرشيل كهنوتي مطرز يدوياً بالحرير وخيوط الذهب",
      en: "Hand-Embroidered Priestly Stole (Epitrachelion)",
    },
    shortDescription: {
      ar: "بطرشيل أحمر قرمزي ومخملي مطرز بأيقونات الرسل الاثني عشر والصلبان",
      en: "Crimson liturgical stole hand-embroidered with metallic gold thread and sacred crosses",
    },
    fullDescription: {
      ar: "بطرشيل كهنوتي فاخر مصنوع من أفخر أنواع أقمشة الديباج والمخمل الطبيعي، ومطرز يدوياً بعناية رهبانية فائقة بخيوط الذهب والفضة مع شراشيب حريرية ذهبية.",
      en: "Venerable sacerdotal stole crafted from rich damask and velvet, featuring meticulous needlework depicting traditional vine motifs and sacred emblems.",
    },
    categoryId: "cat-3",
    categoryName: {
      ar: "ملابس كهنوتية وستور المذبح",
      en: "Priestly Vestments & Altar Linens",
    },
    price: 4900,
    originalPrice: 5500,
    discountPercentage: 11,
    stock: 5, // Low stock trigger
    sku: "VEST-STOL-05",
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop",
    ],
    isFeatured: true,
    isBestSeller: false,
    rating: 5.0,
    reviewCount: 17,
    specifications: {
      fabric: { ar: "مخمل ديباج كنسي فاخر", en: "Ecclesiastical Brocade & Velvet" },
      embroidery: { ar: "خيوط ذهبية ألمانية عيار 18", en: "18k Gold Metallic Thread" },
      length: { ar: "طول 145 سم", en: "Length 145 cm" },
    },
    createdAt: "2026-02-10T11:00:00Z",
  },
  {
    id: "prod-6",
    slug: "leather-bound-liturgical-agpeya-book",
    name: {
      ar: "كتاب الأجبية وصلوات السواعي بغلاف جلد طبيعي منقوش",
      en: "Handmade Leather-Bound Agpeya Prayer Book",
    },
    shortDescription: {
      ar: "صلوات السواعي الكاملة باللغتين العربية والقبطية بطباعة فاخرة وحواف مذهبة",
      en: "Complete canonical hours in Arabic & Coptic with gilt edges and embossed leather cover",
    },
    fullDescription: {
      ar: "كتاب صلوات السواعي (الأجبية) الأرثوذكسية الكاملة، مجلد يدوياً بجلد طبيعي فاخر محفور بالصليب القبطي، مطبوع على ورق شامواه عاجي مع حواف صفحات مذهبة وشرائط حريرية ملونة لتحديد الصلوات.",
      en: "An exquisite liturgical book of hours (Agpeya). Beautifully typeset with dual language text, ivory archival paper, gold-gilt page rims, and genuine embossed leather binding.",
    },
    categoryId: "cat-5",
    categoryName: {
      ar: "كتب طقسية، أجبية وهدايا مباركة",
      en: "Liturgical Books, Agpeya & Sacred Gifts",
    },
    price: 650,
    stock: 35,
    sku: "BOOK-AGP-06",
    images: [
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1000&auto=format&fit=crop",
    ],
    isFeatured: false,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 42,
    specifications: {
      pages: { ar: "420 صفحة ورق شامواه", en: "420 Pages Chamois Paper" },
      binding: { ar: "تجليد يدوي جلد بقري طبيعي", en: "Handmade Cowhide Leather" },
      size: { ar: "12 × 17 سم (حجم الجيب المريح)", en: "12 x 17 cm" },
    },
    createdAt: "2026-02-14T14:00:00Z",
  },
];

// ==========================================
// 3. REVIEWS MOCK DATA
// ==========================================
export const MOCK_REVIEWS: Record<string, ProductReview[]> = {
  "prod-1": [
    {
      id: "rev-1",
      userId: "cust-1",
      userName: "مينا رفيق",
      rating: 5,
      comment: "بركة عظيمة، الأيقونة في الحقيقة أروع بكثير من الصور، وتذهيب أوراق الذهب عيار 24 يلمع بوقار وجمال استثنائي.",
      createdAt: "2026-02-01T15:00:00Z",
    },
    {
      id: "rev-2",
      userId: "cust-2",
      userName: "أبونا داود سليمان",
      rating: 5,
      comment: "صناعة رهبانية متقنة ومطابقة للطقس الكنسي الأصيل. التغليف كان آمناً جداً ومصفحاً. ربنا يعوض تعبكم.",
      createdAt: "2026-02-10T12:30:00Z",
    },
  ],
  "prod-2": [
    {
      id: "rev-3",
      userId: "cust-2",
      userName: "أبونا داود سليمان",
      rating: 5,
      comment: "شورية ممتازة وثقيلة، الأجراس الـ 12 متناغمة جداً وتتحمل حرارة الفحم العالية بدون أي تغير في اللون.",
      createdAt: "2026-02-12T09:15:00Z",
    },
  ],
  "prod-3": [
    {
      id: "rev-4",
      userId: "cust-3",
      userName: "ماريان صبحي",
      rating: 5,
      comment: "أفخر أنواع البخور التي جربتها، رائحة الناردين والورد تملأ البيت بسكينة وسلام روحي عجيب يدوم لساعات طويلة.",
      createdAt: "2026-02-18T18:20:00Z",
    },
  ],
};

// ==========================================
// 4. CUSTOMERS MOCK DATA
// ==========================================
export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    fullName: "مينا رفيق جرجس",
    email: "mina.girgis@example.com",
    phone: "01201234567",
    parishName: "كنيسة السيدة العذراء مريم - المعادي",
    role: "USER",
    createdAt: "2025-11-10T08:00:00Z",
    totalOrdersCount: 4,
    totalSpent: 9850,
    isVerified: true,
    addresses: [
      {
        id: "addr-1",
        isDefault: true,
        title: "المنزل",
        fullName: "مينا رفيق جرجس",
        phone: "01201234567",
        governorate: "القاهرة",
        city: "المعادي",
        streetAddress: "شارع النصر، عمارة 14، الدور الثالث",
        notes: "التسليم بعد الساعة 5 مساءً",
      },
    ],
  },
  {
    id: "cust-2",
    fullName: "القمص داود سليمان",
    email: "fr.daoud@example.com",
    phone: "01098765432",
    parishName: "كنيسة الشهيد العظيم مارجرجس - شبرا",
    role: "USER",
    createdAt: "2025-08-15T10:00:00Z",
    totalOrdersCount: 6,
    totalSpent: 16400,
    isVerified: true,
    addresses: [
      {
        id: "addr-2",
        isDefault: true,
        title: "مقر الكنيسة ومكتب الرعاية",
        fullName: "القمص داود سليمان",
        phone: "01098765432",
        governorate: "القاهرة",
        city: "شبرا",
        streetAddress: "شارع شبرا الرئيسي، مبنى خدمات مارجرجس",
      },
    ],
  },
  {
    id: "cust-3",
    fullName: "ماريان صبحي",
    email: "marian.sobhy@example.com",
    phone: "01123456789",
    parishName: "كنيسة الملاك ميخائيل - مصر الجديدة",
    role: "USER",
    createdAt: "2026-01-05T14:00:00Z",
    totalOrdersCount: 3,
    totalSpent: 2850,
    isVerified: true,
    addresses: [
      {
        id: "addr-3",
        isDefault: true,
        title: "منزل العائلة",
        fullName: "ماريان صبحي",
        phone: "01123456789",
        governorate: "القاهرة",
        city: "مصر الجديدة",
        streetAddress: "ميدان الكوربة، شارع بغداد",
      },
    ],
  },
  {
    id: "cust-admin",
    fullName: "مشرف النظام الإداري",
    email: "admin@sanctamaria-store.com",
    phone: "01000000001",
    parishName: "المقر الإداري - سانكتا ماريا",
    role: "ADMIN",
    createdAt: "2025-01-01T00:00:00Z",
    totalOrdersCount: 0,
    totalSpent: 0,
    isVerified: true,
    addresses: [],
  },
];

// ==========================================
// 5. ORDERS MOCK DATA
// ==========================================
export const MOCK_ORDERS: Order[] = [
  {
    id: "ord-1",
    orderNumber: "SM-829104",
    customerName: "مينا رفيق جرجس",
    customerEmail: "mina.girgis@example.com",
    customerPhone: "01201234567",
    shippingAddress: {
      fullName: "مينا رفيق جرجس",
      phone: "01201234567",
      governorate: "القاهرة",
      city: "المعادي",
      streetAddress: "شارع النصر، عمارة 14، الدور الثالث",
      notes: "تسليم هادئ ومؤمّن للأيقونة",
    },
    items: [
      {
        productId: "prod-1",
        productName: {
          ar: "أيقونة السيد المسيح ضابط الكل (بانطوقراطور)",
          en: "Christ Pantocrator Gold Leaf Icon",
        },
        productImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600",
        price: 3200,
        quantity: 1,
      },
    ],
    subtotal: 3200,
    shippingFee: 0, // Free over 2000
    discountAmount: 0,
    total: 3200,
    paymentMethod: "cash_on_delivery",
    paymentStatus: "pending",
    orderStatus: "processing",
    trackingNumber: "EGY-EXP-992144",
    shippingProvider: "Bosta Logistics",
    createdAt: "2026-10-28T14:30:00Z",
    updatedAt: "2026-10-28T15:00:00Z",
  },
  {
    id: "ord-2",
    orderNumber: "SM-739182",
    customerName: "القمص داود سليمان",
    customerEmail: "fr.daoud@example.com",
    customerPhone: "01098765432",
    shippingAddress: {
      fullName: "القمص داود سليمان",
      phone: "01098765432",
      governorate: "القاهرة",
      city: "شبرا",
      streetAddress: "شارع شبرا الرئيسي، كنيسة مارجرجس",
    },
    items: [
      {
        productId: "prod-2",
        productName: {
          ar: "شورية (مجمرة) طقسية نحاسية مذهبة بأجراس نغمية",
          en: "Imperial Ornate Liturgical Brass Censer",
        },
        productImage: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=600",
        price: 2450,
        quantity: 1,
      },
      {
        productId: "prod-3",
        productName: {
          ar: "بخور جبل آثوس الديري الفاخر (رائحة الناردين والورد)",
          en: "Mount Athos Monastic Incense (Rose & Nard)",
        },
        productImage: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=600",
        price: 450,
        quantity: 2,
      },
    ],
    subtotal: 3350,
    shippingFee: 0,
    discountAmount: 0,
    total: 3350,
    paymentMethod: "vodafone_cash",
    paymentStatus: "paid",
    orderStatus: "shipped",
    trackingNumber: "EGY-EXP-817290",
    shippingProvider: "Mylerz Shipping",
    createdAt: "2026-10-25T11:00:00Z",
    updatedAt: "2026-10-26T09:00:00Z",
  },
  {
    id: "ord-3",
    orderNumber: "SM-618294",
    customerName: "ماريان صبحي",
    customerEmail: "marian.sobhy@example.com",
    customerPhone: "01123456789",
    shippingAddress: {
      fullName: "ماريان صبحي",
      phone: "01123456789",
      governorate: "القاهرة",
      city: "مصر الجديدة",
      streetAddress: "ميدان الكوربة، شارع بغداد",
    },
    items: [
      {
        productId: "prod-4",
        productName: {
          ar: "شموع شمع عسل نحل طبيعي 100% نقية وغير مدخنة",
          en: "100% Pure Monastic Beeswax Taper Candles",
        },
        productImage: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600",
        price: 380,
        quantity: 1,
      },
    ],
    subtotal: 380,
    shippingFee: 75,
    discountAmount: 0,
    total: 455,
    paymentMethod: "credit_card",
    paymentStatus: "paid",
    orderStatus: "delivered",
    trackingNumber: "EGY-EXP-551029",
    shippingProvider: "Aramex Egypt",
    createdAt: "2026-10-22T16:00:00Z",
    updatedAt: "2026-10-24T12:00:00Z",
  },
];

// ==========================================
// 6. INVENTORY MOCK DATA (SYNCED WITH TELEGRAM)
// ==========================================
export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: "inv-1",
    productId: "prod-1",
    sku: "ICON-PANT-01",
    productName: {
      ar: "أيقونة السيد المسيح ضابط الكل (بانطوقراطور)",
      en: "Christ Pantocrator Gold Leaf Icon",
    },
    categoryName: {
      ar: "أيقونات قبطية وبيزنطية مقدسة",
      en: "Sacred Coptic & Byzantine Icons",
    },
    currentStock: 7,
    lowStockThreshold: 10,
    safetyStock: 3,
    unitCost: 2200,
    sellingPrice: 3200,
    status: "low_stock",
    lastRestockedAt: "2026-10-10T12:00:00Z",
    lastUpdatedSource: "admin_dashboard",
  },
  {
    id: "inv-2",
    productId: "prod-2",
    sku: "ALTR-CENS-02",
    productName: {
      ar: "شورية (مجمرة) طقسية نحاسية مذهبة بأجراس نغمية",
      en: "Imperial Ornate Liturgical Brass Censer",
    },
    categoryName: {
      ar: "أواني المذبح والمجامر الطقسية",
      en: "Altar Vessels & Handcrafted Censers",
    },
    currentStock: 14,
    lowStockThreshold: 8,
    safetyStock: 2,
    unitCost: 1700,
    sellingPrice: 2450,
    status: "in_stock",
    lastRestockedAt: "2026-10-18T10:00:00Z",
    lastUpdatedSource: "telegram_bot",
  },
  {
    id: "inv-3",
    productId: "prod-3",
    sku: "INCS-ATHOS-03",
    productName: {
      ar: "بخور جبل آثوس الديري الفاخر (رائحة الناردين والورد)",
      en: "Mount Athos Monastic Incense (Rose & Nard)",
    },
    categoryName: {
      ar: "بخور ديري أصيل وشموع نقية",
      en: "Monastery Incense & Pure Candles",
    },
    currentStock: 45,
    lowStockThreshold: 15,
    safetyStock: 10,
    unitCost: 280,
    sellingPrice: 450,
    status: "in_stock",
    lastRestockedAt: "2026-10-24T08:00:00Z",
    lastUpdatedSource: "admin_dashboard",
  },
  {
    id: "inv-4",
    productId: "prod-4",
    sku: "CNDL-BEE-04",
    productName: {
      ar: "شموع شمع عسل نحل طبيعي 100% نقية وغير مدخنة",
      en: "100% Pure Monastic Beeswax Taper Candles",
    },
    categoryName: {
      ar: "بخور ديري أصيل وشموع نقية",
      en: "Monastery Incense & Pure Candles",
    },
    currentStock: 80,
    lowStockThreshold: 25,
    safetyStock: 15,
    unitCost: 240,
    sellingPrice: 380,
    status: "in_stock",
    lastRestockedAt: "2026-10-26T14:00:00Z",
    lastUpdatedSource: "order_placement",
  },
  {
    id: "inv-5",
    productId: "prod-5",
    sku: "VEST-STOL-05",
    productName: {
      ar: "بطرشيل كهنوتي مطرز يدوياً بالحرير وخيوط الذهب",
      en: "Hand-Embroidered Priestly Stole (Epitrachelion)",
    },
    categoryName: {
      ar: "ملابس كهنوتية وستور المذبح",
      en: "Priestly Vestments & Altar Linens",
    },
    currentStock: 5,
    lowStockThreshold: 6,
    safetyStock: 2,
    unitCost: 3500,
    sellingPrice: 4900,
    status: "low_stock",
    lastRestockedAt: "2026-09-15T11:00:00Z",
    lastUpdatedSource: "telegram_bot",
  },
];

// ==========================================
// 7. COUPONS MOCK DATA
// ==========================================
export const MOCK_COUPONS: Coupon[] = [
  {
    id: "coup-1",
    code: "SANCTA10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 500,
    maxDiscountAmount: 300,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    isActive: true,
    usageCount: 142,
    usageLimit: 500,
    description: {
      ar: "خصم ترحيبي 10% لجميع المقتنيات الكنسية",
      en: "10% Welcome discount on all liturgical supplies",
    },
  },
  {
    id: "coup-2",
    code: "NATIVITY20",
    discountType: "percentage",
    discountValue: 20,
    minOrderAmount: 2000,
    maxDiscountAmount: 600,
    startDate: "2026-11-15T00:00:00Z",
    endDate: "2027-01-10T23:59:59Z",
    isActive: true,
    usageCount: 88,
    usageLimit: 200,
    description: {
      ar: "خصم موسم صوم وعيد الميلاد المجيد 20%",
      en: "20% Holy Nativity feast season blessing",
    },
  },
  {
    id: "coup-3",
    code: "PARISHFREE",
    discountType: "fixed_amount",
    discountValue: 150,
    minOrderAmount: 1500,
    startDate: "2026-01-01T00:00:00Z",
    endDate: "2026-12-31T23:59:59Z",
    isActive: true,
    usageCount: 65,
    description: {
      ar: "خصم 150 ج.م على طلبيات الآباء الكهنة والمذابح",
      en: "150 EGP rebate for parish and clerical orders",
    },
  },
];

// ==========================================
// 8. NOTIFICATIONS MOCK DATA
// ==========================================
export const MOCK_NOTIFICATIONS: SystemNotification[] = [
  {
    id: "notif-1",
    type: "new_order",
    priority: "high",
    title: {
      ar: "طلب جديد وارد: SM-829104",
      en: "New Order Received: SM-829104",
    },
    message: {
      ar: "قام العميل مينا رفيق بطلب أيقونة السيد المسيح ضابط الكل بمبلغ 3,200 ج.م (دفع عند الاستلام).",
      en: "Customer Mina Girgis placed an order for Christ Pantocrator Icon (3,200 EGP COD).",
    },
    isRead: false,
    resourceId: "SM-829104",
    resourceType: "order",
    createdAt: "2026-10-28T14:31:00Z",
    actionUrl: "/admin/orders",
  },
  {
    id: "notif-2",
    type: "low_stock",
    priority: "urgent",
    title: {
      ar: "تنبيه انخفاض المخزون: ICON-PANT-01",
      en: "Low Stock Alert: ICON-PANT-01",
    },
    message: {
      ar: "المتبقي من أيقونة بانطوقراطور 7 قطع فقط (تحت الحد الأدنى 10 قطع). تم إرسال إشعار فوري لبوت تيليجرام.",
      en: "Only 7 units remain for Pantocrator Icon (below threshold of 10). Alert dispatched to Telegram.",
    },
    isRead: false,
    resourceId: "prod-1",
    resourceType: "product",
    createdAt: "2026-10-28T14:32:00Z",
    actionUrl: "/admin/products",
  },
  {
    id: "notif-3",
    type: "telegram_activity",
    priority: "medium",
    title: {
      ar: "تعديل مخزون عبر بوت تيليجرام",
      en: "Stock Updated via Telegram Bot",
    },
    message: {
      ar: "قام المشرف المعتمد (Owner ID: 98124) بتحديث كمية الشورية النحاسية (+5 قطع) بنجاح.",
      en: "Authorized Admin executed /stock update for Brass Censer (+5 units) successfully.",
    },
    isRead: true,
    resourceId: "prod-2",
    resourceType: "product",
    createdAt: "2026-10-27T10:15:00Z",
    actionUrl: "/admin/products",
  },
  {
    id: "notif-4",
    type: "payment_confirmed",
    priority: "medium",
    title: {
      ar: "تأكيد سداد فودافون كاش: SM-739182",
      en: "Vodafone Cash Payment Verified: SM-739182",
    },
    message: {
      ar: "تم تأكيد تحويل 3,350 ج.م بنجاح وجاري تجهيز الشحنة لتسليمها لشركة النقل.",
      en: "Wallet transfer of 3,350 EGP verified. Ready for parcel dispatch.",
    },
    isRead: true,
    resourceId: "SM-739182",
    resourceType: "order",
    createdAt: "2026-10-25T11:20:00Z",
    actionUrl: "/admin/orders",
  },
];

// ==========================================
// 9. ANALYTICS MOCK DATA
// ==========================================
export const MOCK_ANALYTICS: AnalyticsSummary = {
  totalRevenue: 148650,
  revenueGrowthPercentage: 22.4,
  totalOrders: 84,
  ordersGrowthPercentage: 18.2,
  averageOrderValue: 1769,
  activeCustomersCount: 168,
  lowStockItemsCount: 2,
  salesByPeriod: [
    { date: "مايو", revenue: 14500, ordersCount: 9 },
    { date: "يونيو", revenue: 18200, ordersCount: 11 },
    { date: "يوليو", revenue: 21400, ordersCount: 13 },
    { date: "أغسطس", revenue: 26800, ordersCount: 15 },
    { date: "سبتمبر", revenue: 31250, ordersCount: 17 },
    { date: "أكتوبر", revenue: 36500, ordersCount: 19 },
  ],
  categoryDistribution: [
    {
      categoryId: "cat-1",
      categoryName: { ar: "الأيقونات المقدسة", en: "Sacred Icons" },
      revenue: 64000,
      percentage: 43.1,
      itemsSold: 20,
    },
    {
      categoryId: "cat-2",
      categoryName: { ar: "أواني المذبح والمجامر", en: "Altar Vessels & Censers" },
      revenue: 41650,
      percentage: 28.0,
      itemsSold: 17,
    },
    {
      categoryId: "cat-3",
      categoryName: { ar: "الملابس الكهنوتية", en: "Priestly Vestments" },
      revenue: 24500,
      percentage: 16.5,
      itemsSold: 5,
    },
    {
      categoryId: "cat-4",
      categoryName: { ar: "البخور والشموع", en: "Incense & Candles" },
      revenue: 18500,
      percentage: 12.4,
      itemsSold: 54,
    },
  ],
  topProducts: [
    {
      productId: "prod-1",
      name: {
        ar: "أيقونة السيد المسيح ضابط الكل (بانطوقراطور)",
        en: "Christ Pantocrator Gold Leaf Icon",
      },
      sku: "ICON-PANT-01",
      categoryName: { ar: "الأيقونات المقدسة", en: "Sacred Icons" },
      unitsSold: 14,
      totalRevenue: 44800,
      stockLeft: 7,
    },
    {
      productId: "prod-2",
      name: {
        ar: "شورية (مجمرة) طقسية نحاسية مذهبة",
        en: "Imperial Ornate Liturgical Brass Censer",
      },
      sku: "ALTR-CENS-02",
      categoryName: { ar: "أواني المذبح والمجامر", en: "Altar Vessels" },
      unitsSold: 12,
      totalRevenue: 29400,
      stockLeft: 14,
    },
    {
      productId: "prod-3",
      name: {
        ar: "بخور جبل آثوس الديري الفاخر",
        en: "Mount Athos Monastic Incense",
      },
      sku: "INCS-ATHOS-03",
      categoryName: { ar: "البخور والشموع", en: "Incense & Candles" },
      unitsSold: 38,
      totalRevenue: 17100,
      stockLeft: 45,
    },
  ],
  ordersByGovernorate: {
    القاهرة: 38,
    الجيزة: 16,
    الإسكندرية: 12,
    أسيوط: 8,
    المنيا: 6,
    سوهاج: 4,
  },
};
