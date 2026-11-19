import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://fgcollective.store";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout/card-pay", "/checkout/wallet-pay"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
