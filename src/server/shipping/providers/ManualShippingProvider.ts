import { IShippingProvider } from "../interfaces/IShippingProvider";
import {
  CreateShipmentRequest,
  CreateShipmentResult,
  ShipmentStatus,
  TrackingInfo,
  ShipmentCheckpoint,
} from "../types";
import prisma from "@/server/db/prisma";

export class ManualShippingProvider implements IShippingProvider {
  readonly key = "manual";
  readonly name = "الشحن والطرود اليدوية (Manual Courier Workflow)";

  isApiConfigured(): boolean {
    return true; // Always available as graceful fallback
  }

  async calculateShippingFee(governorate: string, orderSubtotal: number): Promise<number> {
    if (orderSubtotal >= 2000) return 0;
    return 75; // Standard fixed shipping rate
  }

  async createShipment(req: CreateShipmentRequest): Promise<CreateShipmentResult> {
    const trackingNumber =
      req.manualTrackingNumber ||
      `SM-WAYBILL-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const fee = await this.calculateShippingFee(req.address.governorate, 0);

    const initialCheckpoint: ShipmentCheckpoint = {
      status: "created",
      timestamp: new Date().toISOString(),
      location: "مكتب شحن سانكتا ماريا",
      notes: "تم تسجيل الشحنة وتعيين رقم البوليصة اليدوي",
    };

    const estDeliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const shipment = await prisma.shipment.create({
      data: {
        orderId: req.orderId,
        trackingNumber,
        providerKey: this.key,
        providerName: "الشحن الداخلي المعتمد",
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
        courierNotes: req.address.notes,
      },
    });

    await prisma.order.update({
      where: { id: req.orderId },
      data: {
        trackingNumber: shipment.trackingNumber,
        shippingProvider: "الشحن اليدوي",
        orderStatus: "processing",
      },
    });

    return {
      success: true,
      shipmentId: shipment.id,
      trackingNumber: shipment.trackingNumber,
      providerKey: this.key,
      providerName: "الشحن الداخلي المعتمد",
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

    checkpoints.push({
      status: newStatus,
      timestamp: new Date().toISOString(),
      location: location || `${s.city} - ${s.governorate}`,
      notes: notes || `تحديث يدوي للحالة: ${newStatus}`,
    });

    await prisma.shipment.update({
      where: { id: s.id },
      data: {
        status: newStatus,
        checkpointsJson: JSON.stringify(checkpoints),
        updatedAt: new Date(),
      },
    });

    let orderStatus = s.order?.orderStatus;
    if (newStatus === "picked_up" || newStatus === "in_transit" || newStatus === "out_for_delivery") {
      orderStatus = "shipped";
    } else if (newStatus === "delivered") {
      orderStatus = "delivered";
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
}
