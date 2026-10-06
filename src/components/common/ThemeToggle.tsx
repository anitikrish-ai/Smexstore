import React from 'react';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  compact?: boolean;
}

/**
 * Crimson / Midnight switch.
 * The reveal expands from the center of this control. State is shown by label and knob position,
 * not by color alone.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({ compact = false }) => {
  const { theme, toggleTheme } = useTheme();
  const isMidnight = theme === 'midnight';

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isMidnight}
      onClick={handleClick}
      className={`theme-switch${compact ? ' is-compact' : ''}`}
      aria-label={`Midnight theme. Currently ${isMidnight ? 'on' : 'off'}. Switch to ${isMidnight ? 'Crimson' : 'Midnight'}`}
      title={`Switch to ${isMidnight ? 'Crimson' : 'Midnight'} theme`}
    >
      <span className="theme-switch-track" aria-hidden="true">
        <span className="theme-switch-knob" />
      </span>
      <span className="theme-switch-label">{isMidnight ? 'Midnight' : 'Crimson'}</span>
    </button>
  );
};
