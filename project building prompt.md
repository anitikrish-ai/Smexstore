# Esports Tournament & Community Platform: Full Project Prompt (JSON)

**Version:** 2.0 (converted from SRS v1.1)
**Purpose:** A single hand-off file for developers, designers, QA and AI coding agents. The whole project is expressed as JSON blocks, each explained in plain language.

---

## 0. Read this first

### 0.1 How to use this file
1. Read Section 1 (Theme). It overrides every colour or style instruction in the original SRS.
2. Read Section 2 (Global rules). These apply to every page.
3. Build from Section 3 (Project spec).
4. Follow Section 4 (Motion system) before animating anything.
5. Use Section 6 (Agent prompt) if you are giving this to an AI coding agent.

### 0.2 What changed from the SRS
| Item | SRS v1.1 | This file |
|---|---|---|
| Visual theme | Deep dark + emerald/teal, blue-green gradients, selective glow (THEME-001 to 010) | **DualSpace Crimson (default) + Midnight (alternate)**. THEME-001 to 010 are superseded |
| Colour modes | Light / Dark / AMOLED (FR-090 to 092) | **Crimson / Midnight toggle** replaces them (see Section 1.4) |
| Everything else | n/a | Unchanged: every feature, flow, security rule, API, data entity and prohibition is preserved |

### 0.3 Important: the design system values are not in this file
You referred to "the provided DualSpace Crimson + Midnight design system", but its actual values (hex codes, fonts, radii, spacing scale, shadows) were not included in this conversation. I have **not invented them**. Every visual value below is a named token marked `FROM_DESIGN_SYSTEM`. Before building, paste the real values from your design system into the token table in Section 1.2. Do not substitute guesses.

---

## 1. Theme: DualSpace Crimson + Midnight

### 1.1 Theme instruction (as you specified)

```json
{
  "theme": {
    "instruction": "Use the provided DualSpace Crimson + Midnight design system as the MAIN visual theme for the entire project.",
    "requirements": [
      "Preserve the exact color palette, typography, rounded geometry, spacing, borders, shadows, and overall visual language.",
      "Use Crimson as the default theme and Midnight as the alternate theme.",
      "Include a functional theme toggle to switch between both themes.",
      "Keep the design clean, premium, editorial, responsive, and minimal.",
      "Do not introduce unrelated colors, gradients, neon effects, cyberpunk styling, or a different visual direction."
    ]
  }
}
```

**What this means in practice:**
- Only colours that exist in the DualSpace system may appear. No emerald, teal, or blue-green from the SRS.
- No gradients anywhere (buttons, banners, progress bars, hero areas). Use flat fills.
- No glow, no neon, no "gaming" styling. Esports is the subject matter, not the visual style. The look is editorial and calm.
- Crimson loads by default. Midnight is chosen by the toggle. The choice is saved to the user's account.

### 1.2 Token contract (fill from your design system)

All components must read these CSS custom properties and never hard-code a colour, font, radius, spacing or shadow value.

```json
{
  "themeTokens": {
    "source": "DualSpace Crimson + Midnight design system (user-provided)",
    "defaultTheme": "crimson",
    "alternateTheme": "midnight",
    "attribute": "data-theme",
    "rule": "Values below are placeholders. Replace each FROM_DESIGN_SYSTEM with the exact value from the design system. Add no new colours.",
    "color": {
      "--color-bg":            { "crimson": "FROM_DESIGN_SYSTEM", "midnight": "FROM_DESIGN_SYSTEM" },
      "--color-surface":       { "crimson": "FROM_DESIGN_SYSTEM", "midnight": "FROM_DESIGN_SYSTEM" },
      "--color-surface-alt":   { "crimson": "FROM_DESIGN_SYSTEM", "midnight": "FROM_DESIGN_SYSTEM" },
      "--color-text":          { "crimson": "FROM_DESIGN_SYSTEM", "midnight": "FROM_DESIGN_SYSTEM" },
      "--color-text-muted":    { "crimson": "FROM_DESIGN_SYSTEM", "midnight": "FROM_DESIGN_SYSTEM" },
      "--color-accent":        { "crimson": "FROM_DESIGN_SYSTEM", "midnight": "FROM_DESIGN_SYSTEM" },
      "--color-accent-text":   { "crimson": "FROM_DESIGN_SYSTEM", "midnight": "FROM_DESIGN_SYSTEM" },
      "--color-border":        { "crimson": "FROM_DESIGN_SYSTEM", "midnight": "FROM_DESIGN_SYSTEM" },
      "--color-success":       { "crimson": "FROM_DESIGN_SYSTEM or derive only if system defines it", "midnight": "same" },
      "--color-error":         { "crimson": "FROM_DESIGN_SYSTEM or derive only if system defines it", "midnight": "same" }
    },
    "typography": {
      "--font-display": "FROM_DESIGN_SYSTEM",
      "--font-body": "FROM_DESIGN_SYSTEM",
      "--font-mono": "FROM_DESIGN_SYSTEM (only if the system defines one)",
      "--type-scale": "FROM_DESIGN_SYSTEM"
    },
    "geometry": {
      "--radius-sm": "FROM_DESIGN_SYSTEM",
      "--radius-md": "FROM_DESIGN_SYSTEM",
      "--radius-lg": "FROM_DESIGN_SYSTEM",
      "--border-width": "FROM_DESIGN_SYSTEM"
    },
    "spacing": {
      "--space-scale": "FROM_DESIGN_SYSTEM",
      "--density-compact": "FROM_DESIGN_SYSTEM multiplier",
      "--density-comfortable": "FROM_DESIGN_SYSTEM multiplier (default)",
      "--density-spacious": "FROM_DESIGN_SYSTEM multiplier"
    },
    "shadow": {
      "--shadow-sm": "FROM_DESIGN_SYSTEM",
      "--shadow-md": "FROM_DESIGN_SYSTEM"
    }
  }
}
```

