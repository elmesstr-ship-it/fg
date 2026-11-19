import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://churchshop-store.com"),
  title: {
    default: "Church Shop | متجر الكنيسة للأواني المذبحية والمقتنيات الكنسية",
    template: "%s | Church Shop",
  },
  description:
    "متجر الكنيسة تأسس منذ 35 عاماً لصنع الأواني المذبحية بأعلى كواليتي وأقل سعر موجود، مع توصيل لكافة الأماكن داخل وخارج مصر.",
  keywords: [
    "متجر الكنيسة",
    "church shop",
    "أواني مذبحية",
    "كؤوس ليتورجية",
    "صواني مذبح",
    "بخور ديري",
    "صلبان بركة",
    "أيقونات قبطية",
  ],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "Church Shop Egypt",
    title: "Church Shop | متجر الكنيسة للأواني المذبحية والمقتنيات الكنسية",
    description: "تأسس منذ 35 عاماً لصنع الأواني المذبحية بأعلى كواليتي وأقل سعر. متاح التوصيل داخل وخارج مصر.",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: "Church Shop Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Church Shop | متجر الكنيسة للأواني المذبحية",
    description: "صنع الأواني المذبحية بأعلى كواليتي وأقل سعر منذ 35 عاماً.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-theme-gold/30 selection:text-theme-primary">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
