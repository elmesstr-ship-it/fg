import { INotificationService } from "../interfaces/INotificationService";
import { SystemNotification, NotificationType } from "@/types/notification";
import { MOCK_NOTIFICATIONS } from "./mockData";

export class MockNotificationService implements INotificationService {
  private notifications: SystemNotification[] = [...MOCK_NOTIFICATIONS];

  async getNotifications(params?: {
    type?: NotificationType;
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<SystemNotification[]> {
    let result = [...this.notifications];

    if (params?.type) {
      result = result.filter((n) => n.type === params.type);
    }

    if (params?.unreadOnly) {
      result = result.filter((n) => !n.isRead);
    }

    result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    if (params?.limit) {
      result = result.slice(0, params.limit);
    }

    return result;
  }

  async getUnreadCount(): Promise<number> {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const notif = this.notifications.find((n) => n.id === notificationId);
    if (!notif) return false;
    notif.isRead = true;
    return true;
  }

  async markAllAsRead(): Promise<boolean> {
    this.notifications.forEach((n) => (n.isRead = true));
    return true;
  }

  async createNotification(
    data: Omit<SystemNotification, "id" | "createdAt" | "isRead">
  ): Promise<SystemNotification> {
    const newNotif: SystemNotification = {
      ...data,
      id: "notif-" + Date.now(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    this.notifications.unshift(newNotif);
    return newNotif;
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    const prevLen = this.notifications.length;
    this.notifications = this.notifications.filter((n) => n.id !== notificationId);
    return this.notifications.length < prevLen;
  }
}

export const notificationService = new MockNotificationService();
