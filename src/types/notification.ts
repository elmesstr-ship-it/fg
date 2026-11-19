export type NotificationType =
  | "new_order"
  | "low_stock"
  | "out_of_stock"
  | "order_status"
  | "shipping_update"
  | "payment_confirmed"
  | "telegram_activity"
  | "system_alert";

export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface SystemNotification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: {
    ar: string;
    en: string;
  };
  message: {
    ar: string;
    en: string;
  };
  isRead: boolean;
  resourceId?: string; // e.g. orderId or productId
  resourceType?: "order" | "product" | "customer";
  createdAt: string;
  actionUrl?: string;
}
