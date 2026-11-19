import { INotificationService } from "@/services/interfaces/INotificationService";
import { SystemNotification, NotificationType, NotificationPriority } from "@/types/notification";
import prisma from "../prisma";

export class PrismaNotificationRepository implements INotificationService {
  private formatNotification(n: any): SystemNotification {
    return {
      id: n.id,
      type: n.type as NotificationType,
      priority: n.priority as NotificationPriority,
      title: {
        ar: n.titleAr,
        en: n.titleEn,
      },
      message: {
        ar: n.messageAr,
        en: n.messageEn,
      },
      isRead: n.isRead,
      resourceId: n.resourceId || undefined,
      resourceType: n.resourceType as any || undefined,
      actionUrl: n.actionUrl || undefined,
      createdAt: n.createdAt.toISOString(),
    };
  }

  async getNotifications(params?: {
    type?: NotificationType;
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<SystemNotification[]> {
    const where: any = {};

    if (params?.type) {
      where.type = params.type;
    }

    if (params?.unreadOnly) {
      where.isRead = false;
    }

    const raw = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params?.limit || undefined,
    });

    return raw.map((n) => this.formatNotification(n));
  }

  async getUnreadCount(): Promise<number> {
    return prisma.notification.count({
      where: { isRead: false },
    });
  }

  async markAsRead(notificationId: string): Promise<boolean> {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return true;
  }

  async markAllAsRead(): Promise<boolean> {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });
    return true;
  }

  async createNotification(
    data: Omit<SystemNotification, "id" | "createdAt" | "isRead">
  ): Promise<SystemNotification> {
    const created = await prisma.notification.create({
      data: {
        type: data.type,
        priority: data.priority,
        titleAr: data.title.ar,
        titleEn: data.title.en,
        messageAr: data.message.ar,
        messageEn: data.message.en,
        isRead: false,
        resourceId: data.resourceId,
        resourceType: data.resourceType,
        actionUrl: data.actionUrl,
      },
    });
    return this.formatNotification(created);
  }

  async deleteNotification(notificationId: string): Promise<boolean> {
    await prisma.notification.delete({
      where: { id: notificationId },
    });
    return true;
  }
}

export const notificationPrismaRepository = new PrismaNotificationRepository();
