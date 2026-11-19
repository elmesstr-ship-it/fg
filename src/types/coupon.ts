export type DiscountType = "percentage" | "fixed_amount";

export interface Coupon {
  id: string;
  code: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 10 for 10% or 100 for 100 EGP
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  usageLimit?: number;
  description: {
    ar: string;
    en: string;
  };
}

export interface CouponValidationResult {
  isValid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  errorMessage?: {
    ar: string;
    en: string;
  };
}