If the design system does not define a success or error colour, ask the owner. Do not add a green or red of your own.

### 1.3 Theme toggle behaviour

```json
{
  "themeToggle": {
    "location": "Account menu and Settings page; a compact toggle may also sit in the navbar",
    "options": ["crimson", "midnight"],
    "default": "crimson",
    "persistence": "Saved to the user profile (DATA-001). Guests: saved in a first-party cookie or local storage, with a safe fallback to Crimson.",
    "firstPaint": "Apply data-theme from the saved value before first paint (inline script in <head>) so there is no flash of the wrong theme.",
    "transition": "Clip-path wipe (see motion move 'theme-wipe'). Never a fade. Instant swap when prefers-reduced-motion is on.",
    "accessibility": "Real <button role='switch' aria-checked>, keyboard operable, visible focus ring using --color-accent.",
    "tests": ["TEST-009", "TEST-018", "TEST-020"]
  }
}
```

### 1.4 What happens to the old Light / Dark / AMOLED requirements
FR-090, FR-091 and FR-092 asked for three colour modes. Your new instruction asks for exactly two themes with a toggle, so they are replaced:

| Old ID | New handling |
|---|---|
| FR-090 Dark Mode | Satisfied by Midnight (the dark theme) |
| FR-091 Light Mode | Not built as a separate mode. **Open question for you:** is Crimson a light or dark theme in your system? |
| FR-092 AMOLED | Dropped (no true-black variant exists in the two-theme system) |
| FR-093 Density | **Kept**: Compact / Comfortable / Spacious, applied in both themes |
| FR-094 Password toggle | **Kept** |

If you still want Light or AMOLED, tell me and they can be added as additional design-system themes. Do not add them without palette values.

---

## 2. Global rules (apply to every page)

```json
{
  "globalRules": {
    "prohibited": {
      "TC-001": "No fade animation anywhere. This includes opacity transitions used as reveals, fade-in on scroll, cross-fades, and fade-based reduced-motion fallbacks.",
      "TC-002": "No frosted-glass or blurred-glass surfaces (no backdrop-filter blur).",
      "TC-003": "No excessive edge glow. In this theme: no glow at all.",
      "TC-004": "No stuck, jittering or broken navbar during scroll, resize or state change.",
      "TC-005": "No broken links. Every route resolves or shows the custom 404.",
      "newInThisVersion": [
        "No gradients",
        "No neon or cyberpunk styling",
        "No colours outside the DualSpace palette"
      ]
    },
    "required": {
      "TC-006": "Smooth and optimised for any device.",
      "TC-007": "Responsive for any type of device.",
      "TC-008": "Profile pictures come only from a preset set. No custom upload.",
      "TC-009": "Verification and password-reset emails and pages use the same Crimson/Midnight styling as the site.",
      "TC-010": "Navbar remains stable at all times."
    },
    "responsive": {
      "devices": ["small phone", "large phone", "tablet", "laptop", "desktop", "ultrawide", "high-DPI"],
      "orientations": ["portrait", "landscape"],
      "behaviour": [
        "Components reflow and reposition. Shrinking a desktop layout is not enough (RESP-010).",
        "No overflow, clipping or broken layouts (RESP-011).",
        "No unusable controls: touch targets stay tappable, nothing overlaps (RESP-012).",
        "Spacing, type and hierarchy stay consistent across breakpoints (RESP-013).",
        "Applies to the navbar, banners, cards and theme (RESP-014)."
      ]
    },
    "accessibility": {
      "mandatory": ["prefers-reduced-motion respected sitewide", "password visibility toggle on all password fields"],
      "recommended": "Follow standard best practice (contrast, keyboard, screen reader labels). A formal WCAG level was not specified (TBD-05)."
    },
    "performance": [
      "Animate transform only where possible (PERF-103).",
      "No layout thrashing, no unnecessary re-renders from animation state (PERF-102).",
      "Input is never blocked by animation (PERF-106).",
      "Test on low-end and high-end devices (TEST-022)."
    ]
  }
}
```

---

