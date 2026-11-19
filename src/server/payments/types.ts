import { PaymentMethod, PaymentStatus } from "@/types/order";

export type { PaymentMethod, PaymentStatus };

export interface PaymentInitRequest {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  metadata?: Record<string, any>;
}

export interface PaymentInitResult {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
  providerKey: string;
  redirectUrl?: string;
  instructions?: {
    ar: string;
    en: string;
  };
  providerRef?: string;
  errorMessage?: string;
}

export interface PaymentVerifyRequest {
  transactionId: string;
  providerRef?: string;
  statusOverride?: PaymentStatus;
  verificationPayload?: any;
}

export interface PaymentVerifyResult {
  success: boolean;
  status: PaymentStatus;
  orderId: string;
  orderNumber: string;
  amount: number;
  providerRef?: string;
  failureReason?: string;
}

export interface PaymentProviderInfo {
  id: PaymentMethod;
  key: string;
  name: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  isAvailable: boolean;
  requiresRedirect: boolean;
}
