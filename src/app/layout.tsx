import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/themes/ThemeProvider";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://fgcollective.com"),
  title: {
    default: "FG Collective | Contemporary Luxury Streetwear & Apparel",
    template: "%s | FG Collective",
  },
  description:
    "FG Collective — براند أزياء ستريت وير فاخر، قطن مصري 100% ثقيل (380+ GSM)، وتصاميم أوفرسايز معاصرة مع توصيل سريع لكافة المحافظات.",
  keywords: [
    "FG Collective",
    "FG",
    "ملابس ستريت وير",
    "هوديز أوفرسايز",
    "تيشرتات قطن مصري",
    "أزياء مصرية معاصرة",
    "streetwear egypt",
    "oversized hoodies",
  ],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "FG Collective",
    title: "FG Collective | Contemporary Luxury Streetwear",
    description: "براند ستريت وير مصري معاصر. خامات قطنية فائقة وتصاميم حصرية محدودة.",
    images: [
      {
        url: "/branding/hero-banner.jpg",
        width: 1200,
        height: 630,
        alt: "FG Collective Luxury Streetwear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FG Collective | Luxury Streetwear",
    description: "Contemporary Egyptian Streetwear Brand. Heavyweight fabrics & bespoke cuts.",
    images: ["/branding/hero-banner.jpg"],
  },
  icons: {
    icon: "/branding/03_Sticker_DieCut_Interlocking_FG.png",
    apple: "/branding/03_Sticker_Circular_FG_Collective.png",
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
      <body className="antialiased min-h-screen flex flex-col selection:bg-neutral-900 selection:text-white dark:selection:bg-white dark:selection:text-neutral-900">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
