import { IOrderService, CreateOrderDTO } from "../interfaces/IOrderService";
import { Order, OrderStatus } from "@/types/order";
import { MOCK_ORDERS } from "./mockData";
import { productService } from "./productService.mock";
import { notificationService } from "./notificationService.mock";

export class MockOrderService implements IOrderService {
  private orders: Order[] = [...MOCK_ORDERS];

  async getOrders(params?: {
    status?: OrderStatus;
    search?: string;
    customerEmail?: string;
  }): Promise<Order[]> {
    let result = [...this.orders];

    if (params?.status) {
      result = result.filter((o) => o.orderStatus === params.status);
    }

    if (params?.customerEmail) {
      result = result.filter((o) => o.customerEmail === params.customerEmail);
    }

    if (params?.search) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerPhone.includes(q) ||
          (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
      );
    }

    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getOrderById(id: string): Promise<Order | null> {
    const found = this.orders.find((o) => o.id === id);
    return found ? { ...found } : null;
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    const found = this.orders.find((o) => o.orderNumber === orderNumber);
    return found ? { ...found } : null;
  }

  async getCustomerOrders(customerEmail: string): Promise<Order[]> {
    return this.orders
      .filter((o) => o.customerEmail === customerEmail)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createOrder(data: CreateOrderDTO): Promise<Order> {
    const subtotal = data.items.reduce((s, it) => s + it.price * it.quantity, 0);
    const shippingFee = subtotal >= 2000 ? 0 : 75;
    const discountAmount = data.couponCode ? 150 : 0;
    const total = Math.max(0, subtotal + shippingFee - discountAmount);

    const newOrderNumber = "SM-" + Math.floor(100000 + Math.random() * 900000);
    const trackingNumber = "EGY-EXP-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: "ord-" + Date.now(),
      orderNumber: newOrderNumber,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      shippingAddress: data.shippingAddress,
      items: data.items,
      subtotal,
      shippingFee,
      discountAmount,
      total,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "credit_card" ? "paid" : "pending",
      orderStatus: "processing",
      trackingNumber,
      shippingProvider: "Bosta Logistics",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.orders.unshift(newOrder);

    // Reduce stock in products
    for (const item of data.items) {
      await productService.updateProductStock(item.productId, -item.quantity, "admin_dashboard");
    }

    // Trigger internal notification
    await notificationService.createNotification({
      type: "new_order",
      priority: "high",
      title: {
        ar: `طلب جديد وارد: ${newOrderNumber}`,
        en: `New Order: ${newOrderNumber}`,
      },
      message: {
        ar: `قام ${data.customerName} بطلب ${data.items.length} صنف بمبلغ ${total} ج.م.`,
        en: `${data.customerName} placed order for ${data.items.length} items (${total} EGP).`,
      },
      resourceId: newOrderNumber,
      resourceType: "order",
      actionUrl: "/admin/orders",
    });

    return newOrder;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error("Order not found");

    this.orders[idx].orderStatus = status;
    this.orders[idx].updatedAt = new Date().toISOString();
    return { ...this.orders[idx] };
  }

  async updateTrackingCode(
    orderId: string,
    trackingNumber: string,
    shippingProvider = "Bosta Logistics"
  ): Promise<Order> {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error("Order not found");

    this.orders[idx].trackingNumber = trackingNumber;
    this.orders[idx].shippingProvider = shippingProvider;
    this.orders[idx].orderStatus = "shipped";
    this.orders[idx].updatedAt = new Date().toISOString();
    return { ...this.orders[idx] };
  }

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    const idx = this.orders.findIndex((o) => o.id === orderId);
    if (idx === -1) throw new Error("Order not found");

    this.orders[idx].orderStatus = "cancelled";
    this.orders[idx].updatedAt = new Date().toISOString();

    // Restock items
    for (const it of this.orders[idx].items) {
      await productService.updateProductStock(it.productId, it.quantity, "admin_dashboard");
    }

    return { ...this.orders[idx] };
  }
}

export const orderService = new MockOrderService();
