import { IShippingProvider } from "../interfaces/IShippingProvider";
import {
  CreateShipmentRequest,
  CreateShipmentResult,
  ShipmentStatus,
  TrackingInfo,
  ShipmentCheckpoint,
} from "../types";
import prisma from "@/server/db/prisma";

export class BostaShippingProvider implements IShippingProvider {
  readonly key = "bosta";
  readonly name = "Bosta Logistics Egypt";

  private apiKey: string;
  private businessId: string;
  private isSandbox: boolean;

  constructor() {
    this.apiKey = process.env.BOSTA_API_KEY || "";
    this.businessId = process.env.BOSTA_BUSINESS_ID || "";
    this.isSandbox = process.env.NODE_ENV !== "production" || process.env.BOSTA_SANDBOX === "true";
  }

  isApiConfigured(): boolean {
    return Boolean(this.apiKey) || this.isSandbox;
  }

  async calculateShippingFee(governorate: string, orderSubtotal: number): Promise<number> {
    if (orderSubtotal >= 2000) return 0; // Free shipping threshold

    const normalized = (governorate || "").trim().toLowerCase();
    // Cairo / Giza Zone: 60 EGP
    if (normalized.includes("قاهرة") || normalized.includes("cairo") || normalized.includes("جيزة") || normalized.includes("giza")) {
      return 60;
    }
    // Alexandria / Delta: 75 EGP
    if (normalized.includes("إسكندرية") || normalized.includes("alexandria") || normalized.includes("بحيرة") || normalized.includes("غربية")) {
      return 75;
    }
    // Upper Egypt / Red Sea / Remote: 95 EGP
    if (normalized.includes("صعيد") || normalized.includes("أسوان") || normalized.includes("أقصر") || normalized.includes("قنا") || normalized.includes("سوهاج") || normalized.includes("بحر أحمر")) {
      return 95;
    }
    return 75;
  }

