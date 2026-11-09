import type { MetadataRoute } from "next";
import { workspaceRoutes } from "@/common/workspace-routes";
import { siteUrl } from "@/common/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return workspaceRoutes
    .filter((route) => route.label !== "Settings")
    .map((route) => ({ url: new URL(route.href, siteUrl).href }));
}
