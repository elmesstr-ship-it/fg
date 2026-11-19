import { ICouponService } from "../interfaces/ICouponService";
import { Coupon, CouponValidationResult } from "@/types/coupon";
import { MOCK_COUPONS } from "./mockData";

export class MockCouponService implements ICouponService {
  private coupons: Coupon[] = [...MOCK_COUPONS];

  async getCoupons(): Promise<Coupon[]> {
    return [...this.coupons];
  }

  async validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const cleanCode = code.trim().toUpperCase();
    const coupon = this.coupons.find((c) => c.code.toUpperCase() === cleanCode);

    if (!coupon) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: {
          ar: "كود الخصم غير موجود أو منتهي الصلاحية.",
          en: "Coupon code does not exist or has expired.",
        },
      };
    }

    if (!coupon.isActive) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: {
          ar: "كود الخصم غير نشط حالياً.",
          en: "This coupon is currently inactive.",
        },
      };
    }

    if (coupon.minOrderAmount && cartTotal < coupon.minOrderAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: {
          ar: `الحد الأدنى لتفعيل هذا الكود هو ${coupon.minOrderAmount} ج.م.`,
          en: `Minimum order amount for this coupon is ${coupon.minOrderAmount} EGP.`,
        },
      };
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      isValid: true,
      coupon,
      discountAmount: Math.round(discount),
    };
  }

  async createCoupon(data: Omit<Coupon, "id" | "usageCount">): Promise<Coupon> {
    const newCoupon: Coupon = {
      ...data,
      id: "coup-" + Date.now(),
      usageCount: 0,
    };
    this.coupons.unshift(newCoupon);
    return newCoupon;
  }

  async toggleCouponStatus(id: string): Promise<Coupon> {
    const idx = this.coupons.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error("Coupon not found");
    this.coupons[idx].isActive = !this.coupons[idx].isActive;
    return { ...this.coupons[idx] };
  }

  async deleteCoupon(id: string): Promise<boolean> {
    const prevLen = this.coupons.length;
    this.coupons = this.coupons.filter((c) => c.id !== id);
    return this.coupons.length < prevLen;
  }
}

export const couponService = new MockCouponService();
