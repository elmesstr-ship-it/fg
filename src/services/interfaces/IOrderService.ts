import { Order, OrderStatus } from "@/types/order";

export interface CreateOrderDTO {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: Order["shippingAddress"];
  items: Order["items"];
  paymentMethod: Order["paymentMethod"];
  couponCode?: string;
}

export interface IOrderService {
  getOrders(params?: {
    status?: OrderStatus;
    search?: string;
    customerEmail?: string;
    startDate?: string | Date;
    endDate?: string | Date;
    paymentMethod?: string;
  }): Promise<Order[]>;

  getOrderById(id: string): Promise<Order | null>;
  getOrderByOrderNumber(orderNumber: string): Promise<Order | null>;
  getCustomerOrders(customerEmail: string): Promise<Order[]>;
  createOrder(orderData: CreateOrderDTO): Promise<Order>;
  updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order>;
  updateTrackingCode(orderId: string, trackingNumber: string, shippingProvider?: string): Promise<Order>;
  cancelOrder(orderId: string, reason?: string): Promise<Order>;
}
