import { ICouponService } from "@/services/interfaces/ICouponService";
import { Coupon, CouponValidationResult } from "@/types/coupon";
import prisma from "../prisma";

export class PrismaCouponRepository implements ICouponService {
  private formatCoupon(c: any): Coupon {
    return {
      id: c.id,
      code: c.code,
      discountType: c.discountType as any,
      discountValue: c.discountValue,
      minOrderAmount: c.minOrderAmount || undefined,
      maxDiscountAmount: c.maxDiscountAmount || undefined,
      startDate: c.startDate.toISOString(),
      endDate: c.endDate.toISOString(),
      isActive: c.isActive,
      usageCount: c.usageCount,
      usageLimit: c.usageLimit || undefined,
      description: {
        ar: c.descAr,
        en: c.descEn,
      },
    };
  }

  async getCoupons(): Promise<Coupon[]> {
    const raw = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    });
    return raw.map((c) => this.formatCoupon(c));
  }

  async validateCoupon(code: string, cartTotal: number): Promise<CouponValidationResult> {
    const cleanCode = code.trim().toUpperCase();
    const coupon = await prisma.coupon.findUnique({
      where: { code: cleanCode },
    });

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

    // Check expiration date
    if (new Date() > coupon.endDate) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: {
          ar: "انتهت فترة صلاحية هذا الكود.",
          en: "This coupon code has expired.",
        },
      };
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return {
        isValid: false,
        discountAmount: 0,
        errorMessage: {
          ar: "تم استنفاذ الحد الأقصى لاستخدام هذا الكوبون.",
          en: "This coupon has reached its maximum usage limit.",
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
      coupon: this.formatCoupon(coupon),
      discountAmount: Math.round(discount),
    };
  }

  async createCoupon(data: Omit<Coupon, "id" | "usageCount">): Promise<Coupon> {
    const created = await prisma.coupon.create({
      data: {
        code: data.code.trim().toUpperCase(),
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscountAmount: data.maxDiscountAmount,
        startDate: new Date(data.startDate || Date.now()),
        endDate: new Date(data.endDate),
        isActive: data.isActive !== undefined ? data.isActive : true,
        usageLimit: data.usageLimit,
        descAr: data.description.ar,
        descEn: data.description.en,
      },
    });
    return this.formatCoupon(created);
  }

  async toggleCouponStatus(id: string): Promise<Coupon> {
    const current = await prisma.coupon.findUnique({ where: { id } });
    if (!current) throw new Error("Coupon not found");

    const updated = await prisma.coupon.update({
      where: { id },
      data: { isActive: !current.isActive },
    });
    return this.formatCoupon(updated);
  }

  async deleteCoupon(id: string): Promise<boolean> {
    await prisma.coupon.delete({ where: { id } });
    return true;
  }
}

export const couponPrismaRepository = new PrismaCouponRepository();
