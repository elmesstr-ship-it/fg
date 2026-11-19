"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/store/useAppStore";
import { translations } from "@/config/i18n";
import { db } from "@/services";
import { Order } from "@/types/order";
import { MOCK_ORDERS } from "@/services/mock/mockData";
import {
  Clock,
  CheckCircle2,
  FileText,
  ChevronDown,
  ChevronUp,
  Calendar,
  X,
  Printer,
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
        if (data && data.length > 0) {
          setOrders(data);
          setExpandedOrderId(data[0].id);
        } else {
          setOrders(MOCK_ORDERS);
          setExpandedOrderId(MOCK_ORDERS[0].id);
        }
      } catch {
        setOrders(MOCK_ORDERS);
        setExpandedOrderId(MOCK_ORDERS[0].id);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#D4AF37]">
            FG ORDER ARCHIVE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900 dark:text-white mt-1">
            {locale === "ar" ? "سجل طلباتي ومتابعة الشحنات" : "Order History & Status"}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {locale === "ar"
              ? "متابعة حالة تجهيز الطلبات، تفاصيل القطع المطلوبة، وطباعة الفواتير"
              : "Track order fulfillment, garment details, and download digital invoices"}
          </p>
        </div>

        <Link
          href="/catalog"
          className="px-6 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          {locale === "ar" ? "تسوق إصدارات جديدة" : "Shop New Drops"}
        </Link>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-28 rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse border border-neutral-200 dark:border-neutral-800" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500">
            {locale === "ar" ? "لا توجد أي طلبات مسجلة حالياً." : "No orders found."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const isDelivered = order.orderStatus === "delivered";

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm transition-all"
              >
                {/* Order Header Summary Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isDelivered
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-white"
                      }`}
                    >
                      {isDelivered ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-neutral-950 dark:text-white">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            isDelivered
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300"
                          }`}
                        >
                          {order.orderStatus === "delivered"
                            ? (locale === "ar" ? "تم التسليم" : "Delivered")
                            : order.orderStatus === "shipped"
                            ? (locale === "ar" ? "تم الشحن" : "Shipped")
                            : (locale === "ar" ? "قيد التجهيز" : "Processing")}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-neutral-500 mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{order.items.length} {locale === "ar" ? "قطع" : "items"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100 dark:border-neutral-800">
                    <div className="text-start sm:text-end">
                      <span className="text-[11px] text-neutral-400 block font-mono">
                        {locale === "ar" ? "الإجمالي" : "Total"}
                      </span>
                      <span className="text-sm font-black font-mono text-neutral-950 dark:text-white">
                        {order.total.toLocaleString()} {locale === "ar" ? "ج.م" : "EGP"}
                      </span>
                    </div>

                    <div className="text-neutral-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                    {/* Items List */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400">
                        {locale === "ar" ? "القطع المطلوبة" : "Garments In Order"}
                      </h4>
                      <div className="divide-y divide-neutral-100 dark:divide-neutral-800 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 p-3">
                        {order.items.map((item, i) => (
                          <div key={i} className="py-2.5 first:pt-0 last:pb-0 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-bold text-neutral-900 dark:text-white">
                                {item.productName[locale] || item.productName.ar}
                              </span>
                              {item.variantName && (
                                <span className="text-[11px] text-neutral-400 block font-mono">
                                  {item.variantName}
                                </span>
                              )}
                            </div>
                            <div className="text-end">
                              <span className="font-bold font-mono">
                                {(item.price * item.quantity).toLocaleString()} ج.م
                              </span>
                              <span className="text-[10px] text-neutral-400 block font-mono">
                                × {item.quantity}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions: Invoice Generation */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="text-xs text-neutral-500">
                        {locale === "ar" ? "طريقة الدفع:" : "Payment:"}{" "}
                        <span className="font-bold text-neutral-900 dark:text-white uppercase">
                          {order.paymentMethod.replace(/_/g, " ")}
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedInvoice(order)}
                        className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold text-xs uppercase flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{locale === "ar" ? "عرض / طباعة الفاتورة" : "View Invoice"}</span>
                      </button>
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-3xl max-w-2xl w-full p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Invoice Header */}
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 flex-shrink-0">
                  <Image
                    src="/branding/FG_Logo_Transparent_Black.png"
                    alt="FG Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight">
                    FG COLLECTIVE
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-mono">
                    فاتورة رسمية معتمدة | Official Tax Receipt
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700"
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="p-2 rounded-lg border border-neutral-300 hover:bg-neutral-100 text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Order & Customer Details */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-xl border border-neutral-200">
              <div>
                <span className="text-neutral-400 block font-mono text-[10px] uppercase">Recipient / المستلم:</span>
                <span className="font-bold text-neutral-900">{selectedInvoice.customerName}</span>
                <span className="text-neutral-600 block font-mono">{selectedInvoice.customerPhone}</span>
              </div>
              <div className="text-end">
                <span className="text-neutral-400 block font-mono text-[10px] uppercase">Order Number / رقم الطلب:</span>
                <span className="font-mono font-bold text-sm">{selectedInvoice.orderNumber}</span>
                <span className="text-neutral-500 block font-mono text-[11px]">
                  {new Date(selectedInvoice.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b text-neutral-400 uppercase font-mono text-[10px]">
                  <th className="py-2 text-start font-bold">Item / الصنف</th>
                  <th className="py-2 text-center font-bold">Qty / الكمية</th>
                  <th className="py-2 text-end font-bold">Price / السعر</th>
                </tr>
              </thead>
              <tbody className="divide-y font-mono">
                {selectedInvoice.items.map((it, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5 font-sans font-bold">
                      {it.productName[locale] || it.productName.ar}
                      {it.variantName && <span className="block font-mono text-[10px] text-neutral-400">{it.variantName}</span>}
                    </td>
                    <td className="py-2.5 text-center">{it.quantity}</td>
                    <td className="py-2.5 text-end font-bold">{(it.price * it.quantity).toLocaleString()} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total Summary */}
            <div className="pt-3 border-t border-neutral-200 space-y-1.5 text-xs text-end font-mono">
              <div>المجموع الفرعي: {selectedInvoice.subtotal.toLocaleString()} EGP</div>
              {selectedInvoice.discountAmount > 0 && (
                <div className="text-emerald-600 font-bold">الخصم: -{selectedInvoice.discountAmount.toLocaleString()} EGP</div>
              )}
              <div>رسوم الشحن: {selectedInvoice.shippingFee === 0 ? "FREE" : `${selectedInvoice.shippingFee} EGP`}</div>
              <div className="text-base font-black pt-2 border-t text-neutral-900">
                المجموع الكلي: {selectedInvoice.total.toLocaleString()} EGP
              </div>
            </div>

            <div className="pt-2 text-center text-[10px] text-neutral-400 font-mono">
              FG Collective Cairo • Crafted with Pride in Egypt
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
