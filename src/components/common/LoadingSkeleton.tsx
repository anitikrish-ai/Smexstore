import React from 'react';

interface LoadingSkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Loading skeleton: a flat band sweeping with transform. Static under reduced motion.
 */
export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  width = '100%',
  height = '1.25rem',
  borderRadius = 'var(--radius-sm)',
  className = '',
  style = {},
}) => {
  return (
    <div
      className={`motion-skeleton ${className}`}
      style={{
        width,
        maxWidth: '100%',
        height,
        borderRadius,
        ...style,
      }}
      aria-hidden="true"
    />
  );
};
