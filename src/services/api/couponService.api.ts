import { ICouponService } from "../interfaces/ICouponService";
import { Coupon, CouponValidationResult } from "@/types/coupon";
import { api } from "@/lib/apiClient";

export class ApiCouponService implements ICouponService {
  async getCoupons(): Promise<Coupon[]> {
    return api.get<Coupon[]>("/api/coupons");
  }

  async validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult> {
    return api.post<CouponValidationResult>("/api/coupons/validate", { code, cartTotal });
  }

  async createCoupon(coupon: Omit<Coupon, "id" | "usageCount">): Promise<Coupon> {
    return api.post<Coupon>("/api/coupons", coupon);
  }

  async toggleCouponStatus(id: string): Promise<Coupon> {
    return api.patch<Coupon>(`/api/coupons/${id}`, { toggleStatus: true });
  }

  async deleteCoupon(id: string): Promise<boolean> {
    const res = await api.delete<{ deleted: boolean }>(`/api/coupons/${id}`);
    return res.deleted;
  }
}

export const couponApiService = new ApiCouponService();