## 3. Project specification

### 3.1 Overview, objectives, scope

```json
{
  "project": {
    "name": "Esports Tournament & Community Platform",
    "summary": "A web platform for an esports community: tournament information (past, current, future), team/group formation, a peer-to-peer in-game ID marketplace with seller ratings, a rank-boosting booking service, the owner's social links, and a secure account system.",
    "roles": ["normal_user", "admin"],
    "roleNote": "The original wording was 'two types: normal user, 2 admins'. Built as two role types. Whether 'admin' also means exactly two admin accounts is unresolved (TBD-01).",
    "objectives": [
      "Show tournament info across past, current and future states",
      "Let users reach the owner via a social links page",
      "Let users browse and book rank-boosting packages",
      "Let users list, browse and buy/sell game IDs safely, with seller ratings to reduce scams",
      "Let users form and join teams/groups",
      "Provide authentication, device/session security and activity history",
      "Deliver a smooth, accessible, responsive UI under the rules in Section 2"
    ],
    "outOfScope": [
      "In-app payment processing (not specified; see TBD-02)",
      "Third-party integrations beyond social links"
    ]
  }
}
```

### 3.2 Navigation and pages

```json
{
  "navbar": {
    "appearsOn": "all pages",
    "items": [
      { "id": "UI-001", "item": "Main logo", "behaviour": "Links to Home" },
      { "id": "UI-002", "item": "Universal search bar", "placeholder": "Search tournament or team" },
      { "id": "UI-003", "item": "Notification centre", "receives": ["requests (e.g. team join requests)", "updates (e.g. tournament updates)"] },
      { "id": "UI-004", "item": "Account menu", "contents": ["Profile", "Settings", "Device Management", "Activity History", "Theme toggle", "Logout"], "note": "Contents differ for Normal User vs Admin" }
    ],
    "constraint": "TC-004 / TC-010: never stuck or broken on scroll, resize or state change"
  },
  "pages": [
    "Home", "Tournaments", "Teams & Groups", "Profile", "ID Buy/Sell Marketplace",
    "Rank Boosting Booking", "Leaderboard", "Social Media Links", "About Us", "Custom 404",
    "Auth: Register, Email Verification, Login, Password Reset",
    "Settings: Device Management, Active Sessions, Login History, Activity History, Theme and Interface"
  ]
}
```

### 3.3 Functional requirements by page

```json
{
  "home": {
    "FR-001": "Show the global navbar.",
    "FR-002": "Rotating banner area with about 5 to 6 banners (updates and posters). Carousel motion must not use fades.",
    "FR-003": "List of rank-boosting packages available to book. Details are supplied by the provider (TBD-03).",
    "FR-004": "'Recent Tournaments' section. Each entry has a proper description and full details, not just a title."
  },
  "tournaments": {
    "FR-010": "List available tournaments.",
    "FR-011": "Separate sections for Past and Future (current/ongoing is also shown, as introduced on Home).",
    "FR-012": "Each listing carries full details and description."
  },
  "teamsAndGroups": {
    "FR-020": "Users can create a team or group.",
    "FR-021": "Other users can join an existing one.",
    "FR-022": "Each listing shows total member count.",
    "FR-023": "Each listing shows availability: open to join or not available (open slots or full)."
  },
  "profile": {
    "FR-024": "Profile picture chosen only from a preset set. No custom upload.",
    "FR-025": "Show in-game user ID and in-game username.",
    "FR-026": "Show in-game role (playstyle).",
    "FR-027": "Bio field (free text)."
  },
  "marketplace": {
    "FR-040": "Seller can list a game ID with a screenshot as proof.",
    "FR-041": "Clicking a listing opens a detail page with seller profile info, the screenshot(s), and the seller's contact number or link.",
    "FR-042": "Seller has a button on their own listing to mark it sold or delete it.",
    "FR-043": "If the seller lowers the price, the banner shows a calculated discount (amount and/or percentage) and a 'Good Deal' tag.",
    "FR-044": "If the seller raises the price, the listing is tagged 'Hot'.",
    "FR-045": "Seller ratings are visible on the listing and seller page.",
    "UI-015": "'Good Deal' and 'Hot' are visually distinct badges, calculated dynamically from price-change data. Use only DualSpace colours (distinguish by label, shape or weight if the palette has no second accent)."
  },
  "rankBoosting": {
    "FR-050a": "Users browse packages (surfaced on Home).",
    "FR-050b": "Users can book a package.",
    "FR-050c": "Package availability and details come from the provider."
  },
  "leaderboard": {
    "FR-060": "Section showing the most highly rated tournaments.",
    "FR-061": "Separate section showing hot (popular) teams or groups."
  },
  "staticPages": {
    "FR-070": "Social Media Links page listing all of the owner's links.",
    "FR-071": "About Us page with owner details.",
    "FR-072": "Custom 404 page in the Crimson/Midnight style, free of prohibited effects."
  },
  "notifications": {
    "FR-080": "Delivers requests (e.g. team join requests) and updates (tournament updates, marketplace activity, announcements). Accessible from the navbar."
  },
  "universalSearch": {
    "FR-030": "Search anything inside the site (tournaments, teams and more).",
    "FR-031": "Filters.",
    "FR-032": "Sorting.",
    "FR-033": "Categories / tags."
  },
  "ratings": {
    "FR-050": "A buyer who purchased an ID can rate the seller so others avoid scams.",
    "SEC-008": "Rating allowed only for buyers with a legitimate purchase relationship."
  },
  "settings": {
    "FR-090_092": "Replaced by the Crimson/Midnight toggle (see Section 1.4).",
    "FR-093": "Interface density: Compact, Comfortable, Spacious.",
    "FR-094": "Show/hide password toggle on every password field."
  },
  "activityHistory": {
    "FR-100": "History feature for all user types recording what users click and do.",
    "FR-101": "Optional. Users can turn it off, hide it, or make it private.",
    "FR-102": "Distinct from Login History, which tracks authentication events."
  },
  "loadingAndFeedback": {
    "FR-110": "Loading uses skeletons, progress bars and loaders (not decorative effects).",
    "FR-111": "Uploads show progress.",
    "FR-112": "Success and error actions use feedback animations.",
    "FR-113": "Empty states are clearly communicated (no tournaments, no sessions, no listings)."
  },
  "errorHandling": {
    "FR-120": "Custom 404 for any unknown route.",
    "FR-121": "No broken links.",
    "FR-122": "Clear auth errors: invalid credentials, expired reset link, unverified email.",
    "FR-123": "Clear errors for failed uploads and bookings."
  }
}
```

