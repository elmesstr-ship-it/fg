import { IOrderService, CreateOrderDTO } from "@/services/interfaces/IOrderService";
import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/types/order";
import { ConflictError, ValidationError } from "@/server/errors/AppError";
import { productPrismaRepository } from "./ProductRepository";
import prisma from "../prisma";
import { telegramService } from "@/server/telegram/TelegramService";

export class PrismaOrderRepository implements IOrderService {
  private formatOrder(o: any): Order {
    return {
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      shippingAddress: {
        fullName: o.customerName,
        phone: o.customerPhone,
        governorate: o.governorate,
        city: o.city,
        streetAddress: o.streetAddress,
        notes: o.notes || undefined,
      },
      items: (o.items || []).map((it: any) => ({
        productId: it.productId,
        productName: {
          ar: it.productName,
          en: it.productName,
        },
        productImage: it.productImage,
        price: it.price,
        quantity: it.quantity,
        variantName: it.variantName || undefined,
      })),
      subtotal: o.subtotal,
      shippingFee: o.shippingFee,
      discountAmount: o.discountAmount,
      total: o.total,
      paymentMethod: o.paymentMethod as PaymentMethod,
      paymentStatus: o.paymentStatus as PaymentStatus,
      orderStatus: o.orderStatus as OrderStatus,
      trackingNumber: o.trackingNumber || undefined,
      shippingProvider: o.shippingProvider || undefined,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    };
  }

  private generateUniqueOrderId(): string {
    const now = new Date();
    const y = now.getFullYear().toString().slice(-2);
    const m = (now.getMonth() + 1).toString().padStart(2, "0");
    const d = now.getDate().toString().padStart(2, "0");
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `SM-${y}${m}${d}-${rand}`;
  }

  async getOrders(params?: {
    status?: OrderStatus;
    search?: string;
    customerEmail?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    paymentMethod?: string;
  }): Promise<Order[]> {
    const where: any = {};

    if (params?.status) {
      where.orderStatus = params.status;
    }

    if (params?.customerEmail) {
      where.customerEmail = params.customerEmail;
    }

    if (params?.paymentMethod) {
      where.paymentMethod = params.paymentMethod;
    }

    if (params?.startDate || params?.endDate) {
      where.createdAt = {};
      if (params?.startDate) where.createdAt.gte = new Date(params.startDate);
      if (params?.endDate) {
        const end = new Date(params.endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    if (params?.search) {
      const q = params.search.trim();
      where.OR = [
        { orderNumber: { contains: q } },
        { customerName: { contains: q } },
        { customerPhone: { contains: q } },
        { trackingNumber: { contains: q } },
      ];
    }

    const raw = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
      },
    });

    return raw.map((o) => this.formatOrder(o));
  }

