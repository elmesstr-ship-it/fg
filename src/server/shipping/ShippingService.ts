import { IShippingProvider } from "./interfaces/IShippingProvider";
import { BostaShippingProvider } from "./providers/BostaShippingProvider";
import { ManualShippingProvider } from "./providers/ManualShippingProvider";
import {
  CreateShipmentRequest,
  CreateShipmentResult,
  ShipmentStatus,
  TrackingInfo,
} from "./types";
import prisma from "@/server/db/prisma";
import { telegramService } from "@/server/telegram/TelegramService";

export class ShippingService {
  private static instance: ShippingService;
  private providers: Map<string, IShippingProvider> = new Map();
  private bostaProvider: BostaShippingProvider;
  private manualProvider: ManualShippingProvider;

  constructor() {
    this.bostaProvider = new BostaShippingProvider();
    this.manualProvider = new ManualShippingProvider();

    this.registerProvider(this.bostaProvider);
    this.registerProvider(this.manualProvider);
  }

  public static getInstance(): ShippingService {
    if (!ShippingService.instance) {
      ShippingService.instance = new ShippingService();
    }
    return ShippingService.instance;
  }

  public registerProvider(provider: IShippingProvider) {
    this.providers.set(provider.key, provider);
  }

  public getProvider(key: string = "bosta"): IShippingProvider {
    const provider = this.providers.get(key);
    if (!provider) {
      return this.manualProvider;
    }
    // If Bosta API is configured or in dev, use Bosta, otherwise fallback to manual
    if (key === "bosta" && !this.bostaProvider.isApiConfigured()) {
      return this.manualProvider;
    }
    return provider;
  }

  /**
   * Calculate shipping fee by Egyptian governorate
   */
  async calculateShippingFee(governorate: string, subtotal: number): Promise<number> {
    return this.bostaProvider.calculateShippingFee(governorate, subtotal);
  }

