import prisma from "@/server/db/prisma";
import { TelegramRole, TelegramUpdate, TelegramSendMessageOptions } from "./types";
import { db } from "@/services";

export class TelegramService {
  private static instance: TelegramService;
  private botToken: string;
  private ownerId: string;
  private defaultChatId: string;
  public sentMessagesLog: Array<{
    chatId: string | number;
    text?: string;
    filename?: string;
    options?: any;
    sentAt: string;
  }> = [];

  constructor() {
    this.botToken = process.env.TELEGRAM_BOT_TOKEN || "";
    this.ownerId = process.env.TELEGRAM_OWNER_ID || "9988776655";
    this.defaultChatId = process.env.TELEGRAM_DEFAULT_CHAT_ID || this.ownerId;
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  /**
   * Ensure owner ID is seeded into the TelegramUser database allowlist
   */
  async ensureOwnerInitialized(): Promise<void> {
    try {
      if (!this.ownerId) return;

      const existing = await prisma.telegramUser.findUnique({
        where: { telegramId: this.ownerId },
      });

      if (!existing) {
        await prisma.telegramUser.create({
          data: {
            telegramId: this.ownerId,
            role: "OWNER",
            firstName: "Store Owner",
            username: "sancta_maria_owner",
            isActive: true,
            addedBy: "system_bootstrap",
          },
        });
      }
    } catch (err) {
      console.error("[TelegramService] Failed to initialize owner in database:", err);
    }
  }

  /**
   * Get user authorization role
   */
  async getUserRole(telegramId: string): Promise<TelegramRole | null> {
    await this.ensureOwnerInitialized();

    if (String(telegramId) === String(this.ownerId)) {
      return "OWNER";
    }

    const user = await prisma.telegramUser.findUnique({
      where: { telegramId: String(telegramId) },
    });

    if (!user || !user.isActive) {
      return null;
    }

    return user.role as TelegramRole;
  }

  /**
   * Check if user meets minimum role permission
   */
  async hasPermission(telegramId: string, requiredRole: TelegramRole): Promise<boolean> {
    const userRole = await this.getUserRole(telegramId);
    if (!userRole) return false;

    if (userRole === "OWNER") return true;
    if (requiredRole === "VIEWER") return true;
    if (requiredRole === "ADMIN" && userRole === "ADMIN") return true;
    return false;
  }

  /**
   * Send text message via Telegram API (or log in dev/test)
   */
  async sendMessage(
    chatId: string | number,
    text: string,
    options?: TelegramSendMessageOptions
  ): Promise<boolean> {
    // Record in local message history for audit and verification
    this.sentMessagesLog.push({
      chatId,
      text,
      options,
      sentAt: new Date().toISOString(),
    });

    // If bot token is empty or a placeholder mock token, return immediately as successful
    if (!this.botToken || this.botToken.startsWith("mock_") || this.botToken.includes("sancta_maria_token")) {
      return true;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: options?.parse_mode || "HTML",
          disable_web_page_preview: options?.disable_web_page_preview ?? false,
          reply_markup: options?.reply_markup,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.warn(`[TelegramService] Telegram API error (${res.status}):`, errorData);
        return false;
      }
      return true;
    } catch (err: any) {
      console.warn("[TelegramService] Failed to reach Telegram API:", err.message);
      return false;
    }
  }

  /**
   * Send file/document via Telegram API
   */
  async sendDocument(
    chatId: string | number,
    filename: string,
    content: Buffer,
    caption?: string
  ): Promise<boolean> {
    this.sentMessagesLog.push({
      chatId,
      filename,
      text: caption,
      sentAt: new Date().toISOString(),
    });

    if (!this.botToken || this.botToken.startsWith("mock_") || this.botToken.includes("sancta_maria_token")) {
      return true;
    }

    try {
      const url = `https://api.telegram.org/bot${this.botToken}/sendDocument`;
      const formData = new FormData();
      formData.append("chat_id", String(chatId));
      if (caption) formData.append("caption", caption);
      const blob = new Blob([new Uint8Array(content)], { type: "text/csv; charset=utf-8" });
      formData.append("document", blob, filename);

      const res = await fetch(url, {
        method: "POST",
        body: formData,
      });
      return res.ok;
    } catch (err: any) {
      console.warn("[TelegramService] sendDocument error:", err.message);
      return false;
    }
  }

  /**
   * Broadcast message to all active users matching minRole
   */
  async broadcast(text: string, minRole: TelegramRole = "VIEWER", options?: TelegramSendMessageOptions): Promise<number> {
    await this.ensureOwnerInitialized();
    const users = await prisma.telegramUser.findMany({
      where: { isActive: true },
    });

    let sentCount = 0;
    for (const u of users) {
      const isAllowed =
        u.role === "OWNER" ||
        (minRole === "ADMIN" && u.role === "ADMIN") ||
        minRole === "VIEWER";

      if (isAllowed) {
        await this.sendMessage(u.telegramId, text, options);
        sentCount++;
      }
    }
    return sentCount;
  }

