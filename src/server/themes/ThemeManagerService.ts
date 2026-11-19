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
    if (builtinCount >= 4) return;

    const defaults = [
      {
        key: "default",
        nameAr: "المظهر الليتورجي المعتمد (الذهبي الملكي)",
        nameEn: "Sancta Maria Royal Liturgical (Gold)",
        descAr: "الألوان الطقسية الرسمية للكنيسة: النبيذي الملوكي والذهب عيار 24",
        descEn: "Traditional church liturgical colors: Royal Burgundy and 24K Gold",
        isActive: true,
        isCustom: false,
        priority: 10,
        bannerMessageAr: "مرحباً بكم في متجر سانكتا ماريا للمقتنيات الكنسية الفاخرة",
        bannerMessageEn: "Welcome to Sancta Maria Liturgical Church Products",
        light: {
          primary: "#781d22",
          primaryHover: "#5e161a",
          primaryContrast: "#ffffff",
          accent: "#bfa15f",
          gold: "#c5a059",
          goldLight: "#dfc285",
          goldDark: "#947231",
          bg: "#fcfbf7",
          surface: "#ffffff",
          surfaceElevated: "#f7f5ed",
          border: "#e8e3d3",
          text: "#1c1917",
          textMuted: "#78716c",
        },
        dark: {
          primary: "#99262c",
          primaryHover: "#b32d34",
          primaryContrast: "#ffffff",
          accent: "#dfc285",
          gold: "#dfc285",
          goldLight: "#f3e5c8",
          goldDark: "#b89345",
          bg: "#0c0a09",
          surface: "#1c1917",
          surfaceElevated: "#292524",
          border: "#44403c",
          text: "#fafaf9",
          textMuted: "#a8a29e",
        },
      },
      {
        key: "christmas",
        nameAr: "مظهر عيد الميلاد المجيد (الأحمر والذهبي)",
        nameEn: "Holy Nativity / Christmas Theme",
        descAr: "الأحمر القرمزي الملوكي والذهب والزمرد احتفاءً بميلاد مخلصنا",
        descEn: "Festive crimson and gold celebrating the Holy Nativity",
        isActive: false,
        isCustom: false,
        priority: 50,
        bannerMessageAr: "المجد لله في الأعالي وعلى الأرض السلام وفي الناس المسرة - احتفالات عيد الميلاد",
        bannerMessageEn: "Glory to God in the highest, and on earth peace - Holy Nativity Season",
        light: {
          primary: "#8B0000",
          primaryHover: "#660000",
          primaryContrast: "#ffffff",
          accent: "#228B22",
          gold: "#D4AF37",
          goldLight: "#F0E68C",
          goldDark: "#B8860B",
          bg: "#FFFDF9",
          surface: "#FFFFFF",
          surfaceElevated: "#FBF5EE",
          border: "#EADBCE",
          text: "#2B1B17",
          textMuted: "#7A6855",
        },
        dark: {
          primary: "#A30000",
          primaryHover: "#C40000",
          primaryContrast: "#ffffff",
          accent: "#2E8B57",
          gold: "#FFD700",
          goldLight: "#FFE066",
          goldDark: "#CCAA00",
          bg: "#0D0505",
          surface: "#1C0D0D",
          surfaceElevated: "#2C1717",
          border: "#4A2626",
          text: "#FFF8F0",
          textMuted: "#B89F9F",
        },
      },
      {
        key: "easter",
        nameAr: "مظهر القيامة المجيدة (الأبيض والذهب الملكي)",
        nameEn: "Holy Resurrection / Easter Theme",
        descAr: "البياض النوراني والنقاء الفصحي لبهجة قيامة السيد المسيح",
        descEn: "Luminous white and radiant gold for the Glorious Resurrection",
        isActive: false,
        isCustom: false,
        priority: 50,
        bannerMessageAr: "إخرستوس آنيستي.. آليثوس آنيستي! المسيح قام.. بالحقيقة قام!",
        bannerMessageEn: "Christ is Risen! Truly He is Risen! Holy Pascha Season",
        light: {
          primary: "#B8860B",
          primaryHover: "#996515",
          primaryContrast: "#ffffff",
          accent: "#4B0082",
          gold: "#DAA520",
          goldLight: "#F5DEB3",
          goldDark: "#8B6508",
          bg: "#FFFFFA",
          surface: "#FFFFFF",
          surfaceElevated: "#F8F7EE",
          border: "#E8E4CF",
          text: "#1F1D16",
          textMuted: "#736E5C",
        },
        dark: {
          primary: "#DAA520",
          primaryHover: "#FFD700",
          primaryContrast: "#000000",
          accent: "#8A2BE2",
          gold: "#FFE4B5",
          goldLight: "#FFF8DC",
          goldDark: "#CD9B1D",
          bg: "#0B0A06",
          surface: "#18160E",
          surfaceElevated: "#252217",
          border: "#423D2B",
          text: "#FFFFF5",
          textMuted: "#A8A391",
        },
      },
      {
        key: "halloween",
        nameAr: "مظهر الخريف واليقطين (برتقالي وأرجواني)",
        nameEn: "Autumn / Harvest Theme",
        descAr: "الألوان الخريفية الدافئة ولمسات اليقطين الطقسي",
        descEn: "Warm autumn harvest shades and festive seasonal accents",
        isActive: false,
        isCustom: false,
        priority: 30,
        bannerMessageAr: "موسم حصاد الخيرات والبركات الخريفية",
        bannerMessageEn: "Autumn Harvest & Blessings Season",
        light: {
          primary: "#D35400",
          primaryHover: "#A04000",
          primaryContrast: "#ffffff",
          accent: "#6C3483",
          gold: "#F39C12",
          goldLight: "#F8C471",
          goldDark: "#B9770E",
          bg: "#FEF9E7",
          surface: "#FFFFFF",
          surfaceElevated: "#FCF3CF",
          border: "#F5CBA7",
          text: "#2C3E50",
          textMuted: "#7F8C8D",
        },
        dark: {
          primary: "#E67E22",
          primaryHover: "#F39C12",
          primaryContrast: "#000000",
          accent: "#9B59B6",
          gold: "#F1C40F",
          goldLight: "#F7DC6F",
          goldDark: "#D4AC0D",
          bg: "#100904",
          surface: "#1E1208",
          surfaceElevated: "#2D1C0F",
          border: "#4E321D",
          text: "#FDFEFE",
          textMuted: "#BDC3C7",
        },
      },
    ];

    for (const d of defaults) {
      await prisma.theme.upsert({
        where: { key: d.key },
        update: {},
        create: {
          key: d.key,
          nameAr: d.nameAr,
          nameEn: d.nameEn,
          descAr: d.descAr,
          descEn: d.descEn,
          isActive: d.isActive,
          isCustom: d.isCustom,
          priority: d.priority,
          bannerMessageAr: d.bannerMessageAr,
          bannerMessageEn: d.bannerMessageEn,
          lightColorsJson: JSON.stringify(d.light),
          darkColorsJson: JSON.stringify(d.dark),
        },
      });
    }
  }

  /**
   * Evaluate schedules and determine which theme should be active right now (or at simulated date).
   * Checks: Start Date <= Target Date <= End Date.
   * Resolves conflicts using Theme Priority (Higher number wins).
   * Automatically expires finished schedules and activates the winning theme.
   */
  async evaluateActiveTheme(simulatedDate?: Date): Promise<{
    activeThemeKey: string;
    reason: string;
    matchedScheduleId?: string;
  }> {
    await this.ensureBuiltinThemes();
    const now = simulatedDate || new Date();

    // 1. Find all schedules that match the target date
    const activeSchedules = await prisma.themeSchedule.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: { theme: true },
    });

    // 2. Mark expired schedules that ended before now and check if any expired schedule had autoRevert
    const expiredSchedules = await prisma.themeSchedule.findMany({
      where: {
        endDate: { lt: now },
        status: { in: ["scheduled", "active"] },
      },
    });

    if (expiredSchedules.length > 0) {
      await prisma.themeSchedule.updateMany({
        where: {
          id: { in: expiredSchedules.map((s) => s.id) },
        },
        data: { status: "expired" },
      });
    }

    if (activeSchedules.length > 0) {
      // Sort by Theme Priority descending, then startDate descending
      activeSchedules.sort((a, b) => {
        const pDiff = (b.theme.priority || 0) - (a.theme.priority || 0);
        if (pDiff !== 0) return pDiff;
        return b.startDate.getTime() - a.startDate.getTime();
      });

      const winningSchedule = activeSchedules[0];

      // Mark winning schedule as active, and all other overlapping as scheduled
      await prisma.$transaction([
        prisma.themeSchedule.update({
          where: { id: winningSchedule.id },
          data: { status: "active" },
        }),
        prisma.theme.updateMany({ data: { isActive: false } }),
        prisma.theme.update({
          where: { id: winningSchedule.themeId },
          data: { isActive: true },
        }),
      ]);

      return {
        activeThemeKey: winningSchedule.theme.key,
        reason: `Scheduled activation: "${winningSchedule.theme.nameEn}" (Priority: ${winningSchedule.theme.priority})`,
        matchedScheduleId: winningSchedule.id,
      };
    }

    // If no active schedules exist, check if there was an expired schedule with autoRevert
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

    // If no active schedule and no expired schedule triggered, check manually active
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
      reason: "No active schedule; reverted to default royal theme",
    };
  }

  /**
   * Create a new custom theme (Administrators never need to edit source code)
   */
  async createTheme(data: CreateThemeDTO) {
    await this.ensureBuiltinThemes();

    const existing = await prisma.theme.findUnique({
      where: { key: data.key },
    });
    if (existing) {
      throw new Error(`Theme with slug "${data.key}" already exists`);
    }

    // Default template colors if partial
    const baseColors = {
      primary: "#781d22",
      primaryHover: "#5e161a",
      primaryContrast: "#ffffff",
      accent: "#bfa15f",
      gold: "#c5a059",
      goldLight: "#dfc285",
      goldDark: "#947231",
      bg: "#fcfbf7",
      surface: "#ffffff",
      surfaceElevated: "#f7f5ed",
      border: "#e8e3d3",
      text: "#1c1917",
      textMuted: "#78716c",
    };

    const light = { ...baseColors, ...data.lightColors };
    const dark = {
      ...baseColors,
      bg: "#0c0a09",
      surface: "#1c1917",
      surfaceElevated: "#292524",
      border: "#44403c",
      text: "#fafaf9",
      textMuted: "#a8a29e",
      ...data.darkColors,
    };

    const created = await prisma.theme.create({
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

    return created;
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

    const schedule = await prisma.themeSchedule.create({
      data: {
        themeId: theme.id,
        startDate: start,
        endDate: end,
        autoRevert,
        status: "scheduled",
      },
    });

    return schedule;
  }
}

export const themeManager = ThemeManagerService.getInstance();