  async getOrderById(id: string): Promise<Order | null> {
    const o = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });
    return o ? this.formatOrder(o) : null;
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    const o = await prisma.order.findUnique({
      where: { orderNumber },
      include: { items: true },
    });
    return o ? this.formatOrder(o) : null;
  }

  async getCustomerOrders(customerEmail: string): Promise<Order[]> {
    const raw = await prisma.order.findMany({
      where: { customerEmail },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });
    return raw.map((o) => this.formatOrder(o));
  }

  async createOrder(data: CreateOrderDTO): Promise<Order> {
    if (!data.items || data.items.length === 0) {
      throw new ValidationError("Order must contain at least one item.");
    }

    // ACID Transaction for Atomic Stock Validation, Inventory Decrement, and Order Creation
    const created = await prisma.$transaction(async (tx) => {
      // 1. Transactional Stock Validation & Decrement
      for (const item of data.items) {
        const prod = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });

        if (!prod) {
          throw new ConflictError(`الصنف المطلوب غير موجود: ${item.productId}`);
        }

        // Check variant stock if variant is selected
        if (item.variantId) {
          const variant = (prod.variants || []).find((v) => v.id === item.variantId);
          if (variant && variant.stock < item.quantity) {
            throw new ConflictError(
              `عفواً، الكمية المطلوبة من الصنف (${prod.nameAr} - ${variant.nameAr}) غير متاحة. المتبقي: ${variant.stock} فقط.`
            );
          }
          if (variant) {
            await tx.productVariant.update({
              where: { id: variant.id },
              data: { stock: { decrement: item.quantity } },
            });
          }
        }

        // Strict stock validation to prevent overselling
        if (prod.stock < item.quantity) {
          throw new ConflictError(
            `عفواً، نفد المخزون أو الكمية المطلوبة من (${prod.nameAr}) غير متاحة. المتبقي بالمخزون: ${prod.stock} قطعة فقط.`
          );
        }

        const newStock = prod.stock - item.quantity;
        const newStatus = newStock === 0 ? "out_of_stock" : newStock <= 10 ? "low_stock" : "in_stock";

        // Decrement product stock atomically
        await tx.product.update({
          where: { id: prod.id },
          data: { stock: { decrement: item.quantity } },
        });

        // Decrement inventory record
        await tx.inventory.updateMany({
          where: { productId: prod.id },
          data: {
            currentStock: { decrement: item.quantity },
            status: newStatus,
            lastUpdatedSource: "order_placement",
          },
        });

        // If stock reaches low or out of stock, trigger alert
        if (newStatus === "low_stock" || newStatus === "out_of_stock") {
          await tx.notification.create({
            data: {
              type: newStatus,
              priority: "urgent",
              titleAr: `تنبيه مخزون: ${prod.sku}`,
              titleEn: `Inventory Alert: ${prod.sku}`,
              messageAr: `المتبقي من ${prod.nameAr} انخفض إلى ${newStock} قطعة فقط.`,
              messageEn: `Stock for ${prod.nameEn} dropped to ${newStock} units.`,
              resourceId: prod.id,
              resourceType: "product",
              actionUrl: "/admin/products",
              isRead: false,
            },
          });
        }
      }

      // 2. Subtotal and Shipping calculation
      const subtotal = data.items.reduce((s, it) => s + it.price * it.quantity, 0);
      const shippingFee = subtotal >= 2000 ? 0 : 75;

      // 3. Coupon Validation inside transaction
      let discountAmount = 0;
      if (data.couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: { code: data.couponCode.trim().toUpperCase() },
        });

        if (coupon && coupon.isActive && new Date() <= coupon.endDate) {
          if (!coupon.usageLimit || coupon.usageCount < coupon.usageLimit) {
            if (!coupon.minOrderAmount || subtotal >= coupon.minOrderAmount) {
              if (coupon.discountType === "percentage") {
                discountAmount = (subtotal * coupon.discountValue) / 100;
                if (coupon.maxDiscountAmount) {
                  discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
                }
              } else {
                discountAmount = coupon.discountValue;
              }
              discountAmount = Math.round(discountAmount);

              // Increment coupon usage
              await tx.coupon.update({
                where: { id: coupon.id },
                data: { usageCount: { increment: 1 } },
              });
            }
          }
        }
      }

      const total = Math.max(0, subtotal + shippingFee - discountAmount);
      const orderNumber = this.generateUniqueOrderId();
      const trackingNumber = "EGY-EXP-" + Math.floor(100000 + Math.random() * 900000);

      // Find user if exists
      const existingUser = await tx.user.findUnique({
        where: { email: data.customerEmail },
      });

      // 4. Create Order in database
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: existingUser?.id || undefined,
          customerName: data.customerName,
          customerEmail: data.customerEmail,
          customerPhone: data.customerPhone,
          governorate: data.shippingAddress.governorate,
          city: data.shippingAddress.city,
          streetAddress: data.shippingAddress.streetAddress,
          notes: data.shippingAddress.notes,
          subtotal,
          shippingFee,
          discountAmount,
          total,
          paymentMethod: data.paymentMethod,
          paymentStatus: data.paymentMethod === "credit_card" ? "paid" : "pending",
          orderStatus: "processing",
          trackingNumber,
          shippingProvider: "Bosta Logistics",
          items: {
            create: data.items.map((it) => ({
              productId: it.productId,
              productName: typeof it.productName === "string" ? it.productName : it.productName.ar,
              productImage: it.productImage,
              price: it.price,
              quantity: it.quantity,
              variantName: it.variantName,
            })),
          },
        },
        include: {
          items: true,
        },
      });

      // 5. System Notification for Admin
      await tx.notification.create({
        data: {
          type: "new_order",
          priority: "high",
          titleAr: `طلب جديد وارد: ${orderNumber}`,
          titleEn: `New Order: ${orderNumber}`,
          messageAr: `قام ${data.customerName} بطلب ${data.items.length} صنف بمبلغ ${total} ج.م.`,
          messageEn: `${data.customerName} placed order for ${data.items.length} items (${total} EGP).`,
          resourceId: orderNumber,
          resourceType: "order",
          actionUrl: "/admin/orders",
          isRead: false,
        },
      });

      return this.formatOrder(newOrder);
    });

    // Notify Telegram Admin Bot in background
    telegramService.notifyNewOrder(created).catch((err) => {
      console.warn("[Telegram] Failed to broadcast new order:", err.message);
    });

    return created;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: status },
      include: { items: true },
    });
    return this.formatOrder(updated);
  }

  async updateTrackingCode(
    orderId: string,
    trackingNumber: string,
    shippingProvider = "Bosta Logistics"
  ): Promise<Order> {
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: {
        trackingNumber,
        shippingProvider,
        orderStatus: "shipped",
      },
      include: { items: true },
    });
    return this.formatOrder(updated);
  }

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
    if (!order) throw new Error("Order not found");

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { orderStatus: "cancelled" },
      include: { items: true },
    });

    // Restock items
    for (const it of order.items) {
      try {
        await productPrismaRepository.updateProductStock(it.productId, it.quantity, "admin_dashboard");
      } catch (err) {
        console.error(`Failed to restock for product ${it.productId}:`, err);
      }
    }

    return this.formatOrder(updated);
  }
}

export const orderPrismaRepository = new PrismaOrderRepository();
