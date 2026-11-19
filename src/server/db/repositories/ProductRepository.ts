import { IProductService } from "@/services/interfaces/IProductService";
import { Category, Product, ProductReview } from "@/types/product";
import prisma from "../prisma";
import { telegramService } from "@/server/telegram/TelegramService";

export class PrismaProductRepository implements IProductService {
  private formatProduct(p: any): Product {
    let specs = {};
    try {
      specs = JSON.parse(p.specificationsJson || "{}");
    } catch {
      specs = {};
    }

    const variants = (p.variants || []).map((v: any) => ({
      id: v.id,
      name: { ar: v.nameAr, en: v.nameEn },
      sku: v.sku,
      price: v.price,
      stock: v.stock,
    }));

    return {
      id: p.id,
      slug: p.slug,
      name: { ar: p.nameAr, en: p.nameEn },
      shortDescription: { ar: p.shortDescAr, en: p.shortDescEn },
      fullDescription: { ar: p.fullDescAr, en: p.fullDescEn },
      categoryId: p.categoryId,
      categoryName: p.category ? { ar: p.category.nameAr, en: p.category.nameEn } : { ar: "قسم عام", en: "General" },
      price: p.price,
      originalPrice: p.originalPrice || undefined,
      discountPercentage: p.discountPercentage || undefined,
      stock: p.stock,
      sku: p.sku,
      images: p.images && p.images.length > 0 ? p.images.map((img: any) => img.url) : ["https://placehold.co/600x600?text=Product"],
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      rating: p.rating,
      reviewCount: p.reviewCount,
      specifications: specs,
      variants,
      createdAt: p.createdAt.toISOString(),
    };
  }

  async getProducts(params?: {
    category?: string;
    search?: string;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: "newest" | "price_asc" | "price_desc" | "rating";
  }): Promise<Product[]> {
    const where: any = {};

    if (params?.category) {
      where.OR = [
        { categoryId: params.category },
        { category: { slug: params.category } },
      ];
    }

    if (params?.search) {
      const q = params.search.trim();
      where.OR = [
        { nameAr: { contains: q } },
        { nameEn: { contains: q } },
        { sku: { contains: q } },
      ];
    }

    if (params?.isFeatured !== undefined) {
      where.isFeatured = params.isFeatured;
    }

    if (params?.isBestSeller !== undefined) {
      where.isBestSeller = params.isBestSeller;
    }

    if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
      where.price = {};
      if (params?.minPrice !== undefined) where.price.gte = params.minPrice;
      if (params?.maxPrice !== undefined) where.price.lte = params.maxPrice;
    }

    let orderBy: any = { createdAt: "desc" };
    if (params?.sortBy === "price_asc") orderBy = { price: "asc" };
    if (params?.sortBy === "price_desc") orderBy = { price: "desc" };
    if (params?.sortBy === "rating") orderBy = { rating: "desc" };

