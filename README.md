# Mar Thoma Family Conference 2027

A modern, mobile-friendly website for the Mar Thoma North America Diocese Family Conference 2027. Built with Next.js, React, and Tailwind CSS, configured for static export so it can be deployed to GitHub Pages.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview the site locally.

## Build for production

```bash
npm run build
```

Static files are output to the `out/` directory.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. If deploying to a **project site** (e.g. `username.github.io/family-conference`), set `basePath` in `next.config.ts`:

   ```ts
   basePath: "/family-conference",
   assetPrefix: "/family-conference/",
   ```

3. Build the site: `npm run build`
4. Deploy the `out/` folder to GitHub Pages (via GitHub Actions or by pushing `out/` to a `gh-pages` branch).

For a **user/organization site** (`username.github.io`), no `basePath` is needed.

## Pages

- **Home** — Conference title, dates, location, registration CTA, promo video section
- **About** — Conference overview and family-focused program details
- **Leaders** — Diocesan leadership
- **Registration** — Coming soon placeholder (form not yet implemented)
- **Souvenir** — Conference keepsakes
- **Contact** — Diocese contact information

## Project structure

```
src/
  app/           # Next.js App Router pages
  components/    # Shared UI components (Header, Footer, etc.)
  lib/           # Site content and navigation config
public/images/   # Conference logos and photos
```

Content can be updated in `src/lib/site-content.ts` without touching page layouts.
