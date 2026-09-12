/** Canonical public site URL (no trailing slash). Override with NEXT_PUBLIC_SITE_URL at build time. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://marthomanafc27.org";
