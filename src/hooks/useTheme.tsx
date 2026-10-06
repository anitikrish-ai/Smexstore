import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { flushSync } from 'react-dom';
import { ThemeMode, DensityPreference } from '../types/user';
import { safeStorage } from '../utils/storage';
import { useReducedMotion } from './useReducedMotion';
import { MOTION_DURATIONS, MOTION_EASINGS } from '../motion/tokens';
import { STORAGE_KEYS } from '../config/site';

export interface ThemeOrigin {
  x: number;
  y: number;
}

interface ThemeContextType {
  theme: ThemeMode;
  density: DensityPreference;
  /** Pass the toggle's screen position so the reveal expands from it. */
  toggleTheme: (origin?: ThemeOrigin) => void;
  setTheme: (theme: ThemeMode) => void;
  setDensity: (density: DensityPreference) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const META_THEME_COLORS: Record<ThemeMode, string> = {
  crimson: '#1a080a',
  midnight: '#090c15',
};

type ViewTransitionLike = {
  ready: Promise<void>;
  finished: Promise<void>;
};
type DocumentWithVT = Document & {
  startViewTransition?: (cb: () => void) => ViewTransitionLike;
};

function applyThemeToDocument(theme: ThemeMode): void {
  document.documentElement.setAttribute('data-theme', theme);
  const meta = document.getElementById('meta-theme-color');
  if (meta) meta.setAttribute('content', META_THEME_COLORS[theme]);
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const prefersReducedMotion = useReducedMotion();

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = safeStorage.getItem(STORAGE_KEYS.theme);
    return saved === 'midnight' || saved === 'crimson' ? saved : 'crimson';
  });

  const [density, setDensityState] = useState<DensityPreference>(() => {
    const saved = safeStorage.getItem(STORAGE_KEYS.density);
    if (saved === 'compact' || saved === 'comfortable' || saved === 'spacious')
      return saved;
    return 'comfortable';
  });

  // Latest theme for rapid repeated toggles, so a second click always flips from the real current value.
  const themeRef = useRef<ThemeMode>(theme);
  const fallbackTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    themeRef.current = theme;
    applyThemeToDocument(theme);
    safeStorage.setItem(STORAGE_KEYS.theme, theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-density', density);
    safeStorage.setItem(STORAGE_KEYS.density, density);
  }, [density]);

  const setTheme = useCallback((newTheme: ThemeMode) => {
    themeRef.current = newTheme;
    setThemeState(newTheme);
  }, []);

  const setDensity = useCallback((newDensity: DensityPreference) => {
    setDensityState(newDensity);
  }, []);

  const toggleTheme = useCallback(
    (origin?: ThemeOrigin) => {
      const target: ThemeMode = themeRef.current === 'crimson' ? 'midnight' : 'crimson';
      themeRef.current = target;

      const commit = () => {
        // Write the attribute synchronously so the "after" snapshot is already themed.
        applyThemeToDocument(target);
        flushSync(() => setThemeState(target));
      };

      const doc = document as DocumentWithVT;

      if (prefersReducedMotion) {
        commit();
        return;
      }

      if (typeof doc.startViewTransition === 'function') {
        const x = origin?.x ?? window.innerWidth / 2;
        const y = origin?.y ?? 0;
        const radius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y),
        );

        const transition = doc.startViewTransition(commit);
        transition.ready
          .then(() => {
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${radius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: MOTION_DURATIONS.slow,
                easing: MOTION_EASINGS.signature,
                pseudoElement: '::view-transition-new(root)',
              },
            );
          })
          .catch(() => {
            // Transition skipped by a newer toggle. The commit still ran, so state stays correct.
          });
        return;
      }

      // Fallback: brief colour cross-fade through a class, then clean up.
      const root = document.documentElement;
      root.classList.add('theme-switching');
      commit();
      window.clearTimeout(fallbackTimer.current);
      fallbackTimer.current = window.setTimeout(
        () => root.classList.remove('theme-switching'),
        MOTION_DURATIONS.base + 40,
      );
    },
    [prefersReducedMotion],
  );

  useEffect(() => () => window.clearTimeout(fallbackTimer.current), []);

  return (
    <ThemeContext.Provider value={{ theme, density, toggleTheme, setTheme, setDensity }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
