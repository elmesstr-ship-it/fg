import { Coupon, CouponValidationResult } from "@/types/coupon";

export interface ICouponService {
  getCoupons(): Promise<Coupon[]>;
  validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult>;
  createCoupon(coupon: Omit<Coupon, "id" | "usageCount">): Promise<Coupon>;
  toggleCouponStatus(id: string): Promise<Coupon>;
  deleteCoupon(id: string): Promise<boolean>;
}
