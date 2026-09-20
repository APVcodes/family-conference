/**
 * Souvenir review backend. Bound to the Google Sheet that Formester's
 * "Google Sheets" integration writes submission rows into.
 *
 * This file is a reference copy for version control only — it is not run
 * from this repo. To deploy or update it:
 *   1. Open the Sheet → Extensions → Apps Script.
 *   2. Paste this file's contents into Code.gs (replacing any existing
 *      content), or update the existing Code.gs to match.
 *   3. Project Settings → Script Properties → add ADMIN_PASSWORD.
 *   4. Add a "Status" header column to the Sheet (and optionally
 *      "Reviewed At") — this script does not create it for you.
 *   5. Deploy → New deployment → Web app → Execute as "Me" → Who has
 *      access "Anyone" → Deploy → authorize the requested scopes → copy
 *      the resulting /exec URL into NEXT_PUBLIC_SOUVENIR_ADMIN_API_URL.
 *   6. After any future edit to this script: Deploy → Manage deployments
 *      → edit (pencil) the existing deployment → Version "New version" →
 *      Deploy. This keeps the same /exec URL.
 *
 * See docs/souvenir-review-setup.md for the full setup walkthrough.
 */

const STATUS_HEADER = "Status";
const REVIEWED_AT_HEADER = "Reviewed At";

function checkPassword_(password) {
  const expected = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  return !!expected && password === expected;
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getSheet_() {
  // Adjust if Formester names/orders the response tab differently.
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function doGet(e) {
  const password = (e.parameter && e.parameter.password) || "";
  if (!checkPassword_(password)) {
    return jsonOutput_({ error: "Unauthorized" });
  }

  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const headers = values[0];
  const statusCol = headers.indexOf(STATUS_HEADER);
  if (statusCol === -1) {
    return jsonOutput_({
      error: "Sheet is missing a 'Status' column. Add it manually and retry.",
    });
  }

  const rows = [];
  for (let r = 1; r < values.length; r++) {
    const row = values[r];
    const obj = { _row: r + 1 }; // 1-indexed actual sheet row, used by doPost
    headers.forEach((header, i) => {
      obj[header] = row[i];
    });
    rows.push(obj);
  }

  return jsonOutput_({ submissions: rows });
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOutput_({ error: "Invalid request body" });
  }

  if (!checkPassword_(body.password || "")) {
    return jsonOutput_({ error: "Unauthorized" });
  }
  if (!body.row || ["approve", "reject"].indexOf(body.action) === -1) {
    return jsonOutput_({ error: "Missing row or invalid action" });
  }

  const sheet = getSheet_();
  const headers = sheet.getDataRange().getValues()[0];
  const statusCol = headers.indexOf(STATUS_HEADER);
  const reviewedAtCol = headers.indexOf(REVIEWED_AT_HEADER);
  if (statusCol === -1) {
    return jsonOutput_({ error: "Sheet is missing a 'Status' column." });
  }

  sheet
    .getRange(body.row, statusCol + 1)
    .setValue(body.action === "approve" ? "Approved" : "Rejected");
  if (reviewedAtCol !== -1) {
    sheet.getRange(body.row, reviewedAtCol + 1).setValue(new Date());
  }

  return jsonOutput_({ ok: true });
}
