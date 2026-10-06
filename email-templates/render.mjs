/**
 * Fills the invitation template placeholders and writes a preview file.
 * This does NOT send email. No mail provider is connected.
 *
 *   node email-templates/render.mjs                 -> writes email-templates/preview.html with obvious sample text
 *
 * In production, call renderInvitation() from your backend with real values.
 * Every value is HTML-escaped, so user-supplied names cannot inject markup.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = dirname(fileURLToPath(import.meta.url));

const escapeHtml = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export function renderInvitation(values, { text = false } = {}) {
  const template = readFileSync(resolve(dir, text ? 'invitation.txt' : 'invitation.html'), 'utf8');
  const siteUrl = (values.SITE_URL || '').replace(/\/+$/, '');
  const filled = { YEAR: new Date().getFullYear(), LOGO_URL: `${siteUrl}/smexstore-logo.png`, ...values, SITE_URL: siteUrl };

  const missing = new Set();
  const out = template.replace(/\{\{([A-Z0-9_]+)\}\}/g, (_, key) => {
    if (filled[key] === undefined) {
      missing.add(key);
      return '';
    }
    return text ? String(filled[key]) : escapeHtml(filled[key]);
  });
  if (missing.size) throw new Error(`Missing template values: ${[...missing].join(', ')}`);
  return out;
}

// CLI preview. Values are visibly placeholders on purpose: no invented users, tournaments or dates.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const html = renderInvitation({
    SITE_URL: 'https://smexstore.com',
    INVITE_SUBJECT: '[Invitation subject]',
    INVITE_PREHEADER: '[Short preview text]',
    INVITE_KIND: '[Invitation type]',
    INVITE_HEADLINE: '[Invitation headline]',
    RECIPIENT_NAME: '[Recipient name]',
    RECIPIENT_EMAIL: '[recipient@example.com]',
    SENDER_NAME: '[Sender name]',
    INVITE_MESSAGE: '[Invitation message written by the sender or the system.]',
    DETAIL_LABEL_1: '[Detail label]',
    DETAIL_VALUE_1: '[Detail value]',
    DETAIL_LABEL_2: '[Detail label]',
    DETAIL_VALUE_2: '[Detail value]',
    CTA_LABEL: '[Call to action]',
    CTA_URL: 'https://smexstore.com/register',
  });
  writeFileSync(resolve(dir, 'preview.html'), html);
  console.log('Wrote email-templates/preview.html');
}
