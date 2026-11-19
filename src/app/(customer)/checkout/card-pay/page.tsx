"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CreditCard, ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

function CardPayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txId = searchParams.get("tx") || "";
  const orderNumber = searchParams.get("order") || "";

  const [loading, setLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<"idle" | "paid" | "failed" | "cancelled">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSimulatePayment = async (status: "paid" | "failed" | "cancelled") => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txId,
          status,
          payload: {
            reason: status === "failed" ? "Insufficient funds / Bank 3D Secure declined" : undefined,
          },
        }),
      }).then((r) => r.json());

      setLoading(false);

      if (res.success) {
        setResultStatus(status);
        if (status === "paid") {
          setTimeout(() => {
            router.push(`/orders`);
          }, 2500);
        }
      } else {
        setErrorMessage(res.error || "Payment verification failed");
      }
    } catch (err: any) {
      setLoading(false);
      setErrorMessage(err.message || "Network error");
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-theme-surface border border-theme-border shadow-sacred space-y-6 text-center">
        {/* Header */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-theme-gold/10 text-theme-gold flex items-center justify-center border border-theme-gold/20">
          <CreditCard className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-theme-gold uppercase tracking-wider">
            بوابة الدفع الإلكتروني المعتمدة (Visa / Mastercard / Meeza)
          </span>
          <h1 className="font-sacred text-2xl font-bold text-theme-text">
            سداد الطلب: <span className="font-mono text-theme-gold">{orderNumber || "—"}</span>
          </h1>
          <p className="text-xs text-theme-text-muted">
            معاملة مشفرة وفق معايير الأمان الدولية PCI-DSS. لا يتم تخزين أو طلب أرقام البطاقات أو CVV.
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs flex items-center gap-2 text-start">
          <ShieldCheck className="w-5 h-5 flex-shrink-0" />
          <span>جلسة دفع مشفرة وآمنة برقم مرجعي: <code className="font-mono font-bold">{txId.slice(0, 12)}...</code></span>
        </div>

        {/* State Banners */}
        {resultStatus === "paid" && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2 animate-fade-in">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
            <div className="font-bold text-sm">تم تأكيد السداد بنجاح!</div>
            <p className="text-xs">تم قيد الدفعة وتحديث حالة الطلب إلى (قيد التجهيز). جاري تحويلك لسجل طلباتك...</p>
          </div>
        )}

        {resultStatus === "failed" && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-2 animate-fade-in">
            <XCircle className="w-8 h-8 mx-auto" />
            <div className="font-bold text-sm">فشلت عملية السداد (Bank Declined)</div>
            <p className="text-xs">رفض البنك المصدر إتمام المعاملة. يمكنك إعادة المحاولة أو التحويل للدفع عند الاستلام.</p>
          </div>
        )}

        {resultStatus === "cancelled" && (
          <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 space-y-2 animate-fade-in">
            <AlertTriangle className="w-8 h-8 mx-auto" />
            <div className="font-bold text-sm">تم إلغاء عملية السداد من جانب المستخدم</div>
            <p className="text-xs">لم يتم خصم أي مبالغ من بطاقتك. الطلب محفوظ ويمكنك اختيار وسيلة دفع أخرى.</p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {/* Actions for Testing Scenarios */}
        {resultStatus === "idle" && (
          <div className="space-y-3 pt-2">
            <Button
              variant="gold"
              size="lg"
              className="w-full rounded-2xl font-bold text-sm py-3"
              disabled={loading}
              onClick={() => handleSimulatePayment("paid")}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />}
              <span>تأكيد السداد بنجاح (3D Secure Approved)</span>
            </Button>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
                disabled={loading}
                onClick={() => handleSimulatePayment("failed")}
              >
                <span>محاكاة فشل السداد (Failed)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-slate-500 border-slate-500/30 hover:bg-slate-500/10"
                disabled={loading}
                onClick={() => handleSimulatePayment("cancelled")}
              >
                <span>إلغاء المعاملة (Cancel)</span>
              </Button>
            </div>
          </div>
        )}

        {/* Navigation back */}
        <div className="pt-2 border-t border-theme-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/orders")}
            className="text-xs text-theme-text-muted hover:text-theme-text"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 rtl:mr-0 rtl:ml-1.5 rtl:rotate-180" />
            <span>العودة إلى سجل طلباتي</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CardPayPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-theme-text-muted">Loading secure gateway...</div>}>
      <CardPayContent />
    </Suspense>
  );
}
