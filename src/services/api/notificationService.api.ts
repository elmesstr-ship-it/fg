import { INotificationService } from "../interfaces/INotificationService";
import { SystemNotification, NotificationType } from "@/types/notification";
import { api } from "@/lib/apiClient";

export class ApiNotificationService implements INotificationService {
  async getNotifications(params?: {
    type?: NotificationType;
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<SystemNotification[]> {
    return api.get<SystemNotification[]>("/api/notifications", params);
  }

  async getUnreadCount(): Promise<number> {
    const unread = await this.getNotifications({ unreadOnly: true });
    return unread.length;
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    const res = await api.patch<{ success: boolean }>(`/api/notifications/${notificationId}`, { isRead: true });
    return res.success;
  }

  async markAllAsRead(): Promise<boolean> {
    const res = await api.post<{ success: boolean }>("/api/notifications", { action: "mark_all_read" });
    return res.success;
  }

  async createNotification(
    notification: Omit<SystemNotification, "id" | "createdAt" | "isRead">
  ): Promise<SystemNotification> {
    return api.post<SystemNotification>("/api/notifications", notification);
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    const res = await api.delete<{ deleted: boolean }>(`/api/notifications/${notificationId}`);
    return res.deleted;
  }
}

export const notificationApiService = new ApiNotificationService();
