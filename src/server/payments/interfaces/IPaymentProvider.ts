import {
  PaymentMethod,
  PaymentInitRequest,
  PaymentInitResult,
  PaymentVerifyRequest,
  PaymentVerifyResult,
  PaymentProviderInfo,
} from "../types";

export interface IPaymentProvider {
  readonly id: PaymentMethod;
  readonly key: string;
  readonly name: {
    ar: string;
    en: string;
  };
  readonly description: {
    ar: string;
    en: string;
  };

  /**
   * Confirms whether merchant credentials, configuration, and external APIs are verified.
   * "Do not assume that a payment provider is available without confirming its API and merchant requirements."
   */
  isAvailable(): Promise<boolean> | boolean;

  /**
   * Initializes the payment flow for an order.
   * NEVER accepts or stores credit card numbers or CVV!
   */
  initializePayment(req: PaymentInitRequest): Promise<PaymentInitResult>;

  /**
   * Verifies the status of a payment transaction with the gateway or internal record.
   */
  verifyPayment(req: PaymentVerifyRequest): Promise<PaymentVerifyResult>;

  /**
   * Optional webhook handler for asynchronous gateway push notifications.
   */
  handleWebhook?(payload: any, signature?: string): Promise<PaymentVerifyResult>;

  /**
   * Retrieve human-readable details and capability flags.
   */
  getInfo(): Promise<PaymentProviderInfo>;
}
