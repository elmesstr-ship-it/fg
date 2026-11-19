import prisma from "@/server/db/prisma";
import { ThemeColors } from "@/types/theme";

export interface CreateThemeDTO {
  key: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  priority?: number;
  bannerMessageAr?: string;
  bannerMessageEn?: string;
  lightColors: Partial<ThemeColors>;
  darkColors: Partial<ThemeColors>;
}

export interface UpdateThemeDTO {
  nameAr?: string;
  nameEn?: string;
  descAr?: string;
  descEn?: string;
  priority?: number;
  bannerMessageAr?: string;
  bannerMessageEn?: string;
  lightColors?: Partial<ThemeColors>;
  darkColors?: Partial<ThemeColors>;
}

export class ThemeManagerService {
  private static instance: ThemeManagerService;

  public static getInstance(): ThemeManagerService {
    if (!ThemeManagerService.instance) {
      ThemeManagerService.instance = new ThemeManagerService();
    }
    return ThemeManagerService.instance;
  }

  /**
   * Seed default system themes if not present
   */
  async ensureBuiltinThemes(): Promise<void> {
    const builtinCount = await prisma.theme.count();
    if (builtinCount >= 3) return;

    const defaults = [
      {
        key: "default",
        nameAr: "السمة الأحادية الفاخرة (الافتراضية)",
        nameEn: "FG Monochrome (Default)",
        descAr: "سمة ستريت وير معاصرة بباليت أحادي مونوكروم ولمسات فضية حادة",
        descEn: "Contemporary streetwear theme with minimalist monochrome palette and razor silver accents",
        isActive: true,
        isCustom: false,
        priority: 10,
        bannerMessageAr: "شحن مجاني لكافة محافظات مصر للطلبات فوق 1,500 ج.م — دروب شتاء 2026 متاح الآن",
        bannerMessageEn: "Free Shipping Nationwide for Orders Over 1,500 EGP — Winter 2026 Drop Live Now",
        light: {
          primary: "#0a0a0a",
          primaryHover: "#27272a",
          primaryContrast: "#ffffff",
          accent: "#52525b",
          gold: "#71717a",
          goldLight: "#a1a1aa",
          goldDark: "#3f3f46",
          bg: "#fafafa",
          surface: "#ffffff",
          surfaceElevated: "#f4f4f5",
          border: "#e4e4e7",
          text: "#09090b",
          textMuted: "#71717a",
        },
        dark: {
          primary: "#ffffff",
          primaryHover: "#f4f4f5",
          primaryContrast: "#09090b",
          accent: "#a1a1aa",
          gold: "#d4d4d8",
          goldLight: "#e4e4e7",
          goldDark: "#71717a",
          bg: "#09090b",
          surface: "#121214",
          surfaceElevated: "#18181b",
          border: "#27272a",
          text: "#fafafa",
          textMuted: "#a1a1aa",
        },
      },
      {
        key: "summer",
        nameAr: "إصدار الصيف البحري",
        nameEn: "Summer Coast Drop",
        descAr: "أزرق المحيط وألوان منعشة للأطقم الخفيفة",
        descEn: "Ocean azure and refreshing breezes for lightweight summer drops",
        isActive: false,
        isCustom: false,
        priority: 50,
        bannerMessageAr: "انطلاق كوليكشن صيف 2026 — أقمشة قطنية خفيفة ومسامية للحرارة العالية",
        bannerMessageEn: "Summer 2026 Drop is Live — Breathable Lightweight Fabrics",
        light: {
          primary: "#0284c7",
          primaryHover: "#0369a1",
          primaryContrast: "#ffffff",
          accent: "#38bdf8",
          gold: "#38bdf8",
          goldLight: "#7dd3fc",
          goldDark: "#0284c7",
          bg: "#f8fafc",
          surface: "#ffffff",
          surfaceElevated: "#f1f5f9",
          border: "#e2e8f0",
          text: "#0f172a",
          textMuted: "#64748b",
        },
        dark: {
          primary: "#38bdf8",
          primaryHover: "#7dd3fc",
          primaryContrast: "#0f172a",
          accent: "#7dd3fc",
          gold: "#38bdf8",
          goldLight: "#bae6fd",
          goldDark: "#0284c7",
          bg: "#070c18",
          surface: "#0b132b",
          surfaceElevated: "#111f42",
          border: "#1e293b",
          text: "#f8fafc",
          textMuted: "#94a3b8",
        },
      },
      {
        key: "winter",
        nameAr: "دروب الشتاء الثقيل",
        nameEn: "Winter Heavyweight",
        descAr: "خامات ثقيلة دافئة مع درجات الفحم الحجري والأوبسيديان",
        descEn: "Heavyweight warm terry drops in deep charcoal and obsidian tones",
        isActive: false,
        isCustom: false,
        priority: 50,
        bannerMessageAr: "هوديز فرنش تيري 380 GSM وجواكت عازلة متوفرة الآن",
        bannerMessageEn: "380 GSM Heavy French Terry & Insulated Bombers Now Live",
        light: {
          primary: "#18181b",
          primaryHover: "#27272a",
          primaryContrast: "#ffffff",
          accent: "#3f3f46",
          gold: "#71717a",
          goldLight: "#a1a1aa",
          goldDark: "#27272a",
          bg: "#f4f4f5",
          surface: "#ffffff",
          surfaceElevated: "#e4e4e7",
          border: "#d4d4d8",
          text: "#18181b",
          textMuted: "#52525b",
        },
        dark: {
          primary: "#e4e4e7",
          primaryHover: "#f4f4f5",
          primaryContrast: "#18181b",
          accent: "#a1a1aa",
          gold: "#71717a",
          goldLight: "#a1a1aa",
          goldDark: "#3f3f46",
          bg: "#09090b",
          surface: "#141416",
          surfaceElevated: "#1c1c1f",
          border: "#27272a",
          text: "#f4f4f5",
          textMuted: "#a1a1aa",
        },
      },
    ];

    for (const def of defaults) {
      await prisma.theme.upsert({
        where: { key: def.key },
        update: {},
        create: {
          key: def.key,
          nameAr: def.nameAr,
          nameEn: def.nameEn,
          descAr: def.descAr,
          descEn: def.descEn,
          isActive: def.isActive,
          isCustom: def.isCustom,
          priority: def.priority,
          bannerMessageAr: def.bannerMessageAr,
          bannerMessageEn: def.bannerMessageEn,
          lightColorsJson: JSON.stringify(def.light),
          darkColorsJson: JSON.stringify(def.dark),
        },
      });
    }
  }

