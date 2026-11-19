import { NextRequest, NextResponse } from "next/server";
import { NotFoundError } from "@/server/errors/AppError";
import prisma from "@/server/db/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id }, { orderNumber: id }],
    },
    include: {
      items: true,
      user: {
        include: { profile: true },
      },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // VAT Breakdown (14%)
  const vatRate = 0.14;
  const taxableAmount = Math.round((order.subtotal / (1 + vatRate)) * 100) / 100;
  const vatAmount = Math.round((order.subtotal - taxableAmount) * 100) / 100;

  const invoiceHtml = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>فاتورة ضريبية رسمية - ${order.orderNumber} - سانكتا ماريا</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Cairo', sans-serif;
    }
    
    body {
      background-color: #f8f9fa;
      color: #1e293b;
      padding: 40px 20px;
    }

    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
    }

    .header-table {
      width: 100%;
      border-bottom: 2px solid #5A1827;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }

    .brand-title {
      font-size: 26px;
      font-weight: 800;
      color: #5A1827;
      letter-spacing: -0.5px;
    }

    .brand-subtitle {
      font-size: 13px;
      color: #C5A059;
      font-weight: 700;
      margin-top: 4px;
    }

    .invoice-badge {
      display: inline-block;
      background: #FAF8F5;
      border: 1px solid #C5A059;
      color: #5A1827;
      padding: 6px 16px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 14px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 32px;
      background: #fdfbf7;
      border: 1px solid #f1ece1;
      padding: 24px;
      border-radius: 16px;
    }

    .meta-item span {
      display: block;
      font-size: 11px;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .meta-item strong {
      font-size: 14px;
      color: #0f172a;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }

    .items-table th {
      background: #FAF8F5;
      color: #5A1827;
      font-weight: 700;
      font-size: 12px;
      padding: 12px 16px;
      text-align: right;
      border-bottom: 1px solid #e2e8f0;
    }

    .items-table td {
      padding: 14px 16px;
      font-size: 13px;
      border-bottom: 1px solid #f1f5f9;
    }

    .totals-box {
      margin-right: auto;
      width: 320px;
      background: #FAF8F5;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 32px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 8px;
      color: #475569;
    }

    .totals-row.grand-total {
      border-top: 2px dashed #C5A059;
      padding-top: 12px;
      margin-top: 12px;
      font-size: 16px;
      font-weight: 800;
      color: #5A1827;
    }

    .footer-note {
      text-align: center;
      border-top: 1px solid #e2e8f0;
      padding-top: 24px;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.8;
    }

    .print-actions {
      text-align: center;
      margin-bottom: 24px;
    }

    .btn-print {
      background: #5A1827;
      color: white;
      border: none;
      padding: 12px 28px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(90, 24, 39, 0.2);
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .print-actions {
        display: none;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>

  <div class="print-actions">
    <button class="btn-print" onclick="window.print()">🖨️ طباعة الفاتورة أو الحفظ كـ PDF</button>
  </div>

  <div class="invoice-card">
    <table class="header-table">
      <tr>
        <td>
          <h1 class="brand-title">سانكتا ماريا</h1>
          <p class="brand-subtitle">للمقتنيات الكنسية والأواني والطقوس الأرثوذكسية الفاخرة</p>
          <p style="font-size: 10px; color: #64748b; margin-top: 4px;">بطاقة ضريبية: 712-984-331 | سجل تجاري: 498214</p>
        </td>
        <td style="text-align: left;">
          <div class="invoice-badge">فاتورة مبيعات ضريبية</div>
          <p style="font-size: 12px; font-weight: 700; color: #5A1827; margin-top: 6px;">${order.orderNumber}</p>
        </td>
      </tr>
    </table>

    <div class="meta-grid">
      <div class="meta-item">
        <span>بيانات المشتري (العميل)</span>
        <strong>${order.customerName}</strong>
        <p style="font-size: 12px; color: #475569; margin-top: 2px;">هاتف: ${order.customerPhone}</p>
        <p style="font-size: 12px; color: #475569;">بريد: ${order.customerEmail}</p>
      </div>

      <div class="meta-item">
        <span>عنوان التوصيل المعتمد</span>
        <strong>${order.governorate} - ${order.city}</strong>
        <p style="font-size: 12px; color: #475569; margin-top: 2px;">${order.streetAddress}</p>
      </div>

      <div class="meta-item">
        <span>تاريخ وتوقيت الطلب</span>
        <strong>${new Date(order.createdAt).toLocaleString("ar-EG")}</strong>
      </div>

      <div class="meta-item">
        <span>بوليصة الشحن وطريقة الدفع</span>
        <strong>${order.trackingNumber || "قيد التجهيز"} (${order.shippingProvider || "Bosta"})</strong>
        <p style="font-size: 12px; color: #475569; margin-top: 2px;">طريقة السداد: ${order.paymentMethod === "cash_on_delivery" ? "دفع عند الاستلام" : order.paymentMethod}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>#</th>
          <th>الصنف الطقسي</th>
          <th style="text-align: center;">الكمية</th>
          <th style="text-align: left;">سعر الوحدة</th>
          <th style="text-align: left;">الإجمالي</th>
        </tr>
      </thead>
      <tbody>
        ${(order.items || [])
          .map(
            (it, idx) => `
          <tr>
            <td style="color: #94a3b8; font-size: 11px;">${idx + 1}</td>
            <td><strong>${it.productName}</strong> ${it.variantName ? `<span style="font-size: 11px; color: #64748b;">(${it.variantName})</span>` : ""}</td>
            <td style="text-align: center;">${it.quantity}</td>
            <td style="text-align: left;">${it.price.toLocaleString()} ج.م</td>
            <td style="text-align: left;"><strong>${(it.price * it.quantity).toLocaleString()} ج.م</strong></td>
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>

    <div class="totals-box">
      <div class="totals-row">
        <span>المجموع قبل الضريبة</span>
        <span>${taxableAmount.toLocaleString()} ج.م</span>
      </div>
      <div class="totals-row">
        <span>ضريبة القيمة المضافة (14%)</span>
        <span>${vatAmount.toLocaleString()} ج.م</span>
      </div>
      <div class="totals-row">
        <span>المجموع الفرعي شاملاً الضريبة</span>
        <span>${order.subtotal.toLocaleString()} ج.م</span>
      </div>
      <div class="totals-row">
        <span>تكلفة الشحن والتوصيل</span>
        <span>${order.shippingFee === 0 ? "شحن مجاني" : `${order.shippingFee.toLocaleString()} ج.م`}</span>
      </div>
      ${
        order.discountAmount > 0
          ? `
      <div class="totals-row" style="color: #15803d; font-weight: 700;">
        <span>الخصم المطبق</span>
        <span>- ${order.discountAmount.toLocaleString()} ج.م</span>
      </div>
      `
          : ""
      }
      <div class="totals-row grand-total">
        <span>المجموع الإجمالي الواجب سداده</span>
        <span>${order.total.toLocaleString()} ج.م</span>
      </div>
    </div>

    <div class="footer-note">
      <p>بركة وسلام لخدمتكم وبيوتكم العامرة بالمحبة • فاتورة رسمية معتمدة صادرة آلياً من متجر سانكتا ماريا</p>
      <p>لأي استفسارات بخصوص الفاتورة أو الشحنة، يُرجى التواصل عبر: support@sanctamaria-store.com أو هاتف: 01000000001</p>
    </div>
  </div>

</body>
</html>
  `;

  return new NextResponse(invoiceHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
