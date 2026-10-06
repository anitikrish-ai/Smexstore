import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';
import { MOTION_DURATIONS } from '../motion/tokens';

export type PresenceState = 'open' | 'closed';

/**
 * Keeps an element mounted long enough to play its exit animation.
 * `mounted` controls rendering; `state` goes on the element as data-state.
 * Exit length matches --dur-fast. Under reduced motion the element unmounts immediately.
 */
export function usePresence(open: boolean, exitMs: number = MOTION_DURATIONS.fast) {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (reduced) {
      setMounted(false);
      return;
    }
    const id = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(id);
  }, [open, reduced, exitMs]);

  const state: PresenceState = open ? 'open' : 'closed';
  return { mounted: open || mounted, state };
}
