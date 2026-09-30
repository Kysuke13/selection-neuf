import type { MetadataRoute } from "next";
import { ALLURE_PRICE_CHECKED_ON, ALLURE_URL } from "@/lib/allure";
import { CANOPEA_PRICE_CHECKED_ON, CANOPEA_URL } from "@/lib/canopea";
import { PRICE_CHECKED_ON, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: PRICE_CHECKED_ON,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: CANOPEA_URL,
      lastModified: CANOPEA_PRICE_CHECKED_ON,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: ALLURE_URL,
      lastModified: ALLURE_PRICE_CHECKED_ON,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];
}
