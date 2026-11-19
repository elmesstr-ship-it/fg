import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

async function main() {
  console.log("🌱 Starting Church Products Database Seeding...");

  // 1. Seed Users & Profiles
  console.log("Seeding Users & Profiles...");
  const custSalt = crypto.randomBytes(16).toString("hex");
  const custHash = hashPassword("Customer@1234", custSalt);

  const customerUser = await prisma.user.upsert({
    where: { email: "mina.girgis@example.com" },
    update: {},
    create: {
      email: "mina.girgis@example.com",
      passwordHash: custHash,
      salt: custSalt,
      phone: "01201234567",
      role: "USER",
      isEmailVerified: true,
      isPhoneVerified: true,
      profile: {
        create: {
          fullName: "مينا رفيق جرجس",
          parishName: "كنيسة السيدة العذراء مريم - المعادي",
        },
      },
      addresses: {
        create: {
          title: "المنزل",
          fullName: "مينا رفيق جرجس",
          phone: "01201234567",
          governorate: "القاهرة",
          city: "المعادي",
          streetAddress: "شارع النصر، عمارة 14، الدور الثالث",
          isDefault: true,
        },
      },
    },
  });

  const adminSalt = crypto.randomBytes(16).toString("hex");
  const adminHash = hashPassword("Admin@Holy2026", adminSalt);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@sanctamaria-store.com" },
    update: {},
    create: {
      email: "admin@sanctamaria-store.com",
      passwordHash: adminHash,
      salt: adminSalt,
      phone: "01000000001",
      role: "ADMIN",
      isEmailVerified: true,
      isPhoneVerified: true,
      profile: {
        create: {
          fullName: "مشرف النظام الإداري (رئيسي)",
          parishName: "المقر الإداري - سانكتا ماريا",
        },
      },
    },
  });

  // 2. Seed Categories
  console.log("Seeding Categories...");
  const catIcons = await prisma.category.upsert({
    where: { slug: "sacred-icons" },
    update: {},
    create: {
      slug: "sacred-icons",
      nameAr: "أيقونات قبطية وبيزنطية مقدسة",
      nameEn: "Sacred Coptic & Byzantine Icons",
      descAr: "أيقونات أثرية مرسومة يدوياً ومطلية بماء الذهب عيار 24 طبقاً للطقس الكنسي الأصيل",
      descEn: "Hand-painted 24k gold leaf Byzantine and Coptic icons created with traditional monastic techniques",
      image: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800&auto=format&fit=crop",
      itemCount: 24,
    },
  });

  const catCensers = await prisma.category.upsert({
    where: { slug: "altar-vessels-censers" },
    update: {},
    create: {
      slug: "altar-vessels-censers",
      nameAr: "أواني المذبح والمجامر الطقسية",
      nameEn: "Altar Vessels & Handcrafted Censers",
      descAr: "كؤوس وصواني طقسية ومجامر نحاسية مذهبة وفضية محفورة بصلبان ورموز الآباء",
      descEn: "Chalice and paten sets, silver and gold plated brass censers with liturgical harmonic bells",
      image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=800&auto=format&fit=crop",
      itemCount: 18,
    },
  });

  const catIncense = await prisma.category.upsert({
    where: { slug: "pure-incense-candles" },
    update: {},
    create: {
      slug: "pure-incense-candles",
      nameAr: "بخور ديري أصيل وشموع نقية",
      nameEn: "Monastery Incense & Pure Candles",
      descAr: "أفخر أنواع بخور جبل آثوس والأديرة المصرية وشموع شمع عسل النحل الطبيعي 100% غير المدخنة",
      descEn: "Mount Athos aromatic incense, Egyptian monastic blends, and pure beeswax taper candles",
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop",
      itemCount: 32,
    },
  });

  // 3. Seed Products & Inventory
  console.log("Seeding Products & Inventory...");
  const prod1 = await prisma.product.upsert({
    where: { slug: "byzantine-christ-pantocrator-icon" },
    update: {},
    create: {
      slug: "byzantine-christ-pantocrator-icon",
      nameAr: "أيقونة السيد المسيح ضابط الكل (بانطوقراطور)",
      nameEn: "Christ Pantocrator Gold Leaf Icon",
      shortDescAr: "أيقونة خشبية أثرية مذهبة عيار 24 يدوية الصنع بألوان طبيعية ثابتة",
      shortDescEn: "Handcrafted 24k gold leaf egg tempera wood icon on solid aged linden wood",
      fullDescAr: "أيقونة طقسية مقدسة تجسد السيد المسيح ضابط الكل وفقاً للفن البيزنطي والقبطي العريق.",
      fullDescEn: "A solemn, sacred depiction of Christ Pantocrator adhering to venerable Coptic and Byzantine iconography.",
      categoryId: catIcons.id,
      price: 3200,
      originalPrice: 3800,
      discountPercentage: 15,
      stock: 7,
      sku: "ICON-PANT-01",
      isFeatured: true,
      isBestSeller: true,
      rating: 4.9,
      reviewCount: 38,
      specificationsJson: JSON.stringify({
        dimensions: { ar: "30 × 40 سم", en: "30 x 40 cm" },
        material: { ar: "خشب زان طبيعي مذهب", en: "Aged solid wood with 24k gold leaf" },
      }),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          },
        ],
      },
      inventoryItem: {
        create: {
          sku: "ICON-PANT-01",
          currentStock: 7,
          lowStockThreshold: 10,
          safetyStock: 3,
          unitCost: 2200,
          sellingPrice: 3200,
          status: "low_stock",
          lastUpdatedSource: "admin_dashboard",
        },
      },
    },
  });

  const prod2 = await prisma.product.upsert({
    where: { slug: "ornate-byzantine-liturgical-censer" },
    update: {},
    create: {
      slug: "ornate-byzantine-liturgical-censer",
      nameAr: "شورية (مجمرة) طقسية نحاسية مذهبة بأجراس نغمية",
      nameEn: "Imperial Ornate Liturgical Brass Censer",
      shortDescAr: "مجمرة مذبح كنسية نحاسية ثقيلة مع 12 جرس منغم وسلاسل فولاذية صلبة",
      shortDescEn: "Heavy gold-plated brass thurible adorned with 12 harmonic bells and cross finial",
      fullDescAr: "مجمرة كنسية (شورية) فاخرة مصنوعة من النحاس الخالص المطلي بالذهب غير القابل للتغير.",
      fullDescEn: "An exquisite liturgical thurible forged from high-purity brass and electroplated with enduring gold luster.",
      categoryId: catCensers.id,
      price: 2450,
      originalPrice: 2800,
      discountPercentage: 12,
      stock: 14,
      sku: "ALTR-CENS-02",
      isFeatured: true,
      isBestSeller: false,
      rating: 4.8,
      reviewCount: 22,
      specificationsJson: JSON.stringify({
        dimensions: { ar: "ارتفاع 26 سم - سلاسل 70 سم", en: "Height 26 cm - Chains 70 cm" },
        material: { ar: "نحاس صلب مذهب عالي النقاوة", en: "Pure Gold-Plated Solid Brass" },
      }),
      images: {
        create: [
          {
            url: "https://images.unsplash.com/photo-1519817650390-64a93db51149?q=80&w=1000&auto=format&fit=crop",
            isPrimary: true,
            order: 0,
          },
        ],
      },
      inventoryItem: {
        create: {
          sku: "ALTR-CENS-02",
          currentStock: 14,
          lowStockThreshold: 8,
          safetyStock: 2,
          unitCost: 1700,
          sellingPrice: 2450,
          status: "in_stock",
          lastUpdatedSource: "telegram_bot",
        },
      },
    },
  });

  // 4. Seed Coupons
  console.log("Seeding Coupons...");
  await prisma.coupon.upsert({
    where: { code: "SANCTA10" },
    update: {},
    create: {
      code: "SANCTA10",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 500,
      maxDiscountAmount: 300,
      endDate: new Date("2027-12-31T23:59:59Z"),
      isActive: true,
      usageCount: 142,
      descAr: "خصم ترحيبي 10% لجميع المقتنيات الكنسية",
      descEn: "10% Welcome discount on all liturgical supplies",
    },
  });

  await prisma.coupon.upsert({
    where: { code: "NATIVITY20" },
    update: {},
    create: {
      code: "NATIVITY20",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 2000,
      maxDiscountAmount: 600,
      endDate: new Date("2027-01-10T23:59:59Z"),
      isActive: true,
      usageCount: 88,
      descAr: "خصم موسم صوم وعيد الميلاد المجيد 20%",
      descEn: "20% Holy Nativity feast season blessing",
    },
  });

  // 5. Seed Orders
  console.log("Seeding Orders...");
  await prisma.order.upsert({
    where: { orderNumber: "SM-829104" },
    update: {},
    create: {
      orderNumber: "SM-829104",
      userId: customerUser.id,
      customerName: "مينا رفيق جرجس",
      customerEmail: "mina.girgis@example.com",
      customerPhone: "01201234567",
      governorate: "القاهرة",
      city: "المعادي",
      streetAddress: "شارع النصر، عمارة 14، الدور الثالث",
      notes: "تسليم هادئ ومؤمّن للأيقونة",
      subtotal: 3200,
      shippingFee: 0,
      discountAmount: 0,
      total: 3200,
      paymentMethod: "cash_on_delivery",
      paymentStatus: "pending",
      orderStatus: "processing",
      trackingNumber: "EGY-EXP-992144",
      shippingProvider: "Bosta Logistics",
      items: {
        create: [
          {
            productId: prod1.id,
            productName: "أيقونة السيد المسيح ضابط الكل (بانطوقراطور)",
            productImage: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=600",
            price: 3200,
            quantity: 1,
          },
        ],
      },
    },
  });

  // 6. Seed Notifications
  console.log("Seeding Notifications...");
  await prisma.notification.create({
    data: {
      type: "new_order",
      priority: "high",
      titleAr: "طلب جديد وارد: SM-829104",
      titleEn: "New Order: SM-829104",
      messageAr: "قام العميل مينا رفيق بطلب أيقونة السيد المسيح ضابط الكل بمبلغ 3,200 ج.م.",
      messageEn: "Mina Girgis placed an order for Christ Pantocrator Icon (3,200 EGP).",
      resourceId: "SM-829104",
      resourceType: "order",
      actionUrl: "/admin/orders",
      isRead: false,
    },
  });

  // 7. Seed Themes
  console.log("Seeding Themes & Schedules...");
  await prisma.theme.upsert({
    where: { key: "default" },
    update: {},
    create: {
      key: "default",
      nameAr: "السمة الكنسية الملكية (الافتراضية)",
      nameEn: "Royal Liturgical (Default)",
      descAr: "سمة كنسية فاخرة بلمسات العنابي الداكن والذهب الروماني",
      descEn: "Luxurious ecclesiastical theme with deep burgundy and Roman gold accents",
      isActive: true,
      lightColorsJson: JSON.stringify({ primary: "#5A1827", gold: "#C5A059", bg: "#FAF8F5" }),
      darkColorsJson: JSON.stringify({ primary: "#8B263E", gold: "#D4AF37", bg: "#120F10" }),
    },
  });

  await prisma.theme.upsert({
    where: { key: "christmas" },
    update: {},
    create: {
      key: "christmas",
      nameAr: "سمة عيد الميلاد المجيد",
      nameEn: "Holy Nativity & Christmas",
      descAr: "ألوان ميلادية مقدسة بالأحمر القرمزي والزمردي والأضواء الذهبية",
      descEn: "Sacred Christmas crimson, forest green, and radiant starlight gold",
      isActive: false,
      bannerMessageAr: "المجد لله في الأعالي وعلى الأرض السلام - احتفالات عيد الميلاد المجيد",
      bannerMessageEn: "Glory to God in the highest, and on earth peace - Holy Christmas Celebration",
      lightColorsJson: JSON.stringify({ primary: "#851419", gold: "#D4AF37", bg: "#FBF7F5" }),
      darkColorsJson: JSON.stringify({ primary: "#A31D23", gold: "#E0B738", bg: "#140E0F" }),
      schedules: {
        create: {
          startDate: new Date("2026-11-20T00:00:00Z"),
          endDate: new Date("2027-01-08T23:59:59Z"),
          autoRevert: true,
          status: "scheduled",
        },
      },
    },
  });

  console.log("✅ Church Products Database Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
