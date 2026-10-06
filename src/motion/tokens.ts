/**
 * Motion Tokens & Constants
 * Mirrors the custom properties in src/styles/motion.css. Keep both in sync.
 */

export const MOTION_DURATIONS = {
  instant: 100, // ms
  fast: 200, // ms
  base: 280, // ms
  slow: 450, // ms
} as const;

export const MOTION_EASINGS = {
  standard: 'cubic-bezier(0.2, 0, 0, 1)',
  enter: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  exit: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
  signature: 'cubic-bezier(0.22, 1, 0.36, 1)',
} as const;

export const MOTION_DISTANCES = {
  xs: 4, // px
  sm: 8, // px
  md: 16, // px
  lg: 24, // px
} as const;

export const MOTION_STAGGER = {
  step: 40, // ms
  maxItems: 8, // cap at 8 items
} as const;
