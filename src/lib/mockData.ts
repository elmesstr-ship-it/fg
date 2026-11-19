export interface MockProduct {
  id: string;
  slug: string;
  sku: string;
  name: { ar: string; en: string };
  category: { id: string; slug: string; nameAr: string; nameEn: string };
  tagline: { ar: string; en: string };
  description: { ar: string; en: string };
  liturgicalDetails: {
    origin: string;
    blessingStatus: string;
    materials: string;
    dimensions: string;
    weight: string;
  };
  price: number;
  originalPrice?: number;
  stock: number;
  rating: number;
  reviewCount: number;
  badge?: { ar: string; en: string; type: "gold" | "crimson" | "olive" };
  images: string[];
  isFeatured?: boolean;
  isArtisanal?: boolean;
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
    id: "cat-icons",
    slug: "coptic-byzantine-icons",
    name: { ar: "الأيقونات القبطية والبيزنطية", en: "Coptic & Byzantine Icons" },
    tagline: { ar: "نوافذ إلى الملكوت مرسومة بماء الذهب والصلوات الديرية", en: "Windows to Heaven painted with gold leaf & prayer" },
    description: { ar: "أيقونات أثرية مرسومة يدوياً على خشب الأرز والزان المعتق بطبقات الجسو والذهب عيار 24.", en: "Hand-painted icons on aged cedar and beech wood with 24K gold leaf and natural mineral pigments." },
    itemCount: 42,
    heroImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200",
    iconSvg: "cross",
  },
  {
    id: "cat-crosses",
    slug: "blessing-hand-crosses",
    name: { ar: "صلبان البركة والمذبح الفاخرة", en: "Altar & Blessing Crosses" },
    tagline: { ar: "صياغة مقدسة من الفضة الإسترلينية والنحاس الملكي المطروق", en: "Sacred craftsmanship in sterling silver & hand-hammered brass" },
    description: { ar: "صلبان يد كهنوتية وصلبان مذبح مزخرفة بحجر العقيق الفيروزي والأحجار الكريمة المستوحاة من التراث القبطي.", en: "Pectoral, blessing, and altar crosses inlaid with carnelian, turquoise, and liturgical filigree." },
    itemCount: 28,
    heroImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200",
    iconSvg: "sparkles",
  },
  {
    id: "cat-incense",
    slug: "holy-incense-burners",
    name: { ar: "البخور الديري والشورية الملكية", en: "Monastery Incense & Censers" },
    tagline: { ar: "عطور مقدسة تُرفع صلوات مع رائحة البخور الذكية", en: "Sacred monastic fragrances lifting prayers as evening incense" },
    description: { ar: "بخور مروكي وقبرصي طبيعي معتق من قلالي جبل آثوس ووادي النطرون، ومجامر نحاسية مسبوكة ذات أجراس رخيمة.", en: "Pure monastic frankincense from Mt. Athos and Nitrian Desert, with cast brass censers and tuned bells." },
    itemCount: 35,
    heroImage: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200",
    iconSvg: "flame",
  },
  {
    id: "cat-vestments",
    slug: "clerical-vestments-silk",
    name: { ar: "الحلل والملابس الكهنوتية", en: "Priestly Vestments & Silks" },
    tagline: { ar: "أقمشة بروكار دمشقية وتطريز ذهبي يدوي لأسرار الهيكل", en: "Damascus brocade silk & hand-embroidered liturgical vestments" },
    description: { ar: "أطقم تونية وبرنس وصدرة مكرسة للخدمة الطقسية محاكة بخيوط الحرير الخالص والذهب.", en: "Full sets of Coptic Sticharion, Felonion, and Epitachelion embroidered with 24K gold threads." },
    itemCount: 19,
    heroImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200",
    iconSvg: "crown",
  },
  {
    id: "cat-candles",
    slug: "pure-beeswax-candles",
    name: { ar: "شموع شمع العسل الصافي", en: "Pure Beeswax Tapers" },
    tagline: { ar: "نور المسيح يضيء للجميع من شمع العسل الطبيعي 100%", en: "The Light of Christ shining from 100% pure monastic beeswax" },
    description: { ar: "شموع مذبح وشموع صلاة مسحوبة يدوياً برائحة العسل البري النقية دون أي إضافات كيميائية.", en: "Hand-dipped liturgical tapers, smokeless and emitting a gentle natural honey aroma during holy liturgies." },
    itemCount: 24,
    heroImage: "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=1200",
    iconSvg: "sun",
  },
];

