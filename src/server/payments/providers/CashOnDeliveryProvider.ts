import { IPaymentProvider } from "../interfaces/IPaymentProvider";
import {
  PaymentInitRequest,
  PaymentInitResult,
  PaymentVerifyRequest,
  PaymentVerifyResult,
  PaymentProviderInfo,
} from "../types";
import prisma from "@/server/db/prisma";

export class CashOnDeliveryProvider implements IPaymentProvider {
  readonly id = "cash_on_delivery" as const;
  readonly key = "cod";
  readonly name = {
    ar: "الدفع عند الاستلام (نقداً)",
    en: "Cash on Delivery (COD)",
  };
  readonly description = {
    ar: "سداد قيمة المقتنيات نقداً لمندوب الشحن فور وصول الشحنة وفحصها",
    en: "Pay in cash upon physical inspection and package delivery",
  };

  /**
   * Cash on delivery is guaranteed operational independently without external dependencies.
   */
  async isAvailable(): Promise<boolean> {
    return true;
  }

  async initializePayment(req: PaymentInitRequest): Promise<PaymentInitResult> {
    const tx = await prisma.paymentTransaction.create({
      data: {
        orderId: req.orderId,
        providerKey: this.key,
        amount: req.amount,
        currency: req.currency || "EGP",
        status: "pending",
        providerTxId: `COD-${req.orderNumber}`,
        paymentDetails: JSON.stringify({
          type: "cash_on_delivery",
          note: "Payment collected physically by courier on delivery",
        }),
      },
    });

    return {
      success: true,
      transactionId: tx.id,
      status: "pending",
      providerKey: this.key,
      providerRef: tx.providerTxId || undefined,
      instructions: {
        ar: "يرجى تجهيز المبلغ المطلوب نقداً لتسليمه لمندوب شركة الشحن عند الاستلام.",
        en: "Please prepare the exact cash amount for the courier upon delivery.",
      },
    };
  }

  async verifyPayment(req: PaymentVerifyRequest): Promise<PaymentVerifyResult> {
    const tx = await prisma.paymentTransaction.findUnique({
      where: { id: req.transactionId },
    });

    if (!tx) {
      throw new Error(`Transaction ${req.transactionId} not found`);
    }

    const order = await prisma.order.findUnique({
      where: { id: tx.orderId },
    });

    if (!order) {
      throw new Error(`Order ${tx.orderId} not found`);
    }

    // Cash on delivery status transition: can be confirmed paid upon delivery confirmation
    const newStatus = req.statusOverride || (order.orderStatus === "delivered" ? "paid" : tx.status as any);

    await prisma.paymentTransaction.update({
      where: { id: tx.id },
      data: {
        status: newStatus,
        updatedAt: new Date(),
      },
    });

    return {
      success: newStatus === "paid",
      status: newStatus,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: tx.amount,
      providerRef: tx.providerTxId || undefined,
    };
  }

  async getInfo(): Promise<PaymentProviderInfo> {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      description: this.description,
      isAvailable: await this.isAvailable(),
      requiresRedirect: false,
    };
  }
}
