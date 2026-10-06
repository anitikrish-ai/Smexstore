/**
 * Generates public/sitemap.xml and public/robots.txt for the configured public origin.
 *
 *   VITE_SITE_URL=https://example.com node scripts/generate-seo.mjs
 *
 * Runs automatically before every build (see "prebuild" in package.json).
 * Only public, indexable, static routes are listed. Detail pages (/tournaments/:id and similar)
 * depend on backend data, so they are intentionally left out until real records exist.
 */
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function readEnvFile(name) {
  const file = resolve(root, name);
  if (!existsSync(file)) return {};
  const out = {};
  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !line.trim().startsWith('#')) out[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
  }
  return out;
}

const fileEnv = { ...readEnvFile('.env'), ...readEnvFile('.env.production'), ...readEnvFile('.env.local') };
const siteUrl = (process.env.VITE_SITE_URL || fileEnv.VITE_SITE_URL || 'https://smexstore.com').replace(/\/+$/, '');

const routes = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/tournaments', priority: '0.9', changefreq: 'daily' },
  { path: '/teams', priority: '0.8', changefreq: 'daily' },
  { path: '/marketplace', priority: '0.8', changefreq: 'daily' },
  { path: '/rank-boosting', priority: '0.7', changefreq: 'weekly' },
  { path: '/leaderboard', priority: '0.7', changefreq: 'daily' },
  { path: '/socials', priority: '0.4', changefreq: 'monthly' },
  { path: '/about', priority: '0.5', changefreq: 'monthly' },
  { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
  { path: '/terms', priority: '0.3', changefreq: 'yearly' },
];

const lastmod = new Date().toISOString().slice(0, 10);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.path === '/' ? '' : r.path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`;

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /settings
Disallow: /profile
Disallow: /notifications
Disallow: /marketplace/new
Disallow: /login
Disallow: /register
Disallow: /verify-email
Disallow: /forgot-password
Disallow: /reset-password
Disallow: /search

Sitemap: ${siteUrl}/sitemap.xml
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), sitemap);
writeFileSync(resolve(root, 'public/robots.txt'), robots);
console.log(`SEO files generated for ${siteUrl}`);
