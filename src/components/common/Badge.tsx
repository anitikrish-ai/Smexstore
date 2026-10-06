import React from 'react';

export type BadgeVariant =
  'good_deal' | 'hot' | 'current' | 'future' | 'past' | 'open' | 'closed' | 'default';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Editorial Badge Component (UI-015)
 * Differentiates 'Good Deal' vs 'Hot' strictly within DualSpace tokens
 * using distinct border weights, fill intensities, and uppercase typographical markers.
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  style = {},
}) => {
  let badgeStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    borderRadius: 'var(--radius-sm)',
    border: 'var(--border-width) solid var(--color-border)',
    backgroundColor: 'var(--color-surface-alt)',
    color: 'var(--color-text)',
    whiteSpace: 'nowrap',
    ...style,
  };

  switch (variant) {
    case 'good_deal':
      // Emphasized outline with border-width 2px
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-accent)',
        color: 'var(--color-accent)',
        borderWidth: '2px',
        fontWeight: 800,
      };
      break;

    case 'hot':
      // Solid accent fill with inverted text
      badgeStyle = {
        ...badgeStyle,
        backgroundColor: 'var(--color-accent)',
        borderColor: 'var(--color-accent)',
        color: 'var(--color-accent-text)',
        fontWeight: 800,
      };
      break;

    case 'current':
    case 'open':
      badgeStyle = {
        ...badgeStyle,
        borderColor: 'var(--color-success)',
        color: 'var(--color-text)',
      };
      break;

    case 'past':
    case 'closed':
      badgeStyle = {
        ...badgeStyle,
        color: 'var(--color-text-muted)',
        borderColor: 'var(--color-border)',
      };
      break;

    case 'future':
      badgeStyle = {
        ...badgeStyle,
        borderColor: 'var(--color-border)',
        backgroundColor: 'var(--color-surface)',
      };
      break;
  }

  return <span style={badgeStyle}>{children}</span>;
};
