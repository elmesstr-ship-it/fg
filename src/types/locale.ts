export type Locale = "ar" | "en";
export type Direction = "rtl" | "ltr";

export interface TranslationDictionary {
  common: {
    storeName: string;
    tagline: string;
    searchPlaceholder: string;
    cart: string;
    wishlist: string;
    account: string;
    login: string;
    register: string;
    adminDashboard: string;
    language: string;
    theme: string;
    lightMode: string;
    darkMode: string;
    seasonalThemes: string;
    viewAll: string;
    priceEGP: string;
    addToCart: string;
    buyNow: string;
    outOfStock: string;
    inStock: string;
  };
  navigation: {
    home: string;
    catalog: string;
    categories: string;
    icons: string;
    vestments: string;
    incenseAndBurners: string;
    altarSupplies: string;
    candles: string;
    booksAndGifts: string;
    aboutUs: string;
    contact: string;
  };
  admin: {
    dashboard: string;
    products: string;
    categories: string;
    orders: string;
    customers: string;
    inventory: string;
    discounts: string;
    themes: string;
    notifications: string;
    activityLogs: string;
    settings: string;
    maintenanceMode: string;
    telegramBot: string;
  };
}
