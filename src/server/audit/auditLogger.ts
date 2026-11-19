import prisma from "../db/prisma";

export interface LogActivityParams {
  adminId?: string;
  adminName?: string;
  action: string;
  resource: string;
  detailsAr: string;
  detailsEn: string;
  ipAddress?: string;
}

export async function logActivity(params: LogActivityParams) {
  try {
    return await prisma.activityLog.create({
      data: {
        adminId: params.adminId || "admin-system",
        adminName: params.adminName || "المشرف الإداري",
        action: params.action,
        resource: params.resource,
        detailsAr: params.detailsAr,
        detailsEn: params.detailsEn,
        ipAddress: params.ipAddress || "127.0.0.1",
      },
    });
  } catch (err) {
    console.error("[AuditLogger] Failed to write activity log:", err);
    return null;
  }
}
