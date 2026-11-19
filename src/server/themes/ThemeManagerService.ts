import prisma from "@/server/db/prisma";
import { ThemeColors } from "@/types/theme";
import { SEASONAL_THEMES } from "@/config/themes";

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
   * Seed all 7 default system fashion themes if not present
   */
  async ensureBuiltinThemes(): Promise<void> {
    const builtinCount = await prisma.theme.count();
    if (builtinCount >= 7) return;

    for (const [key, t] of Object.entries(SEASONAL_THEMES)) {
      await prisma.theme.upsert({
        where: { key: t.id },
        update: {
          nameAr: t.name.ar,
          nameEn: t.name.en,
          descAr: t.description.ar,
          descEn: t.description.en,
          bannerMessageAr: t.bannerMessage?.ar,
          bannerMessageEn: t.bannerMessage?.en,
          lightColorsJson: JSON.stringify(t.light),
          darkColorsJson: JSON.stringify(t.dark),
        },
        create: {
          key: t.id,
          nameAr: t.name.ar,
          nameEn: t.name.en,
          descAr: t.description.ar,
          descEn: t.description.en,
          isActive: t.id === "default",
          isCustom: false,
          priority: t.id === "default" ? 10 : 50,
          bannerMessageAr: t.bannerMessage?.ar,
          bannerMessageEn: t.bannerMessage?.en,
          lightColorsJson: JSON.stringify(t.light),
          darkColorsJson: JSON.stringify(t.dark),
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

      if (topSchedule.status !== "active") {
        await prisma.themeSchedule.update({
          where: { id: topSchedule.id },
          data: { status: "active" },
        });
      }

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

    const baseTheme = SEASONAL_THEMES.default;
    const light = { ...baseTheme.light, ...data.lightColors };
    const dark = { ...baseTheme.dark, ...data.darkColors };

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