### 3.4 User flows

```json
{
  "flows": {
    "UX-001_register": ["Submit registration", "System sends a themed verification email", "User verifies email (what is blocked until then is TBD-04)"],
    "UX-002_login": ["Enter credentials (with show/hide toggle)", "Success creates a session/device entry", "Success records a login-history entry"],
    "UX-003_passwordReset": ["Request reset", "Receive themed time-limited link", "Set new password (with show/hide toggle)"],
    "UX-004_teams": ["Create team/group", "It appears with member count and availability", "Another user requests/joins", "Notification may fire to the relevant party"],
    "UX-005_listId": ["Upload ID details and screenshot", "Listing appears with no tag", "Lower price gives 'Good Deal' plus discount; raise price gives 'Hot'", "Mark sold or delete when sold"],
    "UX-006_buyId": ["Browse or search", "Open listing detail", "Contact seller off-platform via shown contact", "Rate the seller after purchase"],
    "UX-007_boost": ["View packages on Home", "Select and book"],
    "UX-008_rate": ["Buyer submits rating after completed purchase", "Rating shows on seller listings and profile"]
  }
}
```

### 3.5 Authentication and device management

```json
{
  "auth": {
    "AUTH-001": "Secure authentication for all accounts.",
    "AUTH-002": "Email verification in the account lifecycle, themed.",
    "AUTH-003": "Password reset for all users.",
    "AUTH-004": "Password visibility toggle on every password field.",
    "AUTH-005": "Two roles: Normal User and Admin.",
    "AUTH-006": "Every login creates an active session and a login-history entry."
  },
  "deviceManagement": {
    "DEV-001": "Active sessions: list all current sessions with identifiable device/browser, and approximate location/time where available.",
    "DEV-002": "Login history: historical log of login events.",
    "DEV-003": "Device list and device details view.",
    "DEV-004": "Remote logout / revoke any session or device."
  }
}
```

### 3.6 Backend and API

The original gave no stack, so the stack is a decision for you. Endpoints below are the behaviour implied by the features.

```json
{
  "api": {
    "API-001": "Auth: register, verify email, login, logout, reset password",
    "API-002": "Sessions/devices: list sessions, list login history, list devices and details, revoke",
    "API-003": "Tournaments: past, current, future with full details",
    "API-004": "Teams/groups: create, join, member count, availability",
    "API-005": "Profile: get/update preset picture, in-game ID and username, in-game role, bio",
    "API-006": "Marketplace: create with screenshot upload, list/detail, price update with Good Deal/Hot calculation, mark sold/delete",
    "API-007": "Rank boosting: list packages, book",
    "API-008": "Leaderboard: top-rated tournaments, hot teams/groups",
    "API-009": "Ratings: submit and fetch, gated to qualifying buyers",
    "API-010": "Notifications: requests and updates",
    "API-011": "Search: cross-entity with filter, sort, category/tag params",
    "API-012": "Activity history: record events, toggle visibility",
    "API-013": "Admin endpoints for elevated management",
    "API-014": "Every mutating endpoint enforces authentication and authorization"
  }
}
```

### 3.7 Data model

