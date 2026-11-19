import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { getAuthenticatedUser } from "@/server/middleware/auth";
import { ConflictError, NotFoundError, ValidationError } from "@/server/errors/AppError";
import prisma from "@/server/db/prisma";

function getSessionId(req: NextRequest): string {
  return req.cookies.get("cart_session")?.value || req.headers.get("x-session-id") || "guest-session";
}

export const GET = apiHandler(
  async (req: NextRequest) => {
    const user = getAuthenticatedUser(req);
    const sessionId = getSessionId(req);

    const cart = await prisma.cart.findFirst({
      where: user ? { userId: user.id } : { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { images: true, category: true },
            },
          },
        },
      },
    });

    if (!cart) {
      return { items: [], subtotal: 0, totalItems: 0 };
    }

    const items = cart.items.map((it) => ({
      id: it.id,
      productId: it.productId,
      productName: { ar: it.product.nameAr, en: it.product.nameEn },
      productImage: it.product.images?.[0]?.url || "https://placehold.co/600x600?text=Product",
      price: it.product.price,
      quantity: it.quantity,
      variantName: it.variantName || undefined,
      availableStock: it.product.stock,
      isOutOfStock: it.product.stock === 0,
      isLowStock: it.product.stock > 0 && it.product.stock <= 10,
    }));

    const subtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    const totalItems = items.reduce((sum, it) => sum + it.quantity, 0);

    return { items, subtotal, totalItems, cartId: cart.id };
  },
  { contextName: "CartAPI" }
);

export const POST = apiHandler(
  async (req: NextRequest) => {
    const user = getAuthenticatedUser(req);
    const sessionId = getSessionId(req);
    const body = await req.json();

    const { productId, quantity = 1, variantName } = body;
    if (!productId) {
      throw new ValidationError("productId is required");
    }

    // 1. Validate real stock in database
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundError(`Product '${productId}'`);
    }

    if (product.stock < quantity) {
      throw new ConflictError(
        `عفواً، الكمية المطلوبة (${quantity}) غير متاحة. المتبقي في المخزون: ${product.stock} فقط.`
      );
    }

    // 2. Find or create cart
    let cart = await prisma.cart.findFirst({
      where: user ? { userId: user.id } : { sessionId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user?.id,
          sessionId: user ? undefined : sessionId,
        },
      });
    }

    // 3. Upsert cart item
    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        variantName: variantName || null,
      },
    });

    if (existingItem) {
      const newQty = body.replaceQuantity ? quantity : existingItem.quantity + quantity;
      if (newQty > product.stock) {
        throw new ConflictError(
          `عفواً، لا يمكن إضافة المزيد. الحد الأقصى المتاح بالمخزون: ${product.stock} قطعة فقط.`
        );
      }

      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQty },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          variantName,
        },
      });
    }

    return { success: true, message: "Cart updated successfully" };
  },
  { contextName: "CartAPI" }
);

export const DELETE = apiHandler(
  async (req: NextRequest) => {
    const user = getAuthenticatedUser(req);
    const sessionId = getSessionId(req);
    const searchParams = req.nextUrl.searchParams;
    const itemId = searchParams.get("itemId");
    const clearAll = searchParams.get("clear") === "true";

    const cart = await prisma.cart.findFirst({
      where: user ? { userId: user.id } : { sessionId },
    });

    if (!cart) {
      return { success: true };
    }

    if (clearAll) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
      return { success: true, cleared: true };
    }

    if (itemId) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id, id: itemId },
      });
    }

    return { success: true };
  },
  { contextName: "CartAPI" }
);
