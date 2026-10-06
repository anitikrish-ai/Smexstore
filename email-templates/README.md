# Smexstore invitation email

Reusable, responsive, table-based HTML email. Crimson and Midnight identity (email clients cannot switch themes, so it uses the Crimson palette). Uses the official logo, unmodified.

**Email delivery is not connected.** These files are templates only. Nothing here sends mail.

## Files
- `invitation.html` HTML version
- `invitation.txt` plain-text alternative (send both as multipart)
- `render.mjs` fills placeholders (HTML-escaped) and writes `preview.html` for local checking

## Placeholders
| Placeholder | Meaning |
| --- | --- |
| `SITE_URL` | Public origin, no trailing slash |
| `LOGO_URL` | Defaults to `SITE_URL/smexstore-logo.png`. Must be a public HTTPS URL |
| `INVITE_SUBJECT`, `INVITE_PREHEADER` | Subject (also `<title>`) and inbox preview text |
| `INVITE_KIND`, `INVITE_HEADLINE`, `INVITE_MESSAGE` | Label above the heading, heading, body message |
| `RECIPIENT_NAME`, `RECIPIENT_EMAIL`, `SENDER_NAME` | Personalization |
| `DETAIL_LABEL_1/2`, `DETAIL_VALUE_1/2` | Optional details block. Delete the row if unused |
| `CTA_LABEL`, `CTA_URL` | Button text and destination |
| `YEAR` | Filled automatically |

`renderInvitation()` throws if any placeholder is missing, so a half-filled email cannot go out.

## Before sending real mail
1. Host `public/smexstore-logo.png` at the public site URL.
2. Add your sender postal address to the footer if your provider or local law requires one.
3. Add an unsubscribe mechanism if invitations may be sent in bulk.
4. Configure SPF, DKIM and DMARC for the sending domain.
5. Send a test through your provider and check Gmail, Outlook and Apple Mail.
