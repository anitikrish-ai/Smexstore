import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

/**
 * Standard Empty State Component (FR-113)
 * Communicates absence of real records cleanly without mock or dummy filler.
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div
      className="card flex flex-col items-center justify-center text-center"
      style={{
        padding: 'calc(var(--space-xl) * 1.5) var(--space-md)',
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      role="status"
      aria-live="polite"
    >
      {icon && <div style={{ marginBottom: 'var(--space-md)' }}>{icon}</div>}
      <h2
        style={{
          marginBottom: 'var(--space-xs)',
          color: 'var(--color-text)',
          fontSize: '1.1rem',
        }}
      >
        {title}
      </h2>
      <p
        className="text-muted"
        style={{
          maxWidth: '460px',
          marginBottom: actionText ? 'var(--space-md)' : 0,
        }}
      >
        {description}
      </p>
      {actionText && onAction && (
        <button type="button" className="btn btn-primary motion-press" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};
