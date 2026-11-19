import { PrismaClient } from "@prisma/client";
import crypto from "crypto";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "../src/lib/fashionMockData";
import { SEASONAL_THEMES } from "../src/config/themes";

const prisma = new PrismaClient();

function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
}

async function main() {
  console.log("🌱 Starting FG Collective Fashion Database Seeding...");

  // Clean existing tables in proper relation order
  console.log("Cleaning old database records...");
  const delegates = [
    prisma.orderItem,
    prisma.order,
    prisma.cartItem,
    prisma.cart,
    prisma.wishlistItem,
    prisma.review,
    prisma.inventory,
    prisma.productVariant,
    prisma.productImage,
    prisma.productAlert,
    prisma.product,
    prisma.category,
    prisma.coupon,
    prisma.notification,
    prisma.themeSchedule,
    prisma.theme,
    prisma.address,
    prisma.profile,
    prisma.user,
  ];

  for (const model of delegates) {
    if (model && typeof (model as any).deleteMany === "function") {
      await (model as any).deleteMany().catch((err: any) => console.log("Skip clean:", err.message));
    }
  }

  // 1. Seed Users & Profiles (Demo Customer & Demo Admin)
  console.log("Seeding Demo Users...");
  
  // Demo Customer: demo.user@example.com / DemoUser123!
  const custSalt = crypto.randomBytes(16).toString("hex");
  const custHash = hashPassword("DemoUser123!", custSalt);

  const customerUser = await prisma.user.create({
    data: {
      email: "demo.user@example.com",
      passwordHash: custHash,
      salt: custSalt,
      phone: "01201234567",
      role: "USER",
      isEmailVerified: true,
      isPhoneVerified: true,
      profile: {
        create: {
          fullName: "عمر الشريف",
          parishName: "FG Collective Club Member",
        },
      },
      addresses: {
        create: {
          title: "المنزل",
          fullName: "عمر الشريف",
          phone: "01201234567",
          governorate: "القاهرة",
          city: "الزمالك",
          streetAddress: "شارع 26 يوليو، مبنى 12، الدور الرابع",
          isDefault: true,
        },
      },
    },
  });

  // Demo Admin: demo.admin@example.com / DemoAdmin123!
  const adminSalt = crypto.randomBytes(16).toString("hex");
  const adminHash = hashPassword("DemoAdmin123!", adminSalt);

  await prisma.user.create({
    data: {
      email: "demo.admin@example.com",
      passwordHash: adminHash,
      salt: adminSalt,
      phone: "01000000001",
      role: "ADMIN",
      isEmailVerified: true,
      isPhoneVerified: true,
      profile: {
        create: {
          fullName: "إدارة إف جي كوليكتيف",
          parishName: "FG Headquarters",
        },
      },
    },
  });

  // 2. Seed Categories
  console.log("Seeding FG Fashion Categories...");
  const categoryMap = new Map<string, string>();

  for (const cat of MOCK_CATEGORIES) {
    const createdCat = await prisma.category.create({
      data: {
        slug: cat.slug,
        nameAr: cat.name.ar,
        nameEn: cat.name.en,
        descAr: cat.description.ar,
        descEn: cat.description.en,
        image: cat.heroImage,
        itemCount: cat.itemCount,
      },
    });
    categoryMap.set(cat.id, createdCat.id);
  }

  // 3. Seed Products, Images, Variants & Inventory
  console.log("Seeding FG Fashion Products...");
  const createdProducts: any[] = [];

  for (const prod of MOCK_PRODUCTS) {
    const dbCategoryId = categoryMap.get(prod.category.id) || Array.from(categoryMap.values())[0];

    const createdProduct = await prisma.product.create({
      data: {
        slug: prod.slug,
        nameAr: prod.name.ar,
        nameEn: prod.name.en,
        shortDescAr: prod.tagline.ar,
        shortDescEn: prod.tagline.en,
        fullDescAr: prod.description.ar,
        fullDescEn: prod.description.en,
        categoryId: dbCategoryId,
        price: prod.price,
        originalPrice: prod.originalPrice || null,
        discountPercentage: prod.discountPercentage || null,
        stock: prod.stock,
        sku: prod.sku,
        isFeatured: prod.isFeatured || false,
        isBestSeller: prod.isBestSeller || false,
        rating: prod.rating,
        reviewCount: prod.reviewCount,
        specificationsJson: JSON.stringify({
          gsm: prod.fashionDetails.gsm,
          fabric: prod.fashionDetails.fabric,
          fit: prod.fashionDetails.fit,
          care: prod.fashionDetails.care,
          origin: prod.fashionDetails.origin,
          availableSizes: prod.sizes,
          availableColors: prod.colors,
        }),
        images: {
          create: prod.images.map((url, idx) => ({
            url,
            isPrimary: idx === 0,
            order: idx,
          })),
        },
        variants: {
          create: prod.sizes.map((sz, idx) => ({
            sku: `${prod.sku}-${sz}`,
            nameAr: `المقاس: ${sz}`,
            nameEn: `Size: ${sz}`,
            price: prod.price,
            stock: Math.floor(prod.stock / prod.sizes.length) + (idx === 0 ? prod.stock % prod.sizes.length : 0),
          })),
        },
        inventoryItem: {
          create: {
            sku: prod.sku,
            currentStock: prod.stock,
            lowStockThreshold: 10,
            safetyStock: 5,
            sellingPrice: prod.price,
            status: "IN_STOCK",
          },
        },
      },
    });

    createdProducts.push(createdProduct);
  }

  // 4. Seed Coupons
  console.log("Seeding Coupons...");
  await prisma.coupon.create({
    data: {
      code: "FG10",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 1000,
      maxDiscountAmount: 300,
      endDate: new Date("2027-12-31T23:59:59Z"),
      isActive: true,
      usageCount: 142,
      descAr: "خصم ترحيبي 10% لعملاء إف جي كوليكتيف",
      descEn: "10% Welcome discount for FG Collective members",
    },
  });

  await prisma.coupon.create({
    data: {
      code: "VIP20",
      discountType: "percentage",
      discountValue: 20,
      minOrderAmount: 2000,
      maxDiscountAmount: 800,
      endDate: new Date("2027-12-31T23:59:59Z"),
      isActive: true,
      usageCount: 65,
      descAr: "خصم حصري 20% لكبار عملاء إف جي",
      descEn: "Exclusive 20% discount for VIP members",
    },
  });

  // 5. Seed Orders
  console.log("Seeding Demo Orders...");
  const firstProd = createdProducts[0];
  const secondProd = createdProducts[1] || firstProd;

  await prisma.order.create({
    data: {
      orderNumber: "FG-90214",
      userId: customerUser.id,
      customerName: "عمر الشريف",
      customerEmail: "demo.user@example.com",
      customerPhone: "01201234567",
      governorate: "القاهرة",
      city: "الزمالك",
      streetAddress: "شارع 26 يوليو، مبنى 12، الدور الرابع",
      notes: "التوصيل بعد الساعة 4 مساءً",
      subtotal: 3100,
      shippingFee: 0,
      discountAmount: 310,
      total: 2790,
      paymentMethod: "cash_on_delivery",
      paymentStatus: "paid",
      orderStatus: "delivered",
      items: {
        create: [
          {
            productId: firstProd.id,
            productName: firstProd.nameAr,
            productImage: MOCK_PRODUCTS[0]?.images[0] || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800",
            price: firstProd.price,
            quantity: 1,
          },
          {
            productId: secondProd.id,
            productName: secondProd.nameAr,
            productImage: MOCK_PRODUCTS[1]?.images[0] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800",
            price: secondProd.price,
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
      titleAr: "طلب جديد: FG-90214",
      titleEn: "New Order: FG-90214",
      messageAr: "قام العميل عمر الشريف بطلب منتجات إف جي بقيمة 2,790 ج.م.",
      messageEn: "Omar El Sherif placed an order for FG items (2,790 EGP).",
      resourceId: "FG-90214",
      resourceType: "order",
      actionUrl: "/admin/orders",
      isRead: false,
    },
  });

  // 7. Seed Themes (All 7 Fashion Themes - Zero Halloween)
  console.log("Seeding All Fashion Themes...");
  for (const t of Object.values(SEASONAL_THEMES)) {
    await prisma.theme.create({
      data: {
        key: t.id,
        nameAr: t.name.ar,
        nameEn: t.name.en,
        descAr: t.description.ar,
        descEn: t.description.en,
        isActive: t.id === "default",
        bannerMessageAr: t.bannerMessage?.ar,
        bannerMessageEn: t.bannerMessage?.en,
        lightColorsJson: JSON.stringify(t.light),
        darkColorsJson: JSON.stringify(t.dark),
      },
    });
  }

  console.log("✅ FG Collective Fashion Database Seeded Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