  /**
   * Evaluate active theme based on schedules or fallback to manual
   */
  async evaluateActiveTheme(dateOverride?: Date): Promise<{ activeThemeKey: string; reason: string }> {
    await this.ensureBuiltinThemes();

    const now = dateOverride || new Date();

    // Check active schedules
    const activeSchedules = await prisma.themeSchedule.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
        status: { in: ["scheduled", "active"] },
      },
      include: {
        theme: true,
      },
      orderBy: {
        theme: {
          priority: "desc",
        },
      },
    });

    if (activeSchedules.length > 0) {
      const topSchedule = activeSchedules[0];

      // Update schedule status to active if not already
      if (topSchedule.status !== "active") {
        await prisma.themeSchedule.update({
          where: { id: topSchedule.id },
          data: { status: "active" },
        });
      }

      // Mark this theme active, and others inactive
      await prisma.$transaction([
        prisma.theme.updateMany({ data: { isActive: false } }),
        prisma.theme.update({
          where: { id: topSchedule.themeId },
          data: { isActive: true },
        }),
      ]);

      return {
        activeThemeKey: topSchedule.theme.key,
        reason: `Active schedule in effect until ${topSchedule.endDate.toISOString()}`,
      };
    }

    // Check expired schedules with autoRevert
    const expiredSchedules = await prisma.themeSchedule.findMany({
      where: {
        endDate: { lt: now },
        status: "active",
      },
    });

    for (const exp of expiredSchedules) {
      await prisma.themeSchedule.update({
        where: { id: exp.id },
        data: { status: "completed" },
      });
    }

    const hadAutoRevertExpired = expiredSchedules.some((s) => s.autoRevert);
    if (hadAutoRevertExpired) {
      await prisma.$transaction([
        prisma.theme.updateMany({ data: { isActive: false } }),
        prisma.theme.update({
          where: { key: "default" },
          data: { isActive: true },
        }),
      ]);

      return {
        activeThemeKey: "default",
        reason: "Active schedule expired; automatically reverted to default theme",
      };
    }

    // Check manually active
    const manuallyActive = await prisma.theme.findFirst({
      where: { isActive: true },
    });

    if (manuallyActive) {
      return {
        activeThemeKey: manuallyActive.key,
        reason: `Manually active theme: "${manuallyActive.nameEn}"`,
      };
    }

    // Fallback to default
    await prisma.theme.updateMany({ data: { isActive: false } });
    await prisma.theme.update({
      where: { key: "default" },
      data: { isActive: true },
    });

    return {
      activeThemeKey: "default",
      reason: "No active schedule; reverted to default theme",
    };
  }

  /**
   * Create a new custom theme
   */
  async createTheme(data: CreateThemeDTO) {
    await this.ensureBuiltinThemes();

    const existing = await prisma.theme.findUnique({
      where: { key: data.key },
    });
    if (existing) {
      throw new Error(`Theme with slug "${data.key}" already exists`);
    }

    const baseColors = {
      primary: "#0a0a0a",
      primaryHover: "#27272a",
      primaryContrast: "#ffffff",
      accent: "#52525b",
      gold: "#71717a",
      goldLight: "#a1a1aa",
      goldDark: "#3f3f46",
      bg: "#fafafa",
      surface: "#ffffff",
      surfaceElevated: "#f4f4f5",
      border: "#e4e4e7",
      text: "#09090b",
      textMuted: "#71717a",
    };

    const light = { ...baseColors, ...data.lightColors };
    const dark = {
      ...baseColors,
      bg: "#09090b",
      surface: "#121214",
      surfaceElevated: "#18181b",
      border: "#27272a",
      text: "#fafafa",
      textMuted: "#a1a1aa",
      ...data.darkColors,
    };

    return await prisma.theme.create({
      data: {
        key: data.key.trim().toLowerCase(),
        nameAr: data.nameAr.trim(),
        nameEn: data.nameEn.trim(),
        descAr: data.descAr.trim(),
        descEn: data.descEn.trim(),
        isCustom: true,
        isActive: false,
        priority: data.priority ?? 20,
        bannerMessageAr: data.bannerMessageAr,
        bannerMessageEn: data.bannerMessageEn,
        lightColorsJson: JSON.stringify(light),
        darkColorsJson: JSON.stringify(dark),
      },
    });
  }

  /**
   * Edit existing theme
   */
  async updateTheme(key: string, data: UpdateThemeDTO) {
    const theme = await prisma.theme.findUnique({ where: { key } });
    if (!theme) throw new Error(`Theme "${key}" not found`);

    const updateData: any = {};
    if (data.nameAr) updateData.nameAr = data.nameAr.trim();
    if (data.nameEn) updateData.nameEn = data.nameEn.trim();
    if (data.descAr) updateData.descAr = data.descAr.trim();
    if (data.descEn) updateData.descEn = data.descEn.trim();
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.bannerMessageAr !== undefined) updateData.bannerMessageAr = data.bannerMessageAr;
    if (data.bannerMessageEn !== undefined) updateData.bannerMessageEn = data.bannerMessageEn;

    if (data.lightColors) {
      const current = JSON.parse(theme.lightColorsJson || "{}");
      updateData.lightColorsJson = JSON.stringify({ ...current, ...data.lightColors });
    }
    if (data.darkColors) {
      const current = JSON.parse(theme.darkColorsJson || "{}");
      updateData.darkColorsJson = JSON.stringify({ ...current, ...data.darkColors });
    }

    return await prisma.theme.update({
      where: { key },
      data: updateData,
    });
  }

  /**
   * Schedule theme activation
   */
  async scheduleTheme(
    themeKey: string,
    startDate: Date | string,
    endDate: Date | string,
    autoRevert = true
  ) {
    const theme = await prisma.theme.findUnique({ where: { key: themeKey } });
    if (!theme) throw new Error(`Theme "${themeKey}" not found`);

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end <= start) {
      throw new Error("End date must be after start date");
    }

    return await prisma.themeSchedule.create({
      data: {
        themeId: theme.id,
        startDate: start,
        endDate: end,
        autoRevert,
        status: "scheduled",
      },
    });
  }
}

export const themeManager = ThemeManagerService.getInstance();
