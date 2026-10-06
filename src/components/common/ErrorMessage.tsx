import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

/**
 * Error banner. Announced to assistive tech (role="alert"), labelled with text so the state is not
 * carried by color alone, and enters with a short horizontal nudge.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="notice notice-error motion-error-shake" role="alert">
      <span className="notice-label">Error</span>
      <span style={{ flex: 1, minWidth: 0 }}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="btn btn-outline"
          style={{ minHeight: 28, padding: '0 var(--space-sm)', fontSize: '0.8rem' }}
          aria-label="Dismiss error"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};
