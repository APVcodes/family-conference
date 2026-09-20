import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site-url";

export const dynamic = "force-static";

const paths = [
  "/",
  "/about/",
  "/chicago/",
  "/leaders/",
  "/registration/",
  "/souvenir/",
  "/souvenir/submit/",
  "/contact/",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return paths.map((path) => ({
    url: `${siteUrl}${path === "/" ? "/" : path}`,
    lastModified,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
