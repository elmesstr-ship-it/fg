import { NextRequest, NextResponse } from "next/server";
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
  <title>فاتورة مبيعات رسمية - ${order.orderNumber} - FG Collective</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Alexandria:wght@400;600;700;800;900&family=Inter:wght@400;600;700&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Alexandria', 'Inter', sans-serif;
    }
    
    body {
      background-color: #09090b;
      color: #fafafa;
      padding: 40px 20px;
    }

    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #121214;
      border: 1px solid #27272a;
      border-radius: 20px;
      padding: 48px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .header-table {
      width: 100%;
      border-bottom: 2px solid #27272a;
      padding-bottom: 24px;
      margin-bottom: 32px;
    }

    .brand-title {
      font-size: 28px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -1px;
      text-transform: uppercase;
    }

    .brand-subtitle {
      font-size: 13px;
      color: #a1a1aa;
      font-weight: 600;
      margin-top: 4px;
    }

    .invoice-badge {
      display: inline-block;
      background: #27272a;
      border: 1px solid #3f3f46;
      color: #fafafa;
      padding: 6px 16px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 13px;
    }

    .meta-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 32px;
      background: #18181b;
      border: 1px solid #27272a;
      padding: 24px;
      border-radius: 14px;
    }

    .meta-item span {
      display: block;
      font-size: 11px;
      color: #71717a;
      font-weight: 600;
      margin-bottom: 4px;
      text-transform: uppercase;
    }

    .meta-item strong {
      font-size: 14px;
      color: #ffffff;
    }

    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 32px;
    }

    .items-table th {
      background: #18181b;
      color: #a1a1aa;
      font-weight: 700;
      font-size: 12px;
      padding: 12px 16px;
      text-align: right;
      border-bottom: 1px solid #27272a;
    }

    .items-table td {
      padding: 14px 16px;
      font-size: 13px;
      border-bottom: 1px solid #27272a;
      color: #e4e4e7;
    }

    .totals-box {
      margin-right: auto;
      width: 320px;
      background: #18181b;
      border: 1px solid #27272a;
      border-radius: 14px;
      padding: 20px;
      margin-bottom: 32px;
    }

    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 8px;
      color: #a1a1aa;
    }

    .totals-row.grand-total {
      border-top: 1px dashed #3f3f46;
      padding-top: 12px;
      margin-top: 12px;
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
    }

    .footer-note {
      text-align: center;
      border-top: 1px solid #27272a;
      padding-top: 24px;
      font-size: 11px;
      color: #71717a;
      line-height: 1.8;
    }

    .print-actions {
      text-align: center;
      margin-bottom: 24px;
    }

    .btn-print {
      background: #ffffff;
      color: #09090b;
      border: none;
      padding: 12px 28px;
      border-radius: 9999px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
    }

    @media print {
      body {
        background: white;
        color: black;
        padding: 0;
      }
      .print-actions {
        display: none;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
        padding: 20px;
        background: white;
        color: black;
      }
      .brand-title { color: black; }
      .meta-grid { background: #f4f4f5; border-color: #e4e4e7; }
      .meta-item strong { color: black; }
      .items-table th { background: #f4f4f5; color: black; }
      .items-table td { color: black; border-color: #e4e4e7; }
      .totals-box { background: #f4f4f5; border-color: #e4e4e7; }
      .totals-row.grand-total { color: black; }
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
          <h1 class="brand-title">FG COLLECTIVE</h1>
          <p class="brand-subtitle">Contemporary Luxury Streetwear & Apparel</p>
          <p style="font-size: 10px; color: #71717a; margin-top: 4px;">بطاقة ضريبية: 712-984-331 | سجل تجاري: 498214</p>
        </td>
        <td style="text-align: left;">
          <div class="invoice-badge">فاتورة مبيعات رسمية</div>
          <p style="font-size: 14px; font-weight: 800; color: #ffffff; margin-top: 6px; font-family: monospace;">${order.orderNumber}</p>
        </td>
      </tr>
    </table>

    <div class="meta-grid">
      <div class="meta-item">
        <span>بيانات العميل</span>
        <strong>${order.customerName}</strong>
        <p style="font-size: 12px; color: #a1a1aa; margin-top: 2px;">هاتف: ${order.customerPhone}</p>
        <p style="font-size: 12px; color: #a1a1aa;">بريد: ${order.customerEmail}</p>
      </div>

      <div class="meta-item">
        <span>عنوان التوصيل المعتمد</span>
        <strong>${order.governorate} - ${order.city}</strong>
        <p style="font-size: 12px; color: #a1a1aa; margin-top: 2px;">${order.streetAddress}</p>
      </div>

      <div class="meta-item">
        <span>تاريخ وتوقيت الطلب</span>
        <strong>${new Date(order.createdAt).toLocaleString("ar-EG")}</strong>
      </div>

      <div class="meta-item">
        <span>طريقة السداد وحالة الطلب</span>
        <strong>${order.paymentMethod === "cash_on_delivery" ? "الدفع عند الاستلام" : order.paymentMethod}</strong>
        <p style="font-size: 12px; color: #a1a1aa; margin-top: 2px;">الحالة: ${order.orderStatus}</p>
      </div>
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>#</th>
          <th>المنتج والمواصفات</th>
          <th style="text-align: center;">الكمية</th>
          <th style="text-align: left;">سعر القطعة</th>
          <th style="text-align: left;">الإجمالي</th>
        </tr>
      </thead>
      <tbody>
        ${(order.items || [])
          .map(
            (it, idx) => `
          <tr>
            <td style="color: #71717a; font-size: 11px;">${idx + 1}</td>
            <td><strong>${it.productName}</strong> ${it.variantName ? `<span style="font-size: 11px; color: #a1a1aa;">(${it.variantName})</span>` : ""}</td>
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
      <div class="totals-row" style="color: #22c55e; font-weight: 700;">
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
      <p>شكراً لثقتكم في FG Collective • فاتورة معتمدة صادرة آلياً</p>
      <p>لأي استفسارات بخصوص طلبك، يُرجى التواصل عبر: care@fgcollective.store أو واتساب: 01000000001</p>
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
