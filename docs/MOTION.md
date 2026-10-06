# Smexstore Motion System

Source of truth: `src/styles/motion.css` (CSS tokens and keyframes) and `src/motion/tokens.ts` (same values for JS). `motion-tokens.json` mirrors both.

## Principles
- Short, calm, purposeful. Motion confirms an action, orients the user, or keeps context. Otherwise it is removed.
- Animate `transform` and `opacity`. `clip-path` is used only for the mobile menu reveal and the theme reveal.
- Never animate layout properties (`width`, `height`, `top`, `left`, `margin`).
- One easing personality: a smooth settle with no overshoot.
- Exits are faster than entrances.
- No cursor-follow effects, no parallax, no scroll hijacking. Native scrolling with `scroll-behavior: smooth`.
- Every animation has a reduced-motion rule in the same stylesheet.

## Tokens
| Token | Value | Use |
| --- | --- | --- |
| `--dur-instant` | 100ms | press and hover state changes |
| `--dur-fast` | 200ms | exits, card lift, theme knob |
| `--dur-base` | 280ms | entrances: route, dialog, menu, messages |
| `--dur-slow` | 450ms | theme reveal |
| `--ease-standard` | cubic-bezier(0.2, 0, 0, 1) | state changes |
| `--ease-enter` | cubic-bezier(0.05, 0.7, 0.1, 1) | things arriving |
| `--ease-exit` | cubic-bezier(0.3, 0, 0.8, 0.15) | things leaving |
| `--ease-signature` | cubic-bezier(0.22, 1, 0.36, 1) | route, dialog, sheet, tab indicator, theme |

## Signature moves
| Move | Where | Properties | Timing |
| --- | --- | --- | --- |
| Route enter | `<main>` in `SiteShell`, keyed by pathname | opacity, translateY 8px | base, enter |
| Press | every button and `.btn` | scale 0.97 on pointer down | instant |
| Card lift | `.motion-card-lift` | translateY -3px, border color, shadow | fast, standard |
| Dialog | `Dialog`, `ConfirmDialog`, welcome | opacity, scale 0.97 to 1, translateY 16px | enter base signature, exit fast exit |
| Mobile sheet | navbar menu | clip-path reveal from header edge, opacity | enter base signature, exit fast exit |
| Menu panel | account menu | opacity, scale, anchored to trigger (`--origin`) | enter base, exit fast |
| Tab indicator | `Tabs` | translateX plus scaleX (no width or left) | base, signature |
| Theme reveal | `ThemeToggle` via `useTheme` | circular clip-path from the toggle, View Transitions API | slow, signature |
| Skeleton | loading states | flat band translating | 1200ms loop |

## Theme reveal
- `toggleTheme(origin)` runs `document.startViewTransition`, commits the theme attribute inside the callback, then animates `::view-transition-new(root)` with an expanding circle.
- Unsupported browsers fall back to a 280ms color cross-fade via the `theme-switching` class.
- Reduced motion: instant swap.
- The pre-paint script in `index.html` sets the saved theme and background before CSS loads, so there is no flash.
- Rapid repeated toggles read the latest theme from a ref, so state never desyncs.

## Interruptibility and presence
- `usePresence(open)` keeps an element mounted for the exit duration and exposes `data-state="open|closed"`. Closing and reopening mid-exit simply re-enters.
- Closed layers get `pointer-events: none`, so nothing blocks clicks while leaving.

## Reduced motion
`@media (prefers-reduced-motion: reduce)` removes travel, scale and reveals, sets near-zero durations, disables the skeleton sweep, skips View Transitions, turns off carousel autoplay and restores `scroll-behavior: auto`. `prefers-reduced-transparency` removes the navbar blur. `prefers-contrast: more` strengthens borders and muted text.

## Adding motion
1. Pick the role (feedback, micro, reveal, scene) and take the duration from the table.
2. Use `transform` and `opacity`.
3. Write the reduced-motion rule in `motion.css` before shipping.
4. If it communicates nothing, do not add it.
