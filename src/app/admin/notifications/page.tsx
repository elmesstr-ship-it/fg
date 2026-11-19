"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { db } from "@/services";
import { MOCK_NOTIFICATIONS } from "@/services/mock/mockData";
import { SystemNotification } from "@/types/notification";
import { Button } from "@/components/ui/Button";
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  ShoppingCart,
  Send,
  Trash2,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";

export default function AdminNotificationsPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const notifs = await db.notifications.getNotifications();
        if (notifs && notifs.length > 0) {
          setNotifications(notifs);
        } else {
          setNotifications(MOCK_NOTIFICATIONS);
        }
      } catch {
        setNotifications(MOCK_NOTIFICATIONS);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await db.notifications.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await db.notifications.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleDelete = async (id: string) => {
    await db.notifications.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <Bell className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.notifications}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "مركز الإشعارات الفورية للطلبات الجديدة، تنبيهات المخزون، ونشاط بوت تيليجرام"
              : "Notification center for new orders, stock alerts, and Telegram activity"}
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={handleMarkAllRead}>
          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 text-emerald-600" />
          <span>{locale === "ar" ? "تحديد الكل كمقروء" : "Mark All as Read"}</span>
        </Button>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-theme-surface-elevated animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-theme-surface rounded-2xl border border-theme-border">
          <p className="text-sm text-theme-text-muted">
            {locale === "ar" ? "لا توجد أي إشعارات حالياً." : "No notifications."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isOrder = notif.type === "new_order";
            const isStock = notif.type === "low_stock" || notif.type === "out_of_stock";
            const isTelegram = notif.type === "telegram_activity";

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  notif.isRead
                    ? "bg-theme-surface border-theme-border text-theme-text-muted"
                    : "bg-theme-surface-elevated border-theme-gold/40 shadow-sm text-theme-text"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2.5 rounded-xl flex-shrink-0 ${
                      isStock
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400"
                        : isOrder
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400"
                    }`}
                  >
                    {isStock ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : isOrder ? (
                      <ShoppingCart className="w-5 h-5" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sacred text-sm font-bold text-theme-text">
                        {notif.title[locale]}
                      </span>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-theme-gold animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-theme-text-muted mt-1 leading-relaxed">
                      {notif.message[locale]}
                    </p>
                    <span className="text-[10px] text-theme-text-muted mt-2 block font-mono">
                      {new Date(notif.createdAt).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {notif.actionUrl && (
                    <Link href={notif.actionUrl}>
                      <button className="p-2 rounded-lg text-theme-gold hover:bg-theme-gold/10 transition-colors" title="View Resource">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </Link>
                  )}
                  {!notif.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                      title={locale === "ar" ? "تحديد كمقروء" : "Mark as read"}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-2 rounded-lg text-theme-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                    title={locale === "ar" ? "حذف" : "Delete"}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
