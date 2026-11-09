import type { MetadataRoute } from "next";
import { siteUrl } from "@/common/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL("/dashboard", siteUrl).href }];
}
