import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { NotFoundError } from "@/server/errors/AppError";
import { requireAdmin } from "@/server/middleware/auth";
import { logActivity } from "@/server/audit/auditLogger";
import { db } from "@/services";

export const GET = apiHandler(
  async (_req: NextRequest, { params }) => {
    const { id } = await params!;
    const order = await db.orders.getOrderById(id) || await db.orders.getOrderByOrderNumber(id);
    if (!order) {
      throw new NotFoundError(`Order '${id}'`);
    }
    return order;
  },
  { contextName: "OrderDetailAPI" }
);

export const PATCH = apiHandler(
  async (req: NextRequest, { params }) => {
    const admin = requireAdmin(req);
    const { id } = await params!;
    const body = await req.json();

    const order = await db.orders.getOrderById(id) || await db.orders.getOrderByOrderNumber(id);
    if (!order) {
      throw new NotFoundError(`Order '${id}'`);
    }

    let updatedOrder = order;
    if (body.status) {
      updatedOrder = await db.orders.updateOrderStatus(order.id, body.status);
      await logActivity({
        adminId: admin.id,
        adminName: admin.fullName,
        action: "ORDER_STATUS_CHANGED",
        resource: `order/${order.orderNumber}`,
        detailsAr: `تم تغيير حالة الطلب ${order.orderNumber} إلى (${body.status})`,
        detailsEn: `Updated order ${order.orderNumber} status to (${body.status})`,
      });
    }

    if (body.trackingNumber) {
      updatedOrder = await db.orders.updateTrackingCode(order.id, body.trackingNumber, body.shippingProvider);
      await logActivity({
        adminId: admin.id,
        adminName: admin.fullName,
        action: "ORDER_TRACKING_UPDATED",
        resource: `order/${order.orderNumber}`,
        detailsAr: `تم إسناد بوليصة الشحن (${body.trackingNumber}) للطلب ${order.orderNumber}`,
        detailsEn: `Assigned tracking code (${body.trackingNumber}) to order ${order.orderNumber}`,
      });
    }

    if (body.paymentStatus) {
      const p = await (await import("@/server/db/prisma")).default.order.update({
        where: { id: order.id },
        data: { paymentStatus: body.paymentStatus },
        include: { items: true },
      });
      updatedOrder = { ...updatedOrder, paymentStatus: body.paymentStatus };
      await logActivity({
        adminId: admin.id,
        adminName: admin.fullName,
        action: "ORDER_PAYMENT_STATUS_CHANGED",
        resource: `order/${order.orderNumber}`,
        detailsAr: `تم تحديث حالة الدفع للطلب ${order.orderNumber} إلى (${body.paymentStatus})`,
        detailsEn: `Updated order ${order.orderNumber} payment status to (${body.paymentStatus})`,
      });
    }

    return updatedOrder;
  },
  { contextName: "OrderUpdateAPI" }
);