  /**
   * Create shipment with third-party courier or manual dispatch workflow
   */
  async createShipment(
    orderIdOrNumber: string,
    options?: {
      providerKey?: string;
      manualTrackingNumber?: string;
      courierNotes?: string;
    }
  ): Promise<CreateShipmentResult> {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
      },
      include: { items: true },
    });

    if (!order) {
      throw new Error(`Order ${orderIdOrNumber} not found`);
    }

    // Check if shipment already exists
    const existing = await prisma.shipment.findUnique({
      where: { orderId: order.id },
    });
    if (existing) {
      return {
        success: true,
        shipmentId: existing.id,
        trackingNumber: existing.trackingNumber,
        providerKey: existing.providerKey,
        providerName: existing.providerName,
        status: existing.status as ShipmentStatus,
        shippingFee: existing.shippingFee,
        estimatedDelivery: existing.estimatedDelivery?.toISOString(),
        trackingUrl: `/tracking/${existing.trackingNumber}`,
      };
    }

    const providerKey = options?.providerKey || "bosta";
    const provider = this.getProvider(providerKey);

    const codAmount = order.paymentMethod === "cash_on_delivery" ? order.total : 0;
    const itemsDescription = (order.items || []).map((it) => `${it.productName} (×${it.quantity})`).join(", ");

    const request: CreateShipmentRequest = {
      orderId: order.id,
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      customerEmail: order.customerEmail,
      address: {
        governorate: order.governorate,
        city: order.city,
        streetAddress: order.streetAddress,
        notes: options?.courierNotes || order.notes || undefined,
      },
      packageDetails: {
        itemsCount: (order.items || []).reduce((s, it) => s + it.quantity, 0),
        description: itemsDescription || "مقتنيات كنسية مقدسة",
      },
      codAmount,
      providerKey,
      manualTrackingNumber: options?.manualTrackingNumber,
    };

    const result = await provider.createShipment(request);

    // Audit log
    await prisma.activityLog.create({
      data: {
        adminId: "shipping_system",
        adminName: "Shipping Logistics",
        action: "SHIPMENT_CREATED",
        resource: order.orderNumber,
        detailsAr: `تم إنشاء بوليصة شحن لدى (${result.providerName}) برقم تتبع [${result.trackingNumber}]`,
        detailsEn: `Created shipment with (${result.providerName}) with tracking code [${result.trackingNumber}]`,
        ipAddress: "ShippingService",
      },
    });

    return result;
  }

  /**
   * Retrieve live tracking info & checkpoints
   */
  async getTracking(identifier: string): Promise<TrackingInfo | null> {
    const shipment = await prisma.shipment.findFirst({
      where: {
        OR: [{ trackingNumber: identifier }, { id: identifier }, { orderId: identifier }],
      },
      include: { order: true },
    });

    if (!shipment) {
      // Check if order exists and has a tracking number
      const order = await prisma.order.findFirst({
        where: {
          OR: [{ orderNumber: identifier }, { id: identifier }],
        },
      });

      if (order && order.trackingNumber) {
        return this.bostaProvider.getTracking(order.trackingNumber);
      }
      return null;
    }

    const provider = this.getProvider(shipment.providerKey);
    return provider.getTracking(shipment.trackingNumber);
  }

  /**
   * Update shipment status and checkpoint (Manual or Webhook)
   */
  async updateShipmentStatus(
    trackingNumber: string,
    newStatus: ShipmentStatus,
    location?: string,
    notes?: string
  ): Promise<TrackingInfo> {
    const shipment = await prisma.shipment.findFirst({
      where: {
        OR: [{ trackingNumber }, { id: trackingNumber }],
      },
    });

    if (!shipment) {
      throw new Error(`Shipment with tracking ${trackingNumber} not found`);
    }

    const provider = this.getProvider(shipment.providerKey);
    const updated = await provider.updateStatus(shipment.trackingNumber, newStatus, location, notes);

    // Audit log
    await prisma.activityLog.create({
      data: {
        adminId: "shipping_service",
        adminName: "Shipping Logistics",
        action: `SHIPMENT_${newStatus.toUpperCase()}`,
        resource: updated.orderNumber,
        detailsAr: `تحديث حالة الشحن للطلب (${updated.orderNumber}) إلى [${newStatus}] - ${notes || ""}`,
        detailsEn: `Updated shipping status for (${updated.orderNumber}) to [${newStatus}] - ${notes || ""}`,
        ipAddress: "ShippingService",
      },
    });

    // Notify Telegram Admin Bot
    if (newStatus === "out_for_delivery") {
      telegramService
        .broadcast(
          `🚚 <b>الشحنة خرجت للتسليم الآن!</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 <b>الطلب:</b> <code>${updated.orderNumber}</code>\n` +
          `🔖 <b>بوليصة الشحن:</b> <code>${updated.trackingNumber}</code>\n` +
          `👤 <b>العميل:</b> ${updated.recipient.name} (${updated.recipient.phone})\n` +
          `📍 <b>العنوان:</b> ${updated.recipient.city} - ${updated.recipient.governorate}\n` +
          `💵 <b>المبلغ المطلوب تحصيله (COD):</b> ${updated.codAmount} ج.م`,
          "ADMIN",
          { parse_mode: "HTML" }
        )
        .catch(() => {});
    } else if (newStatus === "delivered") {
      telegramService
        .broadcast(
          `✅ <b>تم تسليم الشحنة للعميل بنجاح!</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 <b>الطلب:</b> <code>${updated.orderNumber}</code>\n` +
          `🔖 <b>رقم الشحنة:</b> <code>${updated.trackingNumber}</code>\n` +
          `🚚 <b>شركة الشحن:</b> ${updated.providerName}\n` +
          `🎉 <i>تم تأكيد التسليم وإغلاق دورة الطلب في قاعدة البيانات.</i>`,
          "ADMIN",
          { parse_mode: "HTML" }
        )
        .catch(() => {});
    }

    return updated;
  }
}

export const shippingService = ShippingService.getInstance();
