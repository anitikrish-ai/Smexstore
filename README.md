# Smexstore

Gaming tournament, esports community and game ID marketplace front end (React, TypeScript, Vite). The backend and database are not built yet; every data view renders loading, empty and error states instead of sample data.

## Run
```
npm install
npm run dev        # http://localhost:3000, API at VITE_API_BASE_URL from .env.development
npm run build      # typecheck, regenerate sitemap and robots, production build
npm run lint
```

## Map
- `src/styles/` tokens (Crimson and Midnight), motion system, global styles
- `src/components/common/` Dialog, ConfirmDialog, Tabs, Breadcrumbs, messages, skeleton
- `src/components/layout/` SiteShell (navbar, footer, route transition), Navbar, Footer, RoleGuard
- `src/components/welcome/` one-time welcome dialog
- `src/seo/` per-route titles, descriptions, canonical and robots
- `email-templates/` invitation email (no sending connected)
- `docs/` MOTION, SECURITY, DEPLOY, API_CONTRACT, OPEN_ITEMS
