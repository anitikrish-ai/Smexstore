/**
 * Warns when required brand assets are missing. Does not fail the build.
 * The official logo must be placed at public/smexstore-logo.png.
 */
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const required = ['public/smexstore-logo.png'];
const missing = required.filter((f) => !existsSync(resolve(root, f)));

if (missing.length) {
  console.warn('\nWARNING: missing brand asset(s):');
  for (const f of missing) console.warn(`  - ${f}`);
  console.warn('Navbar, footer, auth pages, welcome dialog, favicon and social previews all reference this file.\n');
}
