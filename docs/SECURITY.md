# Security Notes

Status: front end only. **No backend or database exists yet.** Nothing here claims server or database security.

## Done in this repository
- No secrets in source. Only `VITE_API_BASE_URL` and `VITE_SITE_URL` are read, and both are public by design. `.env` files are git-ignored; `.env.example` documents them.
- Production build: no source maps, `console.*` and `debugger` stripped.
- API client: no request is made when no API URL is configured, 15 second timeout, typed errors, token read through `safeStorage`.
- Untrusted links (banner and social URLs from the API) pass through `toSafeUrl`, which allows only `http`, `https`, `mailto`, `tel` and same-site paths. External links use `rel="noopener noreferrer"`.
- Forms sanitize and length-limit input (`src/utils/validation.ts`). React escapes rendered text; there is no `dangerouslySetInnerHTML`.
- Route guards (`RoleGuard`) hide authenticated and admin screens. **They are not a security boundary.**
- No native `alert`/`confirm`; actions use accessible dialogs.

## Required on the future backend
1. **Authorization on every endpoint.** Check identity and role server-side for each request. The client token only identifies the caller.
2. **Password storage:** hash with Argon2id or bcrypt. Never store or log plain text.
3. **Rate limiting** (suggested starting points, tune with real traffic):
   - login, register, forgot/reset password, verify email: 5 per minute per IP and per account
   - marketplace contact reveal and booking requests: 10 per minute per user
   - general API: 120 per minute per IP
4. **Token handling:** the client currently keeps the session token in `localStorage` (existing design). That is exposed to any XSS. Preferred: server-set `HttpOnly; Secure; SameSite=Lax` cookie, then remove token handling from `src/api/client.ts` and `useAuth`.
5. **CORS:** allow only the exact public site origin (and the dev origin in development). No wildcard with credentials.
6. **Validation:** repeat every client rule server-side; reject, do not just sanitize.
7. **Uploads:** profile avatars are presets only. Any future file upload needs type, size and content checks.

## Security headers (set at the host or CDN)
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
X-Frame-Options: DENY
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://YOUR-API-ORIGIN; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
```
`style-src 'unsafe-inline'` is needed because components use inline `style` props. Replace `YOUR-API-ORIGIN` when the backend exists. These headers cannot be set from client code, so they are not active until configured on hosting.

## Known dependency advisories
`npm audit --omit=dev` reports two moderate advisories in `react-router` 6.x. Both are fixed only in v7 (a breaking upgrade), so they were not forced in this pass:
- Open redirect through a backslash in `<Link>` or `navigate()`. This app only navigates to fixed internal paths, and the login redirect target comes from router state, not from the URL.
- Deserialization during SSR hydration. This app does not use SSR.

Plan a tested upgrade to React Router 7. Remaining audit items are development tooling only (Vite, ESLint) and do not ship to users.

## Git history
The uploaded archive had no `.git` directory, so history could not be audited. Before publishing, run a scanner such as `gitleaks detect` or `trufflehog git file://.` on the real repository. If a secret is found, rotate it first, then remove it from history. The old `.env` in the archive held only a localhost API URL (no secret) and has been replaced with `.env.example` and a git-ignored `.env.development`.
