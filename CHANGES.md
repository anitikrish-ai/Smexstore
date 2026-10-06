# Smexstore audit and upgrade: change summary

Existing project modified in place. Framework, routes, API layer, hooks and data flow preserved.

## Needs your input
- `public/smexstore-logo.png` was NOT in the uploaded zip. Add the official file; every surface already points to it. No substitute logo was made.
- Real domain, phone number, analytics ID and 1200x630 social image: not supplied, nothing invented. See `docs/DEPLOY.md`.

## Verified (headless Chromium, 320 to 1280px, both themes)
- Production build, `tsc`, `eslint`: clean (baseline build was failing with 4 TS errors).
- 0 horizontal overflow, 0 console errors or warnings on 15 routes at 5 widths.
- 40 behavior checks pass: welcome popup rules, mobile menu, theme toggle, reduced motion, tabs, 404, sitemap, robots, guards.
- axe-core (WCAG 2.1 A/AA + best practice): 0 violations in Crimson and Midnight.

## Not verifiable here
- Pages that need backend data (tournament, team and listing detail, profile, admin, notifications) were type-checked and code-reviewed, but not rendered with live data.
- Real-device Safari and Firefox. View Transitions theme reveal needs Chromium 111+ or Safari 18+; others get a color cross-fade.
