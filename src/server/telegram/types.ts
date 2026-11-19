export type TelegramRole = "OWNER" | "ADMIN" | "VIEWER";

export interface TelegramUserRecord {
  id: string;
  telegramId: string;
  username: string | null;
  firstName: string | null;
  role: TelegramRole;
  isActive: boolean;
  addedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TelegramFrom {
  id: number;
  is_bot?: boolean;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface TelegramChat {
  id: number | string;
  type: "private" | "group" | "supergroup" | "channel";
  title?: string;
  username?: string;
  first_name?: string;
}

export interface TelegramMessage {
  message_id: number;
  from?: TelegramFrom;
  chat: TelegramChat;
  date: number;
  text?: string;
  caption?: string;
}

export interface TelegramCallbackQuery {
  id: string;
  from: TelegramFrom;
  message?: TelegramMessage;
  data?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: TelegramCallbackQuery;
}

export interface TelegramSendMessageOptions {
  parse_mode?: "HTML" | "Markdown" | "MarkdownV2";
  disable_web_page_preview?: boolean;
  reply_markup?: any;
}