    const raw = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    });

    return raw.map((p) => this.formatProduct(p));
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    });
    return p ? this.formatProduct(p) : null;
  }

  async getProductById(id: string): Promise<Product | null> {
    const p = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
        variants: true,
      },
    });
    return p ? this.formatProduct(p) : null;
  }

  async getCategories(): Promise<Category[]> {
    const cats = await prisma.category.findMany({
      orderBy: { createdAt: "asc" },
    });
    return cats.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: { ar: c.nameAr, en: c.nameEn },
      description: { ar: c.descAr, en: c.descEn },
      image: c.image,
      itemCount: c.itemCount,
    }));
  }

  async getCategoryBySlug(slug: string): Promise<Category | null> {
    const c = await prisma.category.findUnique({ where: { slug } });
    if (!c) return null;
    return {
      id: c.id,
      slug: c.slug,
      name: { ar: c.nameAr, en: c.nameEn },
      description: { ar: c.descAr, en: c.descEn },
      image: c.image,
      itemCount: c.itemCount,
    };
  }

  async createCategory(data: {
    slug?: string;
    name: { ar: string; en: string };
    description: { ar: string; en: string };
    image: string;
  }): Promise<Category> {
    const slug = data.slug || data.name.en.toLowerCase().replace(/[^a-z0-9]/g, "-") || `cat-${Date.now()}`;
    const c = await prisma.category.create({
      data: {
        slug,
        nameAr: data.name.ar,
        nameEn: data.name.en,
        descAr: data.description.ar,
        descEn: data.description.en,
        image: data.image,
      },
    });
    return {
      id: c.id,
      slug: c.slug,
      name: { ar: c.nameAr, en: c.nameEn },
      description: { ar: c.descAr, en: c.descEn },
      image: c.image,
      itemCount: 0,
    };
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return this.getProducts({ isFeatured: true });
  }

  async getRelatedProducts(productId: string, categoryId: string): Promise<Product[]> {
    const raw = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
      },
      take: 4,
      include: {
        category: true,
        images: { orderBy: { order: "asc" } },
      },
    });
    return raw.map((p) => this.formatProduct(p));
  }

  async createProduct(data: Omit<Product, "id" | "createdAt" | "rating" | "reviewCount">): Promise<Product> {
    const p = await prisma.product.create({
      data: {
        slug: data.slug,
        nameAr: data.name.ar,
        nameEn: data.name.en,
        shortDescAr: data.shortDescription.ar,
        shortDescEn: data.shortDescription.en,
        fullDescAr: data.fullDescription.ar,
        fullDescEn: data.fullDescription.en,
        categoryId: data.categoryId,
        price: data.price,
        originalPrice: data.originalPrice,
        discountPercentage: data.discountPercentage,
        stock: data.stock,
        sku: data.sku,
        isFeatured: data.isFeatured || false,
        isBestSeller: data.isBestSeller || false,
        specificationsJson: JSON.stringify(data.specifications || {}),
        images: {
          create: data.images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            order: i,
          })),
        },
        inventoryItem: {
          create: {
            sku: data.sku,
            currentStock: data.stock,
            lowStockThreshold: 10,
            safetyStock: 2,
            sellingPrice: data.price,
            unitCost: data.price * 0.7,
            status: data.stock > 10 ? "in_stock" : data.stock > 0 ? "low_stock" : "out_of_stock",
          },
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    const formatted = this.formatProduct(p);

    if (data.stock <= 5) {
      telegramService.notifyStockAlert(formatted, data.stock).catch((err) => {
        console.warn("[Telegram] Stock alert broadcast error:", err.message);
      });
    }

    return formatted;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    const updateData: any = {};
    if (data.name) {
      updateData.nameAr = data.name.ar;
      updateData.nameEn = data.name.en;
    }
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.isFeatured !== undefined) updateData.isFeatured = data.isFeatured;

    const p = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true, images: true },
    });
    const formatted = this.formatProduct(p);

    if (data.stock !== undefined && data.stock <= 5) {
      telegramService.notifyStockAlert(formatted, data.stock).catch((err) => {
        console.warn("[Telegram] Stock alert broadcast error:", err.message);
      });
    }

    return formatted;
  }

  async deleteProduct(id: string): Promise<boolean> {
    await prisma.product.delete({ where: { id } });
    return true;
  }

  async updateProductStock(
    productId: string,
    delta: number,
    source: "admin_dashboard" | "telegram_bot" = "admin_dashboard"
  ): Promise<Product> {
    const current = await prisma.product.findUnique({ where: { id: productId } });
    if (!current) throw new Error("Product not found");

    const newStock = Math.max(0, current.stock + delta);
    const newStatus = newStock > 10 ? "in_stock" : newStock > 0 ? "low_stock" : "out_of_stock";

    // Update product and inventory atomically
    const [p] = await prisma.$transaction([
      prisma.product.update({
        where: { id: productId },
        data: { stock: newStock },
        include: { category: true, images: true },
      }),
      prisma.inventory.updateMany({
        where: { productId },
        data: {
          currentStock: newStock,
          status: newStatus,
          lastUpdatedSource: source,
          lastRestockedAt: delta > 0 ? new Date() : undefined,
        },
      }),
    ]);

    const formatted = this.formatProduct(p);

    if (newStock <= 5) {
      telegramService.notifyStockAlert(formatted, newStock).catch((err) => {
        console.warn("[Telegram] Stock alert broadcast error:", err.message);
      });
    }

    return formatted;
  }

  async addVariant(
    productId: string,
    data: { name: { ar: string; en: string }; sku: string; price: number; stock: number }
  ) {
    const v = await prisma.productVariant.create({
      data: {
        productId,
        sku: data.sku,
        nameAr: data.name.ar,
        nameEn: data.name.en,
        price: data.price,
        stock: data.stock,
      },
    });
    return {
      id: v.id,
      sku: v.sku,
      name: { ar: v.nameAr, en: v.nameEn },
      price: v.price,
      stock: v.stock,
    };
  }

  async addReview(productId: string, review: Omit<ProductReview, "id" | "createdAt">): Promise<ProductReview> {
    const r = await prisma.review.create({
      data: {
        productId,
        userName: review.userName,
        rating: review.rating,
        comment: review.comment,
      },
    });

    // Recompute product rating
    const allRevs = await prisma.review.findMany({ where: { productId } });
    const avg = allRevs.reduce((sum, item) => sum + item.rating, 0) / allRevs.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Number(avg.toFixed(1)),
        reviewCount: allRevs.length,
      },
    });

    return {
      id: r.id,
      userId: r.userId || "guest",
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    };
  }

  async getProductReviews(productId: string): Promise<ProductReview[]> {
    const revs = await prisma.review.findMany({
      where: { productId },
      orderBy: { createdAt: "desc" },
    });
    return revs.map((r) => ({
      id: r.id,
      userId: r.userId || "guest",
      userName: r.userName,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt.toISOString(),
    }));
  }
}

export const productPrismaRepository = new PrismaProductRepository();