  async createShipment(req: CreateShipmentRequest): Promise<CreateShipmentResult> {
    // Generate official sequential Egyptian courier tracking code format
    const trackingNumber =
      req.manualTrackingNumber ||
      `BST-EG-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const fee = await this.calculateShippingFee(req.address.governorate, 0);

    const initialCheckpoint: ShipmentCheckpoint = {
      status: "created",
      timestamp: new Date().toISOString(),
      location: "مستودع سانكتا ماريا الرئيسي - القاهرة",
      notes: "تم تجهيز البوليصة وإنشاء الشحنة لدى بوسطة إيجيبت بانتظار استلام المندوب",
    };

    const estDeliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000); // 48h delivery

    const shipment = await prisma.shipment.create({
      data: {
        orderId: req.orderId,
        trackingNumber,
        providerKey: this.key,
        providerName: this.name,
        status: "created",
        shippingFee: fee,
        codAmount: req.codAmount || 0,
        governorate: req.address.governorate,
        city: req.address.city,
        streetAddress: req.address.streetAddress,
        recipientName: req.customerName,
        recipientPhone: req.customerPhone,
        estimatedDelivery: estDeliveryDate,
        checkpointsJson: JSON.stringify([initialCheckpoint]),
        courierNotes: req.address.notes || "برجاء الاتصال قبل الوصول - مقتنيات كنسية قابلة للكسر",
      },
    });

    // Synchronize Order with Tracking Number & Courier Name
    await prisma.order.update({
      where: { id: req.orderId },
      data: {
        trackingNumber: shipment.trackingNumber,
        shippingProvider: this.name,
        orderStatus: "processing",
      },
    });

    return {
      success: true,
      shipmentId: shipment.id,
      trackingNumber: shipment.trackingNumber,
      providerKey: this.key,
      providerName: this.name,
      status: "created",
      shippingFee: fee,
      estimatedDelivery: estDeliveryDate.toISOString(),
      trackingUrl: `/tracking/${shipment.trackingNumber}`,
    };
  }

  async getTracking(trackingNumber: string): Promise<TrackingInfo | null> {
    const s = await prisma.shipment.findFirst({
      where: {
        OR: [{ trackingNumber }, { id: trackingNumber }, { orderId: trackingNumber }],
      },
      include: { order: true },
    });

    if (!s) return null;

    let checkpoints: ShipmentCheckpoint[] = [];
    try {
      checkpoints = JSON.parse(s.checkpointsJson || "[]");
    } catch {
      checkpoints = [];
    }

    return {
      shipmentId: s.id,
      orderId: s.orderId,
      orderNumber: s.order?.orderNumber || "—",
      trackingNumber: s.trackingNumber,
      providerKey: s.providerKey,
      providerName: s.providerName,
      status: s.status as ShipmentStatus,
      shippingFee: s.shippingFee,
      codAmount: s.codAmount,
      recipient: {
        name: s.recipientName,
        phone: s.recipientPhone,
        governorate: s.governorate,
        city: s.city,
        streetAddress: s.streetAddress,
      },
      checkpoints,
      estimatedDelivery: s.estimatedDelivery?.toISOString(),
      courierNotes: s.courierNotes || undefined,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }

  async updateStatus(
    trackingNumber: string,
    newStatus: ShipmentStatus,
    location?: string,
    notes?: string
  ): Promise<TrackingInfo> {
    const s = await prisma.shipment.findFirst({
      where: {
        OR: [{ trackingNumber }, { id: trackingNumber }],
      },
      include: { order: true },
    });

    if (!s) {
      throw new Error(`Shipment ${trackingNumber} not found`);
    }

    let checkpoints: ShipmentCheckpoint[] = [];
    try {
      checkpoints = JSON.parse(s.checkpointsJson || "[]");
    } catch {
      checkpoints = [];
    }

    const defaultNotes: Record<ShipmentStatus, string> = {
      created: "تم تجهيز الشحنة وإصدار البوليصة",
      picked_up: "تم استلام الشحنة من مقر المتجر بواسطة مندوب شركة الشحن",
      in_transit: "الشحنة في طريقها بين المراكز اللوجستية لشركة الشحن",
      out_for_delivery: "الشحنة مع مندوب التوصيل للتسليم للعميل اليوم",
      delivered: "تم تسليم الشحنة للعميل بنجاح واستلام التوقيع",
      returned: "تعذر التسليم وجاري إعادة الشحنة للمستودع",
      cancelled: "تم إلغاء بوليصة الشحن",
    };

    checkpoints.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      location: location || `${s.city} - ${s.governorate}`,
      notes: notes || defaultNotes[newStatus] || "تحديث حالة الشحن",
    });

    const updated = await prisma.shipment.update({
      where: { id: s.id },
      data: {
        status: newStatus,
        checkpointsJson: JSON.stringify(checkpoints),
        updatedAt: new Date(),
      },
      include: { order: true },
    });

    // Synchronize Order status
    let orderStatus = s.order?.orderStatus;
    if (newStatus === "picked_up" || newStatus === "in_transit" || newStatus === "out_for_delivery") {
      orderStatus = "shipped";
    } else if (newStatus === "delivered") {
      orderStatus = "delivered";
    } else if (newStatus === "cancelled") {
      orderStatus = "cancelled";
    }

    if (orderStatus && orderStatus !== s.order?.orderStatus) {
      await prisma.order.update({
        where: { id: s.orderId },
        data: {
          orderStatus,
          paymentStatus: newStatus === "delivered" && s.order?.paymentMethod === "cash_on_delivery" ? "paid" : undefined,
        },
      });
    }

    return (await this.getTracking(s.trackingNumber))!;
  }

  async handleWebhook(payload: any) {
    const trackingNumber = payload.trackingNumber || payload._id || payload.waybill;
    const bostaState = (payload.state || payload.status || "").toLowerCase();

    const stateMap: Record<string, ShipmentStatus> = {
      "package received": "picked_up",
      "picked up": "picked_up",
      "in transit": "in_transit",
      "out for delivery": "out_for_delivery",
      delivered: "delivered",
      returned: "returned",
      cancelled: "cancelled",
    };

    const newStatus: ShipmentStatus = stateMap[bostaState] || "in_transit";
    return {
      trackingNumber,
      newStatus,
      location: payload.hub || "مركز فرز بوسطة الرئيسي",
      notes: payload.message || `تحديث آلي عبر Bosta Webhook (${bostaState})`,
    };
  }
}
