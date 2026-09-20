/**
 * Google Apps Script Web App URL for the souvenir admin review page.
 * Set NEXT_PUBLIC_SOUVENIR_ADMIN_API_URL at build time (see .env.example).
 * This URL is public/embedded in the client bundle by design — it is not
 * secret. The password check happens server-side inside the Apps Script.
 */
export const souvenirAdminApiUrl =
  process.env.NEXT_PUBLIC_SOUVENIR_ADMIN_API_URL?.replace(/\/$/, "") || "";