```json
{
  "data": {
    "DATA-001_User": ["credentials", "role", "emailVerified", "presetProfilePictureRef", "inGameId", "inGameUsername", "inGameRole", "bio", "theme (crimson|midnight)", "density (compact|comfortable|spacious)", "activityVisibility (public|hidden|off)"],
    "DATA-002_SessionDevice": ["sessionId", "deviceMetadata", "loginTimestamp", "status (active|revoked)"],
    "DATA-003_Tournament": ["name", "description", "fullDetails", "status (past|current|future)", "rating"],
    "DATA-004_TeamGroup": ["name", "members", "memberCount", "availability (open|closed)"],
    "DATA-005_Listing": ["sellerRef", "gameIdDetails", "screenshots", "contact", "currentPrice", "priceHistory", "status (active|sold|deleted)", "tags (good_deal|hot)"],
    "DATA-006_Rating": ["buyerRef", "sellerRef", "listingRef", "value", "linkedCompletedPurchase"],
    "DATA-007_RankPackage": ["providerDetails", "availability", "bookings"],
    "DATA-008_Notification": ["recipient", "type (request|update)", "readState", "sourceRef"],
    "DATA-009_Activity": ["userRef", "event", "timestamp", "visibility"],
    "DATA-010": "Relationships: User to Listings, Teams, Sessions, Ratings given and received"
  }
}
```

### 3.8 Security and privacy

```json
{
  "security": {
    "SEC-001": "Industry-standard hashed password storage.",
    "SEC-002": "Email verification enforced.",
    "SEC-003": "Password reset uses a secure, time-limited token.",
    "SEC-004": "Users can view and revoke sessions at will.",
    "SEC-005": "Login history retained and viewable by the owner.",
    "SEC-006": "Activity-history privacy enforced at the data-access level, not only the UI.",
    "SEC-007": "Seller contact details exposed only through the deliberate listing click-through, not publicly indexed.",
    "SEC-008": "Ratings restricted to genuine buyers.",
    "SEC-009": "Role-based authorization between Normal User and Admin."
  },
  "admin": {
    "ADM-001": "Admin role distinct from Normal User at auth and UI level.",
    "ADM-002": "Implied scope: manage rank-boosting package content (if provider is not an ordinary seller) and marketplace moderation.",
    "note": "Exact admin screens were never itemised (TBD-01, TBD-03). Build role gating plus the implied scope above, and confirm the rest."
  }
}
```

### 3.9 Edge cases

```json
{
  "edgeCases": {
    "EDGE-001": "Listing sold/deleted while a buyer is viewing: detail page shows sold/removed status.",
    "EDGE-002": "Repeated price changes: tag and discount always reflect the most current price against the correct baseline.",
    "EDGE-003": "Team full: availability shows 'not available' and joining is blocked.",
    "EDGE-004": "Activity history turned off after being on: new privacy preference applies going forward.",
    "EDGE-005": "User revokes their own current session: log them out gracefully.",
    "EDGE-006": "Rating attempt without a qualifying purchase: blocked.",
    "EDGE-007": "Unverified email: apply one consistent restriction everywhere (TBD-04).",
    "EDGE-008": "Reduced motion on: all motion degrades gracefully per Section 4.6."
  }
}
```

### 3.10 Dependencies
Email delivery provider (verification and reset), file storage (screenshots and preset profile images), real-time or polling mechanism for notifications, session/device tracking infrastructure. No vendor is mandated.

---

## 4. Motion system

This section applies the motion-language approach: a scale, roles, rules and named signature moves, so animation is enforceable and not improvised per component. It is calibrated to the brand read from the theme: **calm, editorial, premium**. Fast and quiet beats slow and showy.

### 4.1 Where the SRS rules and general motion advice conflict
General motion guidance often reaches for opacity fades, glass panels, gradients and glow. This project bans all of them, so:

| Common technique | Status here | Replacement |
|---|---|---|
| Opacity fade-in / fade-out | **Banned** (TC-001) | Short translate and clip-path reveals |
| Reduced-motion fallback of "fade" | **Banned** | Instant state change |
| Cross-fade page transitions | **Banned** | Directional slide or clip-path wipe |
| Gradient shimmer on skeletons | **Banned** (no gradients) | Flat-colour band sliding across (transform) |
| Glass panels, glow, blur | **Banned** (TC-002, TC-003) | Flat surfaces with border and shadow tokens |

Because opacity is not used for reveals, "animate transform only" is the working rule. `clip-path` is permitted for reveals as a logged exception because it never triggers layout.

### 4.2 Two separate categories (ANIM-302)
Keep these distinct in code (separate files and class prefixes):
- **Motion animations** (`motion-*`): meaningful state change and feedback (ANIM-1xx, 4xx).
- **Normal UI transitions** (`ui-*`): baseline interactivity polish (ANIM-2xx).

### 4.3 Tokens (`motion-tokens.json`)

