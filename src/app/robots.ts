import type { MetadataRoute } from "next";
import { getAppConfig } from "@/lib/config/env";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getAppConfig().siteUrl.replace(/\/$/, "");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