export const MOCK_PRODUCTS: MockProduct[] = [
  {
    id: "prod-pantocrator",
    slug: "byzantine-christ-pantocrator-icon-gold",
    sku: "ICON-PANTO-24K",
    name: {
      ar: "أيقونة ضابط الكل (المسيح البانتوقراطير) - ذهب عيار 24",
      en: "Christ Pantocrator Byzantine Icon (24K Gold Leaf)",
    },
    category: {
      id: "cat-icons",
      slug: "coptic-byzantine-icons",
      nameAr: "الأيقونات القبطية والبيزنطية",
      nameEn: "Coptic & Byzantine Icons",
    },
    tagline: {
      ar: "أيقونة أثرية مقدسة مرسومة يدوياً بالألوان المعدنية الطبيعية والمذهبة بورق الذهب الخالص",
      en: "Museum-grade liturgical icon hand-painted with egg tempera and 24K water-gilded halo",
    },
    description: {
      ar: "صُنعت هذه الأيقونة الميمونة في قلاية الرهبان الأرثوذكس بخشب السرو المعتق ومحمية بطبقة من الورنيش الصمغي الطبيعي. تبرز النظرة الرحيمة الهادئة لضابط الكل وهو يحمل الإنجيل المفتوح ويده المباركة ترتفع بالسلام للكنيسة الجامعة.",
      en: "Created in monastic silence using 15th-century egg-tempera techniques. Painted on aged, non-warping solid linden wood with linen backing and raised gesso borders. The halos and background are gilded with genuine 24-karat gold leaf.",
    },
    liturgicalDetails: {
      origin: "دير القديس أنطونيوس / صوامع جبل آثوس",
      blessingStatus: "مكرسة ومباركة ليتورجياً",
      materials: "خشب السرو المعتق، تمبرا البيض، ورق ذهب عيار 24",
      dimensions: "40 سم × 30 سم × 3.5 سم",
      weight: "1.85 كجم",
    },
    price: 4850,
    originalPrice: 5500,
    stock: 7,
    rating: 5,
    reviewCount: 38,
    badge: { ar: "إصدار ديري نادر", en: "Monastic Masterpiece", type: "gold" },
    isFeatured: true,
    isArtisanal: true,
    images: [
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200",
    ],
  },
  {
    id: "prod-theotokos",
    slug: "virgin-mary-theotokos-tenderness-icon",
    sku: "ICON-THEO-ELEO",
    name: {
      ar: "أيقونة والدة الإله الحنونة (الثيؤطوكوس إليوسا)",
      en: "Theotokos of Tenderness (Eleousa Byzantine Icon)",
    },
    category: {
      id: "cat-icons",
      slug: "coptic-byzantine-icons",
      nameAr: "الأيقونات القبطية والبيزنطية",
      nameEn: "Coptic & Byzantine Icons",
    },
    tagline: {
      ar: "تجسيد المحبة الإلهية الفائقة بين العذراء مريم والطفل الإلهي مذهبة بالكامل",
      en: "Tender embrace of the Mother of God holding the Christ Child, hand-finished in gold",
    },
    description: {
      ar: "أيقونة تعكس الرقة والحنان الأبوي والإلهي، مع التفاصيل الدقيقة لملابس العذراء ذات النجوم الثلاثة رمز دوام بتوليتها، والتذهيب المحفور يدوياً حول الهالات النورانية.",
      en: "Depicts the tender cheek-to-cheek embrace between the Mother of God and the Divine Infant. Features delicate hand-engraved halos with intricate Byzantine scrollwork.",
    },
    liturgicalDetails: {
      origin: "ورشة الفنون القبطية التراثية بالمعادي",
      blessingStatus: "مباركة بالبخور المقدس",
      materials: "خشب الزان، جسو تقليدي، ورق ذهب عيار 23.75",
      dimensions: "35 سم × 25 سم × 3 سم",
      weight: "1.4 كجم",
    },
    price: 3950,
    originalPrice: 4400,
    stock: 5,
    rating: 5,
    reviewCount: 29,
    badge: { ar: "الأكثر طلباً", en: "Bestseller", type: "crimson" },
    isFeatured: true,
    isArtisanal: true,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200",
    ],
  },
  {
    id: "prod-cross-silver",
    slug: "silver-blessing-hand-cross-filigree",
    sku: "CRS-BLESS-SLV925",
    name: {
      ar: "صليب بركة يد كهنوتي من الفضة الإسترلينية 925 المنقوشة",
      en: "Sterling Silver 925 Hand Blessing Cross with Filigree",
    },
    category: {
      id: "cat-crosses",
      slug: "blessing-hand-crosses",
      nameAr: "صلبان البركة والمذبح الفاخرة",
      nameEn: "Altar & Blessing Crosses",
    },
    tagline: {
      ar: "صياغة قبطية يدوية مفرغة بنقوش الصلبوت والقيامة ومرصعة بالعقيق الأحمر",
      en: "Master filigree casting with the Crucifixion & Resurrection and genuine carnelian gems",
    },
    description: {
      ar: "صليب يد أثري يُمسك به الأب الكاهن لمباركة شعب الله، مصاغ من أنقى عيارات الفضة الإسترلينية الخالصة مع تفريغات دقيقة لرموز الأناجيل الأربعة وتطعيم بالحجر الكريم في المركز.",
      en: "Crafted for liturgical blessings. Features the Crucifixion on the obverse and the Resurrection (Anastasis) on the reverse, flanked by traditional liturgical inscriptions and four carnelian cabochons.",
    },
    liturgicalDetails: {
      origin: "حي الصاغة التاريخي / خان الخليلي التراثي",
      blessingStatus: "صياغة مقدسة مكرسة",
      materials: "فضة إسترلينية 925، عقيق يماني أحمر، مقبض خشب الأبنوس",
      dimensions: "26 سم × 14 سم",
      weight: "480 جرام",
    },
    price: 6800,
    originalPrice: 7500,
    stock: 3,
    rating: 5,
    reviewCount: 16,
    badge: { ar: "فضة 925 خالصة", en: "Pure Silver 925", type: "gold" },
    isFeatured: true,
    isArtisanal: true,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200",
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200",
    ],
  },
  {
    id: "prod-athos-incense",
    slug: "mount-athos-monastic-frankincense-rose",
    sku: "INC-ATHOS-ROSE-500",
    name: {
      ar: "بخور جبل آثوس الديري الفاخر (شذى الورد البيزنطي) - 500 جم",
      en: "Mt. Athos Monastic Incense (Byzantine Rose) - 500g",
    },
    category: {
      id: "cat-incense",
      slug: "holy-incense-burners",
      nameAr: "البخور الديري والشورية الملكية",
      nameEn: "Monastery Incense & Censers",
    },
    tagline: {
      ar: "معجون يدوي من صمغ اللبان الطبيعي وخلاصة الزيوت العطرية النقية للصلوات",
      en: "Hand-kneaded natural olibanum gum infused with pure essential rose oils",
    },
    description: {
      ar: "يُحضر هذا البخور المقدس في صوامع الرهبان بجبل آثوس، حيث يُعجن صمغ اللبان الطبيعي النقي مع الزيوت العطرية العطرية وتُقطع يدوياً وتُرش بمسحوق المغنسيوم الطبيعي لمنع الالتصاق وتقديم دخان أبيض نقي يعبق بالمحبة والسكينة.",
      en: "Prepared by monks according to ancient Athonite cell recipes. Pure frankincense tears are powdered, infused with premium aromatic oils, hand-rolled, cut, and dusted with clay. Burns evenly with virtually zero carbon smoke.",
    },
    liturgicalDetails: {
      origin: "صومعة البشارة، جبل آثوس المقدس",
      blessingStatus: "معجون بالصلوات الممتدة",
      materials: "لبان حوجري نقي، زيت الورد العطري الطبيعي",
      dimensions: "صندوق خشبي مختوم 500 جرام",
      weight: "500 جرام صافي",
    },
    price: 980,
    originalPrice: 1150,
    stock: 24,
    rating: 5,
    reviewCount: 74,
    badge: { ar: "ديري أصيل", en: "Monastic Pure", type: "olive" },
    isFeatured: true,
    isArtisanal: true,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200",
      "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=1200",
    ],
  },
  {
    id: "prod-censer-bells",
    slug: "byzantine-brass-censer-twelve-bells",
    sku: "CENSER-BRASS-12B",
    name: {
      ar: "شورية بيزنطية ملكية من النحاس المسبوك باثني عشر جرساً",
      en: "Byzantine Brass Censer with Twelve Harmonized Bells",
    },
    category: {
      id: "cat-incense",
      slug: "holy-incense-burners",
      nameAr: "البخور الديري والشورية الملكية",
      nameEn: "Monastery Incense & Censers",
    },
    tagline: {
      ar: "صوت البشارة الطاهر مع سلاسل متوازنة وتفاصيل صلبان وقباب كنسية",
      en: "Resonant harmonious bells representing the Twelve Apostles with balanced triple chains",
    },
    description: {
      ar: "شورية طقسية مسبوكة من أجود أنواع النحاس الذهبي المقاوم للأكسدة والحرارة العالية، مع اثني عشر جرساً موزعة بدقة على السلاسل الثلاث لتعطي نغمة ليتورجية مهيبة أثناء التبخير.",
      en: "Hand-cast in heavy solid brass with gold protective lacquer. Features twelve tuned bells on the three suspension chains and a smoke chimney shaped as a Byzantine church dome with cross finial.",
    },
    liturgicalDetails: {
      origin: "المشاغل النحاسية التاريخية بدمياط",
      blessingStatus: "جاهزة للخدمة الطقسية",
      materials: "نحاس أصفر مسبوك، سلاسل حديدية ملبسة بالذهب",
      dimensions: "الارتفاع 28 سم، طول السلاسل 65 سم",
      weight: "1.25 كجم",
    },
    price: 2650,
    originalPrice: 2950,
    stock: 9,
    rating: 5,
    reviewCount: 22,
    badge: { ar: "نحاس مسبوك", en: "Cast Brass", type: "gold" },
    isFeatured: false,
    isArtisanal: true,
    images: [
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200",
    ],
  },
  {
    id: "prod-beeswax-candles",
    slug: "monastery-pure-beeswax-tapers-bundle",
    sku: "CNDL-BEES-100P",
    name: {
      ar: "حزمة شموع شمع العسل الصافي الديرية (100 شمعة صلاة)",
      en: "Monastic 100% Pure Beeswax Altar Tapers (Bundle of 100)",
    },
    category: {
      id: "cat-candles",
      slug: "pure-beeswax-candles",
      nameAr: "شموع شمع العسل الصافي",
      nameEn: "Pure Beeswax Tapers",
    },
    tagline: {
      ar: "شمع نحل نقي 100% مسحوب يدوياً خالي تماماً من البرافين والمواد الكيميائية",
      en: "Hand-dipped 100% pure honeybee wax, smokeless and sweet-smelling",
    },
    description: {
      ar: "شموع صلاة ليتورجية مسحوبة يدوياً في مناحل الأديرة، تحترق بثبات ودون دخان أسود، وتمنح المكان رائحة عسل البراري الصافي لخشوع أعمق أثناء التسابيح والصلوات.",
      en: "Pure yellow beeswax tapers prepared from monastery hives. Made with unbleached 100% cotton wicks. Smokeless, non-toxic, and burns with a luminous warm golden glow.",
    },
    liturgicalDetails: {
      origin: "مناحل دير السيدة العذراء السريان",
      blessingStatus: "شمع نقي مكرس للمذبح والصلوات",
      materials: "شمع عسل طبيعي 100%، فتيل قطن مصري خالص",
      dimensions: "الطول 25 سم، القطر 8 مم (100 شمعة)",
      weight: "1.2 كجم",
    },
    price: 490,
    originalPrice: 580,
    stock: 45,
    rating: 5,
    reviewCount: 91,
    badge: { ar: "شمع عسل 100%", en: "100% Beeswax", type: "olive" },
    isFeatured: true,
    isArtisanal: true,
    images: [
      "https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?q=80&w=1200",
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200",
    ],
  },
  {
    id: "prod-chalice-set",
    slug: "liturgical-communion-chalice-set-gold",
    sku: "CHAL-COMM-SET-24K",
    name: {
      ar: "طقم أواني المذبح المقدس (الكأس والصينية والملعقة والقبة) - مطلي بالذهب 24",
      en: "Holy Liturgical Chalice & Diskos Set (24K Gold Plated)",
    },
    category: {
      id: "cat-crosses",
      slug: "blessing-hand-crosses",
      nameAr: "صلبان البركة والمذبح الفاخرة",
      nameEn: "Altar & Blessing Crosses",
    },
    tagline: {
      ar: "أواني الخدمة الليتورجية الشريفة للأسرار المقدسة محفورة برموز الكرمة والسنبلة",
      en: "Noble sacred altar vessels for the Holy Mysteries, engraved with grapes & wheat",
    },
    description: {
      ar: "طقم الأواني الليتورجية المتكامل لصلاة القداس الإلهي، مصنع من النحاس الخالص المطلي بطبقة سميكة من الذهب عيار 24 الصالح للمس الأسرار المقدسة دون أي تفاعل كيميائي، مع نقوش دقيقة للأيقونات والصلبان.",
      en: "Complete Eucharist service set containing the Holy Chalice (Poterion), Paten (Diskos), Asterisk (Star), and Communion Spoon. Triple-plated with 24K gold ensuring sacred food-safe durability.",
    },
    liturgicalDetails: {
      origin: "ورشة الصياغة الكنسية بروما / أثينا",
      blessingStatus: "معدة للتدشين الكنسي",
      materials: "نحاس أحمر ثقيل، طلاء ذهب عيار 24 بسماكة 10 ميكرون",
      dimensions: "ارتفاع الكأس 29 سم، قطر الصينية 22 سم",
      weight: "2.4 كجم",
    },
    price: 18500,
    originalPrice: 21000,
    stock: 2,
    rating: 5,
    reviewCount: 9,
    badge: { ar: "إصدار المذبح المقدس", en: "Sacred Altar Edition", type: "gold" },
    isFeatured: true,
    isArtisanal: true,
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1200",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1200",
    ],
  },
];
