import React from 'react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
}

/** Success banner. Polite live region, text label, short enter animation. */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  return (
    <div className="notice notice-success motion-message" role="status">
      <span className="notice-label">Success</span>
      <span style={{ flex: 1, minWidth: 0 }}>{message}</span>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="btn btn-outline"
          style={{ minHeight: 28, padding: '0 var(--space-sm)', fontSize: '0.8rem' }}
          aria-label="Dismiss message"
        >
          Dismiss
        </button>
      )}
    </div>
  );
};
