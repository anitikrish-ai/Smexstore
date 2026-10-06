# Launch Checklist

The custom domain is **not connected**. `smexstore.com` is only the configurable default for canonical, Open Graph, sitemap and robots output.

## Configure
1. Create `.env.production`:
   ```
   VITE_SITE_URL=https://your-real-domain
   VITE_API_BASE_URL=https://your-api-origin/api/v1   # leave empty until the backend exists
   ```
2. Place the official logo at `public/smexstore-logo.png`. It is used by the navbar, footer, auth pages, welcome dialog, favicon, apple-touch-icon, Open Graph and Twitter cards, and the email template. `npm run build` warns if it is missing.
3. `npm run build` regenerates `public/sitemap.xml` and `public/robots.txt` for `VITE_SITE_URL`, then builds into `dist/`.
4. Host `dist/` with a **single-page-app fallback** (all unknown paths serve `index.html`, with status 200). Unknown routes then show the in-app 404 page, which is marked `noindex`.
5. Point DNS at the host, enable HTTPS, then apply the headers in `docs/SECURITY.md`.
6. Submit `https://your-real-domain/sitemap.xml` in Google Search Console.

## Not set up on purpose
- Analytics: add a tracking ID only when a real one is supplied.
- Social preview image: currently the logo (a square `summary` card). Supply a 1200x630 branded image and switch `twitter:card` to `summary_large_image` when one exists.
- Maps, reviews, case studies, phone number: no real data supplied, so none are shown. A `tel:` link should be added only when a real number exists.
- Email sending: see `email-templates/README.md`.
