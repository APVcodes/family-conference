# Souvenir Submission & Review Setup

This feature has two parts that live outside this repo and must be set up
by hand: the Formester submission form, and a Google Apps Script backend
that powers the password-protected `/admin/souvenir/` review page.

```
Submitter → Formester-hosted form (file upload + long text)
                │
                ├─→ Google Drive folder   (images — native Formester integration)
                └─→ Google Sheet          (one row per submission — native Formester integration)
                                                │
                                                │ bound to
                                                ▼
                                    Google Apps Script Web App
                                    (doGet = password + list, doPost = password + approve/reject)
                                                ▲
                                                │ fetch() with password
                        /admin/souvenir/  (static page, password form)
```

## Step 1: Formester dashboard setup

1. Create a new form, e.g. "Souvenir Committee Submission."
2. Add fields:
   - Short text — "Full Name" (recommended, for attribution).
   - Email — "Email Address" (recommended, for follow-up).
   - Long text/paragraph — "Your Story." Set max length to 1500 if the
     field type supports it.
     - **Verify:** does Formester's long-text field support a *minimum*
       character count (1000)? If only max is supported, the submission
       page's on-page instructional copy is the fallback.
   - File upload — "Images." Restrict file types to images (jpg/png), set
     max files = 3.
     - **Verify:** does Formester's file-upload field support a *minimum*
       file count (2), or only a max? Same fallback as above.
3. Add on-form instructional text restating "2–3 images, 1,000–1,500
   characters" so the constraint is visible inside the embedded form too.
4. Confirm the form is publicly accessible (no Formester account required
   to submit).
5. Integrations tab → enable **Google Drive** → sign in with the Google
   account that should own the files → choose/create a destination folder
   (e.g. "36th Family Conference / Souvenir Submissions").
6. Integrations tab → enable **Google Sheets** → same or appropriate
   account → let Formester create a new Sheet (or pick an existing one).
   This Sheet is the data source for the Apps Script backend in Step 2.
7. Share/Embed tab → copy the form's `id` and embed `url` → paste into
   `souvenirSubmission.formesterId` / `formesterUrl` in
   `src/lib/site-content.ts`.
8. **Submit one real test entry** (2 test images + placeholder text) and
   open the resulting Sheet row. Record:
   - The header/column names Formester writes.
   - What value the file-upload column actually contains — a single Drive
     file URL, multiple URLs (comma/newline separated), a folder link, or
     something else.

   This is the biggest unknown in the whole setup and determines how the
   admin page's image rendering works — `src/components/SouvenirAdminPanel.tsx`
   currently guesses at the format; revisit its `toImageUrls`/
   `isImageColumn` helpers once you know the real column shape.
9. Open the Drive folder from step 5 and check the sharing setting on the
   uploaded test files. If it's "Restricted" (only the owning account can
   view), the admin page's images won't load for reviewers not signed into
   that account — set the folder (or files) to "Anyone with the link —
   Viewer" if so.

## Step 2: Google Apps Script setup

1. Open the Sheet from Step 1.6 → Extensions → Apps Script.
2. Paste `google-apps-script/souvenir-review.gs` from this repo into
   `Code.gs`.
3. Project Settings → Script Properties → add `ADMIN_PASSWORD` with the
   shared password the review board will use.
4. Manually add a `Status` header column to the Sheet (and optionally
   `Reviewed At`) — the script doesn't create these for you.
5. Deploy → New deployment → Web app → Execute as "Me" → Who has access
   "Anyone" → Deploy → authorize the requested scopes → copy the `/exec`
   URL.
6. Test the URL directly in a browser: `<url>?password=<correct>` should
   return JSON with the test submission; `<url>?password=wrong` should
   return an error with no data.
7. For future script edits: Deploy → Manage deployments → edit (pencil)
   the existing deployment → Version "New version" → Deploy. This keeps
   the same `/exec` URL.

## Step 3: Wire the URL into the site

- Add `NEXT_PUBLIC_SOUVENIR_ADMIN_API_URL` as a GitHub Actions repository
  **variable** (not secret — the URL isn't sensitive, only the password
  is, and the password never enters this repo or this variable):
  Settings → Secrets and variables → Actions → Variables tab → New
  repository variable.
- For local testing, copy `.env.example` to `.env.local` and fill in the
  same URL.

## Verification checklist

1. `npm run dev`, visit `/souvenir/submit/`, confirm the Formester iframe
   loads once `formesterId`/`formesterUrl` are filled in.
2. Submit one real test entry; confirm files land in the Drive folder and
   a row appears in the Sheet with the expected columns.
3. Hit the Apps Script `/exec` URL directly with the correct password
   (get the test row back) and an incorrect one (get an error, no data
   leaked).
4. `npm run build` locally with `NEXT_PUBLIC_SOUVENIR_ADMIN_API_URL` set,
   serve `out/` (e.g. `npx serve out`), and on `/admin/souvenir/`: confirm
   the `noindex` meta tag is present, the wrong-password error renders,
   the correct password loads the test submission with working images,
   and clicking Approve updates both the UI and the actual Sheet row (with
   no failed preflight in the Network tab).
5. Confirm `/souvenir/` links to `/souvenir/submit/`, and that
   `/admin/souvenir/` isn't reachable from any nav/sitemap/page link.
6. Push to `main`, confirm the GitHub Actions build succeeds with the
   repository variable set, and repeat step 4's checks against the live
   GitHub Pages deployment — including the wrong-password path, to catch
   any origin-specific CORS surprises.
