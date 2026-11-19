import { IOrderService, CreateOrderDTO } from "../interfaces/IOrderService";
import { Order, OrderStatus } from "@/types/order";
import { api } from "@/lib/apiClient";

export class ApiOrderService implements IOrderService {
  async getOrders(params?: {
    status?: OrderStatus;
    search?: string;
    customerEmail?: string;
  }): Promise<Order[]> {
    return api.get<Order[]>("/api/orders", params);
  }

  async getOrderById(id: string): Promise<Order | null> {
    try {
      return await api.get<Order>(`/api/orders/${id}`);
    } catch {
      return null;
    }
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.getOrderById(orderNumber);
  }

  async getCustomerOrders(customerEmail: string): Promise<Order[]> {
    return api.get<Order[]>("/api/orders", { customerEmail });
  }

  async createOrder(orderData: CreateOrderDTO): Promise<Order> {
    return api.post<Order>("/api/orders", orderData);
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    return api.patch<Order>(`/api/orders/${orderId}`, { status });
  }

  async updateTrackingCode(orderId: string, trackingNumber: string, shippingProvider?: string): Promise<Order> {
    return api.patch<Order>(`/api/orders/${orderId}`, { trackingNumber, shippingProvider });
  }

  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    return api.patch<Order>(`/api/orders/${orderId}`, { status: "cancelled", reason });
  }
}

export const orderApiService = new ApiOrderService();