```json
{
  "duration": {
    "instant": "100ms",
    "fast": "200ms",
    "base": "280ms",
    "slow": "450ms"
  },
  "easing": {
    "standard": "cubic-bezier(0.2, 0, 0, 1)",
    "enter": "cubic-bezier(0.05, 0.7, 0.1, 1)",
    "exit": "cubic-bezier(0.3, 0, 0.8, 0.15)",
    "signature": "cubic-bezier(0.22, 1, 0.36, 1)"
  },
  "distance": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px"
  },
  "stagger": {
    "step": "40ms",
    "maxItems": 8
  },
  "rules": {
    "signatureEasing": "One only: 'signature' is a smooth, no-overshoot settle that fits an editorial brand. No springs or bounces.",
    "durationsFromScaleOnly": true,
    "exitsFasterThanEntrances": "Exit uses one step shorter duration than enter.",
    "animatedProperties": ["transform", "clip-path (reveals only)"],
    "neverAnimate": ["opacity as a reveal", "width", "height", "top", "left", "margin", "backdrop-filter", "box-shadow glow"]
  }
}
```

### 4.4 Choreography rules
1. **Animate only where it improves UX** (ANIM-301). Static is the default.
2. **One hero motion per view.** Everything else supports it quietly.
3. **Short distances.** Elements travel 8 to 24px, never across the screen.
4. **Exits are faster than entrances.**
5. **Stagger** list or grid children at 40ms, capped at 8 items. Items after the cap appear together.
6. **Different purposes, different motion** (ANIM-407): a card, a modal and a page transition must not share one curve and pattern. The same component type always animates identically.
7. **Never block input** (PERF-106). Animations are interruptible and never delay a tap, click, type or scroll.
8. **Limit simultaneous animations** on screen (PERF-104).

### 4.5 Signature moves

Each move lists trigger, properties, tokens and when **not** to use it.

```json
{
  "signatureMoves": [
    {
      "name": "card-lift",
      "covers": "ANIM-204, ANIM-405",
      "trigger": "hover / focus-visible / press on cards and listings",
      "animates": "transform: translateY(-4px) on hover, back to 0 on leave; shadow token swaps instantly",
      "timing": "fast, standard",
      "doNotUse": "on touch devices without hover (use press-down only), or on cards inside a long scrolling list at once"
    },
    {
      "name": "panel-reveal",
      "covers": "ANIM-206, ANIM-207, ANIM-210, ANIM-211, ANIM-406",
      "trigger": "menu, dropdown, modal or panel opens",
      "animates": "clip-path inset reveal from the anchor edge (menus/dropdowns), translateY(16px) to 0 (modals, panels). Close reverses faster.",
      "timing": "enter: base / enter easing. exit: fast / exit easing",
      "doNotUse": "for tooltips or tiny popovers (show instantly)"
    },
    {
      "name": "page-slide",
      "covers": "ANIM-403",
      "trigger": "route change (Home to Tournaments, listing list to detail)",
      "animates": "incoming content translateX(24px) to 0 with a clip-path reveal; outgoing content is removed immediately",
      "timing": "base / signature",
      "doNotUse": "for same-page tab switches (use 'tab-shift')"
    },
    {
      "name": "count-up",
      "covers": "ANIM-105, ANIM-408",
      "trigger": "a number enters view for the first time (member counts, ratings, leaderboard scores)",
      "animates": "numeric tween in JS with tabular figures to avoid width jitter",
      "timing": "slow, signature",
      "doNotUse": "on values that change frequently or on values the user is reading (update instantly)"
    },
    {
      "name": "progress-fill",
      "covers": "ANIM-102, ANIM-104, ANIM-408",
      "trigger": "uploads, bookings, loading steps",
      "animates": "transform: scaleX with transform-origin left; width never animated; fill is a flat accent colour",
      "timing": "tracks real progress, eased with standard",
      "doNotUse": "as a fake indicator when progress is unknown (use a skeleton)"
    },
    {
      "name": "theme-wipe",
      "covers": "ANIM-212",
      "trigger": "Crimson/Midnight toggle",
      "animates": "clip-path circle expanding from the toggle position over a snapshot layer, then the layer is removed. No cross-fade.",
      "timing": "slow / signature",
      "doNotUse": "on first load or when reduced motion is on (swap instantly)"
    }
  ],
  "supportingMoves": {
    "skeleton-band": "ANIM-103, ANIM-404: flat surface-alt band translateX across the placeholder. No gradient. Static placeholder under reduced motion.",
    "button-press": "ANIM-108, ANIM-203, ANIM-409: translateY(1px) scale(0.98) on press, instant release.",
    "state-morph": "ANIM-111, ANIM-402: a control or card reshapes by transform (scale or translate) between states. Avoid width/height; use FLIP technique when layout must change.",
    "scroll-reveal": "ANIM-107, ANIM-110: translateY(16px) to 0 with a clip-path reveal when entering view, once per element, only for top-level sections. No opacity.",
    "tab-shift": "ANIM-209: active indicator slides by translateX; panel content swaps with a 8px translate.",
    "success-error": "ANIM-106, ANIM-112: success uses a short checkmark draw (stroke-dashoffset); error uses a 2-step horizontal nudge of 4px. Colours come from tokens.",
    "focus-hover-ui": "ANIM-201, ANIM-202, ANIM-205, ANIM-208: colour and border-colour changes at instant duration. Colour changes are not fades because they are state swaps, not reveals."
  }
}
```

