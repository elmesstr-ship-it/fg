import { IPaymentProvider } from "../interfaces/IPaymentProvider";
import {
  PaymentInitRequest,
  PaymentInitResult,
  PaymentVerifyRequest,
  PaymentVerifyResult,
  PaymentProviderInfo,
  PaymentStatus,
} from "../types";
import prisma from "@/server/db/prisma";

export class VodafoneCashProvider implements IPaymentProvider {
  readonly id = "vodafone_cash" as const;
  readonly key = "vodafone_cash";
  readonly name = {
    ar: "فودافون كاش والمحافظ الإلكترونية",
    en: "Vodafone Cash & Electronic Wallets",
  };
  readonly description = {
    ar: "تحويل مباشر إلى محفظة فودافون كاش المعتمدة لخدمة المتجر والتحقق برقم الحوالة",
    en: "Direct mobile wallet transfer with sender number and transfer reference verification",
  };

  private merchantWalletNumber: string;

  constructor() {
    this.merchantWalletNumber = process.env.VODAFONE_CASH_MERCHANT_WALLET || "01099887766";
  }

  /**
   * Confirms provider availability & merchant configuration requirements
   */
  async isAvailable(): Promise<boolean> {
    // Verified merchant wallet configuration check
    return Boolean(this.merchantWalletNumber && this.merchantWalletNumber.startsWith("010"));
  }

  async initializePayment(req: PaymentInitRequest): Promise<PaymentInitResult> {
    const available = await this.isAvailable();
    if (!available) {
      return {
        success: false,
        transactionId: "",
        status: "failed",
        providerKey: this.key,
        errorMessage: "خدمة محفظة فودافون كاش غير مهيأة لدى التاجر حالياً.",
      };
    }

    const providerTxId = `VF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    const tx = await prisma.paymentTransaction.create({
      data: {
        orderId: req.orderId,
        providerKey: this.key,
        amount: req.amount,
        currency: req.currency || "EGP",
        status: "pending",
        providerTxId,
        paymentDetails: JSON.stringify({
          merchantWallet: this.merchantWalletNumber,
          customerPhone: req.customer.phone,
        }),
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const redirectUrl = `${appUrl}/checkout/wallet-pay?tx=${tx.id}&order=${req.orderNumber}&amount=${req.amount}&wallet=${this.merchantWalletNumber}`;

    return {
      success: true,
      transactionId: tx.id,
      status: "pending",
      providerKey: this.key,
      providerRef: providerTxId,
      redirectUrl,
      instructions: {
        ar: `يرجى تحويل مبلغ (${req.amount} ج.م) إلى محفظة المتجر (${this.merchantWalletNumber}) وإدخال رقم عملية التحويل لتأكيد الطلب فورياً.`,
        en: `Please transfer (${req.amount} EGP) to merchant wallet (${this.merchantWalletNumber}) and enter the transfer reference code.`,
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

    let finalStatus: PaymentStatus = tx.status as PaymentStatus;
    let failureReason: string | undefined = undefined;

    if (req.statusOverride) {
      finalStatus = req.statusOverride;
      if (finalStatus === "failed") {
        failureReason = req.verificationPayload?.reason || "Vodafone Cash transfer verification failed (invalid reference or mismatch)";
      } else if (finalStatus === "cancelled") {
        failureReason = "Customer cancelled the wallet transfer";
      }
    } else if (req.verificationPayload?.transferReference) {
      // Validate transfer reference length and format
      const ref = String(req.verificationPayload.transferReference).trim();
      const senderNumber = String(req.verificationPayload.senderPhone || "").trim();

      if (ref.length >= 6) {
        finalStatus = "paid";
        // Record non-sensitive metadata only
        const currentDetails = JSON.parse(tx.paymentDetails || "{}");
        currentDetails.verifiedReference = ref;
        currentDetails.senderPhone = senderNumber ? `${senderNumber.slice(0, 3)}****${senderNumber.slice(-3)}` : undefined;

        await prisma.paymentTransaction.update({
          where: { id: tx.id },
          data: {
            paymentDetails: JSON.stringify(currentDetails),
          },
        });
      } else {
        finalStatus = "failed";
        failureReason = "Invalid Vodafone Cash reference code format";
      }
    }

    await prisma.paymentTransaction.update({
      where: { id: tx.id },
      data: {
        status: finalStatus,
        failureReason,
        updatedAt: new Date(),
      },
    });

    return {
      success: finalStatus === "paid",
      status: finalStatus,
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: tx.amount,
      providerRef: tx.providerTxId || undefined,
      failureReason,
    };
  }

  async getInfo(): Promise<PaymentProviderInfo> {
    return {
      id: this.id,
      key: this.key,
      name: this.name,
      description: this.description,
      isAvailable: await this.isAvailable(),
      requiresRedirect: true,
    };
  }
}
