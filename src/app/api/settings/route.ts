import { NextRequest } from "next/server";
import { apiHandler } from "@/server/apiHandler";
import { requireAdmin } from "@/server/middleware/auth";
import { logActivity } from "@/server/audit/auditLogger";
import prisma from "@/server/db/prisma";

const DEFAULT_SETTINGS = {
  storeNameAr: "إف جي كوليكتيف — براند أزياء وستريت وير معاصر",
  storeNameEn: "FG Collective — Contemporary Luxury Streetwear",
  supportEmail: "care@fgcollective.store",
  supportPhone: "01000000001",
  workingHours: "السبت إلى الخميس: 10:00 ص - 10:00 م",
  taxPercentage: 14,
  freeShippingThreshold: 1500,
  defaultShippingFee: 65,
  telegramNotificationsEnabled: true,
  telegramChannelId: "@fg_collective",
  orderPrefix: "FG-",
  maintenanceMode: false,
};

export const GET = apiHandler(
  async () => {
    const settingRecord = await prisma.storeSetting.findUnique({
      where: { key: "general_settings" },
    });

    if (!settingRecord) {
      return DEFAULT_SETTINGS;
    }

    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(settingRecord.valueJson) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  { contextName: "SettingsAPI" }
);

export const PATCH = apiHandler(
  async (req: NextRequest) => {
    const admin = requireAdmin(req);
    const body = await req.json();

    const currentSettings = await prisma.storeSetting.findUnique({
      where: { key: "general_settings" },
    });

    let current = DEFAULT_SETTINGS;
    if (currentSettings) {
      try {
        current = { ...DEFAULT_SETTINGS, ...JSON.parse(currentSettings.valueJson) };
      } catch {
        current = DEFAULT_SETTINGS;
      }
    }

    const merged = { ...current, ...body };

    await prisma.storeSetting.upsert({
      where: { key: "general_settings" },
      update: { valueJson: JSON.stringify(merged) },
      create: { key: "general_settings", valueJson: JSON.stringify(merged) },
    });

    await logActivity({
      adminId: admin.id,
      adminName: admin.fullName,
      action: "SETTINGS_UPDATED",
      resource: "settings/general",
      detailsAr: "تم تحديث إعدادات المتجر العامة وتفضيلات الشحن والضرائب",
      detailsEn: "Updated general store settings, tax, and shipping configurations",
    });

    return merged;
  },
  { contextName: "SettingsAPI" }
);
