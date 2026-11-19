import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { getAuthenticatedUser } from "@/server/middleware/auth";
import { NotFoundError, ValidationError } from "@/server/errors/AppError";
import prisma from "@/server/db/prisma";

export const GET = apiHandler(
  async (req: NextRequest) => {
    const user = getAuthenticatedUser(req);
    // If not authenticated, return empty or fallback user's wishlist
    const userId = user?.id || (await prisma.user.findFirst())?.id;
    if (!userId) {
      return [];
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          include: { images: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return items.map((w) => ({
      id: w.id,
      productId: w.productId,
      product: {
        id: w.product.id,
        slug: w.product.slug,
        name: { ar: w.product.nameAr, en: w.product.nameEn },
        price: w.product.price,
        originalPrice: w.product.originalPrice || undefined,
        stock: w.product.stock,
        images: w.product.images?.map((i) => i.url) || [],
        rating: w.product.rating,
        reviewCount: w.product.reviewCount,
      },
      createdAt: w.createdAt.toISOString(),
    }));
  },
  { contextName: "WishlistAPI" }
);

export const POST = apiHandler(
  async (req: NextRequest) => {
    const user = getAuthenticatedUser(req);
    const userId = user?.id || (await prisma.user.findFirst())?.id;
    if (!userId) {
      throw new ValidationError("User account required for wishlist");
    }

    const body = await req.json();
    const { productId } = body;
    if (!productId) {
      throw new ValidationError("productId is required");
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existing) {
      // Toggle off
      await prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return { isInWishlist: false, productId };
    }

    await prisma.wishlistItem.create({
      data: {
        userId,
        productId,
      },
    });

    return { isInWishlist: true, productId };
  },
  { contextName: "WishlistAPI" }
);

export const DELETE = apiHandler(
  async (req: NextRequest) => {
    const user = getAuthenticatedUser(req);
    const userId = user?.id || (await prisma.user.findFirst())?.id;
    const searchParams = req.nextUrl.searchParams;
    const productId = searchParams.get("productId");

    if (userId && productId) {
      await prisma.wishlistItem.deleteMany({
        where: { userId, productId },
      });
    }

    return { success: true };
  },
  { contextName: "WishlistAPI" }
);