  // ========================================================
  // NOTIFICATIONS ENGINE
  // ========================================================

  /**
   * Dispatch New Order Alert to Telegram Admins & Owner
   */
  async notifyNewOrder(order: any): Promise<void> {
    const itemsText = (order.items || [])
      .map((it: any) => {
        const name = typeof it.productName === "string" ? it.productName : it.productName?.ar || "منتج كنسي";
        return `  • <b>${name}</b> (×${it.quantity} - ${it.price} ج.م)`;
      })
      .join("\n");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invoiceUrl = `${appUrl}/api/orders/${order.id}/invoice`;

    const message =
      `🔔 <b>طلب جديد وارد إلى سانكتا ماريا!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>رقم الطلب:</b> <code>${order.orderNumber}</code>\n` +
      `👤 <b>العميل:</b> ${order.customerName}\n` +
      `📞 <b>الهاتف:</b> <code>${order.customerPhone}</code>\n` +
      `📍 <b>المحافظة:</b> ${order.shippingAddress?.governorate || "غير محدد"}\n` +
      `💳 <b>طريقة الدفع:</b> ${order.paymentMethod === "cash_on_delivery" ? "الدفع عند الاستلام" : order.paymentMethod}\n` +
      `💰 <b>الإجمالي النهائي:</b> <b>${order.total.toLocaleString()} ج.م</b>\n\n` +
      `<b>الأصناف المطلوبة:</b>\n${itemsText}\n\n` +
      `📄 <a href="${invoiceUrl}">عرض وطباعة الفاتورة الضريبية الرسمية</a>\n` +
      `<i>تم تسجيل الطلب وخصم المخزون بنجاح.</i>`;

    await this.broadcast(message, "VIEWER", { parse_mode: "HTML" });
  }

