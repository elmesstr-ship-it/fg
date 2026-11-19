import { SystemNotification, NotificationType } from "@/types/notification";

export interface INotificationService {
  getNotifications(params?: {
    type?: NotificationType;
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<SystemNotification[]>;

  getUnreadCount(): Promise<number>;
  markAsRead(notificationId: string): Promise<boolean>;
  markAllAsRead(): Promise<boolean>;
  createNotification(
    notification: Omit<SystemNotification, "id" | "createdAt" | "isRead">
  ): Promise<SystemNotification>;
  deleteNotification(notificationId: string): Promise<boolean>;
}