### 4.6 Reduced-motion contract (ANIM-304, PERF-107)
Every move ships its reduced-motion behaviour in the same file. The fallback is **instant or static, never a fade**.

| Move | Reduced-motion behaviour |
|---|---|
| card-lift | No lift; shadow/border swap only |
| panel-reveal | Appears and disappears instantly |
| page-slide | Instant route swap; focus moves to the new page heading |
| count-up | Final number shown immediately |
| progress-fill | Bar jumps to true value at each update (feedback is kept, motion is not) |
| theme-wipe | Instant theme swap |
| skeleton-band | Static placeholder block, no sweep |
| scroll-reveal | Removed; content is simply present |
| state-morph | Instant state change |
| success-error | Static icon and message; error keeps its colour and text |
| banner carousel | No auto-rotation; manual controls only |

### 4.7 Drop-in CSS (`motion.css`)

```css
:root {
  --dur-instant: 100ms;
  --dur-fast: 200ms;
  --dur-base: 280ms;
  --dur-slow: 450ms;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --ease-enter: cubic-bezier(0.05, 0.7, 0.1, 1);
  --ease-exit: cubic-bezier(0.3, 0, 0.8, 0.15);
  --ease-signature: cubic-bezier(0.22, 1, 0.36, 1);
  --dist-sm: 8px;
  --dist-md: 16px;
  --dist-lg: 24px;
}

/* ---- Normal UI transitions (ui-*): state swaps, not reveals ---- */
.ui-interactive {
  transition:
    color var(--dur-instant) var(--ease-standard),
    background-color var(--dur-instant) var(--ease-standard),
    border-color var(--dur-instant) var(--ease-standard);
}

/* ---- Motion animations (motion-*) ---- */
.motion-card-lift {
  transition: transform var(--dur-fast) var(--ease-standard);
}
@media (hover: hover) {
  .motion-card-lift:hover,
  .motion-card-lift:focus-visible { transform: translateY(-4px); }
}

.motion-press:active { transform: translateY(1px) scale(0.98); }

@keyframes motion-panel-in {
  from { transform: translateY(var(--dist-md)); clip-path: inset(0 0 100% 0); }
  to   { transform: translateY(0);              clip-path: inset(0 0 0 0); }
}
@keyframes motion-panel-out {
  from { transform: translateY(0);              clip-path: inset(0 0 0 0); }
  to   { transform: translateY(var(--dist-sm)); clip-path: inset(0 0 100% 0); }
}
.motion-panel[data-state="open"]   { animation: motion-panel-in  var(--dur-base) var(--ease-enter) both; }
.motion-panel[data-state="closed"] { animation: motion-panel-out var(--dur-fast) var(--ease-exit)  both; }

@keyframes motion-page-in {
  from { transform: translateX(var(--dist-lg)); clip-path: inset(0 0 0 100%); }
  to   { transform: translateX(0);              clip-path: inset(0 0 0 0); }
}
.motion-page-enter { animation: motion-page-in var(--dur-base) var(--ease-signature) both; }

.motion-progress { transform-origin: left center; transform: scaleX(var(--progress, 0)); transition: transform var(--dur-base) var(--ease-standard); }

@keyframes motion-skeleton-sweep {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}
.motion-skeleton { position: relative; overflow: hidden; background: var(--color-surface-alt); }
.motion-skeleton::after {
  content: ""; position: absolute; inset: 0; width: 40%;
  background: var(--color-border);           /* flat colour, no gradient */
  animation: motion-skeleton-sweep 1200ms var(--ease-standard) infinite;
}

.motion-scroll-reveal { transform: translateY(var(--dist-md)); clip-path: inset(0 0 100% 0); }
.motion-scroll-reveal.is-visible {
  transform: none; clip-path: inset(0);
  transition: transform var(--dur-base) var(--ease-enter), clip-path var(--dur-base) var(--ease-enter);
}

/* ---- Reduced-motion contract: instant or static, never a fade ---- */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
    scroll-behavior: auto !important;
  }
  .motion-skeleton::after { display: none; }
  .motion-scroll-reveal { transform: none; clip-path: none; }
  .motion-card-lift:hover, .motion-card-lift:focus-visible { transform: none; }
}
```

### 4.8 Performance checklist (PERF-101 to 107)
- [ ] Only `transform` (plus logged `clip-path` reveals) animated
- [ ] `will-change` applied only during animation, removed after
- [ ] No more than a few simultaneous animations
- [ ] Verified on low-end hardware, no dropped frames
- [ ] Input remains responsive mid-animation
- [ ] Reduced-motion fallback exists for every move

---

## 5. Testing and acceptance

