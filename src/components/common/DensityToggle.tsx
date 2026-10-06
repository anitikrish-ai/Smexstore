import React from 'react';
import { useTheme } from '../../hooks/useTheme';
import { DensityPreference } from '../../types/user';

/**
 * Interface Density Toggle (FR-093, Section 1.2)
 * Switches between compact, comfortable, and spacious density multipliers.
 */
export const DensityToggle: React.FC = () => {
  const { density, setDensity } = useTheme();

  const options: Array<{ id: DensityPreference; label: string }> = [
    { id: 'compact', label: 'Compact' },
    { id: 'comfortable', label: 'Comfortable' },
    { id: 'spacious', label: 'Spacious' },
  ];

  return (
    <div
      role="radiogroup"
      aria-label="Interface Density"
      className="flex gap-xs"
      style={{
        padding: '2px',
        backgroundColor: 'var(--color-surface)',
        border: 'var(--border-width) solid var(--color-border)',
        borderRadius: 'var(--radius-sm)',
        display: 'inline-flex',
      }}
    >
      {options.map((opt) => {
        const isSelected = density === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => setDensity(opt.id)}
            className="ui-interactive motion-press"
            style={{
              padding: '4px 12px',
              fontSize: '0.85rem',
              fontWeight: 600,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
              color: isSelected ? 'var(--color-accent-text)' : 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
