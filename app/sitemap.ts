import type { MetadataRoute } from "next";
import { PRICE_CHECKED_ON, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: PRICE_CHECKED_ON,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
