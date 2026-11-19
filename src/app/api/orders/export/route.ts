import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/server/middleware/auth";
import { db } from "@/services";

export async function GET(req: NextRequest) {
  try {
    requireAdmin(req);
    const searchParams = req.nextUrl.searchParams;
    const status = (searchParams.get("status") as any) || undefined;
    const search = searchParams.get("search") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const paymentMethod = searchParams.get("paymentMethod") || undefined;

    const orders = await db.orders.getOrders({
      status,
      search,
      startDate,
      endDate,
      paymentMethod,
    });

    const headers = [
      "رقم الطلب",
      "تاريخ الطلب",
      "اسم العميل",
      "رقم الهاتف",
      "البريد الإلكتروني",
      "المحافظة",
      "العنوان",
      "عدد الأصناف",
      "الأصناف المطلوبة",
      "المجموع الفرعي (ج.م)",
      "رسوم الشحن (ج.م)",
      "قيمة الخصم (ج.م)",
      "الإجمالي النهائي (ج.م)",
      "طريقة الدفع",
      "حالة الدفع",
      "حالة الطلب",
      "رقم بوليصة الشحن",
      "شركة الشحن",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows: string[] = [];
    rows.push(headers.map(escapeCsv).join(","));

    let totalRevenue = 0;
    let totalDiscount = 0;
    let totalShipping = 0;

    for (const o of orders) {
      totalRevenue += o.total;
      totalDiscount += o.discountAmount;
      totalShipping += o.shippingFee;

      const itemsDescription = (o.items || [])
        .map((it) => {
          const name = typeof it.productName === "string" ? it.productName : it.productName.ar;
          return `${name} (×${it.quantity} - ${it.price} ج.م)`;
        })
        .join(" | ");

      const row = [
        o.orderNumber,
        new Date(o.createdAt).toLocaleString("ar-EG"),
        o.customerName,
        o.customerPhone,
        o.customerEmail,
        o.shippingAddress?.governorate || "",
        o.shippingAddress?.streetAddress || "",
        (o.items || []).reduce((s, it) => s + it.quantity, 0),
        itemsDescription,
        o.subtotal,
        o.shippingFee,
        o.discountAmount,
        o.total,
        o.paymentMethod,
        o.paymentStatus,
        o.orderStatus,
        o.trackingNumber || "—",
        o.shippingProvider || "Bosta Logistics",
      ];

      rows.push(row.map(escapeCsv).join(","));
    }

    // Add Summary Row
    rows.push("");
    rows.push(
      [
        "الإجمالي الكلي للتقرير",
        `عدد الطلبات: ${orders.length}`,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        totalShipping,
        totalDiscount,
        totalRevenue,
        "",
        "",
        "",
        "",
        "",
      ]
        .map(escapeCsv)
        .join(",")
    );

    // Add UTF-8 BOM so Excel on Windows properly displays Arabic characters
    const csvContent = "\uFEFF" + rows.join("\r\n");

    const now = new Date();
    const dateStr = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}`;
    const filename = `Sancta_Maria_Orders_Report_${dateStr}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Export failed" }, { status: 500 });
  }
}
