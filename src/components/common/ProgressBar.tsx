import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 to 1
  label?: string;
}

/**
 * Progress Fill Indicator (FR-111, ANIM-102, ANIM-408)
 * Strictly animates transform: scaleX from transform-origin left.
 * Never animates layout width.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const percentage = Math.round(clampedProgress * 100);

  return (
    <div style={{ width: '100%', marginBottom: 'var(--space-sm)' }}>
      {label && (
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: 'var(--space-xs)', fontSize: '0.85rem' }}
        >
          <span className="text-muted">{label}</span>
          <span className="tabular-nums" style={{ fontWeight: 600 }}>
            {percentage}%
          </span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: '6px',
          backgroundColor: 'var(--color-surface-alt)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          border: 'var(--border-width) solid var(--color-border)',
        }}
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="motion-progress"
          style={
            {
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--color-accent)',
              '--progress': clampedProgress,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
};