### 5.1 Testing (TEST-001 to 025, grouped)
```json
{
  "testing": {
    "functional": ["TEST-001 all Section 3.3 features for both roles", "TEST-007 teams", "TEST-008 search", "TEST-014 notifications", "TEST-015 tournaments", "TEST-017 edge cases"],
    "auth_security": ["TEST-002 auth flows", "TEST-003 device management", "TEST-004 activity privacy at UI and data level", "TEST-016 session revoke, token expiry, RBAC"],
    "marketplace": ["TEST-005 listing lifecycle and tags", "TEST-006 rating gating"],
    "theme": ["TEST-009 Crimson/Midnight toggle and density persist", "TEST-018 theme applied consistently, no off-palette colours", "TEST-019 no gradient, glow, glass or fade", "TEST-020 contrast and readability in both themes"],
    "motion": ["TEST-010 categories and reduced-motion", "TEST-011 prohibited effects absent (visual regression)", "TEST-021 motion distinct per component type", "TEST-022 low-end/high-end performance", "TEST-023 reduced-motion per move"],
    "responsive": ["TEST-012 breakpoints and navbar stability", "TEST-013 404 and no broken links", "TEST-024 full device matrix, both orientations", "TEST-025 no overflow, clipping or tiny targets"]
  }
}
```

### 5.2 Acceptance criteria
The build is accepted when:
1. Every feature in Section 3.3 works for the right role (AC-001 to AC-011, AC-016, AC-017).
2. Crimson is the default theme, Midnight is available via a working toggle, both match the supplied design system exactly, and density options persist (replaces AC-012 and AC-019).
3. No fade, frosted glass, glow, gradient, neon, or off-palette colour appears anywhere, and the navbar never sticks (AC-013).
4. The motion system in Section 4 is implemented with reduced-motion behaviour for every move, and performs on low-end and high-end devices (AC-014, AC-020).
5. The site is responsive across the full device matrix in both orientations with no broken links (AC-015, AC-021).
6. All tests in Section 5.1 pass (AC-018).

---

## 6. Prompt for an AI coding agent

Copy this block as the instruction when handing the project to an agent.

```json
{
  "role": "Senior full-stack engineer and design-system implementer",
  "task": "Build the Esports Tournament & Community Platform exactly as specified in this file.",
  "inputs": {
    "designSystem": "DualSpace Crimson + Midnight design system (must be supplied; never guess its values)",
    "specification": "Sections 2 to 5 of this file"
  },
  "order_of_work": [
    "1. Confirm the DualSpace token values exist. If any are missing, stop and ask.",
    "2. Create the token layer (Section 1.2) and the data-theme switch with no flash on load.",
    "3. Build the shell: navbar (stable on scroll and resize), theme toggle, density setting, custom 404.",
    "4. Build authentication, email verification, password reset, device management and session revocation.",
    "5. Build tournaments, teams/groups, profile, leaderboard, social links, About Us.",
    "6. Build the marketplace (upload, detail, contact exposure, sold/delete, Good Deal and Hot logic, ratings).",
    "7. Build rank-boosting packages and booking, notifications, universal search, activity history with privacy.",
    "8. Implement the motion system (Section 4) with reduced-motion fallbacks.",
    "9. Run the tests in Section 5 and fix failures."
  ],
  "hardRules": [
    "Use only DualSpace tokens. No hard-coded colours, fonts, radii, spacing or shadows.",
    "No fade, no opacity reveal, no frosted glass, no glow, no gradients, no neon, no cyberpunk styling.",
    "Navbar must never stick, jitter or break.",
    "No broken links; unknown routes show the custom 404.",
    "Profile pictures come from the preset set only.",
    "Animate transform (and logged clip-path reveals) only. Every animation has a reduced-motion fallback that is instant or static.",
    "Enforce authorization on the server, including activity-history privacy and rating eligibility.",
    "Do not invent behaviour for items in Section 7. Ask or implement the safest minimal option and flag it."
  ],
  "deliverables": ["working application", "motion-tokens.json", "motion.css", "theme token file", "test results mapped to TEST ids", "short README"]
}
```

---

## 7. Open items

| ID | Item | Needed from you |
|---|---|---|
| **NEW** | DualSpace design system values | Hex codes, fonts, radii, spacing scale, shadows, density multipliers (Section 1.2) |
| **NEW** | Is Crimson light or dark? | Decides how the removed Light/Dark/AMOLED modes are covered (Section 1.4) |
| **NEW** | Success / error / badge colours | Does the design system define them? ("Good Deal" and "Hot" need to be distinguishable without new colours) |
| TBD-01 | Meaning of "2 admins" and exact admin screens | One role, or two admin accounts, or two tiers? |
| TBD-02 | Payments | In-platform payments, or contact-only as described? |
| TBD-03 | Who provides rank-boosting packages | Admin, special seller role, or external? |
| TBD-04 | What is blocked before email verification | Define the exact restriction |
| TBD-05 | Accessibility standard | e.g. WCAG 2.2 AA |
| TBD-06 | Superseded | The old emerald/teal palette no longer applies |

*End of file.*
