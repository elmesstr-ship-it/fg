import { NextRequest, NextResponse } from "next/server";
import { themeManager } from "@/server/themes/ThemeManagerService";
import { requireAdmin } from "@/server/middleware/auth";
import prisma from "@/server/db/prisma";

export async function GET(req: NextRequest) {
  try {
    await themeManager.ensureBuiltinThemes();
    const { searchParams } = new URL(req.url);
    const simulatedDateParam = searchParams.get("simulatedDate");

    let evaluationResult = null;
    if (simulatedDateParam) {
      const simulated = new Date(simulatedDateParam);
      evaluationResult = await themeManager.evaluateActiveTheme(simulated);
    }

    const themes = await prisma.theme.findMany({
      include: {
        schedules: {
          orderBy: { startDate: "desc" },
        },
      },
      orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
    });

    const activeTheme = themes.find((t) => t.isActive) || themes[0];

    const formatted = themes.map((t) => ({
      id: t.id,
      key: t.key,
      name: { ar: t.nameAr, en: t.nameEn },
      description: { ar: t.descAr, en: t.descEn },
      isActive: t.isActive,
      isCustom: t.isCustom,
      priority: t.priority,
      bannerMessage: t.bannerMessageAr
        ? { ar: t.bannerMessageAr, en: t.bannerMessageEn || t.bannerMessageAr }
        : undefined,
      lightColors: JSON.parse(t.lightColorsJson || "{}"),
      darkColors: JSON.parse(t.darkColorsJson || "{}"),
      schedules: t.schedules.map((s) => ({
        id: s.id,
        themeId: s.themeId,
        startDate: s.startDate.toISOString(),
        endDate: s.endDate.toISOString(),
        autoRevert: s.autoRevert,
        status: s.status,
      })),
    }));

    return NextResponse.json({
      success: true,
      activeThemeKey: activeTheme ? activeTheme.key : "default",
      evaluationResult,
      data: formatted,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin(req);
    const body = await req.json();
    const { action } = body;

    if (action === "create") {
      const created = await themeManager.createTheme(body.theme);
      return NextResponse.json({ success: true, data: created });
    }

    if (action === "update") {
      const updated = await themeManager.updateTheme(body.themeKey, body.updates);
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === "activate") {
      const { themeKey } = body;
      if (!themeKey) {
        return NextResponse.json({ success: false, error: "themeKey is required" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.theme.updateMany({ data: { isActive: false } }),
        prisma.theme.update({
          where: { key: themeKey },
          data: { isActive: true },
        }),
      ]);

      // Audit log
      await prisma.activityLog.create({
        data: {
          adminId: "admin",
          adminName: "Administrator",
          action: "THEME_ACTIVATED",
          resource: themeKey,
          detailsAr: `تم تفعيل المظهر الكنسي: ${themeKey}`,
          detailsEn: `Activated brand theme: ${themeKey}`,
          ipAddress: "127.0.0.1",
        },
      });

      return NextResponse.json({
        success: true,
        activeThemeKey: themeKey,
        data: {
          success: true,
          activatedKey: themeKey,
        },
      });
    }

    if (action === "schedule") {
      const { themeKey, startDate, endDate, autoRevert } = body;
      const schedule = await themeManager.scheduleTheme(themeKey, startDate, endDate, autoRevert);
      return NextResponse.json({ success: true, data: schedule });
    }

    if (action === "evaluate") {
      const simulated = body.simulatedDate ? new Date(body.simulatedDate) : undefined;
      const result = await themeManager.evaluateActiveTheme(simulated);
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const themeKey = searchParams.get("themeKey");

    if (!themeKey) {
      return NextResponse.json({ success: false, error: "themeKey is required" }, { status: 400 });
    }

    const theme = await prisma.theme.findUnique({ where: { key: themeKey } });
    if (!theme) {
      return NextResponse.json({ success: false, error: "Theme not found" }, { status: 404 });
    }

    if (!theme.isCustom) {
      return NextResponse.json({ success: false, error: "Cannot delete built-in ecclesiastical theme" }, { status: 400 });
    }

    await prisma.theme.delete({ where: { key: themeKey } });
    return NextResponse.json({ success: true, message: `Theme ${themeKey} deleted` });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
