"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { db } from "@/services";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/Button";
import {
  Clock,
  CheckCircle2,
  Truck,
  FileText,
  ChevronDown,
  ChevronUp,
  Cross,
  Calendar,
} from "lucide-react";

export default function OrderHistoryPage() {
  const { locale } = useAppStore();
  const t = translations[locale];

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Order | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await db.orders.getOrders();
        setOrders(data);
        if (data.length > 0) {
          setExpandedOrderId(data[0].id);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-theme-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-sacred text-2xl sm:text-3xl font-bold text-theme-text">
            سجل طلباتي ومتابعة الحالات
          </h1>
          <p className="text-xs text-theme-text-muted mt-1">
            متابعة حالة الطلبات، فواتير الشراء المعتمدة، وتفاصيل المقتنيات الكنسية المطلوبة
          </p>
        </div>

        <Link href="/catalog">
          <Button variant="gold" size="sm" className="rounded-xl">
            تسوق مقتنيات جديدة
          </Button>
        </Link>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-theme-surface-elevated animate-pulse border border-theme-border" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-theme-surface rounded-3xl border border-theme-border">
          <p className="text-sm text-theme-text-muted">
            {locale === "ar" ? "لا توجد أي طلبات مسجلة حالياً." : "No orders found."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const isDelivered = order.orderStatus === "delivered";

            return (
              <div
                key={order.id}
                className="bg-theme-surface rounded-3xl border border-theme-border overflow-hidden shadow-sm transition-all"
              >
                {/* Order Header Summary Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-theme-surface-elevated/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        isDelivered
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                      }`}
                    >
                      {isDelivered ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-sacred font-bold text-base text-theme-text">{order.orderNumber}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isDelivered
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300"
                          }`}
                        >
                          {order.orderStatus === "delivered"
                            ? (locale === "ar" ? "تم التسليم" : "Delivered")
                            : order.orderStatus === "shipped"
                            ? (locale === "ar" ? "تم الشحن" : "Shipped")
                            : (locale === "ar" ? "قيد التجهيز" : "Processing")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-theme-text-muted mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-theme-gold" />
                          {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
                        </span>
                        <span>•</span>
                        <span>{order.items.length} {locale === "ar" ? "منتج" : "items"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-theme-border">
                    <div className="text-start sm:text-end">
                      <span className="text-[11px] text-theme-text-muted block">
                        {locale === "ar" ? "الإجمالي الكلي" : "Total Amount"}
                      </span>
                      <span className="text-base font-extrabold text-theme-primary">
                        {order.total.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
                      </span>
                    </div>

                    <div className="text-theme-text-muted">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Collapsible Order Details */}
                {isExpanded && (
                  <div className="p-6 border-t border-theme-border bg-theme-surface-elevated/20 space-y-6">
                    
                    {/* Order Status Progress Bar */}
                    <div className="p-4 rounded-2xl bg-theme-surface border border-theme-border space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-theme-text flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-theme-gold" />
                          <span>حالة الطلب الحالية:</span>
                          <span className="font-semibold text-theme-primary">
                            {order.orderStatus === "pending"
                              ? "قيد المراجعة"
                              : order.orderStatus === "confirmed"
                              ? "تم التأكيد"
                              : order.orderStatus === "processing"
                              ? "قيد التجهيز"
                              : order.orderStatus === "shipped"
                              ? "تم الشحن"
                              : order.orderStatus === "delivered"
                              ? "مكتمل ومسلّم"
                              : order.orderStatus === "cancelled"
                              ? "ملغي"
                              : order.orderStatus}
                          </span>
                        </span>
                        <span className="text-theme-text-muted">{order.shippingAddress.governorate} - {order.shippingAddress.city}</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-theme-surface-elevated h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-theme-gold h-full rounded-full transition-all duration-500"
                          style={{
                            width:
                              order.orderStatus === "delivered"
                                ? "100%"
                                : order.orderStatus === "shipped"
                                ? "75%"
                                : order.orderStatus === "processing"
                                ? "50%"
                                : order.orderStatus === "confirmed"
                                ? "30%"
                                : "15%",
                          }}
                        />
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-3">
                      <h4 className="font-sacred text-xs font-bold uppercase tracking-wider text-theme-text">
                        {locale === "ar" ? "المقتنيات المطلوبة" : "Ordered Items"}
                      </h4>
                      <div className="divide-y divide-theme-border bg-theme-surface rounded-2xl border border-theme-border p-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-theme-text">{item.productName[locale]}</span>
                              {item.variantName && (
                                <span className="text-[11px] text-theme-text-muted block">{item.variantName}</span>
                              )}
                            </div>
                            <div className="text-end">
                              <span className="font-bold text-theme-text">
                                {(item.price * item.quantity).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} {t.common.priceEGP}
                              </span>
                              <span className="text-[11px] text-theme-text-muted block">× {item.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Invoice Generation */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-theme-text-muted">
                        {locale === "ar" ? "طريقة الدفع:" : "Payment:"}{" "}
                        <span className="font-semibold text-theme-text capitalize">{order.paymentMethod.replace(/_/g, " ")}</span>
                      </div>

                      <Button
                        variant="gold"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => setSelectedInvoice(order)}
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5" />
                        <span>{locale === "ar" ? "عرض / طباعة الفاتورة (PDF)" : "View / Print Invoice"}</span>
                      </Button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-gray-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Invoice Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-900 text-yellow-500 flex items-center justify-center font-bold">
                  <Cross className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-sacred text-lg font-bold text-red-950">
                    {locale === "ar" ? "متجر سانكتا ماريا للمقتنيات الكنسية" : "Sancta Maria Church Store"}
                  </h3>
                  <p className="text-xs text-gray-500">فاتورة ضريبية رسمية معتمدة | Official Invoice</p>
                </div>
              </div>
              <div className="text-end">
                <span className="font-mono font-bold text-sm text-red-900">{selectedInvoice.orderNumber}</span>
                <span className="text-xs text-gray-500 block">
                  {new Date(selectedInvoice.createdAt).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}
                </span>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div>
                <span className="text-gray-500 block">المستلم / Recipient:</span>
                <span className="font-bold text-gray-900">{selectedInvoice.customerName}</span>
                <span className="text-gray-600 block">{selectedInvoice.customerPhone}</span>
              </div>
              <div>
                <span className="text-gray-500 block">عنوان الشحن / Address:</span>
                <span className="font-medium text-gray-900">{selectedInvoice.shippingAddress.streetAddress}</span>
                <span className="text-gray-600 block">{selectedInvoice.shippingAddress.city}, {selectedInvoice.shippingAddress.governorate}</span>
              </div>
            </div>

            {/* Invoice Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="py-2 text-start font-semibold">الصنف / Item</th>
                  <th className="py-2 text-center font-semibold">الكمية / Qty</th>
                  <th className="py-2 text-end font-semibold">السعر / Price</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {selectedInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium">{it.productName[locale]}</td>
                    <td className="py-2.5 text-center">{it.quantity}</td>
                    <td className="py-2.5 text-end font-bold font-mono">
                      {(it.price * it.quantity).toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ج.م
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="border-t pt-3 space-y-1.5 text-xs text-end">
              <div className="flex justify-between text-gray-500">
                <span>المجموع الفرعي (Subtotal):</span>
                <span className="font-mono font-bold">{selectedInvoice.subtotal.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ج.م</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>مصاريف الشحن (Shipping):</span>
                <span className="font-mono font-bold">{selectedInvoice.shippingFee} ج.م</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-red-900 pt-2 border-t">
                <span>الإجمالي النهائي (Total):</span>
                <span className="font-mono text-base">{selectedInvoice.total.toLocaleString(locale === "ar" ? "ar-EG" : "en-US")} ج.م</span>
              </div>
            </div>

            {/* Modal Controls */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-semibold text-gray-700 hover:bg-gray-100"
              >
                إغلاق (Close)
              </button>
              <button
                onClick={() => window.open(`/api/orders/${selectedInvoice.id}/invoice`, '_blank')}
                className="px-4 py-2 rounded-xl bg-red-900 text-white text-xs font-semibold hover:bg-red-950 flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>طباعة الفاتورة الرسمية (Official PDF Invoice)</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