  /**
   * Dispatch New User Registration Alert
   */
  async notifyNewUser(user: any, profile?: any): Promise<void> {
    const message =
      `👤 <b>تسجيل عميل جديد بالمتجر!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `✝️ <b>الاسم:</b> ${profile?.fullName || "عميل جديد"}\n` +
      `📧 <b>البريد:</b> <code>${user.email}</code>\n` +
      `📱 <b>الهاتف:</b> <code>${user.phone}</code>\n` +
      `⛪ <b>الكنيسة/الإيبارشية:</b> ${profile?.parishName || "عام"}\n` +
      `⏰ <b>التاريخ:</b> ${new Date().toLocaleString("ar-EG")}`;

    await this.broadcast(message, "ADMIN", { parse_mode: "HTML" });
  }

  /**
   * Dispatch Stock Alert (Low stock or out of stock)
   */
  async notifyStockAlert(product: any, currentStock: number, variantSku?: string): Promise<void> {
    const isOut = currentStock <= 0;
    const name = typeof product.name === "string" ? product.name : product.name?.ar || "منتج";
    const sku = variantSku || product.sku;

    const message =
      `${isOut ? "🚨" : "⚠️"} <b>تنبيه مخزون: ${isOut ? "نفاد الكمية تماماً!" : "مخزون حرج (وشك النفاد)"}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>المنتج:</b> ${name}\n` +
      `🔖 <b>رمز SKU:</b> <code>${sku}</code>\n` +
      `📊 <b>الرصيد المتبقي:</b> <b>${currentStock} قطع فقط</b>\n` +
      `💡 <i>يمكن تحديث المخزون مباشرة عبر الأمر:</i>\n` +
      `<code>/stock ${sku} +10</code>`;

    await this.broadcast(message, "ADMIN", { parse_mode: "HTML" });
  }

  /**
   * Send notification to Owner only
   */
  async notifyOwner(title: string, details: string): Promise<void> {
    await this.ensureOwnerInitialized();
    const message =
      `👑 <b>إشعار خاص بمالك المتجر (Owner Alert)</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📌 <b>${title}</b>\n` +
      `${details}\n\n` +
      `⏰ ${new Date().toLocaleString("ar-EG")}`;

    await this.sendMessage(this.ownerId, message, { parse_mode: "HTML" });
  }

  // ========================================================
  // INCOMING UPDATE / COMMAND DISPATCHER
  // ========================================================

  async handleUpdate(update: TelegramUpdate): Promise<{ handled: boolean; reply?: string }> {
    const message = update.message;
    if (!message || !message.text) {
      return { handled: false };
    }

    const chatId = message.chat.id;
    const fromId = String(message.from?.id || chatId);
    const text = message.text.trim();

    // Check Authorization
    const userRole = await this.getUserRole(fromId);
    if (!userRole) {
      const unauthorizedReply =
        `⛔ <b>عذراً، غير مصرح لك بالوصول لهذا البوت الإداري.</b>\n\n` +
        `معرّف تيليجرام الخاص بك: <code>${fromId}</code>\n` +
        `يرجى تزويد مالك متجر سانكتا ماريا بهذا المعرّف لإضافتك إلى قائمة المصرح لهم.`;

      await this.sendMessage(chatId, unauthorizedReply, { parse_mode: "HTML" });
      return { handled: true, reply: unauthorizedReply };
    }

    // Split Command and Arguments
    const parts = text.split(/\s+/);
    const command = parts[0].toLowerCase().replace(/@.+$/, ""); // strip bot handle if present
    const args = parts.slice(1);

    let reply = "";

    try {
      switch (command) {
        case "/start":
        case "/help": {
          reply = this.buildHelpMenu(userRole);
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/status": {
          reply = await this.handleStatus();
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/orders": {
          reply = await this.handleListOrders(args[0]);
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/order": {
          if (!args[0]) {
            reply = "❌ يرجى كتابة رقم الطلب. مثال:\n<code>/order SM-261030-3202</code>";
          } else {
            reply = await this.handleOrderDetails(args[0]);
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/updateorder": {
          if (userRole === "VIEWER") {
            reply = "⛔ <b>عفواً:</b> صلاحياتك الحالية (VIEWER) للمشاهدة فقط. مطلوب صلاحية ADMIN أو OWNER لتعديل الطلبات.";
          } else if (args.length < 2) {
            reply =
              "❌ <b>صيغة الأمر غير مكتملة.</b>\n" +
              "الاستخدام: <code>/updateorder &lt;رقم_الطلب&gt; &lt;الحالة&gt; [رقم_الشحنة]</code>\n" +
              "الحالات المتاحة: <code>processing</code>, <code>shipped</code>, <code>delivered</code>, <code>cancelled</code>\n" +
              "مثال:\n<code>/updateorder SM-261030-3202 shipped BOSTA-771122</code>";
          } else {
            reply = await this.handleUpdateOrder(args[0], args[1], args[2], message.from);
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/products": {
          reply = await this.handleListProducts(args.join(" "));
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/product": {
          if (!args[0]) {
            reply = "❌ يرجى تحديد رمز SKU للمنتج. مثال:\n<code>/product CROS-WOOD-01</code>";
          } else {
            reply = await this.handleProductDetails(args[0]);
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/stock": {
          if (userRole === "VIEWER") {
            reply = "⛔ <b>عفواً:</b> صلاحياتك الحالية (VIEWER) للمشاهدة فقط. مطلوب صلاحية ADMIN أو OWNER لتعديل المخزون.";
          } else if (args.length < 2) {
            reply =
              "❌ <b>صيغة الأمر غير مكتملة.</b>\n" +
              "الاستخدام: <code>/stock &lt;رمز_SKU&gt; &lt;الكمية|±الفرق&gt;</code>\n" +
              "أمثلة:\n" +
              "• <code>/stock CROS-GOLD-01 25</code> (تحديد الرصيد المباشر ليصبح 25)\n" +
              "• <code>/stock CROS-GOLD-01 +10</code> (إضافة 10 قطع)\n" +
              "• <code>/stock CROS-GOLD-01 -3</code> (خصم 3 قطع)";
          } else {
            reply = await this.handleUpdateStock(args[0], args[1], message.from);
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/lowstock": {
          reply = await this.handleLowStock();
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/invoice": {
          if (!args[0]) {
            reply = "❌ يرجى كتابة رقم الطلب لطلب الفاتورة. مثال:\n<code>/invoice SM-261030-3202</code>";
          } else {
            reply = await this.handleInvoiceLink(args[0]);
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/export": {
          reply = await this.handleExportReport(chatId, args[0], message.from);
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        // --- OWNER ONLY COMMANDS ---
        case "/users":
        case "/listusers": {
          if (userRole !== "OWNER") {
            reply = "⛔ هذا الأمر مخصص لمالك المتجر (OWNER) فقط.";
          } else {
            reply = await this.handleListUsers();
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/addadmin": {
          if (userRole !== "OWNER") {
            reply = "⛔ هذا الأمر مخصص لمالك المتجر (OWNER) فقط.";
          } else if (!args[0]) {
            reply = "❌ يرجى كتابة معرّف تيليجرام. مثال:\n<code>/addadmin 123456789 جورج_ميخائيل</code>";
          } else {
            reply = await this.handleAddAuthorizedUser(args[0], "ADMIN", args.slice(1).join(" "), fromId);
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/addviewer": {
          if (userRole !== "OWNER") {
            reply = "⛔ هذا الأمر مخصص لمالك المتجر (OWNER) فقط.";
          } else if (!args[0]) {
            reply = "❌ يرجى كتابة معرّف تيليجرام. مثال:\n<code>/addviewer 987654321 سكرتارية_المطرانية</code>";
          } else {
            reply = await this.handleAddAuthorizedUser(args[0], "VIEWER", args.slice(1).join(" "), fromId);
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        case "/removeuser": {
          if (userRole !== "OWNER") {
            reply = "⛔ هذا الأمر مخصص لمالك المتجر (OWNER) فقط.";
          } else if (!args[0]) {
            reply = "❌ يرجى كتابة معرّف تيليجرام المراد حذفه. مثال:\n<code>/removeuser 123456789</code>";
          } else {
            reply = await this.handleRemoveUser(args[0], fromId);
          }
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }

        default: {
          reply = `❓ أمر غير معروف: <code>${command}</code>. اكتب <code>/help</code> لعرض قائمة الأوامر المتاحة.`;
          await this.sendMessage(chatId, reply, { parse_mode: "HTML" });
          break;
        }
      }

      return { handled: true, reply };
    } catch (err: any) {
      console.error("[TelegramService] Error executing command:", err);
      const errReply = `⚠️ حدث خطأ أثناء تنفيذ الأمر: ${err.message}`;
      await this.sendMessage(chatId, errReply);
      return { handled: true, reply: errReply };
    }
  }

  // ========================================================
  // COMMAND IMPLEMENTATIONS
  // ========================================================

  private buildHelpMenu(role: TelegramRole): string {
    let menu =
      `✝️ <b>لوحة تحكم بوت سانكتا ماريا الإداري</b>\n` +
      `صلاحيتك الحالية: <b>[${role}]</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n\n` +
      `📋 <b>أوامر الاستعلام (متاحة لـ VIEWER, ADMIN, OWNER):</b>\n` +
      `• <code>/status</code> - نظرة سريعة على إحصائيات المتجر والمبيعات\n` +
      `• <code>/orders [status]</code> - استعراض آخر الطلبات (pending, shipped..)\n` +
      `• <code>/order &lt;رقم_الطلب&gt;</code> - تفاصيل طلب محدد بالكامل\n` +
      `• <code>/products [بحث]</code> - قائمة وبحث في المنتجات والأسعار\n` +
      `• <code>/product &lt;رمز_SKU&gt;</code> - فحص تفاصيل منتج ومخزونه الحالي\n` +
      `• <code>/lowstock</code> - قائمة المنتجات أوشكت على النفاد (مخزون حرج)\n` +
      `• <code>/invoice &lt;رقم_الطلب&gt;</code> - استخراج الفاتورة الضريبية الرسمية\n` +
      `• <code>/export [today|week|all]</code> - تصدير تقرير الطلبات كملف Excel/CSV\n\n`;

    if (role === "ADMIN" || role === "OWNER") {
      menu +=
        `⚙️ <b>أوامر الإدارة وتحديث البيانات (ADMIN & OWNER):</b>\n` +
        `• <code>/stock &lt;SKU&gt; &lt;الكمية|±الفرق&gt;</code> - تعديل المخزون في قاعدة البيانات فورياً\n` +
        `• <code>/updateorder &lt;رقم_الطلب&gt; &lt;الحالة&gt; [رقم_الشحنة]</code> - تغيير حالة الطلب\n\n`;
    }

    if (role === "OWNER") {
      menu +=
        `👑 <b>أوامر إدارة المصرح لهم (OWNER ONLY):</b>\n` +
        `• <code>/users</code> - عرض قائمة حسابات تيليجرام المصرح لها\n` +
        `• <code>/addadmin &lt;telegramId&gt; [الاسم]</code> - إضافة مشرف بصلاحيات كاملة\n` +
        `• <code>/addviewer &lt;telegramId&gt; [الاسم]</code> - إضافة مشاهد (قراءة فقط)\n` +
        `• <code>/removeuser &lt;telegramId&gt;</code> - إلغاء تفعيل حساب تيليجرام\n`;
    }

    return menu;
  }

  private async handleStatus(): Promise<string> {
    const today = new Date().toISOString().split("T")[0];
    const [allProducts, lowStockProducts, todayOrders, totalOrders] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { stock: { lte: 5 } } }),
      prisma.order.findMany({
        where: {
          createdAt: {
            gte: new Date(today + "T00:00:00.000Z"),
          },
        },
      }),
      prisma.order.count(),
    ]);

    const todayRevenue = todayOrders.reduce((acc, o) => acc + o.total, 0);
    const pendingCount = await prisma.order.count({ where: { orderStatus: "pending" } });

    return (
      `📊 <b>تقرير حالة منصة سانكتا ماريا:</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🛍️ <b>إجمالي المنتجات:</b> ${allProducts} منتج\n` +
      `⚠️ <b>منتجات بمخزون حرج (≤5):</b> ${lowStockProducts}\n` +
      `📦 <b>طلبات قيد المراجعة (Pending):</b> ${pendingCount}\n` +
      `📅 <b>طلبات اليوم (${today}):</b> ${todayOrders.length} طلب\n` +
      `💰 <b>إيرادات اليوم:</b> <b>${todayRevenue.toLocaleString()} ج.م</b>\n` +
      `📈 <b>إجمالي الطلبات الكلي:</b> ${totalOrders} طلب\n` +
      `🟢 <b>حالة المتجر:</b> يعمل بصورة طبيعية ومستقرة`
    );
  }

  private async handleListOrders(statusFilter?: string): Promise<string> {
    const where: any = {};
    if (statusFilter) {
      where.orderStatus = statusFilter;
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { items: true },
    });

    if (orders.length === 0) {
      return `📦 لا توجد طلبات مسجلة ${statusFilter ? `بحالة (${statusFilter})` : ""}.`;
    }

    let out =
      `📦 <b>آخر الطلبات المسجلة ${statusFilter ? `[${statusFilter}]` : ""}:</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n`;

    for (const o of orders) {
      const itemsCount = o.items.reduce((s, it) => s + it.quantity, 0);
      out +=
        `• <b>${o.orderNumber}</b> | ${o.orderStatus.toUpperCase()}\n` +
        `  👤 ${o.customerName} (${o.customerPhone})\n` +
        `  💵 ${o.total.toLocaleString()} ج.م (${itemsCount} قطع)\n` +
        `  🔎 تفاصيل: <code>/order ${o.orderNumber}</code>\n\n`;
    }

    return out;
  }

  private async handleOrderDetails(orderIdentifier: string): Promise<string> {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber: orderIdentifier }, { id: orderIdentifier }],
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return `❌ لم يتم العثور على طلب برقم: <code>${orderIdentifier}</code>`;
    }

    const itemsText = order.items
      .map((it: any) => `  • ${it.productName} (×${it.quantity}) - ${it.price * it.quantity} ج.م`)
      .join("\n");

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invoiceUrl = `${appUrl}/api/orders/${order.id}/invoice`;

    return (
      `📦 <b>تفاصيل الطلب: ${order.orderNumber}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📅 <b>تاريخ الطلب:</b> ${new Date(order.createdAt).toLocaleString("ar-EG")}\n` +
      `🏷️ <b>حالة الطلب:</b> <b>${order.orderStatus.toUpperCase()}</b>\n` +
      `💳 <b>حالة الدفع:</b> ${order.paymentStatus} (${order.paymentMethod})\n` +
      `🚚 <b>بوليصة الشحن:</b> ${order.trackingNumber || "لم تصدر بعد"}\n\n` +
      `👤 <b>العميل:</b> ${order.customerName}\n` +
      `📞 <b>الهاتف:</b> <code>${order.customerPhone}</code>\n` +
      `📍 <b>العنوان:</b> ${order.governorate} - ${order.streetAddress}\n\n` +
      `🛍️ <b>الأصناف:</b>\n${itemsText}\n\n` +
      `💵 <b>المجموع الفرعي:</b> ${order.subtotal} ج.م\n` +
      `🚚 <b>الشحن:</b> ${order.shippingFee} ج.م\n` +
      `🏷️ <b>الخصم:</b> ${order.discountAmount} ج.م\n` +
      `💰 <b>الإجمالي النهائي:</b> <b>${order.total} ج.م</b>\n\n` +
      `📄 <a href="${invoiceUrl}">عرض وطباعة الفاتورة الضريبية</a>`
    );
  }

  private async handleUpdateOrder(
    orderNumber: string,
    newStatus: string,
    trackingNumber: string | undefined,
    from?: any
  ): Promise<string> {
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus.toLowerCase())) {
      return `❌ حالة غير صالحة. الحالات المسموح بها: ${validStatuses.join(", ")}`;
    }

    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber }, { id: orderNumber }],
      },
    });

    if (!order) {
      return `❌ الطلب <code>${orderNumber}</code> غير موجود.`;
    }

    const updateData: any = {
      orderStatus: newStatus.toLowerCase(),
    };
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    const updated = await prisma.order.update({
      where: { id: order.id },
      data: updateData,
    });

    // Audit Log
    await prisma.activityLog.create({
      data: {
        adminId: `telegram:${from?.id || "admin"}`,
        adminName: `${from?.first_name || ""} (@${from?.username || "tg_admin"})`,
        action: "UPDATE_ORDER_STATUS",
        resource: order.orderNumber,
        detailsAr: `تم تحديث حالة الطلب إلى (${newStatus})${trackingNumber ? ` مع إضافة بوليصة شحن: ${trackingNumber}` : ""}`,
        detailsEn: `Updated order status to ${newStatus}${trackingNumber ? ` with tracking number: ${trackingNumber}` : ""}`,
        ipAddress: "TelegramBot",
      },
    });

    return (
      `✅ <b>تم تحديث حالة الطلب بنجاح!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>الطلب:</b> <code>${updated.orderNumber}</code>\n` +
      `🏷️ <b>الحالة الجديدة:</b> <b>${updated.orderStatus.toUpperCase()}</b>\n` +
      (updated.trackingNumber ? `🚚 <b>رقم الشحنة:</b> <code>${updated.trackingNumber}</code>\n` : "") +
      `📝 تم تسجيل العملية في سجل التدقيق الإداري للمتجر.`
    );
  }

  private async handleListProducts(query?: string): Promise<string> {
    const where: any = {};
    if (query) {
      where.OR = [
        { nameAr: { contains: query } },
        { nameEn: { contains: query } },
        { sku: { contains: query } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      take: 8,
      orderBy: { createdAt: "desc" },
    });

    if (products.length === 0) {
      return `🔍 لا توجد منتجات مطابقة للبحث: "${query || ""}"`;
    }

    let out =
      `🛍️ <b>قائمة المنتجات ${query ? `[بحث: ${query}]` : ""}:</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n`;

    for (const p of products) {
      out +=
        `• <b>${p.nameAr}</b>\n` +
        `  🔖 SKU: <code>${p.sku}</code> | السعر: ${p.price} ج.م\n` +
        `  📦 المخزون: <b>${p.stock} قطعة</b> ${p.stock <= 5 ? "⚠️" : "✅"}\n\n`;
    }

    return out;
  }

  private async handleProductDetails(sku: string): Promise<string> {
    const product = await prisma.product.findFirst({
      where: {
        OR: [{ sku }, { id: sku }],
      },
      include: {
        category: true,
        variants: true,
      },
    });

    if (!product) {
      return `❌ لم يتم العثور على منتج برمز SKU: <code>${sku}</code>`;
    }

    let variantsText = "";
    if (product.variants && product.variants.length > 0) {
      variantsText =
        `\n<b>الأنواع والمقاسات (Variants):</b>\n` +
        product.variants
          .map((v) => `  • ${v.nameAr} (SKU: <code>${v.sku}</code>) - ${v.stock} قطعة - ${v.price} ج.م`)
          .join("\n") +
        "\n";
    }

    return (
      `🛍️ <b>تفاصيل المنتج:</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🏷️ <b>الاسم:</b> ${product.nameAr} (${product.nameEn})\n` +
      `🔖 <b>رمز SKU:</b> <code>${product.sku}</code>\n` +
      `📁 <b>القسم:</b> ${product.category?.nameAr || "عام"}\n` +
      `💵 <b>السعر:</b> ${product.price} ج.م\n` +
      `📦 <b>المخزون الحالي:</b> <b>${product.stock} قطعة</b> ${product.stock <= 5 ? "⚠️ (مخزون منخفض)" : "✅"}\n` +
      variantsText +
      `\n💡 <i>لتعديل المخزون:</i>\n<code>/stock ${product.sku} +10</code>`
    );
  }

  private async handleUpdateStock(sku: string, qtyArg: string, from?: any): Promise<string> {
    // Check if updating direct product or variant
    let product = await prisma.product.findFirst({ where: { sku } });
    let variant = null;

    if (!product) {
      variant = await prisma.productVariant.findFirst({
        where: { sku },
        include: { product: true },
      });
      if (variant) {
        product = variant.product;
      }
    }

    if (!product) {
      return `❌ لم يتم العثور على أي منتج أو مقاس بالرمز: <code>${sku}</code>`;
    }

    let newStock = 0;
    let delta = 0;
    const currentStock = variant ? variant.stock : product.stock;

    if (qtyArg.startsWith("+") || qtyArg.startsWith("-")) {
      delta = parseInt(qtyArg, 10);
      newStock = Math.max(0, currentStock + delta);
    } else {
      newStock = Math.max(0, parseInt(qtyArg, 10));
      delta = newStock - currentStock;
    }

    if (isNaN(newStock)) {
      return `❌ الكمية غير صالحة: <code>${qtyArg}</code>`;
    }

    // Apply update to DB
    if (variant) {
      await prisma.productVariant.update({
        where: { id: variant.id },
        data: { stock: newStock },
      });
    } else {
      await prisma.product.update({
        where: { id: product.id },
        data: { stock: newStock },
      });
      await prisma.inventory.updateMany({
        where: { productId: product.id },
        data: {
          currentStock: newStock,
          status: newStock > 10 ? "in_stock" : newStock > 0 ? "low_stock" : "out_of_stock",
          lastUpdatedSource: "telegram_bot",
          lastRestockedAt: delta > 0 ? new Date() : undefined,
        },
      });
    }

    // Log Activity
    await prisma.activityLog.create({
      data: {
        adminId: `telegram:${from?.id || "admin"}`,
        adminName: `${from?.first_name || ""} (@${from?.username || "tg_admin"})`,
        action: "UPDATE_STOCK_TELEGRAM",
        resource: sku,
        detailsAr: `تم تعديل مخزون (${sku}) من ${currentStock} إلى ${newStock} (${delta >= 0 ? "+" : ""}${delta})`,
        detailsEn: `Updated stock of ${sku} from ${currentStock} to ${newStock} (${delta >= 0 ? "+" : ""}${delta})`,
        ipAddress: "TelegramBot",
      },
    });

    return (
      `✅ <b>تم تحديث المخزون في قاعدة البيانات بنجاح!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `📦 <b>المنتج:</b> ${product.nameAr}\n` +
      `🔖 <b>الرمز SKU:</b> <code>${sku}</code>\n` +
      `📊 <b>المخزون السابق:</b> ${currentStock} قطعة\n` +
      `📈 <b>المخزون الجديد:</b> <b>${newStock} قطعة</b> (${delta >= 0 ? "+" : ""}${delta})\n` +
      `📝 تم توثيق العملية في سجل تدقيق العمليات الإدارية.`
    );
  }

  private async handleLowStock(): Promise<string> {
    const products = await prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: "asc" },
      take: 10,
    });

    if (products.length === 0) {
      return `✅ <b>ممتاز!</b> لا توجد حالياً أي منتجات بمخزون حرج (جميع المنتجات تملك أكثر من 5 قطع).`;
    }

    let out =
      `⚠️ <b>المنتجات ذات المخزون الحرج (≤ 5 قطع):</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n`;

    for (const p of products) {
      out +=
        `• <b>${p.nameAr}</b>\n` +
        `  🔖 SKU: <code>${p.sku}</code> | الرصيد: <b>${p.stock} قطعة</b>\n` +
        `  💡 لزيادة الرصيد: <code>/stock ${p.sku} +10</code>\n\n`;
    }

    return out;
  }

  private async handleInvoiceLink(orderNumber: string): Promise<string> {
    const order = await prisma.order.findFirst({
      where: {
        OR: [{ orderNumber }, { id: orderNumber }],
      },
    });

    if (!order) {
      return `❌ لم يتم العثور على طلب برقم: <code>${orderNumber}</code>`;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const invoiceUrl = `${appUrl}/api/orders/${order.id}/invoice`;

    return (
      `📄 <b>الفاتورة الضريبية للطلب: ${order.orderNumber}</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `👤 العميل: ${order.customerName}\n` +
      `💰 الإجمالي: ${order.total} ج.م (شاملاً 14% ضريبة القيمة المضافة)\n` +
      `🔗 <a href="${invoiceUrl}">اضغط هنا لفتح وتحميل الفاتورة الرسمية PDF</a>`
    );
  }

  private async handleExportReport(chatId: string | number, period?: string, from?: any): Promise<string> {
    let startDate: string | undefined;
    const now = new Date();

    if (period === "today") {
      startDate = now.toISOString().split("T")[0];
    } else if (period === "week") {
      const past = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      startDate = past.toISOString().split("T")[0];
    }

    const orders = await db.orders.getOrders({ startDate });

    const headers = [
      "رقم الطلب",
      "تاريخ الطلب",
      "اسم العميل",
      "الهاتف",
      "المحافظة",
      "عدد الأصناف",
      "المجموع الفرعي",
      "الشحن",
      "الخصم",
      "الإجمالي",
      "حالة الطلب",
      "حالة الدفع",
    ];

    const escapeCsv = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = [headers.map(escapeCsv).join(",")];

    for (const o of orders) {
      const itemCount = (o.items || []).reduce((s, it) => s + it.quantity, 0);
      rows.push(
        [
          o.orderNumber,
          new Date(o.createdAt).toLocaleString("ar-EG"),
          o.customerName,
          o.customerPhone,
          o.shippingAddress?.governorate || "",
          itemCount,
          o.subtotal,
          o.shippingFee,
          o.discountAmount,
          o.total,
          o.orderStatus,
          o.paymentStatus,
        ]
          .map(escapeCsv)
          .join(",")
      );
    }

    const csvContent = "\uFEFF" + rows.join("\r\n");
    const buffer = Buffer.from(csvContent, "utf-8");
    const dateStr = now.toISOString().split("T")[0];
    const filename = `Sancta_Maria_Orders_${dateStr}.csv`;

    await this.sendDocument(
      chatId,
      filename,
      buffer,
      `📊 <b>تقرير مبيعات وطلبات سانكتا ماريا (${period || "كامل"})</b>\nتاريخ الاستخراج: ${new Date().toLocaleString("ar-EG")}`
    );

    // Audit log
    await prisma.activityLog.create({
      data: {
        adminId: `telegram:${from?.id || "admin"}`,
        adminName: `${from?.first_name || ""} (@${from?.username || "tg_admin"})`,
        action: "EXPORT_ORDERS_TELEGRAM",
        resource: "ORDERS_REPORT",
        detailsAr: `تم تصدير تقرير الطلبات بتنسيق Excel/CSV عبر بوت تيليجرام (${period || "all"})`,
        detailsEn: `Exported orders spreadsheet via Telegram bot (${period || "all"})`,
        ipAddress: "TelegramBot",
      },
    });

    return `✅ <b>تم استخراج تقرير الإكسل وتجهيزه بنجاح!</b> (${orders.length} طلب)`;
  }

  // --- OWNER ONLY HANDLERS ---
  private async handleListUsers(): Promise<string> {
    const users = await prisma.telegramUser.findMany({
      orderBy: { createdAt: "asc" },
    });

    let out =
      `👥 <b>قائمة حسابات تيليجرام المصرح لها:</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n`;

    for (const u of users) {
      out +=
        `• <b>${u.firstName || u.username || "بدون اسم"}</b>\n` +
        `  🆔 المعرّف: <code>${u.telegramId}</code>\n` +
        `  🏷️ الرتبة: <b>${u.role}</b> | الحالة: ${u.isActive ? "نشط ✅" : "معطل ❌"}\n\n`;
    }

    out +=
      `💡 لإضافة أو تعديل:\n` +
      `• <code>/addadmin &lt;ID&gt; [الاسم]</code>\n` +
      `• <code>/addviewer &lt;ID&gt; [الاسم]</code>\n` +
      `• <code>/removeuser &lt;ID&gt;</code>`;

    return out;
  }

  private async handleAddAuthorizedUser(
    telegramId: string,
    role: TelegramRole,
    name: string,
    addedBy: string
  ): Promise<string> {
    const existing = await prisma.telegramUser.findUnique({
      where: { telegramId },
    });

    if (existing) {
      await prisma.telegramUser.update({
        where: { telegramId },
        data: {
          role,
          firstName: name || existing.firstName,
          isActive: true,
        },
      });
    } else {
      await prisma.telegramUser.create({
        data: {
          telegramId,
          role,
          firstName: name || "Authorized User",
          isActive: true,
          addedBy,
        },
      });
    }

    // Log Activity
    await prisma.activityLog.create({
      data: {
        adminId: `telegram:${addedBy}`,
        adminName: "Store Owner",
        action: "ADD_TELEGRAM_USER",
        resource: telegramId,
        detailsAr: `تم تفويض حساب تيليجرام (${telegramId}) برتبة [${role}] (${name || "بدون اسم"})`,
        detailsEn: `Authorized Telegram user (${telegramId}) with role [${role}]`,
        ipAddress: "TelegramBot",
      },
    });

    return (
      `✅ <b>تمت إضافة / تحديث صلاحيات الحساب بنجاح!</b>\n` +
      `━━━━━━━━━━━━━━━━━━━━\n` +
      `🆔 المعرّف: <code>${telegramId}</code>\n` +
      `👤 الاسم: ${name || "مستخدم مصرح"}\n` +
      `🏷️ الرتبة الممنوحة: <b>${role}</b>\n` +
      `يمكن للمستخدم الآن التفاعل مع البوت وفق صلاحياته.`
    );
  }

  private async handleRemoveUser(telegramId: string, removedBy: string): Promise<string> {
    if (telegramId === this.ownerId) {
      return `⛔ لا يمكن إلغاء صلاحيات مالك المتجر الأساسي!`;
    }

    const existing = await prisma.telegramUser.findUnique({
      where: { telegramId },
    });

    if (!existing) {
      return `❌ الحساب <code>${telegramId}</code> غير مسجل في قائمة المصرح لهم.`;
    }

    await prisma.telegramUser.update({
      where: { telegramId },
      data: { isActive: false },
    });

    // Log Activity
    await prisma.activityLog.create({
      data: {
        adminId: `telegram:${removedBy}`,
        adminName: "Store Owner",
        action: "REMOVE_TELEGRAM_USER",
        resource: telegramId,
        detailsAr: `تم إلغاء تفعيل حساب تيليجرام (${telegramId})`,
        detailsEn: `Deactivated Telegram user (${telegramId})`,
        ipAddress: "TelegramBot",
      },
    });

    return `✅ تم إلغاء تفعيل حساب تيليجرام <code>${telegramId}</code> بنجاح ومنعه من الوصول للبوت.`;
  }
}

export const telegramService = TelegramService.getInstance();
