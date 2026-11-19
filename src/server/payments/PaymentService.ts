import { IPaymentProvider } from "./interfaces/IPaymentProvider";
import { CashOnDeliveryProvider } from "./providers/CashOnDeliveryProvider";
import { CardPaymentProvider } from "./providers/CardPaymentProvider";
import { VodafoneCashProvider } from "./providers/VodafoneCashProvider";
import {
  PaymentMethod,
  PaymentStatus,
  PaymentInitResult,
  PaymentVerifyResult,
  PaymentProviderInfo,
} from "./types";
import prisma from "@/server/db/prisma";
import { telegramService } from "@/server/telegram/TelegramService";

export class PaymentService {
  private static instance: PaymentService;
  private providers: Map<PaymentMethod, IPaymentProvider> = new Map();

  constructor() {
    this.registerProvider(new CashOnDeliveryProvider());
    this.registerProvider(new CardPaymentProvider());
    this.registerProvider(new VodafoneCashProvider());
  }

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  public registerProvider(provider: IPaymentProvider): void {
    this.providers.set(provider.id, provider);
  }

  public getProvider(method: PaymentMethod): IPaymentProvider {
    const provider = this.providers.get(method);
    if (!provider) {
      throw new Error(`Unsupported payment provider: ${method}`);
    }
    return provider;
  }

  /**
   * Returns list of currently verified and available payment providers.
   * "Do not assume that a payment provider is available without confirming its API and merchant requirements."
   */
  async getAvailableProviders(): Promise<PaymentProviderInfo[]> {
    const results: PaymentProviderInfo[] = [];
    for (const provider of this.providers.values()) {
      const info = await provider.getInfo();
      if (info.isAvailable) {
        results.push(info);
      }
    }
    return results;
  }

  /**
   * Initializes a payment flow for an order
   */
  async initiatePayment(
    orderIdOrNumber: string,
    method?: PaymentMethod,
    metadata?: Record<string, any>
  ): Promise<PaymentInitResult> {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
      },
    });

    if (!order) {
      throw new Error(`Order ${orderIdOrNumber} not found`);
    }

    const paymentMethod = method || (order.paymentMethod as PaymentMethod) || "cash_on_delivery";
    const provider = this.getProvider(paymentMethod);

    const isAvailable = await provider.isAvailable();
    if (!isAvailable) {
      throw new Error(
        `Payment method '${paymentMethod}' is not configured or unavailable. Please choose Cash on Delivery.`
      );
    }

    const initResult = await provider.initializePayment({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.total,
      currency: "EGP",
      customer: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      metadata,
    });

    // Update order with payment method & pending status
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentMethod,
        paymentStatus: initResult.status,
      },
    });

    return initResult;
  }

  /**
   * Verify and transition payment transaction status
   */
  async verifyPayment(
    transactionId: string,
    statusOverride?: PaymentStatus,
    verificationPayload?: any
  ): Promise<PaymentVerifyResult> {
    const tx = await prisma.paymentTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!tx) {
      throw new Error(`Transaction ${transactionId} not found`);
    }

    const provider = Array.from(this.providers.values()).find((p) => p.key === tx.providerKey);
    if (!provider) {
      throw new Error(`No provider found for key ${tx.providerKey}`);
    }

    const result = await provider.verifyPayment({
      transactionId,
      statusOverride,
      verificationPayload,
    });

    // Synchronize Order status with payment outcome
    let newOrderStatus: string | undefined = undefined;
    if (result.status === "paid") {
      newOrderStatus = "processing";
    } else if (result.status === "failed" || result.status === "cancelled") {
      newOrderStatus = "pending";
    }

    await prisma.order.update({
      where: { id: result.orderId },
      data: {
        paymentStatus: result.status,
        orderStatus: newOrderStatus || undefined,
      },
    });

    // Log Activity for Audit Trail
    await prisma.activityLog.create({
      data: {
        adminId: "payment_system",
        adminName: "Payment Gateway",
        action: `PAYMENT_${result.status.toUpperCase()}`,
        resource: result.orderNumber,
        detailsAr: `تحديث حالة الدفع للطلب (${result.orderNumber}) إلى [${result.status}] عبر (${tx.providerKey}) بمبلغ ${result.amount} ج.م`,
        detailsEn: `Payment status for order (${result.orderNumber}) updated to [${result.status}] via (${tx.providerKey}) for ${result.amount} EGP`,
        ipAddress: "PaymentService",
      },
    });

    // Telegram Alert for Payment Updates
    if (result.status === "paid") {
      telegramService
        .broadcast(
          `💳 <b>تأكيد سداد ناجح عبر بوابة الدفع!</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 <b>رقم الطلب:</b> <code>${result.orderNumber}</code>\n` +
          `💰 <b>المبلغ المسدد:</b> <b>${result.amount.toLocaleString()} ج.م</b>\n` +
          `🏷️ <b>بوابة الدفع:</b> ${tx.providerKey}\n` +
          `✅ <i>تم قيد الدفعة وتحويل حالة الطلب إلى التشغيل والتجهيز (Processing).</i>`,
          "ADMIN",
          { parse_mode: "HTML" }
        )
        .catch(() => {});
    } else if (result.status === "failed") {
      telegramService
        .broadcast(
          `⚠️ <b>فشل عملية سداد إلكتروني!</b>\n` +
          `━━━━━━━━━━━━━━━━━━━━\n` +
          `📦 <b>الطلب:</b> <code>${result.orderNumber}</code>\n` +
          `❌ <b>السبب:</b> ${result.failureReason || "رفض المعاملة من البنك/المحفظة"}\n` +
          `<i>حالة الطلب معلقة بانتظار إعادة المحاولة أو التحويل للدفع عند الاستلام.</i>`,
          "ADMIN",
          { parse_mode: "HTML" }
        )
        .catch(() => {});
    }

    return result;
  }

  /**
   * Get payment history and current status for an order
   */
  async getPaymentStatus(orderIdOrNumber: string) {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ id: orderIdOrNumber }, { orderNumber: orderIdOrNumber }],
      },
    });

    if (!order) {
      throw new Error(`Order ${orderIdOrNumber} not found`);
    }

    const transactions = await prisma.paymentTransaction.findMany({
      where: { orderId: order.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      transactions,
    };
  }
}

export const paymentService = PaymentService.getInstance();
