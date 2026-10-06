import { useEffect, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseCountUpOptions {
  end: number;
  start?: number;
  durationMs?: number;
}

/**
 * Numeric count-up animation without opacity fades.
 * Displays final value instantly under prefers-reduced-motion.
 */
export function useCountUp({
  end,
  start = 0,
  durationMs = 450,
}: UseCountUpOptions): number {
  const prefersReducedMotion = useReducedMotion();
  const [currentValue, setCurrentValue] = useState<number>(
    prefersReducedMotion ? end : start,
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setCurrentValue(end);
      return;
    }

    let startTime: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / durationMs, 1);

      // Signature smooth easing curve (cubic-bezier(0.22, 1, 0.36, 1) approx)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const nextVal = Math.round(start + (end - start) * easeOut);

      setCurrentValue(nextVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrentValue(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [end, start, durationMs, prefersReducedMotion]);

  return currentValue;
}
