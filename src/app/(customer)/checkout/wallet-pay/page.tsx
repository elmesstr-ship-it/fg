"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Smartphone, CheckCircle2, XCircle, ArrowLeft, Loader2, Copy, Check, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

function WalletPayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const txId = searchParams.get("tx") || "";
  const orderNumber = searchParams.get("order") || "";
  const amount = searchParams.get("amount") || "0";
  const merchantWallet = searchParams.get("wallet") || "01099887766";

  const [senderPhone, setSenderPhone] = useState("");
  const [transferRef, setTransferRef] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultStatus, setResultStatus] = useState<"idle" | "paid" | "failed" | "cancelled">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(merchantWallet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmTransfer = async (status: "paid" | "failed" | "cancelled") => {
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/payments/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionId: txId,
          status: status !== "paid" ? status : undefined,
          payload: {
            transferReference: transferRef || "VF-998811",
            senderPhone: senderPhone || "01011223344",
            reason: status === "failed" ? "Reference code not matched with telecom logs" : undefined,
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
        setErrorMessage(res.error || "Transfer verification failed");
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
        <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20">
          <Smartphone className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">
            فودافون كاش والمحافظ الإلكترونية الذكية
          </span>
          <h1 className="font-sacred text-2xl font-bold text-theme-text">
            سداد الطلب: <span className="font-mono text-theme-gold">{orderNumber || "—"}</span>
          </h1>
          <p className="text-xs text-theme-text-muted">
            يرجى تحويل المبلغ بدقة وتدوين كود التحويل للتحقق الفوري من استلام الدفعة.
          </p>
        </div>

        {/* Merchant Wallet Box */}
        <div className="p-4 rounded-2xl bg-theme-surface-elevated border border-theme-border space-y-2">
          <div className="text-xs text-theme-text-muted">رقم محفظة المتجر المعتمدة للتحويل:</div>
          <div className="flex items-center justify-center gap-3">
            <span className="font-mono text-xl font-bold text-theme-text tracking-wider">{merchantWallet}</span>
            <button
              onClick={handleCopyWallet}
              className="p-1.5 rounded-xl border border-theme-border hover:bg-theme-surface text-theme-gold transition-colors flex items-center gap-1 text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "تم النسخ" : "نسخ الرقم"}</span>
            </button>
          </div>
          <div className="text-xs font-bold text-theme-gold">
            المبلغ المطلوب تحويله: <span className="font-mono text-base">{amount} ج.م</span>
          </div>
        </div>

        {/* State Banners */}
        {resultStatus === "paid" && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 space-y-2 animate-fade-in">
            <CheckCircle2 className="w-8 h-8 mx-auto" />
            <div className="font-bold text-sm">تم تأكيد التحويل بنجاح!</div>
            <p className="text-xs">تمت مطابقة رقم العملية وتحديث حالة الطلب إلى (قيد التجهيز). جاري تحويلك لسجل طلباتك...</p>
          </div>
        )}

        {resultStatus === "failed" && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 space-y-2 animate-fade-in">
            <XCircle className="w-8 h-8 mx-auto" />
            <div className="font-bold text-sm">تعذر التحقق من عملية التحويل</div>
            <p className="text-xs">رقم الحوالة غير مطابق أو لم يتم العثور على الإشعار البنكي. يرجى التواصل مع الدعم أو إعادة المحاولة.</p>
          </div>
        )}

        {resultStatus === "cancelled" && (
          <div className="p-4 rounded-2xl bg-slate-500/10 border border-slate-500/20 text-slate-600 dark:text-slate-400 space-y-2 animate-fade-in">
            <div className="font-bold text-sm">تم إلغاء عملية السداد عبر المحفظة</div>
            <p className="text-xs">يمكنك الرجوع واختيار الدفع عند الاستلام كبديل متاح فورياً.</p>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold">
            {errorMessage}
          </div>
        )}

        {/* Verification Inputs */}
        {resultStatus === "idle" && (
          <div className="space-y-4 text-start">
            <div>
              <label className="block text-xs font-bold text-theme-text mb-1">
                رقم المحفظة التي قمت بالتحويل منها (Sender Mobile):
              </label>
              <input
                type="tel"
                placeholder="010XXXXXXXX"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text font-mono outline-none focus:ring-1 focus:ring-theme-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-theme-text mb-1">
                رقم عملية التحويل أو الكود المرجعي في رسالة فودافون (Ref Code):
              </label>
              <input
                type="text"
                placeholder="مثال: VF-8941203"
                value={transferRef}
                onChange={(e) => setTransferRef(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-theme-border bg-theme-surface-elevated text-theme-text font-mono outline-none focus:ring-1 focus:ring-theme-gold"
              />
            </div>

            <Button
              variant="gold"
              size="lg"
              className="w-full rounded-2xl font-bold text-sm py-3"
              disabled={loading}
              onClick={() => handleConfirmTransfer("paid")}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <ShieldCheck className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />}
              <span>تأكيد التحويل وإتمام الطلب</span>
            </Button>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-rose-500 border-rose-500/30 hover:bg-rose-500/10"
                disabled={loading}
                onClick={() => handleConfirmTransfer("failed")}
              >
                <span>محاكاة خطأ التحويل (Failed)</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="rounded-xl text-slate-500 border-slate-500/30 hover:bg-slate-500/10"
                disabled={loading}
                onClick={() => handleConfirmTransfer("cancelled")}
              >
                <span>إلغاء التحويل (Cancel)</span>
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

export default function WalletPayPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-theme-text-muted">Loading wallet interface...</div>}>
      <WalletPayContent />
    </Suspense>
  );
}
