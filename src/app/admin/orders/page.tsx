"use client";

import React, { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { Order, OrderStatus } from "@/types/order";
import { Button } from "@/components/ui/Button";
import { adminFetch } from "@/lib/adminApi";
import {
  ShoppingCart,
  Search,
  Filter,
  FileSpreadsheet,
  FileText,
  Truck,
  Eye,
  CheckCircle2,
  Clock,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export default function AdminOrdersPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [trackingModalOrder, setTrackingModalOrder] = useState<Order | null>(null);
  const [newTrackingCode, setNewTrackingCode] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (searchQuery) params.set("search", searchQuery);

    const queryStr = params.toString() ? `?${params.toString()}` : "";
    const res = await adminFetch<Order[]>(`/api/orders${queryStr}`);
    if (res.success && res.data) {
      setOrders(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, startDate, endDate]);

  const handleExport = () => {
    const params = new URLSearchParams();
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    if (searchQuery) params.set("search", searchQuery);
    params.set("x-admin-master-key", "SanctaMariaMasterKey#2026");

    window.open(`/api/orders/export?${params.toString()}`, "_blank");
    showFeedback(locale === "ar" ? "جار تحميل تقرير الطلبات الإكسل (CSV)..." : "Exporting orders report...");
  };

  const showFeedback = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerPhone.includes(searchQuery);
    const matchStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    setActionLoading(true);
    const res = await adminFetch<Order>(`/api/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status: newStatus }),
    });
    setActionLoading(false);

    if (res.success && res.data) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, orderStatus: res.data!.orderStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: res.data!.orderStatus } : null));
      }
      showFeedback(
        locale === "ar"
          ? `تم تحديث حالة الطلب إلى (${newStatus}) في قاعدة البيانات`
          : `Order status updated to (${newStatus})`
      );
    } else {
      showFeedback(res.error || "Failed to update order", "error");
    }
  };

  const handleSaveTrackingCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder || !newTrackingCode.trim()) return;

    setActionLoading(true);
    // Create/update full shipment via Shipping API
    const res = await adminFetch<any>(`/api/shipping/create`, {
      method: "POST",
      body: JSON.stringify({
        orderId: trackingModalOrder.id,
        manualTrackingNumber: newTrackingCode.trim(),
        providerKey: "bosta",
      }),
    });
    setActionLoading(false);

    if (res.success && res.data) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === trackingModalOrder.id
            ? { ...o, trackingNumber: res.data!.trackingNumber, orderStatus: "processing" }
            : o
        )
      );
      setTrackingModalOrder(null);
      setNewTrackingCode("");
      showFeedback(
        locale === "ar"
          ? `تم إنشاء بوليصة الشحن بنجاح: ${res.data.trackingNumber}`
          : `Shipment created: ${res.data.trackingNumber}`
      );
    } else {
      showFeedback(res.error || "Failed to save tracking number", "error");
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800";
      case "shipped":
        return "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      case "processing":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800";
      case "cancelled":
        return "bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300 border border-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 border border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border pb-4">
        <div>
          <h1 className="font-sacred text-2xl font-bold text-theme-text flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-theme-gold" />
            <span>{t.admin.orders}</span>
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            {locale === "ar"
              ? "متابعة طلبيات المقتنيات الكنسية، تحديث بوالص الشحن، وتعديل الحالات مباشرة في قاعدة البيانات"
              : "Track customer orders, manage shipping codes, and update statuses live in database"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadOrders} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 ${loading ? "animate-spin" : ""}`} />
            <span>{locale === "ar" ? "تحديث" : "Refresh"}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="rounded-xl text-xs"
            onClick={handleExport}
          >
            <FileSpreadsheet className="w-4 h-4 mr-1.5 rtl:mr-0 rtl:ml-1.5 text-emerald-600" />
            <span>{locale === "ar" ? "تصدير تقرير إكسل (Orders.csv)" : "Export Orders.csv"}</span>
          </Button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in ${
            feedback.type === "success"
              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800"
          }`}
        >
          {feedback.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-theme-surface p-4 rounded-2xl border border-theme-border">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder={locale === "ar" ? "ابحث برقم الطلب أو اسم العميل أو الهاتف..." : "Search ID, client, or phone..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-theme-surface-elevated border border-theme-border rounded-xl text-theme-text outline-none focus:ring-2 focus:ring-theme-gold"
          />
          <Search className="w-4 h-4 text-theme-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-theme-surface-elevated border border-theme-border rounded-xl text-theme-text outline-none focus:ring-1 focus:ring-theme-gold"
            title={locale === "ar" ? "من تاريخ" : "From Date"}
          />
          <span className="text-theme-text-muted text-xs">-</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-theme-surface-elevated border border-theme-border rounded-xl text-theme-text outline-none focus:ring-1 focus:ring-theme-gold"
            title={locale === "ar" ? "إلى تاريخ" : "To Date"}
          />
          <Filter className="w-4 h-4 text-theme-gold mr-1" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-theme-surface-elevated border border-theme-border rounded-xl text-theme-text outline-none"
          >
            <option value="all">{locale === "ar" ? "جميع الحالات" : "All Statuses"}</option>
            <option value="processing">{locale === "ar" ? "قيد التجهيز" : "Processing"}</option>
            <option value="shipped">{locale === "ar" ? "تم الشحن" : "Shipped"}</option>
            <option value="delivered">{locale === "ar" ? "تم التسليم" : "Delivered"}</option>
            <option value="cancelled">{locale === "ar" ? "ملغي" : "Cancelled"}</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-theme-surface animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-theme-surface border border-theme-border">
          <p className="text-sm text-theme-text-muted">
            {locale === "ar" ? "لا توجد طلبيات مسجلة في قاعدة البيانات حالياً." : "No orders found in database."}
          </p>
        </div>
      ) : (
        <div className="bg-theme-surface rounded-2xl border border-theme-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-start">
              <thead>
                <tr className="bg-theme-surface-elevated/60 text-theme-text-muted border-b border-theme-border">
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "رقم الطلب" : "Order ID"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "العميل" : "Customer"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الأصناف المطلوبة" : "Items"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الإجمالي" : "Total"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "طريقة الدفع" : "Payment"}</th>
                  <th className="py-3 px-4 text-start font-semibold">{locale === "ar" ? "الحالة" : "Status"}</th>
                  <th className="py-3 px-4 text-end font-semibold">{locale === "ar" ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-border/40">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-theme-surface-elevated/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-theme-gold">{ord.orderNumber}</td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-theme-text block">{ord.customerName}</span>
                      <span className="text-[10px] text-theme-text-muted block">{ord.customerPhone}</span>
                    </td>
                    <td className="py-3 px-4 text-theme-text-muted">
                      {ord.items && ord.items.length > 0 ? (
                        <span>
                          {typeof ord.items[0].productName === "string"
                            ? ord.items[0].productName
                            : ord.items[0].productName[locale] || ord.items[0].productName.ar}
                          {ord.items.length > 1 && ` (+${ord.items.length - 1} إضافية)`}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-theme-text">
                      {ord.total.toLocaleString()} {t.common.priceEGP}
                    </td>
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <span className="text-xs text-theme-text-muted block font-medium">
                          {ord.paymentMethod === "cash_on_delivery"
                            ? (locale === "ar" ? "عند الاستلام" : "COD")
                            : ord.paymentMethod === "vodafone_cash"
                            ? (locale === "ar" ? "فودافون كاش" : "Vodafone Cash")
                            : (locale === "ar" ? "بطاقة بنكية" : "Card")}
                        </span>
                        <span
                          className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ord.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : ord.paymentStatus === "failed"
                              ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                              : ord.paymentStatus === "cancelled"
                              ? "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                          }`}
                        >
                          {ord.paymentStatus?.toUpperCase() || "PENDING"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <select
                        disabled={actionLoading}
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg outline-none cursor-pointer ${getStatusBadge(
                          ord.orderStatus
                        )}`}
                      >
                        <option value="pending">{locale === "ar" ? "قيد الانتظار" : "Pending"}</option>
                        <option value="processing">{locale === "ar" ? "قيد التجهيز" : "Processing"}</option>
                        <option value="shipped">{locale === "ar" ? "تم الشحن" : "Shipped"}</option>
                        <option value="delivered">{locale === "ar" ? "تم التسليم" : "Delivered"}</option>
                        <option value="cancelled">{locale === "ar" ? "ملغي" : "Cancelled"}</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-end">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/api/orders/${ord.id}/invoice`}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={locale === "ar" ? "طباعة الفاتورة الضريبية الرسمية" : "Print Official Tax Invoice"}
                          className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-gold hover:bg-theme-surface-elevated"
                        >
                          <FileText className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            setTrackingModalOrder(ord);
                            setNewTrackingCode(ord.trackingNumber || "");
                          }}
                          title={locale === "ar" ? "تعديل بوليصة الشحن" : "Edit Tracking Number"}
                          className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-gold hover:bg-theme-surface-elevated"
                        >
                          <Truck className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          title={locale === "ar" ? "عرض تفاصيل الطلب" : "View Order Details"}
                          className="p-1.5 rounded-lg text-theme-text-muted hover:text-theme-text hover:bg-theme-surface-elevated"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-surface border border-theme-border rounded-3xl max-w-sm w-full p-6 shadow-sacred animate-scale-in">
            <div className="flex items-center justify-between border-b border-theme-border pb-3 mb-4">
              <h3 className="font-sacred font-bold text-sm text-theme-text flex items-center gap-2">
                <Truck className="w-4 h-4 text-theme-gold" />
                <span>{locale === "ar" ? "إسناد بوليصة الشحن الخارجي" : "Assign Shipping Tracking Code"}</span>
              </h3>
              <button onClick={() => setTrackingModalOrder(null)} className="text-theme-text-muted hover:text-theme-text">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTrackingCode} className="space-y-4 text-xs">
              <p className="text-theme-text-muted">
                {locale === "ar" ? "الطلب رقم:" : "Order:"} <span className="font-bold text-theme-gold">{trackingModalOrder.orderNumber}</span>
              </p>
              <div>
                <label className="block font-bold text-theme-text mb-1">
                  {locale === "ar" ? "رقم البوليصة / التتبع (Bosta Logistics)" : "Tracking Number"}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BOSTA-EGY-992144"
                  value={newTrackingCode}
                  onChange={(e) => setNewTrackingCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text font-mono outline-none focus:ring-2 focus:ring-theme-gold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-theme-border">
                <Button type="button" variant="outline" size="sm" onClick={() => setTrackingModalOrder(null)}>
                  {locale === "ar" ? "إلغاء" : "Cancel"}
                </Button>
                <Button type="submit" variant="gold" size="sm" disabled={actionLoading}>
                  {actionLoading ? (locale === "ar" ? "جار الحفظ..." : "Saving...") : (locale === "ar" ? "حفظ التتبع" : "Save")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-theme-surface border border-theme-border rounded-3xl max-w-lg w-full p-6 shadow-sacred animate-scale-in space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-theme-border pb-3">
              <div>
                <h3 className="font-sacred font-bold text-base text-theme-text">
                  {locale === "ar" ? "تفاصيل الطلبية:" : "Order Details:"} {selectedOrder.orderNumber}
                </h3>
                <span className="text-[10px] text-theme-text-muted">{selectedOrder.createdAt}</span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-theme-text-muted hover:text-theme-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-theme-surface-elevated/40 p-4 rounded-2xl border border-theme-border">
              <div>
                <span className="text-theme-text-muted block text-[11px]">{locale === "ar" ? "العميل:" : "Customer:"}</span>
                <span className="font-bold text-theme-text block">{selectedOrder.customerName}</span>
                <span className="text-theme-text-muted block">{selectedOrder.customerPhone}</span>
                <span className="text-theme-text-muted block">{selectedOrder.customerEmail}</span>
              </div>
              <div>
                <span className="text-theme-text-muted block text-[11px]">{locale === "ar" ? "عنوان التوصيل:" : "Shipping Address:"}</span>
                <span className="text-theme-text block font-medium">
                  {selectedOrder.shippingAddress?.governorate}، {selectedOrder.shippingAddress?.city}
                </span>
                <span className="text-theme-text-muted block">{selectedOrder.shippingAddress?.streetAddress}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-theme-text mb-2">{locale === "ar" ? "الأصناف المطلوبة:" : "Items Ordered:"}</h4>
              <div className="space-y-2">
                {selectedOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-theme-surface-elevated border border-theme-border">
                    <span>
                      {typeof it.productName === "string" ? it.productName : it.productName[locale] || it.productName.ar} (×{it.quantity})
                    </span>
                    <span className="font-bold text-theme-text">
                      {(it.price * it.quantity).toLocaleString()} {t.common.priceEGP}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-theme-border pt-3 flex justify-between items-center text-sm font-bold">
              <span>{locale === "ar" ? "المجموع الكلي:" : "Total Amount:"}</span>
              <span className="text-theme-gold">{selectedOrder.total.toLocaleString()} {t.common.priceEGP}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
